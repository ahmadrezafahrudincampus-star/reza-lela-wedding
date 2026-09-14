"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminMessage } from "@/lib/database.types";
import {
  MessageSquareQuote,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  X,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<AdminMessage | null>(null);
  const [deletingMessage, setDeletingMessage] = useState<AdminMessage | null>(null);

  // Form
  const [messageText, setMessageText] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages || []);
      } else {
        setErrorMessage(data.error || "Gagal memuat ucapan.");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const openAddModal = () => {
    setEditingMessage(null);
    setMessageText("");
    setIsActive(true);
    setSortOrder(messages.length + 1);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (msg: AdminMessage) => {
    setEditingMessage(msg);
    setMessageText(msg.message);
    setIsActive(msg.is_active);
    setSortOrder(msg.sort_order || 1);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) {
      setFormError("Isi ucapan/doa wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const method = editingMessage ? "PUT" : "POST";
      const payload = {
        ...(editingMessage ? { id: editingMessage.id } : {}),
        message: messageText,
        is_active: isActive,
        sort_order: sortOrder,
      };

      const res = await fetch("/api/admin/messages", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsModalOpen(false);
        showToast(editingMessage ? "Ucapan berhasil diperbarui." : "Ucapan berhasil ditambahkan.");
        fetchMessages();
      } else {
        setFormError(data.error || "Gagal menyimpan data.");
      }
    } catch {
      setFormError("Terjadi kesalahan koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActive = async (msg: AdminMessage) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: msg.id,
          message: msg.message,
          is_active: !msg.is_active,
          sort_order: msg.sort_order,
        }),
      });
      if (res.ok) {
        showToast(msg.is_active ? "Ucapan dinonaktifkan." : "Ucapan diaktifkan.");
        fetchMessages();
      }
    } catch {
      showToast("Gagal mengubah status ucapan.");
    }
  };

  const handleDelete = async () => {
    if (!deletingMessage) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/messages?id=${deletingMessage.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDeletingMessage(null);
        showToast("Ucapan berhasil dihapus.");
        fetchMessages();
      } else {
        showToast(data.error || "Gagal menghapus ucapan.");
      }
    } catch {
      showToast("Terjadi kesalahan koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Ucapan &amp; Doa"
      description="Kelola ucapan dan doa yang dapat ditampilkan secara acak pada halaman undangan"
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
            <button onClick={fetchMessages} className="font-bold underline">Coba lagi</button>
          </div>
        )}

        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">{messages.length} ucapan terdaftar</p>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-burgundy-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-burgundy-800 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Ucapan</span>
          </button>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
            <RefreshCw className="mx-auto h-6 w-6 animate-spin text-burgundy-900 mb-2" />
            Memuat ucapan...
          </div>
        ) : messages.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <MessageSquareQuote className="mx-auto h-8 w-8 text-gray-300 mb-2" />
            <p className="font-semibold text-gray-700 text-sm">Belum ada ucapan &amp; doa tersimpan.</p>
            <p className="text-xs text-gray-500 mt-1">Tambahkan doa pernikahan seperti ayat atau ucapan selamat.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="border-b border-gray-200 bg-gray-50/75 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4">Ucapan &amp; Doa</th>
                    <th className="py-3 px-4 w-28">Status</th>
                    <th className="py-3 px-4 w-36">Tanggal</th>
                    <th className="py-3 px-4 w-28 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {messages.map((msg, index) => (
                    <tr key={msg.id} className="hover:bg-gray-50/70">
                      <td className="py-3.5 px-4 text-center text-gray-400 font-mono">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-4 font-serif text-sm text-gray-900 italic max-w-md">
                        &ldquo;{msg.message}&rdquo;
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => toggleActive(msg)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                            msg.is_active
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
                          }`}
                        >
                          {msg.is_active ? (
                            <>
                              <CheckCircle className="h-3 w-3" />
                              <span>Aktif</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3" />
                              <span>Tidak Aktif</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 text-[11px]">
                        {new Date(msg.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(msg)}
                            className="rounded p-1.5 text-blue-600 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingMessage(msg)}
                            className="rounded p-1.5 text-red-600 hover:bg-red-50"
                            title="Hapus"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">
                {editingMessage ? "Edit Ucapan & Doa" : "Tambah Ucapan & Doa"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-lg bg-red-50 p-2.5 text-xs text-red-700 border border-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">
                  Isi Ucapan / Doa <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan doa atau ucapan..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-burgundy-900 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded text-burgundy-900 focus:ring-burgundy-900"
                  />
                  <span className="font-semibold text-gray-800">Aktifkan untuk pemilihan acak</span>
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-burgundy-900 px-4 py-2 font-semibold text-white hover:bg-burgundy-800 disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Ucapan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingMessage)}
        title="Hapus Ucapan?"
        message="Ucapan/doa ini akan dihapus permanen dari sistem."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        isDestructive={true}
        isLoading={isSubmitting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingMessage(null)}
      />
    </AdminLayout>
  );
}
