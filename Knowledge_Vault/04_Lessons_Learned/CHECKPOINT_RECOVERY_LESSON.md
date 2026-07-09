# Checkpoint Recovery Lesson

- **Repeated loops mean stop and checkpoint.** If a workflow fails the same
  way twice, stop trying small variations — the path itself is the problem.
- **Preserve verified work.** Never tear down a banked PASS to make progress
  somewhere else in the system.
- **Restart from known-good state.** Identify the last verified checkpoint
  (last banked PASS, last clean commit, last verified release) and restart
  from there with a clean prompt — not from panic.
- **The Supabase/RLS deployment lesson:** the v4.5.3 Supabase/RLS pass only
  succeeded after preserving verified state and restarting from clean
  credentials — patching the failed path harder did not work.
- **VS Code / API setup lesson:** environment/config setup issues are often
  faster to solve by rebuilding a small config from a clean template than by
  hunting for a syntax error in a broken one.
- **Never rebuild proven infrastructure without evidence of corruption.**
  Assume working infrastructure is working unless there is concrete proof
  otherwise.
