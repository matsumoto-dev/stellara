"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { StarOrnament } from "@/components/icons/stellara-mark";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

interface ProfileSetupProps {
  onComplete: (data: {
    sign: SunSign;
    date: string;
    content: string;
    cached: boolean;
  }) => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const t = useTranslations("profileSetup");
  const tZodiac = useTranslations("zodiac");
  const [selected, setSelected] = useState<SunSign | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!selected) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/horoscope", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sun_sign: selected }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? t("error"));
        return;
      }
      onComplete(json.data);
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card variant="artifact">
      <div className="text-center mb-6">
        <div className="divider-ornament max-w-xs mx-auto mb-4">
          <StarOrnament size={8} />
        </div>
        <h2 className="font-heading text-2xl font-semibold text-gold-pale tracking-tight mb-2">
          {t("title")}
        </h2>
        <p className="text-sm text-text-muted leading-relaxed">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mb-6">
        {SUN_SIGNS.map((sign) => (
          <button
            key={sign}
            type="button"
            onClick={() => setSelected(sign)}
            className={`
              flex flex-col items-center gap-1 rounded-lg p-3 transition-all border
              ${
                selected === sign
                  ? "border-gold-leaf bg-gold-leaf/15 shadow-[0_0_20px_-4px_rgba(201,169,97,0.45)]"
                  : "border-ink-shadow/40 bg-night-deep/40 hover:border-gold-leaf/40 hover:bg-night-veil/60"
              }
            `}
          >
            <span
              className={`text-2xl transition-all ${
                selected === sign
                  ? "text-gold-glow drop-shadow-[0_0_10px_rgba(255,217,106,0.6)]"
                  : "text-gold-leaf/70"
              }`}
              aria-hidden="true"
            >
              {ZODIAC_SYMBOLS[sign]}
            </span>
            <span className="text-xs text-text-muted">{tZodiac(sign)}</span>
          </button>
        ))}
      </div>

      {error && <p className="text-red-300/90 text-sm mb-4 text-center">{error}</p>}

      <div className="flex justify-center">
        <Button onClick={handleSubmit} disabled={!selected} loading={loading} size="lg">
          {t("submit")}
        </Button>
      </div>
    </Card>
  );
}
