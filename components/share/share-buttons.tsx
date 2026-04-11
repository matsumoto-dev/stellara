"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  buildFacebookUrl,
  buildImageUrl,
  buildPinterestUrl,
  buildWhatsAppUrl,
  buildXUrl,
  type ShareReadingType,
} from "@/lib/share/share-urls";
import type { ShareChannel } from "@/lib/db/types";

interface ShareButtonsProps {
  type: ShareReadingType;
  text: string;
  sign?: string;
  /** Override the page URL used for share links. Defaults to /dashboard. */
  pageUrl?: string;
  className?: string;
}

function trackShare(channel: ShareChannel, readingType: ShareReadingType): void {
  // Fire-and-forget: do not block the share action
  fetch("/api/share/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channel, reading_type: readingType }),
  }).catch(() => {
    // Silently ignore tracking errors — never interrupt the share flow
  });
}

export function ShareButtons({ type, text, sign, pageUrl: pageUrlProp, className = "" }: ShareButtonsProps) {
  const t = useTranslations("share");
  // Use "https://stellara.chat" as the SSR-safe fallback so that the initial
  // client render matches the server-rendered HTML. After mount, update to the
  // actual origin so share URLs reflect the real host (e.g. localhost in dev).
  const [baseUrl, setBaseUrl] = useState("https://stellara.chat");
  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const pageUrl = pageUrlProp ?? `${baseUrl}/dashboard`;
  const imageUrl = buildImageUrl(baseUrl, type, text, sign);
  const pinterestUrl = buildPinterestUrl(imageUrl, pageUrl, text);
  const xUrl = buildXUrl(text, pageUrl);
  const facebookUrl = buildFacebookUrl(pageUrl);
  const whatsAppUrl = buildWhatsAppUrl(text, pageUrl);

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      {/* Pinterest Pin It */}
      <a
        href={pinterestUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Save to Pinterest"
        onClick={() => trackShare("pinterest", type)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-text-muted/20 text-text-muted hover:text-white hover:border-[#E60023]/50 hover:bg-[#E60023]/10 transition-colors duration-150"
      >
        <PinterestIcon className="w-4 h-4" />
        <span>{t("pinterest")}</span>
      </a>

      {/* X (Twitter) Web Intent */}
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("x")}
        onClick={() => trackShare("x", type)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-text-muted/20 text-text-muted hover:text-white hover:border-white/30 hover:bg-white/10 transition-colors duration-150"
      >
        <XIcon className="w-4 h-4" />
        <span>{t("x")}</span>
      </a>

      {/* Facebook Share */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("facebook")}
        onClick={() => trackShare("facebook", type)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-text-muted/20 text-text-muted hover:text-white hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10 transition-colors duration-150"
      >
        <FacebookIcon className="w-4 h-4" />
        <span>{t("facebook")}</span>
      </a>

      {/* WhatsApp Share */}
      <a
        href={whatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("whatsapp")}
        onClick={() => trackShare("whatsapp", type)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-text-muted/20 text-text-muted hover:text-white hover:border-[#25D366]/50 hover:bg-[#25D366]/10 transition-colors duration-150"
      >
        <WhatsAppIcon className="w-4 h-4" />
        <span>{t("whatsapp")}</span>
      </a>

      {/* Download image */}
      <a
        href={imageUrl}
        download={`stellara-${type}.png`}
        aria-label={t("download")}
        onClick={() => trackShare("download", type)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-text-muted/20 text-text-muted hover:text-white hover:border-accent/50 hover:bg-accent/10 transition-colors duration-150"
      >
        <DownloadIcon className="w-4 h-4" />
        <span>{t("download")}</span>
      </a>
    </div>
  );
}

// ─── Icon components ──────────────────────────────────────────────────────────

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
