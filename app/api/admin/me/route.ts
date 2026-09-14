import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { authenticated: false, error: "Tidak memiliki otorisasi." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    username: session.username,
  });
}
