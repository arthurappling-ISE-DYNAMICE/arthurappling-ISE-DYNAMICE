# SYS_OS v4.5.3 — SUPABASE / RLS VERIFICATION PASS (MILESTONE RECORD)

**Type:** Milestone record of the first successful live backend verification.
**Session:** v4.5.3 LOCAL SUPABASE CONNECTION CONTINUATION (July 2026, operator-assisted).
**Code release at time of test:** v4.5.2 ACTIVATION_ENABLEMENT_VALIDATOR_HARDENING (HEAD `26f8b24b`).
**No secrets in this document** — all identifiers redacted; keys/passwords never recorded.

---

## What was proven, live, machine-executed

| Check | Result | Evidence |
|---|---|---|
| Supabase project connected | ✅ PASS | Project ref `xwgm…` (operator's sole project); URL ref verified equal to dashboard Project ID |
| API key accepted | ✅ PASS | Live gateway probe `/auth/v1/health` → **HTTP 200** (legacy anon JWT key, 208 chars, live-verified by the Desktop key-fixer tool before saving) |
| Runtime validator | ✅ PASS | `runtimeConfig.isSupabaseConfigured()` → `CONFIGURED` |
| CSP | ✅ PASS | `connect-src` allows the project origin (local untracked test page `index.local.html` only) |
| Authentication — test1 | ✅ PASS | `signInWithPassword` ok; session valid; uid `be4576…` |
| Authentication — test2 | ✅ PASS | `signInWithPassword` ok; session valid; uid `8130b9…`; uids distinct |
| Persistence | ✅ PASS | `healthCheck` → "reachable; RLS-scoped query ok"; wrote `sysos.test.rls.user_a`, read back byte-identical; visible in `listKeys` |
| **RLS isolation — B→A** | ✅ PASS | Signed in as test2: `getItem('sysos.test.rls.user_a')` → **null**; key listing showed 0 foreign rows |
| **RLS isolation — A→B** | ✅ PASS | Signed back in as test1: `getItem('sysos.test.rls.user_b')` → **null**; listing showed only own row |
| Cleanup | ✅ PASS | Each user removed only its own test row under its own session; final `listKeys` = 0 for both; both sessions signed out |
| Console | ✅ PASS | No errors or warnings throughout |

## Why PRODUCTION remained BLOCKED despite this pass

By design. The v4.4.3 hardening removed every code path that lets a client-side
actor set `TECHNICALLY_VERIFIED` — precisely so that no script, operator click,
backup restore, or remote pull can rubber-stamp RLS. The test above WAS a real
machine-executed two-user proof, but SYS_OS had no safe channel to record it.
Guard state after the test: `PRODUCTION_BLOCKED`, blocking = Server persistence
(sessions signed out) + RLS isolation verified (no status write path). That gap
is the subject of the next build: **v4.5.4 RLS_TECHNICAL_VERIFICATION_STATUS_PATH**.

## Session engineering notes (for the record)

- The activation stalled repeatedly on credential handoff; the working pattern
  was **self-verifying Desktop tools** (`SYSOS_KEY_FIX.bat`) that live-test each
  pasted value against Supabase before saving it locally.
- The publishable (`sb_publishable_`) key the operator held never matched the
  live project (likely minted by an earlier deleted project); the **legacy anon
  JWT key** resolved it.
- test users: recreated by operator with **Auto Confirm** enabled after
  `Invalid login credentials` / `Email not confirmed` failures.
- All test artifacts are local-only and untracked: `config.local.js`
  (git-ignored; holds runtime config + temporary TEST_USERS), `index.local.html`
  (CSP + SDK + config wiring), `supabase.local.js` (vendored SDK).
