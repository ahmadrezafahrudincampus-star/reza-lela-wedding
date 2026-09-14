"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OrnamentBaseProps {
  className?: string;
  color?: string;
}

/**
 * WeddingDivider
 * A refined horizontal divider with hairline lines and a center diamond/flourish motif.
 */
export const WeddingDivider: React.FC<
  OrnamentBaseProps & { variant?: "diamond" | "leaf" | "minimal" }
> = ({ className, color = "currentColor", variant = "diamond" }) => {
  const prefersReducedMotion = useReducedMotion();

  const drawTransition = {
    duration: prefersReducedMotion ? 0.01 : 1.1,
    ease: [0.22, 1, 0.36, 1],
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center w-full max-w-[240px] mx-auto my-4 select-none opacity-80",
        className
      )}
    >
      <svg
        viewBox="0 0 240 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-4 overflow-visible"
      >
        {/* Left hairline */}
        <motion.line
          x1="10"
          y1="10"
          x2="95"
          y2="10"
          stroke={color}
          strokeWidth="0.75"
          strokeDasharray="none"
          initial={prefersReducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.7 }}
          viewport={{ once: true }}
          transition={drawTransition}
        />

        {/* Center decorative motif */}
        {variant === "diamond" && (
          <g>
            {/* Flanking dots */}
            <motion.circle
              cx="103"
              cy="10"
              r="1"
              fill={color}
              initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 0.7 }}
              viewport={{ once: true }}
              transition={{ ...drawTransition, delay: 0.2 }}
            />
            {/* Center diamond */}
            <motion.polygon
              points="120,5 125,10 120,15 115,10"
              stroke={color}
              strokeWidth="0.75"
              fill="transparent"
              initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 0.85 }}
              viewport={{ once: true }}
              transition={{ ...drawTransition, delay: 0.25 }}
            />
            <motion.circle
              cx="120"
              cy="10"
              r="1.2"
              fill={color}
              initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 0.85 }}
              viewport={{ once: true }}
              transition={{ ...drawTransition, delay: 0.3 }}
            />
            <motion.circle
              cx="137"
              cy="10"
              r="1"
              fill={color}
              initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 0.7 }}
              viewport={{ once: true }}
              transition={{ ...drawTransition, delay: 0.2 }}
            />
          </g>
        )}

        {variant === "leaf" && (
          <g>
            {/* Center leaf sprig */}
            <motion.path
              d="M 112 10 C 116 7 124 7 128 10 C 124 13 116 13 112 10 Z"
              stroke={color}
              strokeWidth="0.75"
              fill="transparent"
              initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 0.85, scale: 1 }}
              viewport={{ once: true }}
              transition={drawTransition}
            />
            <motion.circle
              cx="120"
              cy="10"
              r="1"
              fill={color}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 0.9 }}
              viewport={{ once: true }}
              transition={{ ...drawTransition, delay: 0.2 }}
            />
          </g>
        )}

        {variant === "minimal" && (
          <motion.circle
            cx="120"
            cy="10"
            r="1.75"
            fill={color}
            initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.8 }}
            viewport={{ once: true }}
            transition={drawTransition}
          />
        )}

        {/* Right hairline */}
        <motion.line
          x1="145"
          y1="10"
          x2="230"
          y2="10"
          stroke={color}
          strokeWidth="0.75"
          initial={prefersReducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.7 }}
          viewport={{ once: true }}
          transition={drawTransition}
        />
      </svg>
    </div>
  );
};

/**
 * BotanicalSprig
 * A delicate, hand-drawn vector botanical sprig with fine leaves.
 */
export const BotanicalSprig: React.FC<
  OrnamentBaseProps & { width?: number; height?: number }
> = ({ className, color = "currentColor", width = 120, height = 28 }) => {
  const prefersReducedMotion = useReducedMotion();

  const drawTransition = {
    duration: prefersReducedMotion ? 0.01 : 1.3,
    ease: [0.22, 1, 0.36, 1],
  };

  return (
    <div
      aria-hidden="true"
      className={cn("flex justify-center select-none opacity-80", className)}
    >
      <svg
        viewBox="0 0 120 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width, height }}
        className="overflow-visible"
      >
        {/* Central stem */}
        <motion.path
          d="M 15 14 Q 60 10 105 14"
          stroke={color}
          strokeWidth="0.75"
          strokeLinecap="round"
          initial={prefersReducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.75 }}
          viewport={{ once: true }}
          transition={drawTransition}
        />

        {/* Upper leaves */}
        <motion.path
          d="M 38 12.5 C 40 6 48 7 51 12 M 68 11.5 C 70 5 78 6 81 12"
          stroke={color}
          strokeWidth="0.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={prefersReducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.8 }}
          viewport={{ once: true }}
          transition={{ ...drawTransition, delay: 0.2 }}
        />

        {/* Lower leaves */}
        <motion.path
          d="M 45 13.5 C 47 20 55 19 57 14 M 76 13.5 C 78 20 86 19 88 14"
          stroke={color}
          strokeWidth="0.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={prefersReducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.8 }}
          viewport={{ once: true }}
          transition={{ ...drawTransition, delay: 0.3 }}
        />

        {/* Terminal tip leaf */}
        <motion.path
          d="M 105 14 C 109 11 114 13 117 14 C 114 15 109 17 105 14 Z"
          stroke={color}
          strokeWidth="0.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.85 }}
          viewport={{ once: true }}
          transition={{ ...drawTransition, delay: 0.4 }}
        />
      </svg>
    </div>
  );
};

/**
 * VerticalTimelineLine
 * An animated vertical hairline with a center decorative node connecting sequential schedule events.
 */
export const VerticalTimelineLine: React.FC<
  OrnamentBaseProps & { height?: number }
> = ({ className, color = "currentColor", height = 72 }) => {
  const prefersReducedMotion = useReducedMotion();

  const transition = {
    duration: prefersReducedMotion ? 0.01 : 1.2,
    ease: [0.22, 1, 0.36, 1],
  };

  return (
    <div
      aria-hidden="true"
      className={cn("flex justify-center select-none", className)}
    >
      <svg
        viewBox="0 0 20 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height, width: 20 }}
        className="overflow-visible"
      >
        {/* Top vertical hairline */}
        <motion.line
          x1="10"
          y1="0"
          x2="10"
          y2="32"
          stroke={color}
          strokeWidth="0.75"
          strokeDasharray="2 2"
          initial={prefersReducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.7 }}
          viewport={{ once: true }}
          transition={transition}
        />

        {/* Center diamond node */}
        <motion.polygon
          points="10,34 14,40 10,46 6,40"
          stroke={color}
          strokeWidth="0.75"
          fill="transparent"
          initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.9 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.3 }}
        />
        <motion.circle
          cx="10"
          cy="40"
          r="1.2"
          fill={color}
          initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.9 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.35 }}
        />

        {/* Bottom vertical hairline */}
        <motion.line
          x1="10"
          y1="48"
          x2="10"
          y2="80"
          stroke={color}
          strokeWidth="0.75"
          strokeDasharray="2 2"
          initial={prefersReducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.7 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.4 }}
        />
      </svg>
    </div>
  );
};

/**
 * MonogramAccent
 * An elegant monogram insignia for couple initials with fine hairline wings.
 */
export const MonogramAccent: React.FC<{
  initials: string;
  className?: string;
  textColor?: string;
  lineColor?: string;
}> = ({
  initials,
  className,
  textColor = "text-burgundy-700",
  lineColor = "#D49CAB",
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center gap-3 select-none",
        className
      )}
    >
      {/* Left wing line */}
      <motion.svg
        viewBox="0 0 40 10"
        fill="none"
        className="w-8 sm:w-10 h-2.5 overflow-visible"
      >
        <motion.line
          x1="0"
          y1="5"
          x2="36"
          y2="5"
          stroke={lineColor}
          strokeWidth="0.75"
          initial={prefersReducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.7 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.circle
          cx="38"
          cy="5"
          r="1"
          fill={lineColor}
          initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.8 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
      </motion.svg>

      {/* Initials in romantic calligraphy */}
      <span className={cn("font-script text-2xl sm:text-3xl leading-none", textColor)}>
        {initials}
      </span>

      {/* Right wing line */}
      <motion.svg
        viewBox="0 0 40 10"
        fill="none"
        className="w-8 sm:w-10 h-2.5 overflow-visible"
      >
        <motion.circle
          cx="2"
          cy="5"
          r="1"
          fill={lineColor}
          initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.8 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
        <motion.line
          x1="4"
          y1="5"
          x2="40"
          y2="5"
          stroke={lineColor}
          strokeWidth="0.75"
          initial={prefersReducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.7 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.svg>
    </div>
  );
};

/**
 * BurgundyPaperPattern
 * A subtle, watermarked stationery texture for deep burgundy chapters.
 * Adds tactile depth without competing with typography.
 */
export const BurgundyPaperPattern: React.FC<{
  className?: string;
  opacity?: string;
}> = ({ className, opacity = "opacity-[0.06]" }) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 pointer-events-none select-none overflow-hidden",
        opacity,
        className
      )}
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="stationery-pattern"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            {/* Subtle diamond lattice */}
            <path
              d="M 24 0 L 48 24 L 24 48 L 0 24 Z"
              fill="none"
              stroke="#FFF"
              strokeWidth="0.5"
              strokeOpacity="0.7"
            />
            {/* Center leaf motif */}
            <circle cx="24" cy="24" r="1.5" fill="#FFF" fillOpacity="0.8" />
            <path
              d="M 24 16 C 27 20 27 28 24 32 C 21 28 21 20 24 16 Z"
              fill="none"
              stroke="#FFF"
              strokeWidth="0.4"
              strokeOpacity="0.6"
            />
            <path
              d="M 16 24 C 20 21 28 21 32 24 C 28 27 20 27 16 24 Z"
              fill="none"
              stroke="#FFF"
              strokeWidth="0.4"
              strokeOpacity="0.6"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#stationery-pattern)" />
      </svg>
    </div>
  );
};

export type CornerPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

/**
 * FloralCorner
 * Delicate botanical corner flourish designed for stationery card frames.
 */
export const FloralCorner: React.FC<{
  position?: CornerPosition;
  className?: string;
  color?: string;
  size?: number;
}> = ({
  position = "top-left",
  className,
  color = "rgba(254, 205, 211, 0.45)",
  size = 54,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const positionClasses: Record<CornerPosition, string> = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 scale-x-[-1]",
    "bottom-left": "bottom-0 left-0 scale-y-[-1]",
    "bottom-right": "bottom-0 right-0 scale-[-1]",
  };

  const drawTransition = {
    duration: prefersReducedMotion ? 0.01 : 1.2,
    ease: [0.22, 1, 0.36, 1],
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute pointer-events-none select-none z-10",
        positionClasses[position],
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        {/* Outer corner frame bracket */}
        <motion.path
          d="M 2 28 L 2 8 C 2 4.7 4.7 2 8 2 L 28 2"
          stroke={color}
          strokeWidth="0.75"
          fill="none"
          initial={prefersReducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.8 }}
          viewport={{ once: true }}
          transition={drawTransition}
        />

        {/* Botanical curving vine */}
        <motion.path
          d="M 6 6 Q 16 16 38 20"
          stroke={color}
          strokeWidth="0.75"
          strokeLinecap="round"
          fill="none"
          initial={prefersReducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.75 }}
          viewport={{ once: true }}
          transition={{ ...drawTransition, delay: 0.15 }}
        />

        {/* Delicate leaves */}
        <motion.path
          d="M 16 11 C 18 5 25 6 26 12 M 11 16 C 5 18 6 25 12 26"
          stroke={color}
          strokeWidth="0.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={prefersReducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.8 }}
          viewport={{ once: true }}
          transition={{ ...drawTransition, delay: 0.25 }}
        />

        {/* Tendril leaf tip */}
        <motion.path
          d="M 25 18 Q 34 16 42 10 C 42 15 37 19 30 19"
          stroke={color}
          strokeWidth="0.75"
          strokeLinecap="round"
          fill="none"
          initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.8 }}
          viewport={{ once: true }}
          transition={{ ...drawTransition, delay: 0.35 }}
        />

        {/* Corner floral bud accent */}
        <motion.circle
          cx="17"
          cy="17"
          r="1.5"
          fill={color}
          initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.9 }}
          viewport={{ once: true }}
          transition={{ ...drawTransition, delay: 0.3 }}
        />
      </svg>
    </div>
  );
};

/**
 * FloralBottomCluster
 * Elegant botanical horizontal spray for stationery card bases.
 */
export const FloralBottomCluster: React.FC<
  OrnamentBaseProps & { width?: number; height?: number }
> = ({ className, color = "rgba(254, 205, 211, 0.45)", width = 160, height = 36 }) => {
  const prefersReducedMotion = useReducedMotion();

  const drawTransition = {
    duration: prefersReducedMotion ? 0.01 : 1.25,
    ease: [0.22, 1, 0.36, 1],
  };

  return (
    <div
      aria-hidden="true"
      className={cn("flex justify-center select-none", className)}
    >
      <svg
        viewBox="0 0 160 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width, height }}
        className="overflow-visible"
      >
        {/* Left branch */}
        <motion.path
          d="M 75 18 Q 42 12 10 22"
          stroke={color}
          strokeWidth="0.75"
          strokeLinecap="round"
          fill="none"
          initial={prefersReducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.75 }}
          viewport={{ once: true }}
          transition={drawTransition}
        />
        <motion.path
          d="M 52 15 C 50 8 42 9 40 14 M 30 17 C 28 10 20 11 19 16"
          stroke={color}
          strokeWidth="0.75"
          strokeLinecap="round"
          fill="none"
          initial={prefersReducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.8 }}
          viewport={{ once: true }}
          transition={{ ...drawTransition, delay: 0.2 }}
        />

        {/* Center bud & diamond motif */}
        <motion.polygon
          points="80,11 85,18 80,25 75,18"
          stroke={color}
          strokeWidth="0.75"
          fill="none"
          initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.9 }}
          viewport={{ once: true }}
          transition={{ ...drawTransition, delay: 0.25 }}
        />
        <motion.circle
          cx="80"
          cy="18"
          r="1.5"
          fill={color}
          initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.95 }}
          viewport={{ once: true }}
          transition={{ ...drawTransition, delay: 0.3 }}
        />

        {/* Right branch */}
        <motion.path
          d="M 85 18 Q 118 12 150 22"
          stroke={color}
          strokeWidth="0.75"
          strokeLinecap="round"
          fill="none"
          initial={prefersReducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.75 }}
          viewport={{ once: true }}
          transition={drawTransition}
        />
        <motion.path
          d="M 108 15 C 110 8 118 9 120 14 M 130 17 C 132 10 140 11 141 16"
          stroke={color}
          strokeWidth="0.75"
          strokeLinecap="round"
          fill="none"
          initial={prefersReducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.8 }}
          viewport={{ once: true }}
          transition={{ ...drawTransition, delay: 0.2 }}
        />
      </svg>
    </div>
  );
};

/**
 * OrnamentalCardFrame
 * Luxury stationery card wrapper featuring fine hairline borders and four floral corner flourishes.
 */
export const OrnamentalCardFrame: React.FC<{
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
}> = ({
  children,
  className,
  borderColor = "border-rose-200/20",
}) => {
  return (
    <div
      className={cn(
        "relative rounded-2xl border p-6 sm:p-8 overflow-hidden bg-burgundy-950/70 backdrop-blur-md shadow-2xl",
        borderColor,
        className
      )}
    >
      {/* Four floral corners */}
      <FloralCorner position="top-left" size={48} />
      <FloralCorner position="top-right" size={48} />
      <FloralCorner position="bottom-left" size={48} />
      <FloralCorner position="bottom-right" size={48} />

      {/* Subtle inner hairline inset border */}
      <div
        aria-hidden="true"
        className="absolute inset-1.5 rounded-xl border border-white/5 pointer-events-none"
      />

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

/**
 * ChapterTransitionCurve
 * Architectural stationery transition element bridging light cream and deep burgundy chapters.
 */
export const ChapterTransitionCurve: React.FC<{
  monogram?: string;
  className?: string;
}> = ({ monogram, className }) => {
  return (
    <div
      aria-hidden="true"
      className={cn("relative w-full overflow-hidden leading-none select-none", className)}
    >
      {/* Curved SVG transition fill */}
      <svg
        viewBox="0 0 480 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-7 sm:h-9 block text-burgundy-900"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 36 C 140 0 340 0 480 36 L 480 36 L 0 36 Z"
          fill="currentColor"
        />
      </svg>

      {/* Optional center transition emblem */}
      {monogram && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-burgundy-900 border border-rose-200/30 shadow-md">
          <span className="font-script text-xs text-rose-200 leading-none select-none">
            {monogram}
          </span>
        </div>
      )}
    </div>
  );
};

