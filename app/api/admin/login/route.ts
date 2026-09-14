import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { isSupabaseConfigured, getServiceSupabase } from "@/lib/supabase";

// Development default credentials
const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin";

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

    let isAuthenticated = false;

    // 1. If Supabase is configured, try Supabase Auth first
    if (isSupabaseConfigured()) {
      const supabase = getServiceSupabase();
      // Lookup email for the username in admin_profiles
      const { data: profile } = await supabase
        .from("admin_profiles")
        .select("id, username")
        .eq("username", cleanUsername)
        .maybeSingle();

      if (profile) {
        // Authenticate with Supabase Auth
        const email = `${cleanUsername}@wedding.local`;
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: cleanPassword,
        });

        if (!signInError) {
          isAuthenticated = true;
        }
      }
    }

    // 2. Default initial development check
    if (!isAuthenticated) {
      if (cleanUsername === DEFAULT_USERNAME && cleanPassword === DEFAULT_PASSWORD) {
        isAuthenticated = true;
      }
    }

    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Username atau password salah." },
        { status: 401 }
      );
    }

    // Create secure signed session token
    const token = createSessionToken(cleanUsername);

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil.",
      username: cleanUsername,
    });

    // Set HTTP-only secure cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server saat memproses login." },
      { status: 500 }
    );
  }
}
