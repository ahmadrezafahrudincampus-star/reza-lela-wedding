"use client";

import React from "react";
import { Reveal } from "@/components/ui/Reveal";
import {
  WeddingDivider,
  FloralBottomCluster,
} from "@/components/ui/Ornaments";
import { weddingData } from "@/data/wedding";
import { Heart } from "lucide-react";

interface Milestone {
  date: string;
  title: string;
  description: string;
  icon?: string;
}

// Love story timeline — update to match the couple's real journey
const milestones: Milestone[] = [
  {
    date: "2020",
    title: "Pertama Bertemu",
    description:
      "Takdir mempertemukan kami di sebuah momen yang sederhana namun penuh makna. Sebuah pertemuan yang mengubah segalanya.",
    icon: "✨",
  },
  {
    date: "2022",
    title: "Menjalin Kasih",
    description:
      "Dari pertemanan yang tulus, tumbuh rasa yang lebih dalam. Kami mulai mengenal satu sama lain lebih dekat, hari demi hari.",
    icon: "💌",
  },
  {
    date: "2025",
    title: "Lamaran",
    description:
      "Dengan restu keluarga, sebuah janji diikrarkan. Sebuah cincin menjadi simbol komitmen dan kasih sayang yang tulus.",
    icon: "💍",
  },
  {
    date: "26 September 2026",
    title: "Hari Pernikahan",
    description:
      "Hari yang paling ditunggu. Bersama keluarga dan orang-orang tercinta, kami melangkah menuju babak baru kehidupan.",
    icon: "💒",
  },
];

export function Story() {
  const { couple } = weddingData;

  return (
    <section
      id="story"
      aria-label="Love Story"
      className="relative w-full bg-rose-50 px-5 sm:px-6 py-16 sm:py-24 overflow-hidden"
    >
      <div className="relative z-10 max-w-sm mx-auto">
        {/* ── Section Header ──────────────────────────────────────── */}
        <header className="text-center space-y-2 mb-12">
          <Reveal animation="fade" duration={0.8}>
            <p className="font-sans text-[10px] sm:text-[11px] font-medium tracking-[0.3em] uppercase text-burgundy-700/70">
              Our Journey
            </p>
          </Reveal>

          <Reveal animation="fade-up" delay={0.12} duration={0.9}>
            <h2 className="font-script text-5xl sm:text-6xl text-burgundy-900 leading-tight drop-shadow-sm my-0.5">
              Love Story
            </h2>
          </Reveal>

          <Reveal animation="fade" delay={0.2} duration={0.8}>
            <WeddingDivider
              color="rgba(61,15,32,0.3)"
              variant="diamond"
              className="max-w-[140px] mx-auto my-1.5 opacity-70"
            />
          </Reveal>

          <Reveal animation="fade-up" delay={0.25} duration={0.8}>
            <p className="font-serif italic text-xs sm:text-sm text-burgundy-800/70 leading-relaxed px-2">
              Setiap kisah cinta dimulai dari sebuah pertemuan yang sederhana,
              kemudian tumbuh menjadi sesuatu yang indah dan abadi.
            </p>
          </Reveal>
        </header>

        {/* ── Timeline ────────────────────────────────────────────── */}
        <ol className="relative" aria-label="Linimasa kisah cinta">
          {/* Vertical centre line */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-burgundy-200 via-burgundy-300 to-transparent"
          />

          {milestones.map((milestone, index) => {
            const isLeft = index % 2 === 0;
            const animVariant = isLeft
              ? ("fade-right" as const)
              : ("fade-left" as const);

            return (
              <li
                key={index}
                className={`relative flex items-start mb-12 last:mb-0 ${
                  isLeft ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Content card */}
                <Reveal
                  animation={animVariant}
                  delay={0.1 + index * 0.15}
                  duration={0.8}
                  className="w-[calc(50%-20px)]"
                >
                  <div
                    className={`p-4 rounded-2xl bg-white border border-burgundy-100 shadow-md space-y-1.5 ${
                      isLeft ? "mr-2 text-right" : "ml-2 text-left"
                    }`}
                  >
                    <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-burgundy-400">
                      {milestone.date}
                    </p>
                    <h3 className="font-serif text-sm font-semibold text-burgundy-900 leading-snug">
                      {milestone.title}
                    </h3>
                    <p className="font-sans text-[11px] text-gray-500 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </Reveal>

                {/* Centre dot with icon */}
                <Reveal
                  animation="zoom-in"
                  delay={0.12 + index * 0.15}
                  duration={0.6}
                  className="flex-none z-10"
                >
                  <div className="w-10 h-10 rounded-full bg-burgundy-900 border-4 border-rose-50 shadow-lg flex items-center justify-center text-base">
                    {milestone.icon ? (
                      <span role="img" aria-hidden="true">
                        {milestone.icon}
                      </span>
                    ) : (
                      <Heart className="w-4 h-4 text-rose-200 fill-rose-200" />
                    )}
                  </div>
                </Reveal>

                {/* Empty spacer on the other side */}
                <div className="w-[calc(50%-20px)]" aria-hidden="true" />
              </li>
            );
          })}
        </ol>

        {/* ── Closing monogram ────────────────────────────────────── */}
        <Reveal animation="zoom-in" delay={0.3} duration={1.0}>
          <div className="mt-12 flex flex-col items-center gap-2">
            <WeddingDivider
              color="rgba(61,15,32,0.25)"
              variant="diamond"
              className="max-w-[120px] opacity-60"
            />
            <p className="font-script text-3xl text-burgundy-800/60 mt-1">
              {couple.monogram.groomInitial} {couple.monogram.separator}{" "}
              {couple.monogram.brideInitial}
            </p>
          </div>
        </Reveal>

        {/* ── Decorative bottom floral ─────────────────────────────── */}
        <Reveal animation="fade" delay={0.5} duration={1.0}>
          <div className="flex justify-center mt-8 opacity-40">
            <FloralBottomCluster
              color="rgba(61,15,32,0.5)"
              width={140}
              height={30}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Story;
