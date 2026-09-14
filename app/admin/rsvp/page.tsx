"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { RsvpSubmission } from "@/lib/database.types";
import {
  CheckSquare,
  Check,
  XCircle,
  HelpCircle,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react";

type FilterStatus = "semua" | "hadir" | "tidak_hadir" | "ragu";

export default function AdminRsvpPage() {
  const [rsvps, setRsvps] = useState<RsvpSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("semua");
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [deletingRsvp, setDeletingRsvp] = useState<RsvpSubmission | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchRsvps = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const url = filter === "semua" ? "/api/admin/rsvp" : `/api/admin/rsvp?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setRsvps(data.rsvps || []);
      } else {
        setErrorMessage(data.error || "Gagal memuat data RSVP.");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchRsvps();
  }, [fetchRsvps]);

  const handleDelete = async () => {
    if (!deletingRsvp) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/rsvp?id=${deletingRsvp.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDeletingRsvp(null);
        showToast("Data RSVP berhasil dihapus.");
        fetchRsvps();
      } else {
        showToast(data.error || "Gagal menghapus data.");
      }
    } catch {
      showToast("Terjadi kesalahan koneksi.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "hadir":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
            <Check className="h-3 w-3" /> Hadir
          </span>
        );
      case "tidak_hadir":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-semibold text-red-700 border border-red-200">
            <XCircle className="h-3 w-3" /> Tidak Hadir
          </span>
        );
      case "ragu":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
            <HelpCircle className="h-3 w-3" /> Masih Ragu
          </span>
        );
    }
  };

  return (
    <AdminLayout
      title="Konfirmasi Kehadiran (RSVP)"
      description="Daftar tamu yang telah mengisi konfirmasi kehadiran di website undangan"
    >
      <div className="space-y-6">
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-[200] rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
            {toastMessage}
          </div>
        )}

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700 flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={fetchRsvps} className="font-bold underline">Coba lagi</button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 text-xs">
            <button
              onClick={() => setFilter("semua")}
              className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                filter === "semua" ? "bg-burgundy-900 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter("hadir")}
              className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                filter === "hadir" ? "bg-emerald-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Hadir
            </button>
            <button
              onClick={() => setFilter("tidak_hadir")}
              className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                filter === "tidak_hadir" ? "bg-red-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Tidak Hadir
            </button>
            <button
              onClick={() => setFilter("ragu")}
              className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                filter === "ragu" ? "bg-amber-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Masih Ragu
            </button>
          </div>

          <button
            onClick={fetchRsvps}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Perbarui</span>
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center text-sm text-gray-500">
              <RefreshCw className="mx-auto h-6 w-6 animate-spin text-burgundy-900 mb-2" />
              Memuat data RSVP...
            </div>
          ) : rsvps.length === 0 ? (
            <div className="p-12 text-center">
              <CheckSquare className="mx-auto h-8 w-8 text-gray-300 mb-2" />
              <p className="font-semibold text-gray-700 text-sm">Belum ada respon RSVP.</p>
              <p className="text-xs text-gray-500 mt-1">Respon konfirmasi dari formulir website akan muncul di sini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="border-b border-gray-200 bg-gray-50/75 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4">Nama Tamu</th>
                    <th className="py-3 px-4">Status Kehadiran</th>
                    <th className="py-3 px-4 text-center">Jumlah Tamu</th>
                    <th className="py-3 px-4">Pesan / Doa</th>
                    <th className="py-3 px-4">Tanggal Kirim</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rsvps.map((r, index) => (
                    <tr key={r.id} className="hover:bg-gray-50/70">
                      <td className="py-3.5 px-4 text-center text-gray-400 font-mono">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        {r.guest_name}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(r.attendance_status)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold">
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3 w-3 text-gray-400" />
                          {r.guest_count}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-gray-700 italic">
                        {r.message ? `"${r.message}"` : "-"}
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 text-[11px]">
                        {new Date(r.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setDeletingRsvp(r)}
                          className="rounded p-1.5 text-red-600 hover:bg-red-50"
                          title="Hapus"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={Boolean(deletingRsvp)}
        title="Hapus Respon RSVP?"
        message={`Data konfirmasi dari "${deletingRsvp?.guest_name}" akan dihapus permanen.`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingRsvp(null)}
      />
    </AdminLayout>
  );
}
