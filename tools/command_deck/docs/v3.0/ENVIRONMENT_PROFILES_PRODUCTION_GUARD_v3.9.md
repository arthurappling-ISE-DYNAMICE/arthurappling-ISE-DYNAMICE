# SYS_OS v3.9 — Environment Profiles + Production Config Guard

An **honest** deployment-discipline safety layer. SYS_OS now knows which
environment it runs in and **blocks unsafe production behavior** before any real
hosting/auth/backend exists. This is **not** production security — it prevents
footguns and states the truth: SYS_OS is local-first only until backend auth,
durable persistence, hosting, HTTPS, backups, and monitoring are implemented.

Additive: default profile is **LOCAL**, where behavior is identical to v3.8.

## Module / surface
- `assets/js/environment.js` → `SYSOS.environment`. Station **15 // ENVIRONMENT**
  (router-registered, lazy). Not boot-gated → boot gate stays 36.
- Touched additively: `demo.js` (block demo in PRODUCTION), `vault.js` (block
  reset in PRODUCTION — precheck before the v3.8 guarded path; H1-H5 unchanged),
  `index.html` (load), `main.js` (init), `config.js` (version).

## Profiles
| Profile | Label | Risk | Guard | Blocked actions | Purpose |
|---|---|---|---|---|---|
| DEV | DEVELOPMENT | LOW | inactive | none | engineering/testing |
| LOCAL | LOCAL SOVEREIGN | LOW | inactive | none | single trusted operator (default) |
| STAGING | STAGING | MEDIUM | advisory | none (warnings) | pre-production rehearsal |
| PRODUCTION | PRODUCTION | CRITICAL | active | demo, reset, unlocked_boot | live client use (gated) |

**Detection order:** `?profile=` URL override → `sysos.environment.profile`
storage key → `CONFIG.PROFILE` → default **LOCAL**.

## Production guard (11 checks, honest)
`runProductionGuard()` evaluates: Authentication (**BLOCK** — no backend auth),
Server persistence (**BLOCK** — localStorage only), Hosting/HTTPS (BLOCK if not
secure context; WARN on localhost), Monitoring (**BLOCK**), Backup readiness
(PASS — v3.8), Audit chain (PASS), Vault chain (PASS/BLOCK), Integrity
(PASS/BLOCK), Demo mode OFF (PASS/BLOCK), Reset protection (PASS), Localhost
config (WARN). Result includes `status`, `productionReady`, `checks[]`,
`blockingChecks[]`, `blockedActions[]`, `warnings[]`, `summary`.

**Today PRODUCTION is always `PRODUCTION_BLOCKED`** (auth/persistence/hosting/
monitoring missing). The guard never claims SYS_OS is production-secure.

## Guard integration (PRODUCTION only; no-op in LOCAL)
- **Demo:** `demo.enter()` refuses (stays LIVE) + audits `environment.demo_blocked`.
- **Reset:** `vault.reset()` refuses (`production_guard_blocked`) **before** the
  v3.8 guarded-reset logic — H1-H5 untouched + audits `environment.reset_blocked`.
- **Backup/export** stays available; **restore** stays RBAC-gated (READ_ONLY denied).
- **Profile change** (`setProfile`) requires `system.configure` (ADMIN); denials
  audit `environment.override_rejected`.

## Public API
`getCurrentProfile`, `getProfileRules`, `runProductionGuard`, `isProduction`,
`isStaging`, `isLocal`, `isDev`, `getBlockedActions`, `getWarnings`, `blocks`,
`setProfile`.

## Audit events
`environment.profile_detected`, `guard_checked`, `production_blocked`,
`warning_issued`, `reset_blocked`, `demo_blocked`, `override_rejected` — each with
profile, result, reason, blocked action, warning count.

## Verified (28 cases) — all pass
DEV/LOCAL boot normal; STAGING warns (MEDIUM); PRODUCTION → PRODUCTION_BLOCKED
(not falsely secure); demo + reset blocked + audited in PRODUCTION; backup still
works in PRODUCTION; restore still RBAC-denied for READ_ONLY; LOCAL unchanged
(demo works, reset RBAC-guarded); commercial UI + H1-H5 + lock/unlock intact;
smoke 18/18, drills 6/6, maintenance 10/10, integrity 88/0, gate 36/0, chain
valid; no console errors.

## Honest disclaimer (shown in the panel)
> SYS_OS is not production-ready until backend authentication, durable
> persistence, hosting, HTTPS, backups, and monitoring are implemented. This
> guard prevents unsafe production behavior; it is not production security.

## Deferred (named by the guard as the blockers)
Real authentication · server persistence · hosting/HTTPS · monitoring — the Pilot
milestone (Option B from the v3.8 audit).
