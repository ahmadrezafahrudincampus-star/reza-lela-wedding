"use client";

import React from "react";
import Image, { ImageProps } from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// ============================================================================
// 1. Ambient Floral Sway
// ============================================================================

export interface AmbientFloralSwayProps {
  children: React.ReactNode;
  className?: string;
  preset?: "gentle" | "breeze" | "calm";
  origin?: string;
}

const swayPresets = {
  gentle: {
    rotate: [-1.2, 1.2, -1.2],
    x: [-1.5, 1.5, -1.5],
    y: [0, -1, 0],
    duration: 7.5,
    delay: 0.2,
  },
  breeze: {
    rotate: [1.4, -1.4, 1.4],
    x: [2, -2, 2],
    y: [0, -1.5, 0],
    duration: 8.8,
    delay: 1.1,
  },
  calm: {
    rotate: [-0.9, 0.9, -0.9],
    x: [-1, 1, -1],
    y: [0, -0.7, 0],
    duration: 6.2,
    delay: 0.6,
  },
};

export const AmbientFloralSway: React.FC<AmbientFloralSwayProps> = ({
  children,
  className,
  preset = "gentle",
  origin = "bottom center",
}) => {
  const prefersReducedMotion = useReducedMotion();
  const config = swayPresets[preset] || swayPresets.gentle;

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      style={{ transformOrigin: origin }}
      animate={{
        rotate: config.rotate,
        x: config.x,
        y: config.y,
      }}
      transition={{
        duration: config.duration,
        delay: config.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// 2. Falling Rose Petals (Deterministic, No Hydration Mismatch)
// ============================================================================

interface PetalConfig {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  rotation: number;
}

// 6 deterministic petals with varied timings, positions, and drift paths
const DETERMINISTIC_PETALS: PetalConfig[] = [
  { id: 1, left: "12%", size: 13, duration: 13, delay: 0.5, drift: 24, rotation: 45 },
  { id: 2, left: "38%", size: 10, duration: 15, delay: 3.5, drift: -20, rotation: -35 },
  { id: 3, left: "68%", size: 14, duration: 14, delay: 1.8, drift: 28, rotation: 65 },
  { id: 4, left: "24%", size: 11, duration: 16, delay: 7.2, drift: -26, rotation: -50 },
  { id: 5, left: "84%", size: 12, duration: 14.5, delay: 5.0, drift: -18, rotation: 40 },
  { id: 6, left: "52%", size: 9,  duration: 17, delay: 9.5, drift: 22, rotation: -25 },
];

export interface FloatingPetalsProps {
  className?: string;
  count?: number;
}

export const FloatingPetals: React.FC<FloatingPetalsProps> = ({
  className,
  count = 5,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return null;
  }

  const petalsToRender = DETERMINISTIC_PETALS.slice(0, Math.min(count, DETERMINISTIC_PETALS.length));

  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden select-none z-10",
        className
      )}
    >
      {petalsToRender.map((petal) => (
        <motion.div
          key={`petal-${petal.id}`}
          initial={{
            y: -30,
            x: 0,
            opacity: 0,
            rotate: 0,
          }}
          animate={{
            y: 850,
            x: [0, petal.drift * 0.5, petal.drift, petal.drift * 0.7],
            opacity: [0, 0.65, 0.7, 0],
            rotate: [0, petal.rotation * 0.5, petal.rotation],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: 0,
            left: petal.left,
            width: petal.size,
            height: petal.size * 1.3,
          }}
        >
          {/* Stylized organic rose petal vector */}
          <svg
            viewBox="0 0 24 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
          >
            <path
              d="M 12 0 C 18 3 24 10 23 20 C 22 28 14 32 12 32 C 10 32 2 28 1 20 C 0 10 6 3 12 0 Z"
              fill="rgba(212, 156, 171, 0.45)"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="0.5"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

// ============================================================================
// 3. Ambient Gold / Champagne Particles (Deterministic)
// ============================================================================

interface ParticleConfig {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  drift: number;
}

const DETERMINISTIC_PARTICLES: ParticleConfig[] = [
  { id: 1, left: "14%", size: 2.5, duration: 11, delay: 0.3, drift: 12 },
  { id: 2, left: "32%", size: 2.0, duration: 13, delay: 3.2, drift: -15 },
  { id: 3, left: "55%", size: 3.0, duration: 10, delay: 1.5, drift: 10 },
  { id: 4, left: "74%", size: 2.0, duration: 14, delay: 4.8, drift: -12 },
  { id: 5, left: "88%", size: 2.5, duration: 12, delay: 2.0, drift: 14 },
  { id: 6, left: "22%", size: 1.8, duration: 15, delay: 6.5, drift: -10 },
  { id: 7, left: "45%", size: 2.8, duration: 11.5, delay: 5.1, drift: 16 },
  { id: 8, left: "65%", size: 2.0, duration: 13.5, delay: 7.7, drift: -8 },
  { id: 9, left: "82%", size: 3.2, duration: 12.5, delay: 8.2, drift: 12 },
  { id: 10, left: "93%", size: 1.8, duration: 16, delay: 1.0, drift: -14 },
];

export interface AmbientGoldParticlesProps {
  className?: string;
  count?: number;
}

export const AmbientGoldParticles: React.FC<AmbientGoldParticlesProps> = ({
  className,
  count = 8,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return null;
  }

  const particles = DETERMINISTIC_PARTICLES.slice(0, Math.min(count, DETERMINISTIC_PARTICLES.length));

  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden select-none z-10",
        className
      )}
    >
      {particles.map((p) => (
        <motion.div
          key={`gold-p-${p.id}`}
          initial={{
            y: 40,
            x: 0,
            opacity: 0,
          }}
          animate={{
            y: -240,
            x: [0, p.drift * 0.5, p.drift],
            opacity: [0, 0.45, 0.55, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            bottom: "10%",
            left: p.left,
            width: p.size,
            height: p.size,
            borderRadius: "9999px",
            backgroundColor: "#FCE7F3", // soft warm champagne
            boxShadow: "0 0 6px 1px rgba(254, 205, 211, 0.5)",
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// 4. Ken Burns Photography
// ============================================================================

export interface KenBurnsImageProps
  extends Omit<ImageProps, "className"> {
  containerClassName?: string;
  imageClassName?: string;
  scaleTo?: number;
  duration?: number;
}

export const KenBurnsImage: React.FC<KenBurnsImageProps> = ({
  containerClassName,
  imageClassName,
  scaleTo = 1.038,
  duration = 14,
  alt = "",
  ...imageProps
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn("relative w-full h-full overflow-hidden", containerClassName)}>
      <motion.div
        animate={
          prefersReducedMotion
            ? { scale: 1 }
            : { scale: [1, scaleTo, 1] }
        }
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-full h-full"
      >
        <Image
          alt={alt}
          {...imageProps}
          className={cn("object-cover", imageClassName)}
        />
      </motion.div>
    </div>
  );
};

// ============================================================================
// 5. Primary CTA Breathing
// ============================================================================

export interface BreathingCTAProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const BreathingCTA: React.FC<BreathingCTAProps> = ({
  children,
  className,
  disabled = false,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion || disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate={{
        scale: [1, 1.025, 1],
      }}
      transition={{
        duration: 3.4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// 6. Subtle Foil Text Shimmer
// ============================================================================

export interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
}

export const TextShimmer: React.FC<TextShimmerProps> = ({
  children,
  className,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span
      initial={{ opacity: 0.95 }}
      animate={{ opacity: [0.95, 1, 0.95] }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        repeatDelay: 10,
        ease: "easeInOut",
      }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.span>
  );
};
