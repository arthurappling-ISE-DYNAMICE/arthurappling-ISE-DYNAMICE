# Legal Infrastructure — Design Specification

**Author:** Arthur F. Appling Sr. — Lead Technical Architect
**Business:** Prime Pathwy
**Date:** 2026-04-12
**Classification:** Institutional Grade | Audit-Ready | WAT Framework
**Version:** 1.0 | Design Lock

---

## System Overview

Three standalone legal HTML pages for `Prime_Pathwy_Turnover_System/`, plus a surgical footer update to `index.html`. All pages are self-contained (no external CSS dependency), match the Matte Black + Gold aesthetic exactly, and are individually openable as standalone audit documents.

**Target directory:** `Prime_Pathwy_Turnover_System/`

**Files created:**
- `privacy.html` — CCPA Privacy Policy
- `terms.html` — Terms of Service (No Verbal Order Rule, Master Pathwy documentation)
- `accessibility.html` — ADA / WCAG 2.1 Accessibility Statement

**File modified:**
- `index.html` — footer links only (3 surgical edits, no other changes)

---

## Architecture: Approach A — Self-Contained Inline Styling

Each page is a standalone fortress:
- Tailwind CDN (`https://cdn.tailwindcss.com`)
- All styles inline — renders correctly with no external files
- Matches `index.html` exactly: background `#050505`, Courier New body, Georgia serif headings
- No build step, no bundler, flat static files

---

## Shared Page Shell (all three pages)

### Head
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Page Title] | Prime Pathwy</title>
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    /* Exact base styles from index.html */
    *, *::before, *::after { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      background: #050505;
      color: #fff;
      font-family: 'Courier New', Courier, monospace;
      margin: 0;
      line-height: 1.6;
    }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: rgba(201,168,76,.3); border-radius: 2px; }
    .gold-text {
      background: linear-gradient(135deg, #F5D98A, #C9A84C, #E2C06A);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .serif-head {
      font-family: Georgia, 'Times New Roman', serif;
      font-style: italic;
      font-weight: 900;
    }
    .eyebrow {
      font-size: 9px;
      letter-spacing: .4em;
      text-transform: uppercase;
      color: rgba(201,168,76,.5);
      display: block;
      margin-bottom: 1rem;
    }
  </style>
</head>
```

### Nav Bar
- Fixed top, `rgba(5,5,5,.92)` blur, 60px height — identical to index
- Left: `Prime Pathwy` gold Georgia italic logo — `href="index.html"`
- Right: `← Back to Site` link — 9px uppercase tracking, white, gold hover (`#FFD700`)

### Page Header Block
- Eyebrow label: e.g. `Legal · Privacy Policy` (gold, 9px uppercase)
- H1: Georgia serif italic, gold gradient, responsive size (`clamp(2rem, 5vw, 3.5rem)`)
- Byline: `Arthur F. Appling Sr. — Executive Principal` (9px, `rgba(255,255,255,.5)`)
- Effective date: `Effective: April 12, 2026`
- Thin gold-tinted divider below

### Content Body
- Max-width 860px, centered, `padding: 0 1.5rem` for mobile
- Section headings: 9px, `.4em` letter-spacing, uppercase, `rgba(201,168,76,.6)`
- Body text: `rgba(255,255,255,.75)`, 15px, line-height 1.8
- Key clause blocks: gold left-border (`border-left: 2px solid rgba(201,168,76,.4)`), `#080808` background, padded — used for No Verbal Order Rule, CCPA rights, WCAG standards
- Fully responsive — single column on mobile, padding collapses cleanly

### Footer
- Identical to `index.html` footer: brand mark, address block, copyright
- `425 Virginia St STE B · Vallejo, CA 94590`
- `(925) 308-3233 · contact@primepathwy.com`
- No circular legal links in footer (privacy/terms/ADA links omitted on legal pages)

---

## File 1: `privacy.html` — CCPA Privacy Policy

### Content Sections

**Section 1 — Information We Collect**
Name, address, phone, email, property address, service scope, payment data. No biometric or sensitive personal data collected.

**Section 2 — How We Use Your Information**
Scheduling, invoicing, service documentation, Sovereign Audit records, regulatory compliance. Data is never sold to third parties.

**Section 3 — Sovereign Audit Logic** *(key clause block with gold border)*
All job records, before/after photo documentation, and signed work orders are retained as part of Prime Pathwy's institutional audit trail. Clients consent to this documentation by engaging services. Records support operational integrity and legal defensibility.

**Section 4 — Your California Rights (CCPA)**
Key clause block listing: right to know, right to delete, right to opt-out of sale (we do not sell data), right to non-discrimination. 45-day response window. Submit requests in writing to Arthur F. Appling Sr.

**Section 5 — Data Retention**
Records retained minimum 3 years per operational doctrine. Destruction upon written request subject to legal hold review.

**Section 6 — Contact for Privacy Requests**
Arthur F. Appling Sr., Executive Principal
425 Virginia St STE B, Vallejo, CA 94590
contact@primepathwy.com *(placeholder — update to operations@primepathwy.com when Namecheap email is live)*

---

## File 2: `terms.html` — Terms of Service

### Content Sections

**Section 1 — Scope of Services**
Property turnover, cleaning, haul-out, paint, full turnovers. NAICS 561720 (Janitorial) / 562111 (Hauling). Services performed in Vallejo, CA and surrounding jurisdictions.

**Section 2 — The No Verbal Order Rule** *(key clause block — gold border, high emphasis)*
> *"Prime Pathwy does not accept verbal work orders. All service requests must be submitted in writing via signed work order, email confirmation, or the Prime Pathwy intake form. Verbal instructions carry no operational authority and will not be honored."*

**Section 3 — Master Pathwy Documentation Requirements**
All work is documented per Master Pathwy SOP: written scope, before/after photo record, completion sign-off. Client acknowledges these records are institutional property of Prime Pathwy and serve as the authoritative record of services rendered.

**Section 4 — Payment Terms**
Payment due upon completion. Accepted: check, ACH, card. Overdue invoices (15+ days) accrue 1.5% monthly service charge. Disputes must be submitted in writing within 5 business days of invoice date.

**Section 5 — Cancellation & Rescheduling**
24-hour written notice required for cancellation or reschedule. Same-day cancellation billed at 50% of quoted scope. No-shows billed at 100%.

**Section 6 — Limitation of Liability**
Prime Pathwy liability capped at the value of the individual service contract. No consequential, incidental, or punitive damages.

**Section 7 — Governing Law**
State of California. Venue: Solano County Superior Court.

**Section 8 — Contact**
Arthur F. Appling Sr., Executive Principal
425 Virginia St STE B, Vallejo, CA 94590
contact@primepathwy.com

---

## File 3: `accessibility.html` — ADA / WCAG 2.1 Accessibility Statement

### Content Sections

**Section 1 — Our Commitment**
Prime Pathwy is committed to digital accessibility for all users, including those with visual, auditory, motor, and cognitive disabilities. This site is designed and maintained to meet WCAG 2.1 Level AA standards.

**Section 2 — Standards Targeted** *(key clause block)*
WCAG 2.1 Level AA — four principles:
- **Perceivable:** Content is presentable to all users
- **Operable:** All interface components are keyboard-navigable
- **Understandable:** Content is readable and predictable
- **Robust:** Compatible with current and future assistive technologies

**Section 3 — Measures Taken**
- High-contrast color ratios: Matte Black `#050505` + Gold `#F5D98A` exceeds WCAG 4.5:1 minimum
- Keyboard-navigable structure throughout
- ARIA labels on all interactive elements (buttons, links, inputs)
- Semantic HTML: proper heading hierarchy, landmark elements
- No auto-playing media or flashing content
- Responsive layout supports screen magnification up to 400%
- Alt-text on all meaningful images

**Section 4 — Known Limitations**
Before/after photo gallery is visual content. Alt-text descriptions of property conditions available upon written request. We are actively working to expand non-visual descriptions.

**Section 5 — Feedback & Support**
Users who encounter accessibility barriers are encouraged to contact us directly. We commit to a 5-business-day response and will provide an accessible alternative upon request.

**Section 6 — Contact**
Arthur F. Appling Sr., Executive Principal
425 Virginia St STE B, Vallejo, CA 94590
contact@primepathwy.com *(update to operations@primepathwy.com when Namecheap email is live)*

---

## `index.html` — Surgical Footer Update (3 changes only)

### Change 1 — Privacy Policy link
```html
<!-- BEFORE -->
<a href="#"
   onclick="alert('Privacy Policy — Document in progress...'); return false;"
   ...>Privacy Policy</a>

<!-- AFTER -->
<a href="privacy.html"
   aria-label="Privacy Policy"
   ...>Privacy Policy</a>
```
Remove `onclick` alert. Change `href="#"` to `href="privacy.html"`. Retain all inline styles.

### Change 2 — Terms of Service link
```html
<!-- BEFORE -->
<a href="#"
   onclick="alert('Terms of Service — Document in progress...'); return false;"
   ...>Terms of Service</a>

<!-- AFTER -->
<a href="terms.html"
   aria-label="Terms of Service"
   ...>Terms of Service</a>
```
Remove `onclick` alert. Change `href="#"` to `href="terms.html"`. Retain all inline styles.

### Change 3 — ADA Compliant Design button
```html
<!-- BEFORE -->
<button
  aria-label="Accessibility information — ADA Compliant Design"
  onclick="alert('Accessibility Statement\n\n...');"
  ...>ADA Compliant Design</button>

<!-- AFTER -->
<button
  aria-label="Accessibility information — ADA Compliant Design"
  title="View Accessibility Statement"
  onclick="window.location.href='accessibility.html'"
  ...>ADA Compliant Design</button>
```
Remove alert `onclick`. Add `title` attribute. Add `onclick="window.location.href='accessibility.html'"`. Retain wheelchair icon SVG, all inline styles, hover effects.

**No other changes to `index.html`.** Hero section, 7-step layout, pricing, gallery — untouched.

---

## Constraints

- **Email placeholder:** `contact@primepathwy.com` used throughout. Update to `operations@primepathwy.com` when Namecheap email is provisioned — applies to privacy.html Section 6 and accessibility.html Section 6.
- **No server required:** All `href` values are relative paths. Pages open directly from filesystem.
- **Mobile responsive:** All pages use `padding: 0 1.5rem`, fluid typography via `clamp()`, single-column layout — readable on phone and tablet.

---

## Success Criteria

- `privacy.html`, `terms.html`, `accessibility.html` exist in `Prime_Pathwy_Turnover_System/`
- Each page renders Matte Black + Gold aesthetic identically to `index.html` without any external CSS file
- `← Back to Site` nav link returns to `index.html`, gold hover effect active
- `Arthur F. Appling Sr. — Executive Principal` byline in every page header
- CCPA rights block present in privacy.html Section 4
- No Verbal Order Rule gold-border callout present in terms.html Section 2
- WCAG 2.1 Level AA cited explicitly in accessibility.html Section 2
- `index.html` footer: all three links point to real pages, onclick alerts removed
- ADA button retains wheelchair icon SVG, gains `title="View Accessibility Statement"`
- Zero changes to `index.html` outside the footer legal links block

---

*Prime Pathwy — Sovereign Systems for Operators Who Are Done With Chaos.*
*Arthur F. Appling Sr. | Lead Technical Architect*
