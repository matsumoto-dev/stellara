"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

interface TurnCounterProps {
  current: number;
  limit: number;
}

export function TurnCounter({ current, limit }: TurnCounterProps) {
  const t = useTranslations("chat");
  const remaining = limit - current;
  const variant = remaining <= 1 ? "muted" : "accent";

  return <Badge variant={variant}>{t("turnCounter", { current, limit })}</Badge>;
}
