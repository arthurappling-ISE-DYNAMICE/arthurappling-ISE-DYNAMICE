# SYS_OS — VISUAL SYSTEM V2 (Phase 7) · Token Blueprint

**Foundation only — no UI overhaul.** This is the canonical token + component
contract the platform converges on. It supersedes VISUAL_SYSTEM.md (v1, the
narrative plan) with concrete, codifiable tokens. No animations, no flashy
dashboards.

## 1. Color tokens
| Token | Value | Use |
|---|---|---|
| `--surface-0` | `#030305` | App background |
| `--surface-1` | `rgba(255,255,255,0.02)` | Card background |
| `--surface-2` | `#0b0b0e` | Raised panel / table header |
| `--border` | `rgba(255,255,255,0.10)` | Default border |
| `--border-subtle` | `rgba(255,255,255,0.04)` | Row dividers |
| `--text-primary` | `slate-100 #f1f5f9` | Values, headings |
| `--text-muted` | `slate-500 #64748b` | Labels, captions |
| `--text-faint` | `slate-600 #475569` | Source notes |
| `--accent` | `gold-500 #D4AF37` | Single accent (active, CTA) |
| `--accent-hover` | `gold-400 #F3C64F` | Hover/focus accent |
| `--status-green` | `emerald-400 #34d399` | OK / ALLOW / GREEN |
| `--status-amber` | `amber-400 #fbbf24` | WARN / DUE / YELLOW |
| `--status-red` | `red-400 #f87171` | FAIL / DENY / RED |

Rule: **one accent (gold)**; status colors only for status. No decorative glow.

## 2. Typography tokens
| Token | Family | Use |
|---|---|---|
| `--font-display` | Orbitron | Brand/station headers only, sparingly |
| `--font-body` | Plus Jakarta Sans | Prose, descriptions |
| `--font-mono` | Share Tech Mono | Data, IDs, numbers, labels |
| sizes | `9px` label · `11px` body-mono · `12px` row · `2xl` metric value | — |
| tracking | `widest` for uppercase mono labels | — |

All fonts self-hosted (`assets/fonts/`) — zero runtime font dependency.

## 3. Card system
`bg-[--surface-1] border border-[--border] rounded-lg p-4`. One elevation, no
shadow glow. Structure: mono-uppercase label (9px, `--text-muted`) → value
(mono/semibold, `--text-primary`) → optional source note (9px, `--text-faint`).

## 4. Sidebar system
Fixed `md:w-80` (320px), stacks to `w-full` under `md`. `bg-black/60
backdrop-blur-xl`, `border-r --border`. Numbered mono nav labels; single gold
active-bar (`w-1 h-5 bg-gold-500`) per active item.

## 5. Navigation standards
Router-registered stations only (`router.register({id,label,render})`). Label
format `NN // NAME` (mono, uppercase, tracked). One active station; `aria-current`
on the active button. Delegated click handling (no inline handlers).

## 6. Button standards
- **Primary:** `border border-gold-500 text-gold-400 … hover:bg-gold-500
  hover:text-black`. Always a text label + `aria-label`.
- **Secondary:** `border border-white/15 text-slate-400 hover:text-slate-200`.
- **Danger:** `border-red-500/30 text-red-400 hover:bg-red-500/10`, two-step confirm.
- Size: `text-[11px] font-mono px-3–5 py-1.5–2 rounded`.

## 7. Form standards
- Field = label (9px mono uppercase, `for`) + input. Inputs:
  `bg-black border border-white/10 rounded px-3 py-2 text-xs font-mono`,
  `focus:border-gold-500/40`. Every control has `aria-label`.
- Validation feedback: `role="status"`, red text, inline below the form.
- Required fields marked `*`; rejection surfaces the store's error message.

## 8. Table standards
`thead bg-[--surface-2]` mono uppercase 9px; `tbody divide-[--border-subtle]`,
row hover `bg-white/[0.02]`. IDs in `--text-muted`, values `--text-primary`,
status as a bordered pill in the status color.

## 9. Status convention (platform-wide)
Dot (`w-2 h-2 rounded-full`) + text in the status color. GREEN/YELLOW/RED is the
single status vocabulary (System Health, client health, compliance, telemetry).

## Adoption (additive, deferred — foundation only here)
1. Emit these as CSS custom properties in `sys_os.css` (no class changes).
2. New stations consume tokens directly (executive/access already aligned).
3. Legacy stations migrate one at a time behind a `data-skin` attribute; both
   coexist during cutover. No data-layer or logic changes — markup/class only.
