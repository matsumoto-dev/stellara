import type { MetadataRoute } from "next";

const BASE_URL = "https://stellara.chat";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard", "/reading", "/tarot", "/chat", "/settings", "/history"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
