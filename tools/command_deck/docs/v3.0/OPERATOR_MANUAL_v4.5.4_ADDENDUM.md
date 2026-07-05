# SYS_OS v4.5.4 — Operator Manual Addendum (RLS_TECHNICAL_VERIFICATION_STATUS_PATH)

Additive to v4.5.2. LOCAL mode unchanged. One new button.

---

## New: "Run Technical RLS Verification" (Station 15 → Deployment Readiness)

This button runs the **real** two-user isolation test against your live Supabase
project — the same sequence that was executed manually in the v4.5.3 session —
and it is now the **only** way RLS can ever show PASS on the Production Guard.

**What it needs before it will run:**
- Your live runtime config (`config.local.js`) loaded — i.e., run it from your
  local test page, not the plain LOCAL app.
- The `TEST_USERS` block (test1/test2 email+password) present in that same
  git-ignored file. Missing → it reports `CONFIG_REQUIRED` and does nothing.

**What it does (≈5–10 seconds):** signs in as test1 → writes a test row → signs
in as test2 → proves test2 **cannot** see it → test2 writes its own row → back
to test1 → proves test1 **cannot** see test2's row → deletes both test rows →
signs everyone out. Only if every step passes does it record
`TECHNICALLY_VERIFIED` (with timestamp, project, redacted user ids, and an
evidence hash). You'll see either **RLS TECHNICALLY VERIFIED** with the step
count, or the exact failing stage.

**Things that will (correctly) invalidate a green RLS status later:**
- Switching to a different Supabase project → "project changed — rerun required"
- More than 30 days passing → "verification stale — rerun required"
- Restoring a backup / pulling from remote → imported status downgrades; rerun
- An isolation VIOLATION during a run → status becomes **FAILED** (do not deploy)

**What still does NOT change:**
- "Record RLS Operator Attestation" still yields WARN, never PASS.
- No live config → RLS shows `CONFIG_REQUIRED`, whatever is stored.
- The test ends signed out, so `Server persistence` on the guard will show BLOCK
  again until you sign in — that's honest, not a bug.

## Housekeeping after a green run
- You may delete the `TEST_USERS` block from `config.local.js` once verified
  (rerunning later will need it again).
- The Desktop helper files (`SYSOS_KEY_FIX.*`, `SYSOS_USER_FIX.*`,
  `SYSOS_RLS_SETUP.*`) are no longer needed and can be deleted.
- Standing items: rotate the old Google API key; confirm repo visibility;
  GitHub Pages decisions before any hosting mission.
