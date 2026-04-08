import type { MetadataRoute } from "next";
import { SIGNS } from "@/lib/seo/compatibility";
import { ALL_CARDS } from "@/lib/seo/tarot";

const BASE_URL = "https://stellara.chat";

function getCompatibilityUrls(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const s1 of SIGNS) {
    for (const s2 of SIGNS) {
      entries.push({
        url: `${BASE_URL}/compatibility/${s1.name}-and-${s2.name}`,
        lastModified: new Date("2026-04-03"),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }
  return entries;
}

function getTarotUrls(): MetadataRoute.Sitemap {
  return ALL_CARDS.map((card) => ({
    url: `${BASE_URL}/tarot/${card.slug}`,
    lastModified: new Date("2026-04-03"),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...getCompatibilityUrls(),
    ...getTarotUrls(),
  ];
}
