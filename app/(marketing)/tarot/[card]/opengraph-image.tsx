import { ImageResponse } from "next/og";
import { parseTarotSlug } from "@/lib/seo/tarot";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ card: string }>;
}

const ARCANA_COLORS: Record<string, string> = {
  major: "rgba(212, 175, 55, 0.12)",
  minor: "rgba(140, 100, 220, 0.10)",
};

const SUIT_COLORS: Record<string, string> = {
  wands: "rgba(255, 120, 60, 0.12)",
  cups: "rgba(60, 140, 220, 0.12)",
  swords: "rgba(180, 200, 255, 0.10)",
  pentacles: "rgba(80, 180, 80, 0.12)",
};

export default async function OGImage({ params }: Props) {
  const { card: slug } = await params;
  const card = parseTarotSlug(slug);

  // Fallback to generic if slug invalid
  if (!card) {
    return new ImageResponse(
      <div
        style={{
          background: "linear-gradient(135deg, #0D0D1A 0%, #1a0a2e 50%, #0D0D1A 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#D4AF37",
          fontSize: "48px",
          fontFamily: "serif",
        }}
      >
        Stellara — Tarot
      </div>,
      { ...size },
    );
  }

  const accentColor = card.suit ? SUIT_COLORS[card.suit] : ARCANA_COLORS[card.arcana];
  const arcanaLabel =
    card.arcana === "major"
      ? "Major Arcana"
      : `${card.suit ? card.suit.charAt(0).toUpperCase() + card.suit.slice(1) : ""} · Minor Arcana`;

  const topKeywords = card.keywords.slice(0, 3).join("  ·  ");

  // Subtitle line (planet / zodiac / element)
  const subtitleParts = [card.planet, card.zodiac, card.element].filter(Boolean);
  const subtitle = subtitleParts.join(" · ");

  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #0D0D1A 0%, #1a0a2e 50%, #0D0D1A 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 50% 40%, ${accentColor ?? "rgba(212,175,55,0.1)"} 0%, transparent 60%)`,
          display: "flex",
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
          zIndex: 1,
        }}
      >
        {/* Card symbol */}
        <span style={{ fontSize: "88px", display: "flex" }}>{card.symbol}</span>

        {/* Arcana badge */}
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(212,175,55,0.2)",
            borderRadius: "99px",
            paddingTop: "6px",
            paddingBottom: "6px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              color: "rgba(212,175,55,0.8)",
              letterSpacing: "2px",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {arcanaLabel}
          </span>
        </div>

        {/* Card name */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: "-1px",
            display: "flex",
            textAlign: "center",
          }}
        >
          {card.name}
        </div>

        {/* Planet / zodiac / element */}
        {subtitle ? (
          <div
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.4)",
              display: "flex",
            }}
          >
            {subtitle}
          </div>
        ) : null}

        {/* Keywords */}
        <div
          style={{
            fontSize: "20px",
            color: "rgba(212,175,55,0.7)",
            display: "flex",
            marginTop: "4px",
          }}
        >
          {topKeywords}
        </div>
      </div>

      {/* Bottom branding */}
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "rgba(255,255,255,0.3)",
          fontSize: "16px",
        }}
      >
        <span style={{ display: "flex" }}>✨</span>
        <span style={{ display: "flex" }}>stellara.chat</span>
      </div>
    </div>,
    { ...size },
  );
}
