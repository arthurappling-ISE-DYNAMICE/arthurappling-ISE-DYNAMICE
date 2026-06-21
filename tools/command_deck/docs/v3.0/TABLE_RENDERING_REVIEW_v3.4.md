# SYS_OS v3.4.0 — Table Rendering Review (Phase 7)

Inspection only — no virtualization implemented this release. States current
behavior and risk per table, from source.

| Table | Station | Current row behavior | Risk @1,500 | Risk @5,000 | Paginate now? |
|---|---|---|---|---|---|
| Client list | Client Center (08) | **25-row pages** (v3.3) | none | none | done |
| Registry Grid | Registries (06) | renders ALL entries of the selected domain (`renderTable`) | **high** for clients/proposals/contracts domains (renders 500+ rows) | severe | **yes (next)** |
| Proposals | (via Registry Grid) | same `renderTable` path | high | severe | yes (with registry) |
| Contracts | (via Registry Grid) | same `renderTable` path | high | severe | yes (with registry) |
| Vault ledger | Knowledge Vault (04) | `renderAll` renders all documents | low now (3 docs) | high if doc count grows | yes when doc count climbs |
| Compliance | Live Ops (07) | renders full compliance list | low (small fixed set) | low | no |
| Ops queue | Live Ops (07) | `list().slice(0,12)` — already capped | none | none | already bounded |
| Timeline | Activity Timeline (11) | `slice(0,40)` — already capped | none | none | already bounded |
| Audit | (not rendered in a station) | API-only (`audit.query`) | n/a | n/a | n/a |

## Assessment
The **Registry Grid table is the one real exposure**: its `renderTable` renders
every record of the selected domain. With clients/proposals/contracts now able
to hold hundreds of records, opening that domain renders hundreds of DOM rows
synchronously. The client list already solved this with pagination; the same
pattern (filter/sort on full data → slice to a 25/50 page → Prev/Next + count)
should be lifted into `registry.js renderTable`.

## Safest implementation order (recommended, v3.5)
1. **Registry Grid pagination** — highest exposure, reuse the proven client-list
   pattern (data-level filter already exists in registry; add page slice).
2. **Vault ledger pagination** — when document count grows past ~100.
3. **Defer true virtualization** — pagination caps DOM nodes adequately to the
   low-thousands; windowed virtualization is only needed beyond that and adds
   scroll-position complexity. Not warranted now.

## Not changed this release
No table code modified in v3.4.0 (this is health-memoization scope). This
review is the input for the v3.5 table-pagination task.

---
**v3.5 UPDATE (addendum):** Registry Grid pagination shipped in Phase 4 and
applies uniformly to every domain — including proposals and contracts, which
share that single `renderTable` path. Phase 5 therefore added no code;
proposal/contract pagination is verified at 300+ records each. See
`PAGINATION_CLOSURE_v3.5.md` for the measured proof. Remaining: Vault ledger
(Phase 6).
