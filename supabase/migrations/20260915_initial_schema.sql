-- ============================================================
-- MASTER DATABASE MIGRATION: DIGITAL WEDDING INVITATION & CMS
-- Project: Reza & Lela Wedding
-- Database: PostgreSQL / Supabase
-- ============================================================

-- 0. Extensions
create extension if not exists "pgcrypto";

-- 1. Helper function for updated_at timestamp
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- TABLE 1: admin_profiles
-- ============================================================
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger updated_at
drop trigger if exists tr_admin_profiles_updated_at on public.admin_profiles;
create trigger tr_admin_profiles_updated_at
  before update on public.admin_profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- TABLE 2: guests
-- ============================================================
create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  phone text null,
  invitation_token text unique null,
  opened_at timestamptz null,
  last_opened_at timestamptz null,
  open_count integer not null default 0,
  rsvp_status text null check (rsvp_status in ('pending', 'hadir', 'tidak_hadir', 'ragu')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_guests_slug on public.guests(slug);
create index if not exists idx_guests_opened_at on public.guests(opened_at);
create index if not exists idx_guests_created_at on public.guests(created_at desc);

drop trigger if exists tr_guests_updated_at on public.guests;
create trigger tr_guests_updated_at
  before update on public.guests
  for each row execute function public.set_updated_at();

-- ============================================================
-- TABLE 3: events
-- ============================================================
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  start_time time not null,
  end_time time null,
  timezone text default 'Asia/Jakarta',
  venue text not null,
  address text null,
  google_maps_url text null,
  latitude numeric null,
  longitude numeric null,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_events_sort_order on public.events(sort_order asc);
create index if not exists idx_events_is_active on public.events(is_active);

drop trigger if exists tr_events_updated_at on public.events;
create trigger tr_events_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ============================================================
-- TABLE 4: bank_accounts
-- ============================================================
create table if not exists public.bank_accounts (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('bank', 'ewallet')),
  bank_name text not null,
  account_number text not null,
  account_holder text not null,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_bank_accounts_sort on public.bank_accounts(sort_order asc);
create index if not exists idx_bank_accounts_active on public.bank_accounts(is_active);

drop trigger if exists tr_bank_accounts_updated_at on public.bank_accounts;
create trigger tr_bank_accounts_updated_at
  before update on public.bank_accounts
  for each row execute function public.set_updated_at();

-- ============================================================
-- TABLE 5: admin_messages (Ucapan & Doa Admin)
-- ============================================================
create table if not exists public.admin_messages (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_admin_messages_active on public.admin_messages(is_active);
create index if not exists idx_admin_messages_sort on public.admin_messages(sort_order asc);

drop trigger if exists tr_admin_messages_updated_at on public.admin_messages;
create trigger tr_admin_messages_updated_at
  before update on public.admin_messages
  for each row execute function public.set_updated_at();

-- ============================================================
-- TABLE 6: guestbook_entries
-- ============================================================
create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid null references public.guests(id) on delete set null,
  guest_name text not null,
  message text not null,
  attendance_status text null,
  is_visible boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_guestbook_visible on public.guestbook_entries(is_visible, created_at desc);
create index if not exists idx_guestbook_created_at on public.guestbook_entries(created_at desc);

drop trigger if exists tr_guestbook_entries_updated_at on public.guestbook_entries;
create trigger tr_guestbook_entries_updated_at
  before update on public.guestbook_entries
  for each row execute function public.set_updated_at();

-- ============================================================
-- TABLE 7: rsvp_submissions
-- ============================================================
create table if not exists public.rsvp_submissions (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid null references public.guests(id) on delete set null,
  guest_name text not null,
  attendance_status text not null check (attendance_status in ('hadir', 'tidak_hadir', 'ragu')),
  guest_count integer default 1,
  message text null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_rsvp_created_at on public.rsvp_submissions(created_at desc);
create index if not exists idx_rsvp_status on public.rsvp_submissions(attendance_status);

drop trigger if exists tr_rsvp_submissions_updated_at on public.rsvp_submissions;
create trigger tr_rsvp_submissions_updated_at
  before update on public.rsvp_submissions
  for each row execute function public.set_updated_at();

-- ============================================================
-- FUNCTION / RPC: get_guest_by_slug
-- Secure public guest lookup: only exposes id, name, slug, rsvp_status (NEVER phone or token)
-- ============================================================
create or replace function public.get_guest_by_slug(p_slug text)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_guest record;
begin
  select id, name, slug, rsvp_status
  into v_guest
  from public.guests
  where slug = p_slug;

  if not found then
    return jsonb_build_object('found', false);
  end if;

  return jsonb_build_object(
    'found', true,
    'id', v_guest.id,
    'name', v_guest.name,
    'slug', v_guest.slug,
    'rsvp_status', v_guest.rsvp_status
  );
end;
$$;

-- ============================================================
-- FUNCTION / RPC: track_guest_open
-- Atomically tracks opening of guest link without exposing full guests table
-- ============================================================
create or replace function public.track_guest_open(p_slug text)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_guest record;
begin
  select id, name, slug, opened_at, open_count
  into v_guest
  from public.guests
  where slug = p_slug;

  if not found then
    return jsonb_build_object('success', false, 'error', 'Tamu tidak ditemukan');
  end if;

  update public.guests
  set
    opened_at = coalesce(opened_at, now()),
    last_opened_at = now(),
    open_count = open_count + 1
  where id = v_guest.id;

  return jsonb_build_object(
    'success', true,
    'id', v_guest.id,
    'name', v_guest.name,
    'slug', v_guest.slug,
    'first_open', v_guest.opened_at is null
  );
end;
$$;

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

alter table public.admin_profiles enable row level security;
alter table public.guests enable row level security;
alter table public.events enable row level security;
alter table public.bank_accounts enable row level security;
alter table public.admin_messages enable row level security;
alter table public.guestbook_entries enable row level security;
alter table public.rsvp_submissions enable row level security;

-- Helper function to check if current user is an admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_profiles
    where id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- 1. admin_profiles policies
drop policy if exists "Admin profiles are viewable by owner" on public.admin_profiles;
create policy "Admin profiles are viewable by owner"
  on public.admin_profiles for select
  using (auth.uid() = id);

drop policy if exists "Admin profiles are updatable by owner" on public.admin_profiles;
create policy "Admin profiles are updatable by owner"
  on public.admin_profiles for update
  using (auth.uid() = id);

-- 2. guests policies
-- STRICT SECURITY: Public CANNOT query guests table directly (protects phone & tokens)
-- Public access is strictly mediated through get_guest_by_slug() and track_guest_open()
drop policy if exists "Public can read guest by slug" on public.guests;

-- Admin has full access to guests
drop policy if exists "Admin full access to guests" on public.guests;
create policy "Admin full access to guests"
  on public.guests for all
  using (public.is_admin() or auth.role() = 'authenticated');

-- 3. events policies
-- Public can read active events
drop policy if exists "Public can view active events" on public.events;
create policy "Public can view active events"
  on public.events for select
  using (is_active = true);

-- Admin has full access to events
drop policy if exists "Admin full access to events" on public.events;
create policy "Admin full access to events"
  on public.events for all
  using (public.is_admin() or auth.role() = 'authenticated');

-- 4. bank_accounts policies
-- Public can view active bank accounts
drop policy if exists "Public can view active bank accounts" on public.bank_accounts;
create policy "Public can view active bank accounts"
  on public.bank_accounts for select
  using (is_active = true);

-- Admin has full access to bank accounts
drop policy if exists "Admin full access to bank accounts" on public.bank_accounts;
create policy "Admin full access to bank accounts"
  on public.bank_accounts for all
  using (public.is_admin() or auth.role() = 'authenticated');

-- 5. admin_messages policies
-- Public can view active admin messages
drop policy if exists "Public can view active admin messages" on public.admin_messages;
create policy "Public can view active admin messages"
  on public.admin_messages for select
  using (is_active = true);

-- Admin has full access to admin messages
drop policy if exists "Admin full access to admin messages" on public.admin_messages;
create policy "Admin full access to admin messages"
  on public.admin_messages for all
  using (public.is_admin() or auth.role() = 'authenticated');

-- 6. guestbook_entries policies
-- Public can view visible guestbook entries
drop policy if exists "Public can view visible guestbook entries" on public.guestbook_entries;
create policy "Public can view visible guestbook entries"
  on public.guestbook_entries for select
  using (is_visible = true);

-- Public can submit new guestbook entry
drop policy if exists "Public can insert guestbook entry" on public.guestbook_entries;
create policy "Public can insert guestbook entry"
  on public.guestbook_entries for insert
  with check (true);

-- Admin has full access to guestbook entries (moderate, hide, delete)
drop policy if exists "Admin full access to guestbook" on public.guestbook_entries;
create policy "Admin full access to guestbook"
  on public.guestbook_entries for all
  using (public.is_admin() or auth.role() = 'authenticated');

-- 7. rsvp_submissions policies
-- Public can insert RSVP
drop policy if exists "Public can submit RSVP" on public.rsvp_submissions;
create policy "Public can submit RSVP"
  on public.rsvp_submissions for insert
  with check (true);

-- Admin has full access to RSVP
drop policy if exists "Admin full access to rsvp" on public.rsvp_submissions;
create policy "Admin full access to rsvp"
  on public.rsvp_submissions for all
  using (public.is_admin() or auth.role() = 'authenticated');

-- ============================================================
-- INITIAL SEED DATA
-- Pre-fills events, bank accounts, and initial doa matching weddingData
-- ============================================================

-- Seed events
insert into public.events (title, date, start_time, end_time, venue, address, google_maps_url, sort_order, is_active)
values
  (
    'Akad Nikah',
    '2026-09-26',
    '09:00:00',
    null,
    'Dikediaman Mempelai Wanita',
    'Kp. Rumpak Sinang RT. 03/01 Kel. Pakulonan Barat, Kec. Kelapa Dua, Tangerang',
    'https://www.google.com/maps/search/?api=1&query=Kp.+Rumpak+Sinang+RT.+03%2F01+Kel.+Pakulonan+Barat%2C+Kec.+Kelapa+Dua%2C+Tangerang',
    1,
    true
  ),
  (
    'Resepsi Pernikahan',
    '2026-09-26',
    '10:00:00',
    null,
    'Kp. Rumpak Sinang RT. 03/01 Kel. Pakulonan Barat Kec. Kelapa Dua, Tangerang',
    'Kp. Rumpak Sinang RT. 03/01 Kel. Pakulonan Barat, Kec. Kelapa Dua, Tangerang',
    'https://www.google.com/maps/search/?api=1&query=Kp.+Rumpak+Sinang+RT.+03%2F01+Kel.+Pakulonan+Barat%2C+Kec.+Kelapa+Dua%2C+Tangerang',
    2,
    true
  )
on conflict do nothing;

-- Seed bank accounts
insert into public.bank_accounts (type, bank_name, account_number, account_holder, sort_order, is_active)
values
  ('bank', 'MANDIRI', '03123456789', 'Ahmad Reza Fahrudin', 1, true),
  ('bank', 'BCA', '03123456789', 'Laila Nur A''immah', 2, true)
on conflict do nothing;

-- Seed admin messages / doa
insert into public.admin_messages (message, sort_order, is_active)
values
  ('Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin.', 1, true),
  ('Barakallahu laka wa baraka ''alaika wa jama''a bainakuma fi khair.', 2, true),
  ('Selamat menempuh hidup baru. Semoga langgeng dan bahagia selamanya.', 3, true)
on conflict do nothing;
