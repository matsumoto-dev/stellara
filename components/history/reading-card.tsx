"use client";

import { useTranslations } from "next-intl";
import type { ReadingType } from "@/lib/db/types";

interface ReadingCardProps {
  readonly id: string;
  readonly type: ReadingType;
  readonly content: string;
  readonly createdAt: string;
}

const TYPE_ICONS: Record<ReadingType, string> = {
  personal: "✨",
  tarot: "♠",
  chat: "☁",
  compatibility: "♡",
};

export function ReadingCard({ id: _id, type, content, createdAt }: ReadingCardProps) {
  const t = useTranslations("history");

  const date = new Date(createdAt);
  const dateStr = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Show first 200 chars of content as preview
  const preview = content.length > 200 ? `${content.slice(0, 200)}…` : content;

  return (
    <div className="bg-bg-card border border-text-muted/10 rounded-xl p-5 space-y-3 hover:border-accent/20 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{TYPE_ICONS[type] ?? "✨"}</span>
          <span className="text-sm font-medium text-accent capitalize">
            {t(`types.${type}`)}
          </span>
        </div>
        <span className="text-xs text-text-muted">
          {dateStr} · {timeStr}
        </span>
      </div>
      <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{preview}</p>
    </div>
  );
}
