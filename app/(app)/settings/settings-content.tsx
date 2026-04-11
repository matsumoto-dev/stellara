"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { DeleteAccountDialog } from "@/components/settings/delete-account-dialog";
import { SubscriptionSection } from "@/components/settings/subscription-section";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { PlanType, SubscriptionStatus } from "@/lib/db/types";

interface SettingsContentProps {
  readonly plan: PlanType;
  readonly subscriptionStatus: SubscriptionStatus;
  readonly periodEnd: string | null;
  readonly monthlyPriceId: string;
  readonly stripeConfigured: boolean;
  readonly isEU: boolean;
  readonly countryCode: string | null;
}

export function SettingsContent({
  plan,
  subscriptionStatus,
  periodEnd,
  monthlyPriceId,
  stripeConfigured,
  isEU,
  countryCode,
}: SettingsContentProps) {
  const router = useRouter();
  const t = useTranslations("settings");
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const json = await res.json().catch(() => ({ success: false }));
      if (!json.success) {
        setLoggingOut(false);
        return;
      }
      window.location.href = "/login";
    } catch {
      setLoggingOut(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleteError(null);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const json = await res.json();
      if (!json.success) {
        setDeleteError(json.error ?? "アカウントの削除に失敗しました");
        return;
      }
      router.push("/login");
    } catch {
      setDeleteError(tCommon("error.serverConnection"));
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-text mb-1">{t("title")}</h1>
        <p className="text-text-muted">{t("subtitle")}</p>
      </div>

      <SubscriptionSection
        plan={plan}
        subscriptionStatus={subscriptionStatus}
        periodEnd={periodEnd}
        monthlyPriceId={monthlyPriceId}
        stripeConfigured={stripeConfigured}
        isEU={isEU}
        countryCode={countryCode}
      />

      <Card>
        <CardHeader>
          <CardTitle>{tAuth("logout")}</CardTitle>
        </CardHeader>
        <p className="text-sm text-text-muted mb-4">{t("logoutDescription")}</p>
        <Button variant="secondary" onClick={handleLogout} loading={loggingOut}>
          {tAuth("logout")}
        </Button>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("dangerZone")}</CardTitle>
        </CardHeader>
        <p className="text-sm text-text-muted mb-4">{t("deleteDescription")}</p>
        {deleteError && <p className="text-red-400 text-sm mb-3">{deleteError}</p>}
        <Button variant="danger" onClick={() => setShowDeleteDialog(true)}>
          {t("deleteButton")}
        </Button>
      </Card>

      <DeleteAccountDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}
