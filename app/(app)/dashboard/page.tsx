"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { DailyCard } from "@/components/horoscope/daily-card";
import { SignSwitcher } from "@/components/horoscope/sign-switcher";
import { MoonIcon, StarOrnament, SunIcon } from "@/components/icons/stellara-mark";
import { ProfileSetup } from "@/components/profile/profile-setup";
import { Card, CardTitle } from "@/components/ui/card";
import { readSignOverride, writeSignOverride } from "@/lib/client/sign-override";
import type { SunSign } from "@/lib/db/types";

interface HoroscopeData {
  sign: SunSign;
  profileSign: SunSign;
  date: string;
  content: string;
  cached: boolean;
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [pendingSign, setPendingSign] = useState<SunSign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsSetup, setNeedsSetup] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

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

  const fetchHoroscope = useCallback(
    async (signOverride: SunSign | null) => {
      // Cancel any in-flight request to prevent stale data overwriting newer one
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);
      try {
        const url = signOverride
          ? `/api/horoscope?${new URLSearchParams({ sign: signOverride }).toString()}`
          : "/api/horoscope";
        const res = await fetch(url, { signal: controller.signal });
        if (controller.signal.aborted) return;
        const json = await res.json();
        if (controller.signal.aborted) return;
        if (!json.success) {
          if (json.code === "PROFILE_NOT_FOUND") {
            setNeedsSetup(true);
          } else {
            setError(json.error ?? tCommon("error.serverConnection"));
          }
          return;
        }
        setHoroscope(json.data);
        setPendingSign(null);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(tCommon("error.serverConnection"));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [tCommon],
  );

  useEffect(() => {
    fetchHoroscope(readSignOverride());
  }, [fetchHoroscope]);

  function handleSetupComplete(data: HoroscopeData) {
    setNeedsSetup(false);
    setHoroscope(data);
  }

  function handleSignChange(sign: SunSign) {
    writeSignOverride(sign);
    setPendingSign(sign);
    fetchHoroscope(sign);
  }

  const greeting = getGreeting();
  const TimeIcon = greeting === "evening" || greeting === "afternoon" ? null : SunIcon;
  const isNight = greeting === "evening";

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-gold-leaf/70 text-xs tracking-[0.3em] uppercase mb-2">
            {isNight ? <MoonIcon size={14} /> : TimeIcon && <TimeIcon size={14} />}
            <span>Stellara</span>
          </div>
          <h1
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-moonlight mb-2 tracking-tight"
            style={{ wordBreak: "keep-all" }}
          >
            {t(`greeting.${greeting}`)}
          </h1>
          <p className="text-text-muted text-sm leading-relaxed max-w-md">{t("subtitle")}</p>
        </div>
        {horoscope && !needsSetup && (
          <SignSwitcher
            currentSign={pendingSign ?? horoscope.sign}
            profileSign={horoscope.profileSign}
            onChange={handleSignChange}
          />
        )}
      </header>

      {needsSetup ? (
        <ProfileSetup onComplete={handleSetupComplete} />
      ) : (
        <DailyCard
          sign={horoscope?.sign ?? null}
          date={horoscope?.date ?? null}
          content={horoscope?.content ?? null}
          loading={loading}
          error={error}
        />
      )}

      <section>
        <div className="divider-ornament mb-5">
          <span className="font-heading">{t("explore")}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href} className="group">
              <Card className="h-full transition-all duration-300 group-hover:border-gold-leaf/40 group-hover:bg-night-mist/60 group-hover:shadow-[0_0_24px_-8px_rgba(201,169,97,0.3)] cursor-pointer">
                <div className="text-gold-leaf text-2xl mb-3 group-hover:scale-110 transition-transform" aria-hidden="true">
                  {action.icon}
                </div>
                <CardTitle className="text-base mb-1.5">{t(action.titleKey)}</CardTitle>
                <p className="text-xs text-text-muted leading-relaxed">{t(action.descKey)}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-center gap-3 text-gold-leaf/30">
        <StarOrnament size={6} />
        <StarOrnament size={8} />
        <StarOrnament size={6} />
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
