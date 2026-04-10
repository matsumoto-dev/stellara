"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { PlanType, SubscriptionStatus } from "@/lib/db/types";
import type { EUConsentData } from "@/lib/legal/eu-consent";

interface SubscriptionSectionProps {
  readonly plan: PlanType;
  readonly subscriptionStatus: SubscriptionStatus;
  readonly periodEnd: string | null;
  readonly monthlyPriceId: string;
  readonly isEU: boolean;
  readonly countryCode: string | null;
}

export function SubscriptionSection({
  plan,
  subscriptionStatus,
  periodEnd,
  monthlyPriceId,
  isEU,
  countryCode,
}: SubscriptionSectionProps) {
  const t = useTranslations("settings.subscription");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [immediateDelivery, setImmediateDelivery] = useState(false);
  const [waiverAcknowledged, setWaiverAcknowledged] = useState(false);

  const euConsentComplete = !isEU || (immediateDelivery && waiverAcknowledged);

  async function handleUpgrade() {
    if (!euConsentComplete) {
      setError(t("euConsent.required"));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const body: { priceId: string; euConsent?: EUConsentData } = { priceId: monthlyPriceId };
      if (isEU && countryCode) {
        body.euConsent = {
          immediateDelivery,
          waiverAcknowledged,
          countryCode,
        };
      }

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success && json.url) {
        window.location.href = json.url;
      } else {
        setError(json.error ?? "決済の開始に失敗しました");
      }
    } catch {
      setError("サーバーに接続できませんでした");
    } finally {
      setLoading(false);
    }
  }

  async function handleManage() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const json = await res.json();
      if (json.success && json.url) {
        window.location.href = json.url;
      } else {
        setError(json.error ?? "管理画面を開けませんでした");
      }
    } catch {
      setError("サーバーに接続できませんでした");
    } finally {
      setLoading(false);
    }
  }

  const isPro = plan === "pro";
  const formattedDate = periodEnd
    ? new Date(periodEnd).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted">{t("currentPlan")}</p>
            <p className="text-lg font-semibold text-text">{isPro ? t("pro") : t("free")}</p>
          </div>
          {isPro && formattedDate && (
            <p className="text-sm text-text-muted">{t("nextBilling", { date: formattedDate })}</p>
          )}
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {isPro ? (
          <Button onClick={handleManage} disabled={loading}>
            {loading ? t("loading") : t("manage")}
          </Button>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-text-muted">{t("upgradeDescription")}</p>

            {isEU && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 space-y-3">
                <p className="text-sm font-medium text-amber-300">{t("euConsent.title")}</p>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
                    checked={immediateDelivery}
                    onChange={(e) => setImmediateDelivery(e.target.checked)}
                  />
                  <span className="text-sm text-text-muted leading-relaxed">
                    {t("euConsent.immediateDelivery")}
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
                    checked={waiverAcknowledged}
                    onChange={(e) => setWaiverAcknowledged(e.target.checked)}
                  />
                  <span className="text-sm text-text-muted leading-relaxed">
                    {t("euConsent.waiverAcknowledged")}
                  </span>
                </label>
              </div>
            )}

            <Button onClick={handleUpgrade} disabled={loading || !euConsentComplete}>
              {loading ? t("loading") : t("upgrade")}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
