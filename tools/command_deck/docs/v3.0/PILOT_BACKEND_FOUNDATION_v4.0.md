# SYS_OS v4.0 — Pilot Backend Foundation

The first real pilot-backend foundation: a Supabase-shaped **auth boundary +
per-user KV adapter + schema/RLS + config + UI + guard wiring**, added **without
disturbing the local-first system**. Default is **LOCAL/localStorage** (identical
to v3.9, fully offline). Remote is **opt-in**, **never auto-overwrites local**,
and **not configured in the repo** (no secrets).

> This is a FOUNDATION, not full production deployment. No backend is deployed, no
> real auth is enforced yet, no hosting, no AI. PRODUCTION stays honestly BLOCKED.

## The key design decision (honest)
The existing storage backend contract is **synchronous** (`getItem(k) -> string`).
Supabase is **async**. Rather than rewrite every storage consumer, the foundation:
- ships the **async** remote primitives + explicit operator sync + health check,
- keeps the **live synchronous localStorage backend** in place (LOCAL preserved),
- defers the live backend swap (async-storage path) to a future release.

This gives real auth + a real per-user durable store + RLS **scaffolding** now,
with zero risk to existing data and no auto-overwrite.

## Modules
- `pilot_backend/supabase_schema.sql` — `sysos_kv_state` + `sysos_backup_events`,
  indexes, updated-at trigger, **RLS enabled + 6 per-user policies**.
- `pilot_backend/README.md` — setup, security, test, rollback, sovereign-exit.
- `pilot_backend/.env.example` — placeholders only.
- `assets/js/auth_remote.js` → `SYSOS.authRemote` — Supabase login boundary.
- `assets/js/remote_backend.js` → `SYSOS.remoteBackend` + Station 16 // PILOT BACKEND.
- `assets/js/config.js` — `CONFIG.BACKEND` block (placeholders, runtime-overridable).
- `assets/js/environment.js` — guard now backend-aware (auth + persistence).

## Security (server-side authz)
Per-user isolation is enforced by **Row-Level Security in Postgres** — a user can
only `select/insert/update/delete` their own rows (`auth.uid() = user_id`). This
is the real fix for client-side-RBAC tampering, applied at the database. The
frontend uses **only the ANON key**; the **service-role key must never** appear in
the browser or any committed file. The vault hash chain + central audit remain
client-side and verbatim — the backend stays untrusted for integrity.

## Config (no secrets in repo)
`CONFIG.BACKEND = { MODE:'local', REMOTE_ENABLED:false, SUPABASE_URL:'',
SUPABASE_ANON_KEY:'', KV_TABLE:'sysos_kv_state' }`. Real values are injected at
runtime via a **git-ignored** `assets/js/config.local.js` setting
`window.__SYSOS_RUNTIME__.BACKEND`. Missing config → warning, never a crash.

## API
- `authRemote`: isConfigured, sdkAvailable, getSession, getUser, signIn, signOut,
  onAuthStateChange, getAuthStatus.
- `remoteBackend`: isConfigured, isAuthenticated, healthCheck, listKeys, getItem,
  setItem, removeItem, clearNamespace, syncToLocal, syncFromLocal, register.

## Station 16 // PILOT BACKEND
Shows: backend mode (LOCAL/REMOTE_SUPABASE), live store, Supabase config status
(SDK_MISSING / CONFIG_MISSING / UNAUTHENTICATED / AUTHENTICATED), remote health,
persistence status, user-isolation status, and warnings. Actions: Check Remote
Health, Sign In, Sign Out, Validate. No destructive sync in the UI.

## Production guard (honest)
Authentication + Server-persistence checks PASS only when remote is **configured +
authenticated**; otherwise BLOCK. With no remote (default), PRODUCTION =
**PRODUCTION_BLOCKED**. Hosting + monitoring remain MISSING. The guard never
claims production-secure.

## Verified
LOCAL boots normal with no Supabase; missing config safe; remote disabled by
default; localStorage + backup (export/validate) + restore guard + commercial UI +
demo/reset guards + READ_ONLY restore denial intact; RLS enabled + 6 policies; no
service-role key / real creds / backup JSON; smoke 18/18, drills 6/6, maintenance
10/10, integrity 88/0, gate 36/0, vault chain valid, H1-H5 intact; no console
errors. **Live Supabase tests SKIPPED (CONFIG_REQUIRED — no credentials).**

## Deferred (next pilot steps)
Async-storage live backend swap · real auth enforcement (login gate in STAGING/
PRODUCTION) · hosting + HTTPS · monitoring · operator-triggered sync. The Supabase
JS SDK is intentionally **not** bundled (strict CSP) — the operator adds it per the
README when going live.
