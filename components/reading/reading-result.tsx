"use client";

import { useTranslations } from "next-intl";
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

/** Maps API reading types to ShareButtons ShareReadingType. */
function toReadingType(type: string): ShareReadingType {
  if (type === "tarot") return "tarot";
  if (type === "weekly") return "weekly";
  return "reading";
}

/** Truncates text to fit within a tweet (max ~200 chars). */
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
    <Card glow={!rejected}>
      <div className="flex items-center gap-2 mb-4">
        <Badge variant={rejected ? "muted" : "accent"}>
          {TYPE_LABELS[type] ?? `${type.charAt(0).toUpperCase()}${type.slice(1)} Reading`}
        </Badge>
        {rejected && <Badge variant="muted">{t("contentFiltered")}</Badge>}
      </div>

      <div className="space-y-5">
        {sections.map((section, i) => (
          <div key={`${section.tag ?? "body"}-${i}`}>
            {section.tag && SECTION_LABELS[section.tag] && (
              <h3 className="font-heading text-sm font-semibold text-accent/80 tracking-wide mb-2">
                {SECTION_LABELS[section.tag]}
              </h3>
            )}
            <div className="text-text/90 leading-relaxed whitespace-pre-line">
              {section.content}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-text-muted italic">{t("guidanceNote")}</p>
      {!rejected && (
        <div className="mt-4 pt-4 border-t border-text-muted/10">
          <ShareButtons
            type={toReadingType(type)}
            text={truncateForShare(content)}
            sign={sign}
          />
        </div>
      )}
    </Card>
  );
}
