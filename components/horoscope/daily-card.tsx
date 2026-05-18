"use client";

import { useTranslations } from "next-intl";
import { ZodiacIcon } from "@/components/horoscope/zodiac-icon";
import { StarOrnament } from "@/components/icons/stellara-mark";
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
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return dateStr;
  const [, y, m, d] = match;
  return `${y}年${Number(m)}月${Number(d)}日`;
}

export function DailyCard({ sign, date, content, loading, error }: DailyCardProps) {
  const t = useTranslations("horoscope");

  if (loading) {
    return (
      <Card variant="artifact">
        <Loading text={t("loading")} />
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="subtle">
        <p className="text-red-300/90 text-sm">{error}</p>
      </Card>
    );
  }

  if (!content || !sign) {
    return null;
  }

  const sections = parseSections(content);

  return (
    <Card variant="artifact">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-gold-leaf text-4xl drop-shadow-[0_0_12px_rgba(255,217,106,0.4)]">
              <ZodiacIcon sign={sign} size="lg" />
            </div>
            <div>
              <CardTitle className="text-gold-pale">{t("todaysHoroscope")}</CardTitle>
              <p className="text-xs text-text-muted mt-1 tracking-wide">
                {date ? formatDateJa(date) : ""}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <div className="space-y-6">
        {sections.map((section, i) => {
          const label = section.tag ? SECTION_LABELS[section.tag] : null;
          return (
            <div key={`${section.tag ?? "body"}-${i}`}>
              {label && (
                <div className="divider-ornament mb-3" aria-hidden="true">
                  <span className="font-heading uppercase text-[10px] text-gold-leaf/80">
                    {label}
                  </span>
                </div>
              )}
              <div className="font-reading text-text/95 text-[15px] leading-[1.85] whitespace-pre-line">
                {section.content}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-7 pt-5 border-t border-gold-leaf/15">
        <div className="flex items-center justify-center mb-4 gap-2 text-gold-leaf/40">
          <StarOrnament size={8} />
          <StarOrnament size={6} />
          <StarOrnament size={8} />
        </div>
        <ShareButtons
          type="horoscope"
          text={content.length > 200 ? `${content.slice(0, 199)}…` : content}
          sign={sign}
        />
      </div>
    </Card>
  );
}
