# Design

Extracted from `index.html` — Prime Pathwy Sovereign Turnover System. Matte Black & Gold.

---

## Theme

**Dark.** Near-black backgrounds with warm gold accents. Physical scene: a property manager reviewing a vendor proposal at 11pm after an eviction. The screen needs to read authoritative and serious, not inviting. Light mode would signal low-tier service.

---

## Color

### Primitives

| Token | Value | Notes |
|---|---|---|
| `--color-black` | `#050505` | Page background — almost black, slight warmth |
| `--color-surface-deep` | `#060606` | Summary boxes, elevated dark surfaces |
| `--color-surface-raised` | `#080808` | Quote panel, modal-adjacent containers |
| `--color-surface-card` | `#0D0D0D` | Service cards, primary surface elevation |
| `--color-surface-control` | `#111111` | Input fields, picker cards, counter buttons |
| `--color-surface-hover` | `#141414` | Hovered controls and cards |
| `--color-modal` | `#0A0A0A` | Modal panel background |
| `--color-gold-light` | `#F5D98A` | Gradient highlight stop (warm, high lightness) |
| `--color-gold-mid` | `#E2C06A` | Gradient blend stop |
| `--color-gold` | `#C9A84C` | Primary gold — text, borders, prices, icons |
| `--color-gold-bright` | `#FFD700` | Bright gold — CTAs, emphasis text, check marks |
| `--color-gold-hover` | `#FFE44D` | Primary button hover state |
| `--color-white` | `#FFFFFF` | Primary text |

### Semantic Roles

| Token | Maps to | Usage |
|---|---|---|
| `--bg-page` | `#050505` | `body` background |
| `--bg-card` | `#0D0D0D` | `.service-card`, general card surfaces |
| `--bg-control` | `#111111` | Inputs, selectable cards, counter buttons |
| `--text-primary` | `#FFFFFF` | Body copy, labels, list items |
| `--text-secondary` | `rgba(255,255,255,.75)` | Nav links, secondary descriptors |
| `--text-gold` | `#C9A84C` | Prices, service CTAs, eyebrow accents |
| `--text-gold-bright` | `#FFD700` | Strong emphasis, check icons, NEPQ quotes |
| `--border-subtle` | `rgba(255,255,255,.06)` | Card borders (resting) |
| `--border-divider` | `rgba(255,255,255,.04)` | Row dividers, list separators |
| `--border-gold-low` | `rgba(201,168,76,.15)` | Container borders (resting gold) |
| `--border-gold-mid` | `rgba(201,168,76,.3)` | Scrollbar, `.gold-border` utility |
| `--border-gold-active` | `#C9A84C` | Selected states, focused controls |
| `--gold-glow-soft` | `rgba(201,168,76,.08)` | Card hover box-shadow |
| `--gold-glow-btn` | `rgba(255,215,0,.2)` | Primary button shadow (resting) |
| `--gold-glow-btn-hover` | `rgba(255,215,0,.35)` | Primary button shadow (hover) |

### Gradients

| Token | Value |
|---|---|
| `--gradient-gold` | `linear-gradient(135deg, #F5D98A, #C9A84C, #E2C06A)` |
| `--gradient-gold-short` | `linear-gradient(135deg, #F5D98A, #C9A84C)` |
| `--gradient-hero-scrim` | `linear-gradient(to right, rgba(0,0,0,.62) 0%, rgba(0,0,0,.38) 28%, rgba(0,0,0,.08) 55%, transparent 72%)` |
| `--gradient-modal-bg` | `rgba(0,0,0,.93)` + `backdrop-filter: blur(10px)` |

> The `--gradient-gold` tokens are used via `background-clip: text` on headings and the nav logo. This is a noted deviation from the impeccable gradient-text ban. The pattern is deeply entrenched in the brand; any redesign should migrate to solid `--color-gold` or `--color-gold-light` on headings.

---

## Typography

### Font Stacks

| Role | Stack |
|---|---|
| Heading | `Georgia, 'Times New Roman', serif` |
| Body / UI | `'Courier New', Courier, monospace` |

### Type Scale

| Class | Size | Weight | Style | Tracking | Usage |
|---|---|---|---|---|---|
| `.eyebrow` | `9px` | — | uppercase | `.4em` | Section labels, nav sub-labels |
| `.service-eyebrow` | `9px` | — | uppercase | `.3em` | Service card identifiers |
| Nav link | `9px` | — | uppercase | `.25em` | Navigation items |
| Button (mono) | `12px` | `700` | uppercase | `.2em` | `.btn-gold`, `.btn-outline`, `.order-btn` |
| Body | `1rem` | — | — | `.05em` | List items, descriptors |
| Body large | `1.125rem` | — | — | — | NEPQ quotes |
| Price | `18px` | `700` | italic | — | `.service-price`, `.price-amount` |
| Heading fluid (sm) | `clamp(22px, 3vw, 30px)` | `900` | italic | — | `.service-name`, modal title |
| Heading fluid (lg) | `clamp(36px, 5vw, 56px)` | `900` | italic | — | `.step-num` (gold numerals) |
| Calc display | `clamp(28px, 4vw, 42px)` | `900` | italic | — | `.calc-value` |

### Heading Pattern (`.serif-head`)

```css
font-family: Georgia, 'Times New Roman', serif;
font-style: italic;
font-weight: 900;
line-height: 1.05;
```

All major headings are Georgia italic 900. This is the primary authority signal of the brand.

### Body

```css
font-family: 'Courier New', Courier, monospace;
line-height: 1.6;
```

Monospace body reinforces the "documented, operational, commercial-grade" brand register.

---

## Spacing & Layout

| Token | Value | Usage |
|---|---|---|
| `--max-content` | `1100px` | Primary content max-width |
| `--max-hero-content` | `820px` | Hero copy column |
| `--section-padding` | `6rem 2rem` | Standard section vertical rhythm |
| `--nav-height` | `60px` | Fixed nav height |
| `--card-padding` | `2.5rem` | `.service-card` internal padding |
| `--card-padding-sm` | `1.5rem` | Smaller cards and control areas |
| `--gap-tight` | `6px` | Package card and addon row gaps |
| `--gap-standard` | `1.5rem` | Grid and flex gaps |
| `--gap-loose` | `2rem` | Nav links, section groups |

---

## Components

### `eyebrow`

Micro-label used before every section heading. Uppercase, 9px, wide tracking, muted gold.

```html
<span class="eyebrow">Section 01 — Label Text</span>
```

**States:** Static only. Never interactive.

---

### `serif-head`

Applied to `h1`–`h3` where Georgia italic 900 is needed. Combined with `--gradient-gold` via `background-clip: text` on most headings.

```html
<h2 class="serif-head">Heading Text</h2>
```

---

### `btn-gold` (Primary CTA)

Solid gold button. Near-black text on bright gold background. Monospace uppercase.

```css
background: #FFD700;
color: #0A0A0A;
font-family: 'Courier New', monospace;
font-size: 12px;
font-weight: 700;
letter-spacing: .2em;
text-transform: uppercase;
padding: 1.1rem 2.25rem;
border: none;
cursor: pointer;
transition: background .2s, box-shadow .2s;
box-shadow: 0 2px 16px rgba(255,215,0,.2);
```

Hover: `background: #FFE44D; box-shadow: 0 4px 28px rgba(255,215,0,.35);`

---

### `btn-outline` (Secondary CTA)

Ghost button — transparent background, gold border and text.

```css
border: 1px solid #FFD700;
color: #FFD700;
background: transparent;
/* same font/size/padding as btn-gold */
transition: background .2s, color .2s, box-shadow .2s;
```

Hover: `background: #FFD700; color: #0A0A0A; box-shadow: 0 4px 28px rgba(255,215,0,.25);`

---

### `order-btn` (Tertiary CTA)

Small ghost link-style button. Used on service cards and price rows.

```css
font-family: 'Courier New', monospace;
font-size: 9px;
letter-spacing: .25em;
text-transform: uppercase;
color: #FFD700;
background: none;
border: 1px solid rgba(255,215,0,.4);
padding: .6rem 1.25rem;
cursor: pointer;
transition: background .2s, border-color .2s, color .2s;
```

Hover: `background: rgba(255,215,0,.08); border-color: #FFD700;`

---

### `service-card`

Dark surface card with gold hover border glow. Used in a grid for service offerings.

```css
background: #0D0D0D;
border: 1px solid rgba(255,255,255,.06);
padding: 2.5rem;
transition: border-color .25s, box-shadow .25s;
```

Hover: `border-color: rgba(201,168,76,.35); box-shadow: 0 0 24px rgba(201,168,76,.08);`

**Internal anatomy:**
- `.service-eyebrow` — `SVC — 01 · LABEL`
- `.service-name` — Georgia italic 900, gradient gold
- `.service-nepq` — 1.125rem quote with gold left-stripe (2px `border-left`)
- `.service-scope` — checklist with `✓` gold markers
- `.service-price` — Georgia italic price
- `.order-btn` — CTA

> Note: `.service-nepq` uses a 2px `border-left` accent (typically banned). Acceptable here because it is 2px and paired with a distinct `color: #FFD700` content style that differentiates it from generic cards.

---

### `step` (Process Row)

Horizontal step item. Large gold ordinal numeral + heading + body copy. Rows separated by subtle white divider.

```css
.step { display: flex; gap: 1.5rem; padding: 2rem 0; border-bottom: 1px solid rgba(255,255,255,.04); }
.step-num {
  font-family: Georgia, serif; font-style: italic; font-weight: 900;
  font-size: clamp(36px, 5vw, 56px);
  background: linear-gradient(135deg, #F5D98A, #C9A84C);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  line-height: 1; width: 60px;
}
```

---

### `price-row`

Table-style pricing row. Label / amount / note / CTA in a flex row.

```css
padding: 1rem 1.5rem;
border-bottom: 1px solid rgba(255,255,255,.04);
transition: background .2s;
```

Hover: `background: rgba(201,168,76,.03);`

| Sub-element | Style |
|---|---|
| `.price-label` | `1rem / tracking .1em / white` |
| `.price-amount` | `Georgia italic 700 / 18px / #C9A84C` |
| `.price-note` | `9px / tracking .15em / rgba(white,.75)` |

---

### `intake-pkg-card` (Selectable Package)

Interactive selector card inside the quote modal. Three states: resting, hover, selected.

```css
/* resting */
background: #111;
border: 1px solid rgba(255,255,255,.07);
padding: .9rem 1rem;

/* hover */
border-color: rgba(201,168,76,.4);
background: #141414;

/* selected */
border-color: #C9A84C;
background: rgba(201,168,76,.06);

/* focus */
outline: 1px solid rgba(201,168,76,.5);
```

---

### `addon-row` (Checkbox Row)

Add-on service selector. Full-width row with native checkbox styled via `accent-color`.

```css
/* resting */
background: #111;
border: 1px solid rgba(255,255,255,.06);
padding: .8rem 1rem;

/* hover */
border-color: rgba(201,168,76,.3);
background: #141414;

/* checked */
border-color: rgba(201,168,76,.55);
background: rgba(201,168,76,.04);

/* checkbox */
accent-color: #C9A84C;
```

---

### `calc-value` (Display Number)

Large fluid number for the quote calculator output.

```css
font-family: Georgia, serif;
font-style: italic;
font-weight: 900;
font-size: clamp(28px, 4vw, 42px);
color: #C9A84C;
```

---

### Nav

Fixed top bar, 60px, near-black with backdrop blur.

```css
position: fixed; top: 0; left: 0; right: 0; z-index: 100;
background: rgba(5,5,5,.92);
backdrop-filter: blur(12px);
border-bottom: 1px solid rgba(255,255,255,.05);
height: 60px;
```

Logo: Georgia italic 900, 15px, tracking -.02em, gradient gold.
Links: 9px uppercase, tracking .25em, `rgba(255,255,255,.75)` resting, `rgba(201,168,76,.8)` hover.

---

## Interaction Patterns

| Pattern | Timing | Easing |
|---|---|---|
| Color transitions (borders, text) | `0.2s` | default (ease) |
| Box-shadow transitions | `0.25s` | default |
| Modal overlay fade | `0.25s opacity` | default |
| Modal panel slide | `0.3s transform` | default |
| Button shadow lift | `0.2s` | default |

> All transitions use default browser easing. No bounces, no elastic, no spring. Restraint is intentional.

---

## Scrollbar

```css
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: rgba(201,168,76,.3); border-radius: 2px; }
```

Minimal gold scrollbar thumb. Brand-consistent detail.

---

## Accessibility Notes

- WCAG 2.1 AA target.
- `accent-color: #C9A84C` on checkboxes.
- All interactive elements have `aria-label` attributes.
- `focus` styles present on `intake-pkg-card` (`outline: 1px solid rgba(201,168,76,.5)`).
- Missing: visible focus rings on `btn-gold`, `btn-outline`, `order-btn`. Needs `:focus-visible` pass.
- Reduced-motion: no `@media (prefers-reduced-motion)` guards currently present. Needs harden pass.
