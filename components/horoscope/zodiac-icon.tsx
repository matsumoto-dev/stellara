import type { SunSign } from "@/lib/db/types";

const ZODIAC_SYMBOLS: Record<SunSign, string> = {
  aries: "\u2648",
  taurus: "\u2649",
  gemini: "\u264A",
  cancer: "\u264B",
  leo: "\u264C",
  virgo: "\u264D",
  libra: "\u264E",
  scorpio: "\u264F",
  sagittarius: "\u2650",
  capricorn: "\u2651",
  aquarius: "\u2652",
  pisces: "\u2653",
};

const ZODIAC_LABELS: Record<SunSign, string> = {
  aries: "Aries",
  taurus: "Taurus",
  gemini: "Gemini",
  cancer: "Cancer",
  leo: "Leo",
  virgo: "Virgo",
  libra: "Libra",
  scorpio: "Scorpio",
  sagittarius: "Sagittarius",
  capricorn: "Capricorn",
  aquarius: "Aquarius",
  pisces: "Pisces",
};

interface ZodiacIconProps {
  sign: SunSign;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

export function ZodiacIcon({
  sign,
  size = "md",
  showLabel = false,
  className = "",
}: ZodiacIconProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`} title={ZODIAC_LABELS[sign]}>
      <span className={`${sizeStyles[size]} leading-none`}>{ZODIAC_SYMBOLS[sign]}</span>
      {showLabel && <span className="text-sm text-text-muted">{ZODIAC_LABELS[sign]}</span>}
    </span>
  );
}

export { ZODIAC_LABELS, ZODIAC_SYMBOLS };
