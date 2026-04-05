# Prime Pathwy — Sovereign System Landing Page Design Spec
**Date:** 2026-04-04  
**Owner:** Arthur F. Appling Sr., Lead Technical Architect  
**Business:** Prime Pathwy Property Turnover (strict spelling — no 'a' or 'x' in Pathwy)  
**Status:** Approved for Implementation

---

## 1. Purpose & Conversion Goal

A single-page hybrid marketing + order site for Prime Pathwy Property Turnover. The page builds institutional authority in the upper sections, then converts visitors into paying clients through an embedded Stripe order form at the bottom. Both individual landlords (1–5 units) and property management companies (10+ units) are the target audience. The page must communicate that Prime Pathwy is a **systemized, documented, defensible** operation — not a commodity cleaning service.

**Primary conversion action:** Complete the embedded Stripe order form (Section 06).  
**Secondary action:** Scroll through all authority sections before ordering.

---

## 2. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js (App Router) | SSR for SEO, component-based for the form flow |
| Styling | Tailwind CSS | Utility-first, fast to build Matte Black/Gold theme |
| Payment | Stripe Embedded Elements | Hosted UI inside the page, handles receipts + dispute evidence |
| Deployment | Vercel | Zero-config Next.js hosting |
| Language | TypeScript | Type safety for the form state and Stripe integration |

---

## 3. Aesthetic System

### Colors
| Token | Hex | Usage |
|---|---|---|
| `--bg-base` | `#0A0A0A` | Page background |
| `--bg-surface` | `#0D0D0D` | Card/section backgrounds |
| `--bg-elevated` | `#111111` | Hover states, elevated cards |
| `--gold` | `#C9A84C` | Primary accent — headlines, borders, CTAs |
| `--gold-dim` | `#C9A84C66` | Subdued gold — dividers, eyebrows |
| `--gold-faint` | `#C9A84C22` | Very subtle gold — card borders |
| `--text-primary` | `#F0ECE0` | Main headings |
| `--text-secondary` | `#888888` | Body copy |
| `--text-muted` | `#555555` | Captions, footnotes |

### Typography
| Role | Font | Weight | Style |
|---|---|---|---|
| Display headings | Georgia (serif) | Regular | Italic allowed for emphasis |
| Section eyebrows | Courier New (monospace) | Regular | Uppercase, wide letter-spacing |
| Body / labels | Courier New (monospace) | Regular | Normal case |
| CTA buttons | Courier New (monospace) | Regular | Uppercase, tracked |

### Rules
- No gradients. No shadows. No neon.
- Gold is used sparingly — accent, not fill.
- All borders are `1px solid` — either gold-dim or near-invisible dark.
- Hover states: border brightens toward `--gold`. Background lifts to `--bg-elevated`.

---

## 4. Page Structure

### NAV — Sticky Navigation Bar
- Slim bar (56px height). Matte black background. Gold bottom border `1px`.
- Left: Medallion logo image + "PRIME PATHWY" wordmark in Georgia serif, gold.
- Right: Anchor links → `#system`, `#lifecycle`, `#documentation`, `#pricing`, `#order` + gold-bordered "Place Order" CTA button.
- Behavior: Sticky on scroll. No hamburger — single-page, all links are anchors.

---

### Section 00 — Hero (Full Viewport)
**Purpose:** Establish identity and drive scroll-to-order.

**Layout:**
- Full viewport height, centered content stack.
- Medallion logo image (200px diameter) centered at top.
- Eyebrow: `PRIME PATHWY PROPERTY TURNOVER` — monospace, gold-dim, wide tracking.
- Headline (Georgia serif, 48px desktop / 32px mobile):
  > *Your Last Turnover Vendor Left No Record.*  
  > *We Leave No Doubt.*
- Subheadline (monospace, 14px, muted):  
  > "Every order is timestamped, photographed, verified, and archived. This is not a cleaning service. This is a system."
- Single CTA button: `[ PLACE YOUR ORDER → ]` — gold border, gold text, monospace uppercase. Anchors to `#order`.
- No background image. No video. Pure matte black.

---

### Section 01 — The System (`#system`)
**Purpose:** Differentiate Prime Pathwy from commodity vendors before any pricing appears.

**Layout:** Dark card grid — eyebrow + headline, then 3 cards below.

**Eyebrow:** `SECTION 01 — THE SYSTEM`  
**Headline:** *"What You're Hiring Is a System, Not a Crew"*

**3 Cards:**
| Card | Label | Body |
|---|---|---|
| 1 | Scope Locked Before Work Begins | No verbal approvals. Scope is defined by the order record and cannot change without a written change order. |
| 2 | Every Job Documented | Before, during, and after photos. Receipts. Timestamps. Archived 18–24 months minimum. |
| 3 | Chargeback-Defensible by Design | Order record, agreement acceptance log, photo set, and payment receipt — all on file before work begins. |

**Card style:** Dark surface `#0D0D0D`, border `1px solid #1E1E1E`, gold label, monospace body.

---

### Section 02 — The Execution Lifecycle (`#lifecycle`)
**Purpose:** Show the 7-step process. Build trust through operational transparency.

**Eyebrow:** `SECTION 02 — EXECUTION LIFECYCLE`  
**Headline:** *"7 Steps. No Surprises."*

**Layout:** Horizontal numbered timeline (wraps to vertical on mobile).

| Step | Label | Note |
|---|---|---|
| 01 | Select Services | Property type + unit size |
| 02 | Review Pricing | Labor shown; disposal billed separately |
| 03 | Accept Agreements | Click-wrap — scope, payment, verification |
| 04 | Submit Payment | Captured and timestamped |
| 05 | Verification Gate | **Identity + authority verified before scheduling (projects $1,000+)** |
| 06 | Work Performed | Before/during/after photos taken |
| 07 | Completion & Archive | Photos delivered, records archived |

Step 05 is visually emphasized — gold border, slightly larger, bold label — because the verification gate is a key trust and chargeback-defense signal.

---

### Section 03 — Documentation Standard (`#documentation`)
**Purpose:** Turn the tagline into a design moment. Reinforce legal defensibility.

**Layout:** Full-width dark section. Large centered pull-quote, then 3 cards below.

**Pull-quote (Georgia serif, 36px desktop):**
> *"If it is not documented, it did not occur."*

**Subtext (monospace, muted):** *— Prime Pathwy Operating Standard, Section 5*

**3 Documentation Pillars (same card style as Section 01):**
| Card | Label | Body |
|---|---|---|
| 1 | Before Photos | Comprehensive room-by-room photos before any work begins. |
| 2 | Milestone Photos | After cleanout, kitchen/bath, floors, and final sweep. |
| 3 | Completion Archive | Full photo set delivered. Records stored 18–24 months minimum. |

---

### Section 04 — Pricing (`#pricing`)
**Purpose:** State pricing clearly after authority is established. No sticker shock — the system justifies the rate.

**Eyebrow:** `SECTION 04 — PRICING & SCOPE`  
**Headline:** *"Labor Pricing — Clear, Fixed, Locked at Order"*

**Two pricing tables side by side (stacked on mobile):**

**Apartment Units (Labor Only)**
| Unit Type | Price Range |
|---|---|
| Studio / 1 Bedroom | $1,200 – $1,600 |
| 2 Bedroom | $1,500 – $2,000 |
| 3 Bedroom | $1,800 – $2,400 |

**Single-Family Homes (Labor Only)**
| Home Size | Price Range |
|---|---|
| 2 Bedroom | $1,600 – $2,100 |
| 3 Bedroom | $1,900 – $2,600 |
| 4 Bedroom | $2,300 – $3,000 |
| Each Additional Bedroom | +$200 |

**Footnotes (monospace, muted):**
- Disposal and landfill fees billed separately at cost with receipts.
- Standard timeline: 2–3 business days (estimate).
- Extreme conditions (biohazard, hoarding) require separate written quote.
- Licensed trade work is not included.

---

### Section 05 — The Agreement (`#agreement`)
**Purpose:** State the terms plainly before the order form. Transparency as authority — no surprises at checkout.

**Eyebrow:** `SECTION 05 — THE AGREEMENT`  
**Headline:** *"What You're Accepting When You Place an Order"*

**4 plain-language items (left-aligned, gold bullet):**
1. **Scope is locked to your order summary.** Changes require a written change order approved before work continues.
2. **Payment is captured in full at booking.** Because services involve irreversible labor, payments are non-refundable once scheduled or commenced.
3. **Projects of $1,000 or more require identity and authority verification** before scheduling is confirmed.
4. **You confirm legal authority** to approve services and authorize disposal of abandoned contents at the property address provided.

**Closing line (monospace, gold-dim):**
> *"By completing checkout, you enter into a binding electronic agreement. The website order record is the system of record."*

---

### Section 06 — Place Your Order (`#order`)
**Purpose:** The conversion engine. Embedded Stripe order form, 5-step flow.

**Eyebrow:** `SECTION 06 — PLACE YOUR ORDER`  
**Headline:** *"System of Record — Order Entry"*

**Form flow (step-by-step, single page — no page reload):**

| Step | Field | Logic |
|---|---|---|
| 1 | Property Type | Radio: Apartment Unit / Single-Family Home |
| 2 | Unit Size | Dropdown based on Step 1 selection. Auto-populates price range. |
| 3 | Add-Ons | Disposal/haul-out (billed at cost — noted). Extreme condition flag (triggers manual quote flow). |
| 4 | Service Details | Address, preferred service date, access method (keys / lockbox / codes). |
| 5 | Agreement + Payment | Checkbox: "I have read and accept the Prime Pathwy Service Agreement." → Stripe Embedded Elements payment form. |

**Post-submit behavior:**
- Stripe payment captured.
- Confirmation page/modal: order summary + timestamp + "Verification will be initiated within 1 business day for orders $1,000+" message.
- Confirmation email sent via Stripe (or future: Resend/SendGrid).

**Verification gate trigger:** Orders where unit size price floor ≥ $1,000 (all orders) — verification gate fires for all standard orders. Flag is always on by default per pricing structure.

---

### Footer
- Black background, gold top border `1px`.
- Left: Medallion logo (small) + "© 2026 Prime Pathwy. All rights reserved."
- Center: *"This operating structure ensures alignment, defensibility, audit readiness, and scalability."*
- Right: Contact info (email placeholder).

---

## 5. Routing & File Structure

```
Prime_Pathwy_Website/
  src/
    app/
      layout.tsx          # Root layout — fonts, metadata, global styles
      page.tsx            # Main landing page (all sections)
      globals.css         # Tailwind base + CSS custom properties
    components/
      Nav.tsx             # Sticky navigation
      HeroSection.tsx     # Section 00
      SystemSection.tsx   # Section 01
      LifecycleSection.tsx # Section 02
      DocumentationSection.tsx # Section 03
      PricingSection.tsx  # Section 04
      AgreementSection.tsx # Section 05
      OrderSection.tsx    # Section 06 — Stripe form
      Footer.tsx
    lib/
      stripe.ts           # Stripe client initialization
    types/
      order.ts            # Order form state types
  public/
    logo.png              # Medallion seal logo
  tailwind.config.ts
  next.config.ts
  .env.local              # STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY
```

---

## 6. Stripe Integration Approach

- Use **Stripe Payment Intents** with **Stripe Elements** (embedded UI).
- Price is calculated client-side based on form selections (min of range shown; exact quote confirmed separately for edge cases).
- A Next.js **API route** (`/api/create-payment-intent`) creates the Payment Intent server-side with the correct amount.
- On payment success, Stripe fires a webhook to `/api/stripe-webhook` — logs the order and triggers the confirmation email.
- No customer PII stored server-side beyond what Stripe captures.

---

## 7. Non-Goals (Out of Scope for v1)

- No admin dashboard or job management backend.
- No customer portal or order history.
- No SMS notifications.
- No multi-page routing — single page only.
- No authentication — order form is public.

---

## 8. Success Criteria

- Page loads in < 2s on desktop (Vercel CDN).
- All 6 content sections render correctly on mobile (375px) and desktop (1280px).
- Stripe payment flow completes end-to-end in test mode.
- Verification gate confirmation message appears for all orders.
- "If it is not documented, it did not occur." pull-quote is visually dominant in Section 03.
