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
    return NextResponse.json({ configured: false, entries: [] });
  }

  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("guestbook_entries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Gagal mengambil buku tamu: " + error.message }, { status: 500 });
    }

    return NextResponse.json({ configured: true, entries: data || [] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PATCH: Toggle is_visible (Sembunyikan / Tampilkan)
export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Tidak memiliki otorisasi." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase belum terhubung di .env.local" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { id, is_visible } = body;

    if (!id || typeof is_visible !== "boolean") {
      return NextResponse.json({ error: "ID dan status tampil wajib disertakan." }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("guestbook_entries")
      .update({ is_visible })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Gagal mengubah status tampil: " + error.message }, { status: 500 });
    }

    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: is_visible ? "Ucapan ditampilkan di website." : "Ucapan disembunyikan.",
      entry: data,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE: Permanent delete
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
    const { error } = await supabase.from("guestbook_entries").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Gagal menghapus ucapan: " + error.message }, { status: 500 });
    }

    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Ucapan berhasil dihapus dari buku tamu.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
