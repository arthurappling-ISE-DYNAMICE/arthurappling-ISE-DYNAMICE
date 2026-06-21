# SYS_OS v3.5 — Table Pagination Closure (Phases 4–5)

Records the verified state of table pagination across the platform. Phase 5
(proposal + contract tables) required **no new code**: proposals and contracts
have no standalone table surface — they render exclusively through the Registry
Grid `renderTable` (registry.js), which Phase 4 paginated uniformly for every
domain. This was confirmed by source audit and measured at scale.

## Ground-truth audit (why Phase 5 added no code)
A grep across all 33 JS modules found the **only** table that renders proposal
or contract rows is `registry.js renderTable`:
- `commercial_ui.js` — create/edit forms + dropdown options only (no table).
- `client.js` — bounded per-client workspace groups (dashboard scope, excluded).
- `executive.js` / `maintenance.js` — read `.entries.size` only (no table).

This matches `TABLE_RENDERING_REVIEW_v3.4.md`: *"Proposals — via Registry Grid,
same renderTable path"* and *"Contracts — via Registry Grid, same renderTable
path."* Building separate proposal/contract tables would be a redesign + new
feature, which the v3.5 mission forbids (additive only, no redesign, no
placeholders). Closed as already-satisfied per architect decision.

## Measured pagination state (page size 25)
All tests fenced with `SYSOS.stores._suspendPersist = true` (localStorage never
written); records removed after; integrity restored to 88/0; counts restored.

| Table (domain) | Surface | Test scale | DOM rows rendered | Pages | NEXT/PREV | Cleanup |
|---|---|---|---|---|---|---|
| Client list | client.js (v3.3) | — | 25/page | n/a | ✅ | n/a |
| Registry — projects | registry.js renderTable (Phase 4) | 308 | **25** | 13 | ✅ 26–50 / 1–25 | → 8 |
| Registry — **proposals** | registry.js renderTable (Phase 4) | 301 | **25** | 13 | ✅ 26–50 / 1–25 | → 2 |
| Registry — **contracts** | registry.js renderTable (Phase 4) | 301 | **25** | 13 | ✅ 26–50 / 1–25 | → 1 |

Count display per page: `{from}–{to} of {filtered} filtered · {total} total ·
pg {n}/{pages}`. Search/filter apply to the full dataset at the data layer
(`store.list(currentFilter())`) before the page slice. No off-page DOM rows.

## Verification (post-audit, no code changed this phase)
- Lazy render preserved (registries 0 children until first activation).
- Refresh @301 records: proposals 3.0 ms, contracts 2.6 ms.
- Regression anchors: smoke 18/18 · drills 6/6 · maintenance 10/10 · integrity
  88/0 · boot gate 36/0.
- localStorage unpolluted (38 registry records, proposals 2, contracts 1).

## Remaining (Phase 6, not started)
Vault ledger pagination — the only remaining table that renders all rows
(`vault.js renderAll`, low risk at 3 docs today). Out of scope until approved.
