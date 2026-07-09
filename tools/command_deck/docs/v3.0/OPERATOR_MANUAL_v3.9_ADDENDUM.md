# SYS_OS Operator Manual — v3.9 Addendum

Supplements the v3.6 manual + v3.7/v3.8 addenda. Adds **Station 15 //
ENVIRONMENT** — the environment profile + production guard.

## What it is
SYS_OS now knows what "mode" it is running in and **stops you from doing unsafe
production things** before the platform is actually ready for production. By
default you are in **LOCAL** mode — everything works exactly as before.

## The profiles
| Profile | What it means | Demo | Reset | Risk |
|---|---|---|---|---|
| **DEV** | engineering/testing | allowed | allowed | LOW |
| **LOCAL** (default) | your normal single-operator use | allowed | allowed (guarded) | LOW |
| **STAGING** | rehearsal before real use — shows warnings | allowed | allowed | MEDIUM |
| **PRODUCTION** | live client use — **gated** | **BLOCKED** | **BLOCKED** | CRITICAL |

## Using Station 15 // ENVIRONMENT
1. Open **15 // ENVIRONMENT**. It shows your **current profile**, risk level, and
   the **Production Guard** result.
2. The guard lists checks (auth, persistence, hosting, monitoring, backup, audit,
   vault, integrity, demo, reset, localhost) as **PASS / WARN / BLOCK**.
3. To change profile (ADMIN only): pick a profile → **SET PROFILE**.

## What PRODUCTION does (and why it's blocked)
If you switch to **PRODUCTION**, the guard runs and reports **PRODUCTION_BLOCKED**
— **on purpose**. SYS_OS is honest: it does **not** yet have backend
authentication, server persistence, hosting, or monitoring, so it must **not** be
treated as production-secure. In PRODUCTION:
- **Demo mode is blocked** (you cannot enter the demo sandbox).
- **Vault reset is blocked**.
- **Backup export still works**; **restore is still permission-gated** (READ_ONLY
  cannot restore).

## Important — this is NOT production security
> SYS_OS is not production-ready until backend authentication, durable
> persistence, hosting, HTTPS, backups, and monitoring are implemented. This
> guard prevents unsafe behavior; it does not make SYS_OS secure.

## In normal use (LOCAL)
Nothing changes. Demo, reset (guarded), backup, commercial editing, lock/unlock —
all behave exactly as in v3.8. The guard only restricts things when you
deliberately switch to PRODUCTION.

## Everything else
The v3.6 manual + v3.7 (commercial edit/delete) + v3.8 (backup/restore) addenda
all still apply.
