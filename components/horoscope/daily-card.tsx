"use client";

import { useTranslations } from "next-intl";
import { ShareButtons } from "@/components/share/share-buttons";
import { ZodiacIcon } from "@/components/horoscope/zodiac-icon";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import type { SunSign } from "@/lib/db/types";

interface DailyCardProps {
  sign: SunSign | null;
  date: string | null;
  content: string | null;
  loading: boolean;
  error: string | null;
}

export function DailyCard({ sign, date, content, loading, error }: DailyCardProps) {
  const t = useTranslations("horoscope");

  if (loading) {
    return (
      <Card glow>
        <Loading text={t("loading")} />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <p className="text-red-400 text-sm">{error}</p>
      </Card>
    );
  }

  if (!content || !sign) {
    return null;
  }

  return (
    <Card glow>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ZodiacIcon sign={sign} size="lg" />
            <div>
              <CardTitle>{t("todaysHoroscope")}</CardTitle>
              <p className="text-xs text-text-muted mt-0.5">{date}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <div className="text-text/90 leading-relaxed whitespace-pre-line">{content}</div>
      <div className="mt-4 pt-4 border-t border-text-muted/10">
        <ShareButtons
          type="horoscope"
          text={content.length > 200 ? `${content.slice(0, 199)}…` : content}
          sign={sign}
        />
      </div>
    </Card>
  );
}
