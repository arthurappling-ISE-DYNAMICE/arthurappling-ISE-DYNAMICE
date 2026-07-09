# SYS_OS v3.6 — Verified vs Assumed (Phase 4)

Strict separation of what is **proven by testing** from what **appears present
but is not proven**. Evidence is from live probes on v3.5.0 this audit plus the
measured v3.5 phase verifications.

## VERIFIED (proven by testing)
- **Boot integrity:** 36/36 modules, 13 stations, 0 boot errors (console).
- **Regression battery:** smoke 18/18, drills 6/6, maintenance 10/10, integrity
  88 links / 0 broken, vault chain valid — re-measured this audit.
- **Persistence round-trip:** a created client survived a full reload; baseline
  restored on cleanup. DataStore normalized per-domain keys.
- **Commercial CRUD:** client/project/proposal/contract create execute; forecast,
  contract monitoring, client dashboard/workspace compute.
- **Vault pipeline:** ingest → classify → hash (SHA-256, secure context) → index
  → seal; chain verifies; search works.
- **Vault hardening (H1–H5):** central audit bridge records `document.*` events;
  hash-mode WARNING on weak/non-secure; guarded reset (admin+token+snapshot);
  corrupt-restore quarantine; RBAC on evidence + OCR provider. All re-confirmed.
- **Session + RBAC:** session persists/restores/clears; lock/unlock; READ_ONLY
  writes denied with structured results + audit; ADMINISTRATOR boot default.
- **Table pagination:** registry (and proposals/contracts via the same path) cap
  the DOM to 25 rows/page at 300+ records.
- **Telemetry:** real `fetch` probes; nodes reflect true reachability.
- **Demo isolation + SQLite swap:** demo suspends persistence and restores;
  swap API present and round-trip verified (v3.1.1/v3.2).
- **Audit-of-record:** append-only central audit; query + reportText work; events
  survive reload.

## ASSUMED (present but NOT proven by this audit)
- **CEO/COO console "execution":** buttons emit scripted protocol output. No real
  backend work occurs — **assumed-only as operational capability** (it is a demo
  surface, verified as such).
- **Legacy Shield "OPTIMIZE ALLOCATION MATRIX":** no allocation engine exists;
  cosmetic. Any capital-optimization behavior is **assumed/absent**.
- **OCR text extraction in production:** only a local stub was tested. A real
  provider (Tesseract/remote) is **not shipped** — extraction quality, file
  handling, and large-file behavior are **assumed/untested**.
- **SQLite at scale / as the live backend:** swap works in test; running the
  platform on SQLite as the durable production store across sessions is **not
  proven** here.
- **Multi-user / concurrent operation:** single sovereign operator only. Any
  multi-operator behavior is **assumed/absent** (no account system).
- **Cross-browser / cross-device persistence:** localStorage is per-origin/
  per-browser; sync across machines is **assumed/absent**.
- **Real telemetry endpoints (betting_engine :3132, hyperframes):** probe logic
  verified; the *services themselves* being healthy is **environment-dependent**
  (:3132 measured OFFLINE — a true negative, not a SYS_OS fault).
- **Production hardening:** no server, no HTTPS deployment, no backup/restore-
  from-snapshot function, no rate limiting, no external auth — all **assumed/
  absent** for production.
- **Data volume beyond low thousands:** pagination tested at ~300/domain;
  behavior at 10k+ records or large vaults is **assumed** (H7 deferred).

## Rule applied
Anything not directly executed-and-observed this audit (or in a cited measured
phase) is listed under ASSUMED. No capability is claimed on appearance alone.
