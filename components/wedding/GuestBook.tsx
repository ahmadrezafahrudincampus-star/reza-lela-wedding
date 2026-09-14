"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { WeddingDivider } from "@/components/ui/Ornaments";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface GuestEntry {
  id: string;
  name: string;
  attendance: "hadir" | "tidak-hadir" | "masih-ragu";
  message: string;
  timestamp: Date;
}

interface GuestBookProps {
  /**
   * Pass in entries from the RSVP submit handler so GuestBook
   * stays in sync with the form without a real backend.
   */
  entries?: GuestEntry[];
}

const ATTENDANCE_CONFIG = {
  hadir: { label: "Hadir", color: "bg-emerald-700", textColor: "text-white" },
  "tidak-hadir": { label: "Tidak Hadir", color: "bg-rose-700", textColor: "text-white" },
  "masih-ragu": { label: "Masih Ragu", color: "bg-amber-600", textColor: "text-white" },
} as const;

const PAGE_SIZE = 5;

// Demo seed entries shown before any real submissions
const seedEntries: GuestEntry[] = [
  {
    id: "seed-1",
    name: "Bpk. Ade Haiz & Ibu Hulayah",
    attendance: "hadir",
    message:
      "Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Barakallahu laka wa baraka alaika wa jama'a bainakuma fi khair. 🤍",
    timestamp: new Date("2026-09-13T01:00:00Z"),
  },
  {
    id: "seed-2",
    name: "Keluarga Besar Ibrahim",
    attendance: "hadir",
    message:
      "Selamat menempuh hidup baru! Semoga langgeng hingga kakek nenek dan selalu dilimpahi kebahagiaan. 💕",
    timestamp: new Date("2026-09-12T08:00:00Z"),
  },
  {
    id: "seed-3",
    name: "Siti Aminah",
    attendance: "masih-ragu",
    message: "Selamat atas pernikahannya, semoga jadi keluarga yang bahagia!",
    timestamp: new Date("2026-09-11T14:30:00Z"),
  },
];

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHr < 24) return `${diffHr} jam lalu`;
  return `${diffDay} hari lalu`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-burgundy-700",
    "bg-rose-700",
    "bg-amber-700",
    "bg-emerald-700",
    "bg-violet-700",
    "bg-sky-700",
  ];
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % colors.length;
  return colors[hash];
}

export function GuestBook({ entries = [] }: GuestBookProps) {
  const [dbEntries, setDbEntries] = useState<GuestEntry[]>([]);

  useEffect(() => {
    async function loadGuestbook() {
      try {
        const res = await fetch("/api/guestbook");
        const data = await res.json();
        if (res.ok && Array.isArray(data.entries) && data.entries.length > 0) {
          const parsed: GuestEntry[] = data.entries.map((item: {
            id: string;
            guest_name: string;
            message: string;
            attendance_status?: string | null;
            created_at: string;
          }) => ({
            id: item.id,
            name: item.guest_name,
            attendance: (item.attendance_status === "tidak_hadir" ? "tidak-hadir" : item.attendance_status === "ragu" ? "masih-ragu" : "hadir") as "hadir" | "tidak-hadir" | "masih-ragu",
            message: item.message,
            timestamp: new Date(item.created_at),
          }));
          setDbEntries(parsed);
        }
      } catch {
        // Fallback gracefully
      }
    }
    loadGuestbook();
  }, []);

  // Merge in-session submissions on top of DB entries, fallback to seedEntries if empty
  const baseEntries = dbEntries.length > 0 ? dbEntries : seedEntries;
  // Deduplicate by ID
  const seenIds = new Set<string>();
  const allEntries: GuestEntry[] = [];

  for (const item of [...entries, ...baseEntries]) {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      allEntries.push(item);
    }
  }

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleEntries = allEntries.slice(0, visibleCount);
  const hasMore = visibleCount < allEntries.length;

  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, allEntries.length));
  }, [allEntries.length]);

  return (
    <section
      id="wishes"
      aria-label="Buku Tamu & Ucapan"
      className="relative w-full bg-rose-50 px-5 sm:px-6 py-16 sm:py-24 overflow-hidden"
    >
      <div className="relative z-10 max-w-sm mx-auto">
        {/* ── Section Header ──────────────────────────────────────── */}
        <header className="text-center space-y-2 mb-10">
          <Reveal animation="fade" duration={0.8}>
            <p className="font-sans text-[10px] sm:text-[11px] font-medium tracking-[0.3em] uppercase text-burgundy-700/70">
              Buku Tamu
            </p>
          </Reveal>
          <Reveal animation="fade-up" delay={0.12} duration={0.9}>
            <h2 className="font-script text-5xl sm:text-6xl text-burgundy-900 leading-tight drop-shadow-sm my-0.5">
              Ucapan &amp; Doa
            </h2>
          </Reveal>
          <Reveal animation="fade" delay={0.2} duration={0.8}>
            <WeddingDivider
              color="rgba(61,15,32,0.3)"
              variant="diamond"
              className="max-w-[140px] mx-auto my-1.5 opacity-70"
            />
          </Reveal>
          <Reveal animation="fade-up" delay={0.25} duration={0.8}>
            <p className="font-serif italic text-xs sm:text-sm text-burgundy-800/70 leading-relaxed px-2">
              Setiap doa dan ucapan dari Anda adalah hadiah terindah bagi kami.
            </p>
          </Reveal>
        </header>

        {/* ── Entries List ─────────────────────────────────────────── */}
        <ol className="space-y-3" aria-label="Daftar ucapan tamu">
          <AnimatePresence initial={false}>
            {visibleEntries.map((entry, index) => {
              const cfg = ATTENDANCE_CONFIG[entry.attendance];
              const initials = getInitials(entry.name);
              const avatarColor = getAvatarColor(entry.name);

              return (
                <motion.li
                  key={entry.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index < PAGE_SIZE ? index * 0.05 : 0,
                    ease: "easeOut",
                  }}
                >
                  <article className="flex gap-3 p-4 rounded-2xl bg-white border border-burgundy-100 shadow-sm">
                    {/* Avatar */}
                    <div
                      className={cn(
                        "flex-none w-10 h-10 rounded-full flex items-center justify-center text-white font-sans text-xs font-bold shrink-0",
                        avatarColor
                      )}
                      aria-hidden="true"
                    >
                      {initials}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-serif text-sm font-semibold text-burgundy-900 truncate">
                          {entry.name}
                        </h3>
                        <span
                          className={cn(
                            "inline-block px-2 py-0.5 rounded-full text-[9px] font-sans font-semibold uppercase tracking-wider shrink-0",
                            cfg.color,
                            cfg.textColor
                          )}
                        >
                          {cfg.label}
                        </span>
                      </div>
                      {entry.message && (
                        <p className="font-sans text-[12px] text-gray-600 leading-relaxed">
                          {entry.message}
                        </p>
                      )}
                      <time
                        className="font-sans text-[10px] text-gray-400"
                        dateTime={entry.timestamp.toISOString()}
                        suppressHydrationWarning
                      >
                        {formatRelativeTime(entry.timestamp)}
                      </time>
                    </div>
                  </article>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>

        {/* ── Load More ────────────────────────────────────────────── */}
        {hasMore && (
          <Reveal animation="fade-up" delay={0.1} duration={0.7}>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-burgundy-900 hover:bg-burgundy-800 text-white text-xs font-sans font-semibold tracking-wider uppercase transition-all duration-300 shadow-md active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-700"
              >
                Lihat Lebih Banyak
              </button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export default GuestBook;
