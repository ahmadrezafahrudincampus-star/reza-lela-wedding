"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Reveal } from "@/components/ui/Reveal";
import {
  WeddingDivider,
  BurgundyPaperPattern,
} from "@/components/ui/Ornaments";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Users,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AttendanceStatus = "hadir" | "tidak-hadir" | "masih-ragu";

interface RSVPFormData {
  name: string;
  attendance: AttendanceStatus | "";
  guestCount: number;
  message: string;
}

interface RSVPEntry extends RSVPFormData {
  attendance: AttendanceStatus;
  id: string;
  timestamp: Date;
}

interface RSVPProps {
  onSubmit?: (entry: RSVPEntry) => void;
  initialName?: string;
}

const MAX_MESSAGE_LENGTH = 500;

const attendanceOptions: {
  value: AttendanceStatus;
  label: string;
  emoji: string;
  color: string;
}[] = [
  { value: "hadir", label: "Hadir", emoji: "✅", color: "bg-emerald-700" },
  {
    value: "tidak-hadir",
    label: "Tidak Hadir",
    emoji: "❌",
    color: "bg-rose-700",
  },
  {
    value: "masih-ragu",
    label: "Masih Ragu",
    emoji: "🤔",
    color: "bg-amber-600",
  },
];

export function RSVP({ onSubmit, initialName = "" }: RSVPProps) {
  const [form, setForm] = useState<RSVPFormData>({
    name: initialName,
    attendance: "",
    guestCount: 1,
    message: "",
  });

  // Sync initialName if provided
  useEffect(() => {
    if (initialName && !form.name) {
      setForm((prev) => ({ ...prev, name: initialName }));
    }
  }, [initialName, form.name]);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (field: keyof RSVPFormData, value: string | number) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (status === "error") setStatus("idle");
    },
    [status]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.name.trim()) {
        setErrorMessage("Nama lengkap wajib diisi.");
        setStatus("error");
        return;
      }
      if (!form.attendance) {
        setErrorMessage("Pilih konfirmasi kehadiran Anda.");
        setStatus("error");
        return;
      }
      if (form.guestCount < 1) {
        setErrorMessage("Jumlah tamu minimal 1 orang.");
        setStatus("error");
        return;
      }

      try {
        const res = await fetch("/api/rsvp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            attendance: form.attendance === "hadir" ? "hadir" : form.attendance === "tidak-hadir" ? "tidak_hadir" : "ragu",
            guestCount: form.guestCount,
            message: form.message,
          }),
        });

        const data = await res.json();
        if (!res.ok || data.error) {
          setErrorMessage(data.error || "Gagal mengirim konfirmasi. Silakan coba lagi.");
          setStatus("error");
          return;
        }

        const entry: RSVPEntry = {
          ...form,
          attendance: form.attendance as AttendanceStatus,
          id: data.rsvp?.id || Date.now().toString(36),
          timestamp: new Date(),
        };

        onSubmit?.(entry);
        setStatus("success");
      } catch {
        setErrorMessage("Terjadi gangguan koneksi. Silakan coba lagi.");
        setStatus("error");
      }
    },
    [form, onSubmit]
  );

  const handleReset = () => {
    setForm({ name: "", attendance: "", guestCount: 1, message: "" });
    setStatus("idle");
    setErrorMessage("");
    setTimeout(() => nameInputRef.current?.focus(), 50);
  };

  return (
    <section
      id="rsvp"
      aria-label="Konfirmasi Kehadiran"
      className="relative w-full bg-burgundy-900 text-white px-5 sm:px-6 py-16 sm:py-24 overflow-hidden"
    >
      <BurgundyPaperPattern opacity="opacity-[0.06]" />

      <div className="relative z-10 max-w-sm mx-auto">
        {/* ── Section Header ──────────────────────────────────────── */}
        <header className="text-center space-y-2 mb-10">
          <Reveal animation="fade" duration={0.8}>
            <p className="font-sans text-[10px] sm:text-[11px] font-medium tracking-[0.3em] uppercase text-rose-200/70">
              Konfirmasi
            </p>
          </Reveal>
          <Reveal animation="fade-up" delay={0.12} duration={0.9}>
            <h2 className="font-script text-5xl sm:text-6xl text-white leading-tight drop-shadow-md my-0.5">
              RSVP
            </h2>
          </Reveal>
          <Reveal animation="fade" delay={0.2} duration={0.8}>
            <WeddingDivider
              color="rgba(254,205,211,0.4)"
              variant="diamond"
              className="max-w-[140px] mx-auto my-1.5 opacity-75"
            />
          </Reveal>
          <Reveal animation="fade-up" delay={0.25} duration={0.8}>
            <p className="font-serif italic text-xs sm:text-sm text-rose-100/70 leading-relaxed px-2">
              Kehadiran Anda adalah kebahagiaan kami. Mohon konfirmasikan
              kehadiran Anda sebelum hari H.
            </p>
          </Reveal>
        </header>

        {/* ── Form / Success State ─────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-center space-y-5 py-8"
            >
              <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto" />
              <div className="space-y-1.5">
                <h3 className="font-serif text-xl font-semibold text-white">
                  Terima Kasih, {form.name.split(" ")[0]}!
                </h3>
                <p className="font-sans text-sm text-rose-100/75 leading-relaxed">
                  Konfirmasi kehadiran Anda telah kami terima. Kami sangat
                  menantikan kehadiran Anda di hari bahagia kami.
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-100 hover:bg-white text-burgundy-950 text-xs font-sans font-semibold tracking-wider uppercase transition-all duration-300 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
              >
                Isi Ulang
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmit}
              className="space-y-5"
              noValidate
            >
              {/* Name */}
              <Reveal animation="fade-up" delay={0.3} duration={0.8}>
                <div className="space-y-1.5">
                  <label
                    htmlFor="rsvp-name"
                    className="flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-rose-200/80"
                  >
                    <User className="w-3.5 h-3.5 shrink-0" />
                    Nama Lengkap
                  </label>
                  <input
                    ref={nameInputRef}
                    id="rsvp-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Masukkan nama lengkap Anda"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    maxLength={100}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white/10 border border-rose-200/30 text-white placeholder-rose-200/40 font-sans text-sm focus:outline-none focus:border-rose-300/70 focus:bg-white/15 transition-all duration-200"
                  />
                </div>
              </Reveal>

              {/* Attendance */}
              <Reveal animation="fade-up" delay={0.38} duration={0.8}>
                <div className="space-y-2">
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-rose-200/80">
                    Konfirmasi Kehadiran
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {attendanceOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleChange("attendance", opt.value)}
                        aria-pressed={form.attendance === opt.value}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 cursor-pointer select-none",
                          form.attendance === opt.value
                            ? `${opt.color} border-transparent text-white shadow-md`
                            : "bg-white/8 border-rose-200/25 text-rose-200/80 hover:bg-white/12 hover:border-rose-200/50"
                        )}
                      >
                        <span className="text-lg" aria-hidden="true">
                          {opt.emoji}
                        </span>
                        <span className="font-sans text-[10px] font-semibold leading-none">
                          {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Guest Count — only shown when "hadir" */}
              <AnimatePresence>
                {form.attendance === "hadir" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <Reveal animation="fade-up" delay={0} duration={0.6}>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="rsvp-guests"
                          className="flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-rose-200/80"
                        >
                          <Users className="w-3.5 h-3.5 shrink-0" />
                          Jumlah Tamu
                        </label>
                        <input
                          id="rsvp-guests"
                          type="number"
                          min={1}
                          max={10}
                          value={form.guestCount}
                          onChange={(e) =>
                            handleChange(
                              "guestCount",
                              Math.max(1, parseInt(e.target.value) || 1)
                            )
                          }
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white/10 border border-rose-200/30 text-white font-sans text-sm focus:outline-none focus:border-rose-300/70 focus:bg-white/15 transition-all duration-200"
                        />
                      </div>
                    </Reveal>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Message / Wishes */}
              <Reveal animation="fade-up" delay={0.45} duration={0.8}>
                <div className="space-y-1.5">
                  <label
                    htmlFor="rsvp-message"
                    className="flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-rose-200/80"
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    Ucapan &amp; Doa
                    <span className="ml-auto font-sans text-[10px] font-normal text-rose-200/40 normal-case tracking-normal">
                      Opsional
                    </span>
                  </label>
                  <textarea
                    id="rsvp-message"
                    rows={4}
                    placeholder="Tuliskan doa dan ucapan terbaik Anda untuk kami..."
                    value={form.message}
                    onChange={(e) =>
                      handleChange(
                        "message",
                        e.target.value.slice(0, MAX_MESSAGE_LENGTH)
                      )
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-rose-200/30 text-white placeholder-rose-200/40 font-sans text-sm resize-none focus:outline-none focus:border-rose-300/70 focus:bg-white/15 transition-all duration-200 leading-relaxed"
                  />
                  <p className="text-right font-sans text-[10px] text-rose-200/40">
                    {form.message.length}/{MAX_MESSAGE_LENGTH}
                  </p>
                </div>
              </Reveal>

              {/* Error Message */}
              <AnimatePresence>
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-900/60 border border-rose-400/40 text-rose-200"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="font-sans text-xs">{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <Reveal animation="fade-up" delay={0.52} duration={0.8}>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className={cn(
                    "w-full min-h-[48px] flex items-center justify-center gap-2.5 rounded-full font-sans text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 active:scale-[0.98] cursor-pointer select-none",
                    status === "submitting"
                      ? "bg-rose-200/20 text-rose-200/60 cursor-not-allowed"
                      : "bg-rose-100 hover:bg-white text-burgundy-950"
                  )}
                >
                  {status === "submitting" ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4 shrink-0 text-rose-200/60"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 shrink-0" />
                      <span>Kirim Konfirmasi</span>
                    </>
                  )}
                </button>
              </Reveal>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default RSVP;
