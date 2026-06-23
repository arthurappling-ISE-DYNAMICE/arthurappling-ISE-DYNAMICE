# SYS_OS v3.6 — Deployment Gap Analysis (Phase 6)

What is required before each milestone, by category, classified **REQUIRED** /
**RECOMMENDED** / **OPTIONAL**. Evidence-bound to the audited v3.5.0 state
(static SPA, localStorage, single operator, no server, OCR framework-only).

## A. Internal Demo (Arthur demonstrates the platform locally)
| Category | Item | Class |
|---|---|---|
| Documentation | Operator quick-start + real-vs-demo map | **REQUIRED** |
| Operations | Confirm clean boot + seeded baseline (done) | **REQUIRED** (met) |
| Client Experience | Label CEO/COO/Shield as demo surfaces | **RECOMMENDED** |
| Security | Keep ADMINISTRATOR default (fine for local demo) | OPTIONAL |
| Data | Reset-to-seed procedure documented | RECOMMENDED |
| AI | none needed | OPTIONAL |
| Infrastructure | none (runs on localhost http-server) | OPTIONAL |

**Internal Demo gating: only documentation.** The platform already runs and demos.

## B. Pilot Client (a real client uses it for real records)
| Category | Item | Class |
|---|---|---|
| Security | Serve over **HTTPS** (else vault hash downgrades to FNV-1a — now surfaced, still weak) | **REQUIRED** |
| Security | Default-deny session OR documented operator-only access | **REQUIRED** |
| Security | Passphrase/credential for elevation (deferred in v3.5) | RECOMMENDED |
| Operations | **Backup/restore** procedure (export audit + vault; restore-from-snapshot) | **REQUIRED** |
| Operations | Hosting beyond localhost (a served origin) | **REQUIRED** |
| Data | Durable backend decision (localStorage vs SQLite-as-truth) | **REQUIRED** |
| Data | Data-retention + isolation (one browser = one dataset today) | **REQUIRED** |
| Documentation | Operator runbook + RBAC guide + vault explainer | **REQUIRED** |
| Client Experience | Remove/relabel mock surfaces; real reports only | **REQUIRED** |
| AI | OCR provider if document extraction is promised | RECOMMENDED |
| Infrastructure | Single-tenant deploy, monitored | RECOMMENDED |

## C. Production Deployment (multiple clients / durable operation)
| Category | Item | Class |
|---|---|---|
| Security | Real authentication (accounts, sessions, secrets) | **REQUIRED** |
| Security | Default-deny + audited elevation + transport security | **REQUIRED** |
| Security | Per-tenant data isolation | **REQUIRED** |
| Operations | Server-side persistence + automated backups + restore drills | **REQUIRED** |
| Operations | Monitoring, alerting, incident runbook | **REQUIRED** |
| Data | Normalized/scalable vault persistence (H7) + migration tooling | **REQUIRED** (deferred today) |
| Data | Multi-device/multi-user sync model | **REQUIRED** |
| AI | Production OCR + any AI features (none today) | RECOMMENDED |
| Documentation | Full operator + admin + deployment + DR docs | **REQUIRED** |
| Infrastructure | Hosting, CI/CD, environments, rollback automation | **REQUIRED** |
| Client Experience | Onboarding, support, SLAs | RECOMMENDED |

## Cross-cutting current gaps (evidence)
- **No server / no HTTPS deploy:** runs as a static SPA on localhost.
- **No real auth:** ADMINISTRATOR is the boot default; no passphrase (deferred).
- **Single-browser data:** localStorage; no cloud, backup, or multi-device.
- **OCR not shipped:** framework only.
- **Mock surfaces:** CEO/COO consoles + Shield OPTIMIZE are presentation.
- **No restore-from-snapshot function:** recovery artifacts exist (quarantine /
  reset snapshots) but no one-click restore.
- **Vault persistence monolithic (H7 deferred):** fine at 3 docs, not at scale.

## Bottom line
- **Internal Demo:** gated only by docs — effectively ready.
- **Pilot Client:** gated by transport security, hosting, backup, durable data,
  and operator docs — all **REQUIRED**, none yet present.
- **Production:** gated by real auth, multi-tenant isolation, server persistence,
  monitoring, and DR — a substantial build beyond the current sovereign-local model.
