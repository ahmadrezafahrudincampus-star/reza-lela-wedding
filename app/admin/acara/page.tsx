"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EventItem } from "@/lib/database.types";
import {
  Calendar,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Clock,
  RefreshCw,
  X,
  ExternalLink,
} from "lucide-react";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<EventItem | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [venue, setVenue] = useState("");
  const [address, setAddress] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/admin/events");
      const data = await res.json();
      if (res.ok) {
        setEvents(data.events || []);
      } else {
        setErrorMessage(data.error || "Gagal memuat data acara.");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan koneksi saat memuat data acara.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const openAddModal = () => {
    setEditingEvent(null);
    setTitle("");
    setDate("2026-09-26");
    setStartTime("09:00");
    setEndTime("");
    setVenue("");
    setAddress("");
    setGoogleMapsUrl("");
    setSortOrder(events.length + 1);
    setIsActive(true);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (evt: EventItem) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setDate(evt.date);
    setStartTime(evt.start_time?.slice(0, 5) || "");
    setEndTime(evt.end_time ? evt.end_time.slice(0, 5) : "");
    setVenue(evt.venue);
    setAddress(evt.address || "");
    setGoogleMapsUrl(evt.google_maps_url || "");
    setSortOrder(evt.sort_order || 0);
    setIsActive(evt.is_active);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !startTime || !venue.trim()) {
      setFormError("Nama acara, tanggal, jam mulai, dan tempat wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const method = editingEvent ? "PUT" : "POST";
      const payload = {
        ...(editingEvent ? { id: editingEvent.id } : {}),
        title,
        date,
        start_time: startTime,
        end_time: endTime || null,
        venue,
        address,
        google_maps_url: googleMapsUrl,
        sort_order: sortOrder,
        is_active: isActive,
      };

      const res = await fetch("/api/admin/events", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsModalOpen(false);
        showToast(editingEvent ? "Acara berhasil diperbarui." : "Acara baru berhasil ditambahkan.");
        fetchEvents();
      } else {
        setFormError(data.error || "Gagal menyimpan acara.");
      }
    } catch {
      setFormError("Terjadi kesalahan koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingEvent) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/events?id=${deletingEvent.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDeletingEvent(null);
        showToast("Acara berhasil dihapus.");
        fetchEvents();
      } else {
        showToast(data.error || "Gagal menghapus acara.");
      }
    } catch {
      showToast("Terjadi kesalahan koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Acara &amp; Lokasi"
      description="Kelola rangkaian acara pernikahan (Akad, Resepsi) dan integrasi Google Maps"
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
            <button onClick={fetchEvents} className="font-bold underline">Coba lagi</button>
          </div>
        )}

        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">{events.length} acara terdaftar</p>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-burgundy-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-burgundy-800 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Acara</span>
          </button>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
            <RefreshCw className="mx-auto h-6 w-6 animate-spin text-burgundy-900 mb-2" />
            Memuat acara...
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <Calendar className="mx-auto h-8 w-8 text-gray-300 mb-2" />
            <p className="font-semibold text-gray-700 text-sm">Belum ada acara ditambahkan.</p>
            <p className="text-xs text-gray-500 mt-1">Tambahkan acara seperti Akad Nikah atau Resepsi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg font-bold text-gray-900">{evt.title}</h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          evt.is_active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {evt.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                    <p className="text-xs text-burgundy-800 font-medium mt-0.5">
                      {new Date(evt.date).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(evt)}
                      className="rounded p-1.5 text-blue-600 hover:bg-blue-50"
                      title="Edit Acara"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingEvent(evt)}
                      className="rounded p-1.5 text-red-600 hover:bg-red-50"
                      title="Hapus Acara"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-600 space-y-1.5 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span>
                      {evt.start_time?.slice(0, 5)} WIB {evt.end_time ? `s/d ${evt.end_time.slice(0, 5)} WIB` : "s/d Selesai"}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-800">{evt.venue}</p>
                      {evt.address && <p className="text-gray-500 mt-0.5">{evt.address}</p>}
                    </div>
                  </div>

                  {evt.google_maps_url && (
                    <div className="pt-1">
                      <a
                        href={evt.google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-burgundy-900 hover:underline"
                      >
                        <span>Buka Google Maps</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">
                {editingEvent ? "Edit Acara" : "Tambah Acara"}
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
                  Nama Acara <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Akad Nikah atau Resepsi Pernikahan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-burgundy-900 focus:outline-none focus:ring-1 focus:ring-burgundy-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 uppercase mb-1">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-burgundy-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 uppercase mb-1">
                    Jam Mulai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-burgundy-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 uppercase mb-1">
                    Jam Selesai
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-burgundy-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">
                  Tempat / Nama Gedung <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dikediaman Mempelai Wanita"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-burgundy-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  rows={2}
                  placeholder="Alamat lengkap lokasi acara..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-burgundy-900 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">
                  Google Maps URL
                </label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/..."
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-burgundy-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded text-burgundy-900 focus:ring-burgundy-900"
                  />
                  <span className="font-semibold text-gray-800">Tampilkan Acara di Website</span>
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
                  {isSubmitting ? "Menyimpan..." : "Simpan Acara"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingEvent)}
        title="Hapus Acara?"
        message={`Acara "${deletingEvent?.title}" akan dihapus permanen dari sistem.`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        isDestructive={true}
        isLoading={isSubmitting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingEvent(null)}
      />
    </AdminLayout>
  );
}
