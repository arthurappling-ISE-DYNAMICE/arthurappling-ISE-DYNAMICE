# SYS_OS — SYSTEM ARCHITECTURE
**Version:** 2.9.0 (LIVE_OPERATIONS) · **Verified:** 2026-06-12

## 1. Overview

SYS_OS is the Prime Pathwy command deck: a sovereign, zero-build, static web
platform. No bundler, no framework, no server-side code — every module is a
plain script served as-is. The only external dependencies are a **pinned**
Tailwind CDN build (3.4.16) and Google Fonts, both fenced by CSP.

```
tools/command_deck/
├── index.html                  Markup shell only — zero inline JS handlers
├── index_v1.html               Archive (v1)
├── index_v2.5.html             Archive (v2.5 "AI OS COMMAND DECK")
├── index_v2.6.html             Archive (v2.6 "SYSTEM ARCHITECTURE OS" monolith)
├── assets/
│   ├── css/sys_os.css          Scanlines, scrollbars, focus-visible, reduced-motion
│   └── js/
│       ├── tailwind.config.js  Theme extension (full gold palette incl. 950)
│       ├── config.js           SYSOS.CONFIG / SYSOS.UI / SYSOS.PROTOCOLS — ALL constants
│       ├── utils.js            DOM helpers, toasts, SHA-256(+FNV fallback), crypto IDs
│       ├── store.js            v2.8 DATA LAYER: DataStore (persistent CRUD), activity ledger, relations
│       ├── canvas.js           Neural canvas engine (pause/resume architecture)
│       ├── router.js           Station router + runtime registration contract
│       ├── terminal.js         Agent terminal component (CEO/COO from protocol config)
│       ├── vault.js            Knowledge Vault engine (operational taxonomy + links) + station UI
│       ├── registry.js         Six DataStore registries, real seeds, Registry Grid CRUD station
│       ├── exec.js             Executive Command Center — metrics computed from live state
│       ├── telemetry.js        v2.9: real fetch-probe node health (measured RTT)
│       ├── opsqueue.js         v2.9: persistent operations queue + retry state machine
│       ├── routing.js          v2.9: Agent Registry -> executable routing contracts
│       ├── compliance.js       v2.9: compliance scheduler (due/remind/escalate)
│       ├── ocr.js              v2.9: OCR framework on existing vault hooks (no provider)
│       ├── liveops.js          v2.9: LIVE OPS station (07)
│       └── main.js             Bootstrap + delegated [data-action] dispatch
├── archives/v2.7.0/            Complete v2.7 build snapshot (shell + modules)
├── archives/v2.8.0/            Complete v2.8 build snapshot (shell + modules)
└── docs/                       Doc set + AUDIT_v2.6 + OPERATIONAL_TRUTH_v2.8 + LIVE_OPERATIONS_v2.9
```

## 2. Module Contract

Everything lives under one namespace: `window.SYSOS`. Script load order in
index.html **is** the dependency graph: config → utils → canvas → router →
terminal → vault → registry → main. Each module is an IIFE in strict mode;
no module touches the DOM before `main.js` boots it.

| Namespace | Module | Responsibility |
|---|---|---|
| `SYSOS.CONFIG` / `SYSOS.UI` / `SYSOS.PROTOCOLS` | config.js | Frozen constants. The only place numbers/copy live. |
| `SYSOS.utils` | utils.js | `el()`, `notify()`, `hash()`, `hexToken()`, `dateStamp()`, `debounce()` |
| `SYSOS.DataStore`, `SYSOS.stores`, `SYSOS.activity`, `SYSOS.relations` | store.js | Persistent CRUD collections, mutation events (`sysos:data`), activity ledger, link resolution + integrity scan |
| `SYSOS.canvas` | canvas.js | `init/pause/resume/freezeFrame/status` |
| `SYSOS.router` | router.js | `init/switch(id)/register(def)`, `sysos:station` events |
| `SYSOS.Terminal`, `SYSOS.mountTerminals` | terminal.js | Console rendering + dispatch |
| `SYSOS.vault` | vault.js | Documents (7-category taxonomy, entity links), index, audit chain, evidence, OCR hooks, search |
| `SYSOS.registriesData`, `SYSOS.registriesInit` | registry.js | Six DataStore registries (real seeds) + Registry Grid CRUD station |
| `SYSOS.exec` | exec.js | Executive metrics computed from live state + activity feed |
| `SYSOS.telemetry` | telemetry.js | `init/probe/probeAll/startAuto/stopAuto/snapshot/summary` — measured node health |
| `SYSOS.opsQueue` | opsqueue.js | `enqueue/run/runPending/retry/remove/list/stats` — persistent queue state machine |
| `SYSOS.routing` | routing.js | `buildFromRegistry/bind/resolve/dispatch/list/stats` — agent execution contracts |
| `SYSOS.compliance` | compliance.js | `schedule/complete/statusOf/reminders/list/summary` — scheduler over compliance registry |
| `SYSOS.ocr` | ocr.js | `upload/process/store/registerProvider/list/stats` — vault-hooked OCR framework |

## 3. Boot Sequence (main.js)

1. `bindMetrics()` — every `[data-metric]` node is filled from `CONFIG.METRICS`;
   `[data-version]` badges filled from `CONFIG.VERSION`.
2. `bindActions()` — one delegated `click` listener routes `[data-action]`
   (`ping-node`, `global-audit`, `vault-ingest`, `asset-optimize`).
3. `SYSOS.canvas.init()` — static frame if `prefers-reduced-motion`.
4. `SYSOS.router.init()` — adopts all `[data-station-panel]` elements.
5. `SYSOS.mountTerminals()` — CEO/COO consoles generated from `PROTOCOLS`.
6. `SYSOS.registriesData()` — restore-or-seed all six registries + activity
   ledger from `sysos.registry.v1` / `sysos.activity.v1` (seedVersion-guarded).
7. `await SYSOS.vault.init()` — restore-or-seed documents + audit chain
   (with v2.7→v2.8 category/link migration); render.
8. `SYSOS.registriesInit()` — Registry Grid station registered **at runtime**
   (the reference implementation of station expansion), CRUD UI wired.
9. `SYSOS.exec.init()` — Executive Command Center; re-renders on every
   `sysos:data` / `sysos:activity` / `sysos:vault:ingested` event.

## 4. Station Expansion Contract

```js
SYSOS.router.register({
    id: 'mystation',                 // unique
    label: '07 // MY STATION',       // sidebar text
    render(panel) { /* fill panel */ }
});
```
The router builds the nav button (correct base + inactive state classes from
`SYSOS.UI`), the panel container, and wires switching. Station 06 (Registry
Grid) is created exactly this way — if it renders, the contract works.

## 5. Vault Engine Data Flow

```
ingest(meta)
  INTAKE   doc skeleton, source, OCR-requirement detection (.png/.jpg/.pdf/.tiff/.heic)
  CLASSIFY rule-based taxonomy: SOP | AGENT | CONTRACT | EVIDENCE | INTEL | TOOL | UNCLASSIFIED
  HASH     SHA-256 (WebCrypto; FNV-1a labeled fallback off secure contexts)
  INDEX    inverted token index (prefix-matched by search()); OCR queue admission
  SEAL     audit-chain entry: { seq, ts, action, docId, payloadHash, prevHash, entryHash }
```
- Every stage exposes a hook: `SYSOS.vault.use('classify', fn)`.
- The chain is tamper-evident: `verifyChain()` recomputes every entry hash and
  link; the Vault "Index State" card displays HEALTHY/DEGRADED from this.
- `attachEvidence(docId, record)` seals evidence records into the chain.
- `registerOCRProvider(provider)` promotes `AWAITING_PROVIDER` docs to `QUEUED`.
- State persists in `localStorage["sysos.vault.v1"]`; the token index is
  rebuilt from documents on restore (never serialized).
- Displayed row count = `LEGACY_BASELINE_ROWS (35) + documents.size`.

## 6. Registry Framework (v2.8 — persistent system of record)

Six `DataStore` instances: **projects, agents, workflows, sops, intelligence,
compliance** — 32 real Prime Pathwy records seeded at first boot. Full CRUD:

```js
SYSOS.stores.all.projects.create({ name, category, status, priority, owner, ... })
SYSOS.stores.all.projects.update(id, patch)     // updatedAt maintained
SYSOS.stores.all.projects.archive(id)           // retained, excluded from default lists
SYSOS.stores.all.projects.remove(id)
SYSOS.stores.all.projects.list({ status, query, includeArchived })
```

Every entity carries `links: { projects, workflows, agents, documents }`.
`SYSOS.relations.resolve(domain, id)` resolves forward links;
`backlinks(id)` resolves reverse references; `integrity()` scans every link
in registries **and** vault documents and reports broken references —
this is what the INITIALIZE INTEGRITY AUDIT button actually runs.

All domains persist write-through to `localStorage["sysos.registry.v1"]`
(seedVersion-guarded). Every mutation lands in the activity ledger
(`sysos.activity.v1`, capped) and fires `sysos:data` for live UI refresh.
The Registry Grid station provides search, status filtering, a relationship-
resolving detail panel for all domains, and full project CRUD with a
two-step non-blocking delete confirm.

## 7. Security Model

| Control | Implementation |
|---|---|
| XSS | All user input rendered via `textContent` (`utils.el`). `innerHTML` only ever receives frozen config templates. Verified with a live hostile-payload test. |
| CSP | `<meta>` policy: scripts only from self + pinned Tailwind CDN; no inline script; `object-src 'none'`; `base-uri 'self'`. |
| Supply chain | Tailwind pinned to 3.4.16 (no floating "latest"). |
| Integrity | Hash-chained vault ledger; FNV fallback is explicitly labeled in `hashAlgo`, never silently. |
| IDs | `crypto.getRandomValues` document IDs. |

## 8. Rendering & Performance Model

- Canvas: 30fps cap, time-normalized motion (speed identical at any refresh
  rate), squared-distance link pass (no sqrt), DPR-aware backing store (≤2x),
  auto-pause on hidden tab, `freezeFrame()` for capture tooling.
- No `alert()` anywhere — `SYSOS.utils.notify()` toasts (aria-live) only.
- Terminal logs hard-capped at 60 entries; ingestion pulse animations
  terminate after 2.5s.
