# SYS_OS v3.0 — System Map (Phase 8) · Master Blueprint

Measured at v3.0.0: **27 JS modules · 12 stations · 9 registry domains ·
6 persistence keys · boot gate 32 modules · integrity 88 links.**

## Layered module map (load order = dependency order)

```
TIER 0 — FOUNDATION
  config.js      CONFIG / UI / PROTOCOLS / COMMERCIAL — all constants (frozen)
  utils.js       el, notify, hash, hexToken, dateStamp, debounce
  money.js       integer-cents money safety
  storage.js     storage adapter (KV + query + registerBackend)   ← SQLite seam
  auth.js        roles, permissions matrix, attribution            ← identity seam

TIER 1 — DATA
  store.js       DataStore, SYSOS.stores, activity ledger, relations (8 link domains)
                 persist/restore → storage.js ; demo guard (_suspendPersist)

TIER 2 — DOMAIN ENGINES
  vault.js       documents, 5-stage pipeline, hash-chained audit
  registry.js    9 domains defined + seeded; Registry Grid station (06)
  commercial.js  lifecycle, proposals, contracts, forecast(cents), health, automation
  client.js      client workspace/metrics/report; Client Center station (08)
  telemetry.js   real fetch-probe node health
  opsqueue.js    operations queue + retry
  routing.js     agent registry -> executable contracts
  compliance.js  due/remind/escalate scheduler
  ocr.js         OCR framework on vault hooks
  exec.js        executive metrics feed (architect core)

TIER 3 — EXECUTIVE / UI
  commercial_ui.js  admin forms (station-contract, panel-scoped)
  executive.js      metrics / systemHealth / operatorWorkspace / timeline / reports
  executive_ui.js   stations 09 Dashboard · 10 Operator · 11 Timeline · 12 Health
  demo.js           DEMO/LIVE full sandbox (suspends all persistence)

TIER 4 — VALIDATION / BOOT
  smoketest.js   18 subsystem tests + 6 failure drills
  maintenance.js 10-check validation sequence
  bootcheck.js   32-module pre-boot manifest gate (halt on failure)
  main.js        boot orchestration + delegated [data-action] dispatch
```

## Stations (router-registered, uniform contract)
01 Architect · 02 CEO · 03 COO · 04 Vault · 05 Legacy Shield · 06 Registry Grid
· 07 Live Ops · 08 Client Center · 09 Dashboard · 10 Operator · 11 Timeline ·
12 System Health.

## Stores (persistence keys)
`sysos.registry.v1` (9 domains) · `sysos.activity.v1` · `sysos.vault.v1` ·
`sysos.compliance.sched.v1` · `sysos.ocr.v1` · `sysos.opsqueue.v1` — all routed
through the storage adapter.

## Relationship engine
`LINK_DOMAINS = [projects, workflows, agents, documents, clients, proposals,
contracts, compliance]`. `relations.find/resolve/backlinks/linkStats/integrity`
resolve every domain symmetrically (88 links, 0 broken).

## Pipelines & automation
- Vault ingestion: INTAKE→CLASSIFY→HASH→INDEX→SEAL (hash-chained).
- Commercial: lifecycle (8 stages) · proposal automation (expiry thresholds
  30/14/7/3/1, auto-sweep) · contract monitoring (expiry + renewal).
- Revenue: forecast (cents) + by client/status/stage.

## Reports
executive · client · pipeline · compliance · system-health (text, live data).

## Validation & health
Boot gate (32 modules) → smoke (18) → maintenance (10) → System Health station
(8 subsystem GREEN/YELLOW/RED) → failure drills (6). Self-reporting.

## Cross-cutting seams (v3.0 additions)
- **Storage:** every store ⇄ `storage.js` ⇄ backend (localStorage today, SQLite swappable).
- **Identity:** `auth.js` gates privileged actions + attributes audit metadata.
- **Sandbox:** `demo.js` flips `stores._suspendPersist`, isolating ALL stores.

## Data flow (mutation)
`UI/API → auth.can() → DataStore.create/update → persistAll() → storage.set()
→ backend` ; emits `sysos:data` → stations refresh → `relations`/`exec`/`health`
recompute from live state.
