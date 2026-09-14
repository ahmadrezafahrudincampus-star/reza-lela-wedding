"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage("Username dan password wajib diisi.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.replace("/admin");
      } else {
        setErrorMessage(data.error || "Username atau password salah.");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 font-sans">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-md border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="font-serif text-2xl font-bold text-burgundy-900">Admin Undangan</h1>
          <p className="mt-1 text-xs text-gray-500">Masuk untuk mengelola data undangan</p>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="login-username"
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1"
            >
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <User className="h-4 w-4" />
              </span>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                disabled={isLoading}
                placeholder="Masukkan username"
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm text-gray-900 focus:border-burgundy-900 focus:outline-none focus:ring-1 focus:ring-burgundy-900 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isLoading}
                placeholder="Masukkan password"
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm text-gray-900 focus:border-burgundy-900 focus:outline-none focus:ring-1 focus:ring-burgundy-900 disabled:bg-gray-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-burgundy-900 py-2.5 text-sm font-semibold text-white hover:bg-burgundy-800 focus:outline-none focus:ring-2 focus:ring-burgundy-900 focus:ring-offset-2 disabled:opacity-60 transition-colors cursor-pointer"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[11px] text-gray-400">Digital Wedding Invitation — Reza &amp; Lela</p>
        </div>
      </div>
    </div>
  );
}
