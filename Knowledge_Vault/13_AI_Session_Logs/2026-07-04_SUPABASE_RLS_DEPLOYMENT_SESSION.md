# Supabase / RLS Deployment Session

- **Date:** 2026-07-04
- **Mission type:** Deployment / backend verification.
- **Summary:**
  - Set up Supabase connection for SYS_OS.
  - Hit an API key mismatch — the project URL and API key pairing did not
    line up, producing confusing auth failures that looked like a code bug.
  - Fixed by using the **legacy anon key**, which resolved the mismatch.
  - Hit a second issue: test user/password problems — accounts weren't
    behaving as expected on login.
  - Fixed by creating **fresh credentials** with known, disposable
    passwords rather than reusing anything from a prior attempt.
  - Result: **authentication PASS**.
  - Result: **persistence PASS** — data survived reload/session changes.
  - Result: **RLS isolation PASS** — verified one test user could not see
    another's data.
  - Result: **cleanup PASS** — disposable test users removed after
    verification.
- **Lesson:** when a workflow loops or fails the same way twice, stop
  patching the failed path — preserve whatever is already verified and
  restart from a clean checkpoint (fresh credentials, in this case). See
  `04_Lessons_Learned/CHECKPOINT_RECOVERY_LESSON.md` and
  `04_Lessons_Learned/SUPABASE_RLS_LESSON.md` for the extracted lessons.
- **Security note:** no real passwords or API keys are recorded in this log
  or anywhere in the vault. Credentials used were disposable test values,
  rotated/deleted after verification per root `CLAUDE.md` Supabase Rules.
