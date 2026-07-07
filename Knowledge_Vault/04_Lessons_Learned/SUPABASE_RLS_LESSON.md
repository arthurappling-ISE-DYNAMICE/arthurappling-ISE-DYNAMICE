# Supabase / RLS Lesson

- **Project URL and API key must match.** A mismatched pair produces
  confusing auth failures that look like a code bug but are a config bug.
- **The legacy anon key solved a key mismatch** that was blocking
  authentication — when auth fails mysteriously, verify the key/project
  pairing before assuming the code is wrong.
- **Test users must have known, fresh passwords.** Never reuse a password
  that was ever pasted into chat (see root `CLAUDE.md` Supabase Rules).
- **"Auto Confirm User" matters.** If new test accounts aren't
  auto-confirmed, login will fail in a way that looks like an auth bug but
  is actually a project setting.
- **RLS proves user isolation.** The only way to trust RLS is to prove it —
  create two test users, confirm each can only see their own data.
- **Production Guard must never fake PASS.** A PASS is only real if the
  test actually ran and passed against live infrastructure.
- **Final result:** authentication, persistence, and RLS isolation all
  passed against live Supabase infrastructure (v4.5.3 first live pass,
  hardened further in v4.5.4).
