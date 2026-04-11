import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { StarOrnament, StellaraMark } from "@/components/icons/stellara-mark";
import { SiteFooter } from "@/components/layout/site-footer";
import { getFAQPageJsonLd, getSoftwareApplicationJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Stellara — あなた専属のAI占星術師",
  description: "毎日のホロスコープ、タロット、パーソナル鑑定を、あなたの星座に合わせてお届けします。",
};

const FEATURE_ICONS = ["☽", "✦", "♠", "✧"] as const;
const STEP_NUMBERS = ["I", "II", "III"] as const;

const FREE_FEATURE_INDICES = [0, 1, 2] as const;
const PRO_FEATURE_INDICES = [0, 1, 2, 3, 4] as const;

export default async function LandingPage() {
  const t = await getTranslations("landing");
  const softwareAppJsonLd = getSoftwareApplicationJsonLd();
  const faqJsonLd = getFAQPageJsonLd();

  const featureKeys = ["horoscope", "reading", "tarot", "chat"] as const;
  const stepKeys = ["one", "two", "three"] as const;

  const freeFeatures = FREE_FEATURE_INDICES.map((i) => t(`pricing.free.features.${i}`));
  const proFeatures = PRO_FEATURE_INDICES.map((i) => t(`pricing.pro.features.${i}`));

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires dangerouslySetInnerHTML
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires dangerouslySetInnerHTML
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── Nav ─────────────────────────────────────────────── */}
      <header className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 max-w-6xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
          <StellaraMark
            size={26}
            className="shrink-0 text-gold-leaf drop-shadow-[0_0_10px_rgba(255,217,106,0.4)] group-hover:rotate-45 transition-transform duration-700"
          />
          <span className="font-heading text-xl sm:text-2xl font-semibold text-gold-pale tracking-wide truncate">
            Stellara
          </span>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-6 shrink-0">
          <Link
            href="/login"
            className="text-xs sm:text-sm text-text-muted hover:text-gold-pale transition-colors tracking-wide whitespace-nowrap"
          >
            {t("hero.login")}
          </Link>
          <Link
            href="/signup"
            className="relative text-xs sm:text-sm text-night-void font-semibold tracking-wide px-3 sm:px-5 py-2 rounded-lg bg-gradient-to-b from-gold-glow via-gold-leaf to-gold-deep shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_16px_-2px_rgba(201,169,97,0.35),0_0_0_1px_rgba(201,169,97,0.6)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_24px_-2px_rgba(255,217,106,0.55),0_0_0_1px_rgba(255,217,106,0.8)] transition-all whitespace-nowrap"
          >
            {t("hero.cta")}
          </Link>
        </nav>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-12 sm:pt-16 md:pt-20 pb-20 sm:pb-24 md:pb-32 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-3 text-gold-leaf/80 text-[10px] md:text-xs font-medium tracking-[0.4em] uppercase mb-5 sm:mb-6 md:mb-8">
          <StarOrnament size={10} />
          <span>AI Astrology</span>
          <StarOrnament size={10} />
        </div>
        <h1
          className="font-heading text-[1.85rem] xs:text-[2.1rem] sm:text-5xl md:text-7xl font-semibold text-moonlight mb-5 sm:mb-6 md:mb-8 leading-[1.2] tracking-tight"
          style={{ wordBreak: "keep-all", overflowWrap: "break-word", maxWidth: "100%" }}
        >
          <span className="text-gold-gradient">{t("hero.headline")}</span>
        </h1>
        <p className="text-text-muted text-sm md:text-lg max-w-xl mb-10 md:mb-12 leading-[1.85] font-reading px-2">
          {t("hero.subheadline")}
        </p>
        <div className="flex flex-col sm:flex-row gap-5 items-center">
          <Link
            href="/signup"
            className="bg-gradient-to-b from-gold-glow via-gold-leaf to-gold-deep text-night-void font-semibold px-10 py-4 rounded-lg text-base tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_32px_-4px_rgba(201,169,97,0.5),0_0_0_1px_rgba(201,169,97,0.6)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_12px_40px_-4px_rgba(255,217,106,0.7),0_0_0_1px_rgba(255,217,106,0.9)] transition-all"
          >
            {t("hero.cta")}
          </Link>
          <Link
            href="/login"
            className="text-text-muted hover:text-gold-pale text-sm transition-colors tracking-wide"
          >
            {t("hero.login")} →
          </Link>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="px-6 py-24 max-w-5xl mx-auto w-full">
        <div className="text-center mb-16">
          <div className="divider-ornament max-w-xs mx-auto mb-6">
            <span className="font-heading text-[10px]">FEATURES</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-moonlight tracking-tight">
            {t("features.title")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featureKeys.map((key, i) => (
            <div
              key={key}
              className="group relative bg-night-veil/60 backdrop-blur-sm rounded-xl p-6 border border-gold-leaf/15 hover:border-gold-leaf/40 hover:bg-night-veil/80 hover:shadow-[0_0_32px_-8px_rgba(201,169,97,0.35)] transition-all duration-300"
            >
              <div className="text-gold-leaf text-3xl mb-4 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(255,217,106,0.6)] transition-all" aria-hidden="true">
                {FEATURE_ICONS[i]}
              </div>
              <h3 className="font-heading text-lg font-semibold text-gold-pale mb-2.5 tracking-tight">
                {t(`features.items.${key}.title`)}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                {t(`features.items.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section className="px-6 py-24 bg-night-deep/50 border-y border-gold-leaf/10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="divider-ornament max-w-xs mx-auto mb-6">
              <span className="font-heading text-[10px]">PROCESS</span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-moonlight tracking-tight">
              {t("howItWorks.title")}
            </h2>
          </div>
          <div className="flex flex-col md:flex-row gap-10">
            {stepKeys.map((key, i) => (
              <div key={key} className="flex flex-col items-center text-center flex-1">
                <div className="w-14 h-14 rounded-full border border-gold-leaf/50 bg-night-veil/40 backdrop-blur-sm flex items-center justify-center font-heading text-gold-leaf text-lg mb-5 shadow-[0_0_24px_-8px_rgba(201,169,97,0.4)]">
                  {STEP_NUMBERS[i]}
                </div>
                <h3 className="font-heading text-lg font-semibold text-gold-pale mb-3 tracking-tight">
                  {t(`howItWorks.steps.${key}.title`)}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed max-w-[16rem]">
                  {t(`howItWorks.steps.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section className="px-6 py-24 max-w-4xl mx-auto w-full">
        <div className="text-center mb-16">
          <div className="divider-ornament max-w-xs mx-auto mb-6">
            <span className="font-heading text-[10px]">PRICING</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-moonlight tracking-tight mb-3">
            {t("pricing.title")}
          </h2>
          <p className="text-text-muted text-sm">{t("pricing.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Free Plan */}
          <div className="relative bg-night-veil/60 backdrop-blur-sm rounded-xl p-8 border border-gold-leaf/15 flex flex-col">
            <div className="text-gold-pale text-xs font-medium tracking-[0.3em] uppercase mb-2">
              {t("pricing.free.name")}
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-heading text-5xl font-semibold text-moonlight">
                {t("pricing.free.price")}
              </span>
            </div>
            <div className="text-text-muted text-sm mb-8">{t("pricing.free.period")}</div>
            <ul className="space-y-3.5 mb-10">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-text/90">
                  <span className="text-gold-leaf mt-0.5" aria-hidden="true">✦</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="mt-auto block text-center border border-gold-leaf/35 text-gold-pale py-3 rounded-lg text-sm tracking-wide hover:border-gold-leaf/60 hover:bg-gold-leaf/5 transition-colors"
            >
              {t("pricing.free.cta")}
            </Link>
          </div>

          {/* Pro Plan — illuminated */}
          <div className="relative bg-gradient-to-b from-night-mist/80 to-night-deep/80 backdrop-blur-sm rounded-xl p-8 border border-gold-leaf/40 shadow-[inset_0_0_0_1px_rgba(201,169,97,0.2),0_0_48px_-12px_rgba(201,169,97,0.35),0_12px_40px_-16px_rgba(0,0,0,0.7)] flex flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-b from-gold-glow to-gold-leaf text-night-void text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-1 rounded-full shadow-[0_4px_16px_-4px_rgba(201,169,97,0.5)]">
                {t("pricing.pro.badge")}
              </span>
            </div>
            <div className="text-gold-leaf text-xs font-medium tracking-[0.3em] uppercase mb-2">
              {t("pricing.pro.name")}
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-heading text-5xl font-semibold text-gold-gradient">
                {t("pricing.pro.price")}
              </span>
            </div>
            <div className="text-text-muted text-sm mb-8">{t("pricing.pro.period")}</div>
            <ul className="space-y-3.5 mb-10">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-text/90">
                  <span className="text-gold-leaf mt-0.5" aria-hidden="true">✦</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="mt-auto block text-center bg-gradient-to-b from-gold-glow via-gold-leaf to-gold-deep text-night-void font-semibold py-3 rounded-lg text-sm tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_16px_-2px_rgba(201,169,97,0.5)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_24px_-2px_rgba(255,217,106,0.7)] transition-all"
            >
              {t("pricing.pro.cta")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="px-6 py-28 text-center bg-night-deep/40 border-t border-gold-leaf/10">
        <div className="flex justify-center mb-6 text-gold-leaf/50">
          <StellaraMark size={36} />
        </div>
        <h2 className="font-heading text-4xl md:text-5xl font-semibold text-moonlight mb-5 tracking-tight">
          {t("finalCta.title")}
        </h2>
        <p className="text-text-muted text-base mb-10 max-w-md mx-auto leading-relaxed">
          {t("finalCta.subtitle")}
        </p>
        <Link
          href="/signup"
          className="inline-block bg-gradient-to-b from-gold-glow via-gold-leaf to-gold-deep text-night-void font-semibold px-10 py-4 rounded-lg text-base tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_32px_-4px_rgba(201,169,97,0.5)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_12px_40px_-4px_rgba(255,217,106,0.7)] transition-all"
        >
          {t("finalCta.cta")}
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
