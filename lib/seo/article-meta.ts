/**
 * Builds OpenGraph article metadata for Pinterest Rich Pins.
 *
 * Pinterest Article Rich Pins require:
 * - og:type = "article"
 * - article:published_time
 * - article:author
 *
 * Next.js Metadata API outputs these when publishedTime / authors are set
 * under openGraph with type "article".
 */

export interface ArticleOGFields {
  type: "article";
  publishedTime: string;
  modifiedTime: string;
  authors: string[];
  section: string;
  tags: string[];
}

/**
 * Returns article-specific OpenGraph fields for Pinterest Rich Pins.
 *
 * @param section - Content category (e.g. "Astrology", "Tarot")
 * @param tags    - Relevant keywords (max 6, deduped)
 * @param publishedIso - ISO 8601 published date (default: 2026-04-03T00:00:00Z)
 * @param modifiedIso  - ISO 8601 modified date (default: current date at call time)
 */
export function buildArticleOGFields(
  section: string,
  tags: string[],
  publishedIso = "2026-04-03T00:00:00Z",
  modifiedIso = new Date().toISOString().replace(/T.*$/, "T00:00:00Z"),
): ArticleOGFields {
  const dedupedTags = [...new Set(tags)].slice(0, 6);

  return {
    type: "article",
    publishedTime: publishedIso,
    modifiedTime: modifiedIso,
    authors: ["https://stellara.chat"],
    section,
    tags: dedupedTags,
  };
}
