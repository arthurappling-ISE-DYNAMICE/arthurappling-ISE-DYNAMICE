# SYS_OS v3.0 — Dependency Report (Phase 2)

**Scope:** every non-self resource the platform loads at runtime. Nothing
removed in this release — this is the map that authorizes future removal.

## External resources (measured from index.html + CSP)

| Resource | Origin | Used for | Classification |
|---|---|---|---|
| Tailwind CSS (pinned `3.4.16`) | `cdn.tailwindcss.com` | All utility styling | **Replaceable** — compile locally (CLI) to a committed `assets/css/tailwind.build.css`; drops the script + `'unsafe-inline'` style-src |
| Tailwind config | `assets/js/tailwind.config.js` (self) | Theme tokens | Required (local; folds into the compiled build) |
| Google Fonts CSS | `fonts.googleapis.com` | Orbitron, Share Tech Mono, Plus Jakarta Sans | **Replaceable** — self-host woff2 under `assets/fonts/` |
| Google Fonts files | `fonts.gstatic.com` | Font binaries | **Replaceable** — self-host |
| Telemetry probe targets | `http://localhost:3132`, `:4173` | Real node health (measured fetch) | **Optional** — probes degrade to OFFLINE if absent; no platform dependency |

## Internal resources (all self-hosted, zero external)
- 27 JS modules under `assets/js/` — no external imports, no CDN libraries.
- `assets/css/sys_os.css` — self.
- localStorage — local, no network.

## Network-dependency classification summary
- **Required (must stay):** none external. All business logic, storage, and
  validation run with zero network.
- **Replaceable (offline path exists):** Tailwind CDN, Google Fonts → local
  compile/self-host (v3.0.x task).
- **Optional (graceful absence):** telemetry probe targets.
- **Removeable now:** nothing (per directive — map only).

## Offline-readiness verdict
The data/business/validation tiers are **already fully local-first**. Only the
*presentation* tier (Tailwind + fonts) reaches the network, and both are
classified Replaceable with a known offline path. After the v3.0.x compile
step, SYS_OS runs with **zero external runtime dependencies**.

## CSP posture (current)
`script-src 'self' https://cdn.tailwindcss.com` · `style-src 'self'
'unsafe-inline' https://fonts.googleapis.com` · `font-src https://fonts.gstatic.com`
· `connect-src 'self' http://localhost:3132 http://localhost:4173` ·
`object-src 'none'`. Post-compile target: drop the two font/CDN origins and
`'unsafe-inline'`.
