"use client";

import React, { useState, useEffect } from "react";
import { weddingData } from "@/data/wedding";
import { AdminMessage } from "@/lib/database.types";
import { Reveal } from "@/components/ui/Reveal";
import {
  MonogramAccent,
  BotanicalSprig,
  WeddingDivider,
} from "@/components/ui/Ornaments";
import { AmbientFloralSway } from "@/components/ui/AmbientMotion";
import { cn } from "@/lib/utils";

export interface QuoteProps {
  className?: string;
}

export const Quote: React.FC<QuoteProps> = ({ className }) => {
  const { quote, couple } = weddingData;
  const [randomMessage, setRandomMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadMessages() {
      try {
        const res = await fetch("/api/admin/messages");
        const data = await res.json();
        if (res.ok && Array.isArray(data.messages) && data.messages.length > 0) {
          const active = data.messages.filter((m: AdminMessage) => m.is_active);
          if (active.length > 0) {
            // Controlled random selection without mutating database
            const randomIndex = Math.floor(Math.random() * active.length);
            setRandomMessage(active[randomIndex].message);
          }
        }
      } catch {
        // Fallback gracefully
      }
    }
    loadMessages();
  }, []);

  const initials = `${couple.monogram.brideInitial} ${couple.monogram.separator} ${couple.monogram.groomInitial}`;

  return (
    <section
      id="quote"
      aria-label="Kutipan Ayat Suci"
      className={cn(
        "relative w-full bg-[#FAF6F3] px-6 py-16 sm:py-20 text-center select-none overflow-hidden",
        className
      )}
    >
      <div className="max-w-md mx-auto space-y-7">
        {/* Subtle monogram accent with delicate winged lines */}
        <Reveal animation="fade" delay={0.1} duration={0.9}>
          <MonogramAccent
            initials={initials}
            textColor="text-burgundy-700/90"
            lineColor="#D49CAB"
            className="mb-2"
          />
        </Reveal>

        {/* Arabic Verse with semantic RTL direction */}
        {quote.arabic && (
          <Reveal animation="fade-up" delay={0.2} duration={0.9}>
            <p
              dir="rtl"
              lang="ar"
              className="text-lg sm:text-xl text-burgundy-900 leading-[2.2] sm:leading-[2.4] px-2 font-normal"
              style={{
                fontFamily:
                  "'Traditional Arabic', 'Amiri', 'Scheherazade New', 'Noto Naskh Arabic', serif",
              }}
            >
              {quote.arabic}
            </p>
          </Reveal>
        )}

        {/* Botanical sprig motif beneath verse with calm ambient sway */}
        <Reveal animation="fade" delay={0.3} duration={1.0}>
          <div className="flex justify-center">
            <AmbientFloralSway preset="calm">
              <BotanicalSprig
                color="#B86681"
                width={110}
                height={24}
                className="my-1 opacity-70"
              />
            </AmbientFloralSway>
          </div>
        </Reveal>

        {/* Translation / Indonesian meaning */}
        <Reveal animation="fade-up" delay={0.38} duration={0.9}>
          <blockquote className="border-none p-0 m-0 space-y-3">
            <p className="font-serif italic text-xs sm:text-sm text-dark-soft/90 leading-relaxed px-2 sm:px-4">
              {quote.translation}
            </p>
            {randomMessage && (
              <p className="font-serif italic text-xs sm:text-sm text-burgundy-900/90 font-medium leading-relaxed px-2 sm:px-4 pt-1">
                &ldquo;{randomMessage}&rdquo;
              </p>
            )}
            <footer className="mt-4">
              <cite className="not-italic font-sans text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-burgundy-700/90 font-medium">
                {quote.source}
              </cite>
            </footer>
          </blockquote>
        </Reveal>

        {/* Transition ornament leading into Couple section */}
        <Reveal animation="fade" delay={0.5} duration={0.8}>
          <div className="pt-2 flex justify-center">
            <WeddingDivider
              color="#D49CAB"
              variant="minimal"
              className="max-w-[140px] opacity-60"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Quote;
