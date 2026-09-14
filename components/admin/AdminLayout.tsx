"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  MessageSquareQuote,
  CheckSquare,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const MENU_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Tamu", href: "/admin/tamu", icon: Users },
  { label: "Acara & Lokasi", href: "/admin/acara", icon: Calendar },
  { label: "Rekening & Digital Gift", href: "/admin/rekening", icon: CreditCard },
  { label: "Ucapan & Doa", href: "/admin/ucapan", icon: MessageSquareQuote },
  { label: "RSVP", href: "/admin/rsvp", icon: CheckSquare },
  { label: "Buku Tamu", href: "/admin/buku-tamu", icon: BookOpen },
  { label: "Pengaturan", href: "/admin/pengaturan", icon: Settings },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  description,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [username, setUsername] = useState<string>("admin");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check auth
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/me");
        if (!res.ok) {
          router.replace("/admin/login");
          return;
        }
        const data = await res.json();
        if (data.authenticated) {
          setUsername(data.username || "admin");
          setIsCheckingAuth(false);
        } else {
          router.replace("/admin/login");
        }
      } catch {
        router.replace("/admin/login");
      }
    }

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
    } catch {
      router.replace("/admin/login");
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-burgundy-900 border-r-transparent" />
          <p className="font-sans text-sm text-gray-500">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* ── Mobile Top Header ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 focus:outline-none"
            aria-label="Buka menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <span className="font-serif text-lg font-bold text-burgundy-900">Admin Undangan</span>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
        >
          <span>Lihat Undangan</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </header>

      {/* ── Mobile Drawer Backdrop ──────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── Sidebar (Desktop fixed, Mobile drawer) ──────────────────── */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
          <div>
            <h1 className="font-serif text-xl font-bold text-burgundy-900">Admin Undangan</h1>
            <p className="text-[11px] text-gray-400">Reza &amp; Lela</p>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="border-b border-gray-100 bg-gray-50/70 px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-burgundy-900 font-serif text-xs font-bold text-white">
              {username[0]?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-gray-800">{username}</p>
              <p className="text-[10px] text-emerald-600 font-medium">Aktif</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-burgundy-900 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-3 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100"
          >
            <ExternalLink className="h-4 w-4 text-gray-400" />
            <span>Website Publik</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4 text-red-500" />
            <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ───────────────────────────────────────── */}
      <div className="flex flex-1 flex-col md:pl-64">
        {title && (
          <div className="border-b border-gray-200 bg-white px-6 py-5">
            <h2 className="font-serif text-2xl font-bold text-gray-900">{title}</h2>
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
