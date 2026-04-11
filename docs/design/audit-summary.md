# Stellara — Design Audit Executive Summary

## Overall Verdict

Stellara currently reads as **"competent dark-mode SaaS dashboard with a gold accent color"** — not as a mystical, intimate, fortune-telling product. The palette is correct on paper, but nothing in the execution earns the premise. Every screen is a flat `#0D0D1A` void holding a single slightly-lighter `#161630` rectangle, the gold is used as a flat CTA fill instead of as warm light, and the serif font only activates on the ~5% of text that is Latin. The product does not *feel* like anything yet. A first-time visitor would guess this is a B2B tool, not an oracle.

## Top 5 Most Impactful Issues

1. **No atmosphere anywhere.** Zero background imagery, no starfield, no nebula vignette, no radial gradient, no noise. This single gap is why the whole product reads as "AI-generated shell." Adding a subtle fixed starfield + radial vignette + noise texture would do more than any component redesign.

2. **The daily horoscope card looks like a forum post.** The user's reason-for-being-here is rendered as the exact same flat rectangle as the settings "delete account" card. This hero moment needs its own elevated component — scroll/parchment treatment, illuminated zodiac glyph, engraved gold divider, breathing glow. Not a variant of `<Card>` — a purpose-built artifact.

3. **Playfair Display is invisible in a Japanese product.** Because headings are CJK, Playfair almost never renders — the user sees OS-default Yu Gothic instead of any serif elegance. Must pair with Shippori Mincho / Noto Serif JP / Klee One and verify every heading actually loads a ceremonial serif.

4. **Gold is a fill color, not a light source.** `#D4AF37` currently appears as flat button fills and 80%-opacity text. It should behave like candlelight: rim-lit card edges, haloed CTAs with inner gradient and outer bloom, glints on zodiac icons, subtle shimmer on hover. This is the difference between "dark theme" and "illuminated."

5. **OS emoji used as the icon language.** `✦ ✨ ♠ ☁ 🃏 🪄 👑 🦋` render differently on every OS and break the spell immediately. A fortune-telling product cannot ship on system emoji — it needs a custom icon set (even a small one: 12 zodiac, 22 major arcana, 6 nav, 4 suits) as monochrome SVGs with gold stroke.

## Opportunities for "Fortune-Telling" Personality

- **Background system**: fixed starfield (CSS + canvas), radial dark-violet vignette pulling toward center, very low-opacity film grain. Parallax on scroll for landing.
- **Illuminated cards**: card variants `artifact` (horoscope/tarot results) with double-border, corner flourishes, inner gradient from `#1A1A4E` to `#0D0D1A`, breathing gold glow (3–5s ease-in-out).
- **Ritual moments**: reveal animations that feel ceremonial — ink-bleed text stream for readings, candle-flicker on the daily card header, slow rotation on the zodiac glyph.
- **Ceremonial typography pair**: Cinzel or Cormorant Garamond for Latin + Shippori Mincho for JP headings; keep Inter/Noto Sans JP only for UI labels and body.
- **Constellation connectors** for step indicators, dashed orbit dividers, gold-dot bullets instead of `✓`.
- **Custom sigil**: a Stellara mark (stylized eight-point star or zodiac sigil) in the sidebar and login arrival screen.
- **Personalized greeting atmosphere**: moon icon at night, sun at morning, with a short astrological observation ("火星があなたの行動を後押ししています").
- **Empathetic paywall copy** replacing "利用回数の上限に達しました" with framing like "星の導きを受け取るには、Proの鍵が必要です" + illustrated empty-state art per locked feature.
