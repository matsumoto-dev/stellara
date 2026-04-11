"use client";

import { useTranslations } from "next-intl";
import { StarOrnament } from "@/components/icons/stellara-mark";
import { ShareButtons } from "@/components/share/share-buttons";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { parseSections, SECTION_LABELS } from "@/lib/reading/parse-sections";
import type { ShareReadingType } from "@/lib/share/share-urls";

interface ReadingResultProps {
  content: string;
  type: string;
  sign?: string;
  rejected?: boolean;
}

function toReadingType(type: string): ShareReadingType {
  if (type === "tarot") return "tarot";
  if (type === "weekly") return "weekly";
  return "reading";
}

function truncateForShare(text: string, max = 200): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

const TYPE_LABELS: Record<string, string> = {
  tarot: "タロット鑑定",
  personal: "パーソナル鑑定",
  horoscope: "デイリーホロスコープ",
  weekly: "ウィークリーホロスコープ",
  chat: "チャット",
};

export function ReadingResult({ content, type, sign, rejected }: ReadingResultProps) {
  const t = useTranslations("reading");
  const sections = parseSections(content);

  return (
    <Card variant={rejected ? "subtle" : "artifact"}>
      <div className="flex items-center gap-2 mb-6">
        <Badge variant={rejected ? "muted" : "gold-rim"}>
          {TYPE_LABELS[type] ?? `${type.charAt(0).toUpperCase()}${type.slice(1)} Reading`}
        </Badge>
        {rejected && <Badge variant="muted">{t("contentFiltered")}</Badge>}
      </div>

      <div className="space-y-7">
        {sections.map((section, i) => {
          const label = section.tag ? SECTION_LABELS[section.tag] : null;
          return (
            <div key={`${section.tag ?? "body"}-${i}`}>
              {label && (
                <div className="divider-ornament mb-4" aria-hidden="true">
                  <span className="font-heading uppercase text-[10px] text-gold-leaf/80">
                    {label}
                  </span>
                </div>
              )}
              <div className="font-reading text-text/95 text-[15.5px] leading-[1.85] whitespace-pre-line">
                {section.content}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-5 border-t border-gold-leaf/15">
        <p className="text-xs text-text-muted/80 italic text-center mb-4 leading-relaxed">
          {t("guidanceNote")}
        </p>
        {!rejected && (
          <>
            <div className="flex items-center justify-center gap-2 text-gold-leaf/35 mb-4">
              <StarOrnament size={6} />
              <StarOrnament size={8} />
              <StarOrnament size={6} />
            </div>
            <ShareButtons
              type={toReadingType(type)}
              text={truncateForShare(content)}
              sign={sign}
            />
          </>
        )}
      </div>
    </Card>
  );
}
