import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllCompatibilitySlugs,
  parseCompatibilitySlug,
  getCompatibilityData,
  generateCompatibilityContent,
} from "@/lib/seo/compatibility";
import { buildArticleOGFields } from "@/lib/seo/article-meta";
import { ShareButtons } from "@/components/share/share-buttons";

interface Props {
  params: Promise<{ pair: string }>;
}

export async function generateStaticParams() {
  return getAllCompatibilitySlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parseCompatibilitySlug(pair);
  if (!parsed) return {};
  const { title, metaDescription, sign1, sign2, score } = getCompatibilityData(parsed[0], parsed[1]);
  const stars = "★".repeat(score) + "☆".repeat(5 - score);

  const articleOG = buildArticleOGFields("Astrology", [
    sign1.displayName,
    sign2.displayName,
    "compatibility",
    "astrology",
    "zodiac",
    sign1.element,
    sign2.element,
  ]);

  return {
    title,
    description: metaDescription,
    openGraph: {
      ...articleOG,
      title,
      description: metaDescription,
      url: `https://stellara.chat/compatibility/${pair}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: metaDescription,
    },
    alternates: {
      canonical: `https://stellara.chat/compatibility/${pair}`,
    },
    other: {
      "compatibility:score": String(score),
      "compatibility:stars": stars,
      "compatibility:sign1": sign1.displayName,
      "compatibility:sign2": sign2.displayName,
    },
  };
}

export default async function CompatibilityPage({ params }: Props) {
  const { pair } = await params;
  const parsed = parseCompatibilitySlug(pair);
  if (!parsed) notFound();

  const data = getCompatibilityData(parsed[0], parsed[1]);
  const content = generateCompatibilityContent(data.sign1, data.sign2, data.score);
  const { sign1: s1, sign2: s2, score } = data;

  const filledStars = score;
  const emptyStars = 5 - score;

  const scoreLabel =
    score === 5
      ? "Exceptional"
      : score === 4
        ? "High"
        : score === 3
          ? "Moderate"
          : "Challenging";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.metaDescription,
    url: `https://stellara.chat/compatibility/${pair}`,
    publisher: {
      "@type": "Organization",
      name: "Stellara",
      url: "https://stellara.chat",
    },
    datePublished: "2026-04-03",
    dateModified: "2026-04-03",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires dangerouslySetInnerHTML
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires dangerouslySetInnerHTML
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="max-w-3xl mx-auto px-4 py-12 space-y-12">
        {/* Hero */}
        <header className="text-center space-y-4">
          <div className="text-6xl" aria-hidden="true">
            {s1.symbol} {s2.symbol}
          </div>
          <h1 className="font-heading text-4xl md:text-5xl text-text-primary">
            {s1.displayName} & {s2.displayName}
            <br />
            <span className="text-accent">Compatibility</span>
          </h1>
          <p className="text-text-muted text-sm">
            {s1.dates} · {s2.dates}
          </p>
          {/* Score */}
          <div className="inline-flex items-center gap-3 bg-surface-elevated rounded-2xl px-6 py-4">
            <span className="text-2xl text-star" aria-label={`${score} out of 5 stars`}>
              {"★".repeat(filledStars)}
              <span className="opacity-30">{"★".repeat(emptyStars)}</span>
            </span>
            <div className="text-left">
              <p className="text-accent font-semibold">{scoreLabel} Compatibility</p>
              <p className="text-text-muted text-xs">{score}/5 stars</p>
            </div>
          </div>
        </header>

        {/* Intro */}
        <section className="prose prose-invert max-w-none">
          <p className="text-text-secondary text-lg leading-relaxed">{content.intro}</p>
        </section>

        {/* Sign profiles */}
        <section className="grid md:grid-cols-2 gap-6">
          {[s1, s2].map((s) => (
            <div key={s.name} className="bg-surface-elevated rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl" aria-hidden="true">
                  {s.symbol}
                </span>
                <div>
                  <h2 className="font-heading text-xl text-text-primary">The {s.displayName}</h2>
                  <p className="text-text-muted text-xs">
                    {s.element} · {s.quality} · ruled by {s.rulingPlanet}
                  </p>
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{s.description}</p>
              <div className="flex flex-wrap gap-2">
                {s.traits.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-surface-muted text-text-muted px-2 py-1 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Element dynamic */}
        <section className="space-y-3">
          <h2 className="font-heading text-2xl text-text-primary">
            {s1.element.charAt(0).toUpperCase() + s1.element.slice(1)} meets{" "}
            {s2.element.charAt(0).toUpperCase() + s2.element.slice(1)}
          </h2>
          <p className="text-text-secondary leading-relaxed">{content.elementDynamic}</p>
        </section>

        {/* Detailed sections */}
        {[
          { heading: "Emotional Compatibility", body: content.emotionalSection },
          { heading: "Communication & Intellect", body: content.communicationSection },
          { heading: "Love & Romance", body: content.loveSection },
          { heading: "Strengths of This Pairing", body: content.strengthsSection },
          { heading: "Challenges to Watch For", body: content.challengesSection },
          { heading: "Making It Work", body: content.tipsSection },
        ].map(({ heading, body }) => (
          <section key={heading} className="space-y-3">
            <h2 className="font-heading text-2xl text-text-primary">{heading}</h2>
            <p className="text-text-secondary leading-relaxed">{body}</p>
          </section>
        ))}

        {/* Love styles */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl text-text-primary">How Each Sign Loves</h2>
          <div className="space-y-4">
            {[s1, s2].map((s) => (
              <div key={s.name} className="border-l-2 border-accent pl-4">
                <h3 className="font-semibold text-text-primary mb-1">{s.displayName}'s Love Style</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{s.loveStyle}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <section className="space-y-3">
          <h2 className="font-heading text-xl text-text-primary">Explore More Pairings</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { label: `All ${s1.displayName} Compatibility`, href: `/compatibility/${s1.name}-and-aries` },
              { label: `All ${s2.displayName} Compatibility`, href: `/compatibility/aries-and-${s2.name}` },
              { label: `${s2.displayName} & ${s1.displayName}`, href: `/compatibility/${s2.name}-and-${s1.name}` },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="text-sm text-accent hover:underline bg-surface-elevated px-3 py-1.5 rounded-full"
              >
                {label}
              </a>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl text-text-primary">
            {s1.displayName} & {s2.displayName}: Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {content.faqs.map((faq) => (
              <div key={faq.q} className="bg-surface-elevated rounded-xl p-5 space-y-2">
                <dt className="font-semibold text-text-primary">{faq.q}</dt>
                <dd className="text-text-secondary text-sm leading-relaxed">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Share */}
        <section className="space-y-3">
          <h2 className="font-heading text-xl text-text-primary">Share This Compatibility</h2>
          <ShareButtons
            type="reading"
            text={`${s1.displayName} & ${s2.displayName} Compatibility — ${scoreLabel} (${score}/5)`.slice(0, 200)}
            sign={s1.name}
            pageUrl={`https://stellara.chat/compatibility/${pair}`}
          />
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-accent/10 to-surface-elevated rounded-2xl p-8 text-center space-y-4">
          <h2 className="font-heading text-2xl text-text-primary">
            Discover Your Personal Reading
          </h2>
          <p className="text-text-secondary">
            Compatibility is just the beginning. Stellara's AI astrologer offers personalized birth
            chart readings, daily horoscopes, and cosmic chat — tailored to exactly who you are.
          </p>
          <a
            href="/signup"
            className="inline-block bg-accent text-bg-primary font-semibold px-8 py-3 rounded-full hover:bg-accent-hover transition-colors"
          >
            Start Your Free Reading
          </a>
          <p className="text-text-muted text-xs">
            For entertainment purposes only. Not a substitute for professional advice.
          </p>
        </section>
      </main>
    </>
  );
}
