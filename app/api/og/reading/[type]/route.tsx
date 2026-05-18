import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { parseOgReadingParams } from "@/lib/og/reading-image";

export const runtime = "edge";
export const contentType = "image/png";

const ELEMENT_GLOW: Record<string, string> = {
  fire: "rgba(255, 120, 60, 0.25)",
  earth: "rgba(80, 160, 80, 0.2)",
  air: "rgba(100, 180, 255, 0.2)",
  water: "rgba(60, 140, 220, 0.25)",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> },
) {
  const { type } = await params;
  const searchParams = request.nextUrl.searchParams;

  const parsed = parseOgReadingParams(type, searchParams);

  if ("error" in parsed) {
    return new Response(JSON.stringify({ error: parsed.error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { typeLabel, sign, highlight, dimensions } = parsed;
  const glow = sign ? (ELEMENT_GLOW[sign.element] ?? "rgba(212, 175, 55, 0.15)") : "rgba(212, 175, 55, 0.15)";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(160deg, #0D0D1A 0%, #1a0a2e 50%, #0D0D1A 100%)",
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
            inset: 0,
            background: `radial-gradient(circle at 50% 40%, ${glow} 0%, transparent 60%)`,
            display: "flex",
          }}
        />

        {/* Top brand */}
        <div
          style={{
            position: "absolute",
            top: "48px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "rgba(212, 175, 55, 0.6)",
            fontSize: "28px",
            letterSpacing: "4px",
          }}
        >
          <span style={{ display: "flex" }}>✨</span>
          <span style={{ display: "flex", textTransform: "uppercase" }}>Stellara</span>
        </div>

        {/* Center content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "32px",
            zIndex: 1,
            paddingLeft: "64px",
            paddingRight: "64px",
          }}
        >
          {/* Zodiac symbol */}
          {sign && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "120px",
                  display: "flex",
                  filter: "drop-shadow(0 0 24px rgba(212,175,55,0.5))",
                }}
              >
                {sign.symbol}
              </span>
              <span
                style={{
                  fontSize: "32px",
                  color: "rgba(255,255,255,0.85)",
                  display: "flex",
                  fontWeight: 600,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                {sign.displayName}
              </span>
            </div>
          )}

          {/* Reading type badge */}
          <div
            style={{
              display: "flex",
              background: "rgba(212,175,55,0.12)",
              border: "1px solid rgba(212,175,55,0.3)",
              borderRadius: "40px",
              paddingTop: "10px",
              paddingBottom: "10px",
              paddingLeft: "28px",
              paddingRight: "28px",
            }}
          >
            <span
              style={{
                fontSize: "22px",
                color: "#D4AF37",
                letterSpacing: "3px",
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              {typeLabel}
            </span>
          </div>

          {/* Highlight text */}
          {highlight && (
            <div
              style={{
                display: "flex",
                maxWidth: "900px",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: "36px",
                  color: "rgba(255,255,255,0.9)",
                  lineHeight: 1.4,
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {highlight}
              </span>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            position: "absolute",
            bottom: "52px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "1px",
              display: "flex",
            }}
          >
            stellara.chat
          </span>
        </div>
      </div>
    ),
    {
      width: dimensions.width,
      height: dimensions.height,
    },
  );
}
