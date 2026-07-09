# SYS_OS v3.7.0 — Release Report

**Codename:** COMMERCIAL_RECORD_MANAGEMENT_UI
**Previous:** v3.5.0 (SESSION_BOUND_RBAC_VAULT_HARDENING)
**Branch:** clean-vault-deployment

## 1. Executive summary
v3.7 makes SYS_OS **operable from the interface for commercial records** —
clients, proposals, and contracts can now be **edited, archived, and safely
deleted** without console/API shortcuts. It closes operator gap **F2** and guards
**F1** (a hard delete that would orphan a reference is blocked). Purely additive
over the existing DataStore + audit + RBAC; no redesign, no schema change, no
Vault-persistence normalization, no change to Vault H1-H5 behavior.

## 2. Files modified (2 code files)
- `assets/js/commercial_ui.js` — generalized the existing edit form trigger to
  `edit(recordMode, id)` (client/proposal/contract). The update logic already
  existed and was unused; v3.7 wires it.
- `assets/js/client.js` — per-record EDIT / ARCH·UNARCH / DEL controls on client
  rows and proposal/contract workspace items; `handleCommercialAction` dispatcher;
  `linkRisk()` relationship-safety gate; client row converted to `div[role=button]`.
- `assets/js/config.js`, `index.html`, `docs/VERSION_HISTORY.md` — version metadata.

## 3. Files created
- `docs/v3.0/COMMERCIAL_RECORD_UI_v3.7.md`
- `docs/v3.0/OPERATOR_MANUAL_v3.7_ADDENDUM.md`
- `docs/v3.0/RELEASE_REPORT_v3.7.md` (this file)
- `index_v3.7.0.html` + `archives/v3.7.0/` snapshot

## 4. What changed (capability)
| Capability | Before (v3.5) | After (v3.7) |
|---|---|---|
| Edit client/proposal/contract | API/console only | **UI (prefilled form)** |
| Archive (reversible) | API only | **UI (ARCH/UNARCH)** |
| Hard delete | API only | **UI, two-step confirm** |
| Delete that would orphan links | possible (F1) | **blocked + audited** |

## 5. Relationship safety (F1)
`linkRisk(id)` inspects backlinks + Vault document links before any hard delete.
If references exist → **delete blocked**, audit `<domain>.delete_blocked`, operator
directed to ARCHIVE (which preserves links). Hard delete is allowed only for
unreferenced records, with a two-step confirm and a post-delete integrity check.
**Dangling links are unreachable via the UI.**

## 6. Security / RBAC (unchanged enforcement)
All actions route through the existing store RBAC: EDIT/ARCH → `<domain>.update`,
DEL → `<domain>.delete`. Denials surface a notification and audit `permission_denied`.
Verified: READ_ONLY denied; ADMINISTRATOR allowed.

## 7. Audit (unchanged mechanism)
Edit/archive/delete are auto-captured by the existing store audit wrap
(`create/update/archive/remove`). Blocked deletes add a `delete_blocked` event.

## 8. Regression results (measured at seal)
smoke **18/18** · drills **6/6** · maintenance **10/10** · integrity **88/0** ·
boot gate **36/0** · vault chain **valid** · session/lock-unlock **work** ·
H1-H5 Vault hardening **intact** · demo isolation **intact** · SQLite swap **intact**.
All test records cleaned; baseline restored (3 clients / 2 proposals / 1 contract /
3 vault docs); no console errors.

## 9. Verification highlights (Phase 6)
EDIT opens prefilled + persists (value→999, audited); archive/unarchive; two-step
delete of an unlinked contract; **delete-blocked on a linked client (audited)**;
READ_ONLY archive denied; all survived reload.

## 10. Remaining technical debt / deferred
- H7 normalized Vault persistence (unchanged, deferred).
- No bulk actions; no "show archived only" filter (archived visible, badged).
- Edit/delete for these domains is in Client Center only (not Registry Grid).
- Pilot/Production still gated by hosting, real auth, backups (see v3.6 reviews).

## 11. Deployment readiness impact
Closes the top operator blocker from the v3.6 validation (F2). SYS_OS is now
**unassisted-operable end-to-end** for the commercial core — strengthening the
Internal Demo posture and removing one Pilot blocker. Hosting/auth/backup remain.

## 12. Rollback plan
Additive; revert with `git checkout -- tools/command_deck/assets/js/{commercial_ui,client,config}.js tools/command_deck/index.html` and remove the v3.7 docs/archive. No schema/persistence-format change; v3.5 archive byte-identical.

## 13. Next recommended version
A **Pilot-enablement** release (HTTPS hosting + backup/restore-from-snapshot UI +
default-deny/credential) — the remaining gating items for a real client.

---
**Seal status:** F2 closed; F1 guarded; H1-H5 unchanged; H7 deferred. No
deployment claim beyond verified local evidence.
