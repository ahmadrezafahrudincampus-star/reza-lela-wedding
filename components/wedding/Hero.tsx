"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { weddingData } from "@/data/wedding";
import { Reveal } from "@/components/ui/Reveal";
import { WeddingDivider } from "@/components/ui/Ornaments";
import {
  AmbientFloralSway,
  TextShimmer,
} from "@/components/ui/AmbientMotion";
import { cn } from "@/lib/utils";

// ── Slideshow Config ──────────────────────────────────────────────────────────
const SLIDE_INTERVAL = 5000; // ms between slides
const CROSSFADE_DURATION = 1.2; // seconds for crossfade transition

export interface HeroProps {
  className?: string;
}

/**
 * Hero / Main Invitation Visual
 *
 * Background: crossfade slideshow of prewedding photos + parallax scroll.
 * Experimental — can revert by restoring single KenBurnsImage.
 */
export const Hero: React.FC<HeroProps> = ({ className }) => {
  const { invitation, couple, media } = weddingData;
  const sectionRef = useRef<HTMLElement>(null);

  // ── Slideshow state ─────────────────────────────────────────────────────
  const slides = media.slideshow;
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [slides.length]);

  // ── Parallax: background moves slower than scroll ───────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Background translates 0 → -80px as section scrolls out (0.4x speed feel)
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Informasi Utama Mempelai"
      className={cn(
        "relative w-full min-h-[88dvh] sm:min-h-[92dvh] flex flex-col justify-between overflow-hidden bg-white text-center select-none",
        className
      )}
    >
      {/* ── Background: Parallax Slideshow ─────────────────────────── */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        <AnimatePresence>
          <motion.div
            key={`hero-slide-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[currentSlide]}
              alt={`Foto Prewedding ${couple.primaryDisplay} — ${currentSlide + 1}`}
              fill
              priority={currentSlide === 0}
              sizes="(max-width: 480px) 100vw, 480px"
              className="object-cover object-[center_42%] sm:object-[center_38%] blur-[1.5px] grayscale opacity-70 scale-110"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Delicate top gradient for typography contrast */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/85 via-white/30 to-transparent pointer-events-none z-[1]"
        />

        {/* Soft bottom grounding gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/70 via-white/20 to-transparent pointer-events-none z-[1]"
        />
      </motion.div>

      {/* ── Top Typography: Couple Presentation ───────────────────── */}
      <header className="relative z-10 pt-10 sm:pt-14 px-6 sm:px-8">
        <Reveal animation="fade" delay={0.2} duration={0.8}>
          <p className="font-sans text-sm sm:text-base font-semibold tracking-[0.3em] uppercase text-black mb-24">
            {invitation.subTitle}
          </p>
        </Reveal>

        <Reveal animation="fade-up" delay={0.35} duration={1.0}>
          <TextShimmer>
            <h1 className="font-script text-7xl sm:text-8xl text-black leading-tight tracking-normal my-0.5 drop-shadow-sm">
              {couple.primaryDisplay}
            </h1>
          </TextShimmer>
        </Reveal>

        <Reveal animation="fade" delay={0.45} duration={0.8}>
          <div className="flex justify-center my-1">
            <AmbientFloralSway preset="calm">
              <WeddingDivider
                color="#D49CAB"
                variant="minimal"
                className="max-w-[100px] my-0.5 opacity-75"
              />
            </AmbientFloralSway>
          </div>
        </Reveal>

        <Reveal animation="fade-up" delay={0.55} duration={0.8}>
          <p className="font-serif text-base sm:text-lg font-semibold tracking-widest uppercase text-black mt-16">
            {invitation.date}
          </p>
        </Reveal>
      </header>

      {/* ── Bottom Section: Subtle Editorial Scroll Prompt ────────── */}
      <footer className="relative z-10 pb-6 px-6 flex flex-col items-center">
        <Reveal animation="fade" delay={0.7} duration={0.9}>
          <div className="flex flex-col items-center gap-1.5 opacity-80">
            <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-dark-muted/75">
              Gulir
            </span>
            <motion.div
              aria-hidden="true"
              animate={{ y: [0, 4, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "easeInOut",
              }}
              className="w-px h-6 bg-burgundy-400/50"
            />
          </div>
        </Reveal>
      </footer>
    </section>
  );
};

export default Hero;
