type BadgeVariant = "default" | "accent" | "muted" | "gold-rim";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-night-mist/60 text-text border border-ink-shadow/40",
  accent: "bg-gold-leaf/15 text-gold-pale border border-gold-leaf/35",
  muted: "bg-night-deep/60 text-text-muted border border-ink-shadow/30",
  "gold-rim": "bg-transparent text-gold-pale border border-gold-leaf/50",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-[11px] font-medium tracking-wider uppercase rounded-full backdrop-blur-sm ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
