"use client";

import React, { useState, useCallback, useEffect } from "react";
import { weddingData } from "@/data/wedding";
import { BankAccount } from "@/lib/database.types";
import { Reveal } from "@/components/ui/Reveal";
import {
  WeddingDivider,
  FloralBottomCluster,
  BurgundyPaperPattern,
} from "@/components/ui/Ornaments";
import {
  AmbientGoldParticles,
  AmbientFloralSway,
} from "@/components/ui/AmbientMotion";
import { CreditCard, Copy, Check, Gift, MapPin, ChevronDown, Wallet } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface LoveGiftProps {
  className?: string;
}

export const LoveGift: React.FC<LoveGiftProps> = ({ className }) => {
  const { gifts } = weddingData;
  const prefersReducedMotion = useReducedMotion();

  const [dbAccounts, setDbAccounts] = useState<BankAccount[]>([]);

  useEffect(() => {
    async function loadAccounts() {
      try {
        const res = await fetch("/api/bank-accounts");
        const data = await res.json();
        if (res.ok && Array.isArray(data.accounts) && data.accounts.length > 0) {
          const active = data.accounts.filter((a: BankAccount) => a.is_active);
          if (active.length > 0) {
            setDbAccounts(active);
          }
        }
      } catch {
        // Fallback to weddingData
      }
    }
    loadAccounts();
  }, []);

  const activeAccounts =
    dbAccounts.length > 0
      ? dbAccounts.map((a) => ({
          bankName: a.bank_name,
          accountNumber: a.account_number,
          accountHolder: a.account_holder,
          type: a.type,
        }))
      : gifts.accounts.map((a) => ({ ...a, type: "bank" }));

  // Independent copy states for each account and physical address
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [showPhysicalAddress, setShowPhysicalAddress] = useState<boolean>(false);

  const handleCopy = useCallback(async (textToCopy: string, key: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for browsers without clipboard API or insecure contexts
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!successful) throw new Error("Fallback copy command unsuccessful");
      }

      setCopiedKey(key);
      setErrorKey(null);
      setTimeout(() => {
        setCopiedKey((curr) => (curr === key ? null : curr));
      }, 2200);
    } catch {
      setErrorKey(key);
      setTimeout(() => {
        setErrorKey((curr) => (curr === key ? null : curr));
      }, 2200);
    }
  }, []);

  return (
    <section
      id="gift"
      aria-label="Tanda Kasih & Hadiah Pernikahan"
      className={cn(
        "relative w-full bg-burgundy-900 text-white px-5 sm:px-6 py-16 sm:py-24 text-center select-none overflow-hidden",
        className
      )}
    >
      {/* ── Subtle Background Watermarked Stationery Pattern ──────── */}
      <BurgundyPaperPattern opacity="opacity-[0.07]" />

      {/* ── Ambient Gold Dust Micro-Particles ─────────────────────── */}
      <AmbientGoldParticles count={6} />

      <div className="relative z-10 max-w-sm mx-auto space-y-7">
        {/* ── Section Header ────────────────────────────────────────── */}
        <header className="space-y-2">
          <Reveal animation="fade" duration={0.8}>
            <p className="font-sans text-[10px] sm:text-[11px] font-medium tracking-[0.3em] uppercase text-rose-200/85">
              {gifts.subTitle || "Love Gift"}
            </p>
          </Reveal>

          <Reveal animation="fade-up" delay={0.12} duration={0.9}>
            <h2 className="font-script text-5xl sm:text-6xl text-white leading-tight drop-shadow-md my-0.5">
              {gifts.title || "Tanda Kasih"}
            </h2>
          </Reveal>

          <Reveal animation="fade" delay={0.2} duration={0.8}>
            <WeddingDivider
              color="rgba(254, 205, 211, 0.4)"
              variant="diamond"
              className="max-w-[140px] my-1.5 opacity-75"
            />
          </Reveal>

          <Reveal animation="fade-up" delay={0.25} duration={0.8}>
            <p className="font-serif italic text-xs sm:text-sm text-rose-100/80 leading-relaxed px-2">
              {gifts.intro ||
                "Tanpa mengurangi rasa hormat, bagi Bapak/Ibu/Saudara/i yang ingin memberikan tanda kasih untuk kami, dapat melalui:"}
            </p>
          </Reveal>
        </header>

        {/* ── Bank Account Cards (Vertical Stack) ───────────────────── */}
        <div className="space-y-4 pt-1">
          {activeAccounts.map((account, index) => {
            const accountKey = `acc-${account.bankName}-${index}`;
            const isCopied = copiedKey === accountKey;
            const isError = errorKey === accountKey;
            const isEwallet = account.type === "ewallet";

            return (
              <Reveal
                key={accountKey}
                animation="fade-up"
                delay={0.3 + index * 0.12}
                duration={0.85}
              >
                <div className="relative p-5 sm:p-6 rounded-2xl bg-burgundy-950/70 border border-rose-200/25 shadow-xl backdrop-blur-md text-center space-y-3.5">
                  {/* Bank / Provider Header */}
                  <div className="flex items-center justify-center gap-2 text-rose-200/90 font-sans font-semibold text-xs tracking-widest uppercase">
                    {isEwallet ? (
                      <Wallet className="w-4 h-4 text-rose-300 shrink-0" />
                    ) : (
                      <CreditCard className="w-4 h-4 text-rose-300 shrink-0" />
                    )}
                    <span>{isEwallet ? account.bankName : `Bank ${account.bankName}`}</span>
                  </div>

                  {/* Account Number */}
                  <div className="space-y-0.5 py-1">
                    <p className="font-sans text-[10px] uppercase tracking-wider text-rose-200/60">
                      No. Rekening
                    </p>
                    <p className="font-mono text-xl sm:text-2xl font-semibold tracking-wider text-rose-50 select-all">
                      {account.accountNumber}
                    </p>
                  </div>

                  {/* Account Holder */}
                  <div className="space-y-0.5">
                    <p className="font-sans text-[10px] uppercase tracking-wider text-rose-200/60">
                      Atas Nama
                    </p>
                    <p className="font-serif text-sm sm:text-base font-medium text-rose-100">
                      {account.accountHolder}
                    </p>
                  </div>

                  {/* Functional Copy Action Button */}
                  <div className="pt-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleCopy(account.accountNumber, accountKey)}
                      aria-label={`Salin nomor rekening Bank ${account.bankName}: ${account.accountNumber}`}
                      className={cn(
                        "inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 rounded-full text-xs font-sans font-semibold tracking-wider uppercase shadow-md transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 active:scale-[0.97] cursor-pointer select-none",
                        isCopied
                          ? "bg-emerald-700 text-white border border-emerald-600 shadow-md"
                          : isError
                          ? "bg-rose-900 text-rose-100 border border-rose-400/50"
                          : "bg-rose-100 hover:bg-white text-burgundy-950 border border-rose-200/70"
                      )}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-4 h-4 text-white shrink-0 stroke-[2.5]" />
                          <span className="text-white font-semibold tracking-wider opacity-100">
                            Tersalin
                          </span>
                        </>
                      ) : isError ? (
                        <span className="text-rose-100 font-semibold tracking-wider opacity-100">
                          Gagal Menyalin
                        </span>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-burgundy-950 shrink-0" />
                          <span className="text-burgundy-950 font-semibold tracking-wider opacity-100">
                            Salin No. Rekening
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* ── Optional Physical Gift Address Drawer ─────────────────── */}
        {gifts.physicalGift && (
          <Reveal animation="fade-up" delay={0.55} duration={0.85}>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowPhysicalAddress((prev) => !prev)}
                aria-expanded={showPhysicalAddress}
                aria-label="Tampilkan alamat pengiriman kado fisik"
                className="inline-flex items-center justify-center gap-2.5 min-h-[44px] px-6 py-2.5 rounded-full bg-burgundy-950/80 hover:bg-burgundy-950 border border-rose-200/40 hover:border-rose-200/70 text-rose-100 hover:text-white transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 active:scale-[0.97] cursor-pointer select-none"
              >
                <Gift className="w-4 h-4 text-rose-200 shrink-0" />
                <span className="font-sans text-xs font-semibold tracking-wider text-rose-100 opacity-100">
                  Kirim Kado Fisik
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-rose-200 shrink-0 transition-transform duration-300",
                    showPhysicalAddress && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {showPhysicalAddress && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{
                      duration: prefersReducedMotion ? 0.01 : 0.35,
                      ease: "easeInOut",
                    }}
                    className="overflow-hidden mt-3"
                  >
                    <div className="p-5 rounded-2xl bg-burgundy-950/70 border border-rose-200/25 shadow-xl backdrop-blur-md text-center space-y-3">
                      <div className="flex items-center justify-center gap-1.5 text-rose-200/90 font-sans font-semibold text-xs uppercase tracking-wider">
                        <MapPin className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                        <span>Alamat Penerima</span>
                      </div>

                      <div className="space-y-1">
                        <p className="font-serif text-sm sm:text-base font-semibold text-rose-100">
                          {gifts.physicalGift.recipientName}
                        </p>
                        <p className="font-sans text-xs text-rose-200/80 leading-relaxed max-w-xs mx-auto">
                          {gifts.physicalGift.address}
                        </p>
                        {gifts.physicalGift.note && (
                          <p className="font-serif italic text-[11px] text-rose-200/60 pt-1">
                            {gifts.physicalGift.note}
                          </p>
                        )}
                      </div>

                      <div className="pt-1 flex justify-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              `${gifts.physicalGift!.recipientName}\n${gifts.physicalGift!.address}`,
                              "physical-address"
                            )
                          }
                          aria-label="Salin alamat lengkap penerima kado fisik"
                          className={cn(
                            "inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 rounded-full text-xs font-sans font-semibold tracking-wider uppercase shadow-md transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 active:scale-[0.97] cursor-pointer select-none",
                            copiedKey === "physical-address"
                              ? "bg-emerald-700 text-white border border-emerald-600 shadow-md"
                              : "bg-rose-100 hover:bg-white text-burgundy-950 border border-rose-200/70"
                          )}
                        >
                          {copiedKey === "physical-address" ? (
                            <>
                              <Check className="w-4 h-4 text-white shrink-0 stroke-[2.5]" />
                              <span className="text-white font-semibold tracking-wider opacity-100">
                                Alamat Tersalin
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-burgundy-950 shrink-0" />
                              <span className="text-burgundy-950 font-semibold tracking-wider opacity-100">
                                Salin Alamat
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        )}

        {/* ── Closing Botanical Cluster ─────────────────────────────── */}
        <Reveal animation="fade" delay={0.65} duration={1.0}>
          <div className="pt-6 flex justify-center">
            <AmbientFloralSway preset="gentle">
              <FloralBottomCluster
                color="rgba(254, 205, 211, 0.4)"
                width={150}
                height={32}
              />
            </AmbientFloralSway>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default LoveGift;
