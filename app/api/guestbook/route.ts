import { NextResponse } from "next/server";
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
