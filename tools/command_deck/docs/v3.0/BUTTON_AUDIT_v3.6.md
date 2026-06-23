# SYS_OS v3.6 — Button Audit (Phase 2)

Every visible button enumerated by activating each station and reading the DOM
(`data-action` / `data-*-action` + text). Status: **WORKING** (observed effect),
**PARTIAL** (effect is simulated/cosmetic), **BROKEN** (no/incorrect effect — none
found), **UNTESTED**. RBAC column: does the action route through an enforced
permission. Persistence: does the effect survive reload.

## Station 01 — Architect Core
| Button | Expected | Actual | Audit event | Persist | Role-gated | Status |
|---|---|---|---|---|---|---|
| PING_NODE ×3 | probe a node | calls `telemetry.probe`, updates status | no | n/a | no | **WORKING** |
| INITIALIZE INTEGRITY AUDIT | run integrity scan | runs `project_audit` / integrity, toast | activity logged | n/a | no | **WORKING** |

## Station 02/03 — CEO / COO Consoles
| Button | Expected | Actual | Audit | Persist | Role-gated | Status |
|---|---|---|---|---|---|---|
| 3 protocol buttons + EXECUTE (each) | run strategic/ops protocol | emits **scripted** terminal output (config protocol) | no | no | no | **PARTIAL** (mock terminal — no real execution) |

## Station 04 — Knowledge Vault
| Button | Expected | Actual | Audit | Persist | Role-gated | Status |
|---|---|---|---|---|---|---|
| + INGEST_SPEC_DOCUMENT | ingest a doc | `vault.simulateIngest` → real hash + chain seal + persist | **yes** (`document.created` via H1) | **yes** | **yes** (`vault.ingest`) | **WORKING** |
| (search input) | filter ledger | inverted-index search | no | n/a | no | **WORKING** |

## Station 05 — Legacy Shield
| Button | Expected | Actual | Audit | Persist | Role-gated | Status |
|---|---|---|---|---|---|---|
| OPTIMIZE ALLOCATION MATRIX | optimize allocations | cosmetic notify only (no engine) | no | no | no | **PARTIAL** (cosmetic) |

## Station 06 — Registry Grid
| Button | Expected | Actual | Audit | Persist | Role-gated | Status |
|---|---|---|---|---|---|---|
| 9 domain cards | switch domain | sets domain, resets page, re-renders | no | n/a | no | **WORKING** |
| + NEW_PROJECT | open create form | shows form (projects only) | no | n/a | — | **WORKING** |
| COMMIT RECORD | create/update project | DataStore create/update | **yes** (store wrap) | **yes** | **yes** (`client/project` write enforce) | **WORKING** |
| VIEW | detail panel | resolves links/backlinks | no | n/a | no | **WORKING** |
| EDIT | edit project | populates form | no | n/a | — | **WORKING** |
| ARCHIVE | archive project | sets archived, persists | **yes** | **yes** | **yes** | **WORKING** |
| DELETE (2-step) | delete project | two-click confirm → remove | **yes** | **yes** | **yes** | **WORKING** |
| PREV / NEXT | paginate | page slice (25/pg) | no | n/a | no | **WORKING** |
| CANCEL | close form | hides form | no | n/a | no | **WORKING** |

## Station 07 — Live Ops
| Button | Expected | Actual | Audit | Persist | Role-gated | Status |
|---|---|---|---|---|---|---|
| PROBE_ALL / PROBE | probe nodes | real `fetch` health probe | no | n/a | no | **WORKING** (reflects true node state) |
| + DISPATCH | enqueue op | `opsQueue.enqueue` | no | **yes** | **yes** (`ops.dispatch`) | **WORKING** |
| RUN_PENDING | run queue | state machine advance | no | **yes** | partial | **WORKING** |
| DISPATCH (route) | routing contract | `routing.dispatch` | no | n/a | yes | **WORKING** |
| DONE (compliance) | complete item | `compliance.complete` | **yes** | **yes** | **yes** | **WORKING** |
| UPLOAD_FILE / + SAMPLE_DOC | OCR intake | `ocr.upload` → parks AWAITING_PROVIDER (no provider) | partial | **yes** | **yes** (`vault.ingest`) | **PARTIAL** (no provider → no extraction) |

## Station 08 — Client Center
| Button | Expected | Actual | Audit | Persist | Role-gated | Status |
|---|---|---|---|---|---|---|
| + CLIENT / + PROPOSAL / + CONTRACT | open form + create | `commercial_ui` forms → DataStore create | **yes** (store wrap) | **yes** | **yes** | **WORKING** |
| client row select | load workspace | resolves projects/docs/proposals/contracts | no | n/a | no | **WORKING** |
| GEN_REPORT | text report | `client.reportText` | activity logged | n/a | no (READ_ONLY ok) | **WORKING** |
| PREV / NEXT | paginate list | 25/pg slice | no | n/a | no | **WORKING** |

## Station 09 — Executive Dashboard
| Button | Expected | Actual | Audit | Persist | Role-gated | Status |
|---|---|---|---|---|---|---|
| TOGGLE DEMO/LIVE | demo sandbox | `demo.enter/exit`, suspends persistence | **yes** (`system.demo`) | n/a (demo not persisted) | no (READ_ONLY ok) | **WORKING** |
| EXECUTIVE/PIPELINE/COMPLIANCE/HEALTH | text reports | computed reports | no | n/a | no | **WORKING** |

## Station 12 — System Health
| Button | Expected | Actual | Audit | Persist | Role-gated | Status |
|---|---|---|---|---|---|---|
| REFRESH | recompute health | 8 subsystem bands | no | n/a | no | **WORKING** |

## Station 13 — Access Control
| Button | Expected | Actual | Audit | Persist | Role-gated | Status |
|---|---|---|---|---|---|---|
| LOG IN | set operator + session | `authUI.login` | **yes** (`login`/`system.auth`) | **yes** (`sysos.session.v1`) | n/a | **WORKING** |
| LOCK | drop to READ_ONLY | `authUI.lock` | **yes** (`lock`) | no (memory-only) | n/a | **WORKING** |
| UNLOCK | restore role | `authUI.unlock` | **yes** (`unlock`) | no | n/a | **WORKING** |
| LOG OUT | clear session | `authUI.logout` → READ_ONLY | **yes** (`logout`) | **yes** (clears key) | n/a | **WORKING** |

## Summary
- **WORKING:** ~32 controls across 11 stations (CRUD, vault, telemetry, ops,
  reports, session, lock/unlock, pagination, health).
- **PARTIAL:** CEO/COO protocol buttons (mock terminals), Shield OPTIMIZE
  (cosmetic), OCR upload (no provider → no extraction).
- **BROKEN:** none observed.
- **UNTESTED:** none — every enumerated button was activated or traced to its handler.
