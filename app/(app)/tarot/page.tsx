"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ReadingForm } from "@/components/reading/reading-form";
import { ReadingResult } from "@/components/reading/reading-result";
import { CardSelector } from "@/components/tarot/card-selector";
import { TarotCard } from "@/components/tarot/tarot-card";
import { Loading } from "@/components/ui/loading";
import { type DrawnCard, drawCards } from "@/lib/astrology/tarot-deck";

interface TarotData {
  content: string;
  type: string;
  rejected: boolean;
}

export default function TarotPage() {
  const t = useTranslations("tarot");
  const tCommon = useTranslations("common");
  const [spread, setSpread] = useState<1 | 3>(1);
  const [drawnCards, setDrawnCards] = useState<readonly DrawnCard[] | null>(null);
  const [result, setResult] = useState<TarotData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  async function handleDraw(question: string) {
    setLoading(true);
    setError(null);
    setResult(null);
    setRevealed(false);

    const cards = drawCards(spread);
    setDrawnCards(cards);

    setTimeout(() => setRevealed(true), 200);

    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "tarot",
          variables: {
            cards: cards.map((c) => ({
              name: c.card.name,
              position: c.position,
              orientation: c.orientation,
            })),
            question: question || undefined,
          },
        }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? t("error"));
        return;
      }
      setResult(json.data);
    } catch {
      setError(tCommon("error.serverConnection"));
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setDrawnCards(null);
    setResult(null);
    setRevealed(false);
    setError(null);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <header>
        <div className="flex items-center gap-2 text-gold-leaf/70 text-xs tracking-[0.3em] uppercase mb-2">
          <span>♠</span>
          <span>Tarot</span>
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-semibold text-moonlight mb-2 tracking-tight">
          {t("title")}
        </h1>
        <p className="text-text-muted text-sm leading-relaxed">{t("subtitle")}</p>
      </header>

      {!drawnCards && (
        <>
          <CardSelector selected={spread} onSelect={setSpread} disabled={loading} />
          <ReadingForm
            onSubmit={handleDraw}
            loading={loading}
            placeholder={t("placeholder")}
            buttonText={t("drawCards")}
          />
        </>
      )}

      {drawnCards && (
        <div className="flex justify-center gap-6 flex-wrap py-6">
          {drawnCards.map((card, i) => (
            <TarotCard key={card.card.name} drawn={card} revealed={revealed} index={i} />
          ))}
        </div>
      )}

      {loading && drawnCards && <Loading text={t("loading")} size="lg" />}

      {error && (
        <div className="text-red-300/90 text-sm bg-red-900/20 border border-red-400/20 rounded-lg p-4">
          {error}
        </div>
      )}

      {result && (
        <>
          <ReadingResult content={result.content} type="tarot" rejected={result.rejected} />
          <div className="text-center">
            <button
              type="button"
              onClick={handleReset}
              className="text-gold-pale text-sm tracking-wide hover:text-gold-glow transition-colors"
            >
              ✦ {t("drawAgain")} ✦
            </button>
          </div>
        </>
      )}
    </div>
  );
}
