# SYS_OS Operator Manual — v3.8 Addendum

Supplements the v3.6 manual + v3.7 addendum. Adds **Station 14 // BACKUP** — your
local-first way to back up and restore the entire SYS_OS state without the console.

## Why this matters
SYS_OS data lives in this one browser. **A cleared browser or a new device loses
everything.** Backup/Restore is how you protect against that: export a file, keep
it safe, and restore it if needed.

## How to make a backup (do this regularly)
1. Open **Station 14 // BACKUP** (left nav).
2. Check **Backup Readiness** — vault chain VALID, integrity 0 broken, hash mode
   sha256 is the healthy state.
3. Click **EXPORT FULL SYS_OS BACKUP**. A file downloads:
   `SYS_OS_BACKUP_v3.8.0_<date>_<time>.json`.
4. **Store that file somewhere safe** (it *is* your data — there is no cloud copy).
   Anyone with READ_ONLY access or higher can export.

## How to restore from a backup
1. Open Station 14 // BACKUP → under **Restore**, click **Choose Backup JSON** and
   select your file.
2. The file is **validated automatically**. Read the result:
   - **PASS** (green) — safe to restore.
   - **WARNING** (amber) — restorable, but read the notes.
   - **FAIL** (red) — the file is invalid/corrupt/tampered; **restore is blocked**.
3. Review **Restore Impact** (current vs incoming record counts). Restore is
   **OVERWRITE** — it replaces all current data (a safety snapshot is kept first).
4. Type the exact phrase **`RESTORE SYS_OS BACKUP`** in the confirmation box. The
   **RESTORE** button stays disabled until validation passes *and* the phrase matches.
5. Click **RESTORE**. SYS_OS restores, **re-verifies the vault chain**, and reports
   the result. **Reload the page** to fully refresh the interface.

## Safety guarantees (what cannot go wrong)
- A **bad/tampered/empty/incompatible** backup is rejected — your current data is
  untouched.
- If a restore fails partway, SYS_OS **rolls back** to the pre-restore snapshot.
- **READ_ONLY** cannot restore (export only). All backup actions are **audited**.

## Roles
| Action | READ_ONLY | OPERATOR | MANAGER | ADMIN |
|---|:--:|:--:|:--:|:--:|
| Export backup | ✅ | ✅ | ✅ | ✅ |
| Validate a file | ✅ | ✅ | ✅ | ✅ |
| Restore | ❌ | ✅ (+confirm) | ✅ | ✅ |

## Important reminders
- This is a **local backup**, not production security and not a server backup.
- **Keep your backup files private and safe** — they contain your full operating data.
- Make a fresh backup **before** any big change or restore.
- Everything in the v3.6 manual + v3.7 addendum still applies.
