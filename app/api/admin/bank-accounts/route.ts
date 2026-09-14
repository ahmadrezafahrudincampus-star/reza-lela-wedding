import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { isSupabaseConfigured, getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false, accounts: [] });
  }

  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("bank_accounts")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: "Gagal mengambil data rekening: " + error.message }, { status: 500 });
    }

    return NextResponse.json({ configured: true, accounts: data || [] });
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
    return NextResponse.json({ error: "Supabase belum terhubung di .env.local" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { type = "bank", bank_name, account_number, account_holder, sort_order = 0, is_active = true } = body;

    if (!bank_name || !account_number || !account_holder) {
      return NextResponse.json(
        { error: "Nama bank/provider, nomor rekening, dan atas nama wajib diisi." },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("bank_accounts")
      .insert([
        {
          type: type === "ewallet" ? "ewallet" : "bank",
          bank_name: String(bank_name).trim(),
          account_number: String(account_number).trim(),
          account_holder: String(account_holder).trim(),
          sort_order: Number(sort_order) || 0,
          is_active: Boolean(is_active),
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Gagal menyimpan rekening: " + error.message }, { status: 500 });
    }

    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Rekening berhasil ditambahkan.",
      account: data,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Tidak memiliki otorisasi." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase belum terhubung di .env.local" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { id, type, bank_name, account_number, account_holder, sort_order, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: "ID rekening wajib disertakan." }, { status: 400 });
    }

    if (!bank_name || !account_number || !account_holder) {
      return NextResponse.json(
        { error: "Nama bank/provider, nomor rekening, dan atas nama wajib diisi." },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("bank_accounts")
      .update({
        type: type === "ewallet" ? "ewallet" : "bank",
        bank_name: String(bank_name).trim(),
        account_number: String(account_number).trim(),
        account_holder: String(account_holder).trim(),
        sort_order: Number(sort_order) || 0,
        is_active: Boolean(is_active),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Gagal memperbarui rekening: " + error.message }, { status: 500 });
    }

    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Data rekening berhasil diperbarui.",
      account: data,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Tidak memiliki otorisasi." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase belum terhubung di .env.local" }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID rekening wajib disertakan." }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    const { error } = await supabase.from("bank_accounts").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Gagal menghapus rekening: " + error.message }, { status: 500 });
    }

    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Rekening berhasil dihapus.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
