"use client";

import React, { useState, useEffect } from "react";
import { weddingData } from "@/data/wedding";
import { EventItem } from "@/lib/database.types";
import { Reveal } from "@/components/ui/Reveal";
import {
  VerticalTimelineLine,
  WeddingDivider,
  FloralBottomCluster,
  OrnamentalCardFrame,
  BurgundyPaperPattern,
} from "@/components/ui/Ornaments";
import {
  AmbientGoldParticles,
  AmbientFloralSway,
} from "@/components/ui/AmbientMotion";
import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EventProps {
  className?: string;
}

export const Event: React.FC<EventProps> = ({ className }) => {
  const [dbEvents, setDbEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/admin/events");
        const data = await res.json();
        if (res.ok && Array.isArray(data.events) && data.events.length > 0) {
          const active = data.events.filter((e: EventItem) => e.is_active);
          if (active.length > 0) {
            setDbEvents(active);
          }
        }
      } catch {
        // Fallback to weddingData
      }
    }
    loadEvents();
  }, []);

  const hasDbEvents = dbEvents.length > 0;
  const { events } = weddingData;
  const { akad, reception } = events;

  const activeEvents = hasDbEvents
    ? dbEvents.map((e) => ({
        title: e.title,
        date: new Date(e.date).toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        time: `${e.start_time?.slice(0, 5)} WIB ${e.end_time ? `s/d ${e.end_time.slice(0, 5)} WIB` : "s/d Selesai"}`,
        venue: e.venue,
        address: e.address,
        mapUrl: e.google_maps_url,
      }))
    : [
        {
          title: akad.title,
          date: akad.date,
          time: akad.time,
          venue: akad.venue,
          address: akad.address,
          mapUrl: akad.mapUrl,
        },
        {
          title: reception.title,
          date: reception.date,
          time: reception.time,
          venue: reception.venue,
          address: reception.address,
          mapUrl: reception.mapUrl,
        },
      ];

  const mapUrl = activeEvents.find((e) => e.mapUrl)?.mapUrl || reception.mapUrl || akad.mapUrl;
  const hasValidMapUrl = Boolean(mapUrl) && mapUrl !== "#" && mapUrl!.trim().length > 0;

  return (
    <section
      id="event"
      aria-label="Informasi Rangkaian Acara"
      className={cn(
        "relative w-full bg-burgundy-900 text-white px-5 sm:px-6 py-16 sm:py-24 select-none overflow-hidden",
        className
      )}
    >
      {/* ── Subtle Background Watermarked Stationery Pattern ──────── */}
      <BurgundyPaperPattern opacity="opacity-[0.07]" />

      {/* ── Ambient Champagne / Gold Micro-Particles ─────────────── */}
      <AmbientGoldParticles count={6} />

      <div className="relative z-10 max-w-sm mx-auto">
        {/* ── Framed Wedding Stationery Card ─────────────────────────── */}
        <Reveal animation="zoom-in" duration={0.95}>
          <OrnamentalCardFrame borderColor="border-rose-200/25">
            {/* ── Card Header ────────────────────────────────────────── */}
            <header className="text-center space-y-2 mb-8 sm:mb-10">
              <Reveal animation="fade" duration={0.8}>
                <p className="font-sans text-[10px] sm:text-[11px] font-medium tracking-[0.3em] uppercase text-rose-200/85">
                  Waktu &amp; Tempat
                </p>
              </Reveal>

              <Reveal animation="fade" delay={0.1} duration={0.8}>
                <WeddingDivider
                  color="rgba(254, 205, 211, 0.4)"
                  variant="leaf"
                  className="max-w-[120px] my-1 opacity-75"
                />
              </Reveal>

              <Reveal animation="fade-up" delay={0.15} duration={0.8}>
                <p className="font-serif italic text-xs sm:text-sm text-rose-100/80 leading-relaxed px-1">
                  Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri rangkaian acara kami:
                </p>
              </Reveal>
            </header>

            {/* ── Sequential Schedule Flow ───────────────────────────── */}
            <div className="flex flex-col items-center text-center space-y-5">
              {activeEvents.map((evt, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && (
                    <Reveal animation="fade" delay={0.25} duration={0.8}>
                      <VerticalTimelineLine
                        color="rgba(254, 205, 211, 0.5)"
                        height={56}
                        className="my-0.5 opacity-75"
                      />
                    </Reveal>
                  )}
                  <div className="space-y-1.5">
                    <Reveal animation="fade-up" delay={0.2 + idx * 0.1} duration={0.8}>
                      <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-rose-100 tracking-wide">
                        {evt.title}
                      </h3>
                    </Reveal>

                    <Reveal animation="fade-up" delay={0.25 + idx * 0.1} duration={0.8}>
                      <p className="font-sans text-xs sm:text-sm font-medium text-rose-200/90 tracking-wide">
                        {evt.date}
                      </p>
                    </Reveal>

                    <Reveal animation="fade-up" delay={0.3 + idx * 0.1} duration={0.8}>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-burgundy-950/80 border border-rose-200/25 text-xs text-rose-200 font-sans font-medium">
                        <Clock className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                        <span>{evt.time}</span>
                      </div>
                    </Reveal>
                  </div>
                </React.Fragment>
              ))}

              {/* Shared Venue & Physical Address */}
              <Reveal animation="fade-up" delay={0.55} duration={0.85}>
                <div className="space-y-1.5 pt-3">
                  <p className="font-serif text-base sm:text-lg font-semibold text-white">
                    {activeEvents[0]?.venue || reception.venue || akad.venue}
                  </p>
                  {(activeEvents[0]?.address || reception.address || akad.address) && (
                    <p className="font-sans text-xs text-rose-200/75 leading-relaxed max-w-xs mx-auto">
                      {activeEvents[0]?.address || reception.address || akad.address}
                    </p>
                  )}
                </div>
              </Reveal>


              {/* 5. Google Maps Action (Appears last) */}
              {hasValidMapUrl && (
                <Reveal animation="fade-up" delay={0.62} duration={0.8}>
                  <div className="pt-2">
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Buka petunjuk arah Google Maps ke lokasi pernikahan"
                      className="inline-flex items-center justify-center gap-2.5 min-h-[44px] px-7 py-2.5 rounded-full bg-burgundy-950/80 hover:bg-burgundy-950 border border-rose-200/40 hover:border-rose-200/70 text-rose-100 hover:text-white shadow-md transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 active:scale-[0.97] cursor-pointer select-none"
                    >
                      <MapPin className="w-4 h-4 text-rose-200 shrink-0" />
                      <span className="font-sans text-xs font-semibold tracking-wider uppercase text-rose-100 opacity-100">
                        Petunjuk Lokasi
                      </span>
                    </a>
                  </div>
                </Reveal>
              )}

              {/* 6. Closing Floral Spray */}
              <Reveal animation="fade" delay={0.7} duration={1.0}>
                <div className="pt-4 flex justify-center">
                  <AmbientFloralSway preset="gentle">
                    <FloralBottomCluster
                      color="rgba(254, 205, 211, 0.4)"
                      width={140}
                      height={30}
                    />
                  </AmbientFloralSway>
                </div>
              </Reveal>
            </div>
          </OrnamentalCardFrame>
        </Reveal>
      </div>
    </section>
  );
};

export default Event;
