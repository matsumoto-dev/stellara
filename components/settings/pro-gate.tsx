import Link from "next/link";
import { useTranslations } from "next-intl";
import { StarOrnament, StellaraMark } from "@/components/icons/stellara-mark";
import { Card } from "@/components/ui/card";

interface ProGateProps {
  /** i18n key for the feature name (e.g. "chat") */
  feature: string;
  /** Override title. Defaults to translated `proGate.title` */
  title?: string;
  /** Override description. Defaults to translated `proGate.description` */
  description?: string;
}

export function ProGate({ feature, title, description }: ProGateProps) {
  const t = useTranslations("proGate");

  return (
    <Card variant="artifact">
      <div className="flex flex-col items-center text-center py-10 px-4 space-y-5">
        <StellaraMark
          size={44}
          className="text-gold-leaf drop-shadow-[0_0_16px_rgba(255,217,106,0.5)]"
        />
        <div className="divider-ornament max-w-[12rem]" aria-hidden="true">
          <StarOrnament size={6} />
        </div>
        <h2 className="font-heading text-2xl font-semibold text-gold-pale tracking-tight">
          {title ?? t("title", { feature: t(`features.${feature}`) })}
        </h2>
        <p className="text-sm text-text-muted max-w-md leading-[1.85] font-reading">
          {description ?? t("description")}
        </p>
        <Link
          href="/settings"
          className="inline-block bg-gradient-to-b from-gold-glow via-gold-leaf to-gold-deep text-night-void font-semibold px-7 py-3 rounded-lg tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_16px_-2px_rgba(201,169,97,0.4)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_24px_-2px_rgba(255,217,106,0.6)] transition-all"
        >
          {t("cta")}
        </Link>
      </div>
    </Card>
  );
}
