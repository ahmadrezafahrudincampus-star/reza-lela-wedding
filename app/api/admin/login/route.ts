import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { isSupabaseConfigured, getServiceSupabase } from "@/lib/supabase";
import crypto from "crypto";

const ADMIN_USERNAME = "admin";
const FALLBACK_PASSWORD = "admin"; // Used ONLY when Supabase is not configured
const SALT = "wedding-salt-2026";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(`${SALT}:${password}`).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim();
    const cleanPassword = String(password).trim();

    if (cleanUsername !== ADMIN_USERNAME) {
      return NextResponse.json(
        { success: false, error: "Username atau password salah." },
        { status: 401 }
      );
    }

    let isAuthenticated = false;

    // 1. If Supabase is configured, verify password hash from admin_settings
    if (isSupabaseConfigured()) {
      const supabase = getServiceSupabase();
      const { data: setting } = await supabase
        .from("admin_settings")
        .select("value")
        .eq("key", "admin_password_hash")
        .maybeSingle();

      if (setting?.value) {
        const inputHash = hashPassword(cleanPassword);
        if (inputHash === setting.value) {
          isAuthenticated = true;
        }
      } else {
        // No password stored yet: fall back to default 'admin'
        if (cleanPassword === FALLBACK_PASSWORD) {
          isAuthenticated = true;
        }
      }
    } else {
      // Supabase not configured: use hardcoded default for local dev only
      if (cleanPassword === FALLBACK_PASSWORD) {
        isAuthenticated = true;
      }
    }

    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Username atau password salah." },
        { status: 401 }
      );
    }

    const token = createSessionToken(cleanUsername);

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil.",
      username: cleanUsername,
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server saat memproses login." },
      { status: 500 }
    );
  }
}

