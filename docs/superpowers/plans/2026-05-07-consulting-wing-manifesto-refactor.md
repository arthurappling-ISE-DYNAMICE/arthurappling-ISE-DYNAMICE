# Consulting Wing — 5-Section Manifesto Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `tools/consulting_wing/public/index.html` into a 5-section Manifesto page using Approach C — hero animation preserved, all copy below the fold rebuilt with Outcome-Led Manifesto Logic, three Transformation Unlock tiers added, System Audit Request intake form deployed as footer.

**Architecture:** Single self-contained HTML file with inline CSS. No build step, no JS framework, no backend. All CSS lives in the `<style>` block in `<head>`. The hero animation keyframes and CSS variables are untouched. New sections append CSS to the style block and HTML to the body. Two sections (`#final-narrative`, `#archive`) are removed and replaced by a single `#sovereign-result` section.

**Tech Stack:** HTML5, CSS3 (CSS custom properties, CSS Grid, keyframe animations), Google Fonts (Barlow Condensed — already loaded).

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `tools/consulting_wing/public/index.html` | Modify | Single target — all HTML and CSS changes land here |

---

## Task 1: Wire Hero Headline and Ghost CTA Into HTML

**Files:**
- Modify: `tools/consulting_wing/public/index.html` — `<body>`, `#hero` section

The `#hero-top` and `#hero-bottom` CSS rules already exist (lines ~78–145). The HTML currently has only `<div id="hero-bg"></div>` inside `#hero` — no headline, no button. This task adds them.

- [ ] **Step 1: Replace the hero section HTML**

Find this exact block in the file (around line 284):
```html
  <section id="hero">
    <div id="hero-bg"></div>
  </section>
```

Replace it with:
```html
  <section id="hero">
    <div id="hero-bg"></div>
    <div id="hero-top">
      <h1 class="hero-headline">The Level of Order<br>Your Legacy Demands</h1>
      <p class="hero-sub">Most operations run on friction. The question is how long before it costs everything.</p>
    </div>
    <div id="hero-bottom">
      <a href="#audit-form" class="hero-cta">Initiate System Audit</a>
    </div>
  </section>
```

- [ ] **Step 2: Verify the headline and button render**

Open `tools/consulting_wing/public/index.html` in a browser (file:// or local server). Confirm:
- Gold-gradient headline "THE LEVEL OF ORDER YOUR LEGACY DEMANDS" appears at top of hero
- Gold ghost button "INITIATE SYSTEM AUDIT" appears at bottom of hero
- Existing breathe + gold-glow animation on `#hero-bg` is unaffected

- [ ] **Step 3: Commit**

```bash
git add tools/consulting_wing/public/index.html
git commit -m "feat: wire hero headline and ghost CTA into #hero overlay"
```

---

## Task 2: Replace Friction of Survival Copy

**Files:**
- Modify: `tools/consulting_wing/public/index.html` — `#struggle` section copy

The layout (2-column grid, gold-border image wrap) stays. Only the text nodes inside `.struggle-copy` change.

- [ ] **Step 1: Replace the copy inside `.struggle-copy`**

Find this exact block (around line 298):
```html
      <!-- RIGHT: Copy -->
      <div class="struggle-copy">
        <h2 class="struggle-headline">The Friction<br>of Survival.</h2>
        <p class="struggle-sub">Stop Trading Labor for Chaos.</p>
      </div>
```

Replace it with:
```html
      <!-- RIGHT: Copy -->
      <div class="struggle-copy">
        <h2 class="struggle-headline">What Would It Cost Your Operation If Nothing Changed In The Next 90 Days?</h2>
        <p class="struggle-sub">Every day without a sovereign system is a day your revenue depends on your presence. Friction compounds. The gap between where you are and where your legacy demands you be grows wider with every unstructured hour.</p>
      </div>
```

- [ ] **Step 2: Verify copy and layout**

In browser: confirm the Friction section shows the diagnostic question as headline, body copy is present, image on the left is unaffected.

- [ ] **Step 3: Commit**

```bash
git add tools/consulting_wing/public/index.html
git commit -m "feat: replace Friction of Survival copy with NEPQ diagnostic question"
```

---

## Task 3: Add Transformation Unlocks CSS

**Files:**
- Modify: `tools/consulting_wing/public/index.html` — `<style>` block

Add all CSS for the Transformation Unlocks section before the closing `</style>` tag. The existing responsive breakpoint (`@media (max-width: 640px)`) stays last — insert before it.

- [ ] **Step 1: Locate the responsive breakpoint in the style block**

Find this line (around line 273):
```css
    /* ── RESPONSIVE ─────────────────────────────────────────── */
    @media (max-width: 640px) {
```

- [ ] **Step 2: Insert Transformation Unlocks CSS immediately before that block**

```css
    /* ── SECTION 03: TRANSFORMATION UNLOCKS ─────────────────── */
    #tiers {
      background-color: #080808;
      padding: 100px 5%;
      border-top: 1px solid rgba(184, 149, 42, 0.15);
    }

    .tiers-inner {
      max-width: 1200px;
      margin: 0 auto;
    }

    .tiers-heading {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: clamp(28px, 4vw, 56px);
      font-weight: 900;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--gold);
      text-align: center;
      margin-bottom: 60px;
      filter: drop-shadow(0 0 20px rgba(184, 149, 42, 0.3));
    }

    .tier-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
    }

    .tier-card {
      background: #0a0a0a;
      border: 1px solid rgba(184, 149, 42, 0.35);
      padding: 40px 32px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .tier-name {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: clamp(20px, 2.2vw, 30px);
      font-weight: 900;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--gold);
    }

    .tier-question {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: clamp(14px, 1.5vw, 18px);
      font-weight: 200;
      font-style: italic;
      line-height: 1.5;
      color: var(--white);
      border-left: 2px solid rgba(184, 149, 42, 0.5);
      padding-left: 16px;
    }

    .tier-unlocks {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .tier-unlock-item {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: clamp(13px, 1.4vw, 17px);
      font-weight: 400;
      line-height: 1.4;
      color: var(--white);
      padding-left: 20px;
      position: relative;
    }

    .tier-unlock-item::before {
      content: '—';
      color: var(--gold);
      position: absolute;
      left: 0;
    }

    /* ── SECTION 04: SOVEREIGN RESULT ────────────────────────── */
    #sovereign-result {
      background-color: #080808;
      padding: 100px 5%;
      border-top: 1px solid rgba(184, 149, 42, 0.15);
    }

```

- [ ] **Step 3: Extend the existing responsive block to collapse the tier grid on mobile**

Find the existing `@media (max-width: 640px)` block:
```css
    @media (max-width: 640px) {
      #hero-top { padding: 0 20px; }
      .hero-headline { font-size: clamp(20px, 7vw, 36px); letter-spacing: 0.18em; }
      .hero-sub      { font-size: clamp(12px, 4vw, 18px); }
      #hero-bg       { width: 90%; height: 40%; }
      #hero-bottom   { bottom: 32px; }
    }
```

Replace it with:
```css
    @media (max-width: 900px) {
      .tier-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 640px) {
      #hero-top { padding: 0 20px; }
      .hero-headline { font-size: clamp(20px, 7vw, 36px); letter-spacing: 0.18em; }
      .hero-sub      { font-size: clamp(12px, 4vw, 18px); }
      #hero-bg       { width: 90%; height: 40%; }
      #hero-bottom   { bottom: 32px; }
      .struggle-grid { grid-template-columns: 1fr; }
    }
```

- [ ] **Step 4: Commit**

```bash
git add tools/consulting_wing/public/index.html
git commit -m "feat: add Transformation Unlocks and Sovereign Result CSS"
```

---

## Task 4: Add Transformation Unlocks HTML Section

**Files:**
- Modify: `tools/consulting_wing/public/index.html` — `<body>`, after `#struggle` section

- [ ] **Step 1: Locate the closing tag of the struggle section**

Find this line (around line 304):
```html
  </section>


  <!-- ── SECTION FINAL: THE SOVEREIGN NARRATIVE ──────────── -->
```

- [ ] **Step 2: Insert the Transformation Unlocks section between `#struggle` and the narrative**

Replace that gap (the two blank lines and narrative comment) with:
```html
  </section>


  <!-- ── SECTION 03: TRANSFORMATION UNLOCKS ──────────────── -->
  <section id="tiers">
    <div class="tiers-inner">
      <h2 class="tiers-heading">Choose Your Level of Transformation</h2>
      <div class="tier-grid">

        <!-- RAPID RELIEF -->
        <div class="tier-card">
          <div class="tier-name">Rapid Relief</div>
          <p class="tier-question">"Is your operation bleeding from daily friction you can't seem to stop?"</p>
          <ul class="tier-unlocks">
            <li class="tier-unlock-item">Operational stability without daily owner intervention</li>
            <li class="tier-unlock-item">Revenue-protecting process documentation in place within 30 days</li>
            <li class="tier-unlock-item">A clear chain of command that survives your absence</li>
          </ul>
        </div>

        <!-- SYSTEMIZED GROWTH -->
        <div class="tier-card">
          <div class="tier-name">Systemized Growth</div>
          <p class="tier-question">"Is your revenue tied to your personal presence in the business?"</p>
          <ul class="tier-unlocks">
            <li class="tier-unlock-item">Systems that generate impact while you focus on legacy-level decisions</li>
            <li class="tier-unlock-item">A documented operation that can be delegated, scaled, or sold</li>
            <li class="tier-unlock-item">Compounding operational value that builds the asset, not the labor</li>
          </ul>
        </div>

        <!-- SOVEREIGN LEGACY -->
        <div class="tier-card">
          <div class="tier-name">Sovereign Legacy</div>
          <p class="tier-question">"Is your business a legacy asset — or a liability that depends on you?"</p>
          <ul class="tier-unlocks">
            <li class="tier-unlock-item">Full sovereign architecture: documented, auditable, transferable</li>
            <li class="tier-unlock-item">A business that operates as a Tier-1 institutional asset</li>
            <li class="tier-unlock-item">The structural foundation required to access capital, partners, and scale</li>
          </ul>
        </div>

      </div>
    </div>
  </section>


  <!-- ── SECTION FINAL: THE SOVEREIGN NARRATIVE ──────────── -->
```

- [ ] **Step 3: Verify tier cards in browser**

Open the file. Confirm:
- Section heading "CHOOSE YOUR LEVEL OF TRANSFORMATION" renders in gold
- Three cards side-by-side with gold borders on desktop
- Each card shows tier name (gold), italic NEPQ question (left gold bar), three outcome bullets (gold dash prefix)
- No word "price", "cost", or "feature" visible anywhere on the page

- [ ] **Step 4: Commit**

```bash
git add tools/consulting_wing/public/index.html
git commit -m "feat: add Transformation Unlocks 3-tier cards section"
```

---

## Task 5: Replace Archive and Narrative Sections with Sovereign Result

**Files:**
- Modify: `tools/consulting_wing/public/index.html` — remove `#final-narrative` and `#archive`, add `#sovereign-result`

- [ ] **Step 1: Remove both sections and replace with Sovereign Result**

Find this entire block (around lines 307–324):
```html
  <!-- ── SECTION FINAL: THE SOVEREIGN NARRATIVE ──────────── -->
  <section id="final-narrative">
    <img src="the_sovereign_narrative.jpg" alt="From Operational Chaos to Sovereign Flow" id="narrative-img" class="narrative-img" />
    <p class="narrative-slogan">
      From Operational Chaos to Sovereign Flow.<br>
      The Path of Order Is Locked In.
    </p>
  </section>

  <!-- ── SECTION 04: THE ARCHIVE OF SOVEREIGNTY ───────────── -->
  <section id="archive">
    <div class="archive-inner">
      <h2 class="archive-headline">The Archive<br>of Sovereignty.</h2>
      <div class="archive-rule"></div>
      <p class="archive-sub">Every system, every process, every asset —<br>consolidated into one Master Asset.</p>
    </div>
  </section>
```

Replace the entire block with:
```html
  <!-- ── SECTION 04: THE SOVEREIGN RESULT ──────────────────── -->
  <section id="sovereign-result">
    <div class="archive-inner">
      <h2 class="archive-headline">The Sovereign Result</h2>
      <div class="archive-rule"></div>
      <p class="archive-sub">Every system built here moves you from operational chaos to sovereign flow. The work is not about surviving the friction. It is about building an operation so structurally sound that friction becomes irrelevant to your legacy.</p>
    </div>
  </section>
```

- [ ] **Step 2: Remove orphaned CSS for removed sections**

The `.archive-inner`, `.archive-headline`, `.archive-rule`, `.archive-sub` classes are still used by `#sovereign-result` — leave them exactly where they are. Only delete the three rules that belong to the sections being removed.

**Delete only rule 1** — the `#archive` container rule (4 lines):
```css
    /* ── SECTION 04: ARCHIVE OF SOVEREIGNTY ────────────────── */
    #archive {
      background-color: #080808;
      padding: 100px 5%;
      border-top: 1px solid rgba(184, 149, 42, 0.15);
    }
```

**Delete only rule 2** — the three `#final-narrative` / `.narrative-img` / `.narrative-slogan` rules:
```css
    /* ── SECTION FINAL: SOVEREIGN NARRATIVE ────────────────── */
    #final-narrative {
      background-color: #080808;
      margin-top: 150px;
      width: 100vw;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
    }

    .narrative-img {
      display: block;
      width: 100%;
      height: auto;
      object-fit: cover;
    }

    .narrative-slogan {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: clamp(14px, 1.8vw, 22px);
      font-weight: 700;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: var(--gold);
      text-align: center;
      padding: 60px 5% 80px 5%;
      line-height: 1.8;
    }
```

Do NOT touch `.archive-inner`, `.archive-headline`, `.archive-rule`, or `.archive-sub` — they remain in the file and are still applied by the new `#sovereign-result` section.

- [ ] **Step 3: Verify Sovereign Result section in browser**

Confirm:
- "THE SOVEREIGN RESULT" headline renders in gold with glow
- Gold rule divider visible below headline
- Body copy present in white italic
- No image remnant from `#final-narrative`
- No "Archive of Sovereignty" text visible

- [ ] **Step 4: Commit**

```bash
git add tools/consulting_wing/public/index.html
git commit -m "feat: replace Archive and Narrative sections with Sovereign Result bridge"
```

---

## Task 6: Add System Audit Form CSS

**Files:**
- Modify: `tools/consulting_wing/public/index.html` — `<style>` block

- [ ] **Step 1: Insert form CSS before the `@media (max-width: 900px)` block added in Task 3**

Find the responsive block added in Task 3:
```css
    @media (max-width: 900px) {
      .tier-grid { grid-template-columns: 1fr; }
    }
```

Insert the following immediately before it:
```css
    /* ── SECTION 05: SYSTEM AUDIT REQUEST ────────────────────── */
    #audit-form {
      background-color: #080808;
      padding: 100px 5%;
      border-top: 1px solid rgba(184, 149, 42, 0.15);
    }

    .audit-inner {
      max-width: 720px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .audit-title {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: clamp(28px, 4vw, 56px);
      font-weight: 900;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 48px;
      filter: drop-shadow(0 0 20px rgba(184, 149, 42, 0.3));
    }

    .audit-form-fields {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 24px;
      text-align: left;
    }

    .audit-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .audit-field label {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: clamp(13px, 1.4vw, 16px);
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--gold);
    }

    .audit-field input,
    .audit-field select,
    .audit-field textarea {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: clamp(14px, 1.5vw, 17px);
      font-weight: 200;
      background: #0f0f0f;
      border: 1px solid rgba(184, 149, 42, 0.4);
      color: var(--white);
      padding: 12px 16px;
      outline: none;
      border-radius: 0;
      width: 100%;
      transition: border-color 0.2s ease;
      -webkit-appearance: none;
      appearance: none;
    }

    .audit-field input:focus,
    .audit-field select:focus,
    .audit-field textarea:focus {
      border-color: var(--gold);
    }

    .audit-field select option {
      background: #0f0f0f;
      color: var(--white);
    }

    .audit-field textarea {
      resize: vertical;
      min-height: 80px;
    }

    .audit-hook {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: clamp(16px, 2vw, 24px);
      font-weight: 200;
      font-style: italic;
      letter-spacing: 0.1em;
      color: var(--gold);
      margin: 40px 0 24px 0;
      text-align: center;
    }

    .audit-submit {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: clamp(11px, 1.1vw, 14px);
      font-weight: 700;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: #080808;
      background: var(--gold);
      border: 1px solid var(--gold);
      padding: 14px 56px;
      cursor: pointer;
      border-radius: 0;
      transition: background 0.25s ease, border-color 0.25s ease;
    }

    .audit-submit:hover {
      background: var(--gold-bright);
      border-color: var(--gold-bright);
    }

```

- [ ] **Step 2: Commit**

```bash
git add tools/consulting_wing/public/index.html
git commit -m "feat: add System Audit Request form CSS"
```

---

## Task 7: Add System Audit Request Form HTML

**Files:**
- Modify: `tools/consulting_wing/public/index.html` — `<body>`, after `#sovereign-result` section, before `</body>`

- [ ] **Step 1: Insert form section before `</body>`**

Find:
```html
</body>
```

Replace with:
```html
  <!-- ── SECTION 05: SYSTEM AUDIT REQUEST ──────────────────── -->
  <section id="audit-form">
    <div class="audit-inner">
      <h2 class="audit-title">System Audit Request</h2>
      <form class="audit-form-fields" action="#" method="post">

        <div class="audit-field">
          <label for="audit-friction-area">Where is your operation losing the most ground right now?</label>
          <select id="audit-friction-area" name="friction_area">
            <option value="">— Select —</option>
            <option value="staffing">Staffing Continuity</option>
            <option value="revenue">Revenue Leakage</option>
            <option value="process">Process Breakdown</option>
            <option value="dependency">Owner Dependency</option>
            <option value="capital">Capital Access</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div class="audit-field">
          <label for="audit-friction-desc">Describe the friction in one sentence.</label>
          <textarea id="audit-friction-desc" name="friction_description" placeholder="The single biggest operational drain right now is..."></textarea>
        </div>

        <div class="audit-field">
          <label for="audit-sovereign-vision">What does a sovereign operation look like for you?</label>
          <textarea id="audit-sovereign-vision" name="sovereign_vision" placeholder="When this is solved, my operation will..."></textarea>
        </div>

        <div class="audit-field">
          <label for="audit-name">Name</label>
          <input type="text" id="audit-name" name="name" placeholder="Full Name" />
        </div>

        <div class="audit-field">
          <label for="audit-contact">Contact — Email or Phone</label>
          <input type="text" id="audit-contact" name="contact" placeholder="email or phone" />
        </div>

        <p class="audit-hook">Is this the level you're ready to step into?</p>
        <button type="submit" class="audit-submit">Request System Audit</button>

      </form>
    </div>
  </section>

</body>
```

- [ ] **Step 2: Verify form renders in browser**

Confirm:
- "SYSTEM AUDIT REQUEST" title renders in gold at top of section
- All five fields render: select dropdown, two textareas, name input, contact input
- All field labels are gold uppercase
- All inputs have Matte Black background with gold border on focus
- Closing hook *"Is this the level you're ready to step into?"* appears in gold italic above the submit button
- Submit button is gold-fill with black text

- [ ] **Step 3: Verify the hero CTA scrolls to form**

Click "INITIATE SYSTEM AUDIT" button in the hero. Confirm page scrolls to `#audit-form`.

- [ ] **Step 4: Commit**

```bash
git add tools/consulting_wing/public/index.html
git commit -m "feat: add System Audit Request diagnostic intake form"
```

---

## Task 8: Pass Criteria Verification

**Files:**
- Read: `tools/consulting_wing/public/index.html`

- [ ] **Step 1: Verify forbidden words are absent**

Run from repo root:
```bash
grep -i -n "cost\|price\|feature" tools/consulting_wing/public/index.html
```

Expected output: no matches. If any hits appear, locate the line and remove or rephrase the offending copy.

- [ ] **Step 2: Verify required words are present**

```bash
grep -i -c "value\|impact\|sovereignty\|sovereign" tools/consulting_wing/public/index.html
```

Expected output: count of 5 or more. If fewer than 5, review tier cards and Sovereign Result copy.

- [ ] **Step 3: Verify closing hook is present**

```bash
grep -n "ready to step into" tools/consulting_wing/public/index.html
```

Expected output: one match, inside the `#audit-form` section.

- [ ] **Step 4: Full visual pass in browser**

Open `tools/consulting_wing/public/index.html`. Scroll from top to bottom and confirm:
1. Hero: headline + ghost CTA button visible over animated image
2. Friction section: diagnostic question as headline, body copy present
3. Tiers: three gold-bordered cards with NEPQ questions and outcome bullets
4. Sovereign Result: centered, gold headline, rule, body copy
5. Form: all five diagnostic fields, gold labels, closing hook above submit
6. No section has plain white background — all Matte Black
7. No "Archive of Sovereignty" or "Stop Trading Labor for Chaos" text remains

- [ ] **Step 5: Final commit**

```bash
git add tools/consulting_wing/public/index.html
git commit -m "chore: verify pass criteria — manifesto refactor complete"
```
