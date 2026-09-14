"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { weddingData } from "@/data/wedding";
import { Reveal } from "@/components/ui/Reveal";
import { WeddingDivider } from "@/components/ui/Ornaments";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface LightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Lightbox — standalone, self-contained
// ─────────────────────────────────────────────────────────────────────────────

const Lightbox: React.FC<LightboxProps> = ({ images, initialIndex, onClose }) => {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const prefersReducedMotion = useReducedMotion();

  // Touch / swipe state
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const total = images.length;

  const goNext = useCallback(() => {
    setDirection("next");
    setIndex((i) => (i + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setDirection("prev");
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, onClose]);

  // Body scroll lock while lightbox is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only trigger if horizontal swipe dominates
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? goNext() : goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Crossfade variants (no horizontal slide — clean dissolve)
  const imageVariants = {
    enter: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.98 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.98 },
  };

  const currentSrc = images[index];
  const altText = `Foto Prewedding ${weddingData.couple.primaryDisplay} — ${index + 1} dari ${total}`;

  return (
    <motion.div
      key="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0.01 : 0.25, ease: "easeOut" }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-burgundy-950/95"
      role="dialog"
      aria-modal="true"
      aria-label="Galeri foto pernikahan"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Close Button ─────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Tutup galeri"
        className="absolute top-4 right-4 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <X className="w-5 h-5" strokeWidth={1.75} />
      </button>

      {/* ── Previous Button ──────────────────────────────────────────── */}
      {total > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          aria-label="Foto sebelumnya"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={1.75} />
        </button>
      )}

      {/* ── Next Button ──────────────────────────────────────────────── */}
      {total > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          aria-label="Foto berikutnya"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <ChevronRight className="w-5 h-5" strokeWidth={1.75} />
        </button>
      )}

      {/* ── Image Viewer ─────────────────────────────────────────────── */}
      <div
        className="relative w-full h-full flex items-center justify-center px-14 py-12"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`lb-img-${index}`}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.3,
              ease: "easeInOut",
            }}
            className="relative w-full h-full max-w-sm mx-auto"
          >
            <Image
              src={currentSrc}
              alt={altText}
              fill
              sizes="(max-width: 480px) 90vw, 400px"
              priority
              className="object-contain select-none"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Position Indicator ───────────────────────────────────────── */}
      {total > 1 && (
        <div
          aria-hidden="true"
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5"
        >
          {images.map((_, i) => (
            <span
              key={i}
              className={cn(
                "block rounded-full transition-all duration-500",
                i === index
                  ? "w-4 h-1.5 bg-white/90"
                  : "w-1.5 h-1.5 bg-white/35"
              )}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Gallery — main exported component
// ─────────────────────────────────────────────────────────────────────────────

export interface GalleryProps {
  className?: string;
}

/**
 * Chapter 09 — Photo Gallery
 *
 * 2-column editorial grid of prewedding photographs.
 * Tap any photo to open an accessible, keyboard-navigable Lightbox.
 *
 * Data: weddingData.media.gallery (static image paths, no backend required)
 */
const Gallery: React.FC<GalleryProps> = ({ className }) => {
  const { gallery } = weddingData.media;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((i: number) => {
    setLightboxIndex(i);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Guard
  if (!gallery || gallery.length === 0) return null;

  return (
    <>
      <section
        id="gallery"
        aria-label="Galeri Foto Pernikahan"
        className={cn(
          "relative w-full bg-white px-4 sm:px-5 py-16 sm:py-20",
          className
        )}
      >
        {/* ── Section Header ──────────────────────────────────────────── */}
        <header className="text-center mb-10 sm:mb-12 space-y-2">
          <Reveal animation="fade" duration={0.8}>
            <p className="font-sans text-[10px] font-medium tracking-[0.3em] uppercase text-burgundy-400">
              Our Gallery
            </p>
          </Reveal>

          <Reveal animation="fade-up" delay={0.1} duration={0.9}>
            <h2 className="font-script text-5xl sm:text-[3.2rem] text-burgundy-700 leading-tight my-0.5">
              Foto Prewedding
            </h2>
          </Reveal>

          <Reveal animation="fade" delay={0.2} duration={0.8}>
            <WeddingDivider
              color="#D49CAB"
              variant="diamond"
              className="max-w-[130px] my-1.5 opacity-70"
            />
          </Reveal>
        </header>

        {/* ── 2-Column Grid ───────────────────────────────────────────── */}
        <div
          role="list"
          className="grid grid-cols-2 gap-2 sm:gap-3"
        >
          {gallery.map((src, i) => (
            <GalleryItem
              key={src}
              src={src}
              index={i}
              total={gallery.length}
              onOpen={openLightbox}
            />
          ))}
        </div>
      </section>

      {/* ── Lightbox Portal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={gallery}
            initialIndex={lightboxIndex}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GalleryItem — individual tappable photo cell
// ─────────────────────────────────────────────────────────────────────────────

interface GalleryItemProps {
  src: string;
  index: number;
  total: number;
  onOpen: (index: number) => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ src, index, onOpen }) => {
  const prefersReducedMotion = useReducedMotion();

  // Stagger the entrance animation — 0.05s per item
  const staggerDelay = 0.1 + index * 0.07;

  // Alternate tall/short across the two columns for an editorial rhythm:
  // col-1 (even index): first is tall, second is short — alternates
  // col-2 (odd index): first is short, second is tall — alternates
  // With 4 images: 0 tall, 1 short, 2 short, 3 tall
  const isTall = index % 3 === 0 || index % 3 === 3;

  return (
    <Reveal animation="zoom-in" delay={staggerDelay} duration={0.75} amount={0.15}>
      <motion.button
        type="button"
        role="listitem"
        aria-label={`Buka foto ${index + 1} dalam tampilan penuh`}
        onClick={() => onOpen(index)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen(index);
          }
        }}
        whileHover={
          prefersReducedMotion ? {} : { scale: 1.015 }
        }
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "relative w-full overflow-hidden rounded-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-400 focus-visible:ring-offset-2",
          // Tall cells are portrait 3:4, short are square-ish 4:5
          isTall ? "aspect-[3/4]" : "aspect-[4/5]"
        )}
      >
        <Image
          src={src}
          alt={`Foto Prewedding ${weddingData.couple.primaryDisplay} — ${index + 1}`}
          fill
          loading="lazy"
          sizes="(max-width: 480px) 50vw, 240px"
          className="object-cover object-[center_25%] transition-transform duration-700"
          draggable={false}
        />

        {/* Very subtle dark overlay on hover — desktop only via group */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-burgundy-950/0 hover:bg-burgundy-950/10 transition-colors duration-300 pointer-events-none"
        />
      </motion.button>
    </Reveal>
  );
};

export default Gallery;
