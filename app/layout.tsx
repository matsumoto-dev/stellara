import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  EB_Garamond,
  Manrope,
  Noto_Serif_JP,
  Shippori_Mincho,
} from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { getOrganizationJsonLd, getWebSiteJsonLd } from "@/lib/seo/json-ld";
import "./globals.css";

// Display serif (Latin)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading-latin",
  display: "swap",
});

// Reading serif (Latin)
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-reading-latin",
  display: "swap",
});

// UI sans (Latin)
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body-latin",
  display: "swap",
});

// Display serif (CJK)
const shippori = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-heading-jp",
  display: "swap",
});

// Reading serif (CJK)
const notoSerifJp = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-reading-jp",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stellara.chat"),
  title: {
    default: "Stellara — AI Astrology",
    template: "%s | Stellara",
  },
  description:
    "Your personal AI astrologer. Get daily horoscopes, tarot readings, and personalized star guidance powered by AI.",
  keywords: [
    "astrology",
    "horoscope",
    "tarot",
    "AI astrologer",
    "zodiac",
    "star reading",
    "personalized horoscope",
    "daily horoscope",
    "tarot reading",
  ],
  authors: [{ name: "Stellara" }],
  creator: "Stellara",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Stellara",
    title: "Stellara — Your Personal AI Astrologer",
    description:
      "Get daily horoscopes, tarot readings, and personalized star guidance powered by AI.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stellara — Your Personal AI Astrologer",
    description:
      "Get daily horoscopes, tarot readings, and personalized star guidance powered by AI.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${ebGaramond.variable} ${manrope.variable} ${shippori.variable} ${notoSerifJp.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires dangerouslySetInnerHTML
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getWebSiteJsonLd()) }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires dangerouslySetInnerHTML
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationJsonLd()) }}
        />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
