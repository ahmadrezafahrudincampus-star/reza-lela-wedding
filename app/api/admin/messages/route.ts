import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { isSupabaseConfigured, getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false, messages: [] });
  }

  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("admin_messages")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: "Gagal mengambil data ucapan: " + error.message }, { status: 500 });
    }

    return NextResponse.json({ configured: true, messages: data || [] });
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
    const { message, sort_order = 0, is_active = true } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Isi ucapan/doa wajib diisi." }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("admin_messages")
      .insert([
        {
          message: message.trim(),
          sort_order: Number(sort_order) || 0,
          is_active: Boolean(is_active),
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Gagal menyimpan ucapan: " + error.message }, { status: 500 });
    }

    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Ucapan & doa berhasil ditambahkan.",
      data,
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
    const { id, message, sort_order, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: "ID ucapan wajib disertakan." }, { status: 400 });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Isi ucapan/doa wajib diisi." }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("admin_messages")
      .update({
        message: message.trim(),
        sort_order: Number(sort_order) || 0,
        is_active: Boolean(is_active),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Gagal memperbarui ucapan: " + error.message }, { status: 500 });
    }

    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Ucapan & doa berhasil diperbarui.",
      data,
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
      return NextResponse.json({ error: "ID ucapan wajib disertakan." }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    const { error } = await supabase.from("admin_messages").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Gagal menghapus ucapan: " + error.message }, { status: 500 });
    }

    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Ucapan & doa berhasil dihapus.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
