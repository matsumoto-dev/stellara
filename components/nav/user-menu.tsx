"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ZodiacIcon } from "@/components/horoscope/zodiac-icon";
import type { SunSign } from "@/lib/db/types";

interface UserMenuProps {
  sunSign: SunSign;
  displayName?: string;
}

export function UserMenu({ sunSign, displayName }: UserMenuProps) {
  const router = useRouter();
  const t = useTranslations("auth");
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <ZodiacIcon sign={sunSign} size="sm" showLabel />
      {displayName && (
        <span className="text-sm text-text truncate max-w-[120px]">{displayName}</span>
      )}
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className="text-xs text-text-muted hover:text-text transition ml-auto"
      >
        {loading ? "..." : t("logout")}
      </button>
    </div>
  );
}
