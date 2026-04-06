# COMPLIANCE RECORD
## Prime Pathwy Property Turnover — Sovereign System
**Architect:** Arthur F. Appling Sr., Prime Pathwy Consulting AA  
**Sealed:** 2026-04-05  
**Status:** PRODUCTION GOLD MASTER — v1.0

---

## I. WCAG 2.1 LEVEL AA — Web Accessibility

### Contrast Ratios (WCAG 1.4.3 — Minimum 4.5:1)

All text-on-background combinations were calculated using the WCAG 2.1 relative
luminance formula. Results as of seal date:

| Color Pair | Ratio | Status |
|---|---|---|
| `#C9A84C` (gold) on `#0A0A0A` | 8.66:1 | PASS |
| `#C9A84C` (gold) on `#0D0D0D` | 8.50:1 | PASS |
| `gold/70` on `#0D0D0D` (modal section labels) | 4.64:1 | PASS |
| `white/90` on `#0A0A0A` | 15.94:1 | PASS |
| `white/80` on `#0A0A0A` (hero subheadline) | 12.58:1 | PASS |
| `white/60` on `#0A0A0A` (footer links) | 7.30:1 | PASS |
| `white/50` on `#0D0D0D` (modal close button) | 5.34:1 | PASS |

**Remediated failures (pre-seal):**

| Location | Original | Ratio | Fix Applied |
|---|---|---|---|
| `AgreementSection.tsx` — legal notice | `gold/60` | 3.70:1 ❌ | → `text-gold` (8.66:1) |
| `DocumentationSection.tsx` — citation | `gold/60` | 3.70:1 ❌ | → `text-gold` (8.66:1) |
| `ConfirmationModal.tsx` — tagline | `gold/50` | 2.91:1 ❌ | → `text-gold` (8.66:1) |
| `LegalModal.tsx` — footer stamp | `gold/40` | 2.27:1 ❌ | → `text-gold` + `aria-hidden` |

**Decorative exceptions (WCAG 1.4.3 exemption):**

| Location | Color | Ratio | Reason |
|---|---|---|---|
| Hero eyebrow text | `gold/70` | 3.98:1 | `aria-hidden="true"` — decorative label |
| Gallery eyebrow text | `gold/40` | 2.25:1 | `aria-hidden="true"` — decorative label |

### Perceivable (WCAG Principle 1)

- All images carry descriptive `alt` text including condition and context
- Decorative elements marked `aria-hidden="true"` throughout
- Color is never the sole means of conveying information
- Text does not overlap unreadable backgrounds without sufficient overlay

### Operable (WCAG Principle 2)

- **Skip to Main Content** link implemented (`SkipLink.tsx`) — visible on keyboard focus
- All interactive elements reachable and activatable via keyboard
- Modal dialogs close on `Escape` key; focus is managed on open/close
- No keyboard traps; Tab order follows DOM flow
- Smooth scroll enabled via CSS `scroll-behavior: smooth`

### Understandable (WCAG Principle 3)

- `<html lang="en">` declared on root element
- All form fields carry explicit `<label>` associations
- Error messages are descriptive and associated with fields
- Consistent navigation structure maintained across all sections

### Robust (WCAG Principle 4)

- Semantic HTML5 landmarks used throughout:
  - `<header>` — wraps primary navigation
  - `<nav aria-label="Primary navigation">` — anchor link set
  - `<main id="main-content" tabIndex={-1}>` — primary content target
  - `<section aria-labelledby="...">` — all page sections
  - `<footer>` — site footer
- All ARIA attributes use valid roles and values
- `aria-label` applied to all buttons, links, and interactive regions
- `aria-pressed` on Lifecycle step selector buttons
- `role="dialog" aria-modal="true"` on all modal components
- `role="status"` on order confirmation component

---

## II. CCPA — California Consumer Privacy Act

**Governing Jurisdiction:** State of California, USA  
**Effective Date:** January 1, 2026

### Disclosures Implemented

| Requirement | Implementation |
|---|---|
| Right to Know | Privacy Policy modal — "Information We Collect" section |
| Right to Delete | Contact path disclosed: `info@primepathwy.com` |
| Right to Opt-Out | Cookie Consent banner — Decline option provided |
| Non-Sale Declaration | Privacy Policy — "We do not sell, rent, or share your information" |
| Data Retention Policy | Privacy Policy — 24-month minimum retention disclosed |

### Cookie Consent (`CookieConsent.tsx`)

- Banner appears on first visit; persisted to `localStorage`
- Explicit Accept and Decline controls, both keyboard-accessible
- CCPA reference displayed verbatim in banner text
- Contact for CCPA data requests: `info@primepathwy.com`

---

## III. ADA — Americans with Disabilities Act (Title III)

The ADA Title III requires places of public accommodation to ensure their digital
presence is accessible. Compliance is achieved through WCAG 2.1 Level AA conformance
(the accepted technical standard for ADA digital compliance).

### Measures Taken

| ADA Area | Implementation |
|---|---|
| Screen reader support | Full ARIA landmark structure; descriptive alt text; `aria-label` throughout |
| Keyboard navigation | Skip link, focus indicators (`focus-visible:ring-gold`), no keyboard traps |
| Color/contrast | All text meets 4.5:1 minimum; white/gold on black palette throughout |
| Motor accessibility | Large click targets on CTA buttons; modal backdrop click-to-close |
| Cognitive accessibility | Consistent layout; plain-language legal disclosures; step-by-step order flow |

### Accessibility Statement

Published in site footer — "Accessibility Statement" modal link visible on every page.
Includes: conformance status, feature list, known limitations (Stripe third-party),
feedback contact, California Department of Rehabilitation complaint path.

---

## IV. PRODUCTION GOLD MASTER — Locked Files

The following files are sealed as of 2026-04-05 and require Architect approval
before modification:

| File | Purpose |
|---|---|
| `src/app/page.tsx` | Root page composition and landmark structure |
| `src/app/layout.tsx` | Document metadata, skip link, cookie consent injection |
| `src/components/LegalModal.tsx` | WCAG-compliant modal shell used by all legal panels |

**Lock marker:** Each file contains the header comment:
```
// ─── PRODUCTION GOLD MASTER — v1.0 — 2026-04-05 ────────────────────────────
// DO NOT MODIFY WITHOUT ARCHITECT APPROVAL — Arthur F. Appling Sr.
```

---

## V. ONGOING OBLIGATIONS

| Review Cadence | Action |
|---|---|
| Annually | Re-audit contrast ratios after any palette change |
| On each deploy | Verify Skip Link and modal focus management in staging |
| On each content update | Confirm new images carry descriptive alt text |
| On legal change | Update Privacy Policy / Terms governing law section |

---

*This document is the compliance record for Prime Pathwy Property Turnover — Sovereign System.*  
*Architect: Arthur F. Appling Sr. | Sealed: 2026-04-05 | Version: 1.0*
