"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// ScrollReveal — Experimental Scroll-Triggered Section Reveal
//
// Wraps any section with a clip-path "wipe from bottom" reveal animation.
// When the section enters the viewport, it slides upward into view like a
// curtain being pulled away.
//
// TO REMOVE THIS EFFECT:
//   1. Delete this file
//   2. In page.tsx, remove all <ScrollReveal> wrappers and the import
//   3. The underlying sections are untouched
// ─────────────────────────────────────────────────────────────────────────────

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Extra delay in seconds before the reveal starts (for stagger feel) */
  delay?: number;
  /** How much of the section must be visible before triggering (0–1) */
  threshold?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  delay = 0,
  threshold = 0.08,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: threshold,
  });

  return (
    // Outer div: clips overflow so the wipe doesn't bleed outside
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div
        // Start: hidden below its own bottom edge (clip from bottom)
        initial={{
          clipPath: "inset(100% 0% 0% 0%)",
          opacity: 0,
        }}
        // End: fully revealed
        animate={
          isInView
            ? {
                clipPath: "inset(0% 0% 0% 0%)",
                opacity: 1,
              }
            : {
                clipPath: "inset(100% 0% 0% 0%)",
                opacity: 0,
              }
        }
        transition={{
          clipPath: {
            duration: 0.9,
            delay,
            ease: [0.25, 1, 0.5, 1], // snappy deceleration
          },
          opacity: {
            duration: 0.5,
            delay,
            ease: "easeOut",
          },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollReveal;
