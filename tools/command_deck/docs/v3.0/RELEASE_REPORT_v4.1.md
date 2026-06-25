# SYS_OS v4.1.0 — Release Report

**Codename:** REMOTE_PERSISTENCE_LIVE
**Previous:** v4.0.0 (PILOT_BACKEND_FOUNDATION)
**Branch:** clean-vault-deployment

## 1. Executive summary
v4.1 makes the v4.0 deferred sync **real**: explicit, operator-controlled,
overwrite-protected **push/pull** between local state and the Supabase per-user KV
store. **LOCAL remains the live store and the default** (localStorage); remote sync
is opt-in, backup-gated, and never automatic. No live backend swap (the synchronous
`storage.js` contract is untouched), no hosting, no monitoring, no AI. Additive;
all prior controls (H1-H5, backup/restore, environment guard, commercial UI)
preserved.

## 2. Files modified (4)
- `assets/js/remote_backend.js` — real `preview`/`syncFromLocal`/`syncToLocal` +
  Station 16 sync UI (`register` stays deferred).
- `assets/js/config.js` — version 4.1.0 / REMOTE_PERSISTENCE_LIVE.
- `index.html` — version badge.
- `docs/VERSION_HISTORY.md` — v4.1.0 entry.

## 3. Files created
- `docs/v3.0/REMOTE_PERSISTENCE_LIVE_v4.1.md`, `OPERATOR_MANUAL_v4.1_ADDENDUM.md`,
  `RELEASE_REPORT_v4.1.md`
- `index_v4.1.0.html` + `archives/v4.1.0/`

## 4. Capability
| Capability | Before (v4.0) | After (v4.1) |
|---|---|---|
| Remote sync | deferred stubs | **real push/pull (explicit)** |
| Conflict handling | none | **preview before any write** |
| Overwrite protection | n/a | backup-gate + phrases + snapshot + rollback |
| Cross-device durability | schema only | **push/pull workflow** (live = config-required) |
| Backup-event log | table only | `sysos_backup_events` rows on sync |

## 5. Design (honest, additive)
- **Local-first preserved:** localStorage stays the live synchronous store; sync is
  one-shot and explicit. `storage.js` untouched.
- **Push** uploads all `sysos.*`; verifies all present remotely. **Pull** snapshots
  local first, writes remote→local, rehydrates, **verifies the vault chain**, and
  **rolls back** on failure. **Preview** classifies conflicts without mutating.
- **No false claims:** with no credentials, sync = `config_required` and live remote
  is **CONFIG_REQUIRED**; the guard keeps PRODUCTION **BLOCKED** (hosting/monitoring
  still missing).

## 6. Security / RBAC
RLS (server-side, per-user) is the authorization backstop. Frontend uses the anon
key only; service-role key never present. Sync requires an authenticated session.
No secrets, no real credentials, no `.env`, no backup JSON committed.

## 7. Regression & verification (measured)
- No-config gates honest (push/pull/preview → config_required; health → SDK_MISSING).
- LOCAL preserved (localStorage live, remote off); backup (export/validate PASS);
  commercial UI; H1-H5; demo/reset guards — all intact.
- smoke **18/18** · drills **6/6** · maintenance **10/10** · integrity **88/0** ·
  gate **36/0** · vault chain valid · no console errors.
- **Sync orchestration** (push / conflict preview / pull / rollback + backup &
  phrase gates) verified with **in-memory mock primitives** — explicitly **NOT** a
  live Supabase pass.
- **Live Supabase + RLS isolation: CONFIG_REQUIRED** (no credentials) — not marked
  PASS.
- Housekeeping: a leaked `/tools/v39.md` test doc (from the v3.9 session) was
  removed via the guarded vault reset, restoring the canonical 3-doc baseline.

## 8. Rollback plan
Additive. Revert with `git checkout -- tools/command_deck/assets/js/{remote_backend,config}.js tools/command_deck/index.html` and remove v4.1 docs/archive. No schema/persistence-format change; LOCAL is the live store; v4.0 archive byte-identical.

## 9. Next recommended version
**v4.2 — PILOT_HOSTING + MONITORING:** HTTPS-hosted deployment of the static app +
runtime error/audit-failure capture, behind real Supabase credentials. Those are the
remaining guard checks (hosting + monitoring) that keep PRODUCTION BLOCKED today.
(The live async backend swap remains a separate, deferred storage-refactor track.)

---
**Seal status:** explicit overwrite-protected sync shipped; LOCAL/v4.0 preserved;
live remote + RLS = CONFIG_REQUIRED (no fake pass); PRODUCTION honestly BLOCKED.
