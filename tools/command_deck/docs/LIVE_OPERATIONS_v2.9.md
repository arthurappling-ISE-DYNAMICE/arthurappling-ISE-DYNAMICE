# SYS_OS v2.9.0 — LIVE OPERATIONS

**Build:** 2.9.0 LIVE_OPERATIONS · **Verified:** 2026-06-12 (live, port 4173)
**Premise:** purely additive over the verified v2.8 system of record. No v2.8
module was modified except `config.js` (new constant blocks), `main.js` (boot
extension), and `index.html` (CSP connect-src, version badge, 6 script tags).

---

## Modules (6 new)

| Module | Namespace | Responsibility | Persist key |
|---|---|---|---|
| telemetry.js | `SYSOS.telemetry` | Real fetch-probe node health, measured RTT | (in-memory) |
| opsqueue.js | `SYSOS.opsQueue` | Operations queue state machine + retry | `sysos.opsqueue.v1` |
| routing.js | `SYSOS.routing` | Agent registry → executable contracts | (derived) |
| compliance.js | `SYSOS.compliance` | Due dates, reminders, escalation | `sysos.compliance.sched.v1` |
| ocr.js | `SYSOS.ocr` | Upload→Process→Extract→Store→Link framework | `sysos.ocr.v1` |
| liveops.js | `SYSOS.liveOpsInit` | LIVE OPS station (07) UI | — |

Boot order appended in `main.js`: telemetry → opsQueue → routing → compliance
→ ocr → liveOpsInit → first telemetry sweep. Station 07 is registered through
the existing `router.register()` expansion contract (no markup added).

## 1. Real Telemetry Layer

Each node probe is a real `fetch()` timed with `performance.now()`, bounded by
an `AbortController` (`PROBE_TIMEOUT_MS`). Status is **observed**:
- `ONLINE` reachable, RTT ≤ `DEGRADED_MS`
- `DEGRADED` reachable, RTT > `DEGRADED_MS`
- `OFFLINE` network error / timeout
- `CHECKING` / `UNKNOWN` transient / never probed

Same-origin nodes read true HTTP status; cross-origin nodes use `mode:'no-cors'`
and measure **reachability + RTT** (opaque response) — honest measured liveness
within browser security limits, documented as such. `CONFIG.TELEMETRY.NODES`
defines targets; CSP `connect-src` lists `http://localhost:3132` and `:4173`.
Optional background sweep via `startAuto()`/`stopAuto()`.

**Measured at verification:** command_deck ONLINE **5ms**, hyperframes ONLINE
**10ms**, betting_engine **OFFLINE/unreachable** (port 3132 not running — a true
negative, proving the probe is real, not scripted).

## 2. Operations Queue

State machine `PENDING → RUNNING → COMPLETED | FAILED`, with
`FAILED → retry → PENDING` (bounded by `MAX_RETRIES`). Each op carries an
`executor` key resolved through the routing layer. Persistent, capped (`CAP`),
activity-logged on every transition, crash-safe (RUNNING ops revert to PENDING
on restore). API: `enqueue, run, runPending, retry, remove, get, list, stats`.

**Verified:** dispatch→run→COMPLETED (routed to research_agent); bad-executor
op→FAILED→retry→PENDING; survived reload with completed state intact.

## 3. Agent Routing Layer

`buildFromRegistry()` projects every Agent Registry entry into a routing
contract `{ executorKey, agentId, role, status, executable, invoke }`. ACTIVE
agents are `executable`; PROVISIONED agents are routable-but-not-yet-executable.
The **registry remains the source of truth** — routing reads it and rebuilds on
any `sysos:data` agent mutation; it never writes registry schema. `bind()` is
the v3.0 attachment point: swap `invoke()` for a live endpoint with zero change
to the queue or registry.

**Verified:** 7 contracts (5 executable, 2 provisioned) — matches the 7-agent
registry (5 ACTIVE, 2 PROVISIONED).

## 4. Compliance Scheduler

Scheduling layer keyed by compliance-record id in its own store — the
Compliance Registry schema is untouched. Derived state vs the live clock:
`CLEAR / DUE_SOON (≤ DUE_SOON_DAYS) / ESCALATED (≤ ESCALATE_DAYS or overdue) /
COMPLETED / UNSCHEDULED`. `reminders()` returns the open window; every schedule
and completion is activity-logged.

**Verified:** cert_rehab_petition **ESCALATED (1d)**, uei_registration
**DUE_SOON (8d)**, sbdc_pitch **COMPLETED** — all computed from seeded real
obligations; survived reload.

## 5. OCR Framework (framework only — no provider shipped)

Pipeline `UPLOAD → QUEUED → PROCESSING → EXTRACTED → STORED`. PROCESSING
delegates to a provider registered through the **existing v2.7 vault hook**
`SYSOS.vault.registerOCRProvider()`. With no provider, jobs park at
`AWAITING_PROVIDER` (the audited contract). `store()` ingests extracted output
through the real vault pipeline (hash + audit chain + relationship links), so
OCR output is a first-class vault document. `MAX_FILE_KB` guard; real `<input
type=file>` upload + synthetic-descriptor path for testing.

**Verified:** upload→process with no provider → `AWAITING_PROVIDER`; register
stub provider→process → `STORED` with a real vault docId present in
`SYSOS.vault.documents`; job survived reload.

---

## v2.8 Preservation (measured post-v2.9)

| Invariant | Result |
|---|---|
| Registry records | 32 (unchanged) |
| Vault audit chain | valid, brokenAt null |
| Relationship integrity | 0 broken (75 links checked; +1 vs baseline from the OCR-stored doc's project link) |
| All six registries / persistence / relationships / docs | intact |
| Boot errors | none |

## Known boundaries (accepted for v2.9)
- Routed executors are local deterministic stubs (the contract layer); live
  agent endpoints are v3.0 via `routing.bind()`.
- No OCR provider ships (framework only, by directive).
- Cross-origin telemetry measures reachability+RTT, not HTTP status (browser
  opaque-response limit).
- Auto-telemetry sweep is opt-in (`startAuto()`), off by default.
