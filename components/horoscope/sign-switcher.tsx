"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { SUN_SIGNS, type SunSign } from "@/lib/db/types";

const ZODIAC_SYMBOLS: Record<SunSign, string> = {
  aries: "\u2648",
  taurus: "\u2649",
  gemini: "\u264A",
  cancer: "\u264B",
  leo: "\u264C",
  virgo: "\u264D",
  libra: "\u264E",
  scorpio: "\u264F",
  sagittarius: "\u2650",
  capricorn: "\u2651",
  aquarius: "\u2652",
  pisces: "\u2653",
};

interface SignSwitcherProps {
  currentSign: SunSign;
  onChange: (sign: SunSign) => void;
}

export function SignSwitcher({ currentSign, onChange }: SignSwitcherProps) {
  const tZodiac = useTranslations("zodiac");
  const tSwitcher = useTranslations("signSwitcher");
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  // Focus management: when panel opens, focus current selection.
  // When panel closes via Escape, return focus to trigger.
  useEffect(() => {
    if (!open) return;
    const activeEl = panelRef.current?.querySelector<HTMLButtonElement>(
      `[data-sign="${currentSign}"]`,
    );
    activeEl?.focus();
  }, [open, currentSign]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function handleSelect(sign: SunSign) {
    onChange(sign);
    setOpen(false);
    // Return focus to trigger after selection for keyboard users
    setTimeout(() => triggerRef.current?.focus(), 0);
  }

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={tSwitcher("switchSign")}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-bg-card/60 text-sm text-text hover:border-accent/60 hover:bg-bg-card transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      >
        <span className="text-lg" aria-hidden="true">{ZODIAC_SYMBOLS[currentSign]}</span>
        <span>{tZodiac(currentSign)}</span>
        <span className="text-text-muted text-xs" aria-hidden="true">▾</span>
      </button>

      {open && (
        <>
          {/* backdrop to close on outside click — not in tab order */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
            }}
            role="presentation"
          />
          <div
            ref={panelRef}
            id={listboxId}
            role="listbox"
            aria-label={tSwitcher("switchSign")}
            className="absolute z-50 mt-2 left-0 w-72 p-3 rounded-xl border border-accent/30 bg-bg-card shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            <p className="text-xs text-text-muted px-2 mb-2">{tSwitcher("hint")}</p>
            <div className="grid grid-cols-3 gap-1.5">
              {SUN_SIGNS.map((sign) => {
                const isActive = sign === currentSign;
                return (
                  <button
                    key={sign}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    data-sign={sign}
                    onClick={() => handleSelect(sign)}
                    className={`
                      flex flex-col items-center gap-0.5 rounded-lg p-2 transition-all border text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
                      ${
                        isActive
                          ? "border-accent bg-accent/15 text-accent"
                          : "border-text-muted/10 text-text-muted hover:border-accent/40 hover:text-text"
                      }
                    `}
                  >
                    <span className="text-xl" aria-hidden="true">{ZODIAC_SYMBOLS[sign]}</span>
                    <span className="leading-tight">{tZodiac(sign)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
