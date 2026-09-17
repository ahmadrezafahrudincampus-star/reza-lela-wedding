import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { isSupabaseConfigured, getServiceSupabase } from "@/lib/supabase";
import { isValidInstagramUrl, normalizeInstagramUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SOCIAL_KEYS = [
  "bride_instagram_url",
  "bride_instagram_enabled",
  "groom_instagram_url",
  "groom_instagram_enabled",
] as const;

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Tidak memiliki otorisasi." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase belum terhubung di .env.local" },
      { status: 503 }
    );
  }

  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("admin_settings")
      .select("key, value")
      .in("key", SOCIAL_KEYS as unknown as string[]);

    if (error) {
      return NextResponse.json(
        { error: "Gagal memuat pengaturan media sosial: " + error.message },
        { status: 500 }
      );
    }

    const settingsMap: Record<string, string> = {};
    (data || []).forEach((row) => {
      settingsMap[row.key] = row.value;
    });

    return NextResponse.json({
      success: true,
      settings: {
        bride_instagram_url: settingsMap.bride_instagram_url || "",
        bride_instagram_enabled: settingsMap.bride_instagram_enabled === "true",
        groom_instagram_url: settingsMap.groom_instagram_url || "",
        groom_instagram_enabled: settingsMap.groom_instagram_enabled === "true",
      },
    });
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
    return NextResponse.json(
      { error: "Supabase belum terhubung di .env.local" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const rawBrideUrl = typeof body.bride_instagram_url === "string" ? body.bride_instagram_url.trim() : "";
    const rawGroomUrl = typeof body.groom_instagram_url === "string" ? body.groom_instagram_url.trim() : "";
    const brideEnabled = Boolean(body.bride_instagram_enabled);
    const groomEnabled = Boolean(body.groom_instagram_enabled);

    // Validate Bride Instagram URL
    let cleanBrideUrl = "";
    if (brideEnabled && !rawBrideUrl) {
      return NextResponse.json(
        {
          error:
            "Instagram Mempelai Wanita aktif tetapi URL masih kosong. Masukkan URL/username profil Instagram atau matikan toggle.",
        },
        { status: 400 }
      );
    }
    if (rawBrideUrl) {
      const normalized = normalizeInstagramUrl(rawBrideUrl);
      if (!isValidInstagramUrl(normalized)) {
        return NextResponse.json(
          {
            error:
              "URL Instagram Mempelai Wanita tidak valid. Masukkan URL profil lengkap (contoh: https://instagram.com/nama_akun atau @nama_akun), bukan placeholder.",
          },
          { status: 400 }
        );
      }
      cleanBrideUrl = normalized;
    }

    // Validate Groom Instagram URL
    let cleanGroomUrl = "";
    if (groomEnabled && !rawGroomUrl) {
      return NextResponse.json(
        {
          error:
            "Instagram Mempelai Pria aktif tetapi URL masih kosong. Masukkan URL/username profil Instagram atau matikan toggle.",
        },
        { status: 400 }
      );
    }
    if (rawGroomUrl) {
      const normalized = normalizeInstagramUrl(rawGroomUrl);
      if (!isValidInstagramUrl(normalized)) {
        return NextResponse.json(
          {
            error:
              "URL Instagram Mempelai Pria tidak valid. Masukkan URL profil lengkap (contoh: https://instagram.com/nama_akun atau @nama_akun), bukan placeholder.",
          },
          { status: 400 }
        );
      }
      cleanGroomUrl = normalized;
    }

    const rowsToUpsert = [
      { key: "bride_instagram_url", value: cleanBrideUrl },
      { key: "bride_instagram_enabled", value: String(brideEnabled) },
      { key: "groom_instagram_url", value: cleanGroomUrl },
      { key: "groom_instagram_enabled", value: String(groomEnabled) },
    ];

    const supabase = getServiceSupabase();
    const { error: upsertErr } = await supabase
      .from("admin_settings")
      .upsert(rowsToUpsert, { onConflict: "key" });

    if (upsertErr) {
      return NextResponse.json(
        { error: "Gagal menyimpan ke database Supabase: " + upsertErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Media sosial mempelai berhasil disimpan.",
      settings: {
        bride_instagram_url: cleanBrideUrl,
        bride_instagram_enabled: brideEnabled,
        groom_instagram_url: cleanGroomUrl,
        groom_instagram_enabled: groomEnabled,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
