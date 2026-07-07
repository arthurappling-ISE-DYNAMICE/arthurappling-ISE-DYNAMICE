# SYS_OS — CURRENT STATE

_Last updated: 2026-07-07 (v4.7.1 gh-pages publisher session)_

## Current phase
**Deployment mechanism complete** — local `gh-pages` branch built from the
validated artifact; the only remaining step to a live pilot is the operator
gate (push + enable Pages + hosted verification).

| Area | State |
|---|---|
| Code release | **v4.7.1 GH_PAGES_PUBLISHER** (`scripts/publish_pages_branch.js` — build→validate→stage→rescan→plumbing-commit→verify; contains no push path) |
| Backend | **Connected** — Supabase project `xwgm…`, legacy anon key live-verified (HTTP 200) |
| Authentication | **Verified** — test1 + test2 sign-in, distinct uids, sessions valid |
| Persistence | **Verified** — RLS-scoped health PASS; write/read round-trip byte-identical |
| RLS isolation | **TECHNICALLY_VERIFIED via the new v4.5.4 status path** — live two-user machine test, both directions, cleanup confirmed, evidence-hashed; guard RLS line = PASS (integrity-gated: project match + 30-day freshness) |
| Production | **Still BLOCKED (honest)** — remaining: Server persistence (needs an active session) + actual hosting (Pages NOT_DEPLOYED) |
| Hosting | **LOCAL gh-pages BRANCH BUILT (v4.7.1)** — orphan branch, root = exactly the validated artifact (51 files) + `.nojekyll`; reproducible build confirmed (rebuild byte-identical, only manifest timestamp moved); independent secret scan of the branch tree clean (anon key only in `config.public.js`; service_role/sb_secret mentions are defensive validator code only). Business-content signoff APPROVED 2026-07-06 (operator reserved follow-up flags; MED-HIGH candidates: DSCR/$ figures). Repo visibility **PUBLIC**. Branch **NOT PUSHED**; Pages: **NOT_DEPLOYED** — operator gate next; guard Hosting line stays BLOCK until genuinely hosted |

## Live-config surface (all local-only, never committed)
- `tools/command_deck/assets/js/config.local.js` — git-ignored; runtime config + temporary TEST_USERS
- `tools/command_deck/index.local.html` — untracked local test page (CSP origin + SDK + config tags)
- `tools/command_deck/assets/js/supabase.local.js` — untracked vendored SDK

## Next mission
**v4.7.1 operator gate — Pages activation.** All engineering is done; three
operator steps remain (see `SYS_OS_v4.7.1_GH_PAGES_PUBLISHER_AUDIT_REPORT.md`):
1. `git push origin gh-pages` (explicit operator act — no script pushes).
2. GitHub → Settings → Pages → Deploy from a branch → `gh-pages` → `/ (root)` → Save.
3. Hosted verification per `PUBLIC_DEPLOYMENT_OPERATOR_CHECKLIST_v4.6.md` (H):
   HTTPS, assets, CSP, Supabase config, auth, persistence, hosted-origin RLS
   technical verification, zero console errors — only then may the guard's
   Hosting line move off BLOCK.

## Standing operator items
- **✅ Google API key finding: VERIFIED RESOLVED (2026-07-06).**
  Evidence: the historical Google/Gemini (Generative Language API) key existed
  only in old `.env` history (`gemini-app/.env` → `CORE_SYSTEMS/gemini-app/.env`);
  removed from tracked files in commit `968288a3`; a read-only validity probe
  returned **HTTP 400 / API key not valid** (revoked); the current local `.env`
  uses a **different replacement key**; current HEAD contains **no active tracked
  Google API key**.
  **Risk status: closed as an active security blocker.**
  Remaining note: the dead key persists in public git history as historical
  residue only — since it is revoked/invalid, a history purge is **optional
  cleanup**, not required before pilot deployment.
- Repo visibility: **PUBLIC** (confirmed 2026-07-06, anonymous HTTP 200).
- Test-user passwords that transited chat are burned — current ones were set fresh.
- Business-content follow-up flags from the v4.7 signoff: operator to specify
  (candidates: DSCR / dollar figures / Richmond-HVIP references).
