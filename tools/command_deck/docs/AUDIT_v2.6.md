# SYS_OS v2.6 — ARCHITECTURAL AUDIT REPORT

**Auditor:** Lead Systems Architect (Claude, Fable 5)
**Date:** 2026-06-11
**Subject:** `tools/command_deck/index.html` @ v2.6 (single-file build, ~700 lines)
**Disposition:** Findings only. No code modified during this phase.

---

## 1. Dead Code & Orphaned Utilities

| ID | Severity | Finding |
|----|----------|---------|
| F-01 | Low | `group` class applied to metric card 1 and all three node-monitor rows, but **no `group-hover:` variant exists anywhere** in the file. Orphaned Tailwind utility on 4 elements. |
| F-02 | **High (silent bug)** | Classes `from-gold-950/10` (P2 directive card) and `bg-gold-950/40` (ingested-row badge) reference `gold-950`, **which is not defined in the Tailwind config** (only 400/500/600 declared). Tailwind has no default `gold` palette, so these classes silently generate nothing. The P2 card gradient and ingestion badge background never rendered as designed. |
| F-03 | Low | `substr()` in `runIngestionSimulator()` is a deprecated API (Annex B). |

## 2. Duplicate Functions & Structures

| ID | Severity | Finding |
|----|----------|---------|
| F-04 | High | CEO and COO station markup is **~95% identical** (~120 duplicated lines). Any styling change must be made twice; drift is inevitable. |
| F-05 | High | `sendStrategicPreset()` and `fireCustomInputDirective()` share ~80% of their log-rendering logic, duplicated inline. |
| F-06 | Medium | Tailwind class strings for nav buttons are **duplicated between HTML and JS** — `switchStation()` rebuilds the full `className` string. HTML and JS class definitions can silently diverge (single point of failure for theme integrity). Same pattern in `pingSystemNode()`. |

## 3. Unused / Fragile Variables & Selectors

| ID | Severity | Finding |
|----|----------|---------|
| F-07 | Medium | `switchStation()` locates the active bar via `btn.querySelector('.w-1')` — a width utility class used as a behavioral hook. Any future `w-1` element inside a nav button gets destroyed. |
| F-08 | Low | Document IDs generated with `Math.random().toString(16).substr(2,6)` — non-crypto randomness, no collision guard. Acceptable for mock; flagged for ledger-grade use. |
| F-09 | Low | `new Date().toISOString()` for document IDs uses **UTC**, not local time — IDs roll the date at 4–5 PM Pacific. |

## 4. Unused Event Listeners & Memory Leaks

| ID | Severity | Finding |
|----|----------|---------|
| F-10 | Medium | Terminal chat logs grow **unbounded** — every preset/custom directive appends DOM nodes forever. Long sessions accumulate without cap. |
| F-11 | Medium | Ingested vault rows carry `animate-pulse` **permanently** — every ingestion adds another infinite CSS animation that never stops compositing. |
| F-12 | Medium | `requestAnimationFrame` loop has no pause/cancel path: no handle stored, no `visibilitychange` hook, no API to stop it. The loop is immortal by construction. |
| F-13 | Low | 5 inline `onclick` handlers per station + per node row — not leaks, but uncountable and untestable; no central event registry. |

## 5. Rendering Bottlenecks & Animation Inefficiencies

| ID | Severity | Finding |
|----|----------|---------|
| F-14 | **High (operationally confirmed)** | Neural canvas runs an **uncapped 60fps rAF loop that never idles**, which is the verified root cause of screenshot/automation capture timeouts (renderer never reaches a stable frame). Confirmed during v2.6 deployment verification. |
| F-15 | Medium | Link-web pass uses `Math.hypot()` (forces sqrt) inside an O(n²) loop — ~990 sqrt calls/frame at 60fps. Squared-distance comparison eliminates all of them. |
| F-16 | Medium | No `devicePixelRatio` handling — canvas renders at CSS resolution and is **blurry on HiDPI displays**. |
| F-17 | Medium | `alert()` used in 3 functions — blocks the main thread, freezes the canvas, halts automation, and is the secondary screenshot-hang vector. |
| F-18 | Low | Point velocities are per-frame, not time-normalized — drift speed varies with display refresh rate (gaming monitors at 120Hz double the animation speed). |

## 6. Accessibility Failures

| ID | Severity | Finding |
|----|----------|---------|
| F-19 | High | Terminal logs have **no `aria-live`/`role="log"`** — screen readers never announce agent responses. |
| F-20 | High | Terminal inputs **cannot be submitted with Enter** — no form element, no keydown handler. Keyboard users must Tab to EXECUTE. |
| F-21 | Medium | `focus:outline-none` on inputs with only a border-color change — insufficient visible focus indication. No `:focus-visible` treatment anywhere. |
| F-22 | Medium | No `<h1>`; heading hierarchy starts at `<h3>`. Nav buttons lack `aria-current`. Inputs lack accessible names (placeholder-only). |
| F-23 | Medium | `animate-ping`/`animate-pulse`/canvas drift do not respect `prefers-reduced-motion`. |
| F-24 | Low | `text-slate-600` labels on near-black (~3.6:1) and `placeholder-slate-700` fall below WCAG AA 4.5:1 for small text. |

## 7. Responsiveness Issues

| ID | Severity | Finding |
|----|----------|---------|
| F-25 | High | Sidebar is fixed `w-80` with **no breakpoint behavior** — on narrow viewports it consumes 320px and crushes the main viewport. Station grids are responsive; the shell is not. |
| F-26 | Low | Terminal stations hard-code `h-[650px]` — overflow on short viewports (laptops at 125% zoom). |

## 8. Security Concerns

| ID | Severity | Finding |
|----|----------|---------|
| F-27 | **Critical** | `fireCustomInputDirective()` interpolates **raw user input into `innerHTML`** twice (architect echo + core response). Direct DOM-XSS vector: `<img src=x onerror=alert(1)>` executes. |
| F-28 | Medium | `cdn.tailwindcss.com` loaded **unpinned** — serves whatever version Tailwind publishes; no SRI possible on the dynamic endpoint. Supply-chain drift risk. |
| F-29 | Medium | No Content-Security-Policy of any kind. |
| F-30 | Low | Google Fonts at runtime — external availability + privacy dependency for a sovereignty-branded system. |

## 9. Maintainability Risks

| ID | Severity | Finding |
|----|----------|---------|
| F-31 | High | Single-file monolith: markup, theme, copy, business rules, and engine code in one artifact. No separation of concerns; merge conflicts guaranteed at scale. |
| F-32 | High | All constants are magic numbers inline: `140` (link distance), `45` (points), `500/600/800` (timeouts), `38` (row baseline), `0.4` (drift). No central configuration. |
| F-33 | Medium | Agent response logic is hardcoded `payloadText.includes(...)` conditionals inside the render function — content and engine are fused. |
| F-34 | Medium | No documentation artifacts of any kind (architecture, deployment, maintenance, versioning). |
| F-35 | Medium | Vault is presentation-only: no data model, no persistence, no classification, no real hashing — the table **is** the database. |

---

## Verdict

v2.6 is a **verified, visually complete presentation layer** with zero underlying platform architecture. The critical path for production hardening:

1. **F-27** (XSS) — fix before anything else.
2. **F-14/F-17** (canvas + alert) — root cause of the known capture instability.
3. **F-31/F-32** (monolith/magic numbers) — prerequisite for every later phase.
4. **F-02** (silent gold-950 bug) — restore intended design.

All 35 findings are dispositioned in v2.7.0. See `VERSION_HISTORY.md` for the remediation map.
