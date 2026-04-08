"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { DailyCard } from "@/components/horoscope/daily-card";
import { Card, CardTitle } from "@/components/ui/card";
import type { SunSign } from "@/lib/db/types";

interface HoroscopeData {
  sign: SunSign;
  date: string;
  content: string;
  cached: boolean;
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const quickActions = [
    {
      href: "/reading",
      icon: "\u2728",
      titleKey: "actions.personalReading.title" as const,
      descKey: "actions.personalReading.description" as const,
    },
    {
      href: "/tarot",
      icon: "\u2660",
      titleKey: "actions.tarot.title" as const,
      descKey: "actions.tarot.description" as const,
    },
    {
      href: "/chat",
      icon: "\u2601",
      titleKey: "actions.chat.title" as const,
      descKey: "actions.chat.description" as const,
    },
  ];

  useEffect(() => {
    async function fetchHoroscope() {
      try {
        const res = await fetch("/api/horoscope");
        const json = await res.json();
        if (!json.success) {
          setError(json.error ?? "Failed to load horoscope");
          return;
        }
        setHoroscope(json.data);
      } catch {
        setError(tCommon("error.serverConnection"));
      } finally {
        setLoading(false);
      }
    }
    fetchHoroscope();
  }, [tCommon]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-text mb-1">
          {t(`greeting.${getGreeting()}`)}
        </h1>
        <p className="text-text-muted">{t("subtitle")}</p>
      </div>

      <DailyCard
        sign={horoscope?.sign ?? null}
        date={horoscope?.date ?? null}
        content={horoscope?.content ?? null}
        loading={loading}
        error={error}
      />

      <div>
        <h2 className="font-heading text-lg font-semibold text-text mb-4">{t("explore")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="hover:border-accent/30 transition-colors cursor-pointer h-full">
                <span className="text-2xl mb-2 block">{action.icon}</span>
                <CardTitle className="text-base">{t(action.titleKey)}</CardTitle>
                <p className="text-xs text-text-muted mt-1">{t(action.descKey)}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
