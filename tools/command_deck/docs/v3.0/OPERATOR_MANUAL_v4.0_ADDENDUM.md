# SYS_OS Operator Manual — v4.0 Addendum

Supplements the v3.6 manual + v3.7/v3.8/v3.9 addenda. Adds **Station 16 // PILOT
BACKEND** — the foundation for moving SYS_OS to a real (Supabase) backend later.

## What changed for you (almost nothing, by design)
**Nothing changes in normal use.** SYS_OS still runs **LOCAL** on this browser,
fully offline, exactly as v3.9. The new pilot backend is **off by default** and
**not configured** — it's scaffolding for a future pilot, not a live service yet.

## Station 16 // PILOT BACKEND
Open it to see the backend status:
- **Backend mode:** LOCAL (default) or REMOTE_SUPABASE (only if you configure it).
- **Live store:** localStorage (your data, here in this browser).
- **Supabase config:** `SDK_MISSING` / `CONFIG_MISSING` until you set it up.
- **Remote health / persistence / user isolation:** all show "local only / config
  required" until a Supabase project is connected.

Until you (or an engineer) connect Supabase, this panel simply reports that remote
is not configured — which is correct and safe.

## When you're ready for a real pilot backend
An engineer follows `tools/command_deck/pilot_backend/README.md`:
1. Create a free Supabase project.
2. Run `supabase_schema.sql` (creates the tables + **Row-Level Security**, so each
   user only sees their own data).
3. Add the Supabase SDK + a **git-ignored** config file with your project URL and
   **anon (public) key** — **never** the service-role key.
4. Reload → Station 16 shows *configured* → **Sign In** to bind a session.

## Critical safety rules
- **Local mode is preserved** — turning remote off (or removing the config) returns
  instantly to local-only with no data loss.
- **Always export a v3.8 backup before any future sync.**
- **Never** put a Supabase **service-role key** in the app — only the anon key.
- **SYS_OS is still not production-ready.** Even with Supabase connected,
  PRODUCTION stays **BLOCKED** until hosting, HTTPS, and monitoring are also done.

## Everything else
The v3.6 manual + v3.7 (commercial edit/delete) + v3.8 (backup/restore) + v3.9
(environment/production guard) addenda all still apply.
