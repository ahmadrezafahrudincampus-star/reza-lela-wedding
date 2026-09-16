import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { isSupabaseConfigured, getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Tidak memiliki otorisasi." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false, events: [] });
  }

  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: "Gagal mengambil data acara: " + error.message }, { status: 500 });
    }

    return NextResponse.json({ configured: true, events: data || [] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

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
    const {
      title,
      date,
      start_time,
      end_time,
      venue,
      address,
      google_maps_url,
      latitude,
      longitude,
      sort_order = 0,
      is_active = true,
    } = body;

    if (!title || !date || !start_time || !venue) {
      return NextResponse.json(
        { error: "Nama acara, tanggal, jam mulai, dan tempat wajib diisi." },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          title: String(title).trim(),
          date,
          start_time,
          end_time: end_time || null,
          venue: String(venue).trim(),
          address: address ? String(address).trim() : null,
          google_maps_url: google_maps_url ? String(google_maps_url).trim() : null,
          latitude: latitude ? Number(latitude) : null,
          longitude: longitude ? Number(longitude) : null,
          sort_order: Number(sort_order) || 0,
          is_active: Boolean(is_active),
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Gagal menyimpan acara: " + error.message }, { status: 500 });
    }

    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Acara berhasil ditambahkan.",
      event: data,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

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
    const {
      id,
      title,
      date,
      start_time,
      end_time,
      venue,
      address,
      google_maps_url,
      latitude,
      longitude,
      sort_order,
      is_active,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "ID acara wajib disertakan." }, { status: 400 });
    }

    if (!title || !date || !start_time || !venue) {
      return NextResponse.json(
        { error: "Nama acara, tanggal, jam mulai, dan tempat wajib diisi." },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("events")
      .update({
        title: String(title).trim(),
        date,
        start_time,
        end_time: end_time || null,
        venue: String(venue).trim(),
        address: address ? String(address).trim() : null,
        google_maps_url: google_maps_url ? String(google_maps_url).trim() : null,
        latitude: latitude !== undefined && latitude !== null ? Number(latitude) : null,
        longitude: longitude !== undefined && longitude !== null ? Number(longitude) : null,
        sort_order: Number(sort_order) || 0,
        is_active: Boolean(is_active),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Gagal memperbarui acara: " + error.message }, { status: 500 });
    }

    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Data acara berhasil diperbarui.",
      event: data,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

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
      return NextResponse.json({ error: "ID acara wajib disertakan." }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Gagal menghapus acara: " + error.message }, { status: 500 });
    }

    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Acara berhasil dihapus.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
