# Design System

## Theme

Dark. Cosmic charcoal and wine-ash surfaces put the sun mascot's warm amber in the position of an actual light source in a dark sky; turquoise carries interaction and precision where cobalt used to. Warmth still lives in the brand colors (amber, mascot, glow), not the background.

## Colors

All values in OKLCH.

```css
:root {
  /* Surface */
  --color-bg:      oklch(0.255 0.0210 293);   /* cosmic charcoal */
  --color-surface: oklch(0.294 0.0165 338);   /* wine ash — alternate section bg */

  /* Brand */
  --color-primary:     oklch(0.720 0.1200 195);   /* turquoise — links, CTAs, focus */
  --color-accent:      oklch(0.800 0.1600  96);   /* sun amber — mascot, warmth, glow */
  --color-accent-text: oklch(0.860 0.1500  96);   /* lighter amber; text on its own tint */

  /* Text */
  --color-ink:     oklch(0.940 0.0120  90);   /* near-white, warm trace — body text */
  --color-muted:   oklch(0.720 0.0300 280);   /* secondary text — ≥4.5:1 on bg */
  --color-border:  oklch(0.940 0.0120  90 / 0.14);   /* hairline on dark surfaces */
  --color-on-fill: var(--color-bg);   /* dark text for use on bright fills (primary/accent) */
}
```

**Contrast checks (measured, not estimated):**
- `--color-ink` on `--color-bg`: ≈13.3:1
- `--color-muted` on `--color-bg`: ≈6.4:1 (passes AA for body text with margin)
- `--color-primary` (turquoise) on `--color-bg`: ≈6.7:1 as text/links
- `--color-accent` (amber) on `--color-bg`: ≈8.5:1
- `--color-on-fill` (dark) on `--color-primary` or `--color-accent` fills: ≈6.7:1 / 8.5:1 — white text on either fill only hits ~2.4:1, so filled buttons/pills use dark text, never white.

**Color strategy:** Committed — cosmic charcoal/wine-ash carry the surface, turquoise carries interaction (30-60% of visual identity where cobalt used to sit), amber is reserved for the sun mascot and its halo plus sparing CTA/badge use. Never use both saturated colors in close proximity.

**Retuning alpha variants:** hover/tint states derive from the base tokens via CSS relative-color syntax (`oklch(from var(--color-primary) l c h / 0.35)` etc.) instead of hardcoded duplicate shades, so changing a base token retunes every derived state with it.

## Typography

**Font stack:**

| Role    | Family              | Source        | Notes                                                             |
|---------|---------------------|---------------|-------------------------------------------------------------------|
| Display | Bricolage Grotesque | Google Fonts  | Variable grotesque with optical sizing; proportions shift at large sizes giving it craft character without editorial affectation |
| Body    | Manrope             | Google Fonts  | Humanist geometric sans; slightly warm, excellent readability     |

**Voice rationale:** "Precise, warm, driven" reads physically as a craftsman's tools on a clean workbench — each in its exact place. Bricolage Grotesque delivers optical-size precision at display sizes while staying approachable at body scale; Manrope grounds the body in warmth. Neither is in a saturated aesthetic lane.

**Scale (fluid with `clamp()`):**

```css
--text-xs:   clamp(0.75rem,  0.70rem + 0.25vw, 0.875rem);
--text-sm:   clamp(0.875rem, 0.82rem + 0.28vw, 1rem);
--text-base: clamp(1rem,     0.95rem + 0.25vw, 1.125rem);
--text-lg:   clamp(1.125rem, 1.05rem + 0.38vw, 1.25rem);
--text-xl:   clamp(1.25rem,  1.10rem + 0.75vw, 1.5rem);
--text-2xl:  clamp(1.5rem,   1.30rem + 1.00vw, 2rem);
--text-3xl:  clamp(2rem,     1.60rem + 2.00vw, 3rem);
--text-4xl:  clamp(2.75rem,  2.00rem + 3.75vw, 5rem);
```

Display headings (h1) use Fraunces at `--text-4xl`, optical-size variant. Body text uses Manrope at `--text-base`. Max line length: 68ch.

**Weight pairing:**
- Fraunces: 300 (thin display), 700 (strong heading)
- Manrope: 400 (body), 500 (UI labels), 600 (subheadings), 700 (CTAs)

## Spacing

8-point base with fluid adjustments:

```css
--space-1:  0.25rem;   /*  4px */
--space-2:  0.5rem;    /*  8px */
--space-3:  0.75rem;   /* 12px */
--space-4:  1rem;      /* 16px */
--space-6:  1.5rem;    /* 24px */
--space-8:  2rem;      /* 32px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-24: 6rem;      /* 96px */
--space-32: 8rem;      /* 128px */
```

Section vertical padding: `clamp(4rem, 8vw, 8rem)`. Content max-width: 1100px. Text content max-width: 68ch.

## Layout

Single scrolling page with clear section cadence. Each section breathes — no cramped stacking. Grid: 12-column, 24px gutter on desktop, 16px on mobile.

**Sections (in order):**
1. Hero — name, role, value proposition, primary CTA
2. About — short personal story, craft philosophy
3. Work — selected projects, 3-5 pieces, shown with care (not identical card grid)
4. Contact — direct, warm, low-friction

Project detail pages at `/projects/[slug]` expand individual case studies.

## Motion

Library: **Motion** (formerly Framer Motion). All animations respect `prefers-reduced-motion`.

```css
@media (prefers-reduced-motion: reduce) {
  /* Crossfade only; no translate, scale, or blur */
}
```

**Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) for entrances. `cubic-bezier(0.7, 0, 0.84, 0)` (ease-in-expo) for exits.

**Durations:**
- Micro-interactions (hover, focus): 120-150ms
- Content reveals: 500-600ms
- Page transitions: 400ms

**Reveal pattern:** Elements fade in with a 24px upward translate on scroll intersection. Stagger sibling groups by 60ms. No identical reveal applied uniformly to every section — each section's reveal fits what it reveals.

## Components

**Primary button:** Turquoise fill (`--color-primary`), dark text (`--color-on-fill`), 8px radius, 16px vertical / 28px horizontal padding. Hover: lightened via relative-color syntax plus a soft turquoise glow (`box-shadow`). Focus: 2px offset ring in primary.

**Secondary button / ghost:** Transparent fill, turquoise border (1.5px, 50% alpha), turquoise text. Hover: 10% turquoise tint background.

**Project card:** No identical card grid. Each featured project gets differentiated treatment — alternate layout (image left, image right, image full-bleed) across the projects section. Shadows are true dark (`oklch(0 0 0 / …)`), not the low-alpha near-black used for depth on a light bg.

**Links:** Turquoise color, underline on hover (2px offset, animated width from 0 to 100%).

**Sun mascot:** Amber blob (`--color-accent`) is the one fixed identity element. Its eyes/smile use `--color-bg` (not `--color-ink`) so the face stays dark-on-amber regardless of theme direction. A blurred radial-gradient halo in `--color-accent` sits behind it (`SunMascot.module.css`) so it reads as a light source against the dark sky.

**Tech-stack icons (About):** sit on small `--color-ink` tiles (46px, 10px radius) so single-color/dark brand logos (e.g. the solid-black Next.js mark) stay visible regardless of the icon's own palette.

## Tokens — do not use

- Cream, sand, beige, or any warm-tinted near-white for `--color-bg`
- Gradient text (`background-clip: text`)
- `border-left` > 1px as decorative accent stripe
- Glassmorphism (blurred frosted cards decoratively)
- Eyebrow text (small all-caps tracked label above every heading)
- White text on `--color-primary` or `--color-accent` fills (fails contrast at this lightness) — use `--color-on-fill`
- `--color-ink` as an image/loading backdrop (it's near-white in this theme; use `--color-surface` instead, per `Projects.module.css` `.preview` and `ProjectOverlay.module.css` `.imageWrap`)
