# SYS_OS v4.0 — Pilot Backend (Supabase) Foundation

The **smallest safe pilot backend**: Supabase managed **Auth + Postgres + Row-Level
Security + TLS + automated backups**, fronted by a thin client-side KV adapter.
The backend stores **opaque `sysos.*` state blobs** only — vault hash chains and
the central audit are computed/verified **client-side**, so the backend never
re-implements SYS_OS and never needs to be trusted for integrity.

> **This is a FOUNDATION, not full production deployment.** With no Supabase
> configured, SYS_OS runs exactly as v3.9 on localStorage (LOCAL mode), fully
> offline. Remote is **opt-in** and **never auto-overwrites local data**.

## Security warnings (read first)
- Use **ONLY the ANON (public) key** in the frontend. **NEVER** put the
  **service-role key** in the browser, the bundle, or any committed file.
- Per-user isolation is enforced by **RLS in the database** (server-side authz) —
  this is what fixes client-side-RBAC tampering for real client use.
- **Never commit** a real `.env`, real keys, real credentials, or backup JSON.
- Serve over **HTTPS** in STAGING/PRODUCTION (localhost is fine for dev).

## Setup
1. Create a free Supabase project → note the **Project URL** and **anon key**.
2. Supabase → **SQL Editor** → paste `supabase_schema.sql` → **Run**. This creates
   `sysos_kv_state` + `sysos_backup_events`, indexes, the updated-at trigger, and
   **RLS policies** (user can only touch their own rows).
3. Supabase → **Authentication** → enable **Email** sign-in (email/password).
4. Add the Supabase JS SDK and config to the app **without committing secrets**:
   - Load the Supabase SDK (self-host it under `assets/js/` for CSP, or add the
     CDN origin to the `index.html` CSP `script-src`/`connect-src`).
   - Provide runtime config via a **git-ignored** `assets/js/config.local.js`:
     ```js
     window.__SYSOS_RUNTIME__ = {
       BACKEND: { MODE: 'remote_supabase', REMOTE_ENABLED: true,
         SUPABASE_URL: 'https://YOUR_REF.supabase.co',
         SUPABASE_ANON_KEY: 'YOUR_ANON_KEY' }
     };
     ```
   - Add `connect-src https://YOUR_REF.supabase.co` to the CSP.
5. Reload. Open **Station 16 // PILOT BACKEND** → it should show *configured* and a
   passing **health check**; sign in to bind a session.

## Required config values
| Key | Source | Notes |
|---|---|---|
| `SUPABASE_URL` | Supabase project | public |
| `SUPABASE_ANON_KEY` | Supabase project | public **with RLS**; never service-role |

## How to test (without exposing secrets)
- **No config (default):** app boots LOCAL; Station 16 shows *SDK/config missing*;
  everything works on localStorage. (This is what ships in the repo.)
- **Configured:** Station 16 → **Check Remote Health** → PASS; **Sign In** →
  authenticated; persistence status → *remote available*.
- Make a **v3.8 backup export FIRST**, then (future) operator-initiated sync.

## Migration / sync (explicit, future-safe)
The adapter exposes `syncToLocal()` / `syncFromLocal()` as **explicit, operator-
triggered** operations. The foundation does **not** auto-sync or auto-overwrite.
**Always export a v3.8 backup before any sync.**

## Rollback
- Remote issues? Set `BACKEND.REMOTE_ENABLED=false` (or remove `config.local.js`) →
  instant return to LOCAL/localStorage. No data lost (local is untouched).
- Server data: Supabase provides automated DB backups; restore from the dashboard.
- The v3.8 backup JSON file remains a portable offline escape hatch.

## Sovereign exit note
Supabase is a managed dependency. The `storage.registerBackend` seam keeps the
exit cheap: the same KV contract can be served by a sovereign **Node/Express +
SQLite** backend later (reusing `sysos_kv_state`'s shape) with no SYS_OS rewrite.

## What this foundation does NOT do (deferred)
Flip the live synchronous storage backend to async (storage refactor), hosting,
monitoring, automated sync, AI/agents — all out of scope. PRODUCTION stays
**honestly BLOCKED** until auth + persistence + hosting + monitoring are real.
