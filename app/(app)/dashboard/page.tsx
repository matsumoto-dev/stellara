"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { DailyCard } from "@/components/horoscope/daily-card";
import { SignSwitcher } from "@/components/horoscope/sign-switcher";
import { ProfileSetup } from "@/components/profile/profile-setup";
import { Card, CardTitle } from "@/components/ui/card";
import { SUN_SIGNS, type SunSign } from "@/lib/db/types";

interface HoroscopeData {
  sign: SunSign;
  date: string;
  content: string;
  cached: boolean;
}

const SIGN_OVERRIDE_KEY = "stellara:viewing_sign";

function readSignOverride(): SunSign | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.sessionStorage.getItem(SIGN_OVERRIDE_KEY);
    if (v && (SUN_SIGNS as readonly string[]).includes(v)) {
      return v as SunSign;
    }
  } catch {
    // sessionStorage may be blocked
  }
  return null;
}

function writeSignOverride(sign: SunSign | null): void {
  if (typeof window === "undefined") return;
  try {
    if (sign) {
      window.sessionStorage.setItem(SIGN_OVERRIDE_KEY, sign);
    } else {
      window.sessionStorage.removeItem(SIGN_OVERRIDE_KEY);
    }
  } catch {
    // ignore
  }
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

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-3xl font-bold text-text mb-1">
            {t(`greeting.${getGreeting()}`)}
          </h1>
          <p className="text-text-muted">{t("subtitle")}</p>
        </div>
        {horoscope && !needsSetup && (
          <SignSwitcher
            currentSign={pendingSign ?? horoscope.sign}
            onChange={handleSignChange}
          />
        )}
      </div>

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
