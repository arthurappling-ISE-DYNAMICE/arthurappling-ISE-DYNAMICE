# SYS_OS v4.5.2 — ACTIVATION_ENABLEMENT_VALIDATOR_HARDENING

A small, controlled pre-activation build. Fixes the blocker that stopped the
v4.5.1 live Supabase activation (new `sb_publishable_` key format rejected by the
validator) plus the four highest-value pre-activation P1 findings from the
Fable 5 senior review. **No live infrastructure, no live calls, no secrets, no
new features.** LOCAL behavior and all v4.4.3 functionality preserved.

---

## 1. Supabase key-format support (`runtime_config.js`)

`validateAnonKeyShape()` now handles **both Supabase key generations**:

| Input | Status |
|---|---|
| `sb_publishable_…` (new browser-safe key) | `CONFIGURED` |
| `sb_secret_…` (new server-only secret) | **`BLOCK`** — never in the browser |
| Legacy JWT-shaped anon key (`x.y.z`) | `CONFIGURED` (unchanged) |
| Anything referencing `service_role` | **`BLOCK`** (unchanged) |
| Empty / placeholder | `CONFIG_REQUIRED` (unchanged) |
| Malformed / truncated | `CONFIG_INVALID` |

Check order: `sb_secret_` → `service_role` → `sb_publishable_` → JWT — so a
server key is blocked before any accept path can see it. No key values are ever
returned or printed (bucketed `lengthClass` only; new bucket `publishable`).

This unblocks v4.5.1 Phase 4: Supabase projects issuing new-format publishable
keys will now validate as `CONFIGURED`.

## 2. CSP check scoped to `connect-src` (`runtime_config.js`)

`getCspSupabaseState()` previously matched the Supabase origin **anywhere** in
the CSP string — an origin pasted into `script-src` alone produced a false PASS
(proven live in the Fable 5 review). Now:

- The CSP is parsed into directives; only **`connect-src`** is inspected.
- Origin present in another directive only → **BLOCK** ("origin in other
  directives does not count").
- `connect-src` directive missing entirely → **BLOCK** (conservative), with the
  exact line to add.
- Wildcards (`https://*.supabase.co`, `*`) never satisfy the check — only the
  exact origin string does.
- No Supabase configured → `LOCAL_ONLY` (unchanged).

## 3. Validated client gate (`auth_remote.js`)

`client()` previously instantiated the Supabase client from raw non-empty
strings — a placeholder or malformed URL could create a (cached-forever) client
and `signIn()` could fire at an invalid host. Now:

- `client()` requires `runtimeConfig.isSupabaseConfigured().ok` — the same
  validated path the guard uses. Invalid/placeholder config → no client, ever.
- The cache is **keyed by origin**: config becomes invalid → cache nulled;
  config points at a different project → fresh client for the new origin.
- No-config behavior preserved: `isConfigured()` false, `signIn()` returns a
  clean `not_configured`; SDK missing → honest `SDK_MISSING`.

## 4. `ENVIRONMENT_PROFILE` dead field removed (`config.local.example.js`)

The template advertised `ENVIRONMENT_PROFILE`, but `environment.detect()` never
read it (URL `?profile=` param → stored profile → `SYSOS.CONFIG.PROFILE` →
LOCAL). **Option A chosen: field removed** with an explanatory note pointing to
the Station 15 selector / `?profile=` param. No detection code changed;
LOCAL default and all existing precedence preserved. The template also now
documents both accepted key formats.

## 5. RLS status import hardening (`environment.js` + `backup.js` + `remote_backend.js`)

`sysos.deploy.rls.v1` could previously be restored from a backup (or pulled from
remote) containing `TECHNICALLY_VERIFIED`, making the guard show RLS **PASS**
with no verification ever run on this machine — the injection back door found in
the Fable 5 review. **Option B implemented (sanitize, preserve context):**

- New `environment.sanitizeRLSImport(raw)`: an imported `TECHNICALLY_VERIFIED`
  is downgraded to **`TECHNICAL_VERIFICATION_REQUIRED`** with note
  *"imported status requires local re-verification"* and an audit event
  (`deploy.rls_import_downgraded`). All other statuses and unparseable values
  pass through unchanged; business data untouched.
- Called from **both** import paths: `backup.restore()` write-back and
  `remoteBackend.syncToLocal()` write-back (guarded — import still works if the
  environment module were absent).
- The guard gives `TECHNICAL_VERIFICATION_REQUIRED` an explicit BLOCK detail:
  *"imported/downgraded status — local technical re-verification required."*

Technical proof of RLS isolation is now **machine-local by construction**: it
cannot be set by the UI (v4.4.3), cannot survive backup restore, and cannot
survive remote pull.

## 6. What did NOT change

LOCAL mode, storage contract, boot-gate manifest (36 — unchanged), smoke/drills/
maintenance counts, backup/restore behavior for business data, sync gates,
Production Guard honesty (`PRODUCTION_BLOCKED` in LOCAL, same blocking set), and
the RLS state model. No live calls were made at any point; all tests used
in-page stubs and real local module machinery only.
