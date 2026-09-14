"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { weddingData } from "@/data/wedding";
import { Reveal } from "@/components/ui/Reveal";
import {
  WeddingDivider,
  BurgundyPaperPattern,
  FloralBottomCluster,
} from "@/components/ui/Ornaments";
import {
  AmbientGoldParticles,
  AmbientFloralSway,
} from "@/components/ui/AmbientMotion";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CountdownProps {
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}

function calculateTimeRemaining(targetIsoDate: string): TimeRemaining {
  // Parses ISO-8601 string containing +07:00 timezone (Asia/Jakarta)
  const targetTime = new Date(targetIsoDate).getTime();
  const now = Date.now();
  const diff = targetTime - now;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isCompleted: true,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    isCompleted: false,
  };
}

interface CountdownUnitProps {
  value: number;
  label: string;
}

const CountdownUnit: React.FC<CountdownUnitProps> = ({ value, label }) => {
  const prefersReducedMotion = useReducedMotion();
  const formatted = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center justify-center py-4 px-1 rounded-xl bg-burgundy-950/70 border border-rose-200/25 shadow-[0_4px_16px_rgba(0,0,0,0.3)] backdrop-blur-sm">
      <div className="relative h-9 sm:h-10 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={formatted}
            suppressHydrationWarning
            initial={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 0.3, y: -4 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0.3, y: 4 }
            }
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="font-serif text-3xl sm:text-4xl font-light text-rose-50 leading-none"
          >
            {formatted}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="font-sans text-[9px] uppercase tracking-[0.22em] text-rose-200/80 mt-1.5 font-medium">
        {label}
      </span>
    </div>
  );
};

/**
 * Chapter 04: Save the Date & Countdown Section
 *
 * Implements a deep burgundy stationery chapter with watermarked paper texture,
 * large editorial script typography, luminous countdown units, and calendar action.
 */
export const Countdown: React.FC<CountdownProps> = ({ className }) => {
  const { countdown, invitation } = weddingData;
  const [time, setTime] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(countdown.targetDate)
  );

  useEffect(() => {
    // Synchronize client-side interval every second
    const interval = setInterval(() => {
      setTime(calculateTimeRemaining(countdown.targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown.targetDate]);

  return (
    <section
      id="countdown"
      aria-label="Hitung Mundur Acara"
      className={cn(
        "relative w-full bg-burgundy-900 text-white px-6 py-16 sm:py-24 text-center select-none overflow-hidden",
        className
      )}
    >
      {/* ── Subtle Background Watermarked Stationery Pattern ──────── */}
      <BurgundyPaperPattern opacity="opacity-[0.07]" />

      {/* ── Ambient Champagne / Gold Micro-Particles ─────────────── */}
      <AmbientGoldParticles count={8} />

      <div className="relative z-10 max-w-sm mx-auto space-y-7">
        {/* ── Header: Save the Date Editorial Heading ──────────────── */}
        <header className="space-y-2">
          <Reveal animation="fade" duration={0.8}>
            <p className="font-sans text-[10px] sm:text-[11px] font-medium tracking-[0.3em] uppercase text-rose-200/85">
              Save the Date
            </p>
          </Reveal>

          <Reveal animation="fade-up" delay={0.12} duration={0.9}>
            <h2 className="font-script text-5xl sm:text-6xl text-white leading-tight drop-shadow-md my-0.5">
              Menuju Hari Bahagia
            </h2>
          </Reveal>

          <Reveal animation="fade" delay={0.2} duration={0.8}>
            <WeddingDivider
              color="rgba(254, 205, 211, 0.4)"
              variant="diamond"
              className="max-w-[140px] my-1.5 opacity-75"
            />
          </Reveal>

          <Reveal animation="fade-up" delay={0.25} duration={0.8}>
            <p className="font-serif italic text-xs sm:text-sm text-rose-100/80 leading-relaxed px-2">
              Dengan penuh rasa syukur, kami menantikan kehadiran Anda
            </p>
          </Reveal>
        </header>

        {/* ── Four Countdown Displays ───────────────────────────────── */}
        <Reveal animation="zoom-in" delay={0.3} duration={0.9}>
          {time.isCompleted ? (
            <div className="py-4 px-6 rounded-2xl bg-burgundy-950/80 border border-rose-200/30 shadow-lg text-rose-100 font-serif text-base font-medium max-w-xs mx-auto my-6">
              Acara sedang berlangsung
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 sm:gap-3 my-6">
              <CountdownUnit value={time.days} label="Hari" />
              <CountdownUnit value={time.hours} label="Jam" />
              <CountdownUnit value={time.minutes} label="Menit" />
              <CountdownUnit value={time.seconds} label="Detik" />
            </div>
          )}
        </Reveal>

        {/* ── Date representation & Calendar Action ─────────────────── */}
        <footer className="space-y-4 pt-1">
          <Reveal animation="fade" delay={0.4} duration={0.8}>
            <p className="font-serif text-sm sm:text-base text-rose-100/90 tracking-wide">
              {invitation.date}
            </p>
          </Reveal>

          {countdown.calendarUrl && (
            <Reveal animation="fade-up" delay={0.48} duration={0.8}>
              <a
                href={countdown.calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Simpan tanggal pernikahan ke Google Calendar"
                className="inline-flex items-center justify-center gap-2.5 min-h-[44px] px-7 py-3 rounded-full bg-rose-100 hover:bg-white active:scale-[0.97] text-burgundy-950 border border-rose-200/70 shadow-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 select-none cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-burgundy-950 shrink-0" />
                <span className="font-sans text-xs font-semibold tracking-wider uppercase text-burgundy-950 opacity-100">
                  Simpan Tanggal
                </span>
              </a>
            </Reveal>
          )}

          {/* ── Closing Botanical Cluster into Event ───────────────── */}
          <Reveal animation="fade" delay={0.55} duration={1.0}>
            <div className="pt-6 flex justify-center">
              <AmbientFloralSway preset="gentle">
                <FloralBottomCluster
                  color="rgba(254, 205, 211, 0.4)"
                  width={150}
                  height={32}
                />
              </AmbientFloralSway>
            </div>
          </Reveal>
        </footer>
      </div>
    </section>
  );
};

export default Countdown;
