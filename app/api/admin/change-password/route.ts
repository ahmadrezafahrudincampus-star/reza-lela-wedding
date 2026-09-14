import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { isSupabaseConfigured, getServiceSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Tidak memiliki otorisasi." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!newPassword || newPassword.length < 5) {
      return NextResponse.json(
        { error: "Password baru minimal harus 5 karakter." },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const supabase = getServiceSupabase();
      // If Supabase Auth is active, update user password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return NextResponse.json({ error: "Gagal memperbarui password: " + error.message }, { status: 500 });
      }
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
