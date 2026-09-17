"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Lock, Shield, Database, CheckCircle2, Instagram, AlertCircle } from "lucide-react";
import { isValidInstagramUrl, normalizeInstagramUrl } from "@/lib/utils";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Social Media State
  const [brideUrl, setBrideUrl] = useState("");
  const [brideEnabled, setBrideEnabled] = useState(false);
  const [groomUrl, setGroomUrl] = useState("");
  const [groomEnabled, setGroomEnabled] = useState(false);
  const [isLoadingSocial, setIsLoadingSocial] = useState(true);
  const [isSavingSocial, setIsSavingSocial] = useState(false);
  const [socialError, setSocialError] = useState("");
  const [socialSuccess, setSocialSuccess] = useState("");

  // Load social media settings on mount
  useEffect(() => {
    async function loadSocialMedia() {
      setIsLoadingSocial(true);
      try {
        const res = await fetch("/api/admin/social-media");
        const data = await res.json();
        if (res.ok && data.success && data.settings) {
          setBrideUrl(data.settings.bride_instagram_url || "");
          setBrideEnabled(Boolean(data.settings.bride_instagram_enabled));
          setGroomUrl(data.settings.groom_instagram_url || "");
          setGroomEnabled(Boolean(data.settings.groom_instagram_enabled));
        }
      } catch {
        setSocialError("Gagal memuat pengaturan media sosial saat ini.");
      } finally {
        setIsLoadingSocial(false);
      }
    }
    loadSocialMedia();
  }, []);

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    setSocialError("");
    setSocialSuccess("");

    // Client-side validation for placeholders and URLs
    const trimmedBride = brideUrl.trim();
    if (brideEnabled && !trimmedBride) {
      setSocialError(
        "Instagram Mempelai Wanita aktif tetapi URL masih kosong. Masukkan URL/username profil atau matikan toggle."
      );
      return;
    }
    if (trimmedBride) {
      const normalizedBride = normalizeInstagramUrl(trimmedBride);
      if (!isValidInstagramUrl(normalizedBride)) {
        setSocialError(
          "URL Instagram Mempelai Wanita tidak valid. Masukkan URL profil lengkap (contoh: https://instagram.com/nama_akun atau @nama_akun), bukan placeholder."
        );
        return;
      }
    }

    const trimmedGroom = groomUrl.trim();
    if (groomEnabled && !trimmedGroom) {
      setSocialError(
        "Instagram Mempelai Pria aktif tetapi URL masih kosong. Masukkan URL/username profil atau matikan toggle."
      );
      return;
    }
    if (trimmedGroom) {
      const normalizedGroom = normalizeInstagramUrl(trimmedGroom);
      if (!isValidInstagramUrl(normalizedGroom)) {
        setSocialError(
          "URL Instagram Mempelai Pria tidak valid. Masukkan URL profil lengkap (contoh: https://instagram.com/nama_akun atau @nama_akun), bukan placeholder."
        );
        return;
      }
    }

    setIsSavingSocial(true);

    try {
      const res = await fetch("/api/admin/social-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bride_instagram_url: trimmedBride,
          bride_instagram_enabled: brideEnabled,
          groom_instagram_url: trimmedGroom,
          groom_instagram_enabled: groomEnabled,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSocialSuccess(data.message || "Media sosial mempelai berhasil disimpan.");
        if (data.settings) {
          setBrideUrl(data.settings.bride_instagram_url || "");
          setBrideEnabled(Boolean(data.settings.bride_instagram_enabled));
          setGroomUrl(data.settings.groom_instagram_url || "");
          setGroomEnabled(Boolean(data.settings.groom_instagram_enabled));
        }
      } else {
        setSocialError(data.error || "Gagal menyimpan media sosial ke database.");
      }
    } catch {
      setSocialError("Terjadi kesalahan koneksi saat menyimpan.");
    } finally {
      setIsSavingSocial(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (!newPassword || newPassword.length < 5) {
      setFormError("Password baru minimal harus 5 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError("Konfirmasi password baru tidak cocok.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage("Password berhasil diperbarui!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setFormError(data.error || "Gagal mengubah password.");
      }
    } catch {
      setFormError("Terjadi kesalahan koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Pengaturan"
      description="Kelola akun admin, keamanan, dan status koneksi database"
    >
      <div className="max-w-2xl space-y-6">
        {/* Media Sosial Mempelai Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <Instagram className="h-5 w-5 text-burgundy-900" />
            <div>
              <h3 className="font-bold text-base text-gray-900">Media Sosial Mempelai</h3>
              <p className="text-xs text-gray-500">Atur tautan akun Instagram mempelai wanita dan pria</p>
            </div>
          </div>

          {socialError && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{socialError}</span>
            </div>
          )}

          {socialSuccess && (
            <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-xs font-medium text-emerald-700 border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{socialSuccess}</span>
            </div>
          )}

          {isLoadingSocial ? (
            <div className="py-8 text-center text-xs text-gray-400">
              Memuat pengaturan media sosial...
            </div>
          ) : (
            <form onSubmit={handleSaveSocial} className="mt-4 space-y-4 text-xs">
              {/* Mempelai Wanita */}
              <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="bride-instagram" className="font-semibold text-gray-800 text-xs uppercase tracking-wide">
                    Instagram Mempelai Wanita (Lela)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={brideEnabled}
                      onChange={(e) => setBrideEnabled(e.target.checked)}
                      className="h-4 w-4 rounded text-burgundy-900 focus:ring-burgundy-900 cursor-pointer"
                    />
                    <span className="text-xs font-medium text-gray-700">Tampilkan Instagram</span>
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Instagram className="h-4 w-4" />
                  </span>
                  <input
                    id="bride-instagram"
                    type="text"
                    value={brideUrl}
                    onChange={(e) => setBrideUrl(e.target.value)}
                    placeholder="https://instagram.com/nama_akun atau @nama_akun"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm text-gray-900 focus:border-burgundy-900 focus:outline-none focus:ring-1 focus:ring-burgundy-900 bg-white"
                  />
                </div>
              </div>

              {/* Mempelai Pria */}
              <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="groom-instagram" className="font-semibold text-gray-800 text-xs uppercase tracking-wide">
                    Instagram Mempelai Pria (Reza)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={groomEnabled}
                      onChange={(e) => setGroomEnabled(e.target.checked)}
                      className="h-4 w-4 rounded text-burgundy-900 focus:ring-burgundy-900 cursor-pointer"
                    />
                    <span className="text-xs font-medium text-gray-700">Tampilkan Instagram</span>
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Instagram className="h-4 w-4" />
                  </span>
                  <input
                    id="groom-instagram"
                    type="text"
                    value={groomUrl}
                    onChange={(e) => setGroomUrl(e.target.value)}
                    placeholder="https://instagram.com/nama_akun atau @nama_akun"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm text-gray-900 focus:border-burgundy-900 focus:outline-none focus:ring-1 focus:ring-burgundy-900 bg-white"
                  />
                </div>
              </div>

              <p className="text-[11px] text-gray-500 italic">
                Kosongkan URL atau matikan toggle jika Instagram tidak ingin ditampilkan.
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingSocial}
                  className="rounded-lg bg-burgundy-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-burgundy-800 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isSavingSocial ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Change Password Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <Lock className="h-5 w-5 text-burgundy-900" />
            <div>
              <h3 className="font-bold text-base text-gray-900">Ubah Password Admin</h3>
              <p className="text-xs text-gray-500">Perbarui password untuk keamanan sistem</p>
            </div>
          </div>

          {formError && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
              {formError}
            </div>
          )}

          {successMessage && (
            <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-xs font-medium text-emerald-700 border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 uppercase mb-1">
                Password Saat Ini
              </label>
              <input
                type="password"
                placeholder="Masukkan password saat ini"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-burgundy-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 uppercase mb-1">
                Password Baru <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="Minimal 5 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-burgundy-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 uppercase mb-1">
                Ulangi Password Baru <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="Ketik ulang password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-burgundy-900 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-burgundy-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-burgundy-800 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Password Baru"}
              </button>
            </div>
          </form>
        </div>

        {/* Database & System Info Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <Database className="h-5 w-5 text-gray-700" />
            <div>
              <h3 className="font-bold text-base text-gray-900">Informasi Database</h3>
              <p className="text-xs text-gray-500">Koneksi PostgreSQL melalui Supabase</p>
            </div>
          </div>

          <div className="text-xs space-y-2 text-gray-600">
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="font-semibold text-gray-700">Database Engine:</span>
              <span className="font-mono">Supabase PostgreSQL 15+</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="font-semibold text-gray-700">Skema Migrasi:</span>
              <span className="font-mono">supabase/migrations/20260915_initial_schema.sql</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="font-semibold text-gray-700">Row Level Security (RLS):</span>
              <span className="text-emerald-700 font-semibold">Aktif (Enabled)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="font-semibold text-gray-700">Autentikasi Session:</span>
              <span className="text-emerald-700 font-semibold">HTTP-Only Cookie (SHA-256)</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
