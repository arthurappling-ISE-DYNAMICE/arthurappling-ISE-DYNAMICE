# SYS_OS — CURRENT STATE

_Last updated: 2026-07-05 (v4.5.4 build session)_

## Current phase
**Supabase integration verified** — first live backend milestone banked.

| Area | State |
|---|---|
| Code release | **v4.6.0 HOSTING_STRATEGY_FIX** (built, artifact proven, committed) |
| Backend | **Connected** — Supabase project `xwgm…`, legacy anon key live-verified (HTTP 200) |
| Authentication | **Verified** — test1 + test2 sign-in, distinct uids, sessions valid |
| Persistence | **Verified** — RLS-scoped health PASS; write/read round-trip byte-identical |
| RLS isolation | **TECHNICALLY_VERIFIED via the new v4.5.4 status path** — live two-user machine test, both directions, cleanup confirmed, evidence-hashed; guard RLS line = PASS (integrity-gated: project match + 30-day freshness) |
| Production | **Still BLOCKED (honest)** — remaining: Server persistence (needs an active session) + actual hosting (Pages NOT_DEPLOYED) |
| Hosting | **ARTIFACT COMMITTED (v4.7)** — business-content signoff APPROVED 2026-07-06 (operator reserved follow-up content flags, unspecified; MED-HIGH candidates: DSCR/$ figures). Repo visibility confirmed **PUBLIC** via anonymous probe. Artifact rebuilt + validator PASS + boot-proven. Pages: **NOT_DEPLOYED** — activation is the next operator gate; guard Hosting line stays BLOCK until genuinely hosted |

## Live-config surface (all local-only, never committed)
- `tools/command_deck/assets/js/config.local.js` — git-ignored; runtime config + temporary TEST_USERS
- `tools/command_deck/index.local.html` — untracked local test page (CSP origin + SDK + config tags)
- `tools/command_deck/assets/js/supabase.local.js` — untracked vendored SDK

## Next mission
**v4.7 — GitHub Pages activation (operator-gated).** All engineering is in
place; the sequence is `PUBLIC_DEPLOYMENT_OPERATOR_CHECKLIST_v4.6.md`:
business-content signoff (D) → standing items (E: rotate old Google key,
confirm repo visibility) → deliberate artifact commit (F) → enable Pages (G)
→ hosted verification incl. RLS rerun from the hosted origin (H).

## Standing operator items
- **🔴 URGENT: rotate the old Google API key** — repo is confirmed PUBLIC and the
  key sits in pre-remediation git history (commits ≤ 32b3c71b) → assume
  compromised. Rotation at https://aistudio.google.com/app/apikey; history purge
  (git filter-repo) is a separate authorized decision.
- Repo visibility: **PUBLIC** (confirmed 2026-07-06, anonymous HTTP 200).
- Test-user passwords that transited chat are burned — current ones were set fresh.
- Business-content follow-up flags from the v4.7 signoff: operator to specify
  (candidates: DSCR / dollar figures / Richmond-HVIP references).
