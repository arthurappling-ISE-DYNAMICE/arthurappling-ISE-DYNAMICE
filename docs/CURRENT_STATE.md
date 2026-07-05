# SYS_OS — CURRENT STATE

_Last updated: 2026-07-05 (v4.5.4 build session)_

## Current phase
**Supabase integration verified** — first live backend milestone banked.

| Area | State |
|---|---|
| Code release | **v4.5.4 RLS_TECHNICAL_VERIFICATION_STATUS_PATH** (built, tested live, committed) |
| Backend | **Connected** — Supabase project `xwgm…`, legacy anon key live-verified (HTTP 200) |
| Authentication | **Verified** — test1 + test2 sign-in, distinct uids, sessions valid |
| Persistence | **Verified** — RLS-scoped health PASS; write/read round-trip byte-identical |
| RLS isolation | **TECHNICALLY_VERIFIED via the new v4.5.4 status path** — live two-user machine test, both directions, cleanup confirmed, evidence-hashed; guard RLS line = PASS (integrity-gated: project match + 30-day freshness) |
| Production | **Still BLOCKED (honest)** — remaining: Server persistence (requires an active signed-in session) + hosting (GitHub Pages strategy unresolved, Fable F2/F3) |
| Hosting | NO-GO until Pages↔config.local.js contradiction + publish-scope decisions (Fable review F2/F3) |

## Live-config surface (all local-only, never committed)
- `tools/command_deck/assets/js/config.local.js` — git-ignored; runtime config + temporary TEST_USERS
- `tools/command_deck/index.local.html` — untracked local test page (CSP origin + SDK + config tags)
- `tools/command_deck/assets/js/supabase.local.js` — untracked vendored SDK

## Next mission
**Hosting strategy fix** (pre-GitHub-Pages): resolve the Pages↔git-ignored-config
contradiction (F2) and the publish-scope/business-data exposure decision (F3)
from the Fable 5 review — the last engineering blockers between the current
state and a hosted pilot.

## Standing operator items
- Rotate the old Google API key (v4.4.1 finding) and confirm repo visibility.
- Test-user passwords that transited chat are burned — current ones were set fresh.
- GitHub Pages decisions (F2/F3) before any hosting mission.
