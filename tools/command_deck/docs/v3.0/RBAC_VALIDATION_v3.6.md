# SYS_OS v3.6 — RBAC Validation (Phase 5)

All four roles validated live on v3.5.0 — permission matrix + real write
enforcement + audit capture. Fenced (no persistence pollution). No code changed.

## Permission matrix (measured via `auth.can`)
| Permission | ADMIN | MANAGER | OPERATOR | READ_ONLY |
|---|:--:|:--:|:--:|:--:|
| client.create | ✅ | ✅ | ✅ | ❌ |
| client.delete | ✅ | ✅ | ❌ | ❌ |
| contract.create | ✅ | ✅ | ❌ | ❌ |
| vault.ingest | ✅ | ✅ | ✅ | ❌ |
| vault.attachEvidence | ✅ | ✅ | ✅ | ❌ |
| vault.ocrProvider | ✅ | ✅ | ❌ | ❌ |
| vault.reset | ✅ | ❌ | ❌ | ❌ |
| report.generate | ✅ | ✅ | ✅ | ✅ |
| system.configure | ✅ | ❌ | ❌ | ❌ |

## Live enforcement (real write attempts + audit)
| Role | client.create | client.delete | attachEvidence | ocrProvider | vault.reset | denials audited |
|---|---|---|---|---|---|---|
| **ADMINISTRATOR** | created ✅ | allowed ✅ | allowed ✅ | allowed ✅ | permitted ✅ | n/a |
| **MANAGER** | created ✅ | allowed ✅ | allowed ✅ | allowed ✅ | **denied** ✅ | ✅ |
| **OPERATOR** | created ✅ | **denied** ✅ | allowed ✅ | **denied** ✅ | **denied** ✅ | ✅ |
| **READ_ONLY** | **denied** ✅ | **denied** ✅ | **denied** ✅ | **denied** ✅ | **denied** ✅ | ✅ |

**Highlight:** the OPERATOR test created a client (allowed) but the cleanup
*delete* threw `permission denied` (delete not held) — a single test cleanly
proving **create-yes / delete-no**. Matrix and live enforcement agree exactly.

## Measured
- **Allowed actions** execute and persist for roles that hold the permission.
- **Denied actions** are blocked: DataStore writes **throw** + audit; vault
  evidence/provider return **structured denials** + audit (`document.*_denied`).
  The audit count grew on every role's denial attempt (`auditGrew=true` ×4).
- **Session behavior:** login persists the operator+role (verified Phase 1 /
  v3.5 Phase 2); LOCK drops to READ_ONLY and UNLOCK restores; LOG OUT clears to
  READ_ONLY (fail-closed). ADMINISTRATOR is the boot default (no passphrase).

## Observation (not a defect)
There is **no default-deny boot** and **no passphrase** (both deferred in v3.5).
RBAC is fully enforced *for the active role*, but the active role defaults to
ADMINISTRATOR — acceptable for the sovereign-local model, a **Pilot-readiness**
item for any shared/hosted use.

## Verdict
RBAC is **VALIDATED**: matrix and runtime enforcement agree across all 4 roles;
denials are blocked and audited; allowed actions preserve behavior. No defects.
