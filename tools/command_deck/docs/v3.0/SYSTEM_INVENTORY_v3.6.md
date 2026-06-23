# SYS_OS v3.6 — System Inventory (Operator Readiness Audit, Phase 1)

Audit of **SYS_OS v3.5.0** (SESSION_BOUND_RBAC_VAULT_HARDENING). Discovery only —
no code changed. Evidence: live router registry (13 stations), source modules,
and runtime probes on port 4173. Classification: **WORKING** (executed +
observed), **PARTIAL** (renders but simulated / limited), **UNTESTED**, **UNKNOWN**.

Platform shell: single-page app, 33 JS modules under `SYSOS.*`, boot gate 36
modules / 0 missing, 13 stations, localStorage persistence (storage adapter,
SQLite-swappable). Measured this audit: smoke 18/18, drills 6/6, maintenance
10/10, integrity 88/0, vault chain valid.

| # | Station (id) | Purpose | Module(s) | Data deps | Inputs | Outputs | Operator actions | Status |
|---|---|---|---|---|---|---|---|---|
| 01 | Architect Core (`architect`) | Command HUD: telemetry metrics, node monitor, governance, integrity audit | `index.html`, `config.js`, `telemetry.js`, `relations`/`store` | CONFIG metrics, registries, vault | clicks | metric cards, node status, audit toast | PING_NODE, INITIALIZE INTEGRITY AUDIT | **WORKING** |
| 02 | CEO Intel Console (`ceo`) | Strategic protocol console | `terminal.js`, `config.js` | CONFIG protocol scripts | button clicks | scripted terminal output | run 3 protocols + EXECUTE | **PARTIAL** (mock terminal — scripted responses, no real backend execution) |
| 03 | COO Deploy Console (`coo`) | Operational protocol console | `terminal.js`, `config.js` | CONFIG protocol scripts | clicks | scripted terminal output | run 3 protocols + EXECUTE | **PARTIAL** (mock terminal) |
| 04 | Knowledge Vault (`vault`) | Document ingestion, hash-chained ledger, search | `vault.js`, `ocr.js`, `utils.hash`, `storage` | `sysos.vault.v1` | ingest action, search input | ledger rows, chain state, counts | + INGEST_SPEC_DOCUMENT, search | **WORKING** (3 docs, chain valid; stores references not file bytes) |
| 05 | Legacy Shield (`shield`) | Capital asset register display | `index.html` (static) | none (static markup) | clicks | static asset cards | OPTIMIZE ALLOCATION MATRIX (cosmetic) | **PARTIAL** (static display; button is a notify, no allocation engine) |
| 06 | Registry Grid (`registries`) | System of record: 9 domains, CRUD, detail, pagination | `registry.js`, `store.js`, `relations` | `sysos.reg.*` | forms, search, filter, page | tables (25/page), detail panels | full CRUD (projects); view + paginate (all 9) | **WORKING** (projects full CRUD; other 8 domains view-only) |
| 07 | Live Ops (`liveops`) | Telemetry, ops queue, routing, compliance, OCR framework | `liveops.js`, `telemetry.js`, `opsqueue.js`, `routing.js`, `compliance.js`, `ocr.js` | node fetch, queue/sched keys | probe/dispatch/upload | node health, queue, OCR jobs | PROBE_ALL/PROBE, +DISPATCH, RUN_PENDING, route DISPATCH, compliance DONE, OCR upload/sample | **WORKING** (telemetry = real fetch; OCR framework has **no production provider** → parks AWAITING_PROVIDER) |
| 08 | Client Center (`clients`) | Commercial workspace: clients, proposals, contracts, health | `client.js`, `commercial.js`, `commercial_ui.js`, `healthcache.js` | `sysos.reg.{clients,proposals,contracts}` | forms, select, page | dashboards, workspace, reports | +CLIENT/+PROPOSAL/+CONTRACT, select, GEN_REPORT, paginate | **WORKING** (CRUD + reports verified) |
| 09 | Executive Dashboard (`dashboard`) | Computed exec metrics + demo toggle + text reports | `executive.js`, `executive_ui.js`, `demo.js` | live platform state | clicks | metric grid, reports, demo mode | TOGGLE DEMO/LIVE, EXECUTIVE/PIPELINE/COMPLIANCE/HEALTH reports | **WORKING** |
| 10 | Operator Workspace (`operator`) | Derived daily ops view (tasks, renewals, expirations) | `executive.js`, `executive_ui.js` | live state | none (read-only) | derived task lists | none (display only) | **WORKING** (read-only) |
| 11 | Activity Timeline (`timeline`) | Chronological activity ledger view | `executive.js`, `executive_ui.js`, `activity` | activity ledger | (filter) | event feed | view (read-only) | **WORKING** (read-only) |
| 12 | System Health (`syshealth`) | 8 subsystem GREEN/YELLOW/RED checks | `executive.js`, `executive_ui.js` | all subsystems | refresh | health bands | REFRESH | **WORKING** |
| 13 | Access Control (`access`) | Login, session, lock/unlock, permission matrix | `auth.js`, `auth_ui.js`, `audit.js` | `sysos.session.v1` | login form, clicks | session status, perm matrix | LOG IN, LOCK, UNLOCK, LOG OUT | **WORKING** (session persists; RBAC enforced) |

## Subsystem inventory (non-station engines)
| Subsystem | Module | Status | Evidence |
|---|---|---|---|
| DataStore / persistence | `store.js`, `storage.js` | WORKING | reload round-trip proven; normalized per-domain keys |
| SQLite backend swap | `sqlite_backend.js` | WORKING (API) | `migrateAndActivate`/`rollbackToLocal` present; round-trip verified in v3.1.1/v3.2 |
| Relations / integrity | `store.js` (relations) | WORKING | 88 links / 0 broken |
| Audit (central) | `audit.js` | WORKING | document/client/proposal/contract/compliance/lifecycle/system events |
| Auth / RBAC | `auth.js` | WORKING | matrix enforced; ADMINISTRATOR boot default (no default-deny) |
| Health engine | `commercial.js`, `healthcache.js` | WORKING | memoized health, distribution G/Y/R |
| Telemetry | `telemetry.js` | WORKING | real fetch probes; betting_engine :3132 measured OFFLINE (true negative) |
| OCR | `ocr.js` | PARTIAL | framework only — **no production provider ships** |
| Canvas background | `canvas.js` | WORKING | running, 30fps cap, reduced-motion aware |

## Notes (evidence-bound)
- **Mock terminals (02/03):** CEO/COO consoles render protocol buttons that emit
  scripted console output per `config.js` — presentation, not real execution.
- **OCR:** the pipeline is real and authorized, but with no provider bound, image/
  PDF jobs park at AWAITING_PROVIDER (by directive). Stub providers work in test.
- **Registry CRUD:** only the Projects domain has create/edit/archive/delete UI;
  the other 8 domains are view + paginate (records seeded/created via API).
- Nothing classified UNKNOWN — every station was activated and observed this audit.
