import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, getServiceSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug")?.trim();
  const track = searchParams.get("track") === "true";

  if (!slug) {
    return NextResponse.json({ found: false, error: "Slug tidak diberikan" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    // If Supabase not yet configured, return fallback
    return NextResponse.json({
      found: false,
      configured: false,
      message: "Supabase belum terhubung",
    });
  }

  try {
    const supabase = getServiceSupabase();

    // If track=true, call the atomic RPC function
    if (track) {
      const { data: rpcData, error: rpcError } = await supabase.rpc("track_guest_open", {
        p_slug: slug,
      });

      if (!rpcError && rpcData && rpcData.success) {
        return NextResponse.json({
          found: true,
          guest: {
            id: rpcData.id,
            name: rpcData.name,
            slug: rpcData.slug,
          },
        });
      }
    }

    // Lookup via safe RPC
    const { data: rpcData, error: rpcError } = await supabase.rpc("get_guest_by_slug", {
      p_slug: slug,
    });

    if (!rpcError && rpcData && rpcData.found) {
      return NextResponse.json({
        found: true,
        guest: {
          id: rpcData.id,
          name: rpcData.name,
          slug: rpcData.slug,
          rsvp_status: rpcData.rsvp_status,
        },
      });
    }

    // Direct server-side lookup fallback
    const { data: guest, error } = await supabase
      .from("guests")
      .select("id, name, slug, rsvp_status")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !guest) {
      return NextResponse.json({ found: false });
    }

    return NextResponse.json({
      found: true,
      guest,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ found: false, error: msg }, { status: 500 });
  }
}
