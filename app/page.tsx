import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getFAQPageJsonLd, getSoftwareApplicationJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Stellara — あなた専属のAI占星術師",
  description:
    "毎日のホロスコープ、タロット、パーソナル鑑定を、あなたの星座に合わせてお届けします。",
};

const FEATURE_ICONS = ["✦", "✨", "♠", "☁"] as const;
const STEP_NUMBERS = ["1", "2", "3"] as const;

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
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
        <span className="font-heading text-2xl font-bold text-accent">Stellara</span>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-text-muted hover:text-text transition-colors">
            {t("hero.login")}
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-accent text-bg font-semibold px-4 py-2 rounded-lg hover:bg-accent-light transition-colors"
          >
            {t("hero.cta")}
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 max-w-3xl mx-auto">
        <div className="text-accent text-sm font-medium tracking-widest uppercase mb-6">
          ✦ AI ASTROLOGY
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-text mb-6 leading-tight">
          {t("hero.headline")}
        </h1>
        <p className="text-text-muted text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
          {t("hero.subheadline")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/signup"
            className="bg-accent text-bg font-semibold px-8 py-4 rounded-lg text-base hover:bg-accent-light transition-colors"
          >
            {t("hero.cta")}
          </Link>
          <Link href="/login" className="text-text-muted hover:text-text text-sm transition-colors">
            {t("hero.login")} →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center text-text mb-12">{t("features.title")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureKeys.map((key, i) => (
            <div
              key={key}
              className="bg-bg-card border border-text-muted/10 rounded-xl p-6 hover:border-accent/30 transition-colors"
            >
              <div className="text-accent text-2xl mb-4">{FEATURE_ICONS[i]}</div>
              <h3 className="font-heading text-lg font-bold text-text mb-2">
                {t(`features.items.${key}.title`)}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                {t(`features.items.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 bg-bg-card/40">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-text mb-12">
            {t("howItWorks.title")}
          </h2>
          <div className="flex flex-col md:flex-row gap-8">
            {stepKeys.map((key, i) => (
              <div key={key} className="flex flex-col items-center text-center flex-1">
                <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-bold text-sm mb-4">
                  {STEP_NUMBERS[i]}
                </div>
                <h3 className="font-heading text-base font-bold text-text mb-2">
                  {t(`howItWorks.steps.${key}.title`)}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {t(`howItWorks.steps.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20 max-w-4xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center text-text mb-2">{t("pricing.title")}</h2>
        <p className="text-center text-text-muted mb-12">{t("pricing.subtitle")}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Free Plan */}
          <div className="bg-bg-card border border-text-muted/10 rounded-xl p-8 flex flex-col">
            <div className="text-text-muted text-sm font-medium mb-1">{t("pricing.free.name")}</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-text">{t("pricing.free.price")}</span>
            </div>
            <div className="text-text-muted text-sm mb-6">{t("pricing.free.period")}</div>
            <ul className="space-y-3 mb-8">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-text">
                  <span className="text-accent">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="mt-auto block text-center border border-text-muted/30 text-text py-3 rounded-lg text-sm hover:border-accent/50 transition-colors"
            >
              {t("pricing.free.cta")}
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-primary border border-accent/30 rounded-xl p-8 relative flex flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-accent text-bg text-xs font-bold px-3 py-1 rounded-full">
                {t("pricing.pro.badge")}
              </span>
            </div>
            <div className="text-accent text-sm font-medium mb-1">{t("pricing.pro.name")}</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-text">{t("pricing.pro.price")}</span>
            </div>
            <div className="text-text-muted text-sm mb-6">{t("pricing.pro.period")}</div>
            <ul className="space-y-3 mb-8">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-text">
                  <span className="text-accent">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="mt-auto block text-center bg-accent text-bg font-semibold py-3 rounded-lg text-sm hover:bg-accent-light transition-colors"
            >
              {t("pricing.pro.cta")}
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-24 text-center bg-bg-card/40">
        <h2 className="text-4xl font-bold text-text mb-4">{t("finalCta.title")}</h2>
        <p className="text-text-muted text-lg mb-10 max-w-md mx-auto">{t("finalCta.subtitle")}</p>
        <Link
          href="/signup"
          className="inline-block bg-accent text-bg font-semibold px-10 py-4 rounded-lg text-base hover:bg-accent-light transition-colors"
        >
          {t("finalCta.cta")}
        </Link>
      </section>
    </div>
  );
}
