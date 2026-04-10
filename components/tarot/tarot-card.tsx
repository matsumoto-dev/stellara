"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { DrawnCard } from "@/lib/astrology/tarot-deck";

interface TarotCardProps {
  drawn: DrawnCard;
  revealed: boolean;
  index: number;
}

const MAJOR_ARCANA_NUMBERS: Record<string, string> = {
  "The Fool": "0",
  "The Magician": "I",
  "The High Priestess": "II",
  "The Empress": "III",
  "The Emperor": "IV",
  "The Hierophant": "V",
  "The Lovers": "VI",
  "The Chariot": "VII",
  Strength: "VIII",
  "The Hermit": "IX",
  "Wheel of Fortune": "X",
  Justice: "XI",
  "The Hanged Man": "XII",
  Death: "XIII",
  Temperance: "XIV",
  "The Devil": "XV",
  "The Tower": "XVI",
  "The Star": "XVII",
  "The Moon": "XVIII",
  "The Sun": "XIX",
  Judgement: "XX",
  "The World": "XXI",
};

const MAJOR_ARCANA_SYMBOLS: Record<string, string> = {
  "The Fool": "🃏",
  "The Magician": "🪄",
  "The High Priestess": "🌙",
  "The Empress": "👑",
  "The Emperor": "🏛️",
  "The Hierophant": "🔑",
  "The Lovers": "💕",
  "The Chariot": "⚡",
  Strength: "🦁",
  "The Hermit": "🏔️",
  "Wheel of Fortune": "☸️",
  Justice: "⚖️",
  "The Hanged Man": "🔮",
  Death: "🦋",
  Temperance: "🏺",
  "The Devil": "🔥",
  "The Tower": "⚡",
  "The Star": "⭐",
  "The Moon": "🌕",
  "The Sun": "☀️",
  Judgement: "📯",
  "The World": "🌍",
};

const SUIT_SYMBOLS: Record<string, string> = {
  wands: "🔥",
  cups: "🏆",
  swords: "⚔️",
  pentacles: "✦",
};

const SUIT_COLORS: Record<string, string> = {
  wands: "from-red-900/40 to-orange-900/20",
  cups: "from-blue-900/40 to-cyan-900/20",
  swords: "from-slate-700/40 to-gray-800/20",
  pentacles: "from-yellow-900/40 to-amber-900/20",
};

const JAPANESE_NAMES: Record<string, string> = {
  "The Fool": "愚者",
  "The Magician": "魔術師",
  "The High Priestess": "女教皇",
  "The Empress": "女帝",
  "The Emperor": "皇帝",
  "The Hierophant": "教皇",
  "The Lovers": "恋人",
  "The Chariot": "戦車",
  Strength: "力",
  "The Hermit": "隠者",
  "Wheel of Fortune": "運命の輪",
  Justice: "正義",
  "The Hanged Man": "吊るされた男",
  Death: "死神",
  Temperance: "節制",
  "The Devil": "悪魔",
  "The Tower": "塔",
  "The Star": "星",
  "The Moon": "月",
  "The Sun": "太陽",
  Judgement: "審判",
  "The World": "世界",
};

function getCardSymbol(drawn: DrawnCard): string {
  if (drawn.card.arcana === "major") {
    return MAJOR_ARCANA_SYMBOLS[drawn.card.name] ?? "✦";
  }
  return SUIT_SYMBOLS[drawn.card.suit ?? "wands"];
}

function getCardGradient(drawn: DrawnCard): string {
  if (drawn.card.arcana === "major") {
    return "from-purple-900/50 to-indigo-950/30";
  }
  return SUIT_COLORS[drawn.card.suit ?? "wands"];
}

export function TarotCard({ drawn, revealed, index }: TarotCardProps) {
  const t = useTranslations("tarot");
  const isMajor = drawn.card.arcana === "major";
  const romanNum = isMajor ? MAJOR_ARCANA_NUMBERS[drawn.card.name] : null;
  const jaName = isMajor ? JAPANESE_NAMES[drawn.card.name] : null;

  return (
    <motion.div
      initial={{ rotateY: 180, opacity: 0 }}
      animate={revealed ? { rotateY: 0, opacity: 1 } : { rotateY: 180, opacity: 0.7 }}
      transition={{ duration: 0.6, delay: index * 0.3 }}
      className="w-full max-w-[180px]"
      style={{ perspective: "800px" }}
    >
      <div
        className={`
          relative overflow-hidden rounded-xl
          border-2 border-accent/30
          bg-gradient-to-b ${getCardGradient(drawn)}
          shadow-[0_0_20px_rgba(212,175,55,0.12)]
          aspect-[2/3]
          flex flex-col items-center justify-between
          p-3
          ${drawn.orientation === "reversed" ? "rotate-180" : ""}
        `}
      >
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent/40 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-accent/40 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-accent/40 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent/40 rounded-br-lg" />

        {/* Inner border */}
        <div className="absolute inset-2 border border-accent/15 rounded-lg pointer-events-none" />

        {/* Roman numeral */}
        {romanNum && (
          <p className="font-heading text-xs text-accent/70 tracking-widest mt-1">
            {romanNum}
          </p>
        )}
        {!romanNum && <div className="h-4" />}

        {/* Card symbol */}
        <div className="flex-1 flex items-center justify-center">
          <span className="text-5xl drop-shadow-lg">{getCardSymbol(drawn)}</span>
        </div>

        {/* Card name */}
        <div className="text-center space-y-0.5 mb-1">
          <p className="font-heading text-sm font-semibold text-text leading-tight">
            {drawn.card.name}
          </p>
          {jaName && (
            <p className="text-xs text-accent/70">{jaName}</p>
          )}
        </div>
      </div>

      {/* Position & orientation below card */}
      <div className="text-center mt-2 space-y-0.5">
        <p className="text-xs font-medium text-accent/80">
          {t(`positions.${drawn.position}`)}
        </p>
        <p className="text-xs text-text-muted">
          {t(`orientation.${drawn.orientation}`)}
        </p>
      </div>
    </motion.div>
  );
}
