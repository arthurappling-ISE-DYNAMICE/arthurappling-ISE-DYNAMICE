# SYS_OS v3.5 — Pre-Build Baseline (Phase 1)

Measured live on **v3.4.0 "INCREMENTAL_HEALTH"** (port 4173) before any v3.5
change. Branch `clean-vault-deployment` @ `dae91a16`, origin in sync (ahead 0,
behind 0). Every value below was executed in-browser, not taken from prior
records (Zero-Inference).

## 1. Boot + module gate (measured)
| Metric | Value |
|---|---|
| Boot gate | **36 modules / 0 missing — PASS** |
| Boot DCL | 230.2 ms |
| Version reported | 3.4.0 (INCREMENTAL_HEALTH) |
| Stations (sidebar nav) | 13 |
| Dynamic stations rendered at boot | **0 of 8** (lazy render intact) |
| Storage backend | localStorage (14 normalized stores) |
| Registry records / vault docs / routing / telemetry | 38 / 3 / 7 / 3 |

## 2. Test battery (measured, this session)
| Suite | Result |
|---|---|
| Smoke (`smoketest.run`) | **18 / 18 PASS** (0 fail, 0 error) |
| Failure drills (`smoketest.failureDrills`) | **6 / 6 PASS** |
| Maintenance (`maintenance.run`) | **10 / 10 PASS — HEALTHY** |
| Relationship integrity | **88 links / 0 broken — valid** |
| Counts | clients 3, proposals 2, contracts 1 |

Maintenance detail (all PASS): registry 9 domains · 88 links/0 broken ·
14 stores (localStorage) · gate 36/0 · revenue projected $11,250 (cents-verified)
· health G1 Y1 R1 · vault chain 3 entries verified.

## 3. Operation timings @ 38 records (mean of 20 calls)
| Op | ms |
|---|---|
| executive.metrics() | 0.05 |
| healthDistribution() | 0.005 (cache hit) |
| client.dashboard() | 0.18 |
| integrity scan | 0.155 |
| commercial.health (single) | 0.005 (cache hit) |
| forecast() | 0.03 |

Health cache live: 3 cached clients, distribution cached, version 2 — the v3.4
memoization layer is active and serving hits.

## 4. RBAC — current state (measured, this session)
- Live default role on boot: **ADMINISTRATOR** (sovereign default, no login forced).
- `authUI.session` = `{ active:false, operator:null, since:null }` — **a session
  object exists but is inactive and NOT persisted.**
- Enforcement is real **for the active role**: forcing `READ_ONLY` then attempting
  `clients.create` → **denied** (`permission denied: client.create`) **and the
  audit ledger grew** (`permission_denied` recorded). Probe cleaned up (clients
  back to 3, no leak).
- **Gap (v3.5 target):** role is bound to a permissive default, not to an
  authenticated/persisted session. A reload returns to ADMINISTRATOR. This is the
  exact finding of `RBAC_SESSION_BINDING_PLAN_v3.4.md` §2.

## 5. Table rendering — current exposure (from review + source)
Per `TABLE_RENDERING_REVIEW_v3.4.md`: the **Registry Grid `renderTable`** path
(stations 06; also the surface for proposals/contracts domains) renders **all**
rows of the selected domain synchronously — the one real exposure at scale. The
Client Center list already paginates (25-row pages, v3.3). Vault ledger renders
all docs (low now at 3). v3.5 target: lift the proven client-list pagination
pattern into `registry.js renderTable`, then extend to proposal/contract/vault.

## 6. Archive integrity (measured)
v3.4.0 baseline is provably snapshotted and intact before modification:
- `index.html` ≡ `index_v3.4.0.html` ≡ `archives/v3.4.0/index.html`
  — all SHA256 `b168fb45…0caad5` (byte-identical).
- Module snapshot: 33 JS in both live and `archives/v3.4.0/assets/js/`.

## 7. Confirmed-intact subsystems (measured)
Lazy render (0/8 dynamic at boot) · RBAC enforce + audit · demo isolation
(status LIVE, enter/exit present) · SQLite swap API (`migrateAndActivate` /
`rollbackToLocal` present) · health cache (active, v2).

## Verdict
**Baseline is GREEN and matches the declared state exactly.** Zero regressions,
zero broken links, zero missing modules. v3.5 may proceed on this foundation.
Both v3.5 objectives are additive extensions of existing seams
(`auth`/`auth_ui`/`storage` for session binding; the client-list pagination
pattern for table virtualization) — **no redesign, no destructive migration
required.**
