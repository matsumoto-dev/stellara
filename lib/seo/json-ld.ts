export interface JsonLdWebSite {
  readonly "@context": "https://schema.org";
  readonly "@type": "WebSite";
  readonly name: string;
  readonly url: string;
  readonly description: string;
}

export interface JsonLdOrganization {
  readonly "@context": "https://schema.org";
  readonly "@type": "Organization";
  readonly name: string;
  readonly url: string;
  readonly logo?: string;
  readonly contactPoint?: {
    readonly "@type": "ContactPoint";
    readonly email: string;
    readonly contactType: string;
  };
}

export interface JsonLdSoftwareApplication {
  readonly "@context": "https://schema.org";
  readonly "@type": "SoftwareApplication";
  readonly name: string;
  readonly url: string;
  readonly description: string;
  readonly applicationCategory: string;
  readonly operatingSystem: string;
  readonly offers: {
    readonly "@type": "Offer";
    readonly price: string;
    readonly priceCurrency: string;
  };
}

export interface JsonLdFAQPage {
  readonly "@context": "https://schema.org";
  readonly "@type": "FAQPage";
  readonly mainEntity: ReadonlyArray<{
    readonly "@type": "Question";
    readonly name: string;
    readonly acceptedAnswer: {
      readonly "@type": "Answer";
      readonly text: string;
    };
  }>;
}

export function getWebSiteJsonLd(): JsonLdWebSite {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Stellara",
    url: "https://stellara.chat",
    description:
      "Your personal AI astrologer. Get daily horoscopes, tarot readings, and personalized star guidance.",
  };
}

export function getOrganizationJsonLd(): JsonLdOrganization {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Stellara",
    url: "https://stellara.chat",
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@stellara.chat",
      contactType: "customer support",
    },
  };
}

export function getSoftwareApplicationJsonLd(): JsonLdSoftwareApplication {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Stellara",
    url: "https://stellara.chat",
    description:
      "AI-powered astrology app offering daily horoscopes, personalized star readings, tarot, and cosmic chat guidance.",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function getFAQPageJsonLd(): JsonLdFAQPage {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Stellara?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Stellara is an AI-powered astrology app that provides daily horoscopes, personalized star readings, tarot sessions, and cosmic chat guidance based on your birth chart.",
        },
      },
      {
        "@type": "Question",
        name: "How does Stellara work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Create a free account with your birth date. Stellara uses your astrological profile and current planetary alignments to generate personalized daily horoscopes, readings, and tarot interpretations powered by AI.",
        },
      },
      {
        "@type": "Question",
        name: "Is Stellara free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Stellara offers a free plan that includes a daily horoscope, one personal reading per day, and one tarot draw per day. The Pro plan ($9.99/month) unlocks unlimited readings, tarot sessions, and reading history.",
        },
      },
      {
        "@type": "Question",
        name: "How much does Stellara Pro cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Stellara Pro costs $9.99 per month and includes unlimited personal readings, unlimited tarot sessions, 20 chat turns per month, reading history, and priority insights.",
        },
      },
      {
        "@type": "Question",
        name: "Is Stellara for entertainment purposes only?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Stellara is for entertainment purposes only and does not claim psychic or supernatural abilities. It is not a substitute for professional advice.",
        },
      },
    ],
  };
}
