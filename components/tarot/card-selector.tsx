"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type SpreadType = 1 | 3;

interface CardSelectorProps {
  selected: SpreadType;
  onSelect: (spread: SpreadType) => void;
  disabled?: boolean;
}

export function CardSelector({ selected, onSelect, disabled = false }: CardSelectorProps) {
  const t = useTranslations("tarot");

  return (
    <div className="flex gap-3">
      <Button
        variant={selected === 1 ? "primary" : "secondary"}
        onClick={() => onSelect(1)}
        disabled={disabled}
        className="flex-1"
      >
        <span className="mr-2">{"\u2660"}</span>
        {t("singleCard")}
      </Button>
      <Button
        variant={selected === 3 ? "primary" : "secondary"}
        onClick={() => onSelect(3)}
        disabled={disabled}
        className="flex-1"
      >
        <span className="mr-2">{"\u2660\u2660\u2660"}</span>
        {t("pastPresentFuture")}
      </Button>
    </div>
  );
}
