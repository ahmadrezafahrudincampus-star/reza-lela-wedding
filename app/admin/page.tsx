"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Users,
  Eye,
  EyeOff,
  CheckSquare,
  Check,
  XCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface StatsData {
  totalGuests: number;
  openedGuests: number;
  unopenedGuests: number;
  totalRsvp: number;
  hadirRsvp: number;
  tidakHadirRsvp: number;
  raguRsvp: number;
  totalGuestbook: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData>({
    totalGuests: 0,
    openedGuests: 0,
    unopenedGuests: 0,
    totalRsvp: 0,
    hadirRsvp: 0,
    tidakHadirRsvp: 0,
    raguRsvp: 0,
    totalGuestbook: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isConfigured, setIsConfigured] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (res.ok) {
        setStats(data.stats);
        setIsConfigured(data.configured !== false);
      } else {
        setErrorMessage(data.error || "Gagal memuat data statistik.");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan saat memuat data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AdminLayout
      title="Dashboard"
      description="Ringkasan data undangan, tamu, dan konfirmasi kehadiran"
    >
      <div className="space-y-6">
        {/* Database Config Notice if not configured */}
        {!isConfigured && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Supabase Belum Dikonfigurasi</h3>
                <p className="mt-1 text-xs text-amber-700 leading-relaxed">
                  Isi <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">NEXT_PUBLIC_SUPABASE_URL</code> dan{" "}
                  <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> di file{" "}
                  <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.local</code> lalu jalankan file migrasi di Supabase SQL Editor.
                </p>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700 flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={fetchStats}
              className="flex items-center gap-1 text-xs font-semibold text-red-800 hover:underline"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Coba lagi</span>
            </button>
          </div>
        )}

        {/* ── Summary Card ─────────────────────────────────────────── */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-gray-900">Data Undangan</h2>
              <p className="mt-1 text-sm text-gray-500">
                {isLoading
                  ? "Memuat data..."
                  : `${stats.totalGuests} tamu terdaftar dalam sistem`}
              </p>
            </div>
            <button
              type="button"
              onClick={fetchStats}
              disabled={isLoading}
              className="inline-flex items-center gap-2 self-start sm:self-auto rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Perbarui</span>
            </button>
          </div>
        </div>

        {/* ── 8 Metrics Grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Total Tamu */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Tamu</span>
              <Users className="h-4 w-4 text-burgundy-800" />
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {isLoading ? "..." : stats.totalGuests}
            </p>
            <Link
              href="/admin/tamu"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-burgundy-900 hover:underline"
            >
              <span>Kelola Tamu</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* 2. Sudah Membuka */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Sudah Membuka</span>
              <Eye className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-3 text-3xl font-bold text-emerald-600">
              {isLoading ? "..." : stats.openedGuests}
            </p>
            <p className="mt-3 text-xs text-gray-500">
              {stats.totalGuests > 0
                ? `${Math.round((stats.openedGuests / stats.totalGuests) * 100)}% dari total`
                : "0%"}
            </p>
          </div>

          {/* 3. Belum Membuka */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Belum Membuka</span>
              <EyeOff className="h-4 w-4 text-gray-400" />
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-700">
              {isLoading ? "..." : stats.unopenedGuests}
            </p>
            <p className="mt-3 text-xs text-gray-500">
              {stats.totalGuests > 0
                ? `${Math.round((stats.unopenedGuests / stats.totalGuests) * 100)}% dari total`
                : "0%"}
            </p>
          </div>

          {/* 4. Total RSVP */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total RSVP</span>
              <CheckSquare className="h-4 w-4 text-burgundy-800" />
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {isLoading ? "..." : stats.totalRsvp}
            </p>
            <Link
              href="/admin/rsvp"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-burgundy-900 hover:underline"
            >
              <span>Lihat RSVP</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* 5. Hadir */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Hadir</span>
              <Check className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-3 text-3xl font-bold text-emerald-600">
              {isLoading ? "..." : stats.hadirRsvp}
            </p>
            <p className="mt-3 text-xs text-gray-500">Konfirmasi hadir</p>
          </div>

          {/* 6. Tidak Hadir */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Tidak Hadir</span>
              <XCircle className="h-4 w-4 text-red-500" />
            </div>
            <p className="mt-3 text-3xl font-bold text-red-600">
              {isLoading ? "..." : stats.tidakHadirRsvp}
            </p>
            <p className="mt-3 text-xs text-gray-500">Berhalangan hadir</p>
          </div>

          {/* 7. Masih Ragu */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Masih Ragu</span>
              <HelpCircle className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-3 text-3xl font-bold text-amber-600">
              {isLoading ? "..." : stats.raguRsvp}
            </p>
            <p className="mt-3 text-xs text-gray-500">Belum pasti</p>
          </div>

          {/* 8. Total Ucapan Buku Tamu */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Ucapan Buku Tamu</span>
              <BookOpen className="h-4 w-4 text-burgundy-800" />
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {isLoading ? "..." : stats.totalGuestbook}
            </p>
            <Link
              href="/admin/buku-tamu"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-burgundy-900 hover:underline"
            >
              <span>Moderasi Buku Tamu</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* ── Quick Actions ────────────────────────────────────────── */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="font-serif text-base font-bold text-gray-900 mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/admin/tamu"
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:border-burgundy-800 hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-semibold text-sm text-gray-900">Kelola Tamu</p>
                <p className="text-xs text-gray-500 mt-0.5">Tambah, import, atau copy link</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Link>

            <Link
              href="/admin/acara"
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:border-burgundy-800 hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-semibold text-sm text-gray-900">Acara &amp; Lokasi</p>
                <p className="text-xs text-gray-500 mt-0.5">Atur Akad, Resepsi &amp; Maps</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Link>

            <Link
              href="/admin/rekening"
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:border-burgundy-800 hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-semibold text-sm text-gray-900">Rekening &amp; Hadiah</p>
                <p className="text-xs text-gray-500 mt-0.5">Kelola nomor rekening digital</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
