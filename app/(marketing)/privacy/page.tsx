import type { Metadata } from "next";
import { getPrivacyContent } from "@/lib/legal/content";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Stellara Privacy Policy. Learn how we handle your data.",
};

export default function PrivacyPage() {
  const content = getPrivacyContent();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
      <p className="text-text-muted text-sm mb-8">Last updated: {content.lastUpdated}</p>

      <nav className="mb-10 p-4 bg-bg-card rounded-lg">
        <p className="text-sm font-semibold mb-2">Contents</p>
        <ul className="space-y-1">
          {content.sections.map((section) => (
            <li key={section.heading}>
              <a
                href={`#${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="text-sm text-accent hover:underline"
              >
                {section.heading}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {content.sections.map((section) => (
        <section
          key={section.heading}
          id={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-3">{section.heading}</h2>
          <div className="text-text-muted whitespace-pre-line leading-relaxed">
            {section.content}
          </div>
        </section>
      ))}

      <hr className="my-10 border-bg-card" />
      <p className="text-text-muted text-sm">
        See also our{" "}
        <a href="/terms" className="text-accent hover:underline">
          Terms of Service
        </a>
        .
      </p>
    </div>
  );
}
