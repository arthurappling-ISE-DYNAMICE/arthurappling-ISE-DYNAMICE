# Hero Overhaul — Sovereign Hybrid Design Spec
**Date:** 2026-04-13
**Branch:** `layout-refresh`
**Architect:** Arthur F. Appling Sr. · AA Capital INC dba Prime Pathwy
**Status:** APPROVED

---

## Overview

Visual refresh of the Prime Pathwy Consulting Wing landing page hero and supporting sections. Goal: "Institutional Grade" feel that matches the Consulting Wing's existing DNA without replacing it. Approved direction: **Approach C — Sovereign Hybrid**.

---

## Typography Tokens (Linear-Sourced)

Live-fetched from [linear.app/brand](https://linear.app/brand) and [typ.io/s/2jmp](https://typ.io/s/2jmp).

| Token | Value | Usage |
|---|---|---|
| `--font-inter` | Inter Variable (next/font/google) | Display headings |
| `--display-weight` | `800` | All section `h2` headings |
| `--display-tracking` | `−0.04em` | All section `h2` headings |
| `--display-leading` | `1.08` | All section `h2` headings |
| `--hero-h1-tracking` | `−0.02em` | Hero `h1` only (serif voice) |

**Two-tier rule (approved):**
- Hero `h1`: Georgia serif italic, `font-weight: 900`, `letter-spacing: −0.02em` — brand voice, room to breathe
- Section `h2`: Inter 800, `letter-spacing: −0.04em` — maximum Linear feel for service/data sections

---

## Hero Section

**File:** `src/components/HeroSection.tsx`

### Overlay
Replace single `bg-black/30` div with dual-layer inline gradient:

```
Layer 1 (radial corners — frames truck, no bloom wash):
  radial-gradient(ellipse 110% 80% at 50% 35%,
    rgba(0,0,0,0.05) 0%,
    rgba(0,0,0,0.55) 75%,
    rgba(0,0,0,0.82) 100%)

Layer 2 (linear text-legibility zone from bottom):
  linear-gradient(to top,
    rgba(0,0,0,0.90) 0%,
    rgba(0,0,0,0.48) 35%,
    rgba(0,0,0,0.15) 60%,
    transparent 80%)
```

Gold bloom is handled via the radial center being near-transparent (0.05 black = ~95% of natural truck color passes through). This reads as a professional studio key light, not a color wash.

### Heading
- Add `letter-spacing: -0.02em` to `h1`
- Wrap "No Record." and "No Doubt." in `<span>` with `color: #C9A84C`

---

## Section Order (Reordered)

**File:** `src/components/SiteStateManager.tsx`

Hook before Proof — rationale: Services establishes the system's value proposition before Gallery provides the visual evidence.

```
Before: Hero → Gallery → System → Lifecycle → Documentation → Pricing → Agreement → Order
After:  Hero → System → Gallery → Lifecycle → Documentation → Pricing → Agreement → Order → HeadshotPlaceholder
```

---

## System Section — Glass Cards

**File:** `src/components/SystemSection.tsx`

### h2 heading
- `font-family: var(--font-inter)` (Inter 800, added via Tailwind `font-sans`)
- `font-weight: 800`
- `letter-spacing: -0.04em`
- `line-height: 1.08`

### Cards
Replace existing `bg-bg-surface border border-border-subtle` with:

```css
background: rgba(201,168,76,0.035)      /* gold-tinted glass base */
border: 1px solid rgba(201,168,76,0.18)
border-radius: 4px
backdrop-filter: blur(12px)
-webkit-backdrop-filter: blur(12px)
```

Top highlight line (pseudo-element via inline style trick — see implementation):
```css
::before: linear-gradient(90deg, transparent, rgba(201,168,76,0.25), transparent) height 1px
```

Hover state:
```css
background: rgba(201,168,76,0.065)
border-color: rgba(201,168,76,0.52)
transform: translateY(-2px)
box-shadow: 0 8px 32px rgba(0,0,0,0.4)
transition: all 0.25s
```

---

## Gallery Section

**File:** `src/components/GallerySection.tsx`

- Increase top padding: `py-24` → `py-32` (128px top/bottom)
- `h2` keeps Georgia serif italic (brand voice for evidence section)
- Add `letter-spacing: -0.01em` to `h2`

---

## Headshot Placeholder

**New file:** `src/components/HeadshotPlaceholder.tsx`

Circular 160×160px placeholder with gold ring, positioned after `OrderSection` in `SiteStateManager`.

```
width: 160px, height: 160px, border-radius: 50%
border: 2px solid #C9A84C
box-shadow: 0 0 0 6px rgba(201,168,76,0.08), 0 0 32px rgba(201,168,76,0.18)
background: rgba(201,168,76,0.04)
```

Name: "Arthur F. Appling Sr." — Inter 800, −0.04em
Title: "Architect · AA Capital INC dba Prime Pathwy" — mono, uppercase, gold/55%

---

## Font Loading

**File:** `src/app/layout.tsx`
Load Inter via `next/font/google`. Inject `--font-inter` CSS variable on `<html>`.

**File:** `tailwind.config.ts`
Add `sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']` to `fontFamily.extend`.

**File:** `src/app/globals.css`
Add display typography CSS custom properties.

---

## Accessibility

- Hero overlay contrast is verified: white text on `rgba(0,0,0,0.90)` background = WCAG AAA
- Glass card text: `rgba(255,255,255,0.65)` on `rgba(201,168,76,0.035)` bg — minimum AA (12px mono)
- No ARIA or landmark changes — existing structure preserved
- `backdrop-filter` is a progressive enhancement; no content is hidden without it
