# SYS_OS v4.5.2 — RELEASE REPORT (ACTIVATION_ENABLEMENT_VALIDATOR_HARDENING)

- **Version:** 4.5.2 · **Codename:** ACTIVATION_ENABLEMENT_VALIDATOR_HARDENING · **Previous:** 4.4.3
- **Type:** Controlled pre-activation build (no live infrastructure, no live calls)
- **Trigger:** v4.5.1 live activation stopped with VALIDATOR_UPDATE_REQUIRED
  (operator-confirmed `sb_publishable_` key format) + Fable 5 P1 findings
- **Verification:** live, in-browser via static server on :4173; in-page stubs only

---

## Scope shipped

1. **Key validator** — accepts `sb_publishable_` (new) + legacy JWT anon keys;
   BLOCKs `sb_secret_` and `service_role`; placeholders CONFIG_REQUIRED;
   malformed CONFIG_INVALID.
2. **CSP scoping** — origin must be inside `connect-src` specifically; missing
   directive → conservative BLOCK; wildcards never PASS.
3. **Auth client gate** — `client()` requires validated config; origin-keyed
   cache resets on invalid/changed config.
4. **Template fix** — dead `ENVIRONMENT_PROFILE` removed (Option A); key-format
   guidance added.
5. **RLS import hardening** — `sanitizeRLSImport()` downgrades imported
   `TECHNICALLY_VERIFIED` → `TECHNICAL_VERIFICATION_REQUIRED` (audit-logged) in
   BOTH backup-restore and remote-pull write-backs; explicit guard detail added.

## Files changed
- `assets/js/runtime_config.js` — validator + `getCspDirective()` + scoped CSP check.
- `assets/js/auth_remote.js` — validated, origin-keyed `client()` gate.
- `assets/js/environment.js` — `sanitizeRLSImport()` + guard detail for `TECHNICAL_VERIFICATION_REQUIRED`.
- `assets/js/backup.js` — sanitizer call in restore write-back.
- `assets/js/remote_backend.js` — sanitizer call in pull write-back.
- `assets/js/config.local.example.js` — `ENVIRONMENT_PROFILE` removed; key-format notes.
- `assets/js/config.js` — VERSION/CODENAME/PREVIOUS bump.
- `index.html` — badge 4.4.3 → 4.5.2.
- Docs ×3 + `VERSION_HISTORY.md` + archive `index_v4.5.2.html` / `archives/v4.5.2/`.

## Verification evidence (measured, in-browser, zero network)

### Baseline (pre-build, v4.4.3)
HEAD `7d33c676`, synced, nothing staged. smoke 18/18 · drills 6/6 · maintenance
10/10 · integrity 88/0 · gate 36/0 · vault valid · monitoring active · RLS
CONFIG_REQUIRED · guard PRODUCTION_BLOCKED · no console errors.

### Key validator matrix (all live)
`sb_publishable_…` → CONFIGURED · `sb_secret_…` → **BLOCK** · JWT → CONFIGURED ·
malformed → CONFIG_INVALID · placeholder/empty → CONFIG_REQUIRED · service_role →
**BLOCK** · truncated publishable → CONFIG_INVALID. End-to-end:
`isSupabaseConfigured()` with a publishable-key stub → `ok:true`.

### CSP scoping (all live, meta restored after)
Origin in `script-src` only → **BLOCK** (was false PASS — regression fixed) ·
origin in `connect-src` → PASS · wildcard `https://*.supabase.co` → BLOCK ·
no `connect-src` directive → BLOCK with exact-line detail · no Supabase →
LOCAL_ONLY.

### Auth client gate (stub SDK, zero network)
No config → no client, `signIn` = `not_configured` · malformed URL →
CONFIG_INVALID **and no client created** (pre-fix it would have been) ·
valid-shaped → client created + cached · config invalidated → cache nulled ·
config re-pointed to a different origin → **new** client bound to the new URL ·
SDK missing → honest SDK_MISSING.

### RLS import hardening (end-to-end, real restore path)
Unit: TECHNICALLY_VERIFIED → downgraded + note; OPERATOR_ATTESTED and non-JSON
pass through. E2E: exported a real backup legitimately containing
TECHNICALLY_VERIFIED (written to storage pre-export so backup.js computed its
own valid hash) → cleared locally → **restore succeeded (vault chain valid)** →
stored status arrived as `TECHNICAL_VERIFICATION_REQUIRED` with the import note
→ guard `RLS isolation verified` = **BLOCK**, detail "imported/downgraded status
— local technical re-verification required" → overall PRODUCTION_BLOCKED →
`deploy.rls_import_downgraded` audit event present (1). Pull path: live-gated
(cannot execute without an authenticated remote); shares the identical guarded
sanitizer line (`remote_backend.js:193`) — unit + code evidence. Cleanup
verified: RLS back to CONFIG_REQUIRED, stubs removed, test snapshot removed.

### Preservation
Backup export ok / validate PASS / can_restore true · remote `preview()`
no-config → `config_required` · commercialUI mounted/valid · client edit renders
· `backup.js` confirmed **valid UTF-8** post-edit (a `file(1)` "data"
classification predates this build — HEAD version classifies identically; Node
`TextDecoder(fatal)` decode passes).

### Final fresh boot (v4.5.2)
Boots v4.5.2, badge matches · smoke 18/18 · drills 6/6 · maintenance 10/10 ·
integrity 88/0 · gate 36/0 · vault valid · monitoring active · deployment panel
present · guard PRODUCTION_BLOCKED · RLS CONFIG_REQUIRED · no console errors.
(Recorded in the pre-push report.)

## RULE ZERO compliance
No live infrastructure · no live API calls · no Supabase project created · no
GitHub Pages · no secrets printed (test fixtures were fake literals) · no
`.env`/`config.local.js` committed · guards strengthened, never weakened · no
features added · no unrelated files touched.
