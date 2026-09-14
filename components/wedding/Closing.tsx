"use client";

import React from "react";
import { Reveal } from "@/components/ui/Reveal";
import {
  WeddingDivider,
  MonogramAccent,
  FloralBottomCluster,
  BurgundyPaperPattern,
} from "@/components/ui/Ornaments";
import { AmbientFloralSway } from "@/components/ui/AmbientMotion";
import { weddingData } from "@/data/wedding";
import { Heart } from "lucide-react";

export function Closing() {
  const { couple } = weddingData;

  return (
    <section
      id="closing"
      aria-label="Penutup dan Ucapan Terima Kasih"
      className="relative w-full bg-burgundy-900 text-white px-5 sm:px-6 py-20 sm:py-28 overflow-hidden text-center"
    >
      {/* ── Background Pattern ──────────────────────────────────── */}
      <BurgundyPaperPattern opacity="opacity-[0.06]" />

      <div className="relative z-10 max-w-sm mx-auto space-y-8">
        {/* ── Opening monogram ────────────────────────────────────── */}
        <Reveal animation="zoom-in" delay={0} duration={1.1}>
          <MonogramAccent
            initials={`${couple.monogram.groomInitial} ${couple.monogram.separator} ${couple.monogram.brideInitial}`}
            textColor="text-rose-200"
            lineColor="rgba(254,205,211,0.5)"
          />
        </Reveal>

        {/* ── Couple Script Names ──────────────────────────────────── */}
        <Reveal animation="fade-up" delay={0.18} duration={1.0}>
          <div className="space-y-0.5">
            <p className="font-sans text-[10px] font-medium tracking-[0.32em] uppercase text-rose-200/60">
              The Wedding of
            </p>
            <h2 className="font-script text-5xl sm:text-6xl text-white leading-tight drop-shadow-md">
              {couple.bride.nickname} &amp; {couple.groom.nickname}
            </h2>
            <p className="font-sans text-xs tracking-widest text-rose-200/60">
              {weddingData.invitation.date}
            </p>
          </div>
        </Reveal>

        {/* ── Divider ─────────────────────────────────────────────── */}
        <Reveal animation="fade" delay={0.28} duration={0.9}>
          <WeddingDivider
            color="rgba(254,205,211,0.4)"
            variant="diamond"
            className="max-w-[160px] mx-auto opacity-70"
          />
        </Reveal>

        {/* ── Closing Prayer ──────────────────────────────────────── */}
        <Reveal animation="fade-up" delay={0.35} duration={0.9}>
          <p className="font-serif italic text-sm sm:text-base text-rose-100/85 leading-loose px-2">
            &ldquo;Maha Suci Allah yang telah menciptakan pasangan-pasangan,
            baik dari apa yang ditumbuhkan bumi, maupun dari diri mereka
            sendiri, maupun dari apa yang tidak mereka ketahui.&rdquo;
          </p>
          <p className="font-sans text-[10px] text-rose-200/50 tracking-widest mt-2">
            — QS. Yasin : 36 —
          </p>
        </Reveal>

        {/* ── Thank You Note ──────────────────────────────────────── */}
        <Reveal animation="fade-up" delay={0.42} duration={0.9}>
          <div className="space-y-3 px-2">
            <div className="flex justify-center">
              <Heart className="w-5 h-5 text-rose-300 fill-rose-300 opacity-80" />
            </div>
            <p className="font-serif text-sm sm:text-base text-rose-100/80 leading-relaxed">
              Dengan segala kerendahan hati, kami mengucapkan terima kasih
              yang sebesar-besarnya atas doa, ucapan, dan kehadiran
              Bapak/Ibu/Saudara/i yang telah menjadi bagian dari hari istimewa
              kami.
            </p>
            <p className="font-serif italic text-sm text-rose-100/70 leading-relaxed">
              Semoga Allah SWT membalas kebaikan Anda dengan keberkahan yang
              berlipat ganda.
            </p>
          </div>
        </Reveal>

        {/* ── Family signatures ───────────────────────────────────── */}
        <Reveal animation="zoom-in-up" delay={0.5} duration={0.9}>
          <div className="space-y-4 pt-2">
            <WeddingDivider
              color="rgba(254,205,211,0.3)"
              variant="minimal"
              className="max-w-[120px] mx-auto opacity-50"
            />

            <div className="space-y-1">
              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-rose-200/50">
                Mempelai
              </p>
              <p className="font-script text-3xl sm:text-4xl text-white/90 leading-tight">
                {couple.bride.nickname} &amp; {couple.groom.nickname}
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-rose-200/50">
                Keluarga Besar
              </p>
              <p className="font-serif text-xs text-rose-100/65 leading-relaxed">
                Bpk. {couple.groom.fatherName} &amp; Ibu {couple.groom.motherName}
                <br />
                Bpk. {couple.bride.fatherName} &amp; Ibu {couple.bride.motherName}
              </p>
            </div>
          </div>
        </Reveal>

        {/* ── Decorative floral close ──────────────────────────────── */}
        <Reveal animation="fade" delay={0.6} duration={1.1}>
          <div className="pt-4 flex flex-col items-center gap-6">
            <AmbientFloralSway preset="gentle">
              <FloralBottomCluster
                color="rgba(254, 205, 211, 0.35)"
                width={160}
                height={36}
              />
            </AmbientFloralSway>

            {/* Creator watermark */}
            <p className="font-sans text-[10px] text-rose-200/25 tracking-widest select-none">
              Made with ♥ — Digital Wedding Invitation
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Closing;
