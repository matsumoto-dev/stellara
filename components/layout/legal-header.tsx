import Link from "next/link";
import { useTranslations } from "next-intl";
import { StellaraMark } from "@/components/icons/stellara-mark";

/**
 * Header for legal pages (Terms / Privacy).
 * Provides navigation back to home and brand consistency.
 */
export function LegalHeader() {
  const t = useTranslations("legal");

  return (
    <header className="border-b border-gold-leaf/15 bg-night-deep/40 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label={t("backToHome")}
        >
          <StellaraMark
            size={26}
            className="text-gold-leaf drop-shadow-[0_0_10px_rgba(255,217,106,0.4)] group-hover:rotate-45 transition-transform duration-700"
          />
          <span className="font-heading text-xl font-semibold text-gold-pale tracking-wide">
            Stellara
          </span>
        </Link>
        <Link
          href="/"
          className="text-sm text-text-muted hover:text-gold-pale transition-colors tracking-wide"
        >
          ← {t("backToHome")}
        </Link>
      </div>
    </header>
  );
}
