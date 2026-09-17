"use client";

import React, { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { weddingData } from "@/data/wedding";

// ── Stable, completed sections ───────────────────────────────────────────────
import { Cover } from "@/components/wedding/Cover";
import { Hero } from "@/components/wedding/Hero";
import { Quote } from "@/components/wedding/Quote";
import { Couple } from "@/components/wedding/Couple";
import { Countdown } from "@/components/wedding/Countdown";
import { Event } from "@/components/wedding/Event";
import { LoveGift } from "@/components/wedding/LoveGift";
import { MusicPlayer, MusicPlayerHandle } from "@/components/wedding/MusicPlayer";


// ── Phase 9 — Love Story, RSVP, GuestBook, Closing ───────────────────────────
import { Story } from "@/components/wedding/Story";
import { RSVP } from "@/components/wedding/RSVP";
import { GuestBook } from "@/components/wedding/GuestBook";
import { Closing } from "@/components/wedding/Closing";

// ── Experimental — Scroll Section Reveal ─────────────────────────────────────
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface GuestEntry {
  id: string;
  name: string;
  attendance: "hadir" | "tidak-hadir" | "masih-ragu";
  message: string;
  timestamp: Date;
}

function WeddingInvitationApp() {
  const searchParams = useSearchParams();
  const toParam = searchParams.get("to");

  const [dbGuestName, setDbGuestName] = useState<string | null>(null);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const musicRef = useRef<MusicPlayerHandle | null>(null);

  // Guest entries shared from RSVP → GuestBook
  const [guestEntries, setGuestEntries] = useState<GuestEntry[]>([]);

  // Initial guest lookup by slug from database
  useEffect(() => {
    const rawSlug = toParam?.trim();
    if (!rawSlug || rawSlug === "undefined" || rawSlug === "null") {
      setDbGuestName(null);
      return;
    }
    const validSlug: string = rawSlug;

    let isMounted = true;
    async function lookup() {
      try {
        const res = await fetch(`/api/guest?slug=${encodeURIComponent(validSlug)}`);
        if (!res.ok) {
          if (isMounted) setDbGuestName(null);
          return;
        }
        const data = await res.json();
        if (isMounted) {
          if (data.found && data.guest?.name) {
            setDbGuestName(data.guest.name);
          } else {
            setDbGuestName(null);
          }
        }
      } catch {
        if (isMounted) setDbGuestName(null);
      }
    }
    lookup();

    return () => {
      isMounted = false;
    };
  }, [toParam]);

  // Manage body scroll locking: locked before opening, unlocked after opening
  useEffect(() => {
    if (!isOpened) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpened]);

  // Handler for "Buka Undangan" action from Cover — triggers music and tracks opened status
  const handleOpenInvitation = () => {
    setIsOpening(true);

    // Track open count in database if guest slug exists and is verified
    const cleanSlug = toParam?.trim();
    if (cleanSlug && cleanSlug !== "undefined" && cleanSlug !== "null" && dbGuestName) {
      fetch(`/api/guest?slug=${encodeURIComponent(cleanSlug)}&track=true`).catch(() => {});
    }

    // Attempt audio playback immediately within the user gesture event
    if (musicRef.current) {
      musicRef.current.play();
    }

    // Trigger opening exit transition
    setIsOpened(true);
    setIsOpening(false);
  };

  // RSVP submit handler — prepend new entry to guest book
  const handleRSVPSubmit = useCallback((entry: GuestEntry) => {
    setGuestEntries((prev) => [entry, ...prev]);
  }, []);

  const activeGuest = dbGuestName || "";

  return (
    <div className="relative min-h-screen bg-burgundy-900 flex items-start justify-center md:py-10">
      {/* ── Fixed Floating Music Player ─────────────────────────────── */}
      <MusicPlayer ref={musicRef} isOpened={isOpened} />

      {/* ── Fullscreen Cover Overlay (Exit with AnimatePresence) ────── */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="wedding-cover-overlay"
            initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              scale: 1.35,
              filter: "blur(28px)",
              transition: {
                duration: 1.1,
                ease: [0.4, 0, 0.6, 1],
              },
            }}
            className="fixed inset-0 z-50 flex justify-center bg-burgundy-900 overflow-hidden"
          >
            <div className="w-full max-w-[480px] h-full shadow-2xl flex flex-col">
              <Cover
                onOpen={handleOpenInvitation}
                guestName={activeGuest}
                isOpening={isOpening}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Invitation Scroll Container ────────────────────────── */}
      {/*
       * Section order:
       * 01 Cover (overlay above)
       * 02 Hero
       * 03 Quote
       * 04 Couple
       * 05 Countdown
       * 06 Event
       * 07 Love Gift
       * 08 Prewedding Slideshow
       * 09 Gallery
       * 10 Love Story
       * 11 RSVP
       * 12 Guest Book
       * 13 Closing
       * 14 Music Player (floating, global)
       */}
      <article
        id="invitation-main"
        className="w-full max-w-[480px] min-h-screen bg-white md:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* 02 — Hero / Main Invitation Visual */}
        <ScrollReveal>
          <Hero />
        </ScrollReveal>

        {/* 03 — Quote / Quranic Verse */}
        <ScrollReveal delay={0.05}>
          <Quote />
        </ScrollReveal>

        {/* 04 — Couple Profiles */}
        <ScrollReveal delay={0.05}>
          <Couple />
        </ScrollReveal>

        {/* 05 — Countdown & Save the Date */}
        <ScrollReveal delay={0.05}>
          <Countdown />
        </ScrollReveal>

        {/* 06 — Event Details (Akad & Resepsi) */}
        <ScrollReveal delay={0.05}>
          <Event />
        </ScrollReveal>

        {/* 07 — Love Gift & Digital Bank Transfer */}
        <ScrollReveal delay={0.05}>
          <LoveGift />
        </ScrollReveal>


        {/* 10 — Love Story Timeline */}
        <ScrollReveal delay={0.05}>
          <Story />
        </ScrollReveal>

        {/* 11 — RSVP Attendance Confirmation */}
        <ScrollReveal delay={0.05}>
          <RSVP
            onSubmit={handleRSVPSubmit}
            initialName={dbGuestName || ""}
          />
        </ScrollReveal>

        {/* 12 — Guest Book / Wishes Stream */}
        <ScrollReveal delay={0.05}>
          <GuestBook entries={guestEntries} />
        </ScrollReveal>

        {/* 13 — Closing & Gratitude */}
        <ScrollReveal delay={0.05}>
          <Closing />
        </ScrollReveal>

        {/* Structural bottom boundary */}
        <div
          id="invitation-boundary"
          aria-hidden="true"
          className="min-h-[80px] bg-burgundy-900 border-t border-rose-200/10"
        />
      </article>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-burgundy-900 flex items-center justify-center text-white font-sans text-xs tracking-widest uppercase">
          Memuat Undangan...
        </div>
      }
    >
      <WeddingInvitationApp />
    </Suspense>
  );
}
