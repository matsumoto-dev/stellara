import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { StarOrnament } from "@/components/icons/stellara-mark";
import { LegalHeader } from "@/components/layout/legal-header";
import { getPrivacyContent } from "@/lib/legal/content";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal");
  return {
    title: t("privacyTitle"),
    description: "Stellara プライバシーポリシー。お客様のデータの取り扱いについてご説明します。",
  };
}

export default async function PrivacyPage() {
  const content = getPrivacyContent();
  const t = await getTranslations("legal");
  const tCommon = await getTranslations("common");

  return (
    <>
      <LegalHeader />
      <article className="max-w-3xl mx-auto px-6 py-14">
        <div className="text-center mb-12">
          <div className="divider-ornament max-w-[16rem] mx-auto mb-6">
            <StarOrnament size={8} />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-moonlight tracking-tight mb-3">
            {content.title}
          </h1>
          <p className="text-text-muted text-sm">
            {t("lastUpdated", { date: content.lastUpdated })}
          </p>
        </div>

        <nav className="mb-12 p-6 bg-night-veil/40 backdrop-blur-sm border border-gold-leaf/15 rounded-xl">
          <div className="divider-ornament mb-4">
            <span className="font-heading text-[10px]">{t("contents")}</span>
          </div>
          <ul className="space-y-2">
            {content.sections.map((section) => (
              <li key={section.heading}>
                <a
                  href={`#${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="text-sm text-gold-pale/80 hover:text-gold-pale transition-colors"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-10">
          {content.sections.map((section) => (
            <section
              key={section.heading}
              id={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
              className="scroll-mt-24"
            >
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-gold-pale mb-4 tracking-tight">
                {section.heading}
              </h2>
              <div className="font-reading text-text/90 text-[15px] leading-[1.85] whitespace-pre-line">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        <div className="my-14 flex items-center justify-center gap-3 text-gold-leaf/30">
          <StarOrnament size={6} />
          <StarOrnament size={8} />
          <StarOrnament size={6} />
        </div>

        <p className="text-text-muted text-sm text-center">
          あわせて確認:{" "}
          <Link href="/terms" className="text-gold-pale hover:text-gold-glow transition-colors">
            {tCommon("termsLink")}
          </Link>
        </p>
      </article>
    </>
  );
}
