import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { isSupabaseConfigured, getServiceSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Tidak memiliki otorisasi." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false, rsvps: [] });
  }

  try {
    const supabase = getServiceSupabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query = supabase
      .from("rsvp_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (status && ["hadir", "tidak_hadir", "ragu"].includes(status)) {
      query = query.eq("attendance_status", status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: "Gagal mengambil data RSVP: " + error.message }, { status: 500 });
    }

    return NextResponse.json({ configured: true, rsvps: data || [] });
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
      return NextResponse.json({ error: "ID RSVP wajib disertakan." }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    const { error } = await supabase.from("rsvp_submissions").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Gagal menghapus RSVP: " + error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Data RSVP berhasil dihapus.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
