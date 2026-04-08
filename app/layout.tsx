import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { getOrganizationJsonLd, getWebSiteJsonLd } from "@/lib/seo/json-ld";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
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
  const t = await getTranslations("common");

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
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
          <main>{children}</main>
          <footer className="text-center text-text-muted text-xs py-6 px-4 space-y-2">
            <p>{t("disclaimer")}</p>
            <p>
              <a href="/terms" className="text-accent hover:underline">
                {t("termsLink")}
              </a>
              {" · "}
              <a href="/privacy" className="text-accent hover:underline">
                {t("privacyLink")}
              </a>
            </p>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
