import { NextResponse } from "next/server";
import { isSupabaseConfigured, getServiceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SOCIAL_KEYS = [
  "bride_instagram_url",
  "bride_instagram_enabled",
  "groom_instagram_url",
  "groom_instagram_enabled",
] as const;

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      bride: { url: "", enabled: false },
      groom: { url: "", enabled: false },
    });
  }

  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("admin_settings")
      .select("key, value")
      .in("key", SOCIAL_KEYS as unknown as string[]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const settingsMap: Record<string, string> = {};
    (data || []).forEach((row) => {
      settingsMap[row.key] = row.value;
    });

    return NextResponse.json({
      configured: true,
      bride: {
        url: settingsMap.bride_instagram_url || "",
        enabled: settingsMap.bride_instagram_enabled === "true",
      },
      groom: {
        url: settingsMap.groom_instagram_url || "",
        enabled: settingsMap.groom_instagram_enabled === "true",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
