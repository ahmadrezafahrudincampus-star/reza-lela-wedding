import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { isSupabaseConfigured, getServiceSupabase, createSlug, normalizePhoneNumber } from "@/lib/supabase";

interface RawGuestRow {
  name: string;
  phone?: string;
  rowNumber?: number;
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
    const { items } = body as { items: RawGuestRow[] };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Tidak ada data tamu untuk diimpor." }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // Fetch existing slugs to prevent collisions in batch
    const { data: existingGuests } = await supabase
      .from("guests")
      .select("slug");

    const usedSlugs = new Set<string>((existingGuests || []).map((g: { slug: string }) => g.slug));

    const validRows: {
      name: string;
      slug: string;
      phone: string | null;
      open_count: number;
      rsvp_status: string;
    }[] = [];
    const invalidRows: { row: number; reason: string }[] = [];

    items.forEach((item, index) => {
      const rowNum = item.rowNumber || index + 1;
      const rawName = item.name ? String(item.name).trim() : "";

      if (!rawName) {
        invalidRows.push({ row: rowNum, reason: "Nama Tamu kosong." });
        return;
      }

      if (rawName.length < 2) {
        invalidRows.push({ row: rowNum, reason: "Nama Tamu terlalu pendek (minimal 2 karakter)." });
        return;
      }

      // Generate unique slug
      const baseSlug = createSlug(rawName);
      let candidate = baseSlug;
      let counter = 1;
      while (usedSlugs.has(candidate)) {
        counter++;
        candidate = `${baseSlug}-${counter}`;
      }
      usedSlugs.add(candidate);

      const phone = normalizePhoneNumber(item.phone);

      validRows.push({
        name: rawName,
        slug: candidate,
        phone,
        open_count: 0,
        rsvp_status: "pending",
      });
    });

    if (validRows.length === 0) {
      return NextResponse.json(
        {
          error: "Semua baris data tidak valid.",
          invalidCount: invalidRows.length,
          invalidRows,
        },
        { status: 400 }
      );
    }

    // Batch insert valid rows
    const { data, error } = await supabase
      .from("guests")
      .insert(validRows)
      .select();

    if (error) {
      return NextResponse.json({ error: "Gagal menyimpan data ke database: " + error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `${validRows.length} tamu berhasil diimpor.`,
      importedCount: validRows.length,
      invalidCount: invalidRows.length,
      invalidRows,
      inserted: data,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
