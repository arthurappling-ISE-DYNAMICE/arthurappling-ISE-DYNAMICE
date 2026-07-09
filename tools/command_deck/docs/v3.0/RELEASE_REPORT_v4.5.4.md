# SYS_OS v4.5.4 — RELEASE REPORT (RLS_TECHNICAL_VERIFICATION_STATUS_PATH)

- **Version:** 4.5.4 · **Codename:** RLS_TECHNICAL_VERIFICATION_STATUS_PATH · **Previous:** 4.5.2
- **Type:** Controlled engineering build; includes LIVE verification against the operator's real Supabase project
- **Banked milestone:** `SUPABASE_RLS_VERIFICATION_PASS_v4.5.3.md` (first live backend pass) + `docs/CURRENT_STATE.md`

---

## Scope shipped

1. **`runTechnicalRLSVerification()`** (environment.js) — the only code path that
   can record `TECHNICALLY_VERIFIED`; executes the full live two-user isolation
   sequence with confirmed cleanup; violations store `FAILED`; transient errors
   store nothing; ends signed out. Old placeholder name delegates to it.
2. **Verification record** — timestamp, method, projectRef, redacted uids, test
   keys, cleanup flag, evidence hash, operator. No secrets.
3. **Integrity gate** (`validateTechRecord`/`effectiveRLS`) — stored PASS honored
   only if method+cleanup match, projectRef equals current config, and age ≤
   `DEPLOY.RLS_VERIFICATION_MAX_AGE_DAYS` (30, new config constant); else derives
   to `TECHNICAL_VERIFICATION_REQUIRED` with explicit reason.
4. **Station 15 button** "Run Technical RLS Verification" — runs the real test,
   reports PASS/stage-of-failure; never merely marks.
5. Guard PASS detail now cites the live test + timestamp; downgrade reasons
   surface verbatim.

## Files changed
- `assets/js/environment.js` — runner, integrity gate, guard details, UI button/handler.
- `assets/js/config.js` — VERSION/CODENAME/PREVIOUS bump; `RLS_VERIFICATION_MAX_AGE_DAYS`.
- `index.html` — badge 4.5.2 → 4.5.4.
- `docs/v3.0/` — this report + spec + operator addendum + **SUPABASE_RLS_VERIFICATION_PASS_v4.5.3.md** (milestone bank).
- `docs/VERSION_HISTORY.md` + repo-root `docs/CURRENT_STATE.md`.
- `index_v4.5.4.html` + `archives/v4.5.4/` (snapshot — local credential files explicitly excluded).

## Verification evidence (measured)

### Baseline (pre-build, v4.5.2, LOCAL page)
HEAD `26f8b24b`, synced, nothing staged, no tracked secrets; smoke 18/18 ·
drills 6/6 · maintenance 10/10 · integrity 88/0 · gate 36/0 · vault valid ·
monitoring active · no console errors · RLS `CONFIG_REQUIRED`.

### No-config honesty (committed LOCAL page)
`runTechnicalRLSVerification()` → `{ok:false, stage:'preconditions',
reason:'CONFIG_REQUIRED — LOCAL'}`; alias delegates identically; attestation
rejected without config; validator spot-checks (publishable=CONFIGURED,
sb_secret=BLOCK) hold; guard RLS line BLOCK.

### Tamper matrix (live page, before real run)
| Attack | Guard RLS line |
|---|---|
| Operator attestation | **WARN** — "technical verification still required" |
| Injected `TECHNICALLY_VERIFIED`, wrong projectRef | **BLOCK** — "project changed — rerun required" |
| Injected, correct ref, stale date (2026-01-01) | **BLOCK** — "stale (>30 days) — rerun required" |
| Injected, `method:'manual'` | **BLOCK** — "not produced by the live machine test" |
| Import sanitizer unit | still downgrades to `TECHNICAL_VERIFICATION_REQUIRED` |

### THE REAL RUN (live, project `xwgm***`)
`runTechnicalRLSVerification()` → **ok:true** · steps: A wrote+read own row →
B cannot read A (proof 1) → B wrote+read own row → A cannot read B (proof 2) →
A row persisted across sessions → cleanup confirmed (0 rows both users) ·
evidenceHash `2d93413af1ae…` · verifiedAt `2026-07-05T14:45:37Z` · stored record
complete (method/projectRef/uids `be4576…`,`8130b9…`/cleanup/result) · audit
events started+verified recorded.

**Guard after:** `RLS isolation verified` = **PASS** ("technically verified …
(live two-user machine test)") — first PASS in project history. Overall:
**PRODUCTION_BLOCKED** (honest), blocking reduced to `Server persistence`
(sessions end signed out; hosting still WARN/localhost). Deployment panel:
"technically verified" / `REHEARSAL_READY`. No console errors.

### Final regression (fresh boot, committed LOCAL page, post-bump)
Boots **v4.5.4**; badge matches; smoke 18/18 · drills 6/6 · maintenance 10/10 ·
integrity 88/0 · gate 36/0 · vault valid · monitoring active · no console
errors. (Recorded in pre-push report.)

## RULE ZERO compliance
No push · no Pages · no new Supabase projects · no secrets printed/committed
(uids redacted to 6 chars; keys/passwords never appear) · config.local.js and
supabase.local.js explicitly excluded from the archive snapshot · unrelated
files untouched · production NOT claimed ready — guard remains BLOCKED on real
grounds.
