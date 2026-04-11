"use client";

import { useTranslations } from "next-intl";
import { ZodiacIcon } from "@/components/horoscope/zodiac-icon";
import { ShareButtons } from "@/components/share/share-buttons";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { parseSections, SECTION_LABELS } from "@/lib/reading/parse-sections";
import type { SunSign } from "@/lib/db/types";

interface DailyCardProps {
  sign: SunSign | null;
  date: string | null;
  content: string | null;
  loading: boolean;
  error: string | null;
}

function formatDateJa(dateStr: string): string {
  // dateStr is "YYYY-MM-DD"; render as "YYYY年M月D日"
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return dateStr;
  const [, y, m, d] = match;
  return `${y}年${Number(m)}月${Number(d)}日`;
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

  const sections = parseSections(content);

  return (
    <Card glow>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ZodiacIcon sign={sign} size="lg" />
            <div>
              <CardTitle>{t("todaysHoroscope")}</CardTitle>
              <p className="text-xs text-text-muted mt-0.5">{date ? formatDateJa(date) : ""}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <div className="space-y-4">
        {sections.map((section, i) => (
          <div key={`${section.tag ?? "body"}-${i}`}>
            {section.tag && SECTION_LABELS[section.tag] && (
              <h4 className="font-heading text-xs font-semibold text-accent/80 tracking-wide mb-1.5">
                {SECTION_LABELS[section.tag]}
              </h4>
            )}
            <div className="text-text/90 leading-relaxed whitespace-pre-line">
              {section.content}
            </div>
          </div>
        ))}
      </div>
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
