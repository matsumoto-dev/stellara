/**
 * Pure utility functions for the /api/og/reading/[type] Edge Function.
 * Separated from the route to enable unit testing without Next.js Edge runtime.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

export const IMAGE_FORMATS = {
  stories: { width: 1080, height: 1920 },
  pinterest: { width: 1000, height: 1500 },
} as const;

export type ImageFormat = keyof typeof IMAGE_FORMATS;

export const READING_TYPES = {
  horoscope: "Daily Horoscope",
  reading: "Personal Reading",
  tarot: "Tarot Reading",
  weekly: "Weekly Horoscope",
} as const;

export type OgReadingType = keyof typeof READING_TYPES;

// ─── Sign data ────────────────────────────────────────────────────────────────

export interface OgSignData {
  readonly name: string;
  readonly displayName: string;
  readonly symbol: string;
  readonly element: string;
}

const SIGN_DATA: ReadonlyArray<OgSignData> = [
  { name: "aries", displayName: "Aries", symbol: "♈", element: "fire" },
  { name: "taurus", displayName: "Taurus", symbol: "♉", element: "earth" },
  { name: "gemini", displayName: "Gemini", symbol: "♊", element: "air" },
  { name: "cancer", displayName: "Cancer", symbol: "♋", element: "water" },
  { name: "leo", displayName: "Leo", symbol: "♌", element: "fire" },
  { name: "virgo", displayName: "Virgo", symbol: "♍", element: "earth" },
  { name: "libra", displayName: "Libra", symbol: "♎", element: "air" },
  { name: "scorpio", displayName: "Scorpio", symbol: "♏", element: "water" },
  { name: "sagittarius", displayName: "Sagittarius", symbol: "♐", element: "fire" },
  { name: "capricorn", displayName: "Capricorn", symbol: "♑", element: "earth" },
  { name: "aquarius", displayName: "Aquarius", symbol: "♒", element: "air" },
  { name: "pisces", displayName: "Pisces", symbol: "♓", element: "water" },
];

// ─── Functions ────────────────────────────────────────────────────────────────

/**
 * Looks up sign data by name (case-insensitive).
 * Returns null if the sign is not found.
 */
export function getSignData(sign: string): OgSignData | null {
  const normalized = sign.toLowerCase().trim();
  return SIGN_DATA.find((s) => s.name === normalized) ?? null;
}

/**
 * Returns image dimensions for the given format string.
 * Defaults to "stories" (1080×1920) for unknown formats.
 */
export function getImageDimensions(format: string): { width: number; height: number } {
  const key = format as ImageFormat;
  return IMAGE_FORMATS[key] ?? IMAGE_FORMATS.stories;
}

/**
 * Returns a human-readable label for the reading type.
 * Returns null for unknown types.
 */
export function getReadingTypeLabel(type: string): string | null {
  const key = type as OgReadingType;
  return READING_TYPES[key] ?? null;
}

/**
 * Truncates highlight text to maxLength characters.
 * Appends "…" if the text was truncated.
 * Default maxLength: 100.
 */
export function truncateHighlight(text: string, maxLength = 100): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}

// ─── Parsed params ────────────────────────────────────────────────────────────

export interface OgReadingParams {
  readonly type: OgReadingType;
  readonly typeLabel: string;
  readonly sign: OgSignData | null;
  readonly highlight: string;
  readonly format: ImageFormat;
  readonly dimensions: { width: number; height: number };
}

export interface OgReadingError {
  readonly error: string;
}

/**
 * Validates and parses query parameters for the OG reading image endpoint.
 *
 * @param type - Path segment (e.g. "horoscope")
 * @param searchParams - URL search params from the request
 * @returns Parsed params or an error object
 */
export function parseOgReadingParams(
  type: string,
  searchParams: URLSearchParams,
): OgReadingParams | OgReadingError {
  const typeLabel = getReadingTypeLabel(type);
  if (!typeLabel) {
    return { error: `Unknown reading type: "${type}". Must be one of: ${Object.keys(READING_TYPES).join(", ")}` };
  }

  const signParam = searchParams.get("sign") ?? "";
  const sign = signParam ? getSignData(signParam) : null;

  const rawHighlight = searchParams.get("highlight") ?? "";
  const highlight = truncateHighlight(rawHighlight);

  const formatParam = searchParams.get("format") ?? "stories";
  const format: ImageFormat = formatParam in IMAGE_FORMATS ? (formatParam as ImageFormat) : "stories";
  const dimensions = getImageDimensions(format);

  return {
    type: type as OgReadingType,
    typeLabel,
    sign,
    highlight,
    format,
    dimensions,
  };
}
