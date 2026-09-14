"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { GuestbookEntry } from "@/lib/database.types";
import {
  BookOpen,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
} from "lucide-react";

export default function AdminGuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [deletingEntry, setDeletingEntry] = useState<GuestbookEntry | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchEntries = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/admin/guestbook");
      const data = await res.json();
      if (res.ok) {
        setEntries(data.entries || []);
      } else {
        setErrorMessage(data.error || "Gagal memuat buku tamu.");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Toggle Visibility
  const toggleVisibility = async (entry: GuestbookEntry) => {
    const nextStatus = !entry.is_visible;
    try {
      const res = await fetch("/api/admin/guestbook", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entry.id, is_visible: nextStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(nextStatus ? "Ucapan ditampilkan di website." : "Ucapan disembunyikan dari website.");
        fetchEntries();
      } else {
        showToast(data.error || "Gagal mengubah status.");
      }
    } catch {
      showToast("Terjadi kesalahan koneksi.");
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deletingEntry) return;
    setIsProcessing(true);

    try {
      const res = await fetch(`/api/admin/guestbook?id=${deletingEntry.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDeletingEntry(null);
        showToast("Ucapan berhasil dihapus.");
        fetchEntries();
      } else {
        showToast(data.error || "Gagal menghapus ucapan.");
      }
    } catch {
      showToast("Terjadi kesalahan koneksi.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AdminLayout
      title="Buku Tamu &amp; Moderasi Ucapan"
      description="Tinjau doa dan ucapan yang dikirimkan tamu. Anda dapat menyembunyikan atau menghapus ucapan yang tidak pantas."
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
            <button onClick={fetchEntries} className="font-bold underline">Coba lagi</button>
          </div>
        )}

        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">{entries.length} ucapan masuk</p>
          <button
            onClick={fetchEntries}
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
              Memuat buku tamu...
            </div>
          ) : entries.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-gray-300 mb-2" />
              <p className="font-semibold text-gray-700 text-sm">Belum ada ucapan dari tamu.</p>
              <p className="text-xs text-gray-500 mt-1">Ucapan yang dikirim melalui formulir website akan muncul di sini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="border-b border-gray-200 bg-gray-50/75 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4 w-44">Nama Tamu</th>
                    <th className="py-3 px-4">Ucapan &amp; Doa</th>
                    <th className="py-3 px-4 w-28 text-center">Status Tampil</th>
                    <th className="py-3 px-4 w-32">Tanggal</th>
                    <th className="py-3 px-4 w-28 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {entries.map((entry, index) => (
                    <tr key={entry.id} className="hover:bg-gray-50/70">
                      <td className="py-3.5 px-4 text-center text-gray-400 font-mono">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        {entry.guest_name}
                      </td>
                      <td className="py-3.5 px-4 text-gray-700 leading-relaxed max-w-md">
                        {entry.message}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                            entry.is_visible
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-gray-100 text-gray-500 border border-gray-200"
                          }`}
                        >
                          {entry.is_visible ? "Tampil" : "Disembunyikan"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 text-[11px]">
                        {new Date(entry.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => toggleVisibility(entry)}
                            title={entry.is_visible ? "Sembunyikan dari website" : "Tampilkan di website"}
                            className="rounded p-1.5 text-gray-600 hover:bg-gray-100"
                          >
                            {entry.is_visible ? (
                              <EyeOff className="h-4 w-4 text-amber-600" />
                            ) : (
                              <Eye className="h-4 w-4 text-emerald-600" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingEntry(entry)}
                            title="Hapus permanen"
                            className="rounded p-1.5 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
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
        isOpen={Boolean(deletingEntry)}
        title="Hapus Ucapan Buku Tamu?"
        message={`Ucapan dari "${deletingEntry?.guest_name}" akan dihapus permanen.`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        isDestructive={true}
        isLoading={isProcessing}
        onConfirm={handleDelete}
        onCancel={() => setDeletingEntry(null)}
      />
    </AdminLayout>
  );
}
