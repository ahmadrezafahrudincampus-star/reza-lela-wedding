import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, getServiceSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, attendance, guestCount = 1, message, guestId } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Nama lengkap wajib diisi." }, { status: 400 });
    }

    if (!attendance || !["hadir", "tidak_hadir", "ragu"].includes(attendance)) {
      return NextResponse.json({ error: "Pilih status kehadiran yang valid." }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanMessage = message && typeof message === "string" ? message.trim() : null;
    const numGuests = Math.max(1, parseInt(String(guestCount), 10) || 1);

    if (!isSupabaseConfigured()) {
      // Graceful fallback for local development if database not yet configured
      return NextResponse.json({
        success: true,
        message: "Konfirmasi kehadiran berhasil diterima (Mode Lokal).",
        entry: {
          id: Date.now().toString(36),
          guest_name: cleanName,
          attendance_status: attendance,
          guest_count: numGuests,
          message: cleanMessage,
          created_at: new Date().toISOString(),
        },
      });
    }

    const supabase = getServiceSupabase();

    // 1. Insert into rsvp_submissions
    const { data: rsvpData, error: rsvpError } = await supabase
      .from("rsvp_submissions")
      .insert([
        {
          guest_id: guestId || null,
          guest_name: cleanName,
          attendance_status: attendance,
          guest_count: attendance === "hadir" ? numGuests : 1,
          message: cleanMessage,
        },
      ])
      .select()
      .single();

    if (rsvpError) {
      return NextResponse.json(
        { error: "Gagal menyimpan konfirmasi kehadiran: " + rsvpError.message },
        { status: 500 }
      );
    }

    // 2. If message is present, also record to guestbook_entries
    if (cleanMessage) {
      await supabase.from("guestbook_entries").insert([
        {
          guest_id: guestId || null,
          guest_name: cleanName,
          message: cleanMessage,
          attendance_status: attendance,
          is_visible: true,
        },
      ]);
    }

    // 3. If guestId is present, update guest rsvp_status
    if (guestId) {
      await supabase
        .from("guests")
        .update({ rsvp_status: attendance })
        .eq("id", guestId);
    }

    return NextResponse.json({
      success: true,
      message: "Konfirmasi kehadiran Anda telah kami terima.",
      rsvp: rsvpData,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
