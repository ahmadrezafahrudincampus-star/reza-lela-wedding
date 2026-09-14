"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Guest } from "@/lib/database.types";
import {
  Users,
  UserPlus,
  Upload,
  Download,
  Copy,
  Check,
  Search,
  MessageCircle,
  Pencil,
  Trash2,
  RefreshCw,
  X,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react";
import * as XLSX from "xlsx";

export default function AdminGuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [deletingGuest, setDeletingGuest] = useState<Guest | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Import state
  const [importParsedRows, setImportParsedRows] = useState<{ name: string; phone?: string; rowNumber: number }[]>([]);
  const [importInvalidRows, setImportInvalidRows] = useState<{ row: number; reason: string }[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importFileError, setImportFileError] = useState("");

  // Copy state feedback
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [isCopyingAll, setIsCopyingAll] = useState(false);

  // Get base URL for links
  const appUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Fetch guests from database
  const fetchGuests = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/admin/guests");
      const data = await res.json();
      if (res.ok) {
        setGuests(data.guests || []);
      } else {
        setErrorMessage(data.error || "Gagal memuat data tamu.");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan koneksi saat memuat data tamu.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  // Filtered guests
  const filteredGuests = useMemo(() => {
    if (!searchQuery.trim()) return guests;
    const q = searchQuery.toLowerCase().trim();
    return guests.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        (g.phone && g.phone.includes(q)) ||
        g.slug.toLowerCase().includes(q)
    );
  }, [guests, searchQuery]);

  // Copy single link
  const handleCopyLink = async (guest: Guest) => {
    const link = `${appUrl}/?to=${guest.slug}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        const ta = document.createElement("textarea");
        ta.value = link;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopiedSlug(guest.slug);
      showToast(`Link untuk ${guest.name} berhasil disalin.`);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch {
      showToast("Gagal menyalin link.");
    }
  };

  // Copy ALL links
  const handleCopyAllLinks = async () => {
    if (guests.length === 0) {
      showToast("Belum ada data tamu.");
      return;
    }

    setIsCopyingAll(true);
    const content = guests
      .map((g) => `${g.name}\n${appUrl}/?to=${g.slug}`)
      .join("\n\n");

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(content);
      } else {
        const ta = document.createElement("textarea");
        ta.value = content;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      showToast(`Semua ${guests.length} link tamu berhasil disalin!`);
    } catch {
      showToast("Gagal menyalin semua link.");
    } finally {
      setIsCopyingAll(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (guests.length === 0) {
      showToast("Belum ada data tamu untuk diekspor.");
      return;
    }

    const headers = ["No", "Nama Tamu", "Nomor WhatsApp", "Personal Link", "Status", "Jumlah Dibuka", "Terakhir Dibuka"];
    const rows = guests.map((g, index) => [
      index + 1,
      `"${g.name.replace(/"/g, '""')}"`,
      `"${g.phone || ""}"`,
      `"${appUrl}/?to=${g.slug}"`,
      `"${g.opened_at ? "Sudah Dibuka" : "Belum Dibuka"}"`,
      g.open_count || 0,
      `"${g.last_opened_at ? new Date(g.last_opened_at).toLocaleString("id-ID") : "-"}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daftar-tamu-undangan-reza-lela-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("File CSV berhasil diunduh.");
  };

  // WhatsApp open
  const handleOpenWhatsApp = (guest: Guest) => {
    if (!guest.phone) {
      showToast(`Nomor WhatsApp untuk ${guest.name} belum tersedia.`);
      return;
    }

    const personalLink = `${appUrl}/?to=${guest.slug}`;
    const text = `Assalamu'alaikum.\n\nDengan hormat kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan Reza & Lela.\n\nBerikut link undangan:\n${personalLink}\n\nTerima kasih.`;
    const url = `https://wa.me/${guest.phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // Add guest submit
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError("Nama tamu wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const res = await fetch("/api/admin/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, phone: formPhone }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAddModalOpen(false);
        setFormName("");
        setFormPhone("");
        showToast("Nama tamu berhasil ditambahkan.");
        fetchGuests();
      } else {
        setFormError(data.error || "Gagal menambahkan tamu. Silakan coba lagi.");
      }
    } catch {
      setFormError("Terjadi kesalahan koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit guest submit
  const handleEditGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuest || !formName.trim()) {
      setFormError("Nama tamu wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const res = await fetch("/api/admin/guests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingGuest.id, name: formName, phone: formPhone }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEditingGuest(null);
        setFormName("");
        setFormPhone("");
        showToast("Data tamu berhasil diperbarui.");
        fetchGuests();
      } else {
        setFormError(data.error || "Gagal memperbarui tamu. Silakan coba lagi.");
      }
    } catch {
      setFormError("Terjadi kesalahan koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete guest confirmed
  const handleDeleteGuest = async () => {
    if (!deletingGuest) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/guests?id=${deletingGuest.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDeletingGuest(null);
        showToast("Tamu berhasil dihapus.");
        fetchGuests();
      } else {
        showToast(data.error || "Tamu gagal dihapus.");
      }
    } catch {
      showToast("Terjadi kesalahan saat menghapus.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Parse file (CSV or Excel) for import
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileError("");
    setImportParsedRows([]);
    setImportInvalidRows([]);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) {
        setImportFileError("File tidak memiliki lembar data.");
        return;
      }

      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number)[][];

      if (jsonData.length < 2) {
        setImportFileError("File kosong atau tidak memiliki baris data.");
        return;
      }

      // Check header row (row 0)
      const headerRow = jsonData[0]?.map((h) => String(h || "").trim().toLowerCase()) || [];
      let nameColIndex = headerRow.findIndex((h) => h.includes("nama"));
      let phoneColIndex = headerRow.findIndex((h) => h.includes("wa") || h.includes("hp") || h.includes("telepon") || h.includes("phone"));

      // Fallback if headers are generic: assume column 0 is Name, column 1 is Phone
      if (nameColIndex === -1) nameColIndex = 0;
      if (phoneColIndex === -1 && headerRow.length > 1) phoneColIndex = 1;

      const valid: { name: string; phone?: string; rowNumber: number }[] = [];
      const invalid: { row: number; reason: string }[] = [];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue;

        const rawName = row[nameColIndex] !== undefined ? String(row[nameColIndex]).trim() : "";
        const rawPhone = phoneColIndex !== -1 && row[phoneColIndex] !== undefined ? String(row[phoneColIndex]).trim() : "";

        if (!rawName) {
          invalid.push({ row: i + 1, reason: "Nama Tamu kosong." });
        } else if (rawName.length < 2) {
          invalid.push({ row: i + 1, reason: "Nama Tamu terlalu pendek (minimal 2 karakter)." });
        } else {
          valid.push({
            name: rawName,
            phone: rawPhone || undefined,
            rowNumber: i + 1,
          });
        }
      }

      setImportParsedRows(valid);
      setImportInvalidRows(invalid);
    } catch {
      setImportFileError("Gagal membaca file. Pastikan format file adalah .xlsx, .xls, atau .csv yang valid.");
    }
  };

  // Submit batch import
  const handleExecuteImport = async () => {
    if (importParsedRows.length === 0) return;
    setIsImporting(true);

    try {
      const res = await fetch("/api/admin/guests/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: importParsedRows }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsImportModalOpen(false);
        setImportParsedRows([]);
        setImportInvalidRows([]);
        showToast(`${data.importedCount} tamu berhasil diimpor ke database!`);
        fetchGuests();
      } else {
        setImportFileError(data.error || "Gagal mengimpor data.");
      }
    } catch {
      setImportFileError("Terjadi kesalahan koneksi saat mengimpor.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <AdminLayout
      title="Manajemen Tamu"
      description="Kelola daftar undangan, personal link, import massal, dan tracking pembukaan"
    >
      <div className="space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-[200] rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
            {toastMessage}
          </div>
        )}

        {/* Global Error */}
        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700 flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={fetchGuests} className="flex items-center gap-1 font-bold underline">
              <RefreshCw className="h-3 w-3" /> Coba lagi
            </button>
          </div>
        )}

        {/* ── Action Toolbar ────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Cari nama tamu atau nomor HP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-burgundy-900 focus:outline-none focus:ring-1 focus:ring-burgundy-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setFormName("");
                setFormPhone("");
                setFormError("");
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-burgundy-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-burgundy-800 shadow-sm"
            >
              <UserPlus className="h-4 w-4" />
              <span>+ Tambah Tamu</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setImportParsedRows([]);
                setImportInvalidRows([]);
                setImportFileError("");
                setIsImportModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
            >
              <Upload className="h-4 w-4 text-gray-500" />
              <span>Import Excel/CSV</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
            >
              <Download className="h-4 w-4 text-gray-500" />
              <span>Export</span>
            </button>

            <button
              type="button"
              onClick={handleCopyAllLinks}
              disabled={isCopyingAll || guests.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm disabled:opacity-50"
            >
              <Copy className="h-4 w-4 text-gray-500" />
              <span>{isCopyingAll ? "Menyalin..." : "Salin Semua Link"}</span>
            </button>
          </div>
        </div>

        {/* ── Table / List ─────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center text-sm text-gray-500">
              <RefreshCw className="mx-auto h-6 w-6 animate-spin text-burgundy-900 mb-2" />
              Memuat data tamu...
            </div>
          ) : filteredGuests.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="mx-auto h-8 w-8 text-gray-300 mb-2" />
              <p className="font-semibold text-gray-700 text-sm">
                {searchQuery ? "Tidak ada tamu yang cocok." : "Belum ada tamu terdaftar."}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {searchQuery
                  ? "Coba gunakan kata kunci pencarian yang berbeda."
                  : "Tambahkan tamu pertama Anda atau import dari file Excel/CSV."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="border-b border-gray-200 bg-gray-50/75 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4">Nama Tamu</th>
                    <th className="py-3 px-4">Nomor HP</th>
                    <th className="py-3 px-4">Link Undangan</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Terakhir Dibuka</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredGuests.map((guest, index) => {
                    const isOpened = Boolean(guest.opened_at);
                    const personalLink = `${appUrl}/?to=${guest.slug}`;

                    return (
                      <tr key={guest.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3.5 px-4 text-center text-gray-400 font-mono">
                          {index + 1}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-gray-900">
                          {guest.name}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-gray-600">
                          {guest.phone || "-"}
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleCopyLink(guest)}
                            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-burgundy-900 hover:underline"
                            title="Klik untuk salin link"
                          >
                            <span className="truncate max-w-[150px] sm:max-w-[200px]">
                              /?to={guest.slug}
                            </span>
                            {copiedSlug === guest.slug ? (
                              <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                            ) : (
                              <Copy className="h-3 w-3 text-gray-400 shrink-0" />
                            )}
                          </button>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              isOpened
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-gray-100 text-gray-600 border border-gray-200"
                            }`}
                          >
                            {isOpened ? `Dibuka (${guest.open_count}x)` : "Belum Dibuka"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-500">
                          {guest.last_opened_at
                            ? new Date(guest.last_opened_at).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleCopyLink(guest)}
                              title="Salin Link"
                              className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenWhatsApp(guest)}
                              disabled={!guest.phone}
                              title={guest.phone ? "Kirim WhatsApp" : "Nomor WhatsApp belum tersedia"}
                              className="rounded p-1.5 text-emerald-600 hover:bg-emerald-50 disabled:opacity-30"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingGuest(guest);
                                setFormName(guest.name);
                                setFormPhone(guest.phone || "");
                                setFormError("");
                              }}
                              title="Edit Tamu"
                              className="rounded p-1.5 text-blue-600 hover:bg-blue-50"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeletingGuest(guest)}
                              title="Hapus Tamu"
                              className="rounded p-1.5 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal: Tambah Tamu ───────────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">Tambah Tamu</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-lg bg-red-50 p-2.5 text-xs text-red-700 border border-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddGuest} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Nama Tamu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bpk. Hendra &amp; Keluarga"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-burgundy-900 focus:outline-none focus:ring-1 focus:ring-burgundy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Nomor WhatsApp <span className="text-gray-400 normal-case">(Opsional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 08123456789 atau 628123456789"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-burgundy-900 focus:outline-none focus:ring-1 focus:ring-burgundy-900"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-burgundy-900 px-4 py-2 text-xs font-semibold text-white hover:bg-burgundy-800 disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Tamu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Edit Tamu ─────────────────────────────────────────── */}
      {editingGuest && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">Edit Tamu</h3>
              <button
                type="button"
                onClick={() => setEditingGuest(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-lg bg-red-50 p-2.5 text-xs text-red-700 border border-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleEditGuest} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Nama Tamu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-burgundy-900 focus:outline-none focus:ring-1 focus:ring-burgundy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Nomor WhatsApp <span className="text-gray-400 normal-case">(Opsional)</span>
                </label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-burgundy-900 focus:outline-none focus:ring-1 focus:ring-burgundy-900"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingGuest(null)}
                  disabled={isSubmitting}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-burgundy-900 px-4 py-2 text-xs font-semibold text-white hover:bg-burgundy-800 disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Import Excel/CSV ──────────────────────────────────── */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl border border-gray-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-base text-gray-900">Import Tamu dari Excel / CSV</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-5 text-center">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-burgundy-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-burgundy-800 cursor-pointer"
                />
                <p className="mt-2 text-[11px] text-gray-400">
                  Format kolom: <strong>Nama Tamu</strong>, <strong>Nomor WhatsApp</strong> (opsional)
                </p>
              </div>

              {importFileError && (
                <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                  {importFileError}
                </div>
              )}

              {/* Preview */}
              {(importParsedRows.length > 0 || importInvalidRows.length > 0) && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      ✓ {importParsedRows.length} baris valid
                    </span>
                    {importInvalidRows.length > 0 && (
                      <span className="text-red-700 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
                        ⚠ {importInvalidRows.length} baris bermasalah
                      </span>
                    )}
                  </div>

                  {importInvalidRows.length > 0 && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800 space-y-1 max-h-32 overflow-y-auto">
                      <p className="font-semibold">Baris yang bermasalah (tidak akan diimpor):</p>
                      {importInvalidRows.map((inv, idx) => (
                        <p key={idx}>
                          Baris {inv.row}: {inv.reason}
                        </p>
                      ))}
                    </div>
                  )}

                  {importParsedRows.length > 0 && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 sticky top-0 text-[10px] uppercase font-semibold text-gray-500">
                          <tr>
                            <th className="py-2 px-3">No</th>
                            <th className="py-2 px-3">Nama Tamu</th>
                            <th className="py-2 px-3">Nomor WhatsApp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {importParsedRows.slice(0, 30).map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="py-1.5 px-3 text-gray-400">{idx + 1}</td>
                              <td className="py-1.5 px-3 font-medium text-gray-900">{row.name}</td>
                              <td className="py-1.5 px-3 text-gray-500">{row.phone || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {importParsedRows.length > 30 && (
                        <p className="p-2 text-center text-[10px] text-gray-400 bg-gray-50">
                          dan {importParsedRows.length - 30} baris lainnya...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                disabled={isImporting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={isImporting || importParsedRows.length === 0}
                className="rounded-lg bg-burgundy-900 px-4 py-2 text-xs font-semibold text-white hover:bg-burgundy-800 disabled:opacity-50"
              >
                {isImporting ? "Mengimpor..." : `Import ${importParsedRows.length} Tamu`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Dialog: Konfirmasi Hapus ─────────────────────────────────── */}
      <ConfirmDialog
        isOpen={Boolean(deletingGuest)}
        title="Hapus Tamu?"
        message={`Data tamu "${deletingGuest?.name}" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        isDestructive={true}
        isLoading={isSubmitting}
        onConfirm={handleDeleteGuest}
        onCancel={() => setDeletingGuest(null)}
      />
    </AdminLayout>
  );
}
