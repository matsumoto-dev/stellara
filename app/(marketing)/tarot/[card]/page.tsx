import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllTarotSlugs,
  parseTarotSlug,
  getTarotPageMeta,
  generateTarotPageContent,
  type TarotCard,
} from "@/lib/seo/tarot";
import { buildArticleOGFields } from "@/lib/seo/article-meta";
import { ShareButtons } from "@/components/share/share-buttons";

interface Props {
  params: Promise<{ card: string }>;
}

export async function generateStaticParams() {
  return getAllTarotSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { card: slug } = await params;
  const card = parseTarotSlug(slug);
  if (!card) return {};
  const meta = getTarotPageMeta(card);

  const articleOG = buildArticleOGFields("Tarot", [
    card.name,
    ...card.keywords.slice(0, 3),
    "tarot",
    "astrology",
  ]);

  return {
    title: meta.title,
    description: meta.metaDescription,
    openGraph: {
      ...articleOG,
      title: meta.title,
      description: meta.metaDescription,
      url: `https://stellara.chat/tarot/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.metaDescription,
    },
    alternates: {
      canonical: `https://stellara.chat/tarot/${slug}`,
    },
  };
}

function ArcanaLabel({ card }: { card: TarotCard }) {
  if (card.arcana === "major") {
    return (
      <span className="text-xs bg-surface-muted text-accent px-2 py-1 rounded-full font-medium">
        Major Arcana · {card.planet ?? card.zodiac ?? card.element ?? ""}
      </span>
    );
  }
  const suitName = card.suit ? card.suit.charAt(0).toUpperCase() + card.suit.slice(1) : "";
  return (
    <span className="text-xs bg-surface-muted text-text-muted px-2 py-1 rounded-full font-medium">
      Minor Arcana · {suitName} · {card.element}
    </span>
  );
}

export default async function TarotCardPage({ params }: Props) {
  const { card: slug } = await params;
  const card = parseTarotSlug(slug);
  if (!card) notFound();

  const { meta, faqs } = generateTarotPageContent(card);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.metaDescription,
    url: `https://stellara.chat/tarot/${slug}`,
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
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const numberDisplay =
    card.arcana === "major"
      ? `Card ${card.number === 0 ? "0 (The Fool)" : card.number}`
      : null;

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
            {card.symbol}
          </div>
          <h1 className="font-heading text-4xl md:text-5xl text-text-primary">
            {card.name}
            <br />
            <span className="text-accent">Tarot Card</span>
          </h1>
          <div className="flex flex-wrap justify-center gap-2">
            <ArcanaLabel card={card} />
            {numberDisplay && (
              <span className="text-xs bg-surface-muted text-text-muted px-2 py-1 rounded-full font-medium">
                {numberDisplay}
              </span>
            )}
          </div>
          {/* Keywords */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {card.keywords.map((kw) => (
              <span
                key={kw}
                className="text-xs text-text-muted bg-surface-elevated px-2 py-1 rounded-full"
              >
                {kw}
              </span>
            ))}
          </div>
        </header>

        {/* Overview */}
        <section className="bg-surface-elevated rounded-2xl p-6 space-y-3">
          <h2 className="font-heading text-xl text-text-primary">About This Card</h2>
          <p className="text-text-secondary leading-relaxed">{card.description}</p>
        </section>

        {/* Upright & Reversed */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-surface-elevated rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-accent text-lg" aria-hidden="true">↑</span>
              <h2 className="font-heading text-xl text-text-primary">Upright Meaning</h2>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">{card.uprightMeaning}</p>
          </div>
          <div className="bg-surface-elevated rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-text-muted text-lg" aria-hidden="true">↓</span>
              <h2 className="font-heading text-xl text-text-primary">Reversed Meaning</h2>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">{card.reversedMeaning}</p>
          </div>
        </section>

        {/* Readings by area */}
        <section className="space-y-6">
          <h2 className="font-heading text-2xl text-text-primary">Readings by Area of Life</h2>
          {[
            { icon: "💕", heading: "Love & Relationships", body: card.loveReading },
            { icon: "💼", heading: "Career & Finances", body: card.careerReading },
            { icon: "✨", heading: "Spirituality & Growth", body: card.spiritualReading },
          ].map(({ icon, heading, body }) => (
            <div key={heading} className="border-l-2 border-accent pl-5 space-y-2">
              <h3 className="font-semibold text-text-primary">
                <span aria-hidden="true">{icon}</span> {heading}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </section>

        {/* Correspondences (Major Arcana only) */}
        {card.arcana === "major" && (card.planet ?? card.zodiac ?? card.element) && (
          <section className="bg-surface-elevated rounded-2xl p-6 space-y-4">
            <h2 className="font-heading text-xl text-text-primary">Astrological Correspondences</h2>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {card.planet && (
                <div>
                  <dt className="text-text-muted text-xs uppercase tracking-wider">Planet</dt>
                  <dd className="text-text-primary font-medium mt-1">{card.planet}</dd>
                </div>
              )}
              {card.zodiac && (
                <div>
                  <dt className="text-text-muted text-xs uppercase tracking-wider">Zodiac Sign</dt>
                  <dd className="text-text-primary font-medium mt-1">{card.zodiac}</dd>
                </div>
              )}
              {card.element && (
                <div>
                  <dt className="text-text-muted text-xs uppercase tracking-wider">Element</dt>
                  <dd className="text-text-primary font-medium mt-1">{card.element}</dd>
                </div>
              )}
            </dl>
          </section>
        )}

        {/* Internal links */}
        <section className="space-y-3">
          <h2 className="font-heading text-xl text-text-primary">Explore More</h2>
          <div className="flex flex-wrap gap-2">
            {card.arcana === "minor" && card.suit && (
              <a
                href={`/tarot/ace-of-${card.suit}`}
                className="text-sm text-accent hover:underline bg-surface-elevated px-3 py-1.5 rounded-full"
              >
                All {card.suit.charAt(0).toUpperCase() + card.suit.slice(1)} Cards
              </a>
            )}
            <a
              href="/tarot/the-fool"
              className="text-sm text-accent hover:underline bg-surface-elevated px-3 py-1.5 rounded-full"
            >
              Major Arcana
            </a>
            <a
              href="/compatibility/aries-and-taurus"
              className="text-sm text-accent hover:underline bg-surface-elevated px-3 py-1.5 rounded-full"
            >
              Compatibility Readings
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl text-text-primary">
            {card.name}: Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-surface-elevated rounded-xl p-5 space-y-2">
                <dt className="font-semibold text-text-primary">{faq.q}</dt>
                <dd className="text-text-secondary text-sm leading-relaxed">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Share */}
        <section className="space-y-3">
          <h2 className="font-heading text-xl text-text-primary">Share This Card</h2>
          <ShareButtons
            type="tarot"
            text={`${card.name} Tarot — ${card.keywords.slice(0, 3).join(", ")}`.slice(0, 200)}
            pageUrl={`https://stellara.chat/tarot/${slug}`}
          />
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-accent/10 to-surface-elevated rounded-2xl p-8 text-center space-y-4">
          <h2 className="font-heading text-2xl text-text-primary">
            Get Your Personal Tarot Reading
          </h2>
          <p className="text-text-secondary">
            Understanding a single card is just the beginning. Stellara's AI creates full,
            personalized tarot spreads tailored to your unique birth chart and current life
            situation — available 24/7.
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
