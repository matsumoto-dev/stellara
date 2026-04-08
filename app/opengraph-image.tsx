import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Stellara — Your Personal AI Astrologer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.06) 0%, transparent 50%)",
          display: "flex",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          zIndex: 1,
        }}
      >
        <div style={{ fontSize: "64px", display: "flex" }}>{"\u2728"}</div>
        <div
          style={{
            fontSize: "72px",
            fontWeight: 700,
            color: "#D4AF37",
            letterSpacing: "-2px",
            display: "flex",
          }}
        >
          Stellara
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "rgba(255, 255, 255, 0.7)",
            display: "flex",
          }}
        >
          Your Personal AI Astrologer
        </div>
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "24px",
            color: "rgba(212, 175, 55, 0.6)",
            fontSize: "20px",
          }}
        >
          <span style={{ display: "flex" }}>Daily Horoscopes</span>
          <span style={{ display: "flex" }}>{"\u2022"}</span>
          <span style={{ display: "flex" }}>Tarot Readings</span>
          <span style={{ display: "flex" }}>{"\u2022"}</span>
          <span style={{ display: "flex" }}>Star Chat</span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          color: "rgba(255, 255, 255, 0.3)",
          fontSize: "16px",
          display: "flex",
        }}
      >
        stellara.chat
      </div>
    </div>,
    { ...size },
  );
}
