"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
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
    <Card glow>
      <h2 className="font-heading text-xl font-semibold text-text mb-1">
        {t("title")}
      </h2>
      <p className="text-sm text-text-muted mb-5">{t("subtitle")}</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-5">
        {SUN_SIGNS.map((sign) => (
          <button
            key={sign}
            type="button"
            onClick={() => setSelected(sign)}
            className={`
              flex flex-col items-center gap-1 rounded-lg p-3 transition-all border
              ${
                selected === sign
                  ? "border-accent bg-accent/10 shadow-[0_0_12px_rgba(212,175,55,0.15)]"
                  : "border-text-muted/10 bg-bg-card hover:border-accent/30"
              }
            `}
          >
            <span className="text-2xl">{ZODIAC_SYMBOLS[sign]}</span>
            <span className="text-xs text-text-muted">{tZodiac(sign)}</span>
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      <Button
        onClick={handleSubmit}
        disabled={!selected}
        loading={loading}
      >
        {t("submit")}
      </Button>
    </Card>
  );
}
