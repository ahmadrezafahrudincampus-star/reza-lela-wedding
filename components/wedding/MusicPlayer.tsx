"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { weddingData } from "@/data/wedding";
import { Disc3, VolumeX } from "lucide-react";

export interface MusicPlayerHandle {
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => void;
  isPlaying: boolean;
}

export interface MusicPlayerProps {
  isOpened: boolean;
}

export const MusicPlayer = forwardRef<MusicPlayerHandle, MusicPlayerProps>(
  function MusicPlayer({ isOpened }, ref) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [hasAudioError, setHasAudioError] = useState<boolean>(false);
    const prefersReducedMotion = useReducedMotion();

    const audioConfig = weddingData.audio;

    const play = useCallback(async () => {
      if (!audioRef.current || !audioConfig?.src || hasAudioError) return;
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        // Autoplay blocked by browser policy or audio load failed
        // Gracefully stay paused without uncaught exception
        console.warn("Audio autoplay blocked by browser policy:", err);
        setIsPlaying(false);
      }
    }, [audioConfig?.src, hasAudioError]);

    const pause = useCallback(() => {
      if (!audioRef.current) return;
      audioRef.current.pause();
      setIsPlaying(false);
    }, []);

    const toggle = useCallback(() => {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    }, [isPlaying, pause, play]);

    useImperativeHandle(
      ref,
      () => ({
        play,
        pause,
        toggle,
        isPlaying,
      }),
      [play, pause, toggle, isPlaying]
    );

    // Sync HTML5 audio event listeners
    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleError = () => {
        console.warn("Audio failed to load from source:", audioConfig?.src);
        setHasAudioError(true);
        setIsPlaying(false);
      };

      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("error", handleError);

      return () => {
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("error", handleError);
      };
    }, [audioConfig?.src]);

    // If audio is missing or errored, do not render floating button
    if (!audioConfig?.src || hasAudioError) {
      return null;
    }

    return (
      <>
        {/* Hidden HTML5 audio element */}
        <audio
          ref={audioRef}
          src={audioConfig.src}
          preload="auto"
          loop={audioConfig.loop ?? true}
        />

        {/* Floating audio toggle button */}
        {isOpened && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.85 }}
            transition={{
              duration: prefersReducedMotion ? 0.2 : 0.6,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed bottom-6 right-6 md:right-[max(1.5rem,calc(50vw-240px+1.5rem))] z-40"
          >
            <button
              type="button"
              onClick={toggle}
              aria-label={
                isPlaying
                  ? `Jeda lagu: ${audioConfig.title}`
                  : `Putar lagu: ${audioConfig.title}`
              }
              title={isPlaying ? "Jeda Musik" : "Putar Musik"}
              className="group relative w-12 h-12 rounded-full bg-burgundy-700/90 hover:bg-burgundy-600 text-white shadow-xl backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-300 focus-visible:ring-offset-2"
            >
              {/* Spinning vinyl disc indicator - pauses at current angle without snapping to 0 */}
              <div
                style={{
                  animation: !prefersReducedMotion ? "spin 6s linear infinite" : "none",
                  animationPlayState:
                    isPlaying && !prefersReducedMotion ? "running" : "paused",
                }}
                className="flex items-center justify-center pointer-events-none"
              >
                <Disc3 className="w-6 h-6 text-white" />
              </div>

              {/* Status badge / overlay when paused */}
              {!isPlaying && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full"
                >
                  <VolumeX className="w-4 h-4 text-rose-tint" />
                </div>
              )}
            </button>
          </motion.div>
        )}
      </>
    );
  }
);

export default MusicPlayer;
