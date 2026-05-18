import { ImageResponse } from "next/og";
import { parseCompatibilitySlug, getCompatibilityData } from "@/lib/seo/compatibility";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ pair: string }>;
}

export default async function OGImage({ params }: Props) {
  const { pair } = await params;
  const parsed = parseCompatibilitySlug(pair);

  // Fallback to generic if slug invalid
  if (!parsed) {
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
        Stellara — Compatibility
      </div>,
      { ...size },
    );
  }

  const { sign1, sign2, score } = getCompatibilityData(parsed[0], parsed[1]);

  const filledStars = "★".repeat(score);
  const emptyStars = "☆".repeat(5 - score);

  const scoreLabel =
    score === 5
      ? "Exceptional Match"
      : score === 4
        ? "High Compatibility"
        : score === 3
          ? "Moderate Match"
          : "Challenging Pair";

  const elementColors: Record<string, string> = {
    fire: "rgba(255, 120, 60, 0.5)",
    earth: "rgba(80, 160, 80, 0.5)",
    air: "rgba(100, 180, 255, 0.5)",
    water: "rgba(60, 140, 220, 0.5)",
  };

  const s1Color = elementColors[sign1.element] ?? "rgba(212, 175, 55, 0.4)";
  const s2Color = elementColors[sign2.element] ?? "rgba(212, 175, 55, 0.4)";

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
      {/* Ambient glow left (sign1 element color) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 25% 50%, ${s1Color} 0%, transparent 45%), radial-gradient(circle at 75% 50%, ${s2Color} 0%, transparent 45%)`,
          display: "flex",
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          zIndex: 1,
        }}
      >
        {/* Sign symbols row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "80px", display: "flex" }}>{sign1.symbol}</span>
            <span
              style={{
                fontSize: "24px",
                color: "rgba(255,255,255,0.9)",
                display: "flex",
                fontWeight: 600,
              }}
            >
              {sign1.displayName}
            </span>
            <span
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.45)",
                display: "flex",
                textTransform: "capitalize",
              }}
            >
              {sign1.element}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span style={{ fontSize: "32px", color: "rgba(212,175,55,0.6)", display: "flex" }}>
              &
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "80px", display: "flex" }}>{sign2.symbol}</span>
            <span
              style={{
                fontSize: "24px",
                color: "rgba(255,255,255,0.9)",
                display: "flex",
                fontWeight: 600,
              }}
            >
              {sign2.displayName}
            </span>
            <span
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.45)",
                display: "flex",
                textTransform: "capitalize",
              }}
            >
              {sign2.element}
            </span>
          </div>
        </div>

        {/* Compatibility label */}
        <div
          style={{
            fontSize: "20px",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "3px",
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          Compatibility
        </div>

        {/* Score stars */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(212,175,55,0.2)",
            borderRadius: "16px",
            paddingTop: "14px",
            paddingBottom: "14px",
            paddingLeft: "28px",
            paddingRight: "28px",
          }}
        >
          <span style={{ fontSize: "36px", color: "#D4AF37", display: "flex" }}>
            {filledStars}
            <span style={{ color: "rgba(212,175,55,0.25)", display: "flex" }}>{emptyStars}</span>
          </span>
          <span style={{ fontSize: "16px", color: "rgba(212,175,55,0.85)", display: "flex" }}>
            {scoreLabel}
          </span>
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
