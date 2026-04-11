import Link from "next/link";
import { useTranslations } from "next-intl";
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
    <Card>
      <div className="flex flex-col items-center text-center py-8 px-4 space-y-4">
        <div className="text-4xl">✦</div>
        <h2 className="font-heading text-xl font-semibold text-text">
          {title ?? t("title", { feature: t(`features.${feature}`) })}
        </h2>
        <p className="text-sm text-text-muted max-w-md leading-relaxed">
          {description ?? t("description")}
        </p>
        <Link
          href="/settings"
          className="inline-block bg-accent text-bg font-semibold px-6 py-3 rounded-lg hover:bg-accent-light transition-colors"
        >
          {t("cta")}
        </Link>
      </div>
    </Card>
  );
}
