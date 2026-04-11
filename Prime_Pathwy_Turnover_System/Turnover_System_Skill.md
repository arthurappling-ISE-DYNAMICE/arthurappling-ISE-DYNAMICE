---
name: Turnover_System_Skill
description: Automates the generation of NEPQ-aligned service sections and sales copy for the Prime Pathwy Property Turnover System website. Triggers on any request to build, update, or generate turnover service sections, pricing blocks, or sales copy for Prime Pathwy's property turnover business.
type: skill
triggers:
  - "generate turnover"
  - "build turnover site"
  - "update service section"
  - "add service card"
  - "turnover system skill"
  - "NEPQ copy"
  - "turnover index.html"
---

# Turnover_System_Skill — Prime Pathwy Property Turnover

## Identity & Mission

This skill governs all content generation for the **Prime Pathwy Property Turnover System** website located at:

```
C:/Users/arthu/GeminiEcosystem/Prime_Pathwy_Turnover_System/index.html
```

**Business:** Prime Pathwy — Property Turnover Services
**Target clients:** Landlords, real estate investors, property managers
**Core services:** Full Turnovers, Clean-Outs, Haul-Out / Debris Removal, Interior Paint
**Hero asset:** `ferrari_asset_v1.jpg` (commercial dump truck)
**Brand:** Institutional Grade · Matte Black & Gold · Documented · Defensible

---

## Brand Standards

### Color Palette
- Background primary: `#050505`
- Background secondary: `#0A0A0A`
- Background card: `#0D0D0D`
- Border subtle: `rgba(255,255,255,0.05)`
- Border gold: `rgba(201,168,76,0.3)`
- Gold primary: `#C9A84C`
- Gold light: `#E2C06A`
- Gold bright: `#F5D98A`
- Gold gradient: `linear-gradient(135deg, #F5D98A, #C9A84C, #E2C06A)`
- **Text body: `#FFFFFF` (Pure White — LOCKED)**
- **Text decorative/fine-print: `rgba(255,255,255,0.75)` minimum**
- ~~Text muted: `rgba(255,255,255,0.45)`~~ — RETIRED. Never use below `.75` for any visible text.
- ~~Text body: `rgba(255,255,255,0.65)`~~ — RETIRED. All body text is now `#FFFFFF`.

### Visibility Standards (Locked — Institutional Grade)
**RULE: ZERO gray text. If it's not Gold, it must be Pure White.**
- Body paragraphs: `font-size: 1.125rem; color: #FFFFFF` (18px minimum)
- List items / scope items: `font-size: 1rem; color: #FFFFFF` (16px minimum)
- Service NEPQ hooks: `font-size: 1.125rem; color: #FFD700` (gold accent, high-impact)
- Before/After photo labels: `font-size: 14px; font-weight: 800; letter-spacing: .28em`
  - Before label: `color: #FFFFFF; border: 1px solid rgba(255,255,255,.35); background: rgba(0,0,0,.72)`
  - After label: `color: #FFD700; border: 1px solid rgba(255,215,0,.55); text-shadow: 0 0 20px rgba(255,215,0,.4)`
- Eyebrows / decorative caps: `font-size: 9–10px` — **minimum opacity `.75`** (never `.2`–`.4`)
- Price labels: `color: #FFFFFF`
- Price notes: `color: #FFFFFF`
- Calc labels: `color: #FFFFFF`
- Drag hint bars: `color: rgba(255,255,255,.75)` minimum

### Typography
- Headings: `font-family: Georgia, serif; font-style: italic; font-weight: 900`
- Body/labels: `font-family: 'Courier New', monospace`
- Eyebrows: `font-size: 9–10px; letter-spacing: 0.4em; text-transform: uppercase`
- Hero headline: `clamp(40px, 7vw, 80px)`
- Hero subtext: `font-size: clamp(18px, 2vw, 20px)` (never below 18px)

### UI Rules
- Cards: `background: #0D0D0D; border: 1px solid rgba(255,255,255,0.06); border-radius: 0` (sharp corners for institutional feel)
- Gold glow on hover: `box-shadow: 0 0 24px rgba(201,168,76,0.4)`
- No rounded corners on service cards or pricing rows — sharp, institutional
- Scrollbar: `width: 4px; background: rgba(201,168,76,0.3)`

### Mobile Responsive Rules (375px safe)
- Add class `stack-on-mobile` to all `1fr 1fr` two-column grids (Problem, Solution sections)
- Add class `pricing-grid-wrap` to pricing table outer grid
- Media query override: `.stack-on-mobile { grid-template-columns: 1fr !important; gap: 2.5rem !important; }`
- Media query override: `.pricing-grid-wrap { grid-template-columns: 1fr !important; }`
- Always hide `.price-note` on mobile (`display: none`)
- `.nav-links` hidden on mobile — nav logo only

---

## NEPQ Sequence Architecture

Every page and section follows this sequence. **Do not reorder.**

### Phase 1 — Problem Awareness
**Goal:** Surface the pain the client already feels but hasn't named.
**Rules:**
- Lead with a question or observation about their current reality
- Reference vacancy cost, unreliable vendors, or lack of documentation
- Never mention Prime Pathwy in Phase 1 — this phase is about THEM
- Tone: calm, diagnostic, not alarmist

**Formula:** `"[Observation about their broken situation]. [Consequence they're already living with]."`

**Example copy:**
> "Your vacancy clock starts the day the tenant leaves. Every day your unit sits un-turned is revenue walking out the door — and most turnover vendors don't treat your timeline like money."

---

### Phase 2 — Solution Awareness
**Goal:** Acknowledge what they've tried, expose why it didn't work, introduce the alternative.
**Rules:**
- Reference the patchwork approach (handymen, cleaning crews, multiple vendors)
- Name the gap: no documentation, no fixed scope, no accountability
- Introduce Prime Pathwy as the structured alternative — NOT as a pitch, as a contrast
- Tone: matter-of-fact, authoritative

**Formula:** `"You've probably tried [inferior alternative]. The problem is [specific gap]. [Our approach] fixes that by [specific mechanism]."`

**Example copy:**
> "General cleaning crews aren't equipped for eviction clean-outs. Handymen don't carry dump trailers. And stitching together three vendors means three sets of excuses when something goes wrong. Prime Pathwy handles the full scope — clean, haul, paint — under one written agreement, with before-and-after documentation on every job."

---

### Phase 3 — Consequence
**Goal:** Quantify the cost of inaction. Make staying the same feel expensive.
**Rules:**
- Use real numbers (vacancy cost calculation)
- Reference chargeback exposure and lack of documentation
- Keep it brief — 2–3 sentences max
- Tone: financial, not emotional

**Formula:** `"[Metric of current loss]. [What changes with the right system]."`

**Example copy:**
> "A 10-day vacancy on a $1,400/month unit costs $467 in lost rent — before you factor in callbacks, rework, or a vendor dispute you can't defend. A 2–3 day professional turnover costs $93 in vacancy. The difference is the crew."

---

### Phase 4 — Commitment
**Goal:** Lower friction to action. Make the next step feel small and safe.
**Rules:**
- CTA is always: Schedule Walkthrough → Get Fixed Written Quote → Approve → Done
- Reinforce: no verbal agreements, no surprise charges, documented handoff
- Pricing shown clearly — no "call for pricing" opacity
- Tone: direct, confident, no pressure language

**Formula:** `"[Simple next step]. [Risk reversal]. [Proof of system]."`

**Example copy:**
> "Schedule a walkthrough. We assess the unit and return a fixed written quote — no verbal estimates, no scope creep. Approve it, and we deliver in 2–3 business days with a full photo record from start to finish."

---

## Service Section Templates

### Service Card Template (HTML)
```html
<div class="service-card">
  <div class="service-eyebrow">SVC — 0X · [SERVICE CODE]</div>
  <h3 class="service-name">[SERVICE NAME]</h3>
  <p class="service-nepq">[NEPQ PROBLEM HOOK — 1 sentence]</p>
  <ul class="service-scope">
    <li>[Scope item 1]</li>
    <li>[Scope item 2]</li>
    <li>[Scope item 3]</li>
  </ul>
  <div class="service-price">[PRICE RANGE or "Quote After Walkthrough"]</div>
  <a href="#book" class="service-cta">Schedule Walkthrough →</a>
</div>
```

### Pricing Row Template (HTML)
```html
<div class="price-row">
  <span class="price-label">[Unit Type / Size]</span>
  <span class="price-range">[$ Low – $ High]</span>
  <span class="price-note">[Labor only / +disposal at cost]</span>
</div>
```

---

## Canonical Pricing Data (2026)

### Full Turnover — Apartment Units (Labor Only)
| Unit Type         | Price Range       |
|-------------------|-------------------|
| Studio / 1 BR     | $1,200 – $1,600   |
| 2 Bedroom         | $1,500 – $2,000   |
| 3 Bedroom         | $1,800 – $2,400   |

### Full Turnover — Single-Family Homes (Labor Only)
| Home Size         | Price Range       |
|-------------------|-------------------|
| 2 Bedroom Home    | $1,600 – $2,100   |
| 3 Bedroom Home    | $1,900 – $2,600   |
| 4 Bedroom Home    | $2,300 – $3,000   |
| Each Add'l BR     | +$200             |

### Scope Notes
- Pricing = **labor only**
- Disposal / landfill fees billed separately at cost with receipts
- Extreme conditions (biohazard, hoarding) = separate written quote
- Licensed trade work not included

### Add-On Services
- Dump & haul-away (disposal billed at cost)
- Appliance removal
- Odor treatment & sanitation
- Additional paint or repair work

---

## Process Sequence (The 4 Steps)
Use this in the "How It Works" section:
1. **Walkthrough** — On-site assessment of unit condition and scope
2. **Fixed Quote** — Written quote returned. No verbal estimates.
3. **Execution** — Clean, haul, paint. Before/during/after photos mandatory.
4. **Handover** — Move-in ready delivery with full photo documentation.

---

## Page Section Order (Required)

When generating `index.html`, sections MUST appear in this order:

1. **HERO** — Ferrari truck full-bleed, headline, NEPQ problem hook subhead, CTA button
2. **PROBLEM AWARENESS** — Standalone section, no service mention, pure problem copy
3. **SERVICES** — 4 service cards (Full Turnover, Clean-Out, Haul-Out, Paint)
4. **SOLUTION AWARENESS** — "Why Prime Pathwy" contrast section
5. **HOW IT WORKS** — 4-step process
6. **PRICING** — Full pricing table (apartments + homes + add-ons)
7. **CONSEQUENCE** — Vacancy cost calculation block
8. **COMMITMENT / CTA** — Book walkthrough, contact info, system declaration

---

## Generation Instructions

When this skill is invoked to generate or update `index.html`:

1. **Read** canonical pricing from the table above — do not invent prices
2. **Follow** the NEPQ section order exactly
3. **Apply** brand standards (matte black, gold, monospace/serif mix)
4. **Use** `ferrari_asset_v1.jpg` as the hero background — it must be full-bleed
5. **Include** the 4-step process in the How It Works section
6. **Never** use rounded corners on service cards or pricing rows
7. **Never** use "call for pricing" — all prices must be shown
8. **Always** include the scope note: "Labor only · Disposal billed at cost"
9. **Contact:** `pathwyservices@primepathwy.com` · `www.primepathwy.com`
10. **Output:** Pure HTML + inline CSS + Tailwind CDN — no build step required

---

## Example: Full Invocation

**User says:** "Generate the turnover system index.html"

**Skill response:**
- Creates `Prime_Pathwy_Turnover_System/index.html`
- Follows NEPQ section order
- Uses all canonical pricing
- Ferrari truck as hero (full-bleed, bottom-anchored text overlay)
- Matte black/gold throughout
- Mobile responsive via Tailwind CDN
- Includes booking CTA pointing to `pathwyservices@primepathwy.com`
