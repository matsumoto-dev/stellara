"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ReadingCard } from "@/components/history/reading-card";
import { ProGate } from "@/components/settings/pro-gate";
import { Loading } from "@/components/ui/loading";
import type { ReadingType } from "@/lib/db/types";

interface Reading {
  id: string;
  type: ReadingType;
  content: string;
  created_at: string;
}

interface HistoryData {
  readings: Reading[];
  total: number;
  limit: number;
  offset: number;
}

const PAGE_SIZE = 10;

export default function HistoryPage() {
  const t = useTranslations("history");
  const tCommon = useTranslations("common");

  const [data, setData] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgradeRequired, setUpgradeRequired] = useState(false);

  useEffect(() => {
    fetchHistory(0, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchHistory(offset: number, initial: boolean) {
    if (initial) setLoading(true);
    else setLoadingMore(true);
    setError(null);

    try {
      const res = await fetch(`/api/readings?limit=${PAGE_SIZE}&offset=${offset}`);
      const json = await res.json();

      if (!json.success) {
        if (json.upgradeRequired) {
          setUpgradeRequired(true);
          return;
        }
        setError(json.error ?? t("error"));
        return;
      }

      setData((prev) => {
        if (initial || !prev) return json.data;
        return {
          ...json.data,
          readings: [...prev.readings, ...json.data.readings],
        };
      });
    } catch {
      setError(tCommon("error.serverConnection"));
    } finally {
      if (initial) setLoading(false);
      else setLoadingMore(false);
    }
  }

  function handleLoadMore() {
    if (!data) return;
    fetchHistory(data.offset + data.limit, false);
  }

  const hasMore = data ? data.offset + data.limit < data.total : false;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-text mb-1">{t("title")}</h1>
        <p className="text-text-muted">{t("subtitle")}</p>
      </div>

      {loading && <Loading text={t("loading")} size="lg" />}

      {upgradeRequired && <ProGate feature="history" />}

      {error && (
        <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-4">
          {error}
        </div>
      )}

      {!loading && !upgradeRequired && !error && data && (
        <>
          {data.readings.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-12">{t("empty")}</p>
          ) : (
            <div className="space-y-4">
              {data.readings.map((reading) => (
                <ReadingCard
                  key={reading.id}
                  id={reading.id}
                  type={reading.type}
                  content={reading.content}
                  createdAt={reading.created_at}
                />
              ))}
            </div>
          )}

          {hasMore && (
            <div className="text-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="text-accent text-sm hover:underline disabled:opacity-50"
              >
                {loadingMore ? <Loading size="sm" /> : t("loadMore")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
