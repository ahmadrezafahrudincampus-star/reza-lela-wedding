import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false, entries: [] });
  }

  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("guestbook_entries")
      .select("id, guest_name, message, attendance_status, created_at")
      .eq("is_visible", true)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ configured: true, entries: data || [] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, message, guestId, attendanceStatus } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Nama wajib diisi." }, { status: 400 });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Pesan wajib diisi." }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanMessage = message.trim();

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        message: "Ucapan berhasil disimpan (Mode Lokal).",
        entry: {
          id: Date.now().toString(36),
          guest_name: cleanName,
          message: cleanMessage,
          is_visible: true,
          created_at: new Date().toISOString(),
        },
      });
    }

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("guestbook_entries")
      .insert([
        {
          guest_id: guestId || null,
          guest_name: cleanName,
          message: cleanMessage,
          attendance_status: attendanceStatus || null,
          is_visible: true,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Gagal menyimpan ucapan: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Ucapan berhasil disimpan.",
      entry: data,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

