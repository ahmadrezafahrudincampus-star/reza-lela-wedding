import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { isSupabaseConfigured, getServiceSupabase } from "@/lib/supabase";
import crypto from "crypto";

const SALT = "wedding-salt-2026";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(`${SALT}:${password}`).digest("hex");
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Tidak memiliki otorisasi." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase belum terhubung. Tidak dapat mengubah password." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Password lama dan baru wajib diisi." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password baru minimal harus 6 karakter." }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // Verify current password
    const { data: setting } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", "admin_password_hash")
      .maybeSingle();

    const currentHash = hashPassword(currentPassword);
    const storedHash = setting?.value;

    // Allow 'admin' as fallback if no hash stored yet
    const currentIsValid =
      storedHash ? currentHash === storedHash : currentPassword === "admin";

    if (!currentIsValid) {
      return NextResponse.json({ error: "Password saat ini tidak sesuai." }, { status: 401 });
    }

    // Store new password hash
    const newHash = hashPassword(newPassword);
    const { error: upsertErr } = await supabase
      .from("admin_settings")
      .upsert([{ key: "admin_password_hash", value: newHash }], { onConflict: "key" });

    if (upsertErr) {
      return NextResponse.json(
        { error: "Gagal menyimpan password baru: " + upsertErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password admin berhasil diperbarui.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

