"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { BankAccount, AccountType } from "@/lib/database.types";
import {
  CreditCard,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  X,
  Wallet,
} from "lucide-react";

export default function AdminBankAccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<BankAccount | null>(null);

  // Form fields
  const [type, setType] = useState<AccountType>("bank");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/admin/bank-accounts");
      const data = await res.json();
      if (res.ok) {
        setAccounts(data.accounts || []);
      } else {
        setErrorMessage(data.error || "Gagal memuat data rekening.");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan saat memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const openAddModal = () => {
    setEditingAccount(null);
    setType("bank");
    setBankName("");
    setAccountNumber("");
    setAccountHolder("");
    setSortOrder(accounts.length + 1);
    setIsActive(true);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (acc: BankAccount) => {
    setEditingAccount(acc);
    setType(acc.type);
    setBankName(acc.bank_name);
    setAccountNumber(acc.account_number);
    setAccountHolder(acc.account_holder);
    setSortOrder(acc.sort_order || 1);
    setIsActive(acc.is_active);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName.trim() || !accountNumber.trim() || !accountHolder.trim()) {
      setFormError("Nama bank, nomor rekening, dan atas nama wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const method = editingAccount ? "PUT" : "POST";
      const payload = {
        ...(editingAccount ? { id: editingAccount.id } : {}),
        type,
        bank_name: bankName,
        account_number: accountNumber,
        account_holder: accountHolder,
        sort_order: sortOrder,
        is_active: isActive,
      };

      const res = await fetch("/api/admin/bank-accounts", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsModalOpen(false);
        showToast(editingAccount ? "Rekening berhasil diperbarui." : "Rekening berhasil ditambahkan.");
        fetchAccounts();
      } else {
        setFormError(data.error || "Gagal menyimpan data.");
      }
    } catch {
      setFormError("Terjadi kesalahan koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingAccount) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/bank-accounts?id=${deletingAccount.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDeletingAccount(null);
        showToast("Rekening berhasil dihapus.");
        fetchAccounts();
      } else {
        showToast(data.error || "Gagal menghapus rekening.");
      }
    } catch {
      showToast("Terjadi kesalahan koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Rekening &amp; Digital Gift"
      description="Kelola nomor rekening bank dan e-wallet untuk amplop digital di website undangan"
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
            <button onClick={fetchAccounts} className="font-bold underline">Coba lagi</button>
          </div>
        )}

        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">{accounts.length} rekening terdaftar</p>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-burgundy-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-burgundy-800 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Rekening</span>
          </button>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
            <RefreshCw className="mx-auto h-6 w-6 animate-spin text-burgundy-900 mb-2" />
            Memuat rekening...
          </div>
        ) : accounts.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <CreditCard className="mx-auto h-8 w-8 text-gray-300 mb-2" />
            <p className="font-semibold text-gray-700 text-sm">Belum ada rekening/e-wallet terdaftar.</p>
            <p className="text-xs text-gray-500 mt-1">Tambahkan akun bank seperti BCA, Mandiri, atau DANA.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {acc.type === "ewallet" ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                        <Wallet className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                        <CreditCard className="h-4 w-4" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">{acc.bank_name}</h3>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                        {acc.type === "ewallet" ? "E-Wallet" : "Bank Transfer"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(acc)}
                      className="rounded p-1 text-blue-600 hover:bg-blue-50"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingAccount(acc)}
                      className="rounded p-1 text-red-600 hover:bg-red-50"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-3 font-mono">
                  <p className="text-xs text-gray-500">Nomor Rekening:</p>
                  <p className="text-base font-bold text-gray-900 mt-0.5 tracking-wider">
                    {acc.account_number}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 font-sans">
                    a.n. <strong className="font-semibold text-gray-900">{acc.account_holder}</strong>
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      acc.is_active
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {acc.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                  <span className="text-gray-400 text-[11px]">Urutan: #{acc.sort_order}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">
                {editingAccount ? "Edit Rekening" : "Tambah Rekening"}
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
                  Jenis Pembayaran
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType("bank")}
                    className={`py-2 px-3 rounded-lg border text-center font-semibold transition-colors ${
                      type === "bank"
                        ? "border-burgundy-900 bg-burgundy-50 text-burgundy-900"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Bank Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("ewallet")}
                    className={`py-2 px-3 rounded-lg border text-center font-semibold transition-colors ${
                      type === "ewallet"
                        ? "border-burgundy-900 bg-burgundy-50 text-burgundy-900"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    E-Wallet / QRIS
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">
                  Nama Bank / Provider <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: BCA, MANDIRI, DANA, GoPay"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-burgundy-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">
                  Nomor Rekening / No. HP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 03123456789"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-burgundy-900 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">
                  Atas Nama (Pemilik) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Reza Fahrudin"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-burgundy-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded text-burgundy-900 focus:ring-burgundy-900"
                  />
                  <span className="font-semibold text-gray-800">Aktifkan Rekening di Website</span>
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
                  {isSubmitting ? "Menyimpan..." : "Simpan Rekening"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingAccount)}
        title="Hapus Rekening?"
        message={`Akun ${deletingAccount?.bank_name} - ${deletingAccount?.account_number} akan dihapus permanen.`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        isDestructive={true}
        isLoading={isSubmitting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingAccount(null)}
      />
    </AdminLayout>
  );
}
