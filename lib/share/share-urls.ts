/**
 * Pure utility functions for building share URLs.
 * Separated from the component to enable unit testing without DOM dependencies.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type ShareReadingType = "horoscope" | "reading" | "tarot" | "weekly";

export interface ShareUrlsInput {
  type: ShareReadingType;
  text: string;
  sign?: string;
  baseUrl: string;
}

export interface ShareUrls {
  imageUrl: string;
  pinterestUrl: string;
  xUrl: string;
  facebookUrl: string;
  whatsAppUrl: string;
}

// ─── Functions ────────────────────────────────────────────────────────────────

/**
 * Builds an absolute URL for the OG reading image.
 * Uses Pinterest dimensions (1000×1500) by default.
 */
export function buildImageUrl(
  baseUrl: string,
  type: ShareReadingType,
  text: string,
  sign?: string,
): string {
  const params = new URLSearchParams({ format: "pinterest", highlight: text });
  if (sign) params.set("sign", sign);
  return `${baseUrl}/api/og/reading/${type}?${params.toString()}`;
}

/**
 * Builds a Pinterest Pin It URL.
 * @param imageUrl - Absolute URL of the image to pin
 * @param pageUrl  - Absolute URL of the page being pinned
 * @param text     - Description for the pin
 */
export function buildPinterestUrl(
  imageUrl: string,
  pageUrl: string,
  text: string,
): string {
  const params = new URLSearchParams({
    url: pageUrl,
    media: imageUrl,
    description: text,
  });
  return `https://pinterest.com/pin/create/button/?${params.toString()}`;
}

/**
 * Builds an X (Twitter) Web Intent URL.
 * @param text    - Reading text to include in the tweet
 * @param pageUrl - Absolute URL to include in the tweet
 */
export function buildXUrl(text: string, pageUrl: string): string {
  const tweetText = `${text}\n\n${pageUrl}`;
  const params = new URLSearchParams({ text: tweetText });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/**
 * Builds a Facebook sharer URL.
 * @param pageUrl - Absolute URL of the page to share
 */
export function buildFacebookUrl(pageUrl: string): string {
  const params = new URLSearchParams({ u: pageUrl });
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

/**
 * Builds a WhatsApp share URL (URL scheme, works on mobile and web).
 * @param text    - Reading text to include in the message
 * @param pageUrl - Absolute URL to append to the message
 */
export function buildWhatsAppUrl(text: string, pageUrl: string): string {
  const message = `${text}\n\n${pageUrl}`;
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/?${params.toString()}`;
}

/**
 * Builds all share URLs for a reading result.
 */
export function buildShareUrls(input: ShareUrlsInput): ShareUrls {
  const { type, text, sign, baseUrl } = input;
  const pageUrl = `${baseUrl}/dashboard`;
  const imageUrl = buildImageUrl(baseUrl, type, text, sign);

  return {
    imageUrl,
    pinterestUrl: buildPinterestUrl(imageUrl, pageUrl, text),
    xUrl: buildXUrl(text, pageUrl),
    facebookUrl: buildFacebookUrl(pageUrl),
    whatsAppUrl: buildWhatsAppUrl(text, pageUrl),
  };
}
