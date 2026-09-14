"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Lock, Shield, Database, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
