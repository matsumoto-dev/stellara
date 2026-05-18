"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { StarOrnament } from "@/components/icons/stellara-mark";
import { Card } from "@/components/ui/card";

interface RateLimitCardProps {
  /** Optional reset timestamp (ISO string) for "available again at..." messaging */
  resetAt?: string;
}

export function RateLimitCard({ resetAt }: RateLimitCardProps) {
  const t = useTranslations("rateLimit");

  return (
    <Card variant="artifact">
      <div className="flex flex-col items-center text-center py-8 px-4 space-y-5">
        <div
          className="text-gold-leaf text-4xl drop-shadow-[0_0_16px_rgba(255,217,106,0.5)]"
          aria-hidden="true"
        >
          ☾
        </div>
        <div className="divider-ornament max-w-[12rem]" aria-hidden="true">
          <StarOrnament size={6} />
        </div>
        <h2 className="font-heading text-2xl font-semibold text-gold-pale tracking-tight">
          {t("title")}
        </h2>
        <p className="text-sm text-text-muted max-w-md leading-[1.85] font-reading">
          {t("description")}
        </p>
        {resetAt && (
          <p className="text-xs text-text-muted/70">
            {t("resetAt", { time: formatResetTime(resetAt) })}
          </p>
        )}
        <Link
          href="/settings"
          className="inline-block bg-gradient-to-b from-gold-glow via-gold-leaf to-gold-deep text-night-void font-semibold px-7 py-3 rounded-lg tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_16px_-2px_rgba(201,169,97,0.4)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_24px_-2px_rgba(255,217,106,0.6)] transition-all"
        >
          {t("cta")}
        </Link>
      </div>
    </Card>
  );
}

function formatResetTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("ja-JP", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
