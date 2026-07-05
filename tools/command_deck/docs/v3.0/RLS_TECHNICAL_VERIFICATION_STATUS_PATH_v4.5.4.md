# SYS_OS v4.5.4 — RLS_TECHNICAL_VERIFICATION_STATUS_PATH

Adds the one missing piece of the v4.4.3 RLS hardening: a **safe channel to record
`TECHNICALLY_VERIFIED`** — reachable only by an actual machine-executed two-user
isolation test that passes end-to-end with confirmed cleanup. No button, script,
attestation, backup restore, or remote pull can set it any other way.

---

## 1. The runner — `environment.runTechnicalRLSVerification()`

The ONLY code path that writes `TECHNICALLY_VERIFIED`. Async, live, 17-step:

1. Preconditions: `runtimeConfig.isSupabaseConfigured().ok` (else `CONFIG_REQUIRED`);
   local `TEST_USERS` block with A/B email+password in the git-ignored runtime
   config (else `CONFIG_REQUIRED`). Credentials are never logged or stored.
2. Sign in as A → write `sysos.test.rls.user_a` → read own row back byte-exact.
3. Sign out → sign in as B → assert **distinct uid** → attempt to read A's row:
   anything but `null` → **VIOLATION** → stores `FAILED` + aborts.
4. B writes/reads own row → sign out → back to A → attempt to read B's row:
   anything but `null` → **VIOLATION** → stores `FAILED` + aborts.
5. A's row must still be present (cross-session persistence).
6. Cleanup: each user deletes only its own row under its own session; both key
   listings must show **0** test rows, else fail (no record written).
7. Only after ALL of the above: the verification record is stored, audit events
   `deploy.rls_technical_started` / `deploy.rls_technically_verified` emitted.
8. Ends with both sessions signed out.

Failure semantics: isolation **violations** store `FAILED` (serious, sticky);
setup/auth/network errors store **nothing** — a transient fault never overwrites
prior state. Every failure returns `{ok:false, stage, reason, steps}`.

## 2. The record (stored at `sysos.deploy.rls.v1` — no secrets)

```
status: TECHNICALLY_VERIFIED · verifiedAt · method: live_two_user_machine_test ·
projectRef · backendMode: remote_supabase · testKeys · result: pass ·
userA/userB (6-char redacted uid prefixes) · cleanupConfirmed: true ·
evidenceHash (SHA-256 of the step evidence) · by (operator)
```

## 3. The integrity gate — `effectiveRLS()` / `validateTechRecord()`

A stored `TECHNICALLY_VERIFIED` only counts if ALL hold; otherwise the effective
status derives down to `TECHNICAL_VERIFICATION_REQUIRED` with an explicit reason
(the stored record is never mutated):

| Condition | Failure reason shown by the guard |
|---|---|
| `method === 'live_two_user_machine_test'` | "record not produced by the live machine test" |
| `cleanupConfirmed === true` | "cleanup not confirmed in record" |
| `projectRef` equals the **currently configured** project | "Supabase project changed since verification — rerun required" |
| age ≤ `DEPLOY.RLS_VERIFICATION_MAX_AGE_DAYS` (30) | "verification stale (>30 days) — rerun required" |

Plus the standing rules: no live config → `CONFIG_REQUIRED` regardless of any
stored value; `OPERATOR_ATTESTED` remains guard **WARN**, never PASS; imported
records (backup restore / remote pull) are still downgraded by
`sanitizeRLSImport` before they ever reach storage.

## 4. Operator control (Station 15)

New button **"Run Technical RLS Verification"** in the Deployment Readiness bar.
It **runs the real live test** (several seconds; multiple sign-ins; ends signed
out) and reports PASS with step count + evidence hash, or the exact failing
stage + reason. It cannot mark anything without the live proof. Requires the
local runtime config + `TEST_USERS` (LOCAL no-config → honest `CONFIG_REQUIRED`).

## 5. Verified live in this build (real backend, project `xwgm***`)

- Real run through the new path: **all 6 proof steps passed**, cleanup confirmed,
  evidence hash recorded, uids `be4576…`/`8130b9…` (same users as the v4.5.3
  milestone test).
- Guard `RLS isolation verified` = **PASS** — first time in project history —
  with detail "technically verified <ts> (live two-user machine test)".
- Overall guard: still honestly `PRODUCTION_BLOCKED` (blocking reduced to
  `Server persistence` — sessions end signed out; hosting still pending).
- Tamper matrix all refused PASS: attestation → WARN; wrong projectRef / stale
  date / wrong method fakes → BLOCK with the exact reason; sanitizer still
  downgrades imports; reset works; no-config path returns `CONFIG_REQUIRED`.

## 6. Honest limits (unchanged stance)

This is client-side deployment discipline, not tamper-proof security: an
operator with DevTools can still hand-craft a matching record locally. The
protections target the real failure modes — accidental import, stale claims,
project switches, and attestation inflation — and every event is audit-logged.
