# Design System

## Theme

Light. Pure white surface lets the deep cobalt primary carry the brand's confidence and precision, with warm amber accent delivering the personal warmth. Warmth lives in the brand colors, not the background.

## Colors

All values in OKLCH.

```css
:root {
  /* Surface */
  --color-bg:      oklch(1.000 0.000   0);   /* pure white */
  --color-surface: oklch(0.970 0.010 232);   /* barely-tinted section bg */

  /* Brand */
  --color-primary: oklch(0.430 0.175 232);   /* deep cobalt — authority, precision */
  --color-accent:  oklch(0.720 0.130  68);   /* warm amber — energy, warmth */

  /* Text */
  --color-ink:     oklch(0.145 0.018 240);   /* near-black with cobalt trace — body text */
  --color-muted:   oklch(0.460 0.015 240);   /* secondary text — ≥4.5:1 on bg */
}
```

**Contrast checks:**
- `--color-ink` on `--color-bg`: ≈18:1 (well above 7:1 for body text)
- `--color-muted` on `--color-bg`: ≈4.7:1 (passes AA for body text)
- White text on `--color-primary`: ≈5.3:1 (passes AA for large text; use for buttons/badges)
- White text on `--color-accent`: passes for bold labels; use with caution at small sizes

**Color strategy:** Committed — the cobalt primary carries 30-60% of the visual identity. The amber accent is used sparingly for CTAs, highlights, and hover states. Never use both saturated colors in close proximity.

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

**Primary button:** Cobalt fill (`--color-primary`), white text, 8px radius, 16px vertical / 28px horizontal padding. Hover: `oklch(0.380 0.175 232)` (darkened 5%). Focus: 2px offset ring in primary.

**Secondary button / ghost:** Transparent fill, cobalt border (1.5px), cobalt text. Hover: 6% cobalt tint background.

**Project card:** No identical card grid. Each featured project gets differentiated treatment — alternate layout (image left, image right, image full-bleed) across the projects section.

**Links:** Cobalt color, underline on hover (2px offset, animated width from 0 to 100%).

## Tokens — do not use

- Cream, sand, beige, or any warm-tinted near-white for `--color-bg`
- Gradient text (`background-clip: text`)
- `border-left` > 1px as decorative accent stripe
- Glassmorphism (blurred frosted cards decoratively)
- Eyebrow text (small all-caps tracked label above every heading)
