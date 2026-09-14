import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { isSupabaseConfigured, getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Tidak memiliki otorisasi." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      stats: {
        totalGuests: 0,
        openedGuests: 0,
        unopenedGuests: 0,
        totalRsvp: 0,
        hadirRsvp: 0,
        tidakHadirRsvp: 0,
        raguRsvp: 0,
        totalGuestbook: 0,
      },
      message: "Supabase belum dikonfigurasi di .env.local",
    });
  }

  try {
    const supabase = getServiceSupabase();

    // 1. Guests stats
    const { count: totalGuests, error: err1 } = await supabase
      .from("guests")
      .select("*", { count: "exact", head: true });

    const { count: openedGuests, error: err2 } = await supabase
      .from("guests")
      .select("*", { count: "exact", head: true })
      .not("opened_at", "is", null);

    const unopenedGuests = (totalGuests ?? 0) - (openedGuests ?? 0);

    // 2. RSVP stats
    const { count: totalRsvp, error: err3 } = await supabase
      .from("rsvp_submissions")
      .select("*", { count: "exact", head: true });

    const { count: hadirRsvp, error: err4 } = await supabase
      .from("rsvp_submissions")
      .select("*", { count: "exact", head: true })
      .eq("attendance_status", "hadir");

    const { count: tidakHadirRsvp, error: err5 } = await supabase
      .from("rsvp_submissions")
      .select("*", { count: "exact", head: true })
      .eq("attendance_status", "tidak_hadir");

    const { count: raguRsvp, error: err6 } = await supabase
      .from("rsvp_submissions")
      .select("*", { count: "exact", head: true })
      .eq("attendance_status", "ragu");

    // 3. Guestbook stats
    const { count: totalGuestbook, error: err7 } = await supabase
      .from("guestbook_entries")
      .select("*", { count: "exact", head: true });

    const errors = [err1, err2, err3, err4, err5, err6, err7].filter(Boolean);
    if (errors.length > 0) {
      return NextResponse.json(
        { error: "Gagal memuat statistik dari database: " + errors[0]?.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      configured: true,
      stats: {
        totalGuests: totalGuests ?? 0,
        openedGuests: openedGuests ?? 0,
        unopenedGuests: Math.max(0, unopenedGuests),
        totalRsvp: totalRsvp ?? 0,
        hadirRsvp: hadirRsvp ?? 0,
        tidakHadirRsvp: tidakHadirRsvp ?? 0,
        raguRsvp: raguRsvp ?? 0,
        totalGuestbook: totalGuestbook ?? 0,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
