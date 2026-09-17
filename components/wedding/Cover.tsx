"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { weddingData } from "@/data/wedding";
import { MailOpen } from "lucide-react";
import { BreathingCTA } from "@/components/ui/AmbientMotion";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface CoverProps {
  onOpen: () => void;
  guestName?: string;
  isOpening?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const EASE_SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Delay (ms) before text/button fades in after floral entry + sway starts
const TEXT_APPEAR_DELAY = 2600;

// ─────────────────────────────────────────────────────────────────────────────
// Floral Corner Layers
// ─────────────────────────────────────────────────────────────────────────────

interface FloralLayer {
  id: string;
  src: string;
  alt: string;
  positionClass: string;
  entryInitial: { opacity: number; scale: number; x: number; y: number };
  entryDelay: number;
  swayDelay: number;
  swayRotate: [number, number, number];
  swayY: [number, number, number];
  swayDuration: number;
  transformOrigin: string;
  imgClass: string;
}

const FLORAL_LAYERS: FloralLayer[] = [
  {
    id: "bunga-kiri-atas",
    src: "/images/bunga-kiri.png",
    alt: "Ornamen bunga kiri atas",
    positionClass: "absolute -top-[22px] -left-[32px] pointer-events-none",
    entryInitial: { opacity: 0, scale: 0.75, x: -40, y: -40 },
    entryDelay: 0.15,
    swayDelay: 1.1,
    swayRotate: [-4.0, 4.0, -4.0],
    swayY: [0, -6, 0],
    swayDuration: 2.8,
    transformOrigin: "top left",
    imgClass: "w-[58vw] max-w-[270px] h-auto",
  },
  {
    id: "bunga-kanan-atas",
    src: "/images/bunga-kanan.png",
    alt: "Ornamen bunga kanan atas",
    positionClass: "absolute -top-[22px] -right-[32px] pointer-events-none",
    entryInitial: { opacity: 0, scale: 0.75, x: 40, y: -40 },
    entryDelay: 0.25,
    swayDelay: 1.2,
    swayRotate: [4.0, -4.0, 4.0],
    swayY: [0, -6, 0],
    swayDuration: 3.2,
    transformOrigin: "top right",
    imgClass: "w-[58vw] max-w-[270px] h-auto",
  },
  {
    id: "bunga-kiri-bawah",
    src: "/images/bunga-kiri-bawah.png",
    alt: "Ornamen bunga kiri bawah",
    positionClass: "absolute -bottom-[22px] -left-[12px] pointer-events-none",
    entryInitial: { opacity: 0, scale: 0.75, x: -40, y: 40 },
    entryDelay: 0.35,
    swayDelay: 1.3,
    swayRotate: [-3.5, 3.5, -3.5],
    swayY: [0, -5, 0],
    swayDuration: 3.0,
    transformOrigin: "bottom left",
    imgClass: "w-[58vw] max-w-[260px] h-auto",
  },
  {
    id: "bunga-kanan-bawah",
    src: "/images/bunga-kanan-bawah.png",
    alt: "Ornamen bunga kanan bawah",
    positionClass: "absolute -bottom-[22px] -right-[12px] pointer-events-none",
    entryInitial: { opacity: 0, scale: 0.75, x: 40, y: 40 },
    entryDelay: 0.45,
    swayDelay: 1.4,
    swayRotate: [3.5, -3.5, 3.5],
    swayY: [0, -5, 0],
    swayDuration: 2.6,
    transformOrigin: "bottom right",
    imgClass: "w-[58vw] max-w-[260px] h-auto",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Cover Component
// ─────────────────────────────────────────────────────────────────────────────

export const Cover: React.FC<CoverProps> = ({
  onOpen,
  guestName,
  isOpening = false,
}) => {
  const { invitation, couple, recipient } = weddingData;
  const prefersReducedMotion = useReducedMotion();

  const displayedGuest = guestName?.trim() || "";

  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setTextVisible(true);
      return;
    }
    const timer = setTimeout(() => setTextVisible(true), TEXT_APPEAR_DELAY);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  return (
    <div
      className="relative w-full min-h-[100dvh] flex flex-col overflow-hidden bg-burgundy-900 text-white select-none"
      aria-label="Cover undangan pernikahan"
    >
      {/* ═══════════════════════════════════════════════════════════════════
          LAYER 1 — Podium / Arch Frame (fills entire screen)
          Positioned as the primary ornamental backdrop — enters with
          a zoom-in from center.
      ═══════════════════════════════════════════════════════════════════ */}
      <motion.div
        className="absolute inset-0 z-[5] pointer-events-none"
        initial={
          prefersReducedMotion
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.92 }
        }
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.05, ease: EASE_SMOOTH }}
      >
        <Image
          src="/images/podium.png"
          alt="Frame arch ornamen pernikahan"
          fill
          className="object-fill"
          priority
          draggable={false}
          sizes="(max-width: 480px) 100vw, 480px"
        />
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════
          LAYER 2 — Floral Corner Decorations (z-10, above arch)
          Each flower slides in from its corner, then sways continuously.
      ═══════════════════════════════════════════════════════════════════ */}
      {FLORAL_LAYERS.map((layer) => (
        <motion.div
          key={layer.id}
          className={`${layer.positionClass} z-[10]`}
          initial={
            prefersReducedMotion
              ? { opacity: 1, scale: 1, x: 0, y: 0 }
              : layer.entryInitial
          }
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          transition={{
            duration: 0.95,
            delay: layer.entryDelay,
            ease: EASE_SMOOTH,
          }}
        >
          {/* Inner div: ambient sway starts after entry completes */}
          <motion.div
            style={{ transformOrigin: layer.transformOrigin }}
            animate={
              prefersReducedMotion
                ? {}
                : { rotate: layer.swayRotate, y: layer.swayY }
            }
            transition={{
              duration: layer.swayDuration,
              delay: layer.swayDelay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src={layer.src}
              alt={layer.alt}
              width={220}
              height={220}
              className={layer.imgClass}
              priority
              draggable={false}
            />
          </motion.div>
        </motion.div>
      ))}

      {/* ═══════════════════════════════════════════════════════════════════
          LAYER 3 — Text Content (z-30, inside arch opening)
          Two-zone layout:
            • Upper zone (flex-1): couple names — floats in center of arch
            • Lower zone (pinned): guest card + button — anchored to bottom
          Exit animation when "Buka Undangan" is clicked.
      ═══════════════════════════════════════════════════════════════════ */}
      <motion.div
        className="relative z-[30] flex-1 flex flex-col"
        animate={
          isOpening && !prefersReducedMotion
            ? { opacity: 0, y: -28, scale: 0.97 }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: 0.55, ease: EASE_SMOOTH }}
      >
        {/* ── ZONE A: Couple Names — centered in upper arch area ──── */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pt-10">
          <motion.div
            className="mt-[200px]"
            initial={{ opacity: 0, y: 36 }}
            animate={textVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
            transition={{ duration: 1.0, ease: EASE_SMOOTH }}
          >
            {/* "The Wedding of" label */}
            <p className="font-sans text-[11px] uppercase tracking-[0.35em] text-white/75 mb-3 relative -top-[28px]">
              {invitation.subTitle}
            </p>

            {/* Groom name */}
            <h1 className="font-script text-[72px] sm:text-[84px] text-white leading-none drop-shadow-lg">
              {couple.groom.nickname}
            </h1>

            {/* Ampersand */}
            <p className="font-script text-[48px] sm:text-[56px] text-white/90 leading-none my-1 drop-shadow">
              &amp;
            </p>

            {/* Bride name */}
            <h1 className="font-script text-[72px] sm:text-[84px] text-white leading-none drop-shadow-lg">
              {couple.bride.nickname}
            </h1>

            {/* Date — bold monospaced */}
            <p className="font-sans font-bold text-sm tracking-[0.4em] text-white/85 mt-4">
              26 . 09 . 2026
            </p>
          </motion.div>
        </div>

        {/* ── ZONE B: Guest Card + Button — pinned to bottom ──────── */}
        <div className="flex flex-col items-center gap-4 px-6 pb-10">
          {/* Guest Personalization Badge */}
          <motion.div
            className="w-full max-w-[300px]"
            initial={{ opacity: 0, y: 28 }}
            animate={textVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE_SMOOTH }}
          >
            <div className="bg-black/35 backdrop-blur-sm rounded-xl border border-white/15 px-5 py-4 text-center shadow-lg">
              <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-burgundy-200/80">
                {recipient.greeting}
              </p>
              <p className="font-sans text-[10px] text-burgundy-200/60 mt-0.5">
                di tempat
              </p>
              {displayedGuest ? (
                <>
                  <p className="font-serif text-lg sm:text-xl font-semibold text-white mt-1.5 leading-snug break-words">
                    {displayedGuest}
                  </p>
                  {recipient.disclaimer && (
                    <p className="font-sans text-[9px] text-white/45 mt-1.5 leading-normal">
                      {recipient.disclaimer}
                    </p>
                  )}
                </>
              ) : null}
            </div>
          </motion.div>

          {/* "Buka Undangan" CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={textVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            transition={{ duration: 0.9, delay: 0.55, ease: EASE_SMOOTH }}
          >
            <BreathingCTA disabled={isOpening}>
              <button
                type="button"
                onClick={onOpen}
                disabled={isOpening}
                aria-label="Buka undangan pernikahan Reza dan Lela"
                className="group inline-flex items-center justify-center gap-2.5 min-h-[48px] px-8 py-3.5 rounded-full bg-burgundy-500 hover:bg-burgundy-400 active:scale-[0.97] text-white font-sans text-xs tracking-widest uppercase font-semibold shadow-xl border border-white/25 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-200 focus-visible:ring-offset-2 focus-visible:ring-offset-burgundy-900 cursor-pointer select-none disabled:pointer-events-none disabled:opacity-60"
              >
                <MailOpen className="w-4 h-4 text-white/90 transition-transform duration-300 group-hover:-translate-y-0.5 shrink-0" />
                <span className="font-semibold tracking-widest">
                  Buka Undangan
                </span>
              </button>
            </BreathingCTA>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Cover;
