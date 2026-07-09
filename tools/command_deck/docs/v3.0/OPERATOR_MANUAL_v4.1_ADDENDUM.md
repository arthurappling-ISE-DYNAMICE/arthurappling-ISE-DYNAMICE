# SYS_OS Operator Manual — v4.1 Addendum

Supplements v3.6 + v3.7/v3.8/v3.9/v4.0 addenda. Adds **explicit push/pull sync** to
Station 16 // PILOT BACKEND, so you can back up your data to Supabase and pull it
onto another device — **on purpose, never automatically**.

## Nothing changes by default
You're still **LOCAL** by default — your data lives in this browser, fully offline,
exactly as before. Sync only happens when **you** explicitly push or pull, and only
after Supabase is configured (an engineer sets that up once).

## The safe sync sequence (once Supabase is connected)
1. **Export a backup first** — Station 14 → EXPORT FULL SYS_OS BACKUP. Always.
2. Station 16 → **Sign In** with your Supabase email/password.
3. **Check Remote Health** — should say PASS.
4. **Preview Conflicts** — shows how many keys are local-only, remote-only, or
   different. It tells you the overwrite impact. Nothing is changed yet.
5. Tick the box **"I have exported a v3.8 backup"** (required — the buttons won't
   work without it).
6. To save your local data to the server: type **`PUSH TO REMOTE`** → **PUSH**.
7. On another device: Sign In → type **`PULL FROM REMOTE`** → **PULL** (this
   **overwrites** that device's local data with the server copy) → **Reload**.

## Safety guarantees
- **No silent overwrite** — you must preview, tick the backup box, and type the
  exact phrase.
- **Pull is protected** — it snapshots your local data first; if anything fails
  verification, it **rolls back** automatically.
- **You can only ever see/change your own data** (database row-level security).
- **Push and pull are different phrases** so you can't do the wrong one by accident.

## Reminders
- **Always export a backup before pushing or pulling.**
- **Pull overwrites local** — only pull when you want the server copy to win.
- This is still **not full production** — even with sync working, PRODUCTION stays
  BLOCKED until hosting + monitoring are also done.
- Turning remote off (or removing the config) returns instantly to local-only.

## Everything else
All earlier manual sections still apply.
