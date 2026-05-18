type CardVariant = "default" | "artifact" | "subtle";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Visual variant.
   * - default: standard card for UI groupings
   * - artifact: hero/ceremonial card for horoscope/tarot results — gold rim, breathing glow, corner flourishes
   * - subtle: low-emphasis card for utility/danger zones
   */
  variant?: CardVariant;
  /** Legacy: equivalent to variant="artifact" */
  glow?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default:
    "bg-night-veil/80 backdrop-blur-sm border border-ink-shadow/40 rounded-xl p-6 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.6)]",
  artifact:
    "relative bg-gradient-to-b from-night-veil/95 to-night-deep/95 backdrop-blur-sm rounded-xl p-7 corner-flourish gold-breath parchment-texture",
  subtle:
    "bg-night-deep/60 backdrop-blur-sm border border-ink-shadow/30 rounded-xl p-6",
};

export function Card({
  children,
  className = "",
  variant,
  glow = false,
}: CardProps) {
  const resolved: CardVariant = variant ?? (glow ? "artifact" : "default");
  return <div className={`${variantStyles[resolved]} ${className}`}>{children}</div>;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return <div className={`mb-5 ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return (
    <h3 className={`font-heading text-xl font-semibold text-text tracking-tight ${className}`}>
      {children}
    </h3>
  );
}
