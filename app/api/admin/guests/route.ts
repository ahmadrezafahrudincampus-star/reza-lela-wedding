import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { isSupabaseConfigured, getServiceSupabase, createSlug, normalizePhoneNumber } from "@/lib/supabase";

// Helper: Ensure slug is unique by appending number if already exists
async function getUniqueSlug(supabase: ReturnType<typeof getServiceSupabase>, baseSlug: string, excludeId?: string): Promise<string> {
  let candidate = baseSlug;
  let counter = 1;

  while (true) {
    let query = supabase.from("guests").select("id").eq("slug", candidate);
    if (excludeId) {
      query = query.neq("id", excludeId);
    }
    const { data } = await query.maybeSingle();
    if (!data) {
      return candidate;
    }
    counter++;
    candidate = `${baseSlug}-${counter}`;
  }
}

// GET: Fetch guests
export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Tidak memiliki otorisasi." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      guests: [],
      message: "Supabase belum terhubung di .env.local",
    });
  }

  try {
    const supabase = getServiceSupabase();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q")?.trim();

    let query = supabase
      .from("guests")
      .select("*")
      .order("created_at", { ascending: false });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: "Gagal mengambil data tamu: " + error.message }, { status: 500 });
    }

    return NextResponse.json({ configured: true, guests: data || [] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST: Add new guest
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Tidak memiliki otorisasi." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase belum terhubung di .env.local" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { name, phone } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Nama tamu wajib diisi." }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanPhone = normalizePhoneNumber(phone);
    const baseSlug = createSlug(cleanName);

    const supabase = getServiceSupabase();
    const uniqueSlug = await getUniqueSlug(supabase, baseSlug);

    const { data, error } = await supabase
      .from("guests")
      .insert([
        {
          name: cleanName,
          slug: uniqueSlug,
          phone: cleanPhone,
          open_count: 0,
          rsvp_status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Gagal menambahkan tamu: " + error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Nama tamu berhasil ditambahkan.",
      guest: data,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PUT: Edit guest
export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Tidak memiliki otorisasi." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase belum terhubung di .env.local" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { id, name, phone } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID tamu tidak valid." }, { status: 400 });
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Nama tamu wajib diisi." }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanPhone = normalizePhoneNumber(phone);

    const supabase = getServiceSupabase();

    // Check existing guest
    const { data: existing, error: findError } = await supabase
      .from("guests")
      .select("id, name, slug")
      .eq("id", id)
      .single();

    if (findError || !existing) {
      return NextResponse.json({ error: "Tamu tidak ditemukan." }, { status: 404 });
    }

    // Only recalculate slug if name actually changed significantly
    let slugToUse = existing.slug;
    if (existing.name.toLowerCase().trim() !== cleanName.toLowerCase().trim()) {
      const baseSlug = createSlug(cleanName);
      slugToUse = await getUniqueSlug(supabase, baseSlug, id);
    }

    const { data, error } = await supabase
      .from("guests")
      .update({
        name: cleanName,
        slug: slugToUse,
        phone: cleanPhone,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Gagal memperbarui tamu: " + error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Data tamu berhasil diperbarui.",
      guest: data,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE: Delete guest
export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Tidak memiliki otorisasi." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase belum terhubung di .env.local" }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID tamu wajib disertakan." }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    const { error } = await supabase.from("guests").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Tamu gagal dihapus: " + error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Tamu berhasil dihapus.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
