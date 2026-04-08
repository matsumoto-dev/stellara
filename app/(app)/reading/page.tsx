"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
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

  async function handleSubmit(question: string) {
    setLoading(true);
    setError(null);
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
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-text mb-1">{t("title")}</h1>
        <p className="text-text-muted">{t("subtitle")}</p>
      </div>

      {!result && !loading && (
        <ReadingForm onSubmit={handleSubmit} loading={loading} buttonText={t("revealReading")} />
      )}

      {loading && <Loading text={t("loading")} size="lg" />}

      {error && (
        <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-4">
          {error}
        </div>
      )}

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
