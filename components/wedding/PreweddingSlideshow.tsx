"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { weddingData } from "@/data/wedding";
import { cn } from "@/lib/utils";

export interface PreweddingSlideshowProps {
  className?: string;
}

// Timing constants — cinematic, not carousel
const VISIBLE_DURATION_MS = 5000; // how long each photo is visible
const CROSSFADE_DURATION_S = 1.5; // crossfade transition in seconds
const KEN_BURNS_SCALE = 1.02; // very subtle — avoid dizziness
const KEN_BURNS_DURATION_S = 14; // slow breath per frame

/**
 * Chapter 05 — Prewedding Slideshow
 *
 * A cinematic photo interlude placed between major wedding chapters.
 * Crossfades between prewedding photographs with a slow Ken Burns breathing.
 * No carousel movement. No dots. No arrows. The photograph is the focus.
 *
 * Data source: weddingData.media.slideshow
 * Reduced motion: static first image, no animation loop.
 */
export const PreweddingSlideshow: React.FC<PreweddingSlideshowProps> = ({
  className,
}) => {
  const { slideshow } = weddingData.media;
  const prefersReducedMotion = useReducedMotion();

  // Current active index — start at 0, deterministic for SSR
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Only run the auto-advance loop when motion is allowed and we have > 1 image
  useEffect(() => {
    if (prefersReducedMotion || slideshow.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slideshow.length);
    }, VISIBLE_DURATION_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [prefersReducedMotion, slideshow.length]);

  // Guard: nothing to render
  if (!slideshow || slideshow.length === 0) return null;

  return (
    <section
      id="prewedding-slideshow"
      aria-label="Foto Prewedding"
      className={cn(
        // Full-width, portrait aspect ratio — designed for mobile viewing
        "relative w-full overflow-hidden select-none bg-burgundy-900",
        // Aspect ratio: portrait 3:4 — suits the existing 683×1024 images
        "aspect-[3/4]",
        className
      )}
    >
      <AnimatePresence initial={false}>
        {slideshow.map((src, index) => {
          if (index !== activeIndex) return null;

          return (
            <motion.div
              key={src}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0.01 : CROSSFADE_DURATION_S,
                ease: "easeInOut",
              }}
            >
              {/* Ken Burns subtle breathing — disabled under reduced motion */}
              <motion.div
                className="relative w-full h-full"
                animate={
                  prefersReducedMotion
                    ? { scale: 1 }
                    : { scale: [1, KEN_BURNS_SCALE, 1] }
                }
                transition={{
                  duration: KEN_BURNS_DURATION_S,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src={src}
                  alt={`Foto Prewedding ${weddingData.couple.primaryDisplay} — ${index + 1}`}
                  fill
                  // Only eager-load the first frame; rest are lazy
                  loading={index === 0 ? "eager" : "lazy"}
                  priority={index === 0}
                  sizes="(max-width: 480px) 100vw, 480px"
                  className="object-cover object-[center_30%]"
                  draggable={false}
                />
              </motion.div>

              {/* Thin top vignette — keeps the upper edge from feeling cut-off */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-burgundy-900/60 to-transparent pointer-events-none"
              />

              {/* Thin bottom vignette — grounds into the next section */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-burgundy-900/60 to-transparent pointer-events-none"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Minimal position indicators — only dots, no arrows, only if > 1 image */}
      {slideshow.length > 1 && (
        <div
          aria-hidden="true"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10"
        >
          {slideshow.map((_, i) => (
            <span
              key={i}
              className={cn(
                "block rounded-full transition-all duration-700",
                i === activeIndex
                  ? "w-4 h-1.5 bg-white/90"
                  : "w-1.5 h-1.5 bg-white/35"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default PreweddingSlideshow;
