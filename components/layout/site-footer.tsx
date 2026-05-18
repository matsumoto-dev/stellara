import { getTranslations } from "next-intl/server";

interface SiteFooterProps {
  /** When true, footer width is constrained to the main content column (no full-bleed). */
  constrained?: boolean;
}

/**
 * Global footer with disclaimer + legal links.
 * Used by both marketing pages and the (app) main column.
 */
export async function SiteFooter({ constrained = false }: SiteFooterProps) {
  const t = await getTranslations("common");

  return (
    <footer
      className={`border-t border-gold-leaf/15 bg-night-deep/40 backdrop-blur-sm ${
        constrained ? "" : "mt-16"
      }`}
    >
      <div className="text-center text-text-muted/80 text-xs py-8 px-4 space-y-3 max-w-3xl mx-auto">
        <p className="leading-relaxed">{t("disclaimer")}</p>
        <p className="text-text-muted/60">
          <a
            href="/terms"
            className="text-gold-pale/80 hover:text-gold-pale transition-colors"
          >
            {t("termsLink")}
          </a>
          <span className="mx-2 text-gold-leaf/30" aria-hidden="true">
            ✦
          </span>
          <a
            href="/privacy"
            className="text-gold-pale/80 hover:text-gold-pale transition-colors"
          >
            {t("privacyLink")}
          </a>
        </p>
      </div>
    </footer>
  );
}
