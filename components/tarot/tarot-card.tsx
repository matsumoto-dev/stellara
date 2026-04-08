"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { DrawnCard } from "@/lib/astrology/tarot-deck";

interface TarotCardProps {
  drawn: DrawnCard;
  revealed: boolean;
  index: number;
}

export function TarotCard({ drawn, revealed, index }: TarotCardProps) {
  const t = useTranslations("tarot");

  return (
    <motion.div
      initial={{ rotateY: 180, opacity: 0 }}
      animate={revealed ? { rotateY: 0, opacity: 1 } : { rotateY: 180, opacity: 0.7 }}
      transition={{ duration: 0.6, delay: index * 0.3 }}
      className="w-full max-w-[200px]"
    >
      <Card className={`text-center ${drawn.orientation === "reversed" ? "border-accent/30" : ""}`}>
        <Badge variant="muted" className="mb-2">
          {t(`positions.${drawn.position}`)}
        </Badge>
        <p className="text-3xl my-3">{drawn.card.arcana === "major" ? "\u2721" : "\u2605"}</p>
        <p className="font-heading text-lg font-semibold text-text">{drawn.card.name}</p>
        <p className="text-sm text-text-muted mt-1">{t(`orientation.${drawn.orientation}`)}</p>
      </Card>
    </motion.div>
  );
}
