# SYS_OS v4.1 — Remote Persistence Live

Makes v4.0's deferred remote sync **real**: explicit, operator-controlled,
overwrite-protected **push/pull** between local state and the Supabase per-user KV
store. **LOCAL stays the live store and the default** (localStorage); remote sync
is **opt-in, backup-gated, and never automatic**. No live backend swap (the
synchronous `storage.js` contract is untouched), no hosting, no monitoring, no AI.

> Local-first is preserved. The operator works locally (fast, offline), **pushes**
> to Supabase for durable/offsite/cross-device persistence, and **pulls** on a new
> device — each as an explicit, confirmed, backup-protected action.

## API (`SYSOS.remoteBackend`)
- `preview()` — conflict classification (local-only / remote-only / in-both /
  differing). **No mutation.**
- `syncFromLocal(opts)` — **PUSH**: requires `opts.backupConfirmed` + `opts.confirm
  === 'PUSH TO REMOTE'`; uploads every `sysos.*` key; verifies all present remotely;
  logs `sysos_backup_events`.
- `syncToLocal(opts)` — **PULL**: requires `opts.backupConfirmed` + `opts.confirm
  === 'PULL FROM REMOTE'`; takes a **pre-pull local snapshot**, writes remote→local,
  rehydrates, verifies vault chain + integrity, and **rolls back to the snapshot on
  any failure**.
- `register()` — live async backend swap — **deferred** (storage refactor).
- (v4.0, unchanged) isConfigured, isAuthenticated, healthCheck, listKeys, getItem,
  setItem, removeItem, clearNamespace.

## Operator workflow (the safe sequence)
1. Station 14 → **EXPORT** a v3.8 backup (the escape hatch).
2. Station 16 → **Sign In** (Supabase).
3. **Check Remote Health** (reachable + RLS query).
4. **Preview Conflicts** — see local vs remote counts + overwrite impact.
5. Tick **"I have exported a v3.8 backup"** (required).
6. **Push** (type `PUSH TO REMOTE`) — uploads local → remote; verify counts.
7. On a new device: Sign In → **Pull** (type `PULL FROM REMOTE`) — overwrites local
   from remote, with snapshot + chain verification.
8. **Reload** to fully refresh the UI.

## Overwrite protection
- **No automatic / background sync** — every push/pull is explicit.
- **Conflict preview** before any write — never a silent merge.
- **Backup-required gate** — push/pull refuse without the backup acknowledgement.
- **Confirmation phrases** — `PUSH TO REMOTE` / `PULL FROM REMOTE` (distinct).
- **Pre-pull snapshot** (`sysos.backup.prerestore.<ts>`) + **rollback** on
  post-pull vault-chain failure.
- **RLS backstop** — even a bug can only touch the signed-in user's rows.

## Production guard
Authentication + Server-persistence PASS **only** when remote is configured +
authenticated (real Supabase). With no remote (default), PRODUCTION =
**PRODUCTION_BLOCKED**; hosting + monitoring remain BLOCK. No false production claim.

## Verification
- **Real (no-config):** push/pull/preview → `config_required`, health →
  `SDK_MISSING`; LOCAL preserved; regression green; backup/commercial/H1-H5/guards
  intact.
- **Sync orchestration (mock in-memory primitives — NOT a live Supabase pass):**
  push (all keys uploaded + verified), conflict preview (counts correct), pull
  (deleted client restored, vault chain + integrity valid), rollback (injected
  failure → snapshot restored), backup/phrase gates enforced. All audited.
- **Live Supabase + RLS isolation:** **CONFIG_REQUIRED** — requires operator
  credentials + two users; **never marked PASS** without them.

## Deferred
Live async backend swap (`register`), hosting/HTTPS, monitoring, automated sync.
The Supabase SDK is intentionally not bundled (strict CSP); the operator adds it
per `pilot_backend/README.md` when going live.
