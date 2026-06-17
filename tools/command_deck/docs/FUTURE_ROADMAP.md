# SYS_OS — FUTURE ROADMAP

## v2.8.x — Patch Track
- Cascade-or-block semantics for deletes that leave dangling links (today:
  detected by integrity scan, rendered [MISSING] — operator decides).
- CRUD UI for agents and workflows (engine already supports it; projects-only
  was the v2.8 UI scope).
- Link editor in the project form (links are API-managed today).
- Vault export/import UI (engine `exportState()` exists — surface it).

## v2.9 — LIVE OPERATIONS · DELIVERED 2026-06-12
Shipped: real fetch-probe telemetry, persistent operations queue with retry,
agent routing contracts, compliance scheduler (due/remind/escalate), and the
OCR framework on existing vault hooks. See LIVE_OPERATIONS_v2.9.md. Remaining
items below rolled into v3.0.

## v3.0 — SOVEREIGN COMPILE (recommended major)
0. **Bind live executors.** Replace routing.js `defaultInvoke` stubs with live
   agent endpoints (Claude/Gemini) via `routing.bind()`; ship an OCR provider
   (Tesseract-WASM) into the v2.9 framework. Both seams already exist — this is
   wiring, not architecture.
1. **Kill the CDN.** Compile Tailwind locally (CLI, one-shot, committed
   output). Removes the last runtime third-party script, allows dropping
   `'unsafe-inline'` from style-src, and enables full offline operation.
   Self-host the three font families the same pass.
2. **SQLite system of record.** The real data vault (`data/`, commit
   ef7f0dda) behind a thin local API; localStorage demotes to offline cache.
   Removes the ~5MB ceiling and enables multi-device state.
3. **Vector search.** Embedding index attached at the vault `index` hook —
   semantic retrieval over documents; the inverted index remains the exact-
   match layer.
4. **Multi-operator state.** Auth on the local API; per-operator identities
   sealed into the audit chain.
5. **Station SDK.** Formalize `router.register()` + a station manifest
   (id, label, permissions, persistence needs) so new stations ship as single
   drop-in module files.
6. **Test harness.** Headless smoke suite that runs the MAINTENANCE_GUIDE
   verification checklist automatically (the freezeFrame API makes visual
   diffing deterministic).

## Standing Non-Goals
- No framework adoption (React/Vue/etc.) — the zero-build constraint is a
  sovereignty feature, not a gap.
- No external analytics/telemetry — ever.
