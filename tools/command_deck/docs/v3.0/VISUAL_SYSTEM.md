# SYS_OS v3.0 — Visual System Unification Plan (Phase 7)

**Plan only — no restyle in this release.** Documents the two existing
languages and the single target language to converge on, future-ready and
professional (no gimmicks, no gratuitous animation).

## Current state — two languages
| | Legacy "cyber" stations (01–08) | Executive stations (09–12) |
|---|---|---|
| Accent | Heavy gold glow, neon shadows | Restrained gold, subtle borders |
| Type | Orbitron (display), Share Tech Mono | System-weight semibold + mono |
| Cards | `bg-black/40` + glow shadows | `bg-white/[0.02]` + `border-white/10` |
| Motion | Canvas neural web, pings, pulses | Static, content-first |
| Tone | Sci-fi command deck | Professional console |

## Target: one language (calm, professional, timeless)
Converge on the executive style as the baseline; keep gold as the single
accent; retire decorative glow/animation from data surfaces.

### Design tokens (to centralize in `tailwind.config.js` + a tokens file)
```
color.surface     = #0b0b0e / white-alpha 0.02
color.border      = white-alpha 0.10
color.text.primary= slate-100
color.text.muted  = slate-500
color.accent      = gold-500 (#D4AF37)
color.status      = emerald / amber / red (GREEN/YELLOW/RED — already used)
radius            = 0.5rem (lg)
space.card        = 1rem
type.display      = Orbitron (headers only, sparingly)
type.body         = Plus Jakarta Sans
type.mono         = Share Tech Mono (data, ids, numbers)
```

### Component conventions
- **Cards:** `surface + border, p-4, rounded-lg`; label (mono, uppercase,
  10px, muted) over value (mono/semibold). One elevation, no glow.
- **Panels/stations:** section header (semibold title + mono sub-note) with a
  `border-b` divider; content grid below.
- **Tables:** `bg-slate-950` header, mono, uppercase 9px; rows
  `divide-white/[0.04]`, hover `bg-white/[0.02]`.
- **Navigation:** numbered mono labels, single gold active-bar (existing
  router pattern — already consistent).
- **Status:** the GREEN/YELLOW/RED dot+text system (health center) becomes the
  platform-wide status convention.

### Motion policy
- Allowed: focus rings, hover color transitions (≤200ms), the neural canvas
  **as a background only** (already pause/resume + reduced-motion aware).
- Removed from data surfaces: `animate-ping`/`animate-pulse` on metrics, glow
  shadows. Reduced-motion users already get a static canvas.

## Migration approach (additive, low-risk)
1. Extract tokens to one file; map existing utilities to them.
2. Re-skin **new** stations first (already aligned), then legacy stations one
   at a time behind a `data-skin` attribute so both can coexist during cutover.
3. No data-layer, registry, or dashboard logic changes — CSS/markup class
   swaps only.
