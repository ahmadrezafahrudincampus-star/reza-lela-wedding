"use client";

import React, { ReactNode } from "react";
import { motion, Variants, Transition, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type RevealAnimationVariant =
  | "fade"
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "zoom-out"
  | "zoom-in-up"
  | "zoom-in-down";

export interface RevealProps {
  children: ReactNode;
  animation?: RevealAnimationVariant;
  duration?: number;
  delay?: number;
  once?: boolean;
  amount?: number | "some" | "all";
  easing?: [number, number, number, number] | string;
  className?: string;
  style?: React.CSSProperties;
}

const revealVariants: Record<RevealAnimationVariant, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "fade-up": {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -35 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-left": {
    hidden: { opacity: 0, x: 35 },
    visible: { opacity: 1, x: 0 },
  },
  "fade-right": {
    hidden: { opacity: 0, x: -35 },
    visible: { opacity: 1, x: 0 },
  },
  "zoom-in": {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  "zoom-out": {
    hidden: { opacity: 0, scale: 1.1 },
    visible: { opacity: 1, scale: 1 },
  },
  "zoom-in-up": {
    hidden: { opacity: 0, scale: 0.92, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
  "zoom-in-down": {
    hidden: { opacity: 0, scale: 0.92, y: -30 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
};

const reducedMotionVariant: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const Reveal: React.FC<RevealProps> = ({
  children,
  animation = "fade-up",
  duration = 0.85,
  delay = 0,
  once = true,
  amount = 0.2,
  easing = [0.22, 1, 0.36, 1],
  className,
  style,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const selectedVariant = prefersReducedMotion
    ? reducedMotionVariant
    : revealVariants[animation] || revealVariants["fade-up"];

  const transition: Transition = {
    duration: prefersReducedMotion ? 0.2 : duration,
    delay: prefersReducedMotion ? 0 : delay,
    ease: easing as any,
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={selectedVariant}
      transition={transition}
      className={cn(className)}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
