"use client";

import React, { useState, useEffect } from "react";
import { weddingData, PersonInfo } from "@/data/wedding";
import { Reveal } from "@/components/ui/Reveal";
import {
  WeddingDivider,
  BotanicalSprig,
  ChapterTransitionCurve,
} from "@/components/ui/Ornaments";
import { AmbientFloralSway } from "@/components/ui/AmbientMotion";
import { Instagram } from "lucide-react";
import { cn, isValidInstagramUrl } from "@/lib/utils";

export interface CoupleProps {
  className?: string;
}

interface PersonSocialConfig {
  url: string;
  enabled: boolean;
}

interface PersonProfileProps {
  person: PersonInfo;
  role: "bride" | "groom";
  editorialLabel: string;
  parentLabel: string;
  social?: PersonSocialConfig;
}

const PersonProfile: React.FC<PersonProfileProps> = ({
  person,
  role,
  editorialLabel,
  parentLabel,
  social,
}) => {
  const showInstagram = Boolean(
    social?.enabled &&
    social?.url &&
    isValidInstagramUrl(social.url)
  );

  return (
    <div className="flex flex-col items-center text-center space-y-3 max-w-xs mx-auto">
      {/* Tiny editorial role label */}
      <Reveal animation="fade-up" delay={0.1} duration={0.8}>
        <p className="font-sans text-[9px] sm:text-[10px] font-semibold tracking-[0.3em] uppercase text-burgundy-600/75">
          {editorialLabel}
        </p>
      </Reveal>

      {/* Romantic nickname in Pinyon Script */}
      <Reveal animation="fade-up" delay={0.18} duration={0.85}>
        <h3 className="font-script text-5xl sm:text-6xl text-burgundy-800 leading-none">
          {person.nickname}
        </h3>
      </Reveal>

      {/* Full legal name in Cormorant Infant */}
      <Reveal animation="fade-up" delay={0.28} duration={0.8}>
        <p className="font-serif text-lg sm:text-xl font-medium text-dark tracking-wide">
          {person.fullName}
        </p>
      </Reveal>

      {/* Parentage details */}
      <Reveal animation="fade-up" delay={0.38} duration={0.8}>
        <div className="space-y-0.5 font-sans text-xs text-dark-muted">
          <p className="font-serif italic text-xs text-burgundy-700/80">
            {parentLabel}
          </p>
          {person.fatherName && person.motherName ? (
            <p className="leading-relaxed">
              Bpk. {person.fatherName} &amp; Ibu {person.motherName}
            </p>
          ) : (
            <p className="leading-relaxed">{person.description}</p>
          )}
        </div>
      </Reveal>

      {/* Social Link (only if configured and valid) */}
      {showInstagram && (
        <Reveal animation="fade" delay={0.45} duration={0.7}>
          <a
            href={social!.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram profil ${person.fullName}`}
            className="inline-flex items-center justify-center gap-1.5 min-h-[38px] px-4 py-2 rounded-full bg-burgundy-100 hover:bg-burgundy-200/80 text-burgundy-950 text-xs font-sans font-semibold border border-burgundy-200/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-400 select-none cursor-pointer"
          >
            <Instagram className="w-3.5 h-3.5 text-burgundy-950 shrink-0" />
            <span className="text-burgundy-950 font-semibold opacity-100">Instagram</span>
          </a>
        </Reveal>
      )}
    </div>
  );
};

/**
 * Chapter 03: Couple Profile Section
 *
 * Warm cream editorial spread introducing the bride and groom with
 * arched portraits, calligraphy nicknames, formal names, and parents.
 */
export const Couple: React.FC<CoupleProps> = ({ className }) => {
  const { couple } = weddingData;
  const [socialMedia, setSocialMedia] = useState<{
    bride: PersonSocialConfig;
    groom: PersonSocialConfig;
  }>({
    bride: { url: "", enabled: false },
    groom: { url: "", enabled: false },
  });

  useEffect(() => {
    let isMounted = true;
    async function loadSocialMedia() {
      try {
        const res = await fetch("/api/social-media");
        const data = await res.json();
        if (isMounted && res.ok && data.bride && data.groom) {
          setSocialMedia({
            bride: {
              url: data.bride.url || "",
              enabled: Boolean(data.bride.enabled),
            },
            groom: {
              url: data.groom.url || "",
              enabled: Boolean(data.groom.enabled),
            },
          });
        }
      } catch {
        // Fallback gracefully: button hidden
      }
    }
    loadSocialMedia();
    return () => {
      isMounted = false;
    };
  }, []);

  const monogram = `${couple.monogram.brideInitial} & ${couple.monogram.groomInitial}`;

  return (
    <section
      id="couple"
      aria-label="Profil Mempelai"
      className={cn(
        "relative w-full bg-[#FAF6F3] pt-16 pb-20 sm:pt-20 sm:pb-24 select-none overflow-hidden",
        className
      )}
    >
      {/* ── Section Header ────────────────────────────────────────── */}
      <header className="text-center max-w-sm mx-auto mb-12 sm:mb-14 space-y-2.5 px-6">
        <Reveal animation="fade" duration={0.8}>
          <p className="font-sans text-[10px] sm:text-[11px] font-medium tracking-[0.25em] uppercase text-burgundy-700/85">
            {couple.heading || "We are Getting Married!"}
          </p>
        </Reveal>

        <Reveal animation="fade" delay={0.1} duration={0.8}>
          <WeddingDivider
            color="#D49CAB"
            variant="leaf"
            className="max-w-[110px] my-1 opacity-70"
          />
        </Reveal>

        {couple.subHeading && (
          <Reveal animation="fade-up" delay={0.15} duration={0.9}>
            <p className="font-serif italic text-xs sm:text-sm text-dark-muted leading-relaxed px-2">
              {couple.subHeading}
            </p>
          </Reveal>
        )}
      </header>

      {/* ── Profiles: Bride & Groom ───────────────────────────────── */}
      <div className="space-y-10 sm:space-y-12 px-6">
        {/* Bride Profile */}
        <PersonProfile
          person={couple.bride}
          role="bride"
          editorialLabel="The Bride"
          parentLabel="Putri dari"
          social={socialMedia.bride}
        />

        {/* Delicate Connecting Centerpiece */}
        <Reveal animation="zoom-in" delay={0.1} duration={0.85}>
          <div className="flex items-center justify-center gap-3 my-2 opacity-85">
            <div className="w-12 sm:w-16 h-px bg-burgundy-200/70" />
            <span
              aria-hidden="true"
              className="font-script text-3xl sm:text-4xl text-burgundy-400/90 select-none px-1"
            >
              &amp;
            </span>
            <div className="w-12 sm:w-16 h-px bg-burgundy-200/70" />
          </div>
        </Reveal>

        {/* Groom Profile */}
        <PersonProfile
          person={couple.groom}
          role="groom"
          editorialLabel="The Groom"
          parentLabel="Putra dari"
          social={socialMedia.groom}
        />
      </div>

      {/* ── Bottom Botanical Ornament ──────────────────────────────── */}
      <Reveal animation="fade" delay={0.3} duration={1.0}>
        <div className="mt-12 mb-10 flex justify-center">
          <AmbientFloralSway preset="calm">
            <BotanicalSprig
              color="#B86681"
              width={120}
              height={28}
              className="opacity-70"
            />
          </AmbientFloralSway>
        </div>
      </Reveal>

      {/* ── Architectural Chapter Transition Curve into Burgundy ──── */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none">
        <ChapterTransitionCurve monogram={monogram} />
      </div>
    </section>
  );
};

export default Couple;
