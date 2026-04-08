"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DeleteAccountDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteAccountDialog({ open, onClose, onConfirm }: DeleteAccountDialogProps) {
  const t = useTranslations("settings.deleteDialog");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const isValid = confirmation === "DELETE";

  async function handleConfirm() {
    if (!isValid) return;
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-bg-card border border-text-muted/20 rounded-xl p-6 w-full max-w-md mx-4 space-y-4">
        <h2 className="font-heading text-xl font-semibold text-text">{t("title")}</h2>
        <p className="text-sm text-text-muted">{t("description")}</p>
        <Input
          id="confirm-delete"
          label={t("confirmLabel")}
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder={t("confirmPlaceholder")}
          disabled={loading}
        />
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {t("cancel")}
          </Button>
          <Button variant="danger" onClick={handleConfirm} disabled={!isValid} loading={loading}>
            {t("confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
}
