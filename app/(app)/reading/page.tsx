"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { RateLimitCard } from "@/components/reading/rate-limit-card";
import { ReadingForm } from "@/components/reading/reading-form";
import { ReadingResult } from "@/components/reading/reading-result";
import { Loading } from "@/components/ui/loading";

interface ReadingData {
  content: string;
  type: string;
  rejected: boolean;
}

export default function ReadingPage() {
  const t = useTranslations("reading");
  const tCommon = useTranslations("common");
  const [result, setResult] = useState<ReadingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitedAt, setRateLimitedAt] = useState<string | null | undefined>(undefined);

  async function handleSubmit(question: string) {
    setLoading(true);
    setError(null);
    setRateLimitedAt(undefined);
    setResult(null);

    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "personal",
          variables: { question: question || undefined },
        }),
      });
      const json = await res.json();
      if (!json.success) {
        if (res.status === 429) {
          setRateLimitedAt(json.resetAt ?? null);
          return;
        }
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

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <header>
        <div className="flex items-center gap-2 text-gold-leaf/70 text-xs tracking-[0.3em] uppercase mb-2">
          <span>✦</span>
          <span>Personal Reading</span>
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-semibold text-moonlight mb-2 tracking-tight">
          {t("title")}
        </h1>
        <p className="text-text-muted text-sm leading-relaxed">{t("subtitle")}</p>
      </header>

      {!result && !loading && rateLimitedAt === undefined && (
        <div className="bg-night-veil/40 backdrop-blur-sm border border-gold-leaf/15 rounded-xl p-7">
          <ReadingForm
            onSubmit={handleSubmit}
            loading={loading}
            placeholder={t("placeholder")}
            buttonText={t("revealReading")}
          />
        </div>
      )}

      {loading && <Loading text={t("loading")} size="lg" />}

      {error && (
        <div className="text-red-300/90 text-sm bg-red-900/20 border border-red-400/20 rounded-lg p-4">
          {error}
        </div>
      )}

      {rateLimitedAt !== undefined && <RateLimitCard resetAt={rateLimitedAt ?? undefined} />}

      {result && (
        <>
          <ReadingResult content={result.content} type={result.type} rejected={result.rejected} />
          <button
            type="button"
            onClick={() => setResult(null)}
            className="text-accent text-sm hover:underline"
          >
            {t("anotherReading")}
          </button>
        </>
      )}
    </div>
  );
}
