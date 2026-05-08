# Design: Consulting Wing — 5-Section Manifesto Refactor

**Date:** 2026-05-07  
**Target:** `tools/consulting_wing/public/index.html`  
**Approach:** C — Preserve hero animation mechanics, rebuild all copy below the fold using Manifesto Logic.  
**Author:** Arthur F. Appling Sr. · AA Capital INC / Prime Pathwy

---

## Constraints

- Words "cost" and "price" must not appear anywhere on the page.
- Dominant vocabulary: Value, Impact, Sovereignty, Transformation.
- All copy is Outcome-Led — no feature descriptions, no how-to language.
- Matte Black (`#080808`) and Gold (`#B8952A` / `#C9A84C`) are the only visual tokens.
- Zero AI attribution. Authorship: Arthur F. Appling Sr.

---

## Section 01 — Sovereign Hero

**What stays:** `#hero-bg` div with breathe + gold-glow CSS animations. All CSS variables and keyframes unchanged.

**What is added to the HTML:**

- `#hero-top` div (already styled in CSS, currently absent from HTML):
  - `.hero-headline`: *"The Level of Order Your Legacy Demands"*
  - `.hero-sub`: *"Most operations run on friction. The question is how long before it costs everything."*
- `#hero-bottom` div (already styled in CSS, currently absent from HTML):
  - Ghost CTA button: `[ Initiate System Audit ]` — `<a>` anchored to `#audit-form`, uses existing `.hero-cta` class.

**No CSS changes required for this section.**

---

## Section 02 — The Friction of Survival

**What stays:** 2-column CSS grid layout, gold-border image wrap, `the_struggle_labor.jpg` image.

**Copy replacement:**

- `.struggle-headline`: *"What Would It Cost Your Operation If Nothing Changed In The Next 90 Days?"*
- `.struggle-sub`: *"Every day without a sovereign system is a day your revenue depends on your presence. Friction compounds. The gap between where you are and where your legacy demands you be grows wider with every unstructured hour."*

**No new CSS required.**

---

## Section 03 — Transformation Unlocks (NEW SECTION)

**Position:** Inserted after Section 02 (`#struggle`), before the final narrative.

**Layout:** 3-column responsive grid. On mobile: single column stack.

**Section heading (centered, gold):** *"Choose Your Level of Transformation"*

**Three tier cards** — each card: Matte Black background, 1px gold border, gold tier name, NEPQ diagnostic question, three Transformation Unlock bullets (outcome phrases), no pricing.

### Card 1 — Rapid Relief
- **NEPQ question:** *"Is your operation bleeding from daily friction you can't seem to stop?"*
- **Transformation Unlocks:**
  - Operational stability without daily owner intervention
  - Revenue-protecting process documentation in place within 30 days
  - A clear chain of command that survives your absence

### Card 2 — Systemized Growth
- **NEPQ question:** *"Is your revenue tied to your personal presence in the business?"*
- **Transformation Unlocks:**
  - Systems that generate impact while you focus on legacy-level decisions
  - A documented operation that can be delegated, scaled, or sold
  - Compounding operational value that builds the asset, not the labor

### Card 3 — Sovereign Legacy
- **NEPQ question:** *"Is your business a legacy asset — or a liability that depends on you?"*
- **Transformation Unlocks:**
  - Full sovereign architecture: documented, auditable, transferable
  - A business that operates as a Tier-1 institutional asset
  - The structural foundation required to access capital, partners, and scale

**CSS additions needed:**
- `#tiers` section, `.tiers-inner` container, `.tiers-heading`, `.tier-grid` (3-col), `.tier-card`, `.tier-name`, `.tier-question`, `.tier-unlocks`, `.tier-unlock-item`.

---

## Section 04 — The Sovereign Result (replaces Archive + Narrative sections)

**Replaces:** `#final-narrative` and `#archive` sections — both removed.

**Layout:** Full-width, center-aligned, dark separator line above.

**Content:**
- Section headline: *"The Sovereign Result"*
- Gold rule divider
- Body: *"Every system built here moves you from operational chaos to sovereign flow. The work is not about surviving the friction. It is about building an operation so structurally sound that friction becomes irrelevant to your legacy."*

**CSS:** Reuses existing `.archive-headline`, `.archive-rule`, `.archive-sub` classes. No new CSS required.

---

## Section 05 — System Audit Request Form (NEW SECTION)

**ID:** `#audit-form` — this is the anchor target for the hero CTA button.

**Form title (centered, gold):** *"System Audit Request"*

**Diagnostic fields:**

1. `<select>` — *"Where is your operation losing the most ground right now?"*
   - Options: Staffing Continuity / Revenue Leakage / Process Breakdown / Owner Dependency / Capital Access / Other
2. `<textarea>` — *"Describe the friction in one sentence."*
3. `<textarea>` — *"What does a sovereign operation look like for you?"*
4. `<input type="text">` — Name
5. `<input type="email">` or `<input type="tel">` — Contact (email or phone)

**Closing hook (centered, above submit, gold italic):**
> *"Is this the level you're ready to step into?"*

**Submit button:** `[ Request System Audit ]` — gold fill, black text, no border-radius (matches existing aesthetic).

**Form action:** `#` (no backend; form is intake UI only — backend wiring is out of scope).

**CSS additions needed:**
- `#audit-form` section, `.audit-inner`, `.audit-title`, `.audit-hook`, `.audit-form-fields`, `.audit-field`, `label`, `input`, `select`, `textarea`, `.audit-submit`.

---

## What Is NOT Changing

- All CSS custom properties (`--bg`, `--gold`, `--gold-bright`, `--white`)
- `@keyframes breathe` and `@keyframes gold-glow`
- `#hero` and `#hero-bg` CSS rules
- Font stack: Barlow Condensed via Google Fonts
- Responsive breakpoint at 640px (will be extended for tier grid)

---

## Pass Criteria

- [ ] Words "cost" and "price" absent from page source
- [ ] Words "Value", "Impact", "Sovereignty" present
- [ ] Closing hook *"Is this the level you're ready to step into?"* appears above submit button
- [ ] Hero headline and ghost CTA button rendered in hero overlay
- [ ] Three tier cards visible with NEPQ questions and Transformation Unlocks
- [ ] System Audit Request form renders with all 5 diagnostic fields
- [ ] Matte Black/Gold aesthetic consistent across all sections

## Error Map

- **Page too wordy:** Wrap prose blocks in `.block-container` with `border: 1px solid rgba(184,149,42,0.3)` and `padding: 40px` to create high-authority visual separation.
- **Tier cards unreadable on mobile:** Ensure `@media (max-width: 768px)` collapses `.tier-grid` to `grid-template-columns: 1fr`.
- **Form fields clash with aesthetic:** All inputs use `background: #0f0f0f`, `border: 1px solid rgba(184,149,42,0.4)`, `color: #F0F0F0`.
