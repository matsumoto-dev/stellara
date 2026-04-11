# Stellara — Design Audit Report

> **Scope**: Full-surface review of the current Stellara astrology portfolio UI, performed against the screenshots in `reviews/e2e-manual/` and the live component code (`app/globals.css`, `components/ui/*`, `app/page.tsx`, `app/(app)/dashboard/page.tsx`, `components/horoscope/daily-card.tsx`, `components/tarot/tarot-card.tsx`).
>
> **Design tokens in play today**:
> - Bg `#0D0D1A`, Card `#161630`, Primary `#2D1B69`, Secondary `#1A1A4E`
> - Accent (gold) `#D4AF37`, Accent-light `#E8C94A`
> - Text `#E8E8F0`, Text-muted `#9090B0`
> - Fonts: Playfair Display (headings), Inter (body)
> - Cards: flat `bg-bg-card` + `border-text-muted/10`, radius `xl`, optional faint gold glow
> - No background imagery, no star field, no gradients beyond tarot suit tints
>
> **Priority legend**: CRITICAL (breaks the brand promise / must fix for launch) · HIGH (visibly cheapens the product) · MEDIUM (noticeable polish gap) · LOW (nice-to-have refinement)

---

## Cross-Cutting Issues (apply everywhere)

### CRITICAL — No atmospheric background anywhere
Every screen is pure `#0D0D1A` flat fill. There is no starfield, no nebula, no subtle vignette, no radial gradient, no noise texture. Fortune-telling products live and die on atmosphere. Right now Stellara reads as "generic dark-mode SaaS dashboard with a gold button," not "mystical AI oracle." This is the single biggest reason the UI feels AI-generated rather than hand-crafted.
- **Category**: Atmosphere
- **Evidence**: All screenshots; `app/globals.css` has no background image, no gradient, no custom CSS beyond token declarations.

### CRITICAL — The gold accent is used as a flat CTA color, not as light
Gold (`#D4AF37`) currently exists only as: (a) solid button fills, (b) 80% opacity text labels, (c) one 8-12% static box-shadow on cards. Gold should feel like *candlelight* on this product — warm rim lights on card edges, glints on zodiac glyphs, a haloed starfield, CTA buttons that feel lit from within. Instead the gold buttons look like flat Figma rectangles because they have no gradient, no inner highlight, no shadow, no shimmer.
- **Category**: Color usage, Atmosphere
- **Evidence**: `components/ui/button.tsx` primary variant is `bg-accent text-bg` with a 150ms color-only transition; login button, dashboard CTAs on 05/06/09.

### CRITICAL — Playfair Display is wasted on small sizes, and mixes uncomfortably with CJK
Playfair is a high-contrast display serif built for 32px+. It's being applied to 14–20px card titles (`CardTitle` = `text-xl`) where it reads as thin and fragile. Worse, because the product is Japanese-primary, Playfair only kicks in on the rare Latin fragments ("Stellara", "Pro", "$9.99") while all the real headlines fall back to the OS default CJK font (probably Yu Gothic / Hiragino). Result: the "serif elegance" only appears on ~5% of text, and the rest looks like a default browser. You can see this starkly on screen 04 where "こんにちは" and "今日のホロスコープ" are both sans-serif but you expect something more ceremonial.
- **Category**: Typography
- **Evidence**: `globals.css` lines 15–27; `components/ui/card.tsx` line 33 (`font-heading text-xl`); dashboard, reading, tarot, chat, history, settings headers all render in fallback CJK sans.
- **Action implied**: Pair Playfair with a matching ceremonial JP serif (Shippori Mincho, Noto Serif JP, Klee One) — not optional.

### HIGH — Card styling is a single monotonous recipe
Every card on every page is `bg-bg-card border border-text-muted/10 rounded-xl p-6`. There is zero visual differentiation between "your daily horoscope" (the hero moment) and "an upsell paywall card" (a utility block). The daily horoscope card on screen 04 should feel like a sacred scroll or an altar; instead it's the same rectangle as the settings "アカウントの削除" card on screen 09. Priority content has no visual priority.
- **Category**: Visual hierarchy, Polish
- **Evidence**: `components/ui/card.tsx` — one variant; `daily-card.tsx` uses `<Card glow>` which only adds a faint 8% gold shadow.

### HIGH — No iconography system, emoji used as placeholders
Feature icons on the landing are `✦ ✨ ♠ ☁` (screen 01). Dashboard quick-action icons are `✨ ♠ ☁` (screen 04). Sidebar nav uses `☆ ✨ ♠ ☁ ✱ ⚙`. These are Unicode glyphs rendered with whatever emoji font the browser picks — they're different weights, different colors, sometimes color-emoji, sometimes outline. Tarot paywall and history paywall use a generic 4-point star SVG that looks like a Notion placeholder. A fortune-telling brand cannot ship with OS-dependent glyphs as its icon language.
- **Category**: Polish, Atmosphere
- **Evidence**: `app/page.tsx:12` (`FEATURE_ICONS`), `app/(app)/dashboard/page.tsx:62-75`, screens 01/04/07/08.

### HIGH — Spacing rhythm is arbitrary, not a scale
`py-24`, `py-20`, `py-6`, `mb-12`, `mb-10`, `mb-6`, `mb-2`, `mb-1`, `mt-0.5`, `pt-4`, `p-8`, `p-6`, `p-3` are all in use across the landing alone. There's no evidence of a 4/8/12/16/24/32/48/64 scale being respected — developers are picking numbers case-by-case. This is why the landing has an "I wrote Tailwind classes as I went" rhythm.
- **Category**: Spacing & rhythm
- **Evidence**: `app/page.tsx` throughout; `dashboard/page.tsx` `space-y-8` vs `gap-4` vs `mt-1`.

### HIGH — No micro-interactions or loading states with personality
Buttons have `transition-colors duration-150`. Cards have nothing. The loading spinner is a plain CSS border-spinner (button.tsx:44). The only animated thing in the whole product is the tarot card flip (framer-motion, 0.6s). A tarot app should have shimmer on hover, star twinkles on idle, a breathing gold glow on the daily card, ink-bleeding reveal on readings. Right now the product is completely static until you flip a tarot card.
- **Category**: Atmosphere, Polish
- **Evidence**: `button.tsx:39`, `card.tsx:10`, `daily-card.tsx`, `tarot-card.tsx` (the only file using framer-motion).

### MEDIUM — Disclaimer footer is visually louder than it should be
`本サービスは娯楽を目的としたものです…` plus `利用規約・プライバシーポリシー` in gold underline appears on every single authenticated screen (05–09) as a bright yellow line. The gold color pulls the eye to a legal disclaimer instead of to the content. The disclaimer should be `text-muted/60`, not `text-accent`.
- **Category**: Visual hierarchy, Color usage
- **Evidence**: Screens 05, 06, 07, 08, 09.

### MEDIUM — No focus states visible in any screenshot, and likely none designed
Button and card components define `hover:` states but no `focus-visible:` rings. For a product that wants to feel precious, the missing focus state also signals unfinished craftsmanship.
- **Category**: Polish, Accessibility
- **Evidence**: `button.tsx`, `card.tsx`.

### LOW — Favicon / brand mark missing from visible chrome
The sidebar has "Stellara" as Playfair text, no wordmark lockup, no sigil, no glyph. For a brand in this category, a custom sigil (a stylized star, a constellation mark, an alchemical rune) is table stakes.
- **Category**: Polish, Atmosphere

---

## Screen-by-Screen

### 01 — Landing (`01-landing.png`, `pricing-full.png`)

#### CRITICAL — Hero has no visual anchor
The hero is: small gold eyebrow "✦ AI ASTROLOGY", a big Playfair headline, a paragraph, a gold button, a ghost link. That's it. No illustration, no zodiac wheel, no chart animation, no starfield, no glow behind the headline. A fortune-telling landing page without a visual anchor is indistinguishable from a Notion template. The hero should stop a scroller in 0.3 seconds — right now it does not.
- **Category**: Visual hierarchy, Atmosphere
- **Evidence**: `app/page.tsx:58-79`, screen 01.

#### HIGH — Feature cards are indistinguishable from each other
Four feature cards (`horoscope`, `reading`, `tarot`, `chat`) all have the same flat bg, same border, same 24px icon in gold, same 18px heading, same body. Only the icon glyph differs. This is the canonical "4-card feature grid" that every B2B SaaS ships. For an astrology product, each feature deserves its own color mood, its own illustration or glyph, its own hover reveal.
- **Category**: Visual hierarchy, Polish
- **Evidence**: `app/page.tsx:84-99`.

#### HIGH — "How It Works" step circles are anemic
Screen 01, the 使い方 section. Three tiny `w-10 h-10` gold-outlined circles with "1 / 2 / 3". They read as small, cheap, and decorative in a bad way. Compare to any competitor that uses constellation connectors, dashed orbits between steps, or illustrated cards.
- **Category**: Visual hierarchy, Atmosphere
- **Evidence**: `app/page.tsx:108-122`.

#### MEDIUM — Pricing "Pro" card doesn't sell hard enough
The Pro card is `bg-primary` (`#2D1B69`) with `border-accent/30` and a "おすすめ" pill. That's better than the Free card — but it still feels like a purple rectangle. No gradient, no glow, no shimmer, no featured-card shadow. Gold "$9.99" would be a more obvious price hierarchy than white. Features use plain `✓` checkmarks where they could use sparkles or constellation bullets.
- **Category**: Visual hierarchy, Polish
- **Evidence**: `app/page.tsx:155-180`, `pricing-section.png`.

#### MEDIUM — Check-mark list bullets are plain `✓` characters
`<span className="text-accent">✓</span>` renders as the system font checkmark — different on every OS. Should be an inline SVG.
- **Category**: Polish
- **Evidence**: `app/page.tsx:141`.

#### LOW — Nav has no backdrop-blur or sticky behavior
The top nav is a static `max-w-5xl` row with "Stellara" on the left and two links on the right. No blur, no sticky, no scroll-state. Trivial to upgrade.
- **Category**: Polish
- **Evidence**: `app/page.tsx:42-55`.

---

### 02 / 03 — Login (`02-login.png`, `03-after-demo-login.png`)

#### CRITICAL — No form container, no branding, no atmosphere
"おかえりなさい" floats in the middle of a black void. There is no card around the form, no Stellara wordmark at the top of this page, no illustration, no constellation. It looks like an unstyled `<form>` with Tailwind defaults. Compare to any well-designed fortune or spiritual app — the login is a moment of arrival and should feel like entering a temple.
- **Category**: Visual hierarchy, Atmosphere, Polish
- **Evidence**: Screens 02, 03.

#### HIGH — Input fields have poor visual weight
The email and password inputs are a slightly-darker-than-bg rectangle with no visible border or label differentiation at rest. They look like holes punched in the background. Labels (`メールアドレス`, `パスワード`) are `text-muted` and tiny.
- **Category**: Visual hierarchy, Polish
- **Evidence**: Screens 02, 03.

#### HIGH — "または" divider is a raw HR with label
Classic Bootstrap-era divider. Thin gray line with "または" in the middle. No atmosphere, no gold dot, no constellation-style separator.
- **Category**: Polish
- **Evidence**: Screen 02.

#### MEDIUM — Demo button loading state is unreadable
On screen 03 the demo button shows a small spinner + text at ~40% opacity — you can barely read "デモアカウントで体験する". Loading state should keep text legible and show a gold pulse, not drop opacity to near-invisible.
- **Category**: Polish
- **Evidence**: Screen 03; `button.tsx:42-47` (opacity-50 on disabled).

#### MEDIUM — Footer disclaimer is again too gold
Same footer issue as cross-cutting MEDIUM above.

---

### 04 — Dashboard (`04-dashboard.png`)

#### CRITICAL — The daily horoscope card is the ONLY reason the user is here, and it looks like a forum post
"今日のホロスコープ" should be a sacred artifact — a scroll, a parchment, a stained-glass window, an engraved plaque. Instead it is a flat `#161630` rectangle with a tiny zodiac glyph, a heading, a date, and dense body text in several sections labeled by small gold uppercase. There is no hero visual, no illustrated zodiac sign, no decorative border, no texture. The user's entire daily ritual is rendered as a bulleted Notion page.
- **Category**: Visual hierarchy, Atmosphere
- **Evidence**: Screen 04; `components/horoscope/daily-card.tsx`.

#### HIGH — Zodiac glyph is small, monochrome, and lost
The `<ZodiacIcon size="lg">` in the header sits beside the title and reads as a ~32px grey pictogram. It should be the hero of this card — large, illuminated, with a golden halo, possibly animated (slow rotation, twinkle).
- **Category**: Visual hierarchy, Atmosphere
- **Evidence**: `daily-card.tsx:56-62`.

#### HIGH — Section labels are almost invisible
"今日のテーマ", "アドバイス", "ラッキーアイテム" are rendered `text-xs font-semibold text-accent/80 tracking-wide mb-1.5` — at 80% opacity on a gold that's already muted on dark, and at 12px. They disappear. Section headings for divinatory content should feel authoritative, like chapter openers.
- **Category**: Typography, Visual hierarchy
- **Evidence**: `daily-card.tsx:68-72`.

#### HIGH — Greeting + subtitle is generic
"こんにちは、" + "今日、星があなたに語りかけています。" — the greeting is `font-heading text-3xl font-bold text-text` with a muted subtitle. Fine, but there's no time-of-day atmosphere (a moon icon at night, a sun at morning), no personalization beyond the translation key. This is where the product should feel like it *knows* you.
- **Category**: Atmosphere, Personalization
- **Evidence**: `dashboard/page.tsx:132-138`.

#### HIGH — Quick actions row is three identical gray rectangles
"パーソナル鑑定 / タロット / チャット" — three cards with emoji glyphs ("✨ ♠ ☁"), a title, and one line of text. Same as the feature grid on the landing. Each of these is a different mystical practice and they all look identical.
- **Category**: Visual hierarchy, Atmosphere
- **Evidence**: `dashboard/page.tsx:159-172`.

#### MEDIUM — Share buttons are a utility row at the bottom of the sacred card
Pinterest / X / Facebook / WhatsApp + "画像で保存" is rendered as a plain horizontal list separated by a `border-t`. For a user-shared moment of insight, the share affordance should feel more intentional — a single "この導きを分かち合う" CTA that opens a styled share sheet.
- **Category**: Polish
- **Evidence**: `daily-card.tsx:79-85`, screen 04.

---

### 05 — Reading (`05-reading-empty.png`, `05-reading-filled.png`, `05-reading-result.png`)

#### CRITICAL — The entire page is a title, a textarea, and a gold button on a black void
"パーソナル鑑定" heading, one subtitle line, one textarea, one button. No framing, no atmosphere, no card, no zodiac wheel, no illustration of a crystal ball, no prompt examples, no visual suggestion that this is a divination moment. It is literally: heading + textarea + button. The bottom 70% of the viewport is pure black.
- **Category**: Visual hierarchy, Atmosphere
- **Evidence**: Screens 05-empty, 05-filled.

#### HIGH — Textarea is unframed
Same issue as login inputs — a slightly-darker rectangle punched into the bg. No label, no floating placeholder style, no character count, no prompt suggestions. Placeholder "聞いてみたいことを入力（任意）" is the only hint.
- **Category**: Polish
- **Evidence**: Screen 05.

#### HIGH — Error state "利用回数の上限に達しました" is a generic red strip
Screen 05-result. The rate-limit error is a `border-red-900/40 bg-red-950/20 text-red-400` strip under the button. No upgrade CTA, no sympathetic framing, no "星があなたをもっと深く見つめるには Proプランが必要です" — just a blunt error. Monetization opportunity lost and the moment feels abrupt.
- **Category**: Visual hierarchy, Atmosphere, Conversion
- **Evidence**: Screen 05-result.

#### MEDIUM — Empty state has no example prompts
A blank textarea on a blank page gives the user nothing to grab. Fortune-telling prompts benefit enormously from example chips ("仕事の転機は?", "今の恋の行方", "今月の金運").
- **Category**: Polish, UX
- **Evidence**: Screen 05-empty.

---

### 06 — Tarot (`06-tarot-empty.png`, `06-tarot-result.png`)

#### HIGH — Spread selector is two flat toggle buttons
"1枚引き / 過去・現在・未来" — two equal-width rectangles, selected one is gold, unselected is `bg-bg-card`. Zero atmosphere for a practice that is *fundamentally visual*. Should be illustrated (a single card silhouette vs. three card silhouettes) with hover reveal.
- **Category**: Visual hierarchy, Atmosphere
- **Evidence**: Screen 06-empty.

#### HIGH — Drawn card is upside down and unreadable
Screen 06-result shows "Six of Cups" flipped to `rotate-180` because it's a reversed reading (`drawn.orientation === "reversed"`). This rotates the *entire card including the name text*, so the card title is rendered upside-down. That's a UX failure — the user can't read the card name. Reversed orientation should rotate only the illustration/symbol, not the text label.
- **Category**: Polish, UX bug
- **Evidence**: `tarot-card.tsx:139` (`drawn.orientation === "reversed" ? "rotate-180" : ""` wraps the whole card).

#### MEDIUM — Tarot card design is decent but flat
The `border-accent/30` corner decorations, inner border, roman numeral, and gradient suit background are a reasonable start — this is actually the most designed thing in the product. But the gradient is very subtle (`from-purple-900/50 to-indigo-950/30`), the corner decorations are thin, and the card lacks any back-of-card design for the pre-flip state (currently it just shows a mirrored front).
- **Category**: Polish, Atmosphere
- **Evidence**: `tarot-card.tsx:130-173`.

#### MEDIUM — Tarot symbols are color emoji (🃏🪄🌙👑...)
The Fool is `🃏` (playing-card joker emoji), Empress is `👑` (crown emoji), Death is `🦋` (butterfly emoji). These are OS-dependent color emoji and they break the brand. A tarot product must ship with custom illustrated arcana — or at minimum monochrome line-art SVGs — not Apple/Google emoji.
- **Category**: Polish, Atmosphere, Brand
- **Evidence**: `tarot-card.tsx:38-61`.

#### MEDIUM — Only one card rendered in the result; same rate-limit red strip reused
Screen 06-result shows one card followed immediately by the same red error bar from the reading page. No transition, no framing, no insight text beside the card. The card draw is supposed to be the climax of a ritual.
- **Category**: Visual hierarchy, Atmosphere
- **Evidence**: Screen 06-result.

---

### 07 — Chat (`07-chat-empty.png`, `07-chat-response.png`)

#### CRITICAL — Paywall empty state is the same beige modal as history
Screen 07-empty. A 4-point star icon, "星とのチャットはProプラン限定です", one paragraph, one gold "プランを見る" button. Identical layout to the history paywall on screen 08. Two different features, same canned upsell — users will immediately notice the copy-paste.
- **Category**: Polish, Conversion
- **Evidence**: Screens 07-empty, 08.

#### HIGH — Chat UI itself is WhatsApp-generic
Screen 07-response. User bubble right-aligned in `bg-bg-card`, a `0/5回のやり取りを使用` badge in the top-right, a bottom input with "送信" button. No AI avatar, no typing indicator, no star field background, no "星が語りかけています…" shimmer while streaming. Could be any LLM chatbot wrapper.
- **Category**: Atmosphere, Polish
- **Evidence**: Screen 07-response.

#### HIGH — "この機能にはProプランが必要です" warning above the input is styled like an error
Red text, `text-red-400`. It should be a gentle gold/muted note, or — better — not block the UI and instead let the user type one message that opens the upsell modal on send.
- **Category**: Color usage, Conversion
- **Evidence**: Screen 07-response.

#### MEDIUM — Usage counter `0/5回のやり取りを使用` pill is visually heavy
A `bg-accent/20 text-accent rounded-full` pill in the top-right pulls attention away from the chat itself. Usage meters on this kind of product should be subtle — a small progress ring next to the send button, not a headline-height badge.
- **Category**: Visual hierarchy
- **Evidence**: Screen 07-response.

---

### 08 — History (`08-history.png`)

#### HIGH — Reused paywall template with zero personality
Same 4-point SVG star, same "鑑定履歴はProプラン限定です" structure as chat. Neither paywall explains what you'll see inside. An empty-state illustration (a dusty scroll, a constellation journal, a stack of tarot cards) would both sell the feature and add atmosphere.
- **Category**: Conversion, Atmosphere
- **Evidence**: Screen 08.

#### MEDIUM — Body copy is identical to chat paywall
"Proプランにアップグレードすると、この機能をはじめ、鑑定やタロットが無制限にお楽しみいただけます。" appears verbatim on both 07 and 08. Lazy.
- **Category**: Polish

---

### 09 — Settings (`09-settings.png`)

#### MEDIUM — Two flat cards, no section hierarchy
"ご利用プラン" and "アカウントの削除" are two identical-looking cards. The destructive account-deletion card uses the same background and border as the plan card — only the red button distinguishes it. Destructive zones should have visual distance (subdued card, red-tinted border, "危険な操作" label).
- **Category**: Visual hierarchy, Polish
- **Evidence**: Screen 09.

#### MEDIUM — "Proプランにする" button is small and muted
On a settings screen where upgrading is the primary commercial action, the CTA is a `size="md"` gold button. It should be prominent and ideally repeat the pricing pitch inline.
- **Category**: Visual hierarchy, Conversion
- **Evidence**: Screen 09.

#### LOW — No account info (email, avatar, sign, join date)
Settings shows only plan + delete. No profile section, no personalization, no birth data summary. Feels half-finished.
- **Category**: Polish, UX
- **Evidence**: Screen 09.

---

### 10 — Mobile Dashboard (`10-mobile-dashboard.png`)

#### HIGH — Sidebar disappears but there is no mobile nav visible in the screenshot
The mobile screenshot shows the greeting, the horoscope card, and the quick actions stacked — with no hamburger menu, no bottom nav, no tab bar. Either the nav is hidden and unreachable, or it scrolls away. For a daily-use app this is a red flag.
- **Category**: UX, Polish
- **Evidence**: Screen 10.

#### MEDIUM — Horoscope card content is cramped at mobile width
Section labels and body text run edge-to-edge of the card with `p-6` padding. At ~375px viewport this reads as dense. The card design that's merely flat on desktop becomes claustrophobic on mobile.
- **Category**: Spacing & rhythm, Polish
- **Evidence**: Screen 10.

#### MEDIUM — Quick action cards become full-width but keep the same sparse layout
On mobile the three quick actions stack vertically and each card has a lot of empty space to the right of its icon+title. Mobile cards should use the extra horizontal room — bigger icon on the left, title + description on the right, chevron on the far right.
- **Category**: Spacing & rhythm, Polish
- **Evidence**: Screen 10.

---

## Summary Matrix

| Screen | Critical | High | Medium | Low |
|---|---|---|---|---|
| Cross-cutting | 3 | 5 | 2 | 1 |
| 01 Landing | 1 | 2 | 2 | 1 |
| 02/03 Login | 1 | 2 | 2 | 0 |
| 04 Dashboard | 1 | 4 | 1 | 0 |
| 05 Reading | 1 | 2 | 1 | 0 |
| 06 Tarot | 0 | 2 | 3 | 0 |
| 07 Chat | 1 | 2 | 1 | 0 |
| 08 History | 0 | 1 | 1 | 0 |
| 09 Settings | 0 | 0 | 2 | 1 |
| 10 Mobile | 0 | 1 | 2 | 0 |
| **Total** | **8** | **21** | **17** | **3** |

---

## Files Referenced
- `C:\Users\sora1\main\stellara-public\app\globals.css`
- `C:\Users\sora1\main\stellara-public\app\page.tsx`
- `C:\Users\sora1\main\stellara-public\app\(app)\dashboard\page.tsx`
- `C:\Users\sora1\main\stellara-public\components\ui\card.tsx`
- `C:\Users\sora1\main\stellara-public\components\ui\button.tsx`
- `C:\Users\sora1\main\stellara-public\components\ui\badge.tsx`
- `C:\Users\sora1\main\stellara-public\components\horoscope\daily-card.tsx`
- `C:\Users\sora1\main\stellara-public\components\tarot\tarot-card.tsx`
- `C:\Users\sora1\main\stellara-public\reviews\e2e-manual\*.png` (16 screenshots)
