# SYS_OS v3.8.0 — Release Report

**Codename:** BACKUP_EXPORT_RESTORE
**Previous:** v3.7.0 (COMMERCIAL_RECORD_MANAGEMENT_UI)
**Branch:** clean-vault-deployment

## 1. Executive summary
v3.8 gives the operator a **safe, local-first, auditable backup/export/restore** of
the full SYS_OS state — closing the highest immediate deployment-foundation risk
(local-only data loss, no backup) identified in the v3.8 audit. Additive only: no
backend, no authentication, no hosting, and **no change to vault H1-H5, store,
registry, audit, RBAC, or the v3.7 commercial UI.**

## 2. Files modified (4)
- `assets/js/auth.js` — added `backup.export` + `backup.restore` permissions.
- `index.html` — load `backup.js`; version badge.
- `assets/js/main.js` — guarded `SYSOS.backup.init()`.
- `assets/js/config.js` — version 3.8.0 / BACKUP_EXPORT_RESTORE.
- `docs/VERSION_HISTORY.md` — v3.8.0 entry.

## 3. Files created
- `assets/js/backup.js` — the backup module + Station 14 // BACKUP.
- `docs/v3.0/BACKUP_EXPORT_RESTORE_v3.8.md`, `OPERATOR_MANUAL_v3.8_ADDENDUM.md`,
  `RELEASE_REPORT_v3.8.md`.
- `index_v3.8.0.html` + `archives/v3.8.0/`.

## 4. What changed (capability)
| Capability | Before (v3.7) | After (v3.8) |
|---|---|---|
| Full-state backup | none | **Export to downloadable JSON** |
| Backup validation | none | **20-point validator (hash-verified)** |
| Restore | none (console-only fragments) | **Guarded UI restore + chain re-verify + rollback** |
| Backup audit | none | **9 audit event types** |
| Data migration seam | none | **portable, self-describing backup file** |

## 5. Design highlights
- **Dynamic surface:** exports *all* `sysos.*` keys (not a hardcoded list) →
  future-proof as new state families appear.
- **Integrity:** `state_hash` (SHA-256) detects any payload tamper at validate time;
  restore **re-verifies the vault chain** and **rolls back** on any failure.
- **Conservative restore:** RBAC + confirmation phrase + pre-restore snapshot.
- **Safety:** forbidden-key scan (no tokens/secrets); non-`sysos.*` keys ignored.
- **Boot contract preserved:** backup is operator-invoked and intentionally **not
  boot-gated** → gate stays 36/0.

## 6. Security / RBAC
New permissions via the existing matrix: `backup.export` (all roles incl.
READ_ONLY), `backup.restore` (ADMIN/MANAGER/OPERATOR; READ_ONLY denied). Denials
audited. No weakening of any existing safeguard. **No fake security claims** — docs
state plainly this is local, not production auth or server backup.

## 7. Regression & verification (measured at seal)
30 test cases pass (export/validate/restore round-trip, 6 rejection paths,
confirmation, rollback, RBAC). Anchors: smoke **18/18** · drills **6/6** ·
maintenance **10/10** · integrity **88/0** · boot gate **36/0** · vault chain
**valid** · H1-H5 · demo · lock/unlock · SQLite swap · v3.7 commercial UI — all
intact. No console errors. Baseline restored; archive byte-identical.

## 8. Remaining / deferred
Environment profiles + production config guard (next); server-side/encrypted/
scheduled backups; auth/hosting (Pilot milestone, Option B). H7 vault persistence
normalization still deferred.

## 9. Rollback plan
Additive. Revert with `git checkout -- tools/command_deck/assets/js/{auth,main,config}.js tools/command_deck/index.html` and remove `assets/js/backup.js` + v3.8 docs/archive. No schema/persistence-format change; v3.7 archive byte-identical.

## 10. Next recommended version
**v3.9 — ENVIRONMENT_PROFILES + PRODUCTION_CONFIG_GUARD** (DEV/LOCAL/STAGING/
PRODUCTION; block demo/reset/unlocked-boot in production) — the next deployment-
foundation step before any hosting/auth (Pilot, Option B).

---
**Seal status:** R-02/R-04 mitigated (local backup/restore + migration seam); H1-H5
unchanged; gate 36/0. No deployment claim beyond verified local evidence.
