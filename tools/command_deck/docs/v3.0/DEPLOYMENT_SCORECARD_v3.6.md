# SYS_OS v3.6 — Deployment Scorecard (Phase 7)

Scores 0-100 with evidence. Scores reflect the **audited v3.5.0 state as a
sovereign-local platform**; deployment readiness is scored against a *production*
bar, hence lower. Time estimates are evidence-based and assume one engineer.

## Scores

### Architecture — 88 / 100
**Evidence:** 33 modules under a clean `SYSOS.*` namespace; boot gate validates
36; 13 stations via a runtime registration contract; storage adapter abstracts
the backend (SQLite-swappable); lazy rendering (0 dynamic stations at boot);
memoized health; normalized per-domain persistence. Additive discipline across
v2.7→v3.5 with zero-regression history.
**Deductions:** vault persistence still monolithic (H7); single-file SPA; mock
surfaces (CEO/COO/Shield) embedded in an otherwise real system.

### Security — 62 / 100
**Evidence:** RBAC matrix enforced at every write path; structured denials +
audit; session persistence; lock/unlock; vault hardening H1–H5 (audit bridge,
hash-mode visibility, guarded reset, corrupt-restore quarantine, evidence/OCR
RBAC); strict CSP; SHA-256 in secure context; crypto-grade IDs.
**Deductions:** ADMINISTRATOR is the boot default (no default-deny, no
passphrase — both deferred); weak-hash fallback off secure context (now visible,
still weak); no real auth/accounts; single-browser trust boundary.

### Reliability — 80 / 100
**Evidence:** smoke 18/18, drills 6/6 (fault injection), maintenance 10/10,
integrity 88/0, vault chain valid — all re-measured this audit; failure drills +
boot gate + corrupt-restore quarantine + recovery snapshots; demo isolation.
**Deductions:** no server-side durability or backups; localStorage quota ceiling
at scale; reliability proven at low-thousands records, not beyond.

### Operations — 45 / 100
**Evidence:** maintenance + smoke + health harnesses; audit-of-record; reset/
restore lifecycle audited; archive-per-version discipline.
**Deductions:** no hosting beyond localhost; no monitoring/alerting; backup,
restore-from-snapshot, and reset are **console-only** (not operator UI); no
incident/DR runbook; no CI/CD.

### Documentation — 58 / 100
**Evidence:** rich architecture + version history + per-phase verification +
release report + this v3.6 audit suite.
**Deductions:** **no operator-facing runbook, RBAC guide, or vault explainer**;
no real-vs-demo map; docs are engineer-facing, not operator-facing.

### Deployment Readiness — 38 / 100
**Evidence (toward):** runs clean; reproducible; verified; archived; rollbackable.
**Deductions:** no HTTPS deploy, no server, no real auth, no multi-tenant
isolation, no backups, no monitoring, OCR not shipped — all REQUIRED for a real
client (see Gap Analysis). Strong as a *local sovereign tool*, early as a
*deployable product*.

## Weighted snapshot
| Dimension | Score |
|---|---|
| Architecture | 88 |
| Security | 62 |
| Reliability | 80 |
| Operations | 45 |
| Documentation | 58 |
| Deployment Readiness | 38 |

## Time-to-milestone estimates (evidence-based, 1 engineer)
| Milestone | Estimate | Basis |
|---|---|---|
| **Internal Demo** | **~1 week** | Platform already runs/verifies; gap is operator docs + real-vs-demo labeling only. |
| **Pilot Client** | **~4–8 weeks** | HTTPS hosting + durable backend decision + backup/restore + default-deny/credential + operator runbook + relabel mock surfaces (+ OCR provider if promised). |
| **Production Deployment** | **~4–6 months** | Real auth/accounts, multi-tenant isolation, server persistence + automated backups/DR, monitoring, H7 vault normalization, CI/CD, full docs. |

Estimates assume scope stays disciplined (no feature creep) and reuse the
existing additive, measured engineering cadence.
