# SYS_OS v4.4.3 — ARCHITECTURE_CLEANUP_RLS_HARDENING

A controlled cleanup build resolving the five findings from the Sonnet 5 controlled
architecture review (v4.4.2): duplicated config-merge logic, duplicated CSP/Supabase
origin detection, a loose RLS self-attestation gap, a hosting-readiness fidelity
mismatch, and missing Supabase URL/key format validation. **No live infrastructure,
no new UI, no weakened security.** LOCAL behavior and all v4.3 functionality preserved.

---

## 1. New module: `assets/js/runtime_config.js`

Single source of truth for four previously-duplicated concerns, loaded immediately
after `config.js` (before monitoring/auth_remote/remote_backend/environment):

| Function | Replaces |
|---|---|
| `getBackendConfig()` | 4 independent `Object.assign(CONFIG.BACKEND, __SYSOS_RUNTIME__.BACKEND)` copies (auth_remote.js, remote_backend.js, environment.js, monitoring.js) |
| `validateSupabaseUrl()` | (new) format validation — was previously just a non-empty-string check |
| `validateAnonKeyShape()` | (new) key-shape validation, service-role name detection |
| `isSupabaseConfigured()` | `authRemote.isConfigured()`'s old loose check |
| `getCspSupabaseState()` | `environment.js`'s `cspSupabaseState()` + `monitoring.js`'s inline duplicate |
| `getHostingState()` | `environment.js`'s two separate hosting-fidelity checks (guard vs panel) |
| `getRuntimeHealthSummary()` | (new) aggregate, non-secret, safe to log |

No secret **values** are ever returned — only booleans, enums, and redacted metadata
(origin, shape-valid, length-class). No network calls anywhere in this module.

## 2. Config validation (Phase 6)

`validateSupabaseUrl(url)`:
- empty or contains a known placeholder marker → `CONFIG_REQUIRED`
- fails `new URL()` → `CONFIG_INVALID` ("not a valid URL")
- not `https:` → `CONFIG_INVALID` ("must be https")
- `localhost`/`127.0.0.1` → `CONFIG_INVALID` ("not a production Supabase host")
- hostname not `*.supabase.co` → `CONFIG_INVALID`
- otherwise → `CONFIGURED` (+ origin)

`validateAnonKeyShape(key)`:
- empty/placeholder → `CONFIG_REQUIRED`
- key name/value contains `service_role`/`service-role` → **`BLOCK`** (never printed)
- not JWT-shaped (`x.y.z`) → `CONFIG_INVALID`
- JWT-shaped → `CONFIGURED`

Verified live: placeholder URL/key, malformed URL, wrong host, localhost URL, valid
`*.supabase.co` URL, empty/short/service-role-named/JWT-shaped keys — all returned
their exact specified status (see release report for raw output).

## 3. CSP centralization (Phase 5)

`getCspSupabaseState()` states: `LOCAL_ONLY` (no Supabase configured) →
`CONFIG_INVALID` (malformed URL) → `BLOCK` (valid URL, CSP missing the exact origin)
→ `PASS` (CSP contains the exact origin). **No wildcard is ever accepted as PASS** —
origin match is an exact substring check against the parsed origin string.

## 4. RLS hardening (Phase 7) — the core of this release

Replaced the v4.3 loose `verified: true/false` self-attestation with a seven-state
model:

`NOT_TESTED` · `CHECKLIST_STARTED` · `OPERATOR_ATTESTED` ·
`TECHNICAL_VERIFICATION_REQUIRED` · `TECHNICALLY_VERIFIED` · `FAILED` ·
`CONFIG_REQUIRED`

- **Without live Supabase, the effective status is always `CONFIG_REQUIRED`** —
  `environment.getRLSStatus()` forces this regardless of any stored value
  (`effectiveRLS()`), so a stale attestation from a since-removed config can never
  leak through as readiness.
- **"Record RLS Operator Attestation"** (the renamed "Record RLS Verified" button —
  same button, honest label) sets `OPERATOR_ATTESTED`, not verified. Rejected
  (`config_required`) without a live, shape-valid Supabase config.
- **The Production Guard never shows PASS for `OPERATOR_ATTESTED`** — it shows
  **WARN**: *"Operator attested; technical RLS verification still required."*
  Only `TECHNICALLY_VERIFIED` produces PASS.
- **`verifyRLSIsolationTechnical()`** — a placeholder for a future automated
  two-session cross-account read test. In this build it **always** returns
  `CONFIG_REQUIRED` with an explicit "not implemented" detail. No live calls, no
  simulated success, ever.
- **Verified live:** attestation attempt with no config → rejected; with a
  shape-valid (stubbed, non-network) config → `OPERATOR_ATTESTED` recorded, guard
  check = **WARN** (not PASS); technical-verification placeholder still
  `CONFIG_REQUIRED` even with config present; reset restores `CONFIG_REQUIRED`.

## 5. Hosting-readiness alignment (Phase 8)

`getHostingState()` states: `LOCAL` (localhost dev) · `HTTPS_PRESENT` (secure but
not a verified Pages host) · `GITHUB_PAGES_VERIFIED` (`*.github.io` + HTTPS) ·
`BLOCK` (insecure, non-local). **Both** `runProductionGuard()`'s `Hosting / HTTPS`
check and `deploymentReadiness()`'s `hostingStatus`/`httpsStatus` fields now derive
from this single function — they can no longer disagree.

## 6. What did NOT change (Rule Zero)

- LOCAL mode, localStorage, boot order, boot-gate manifest (still 36 modules —
  `runtime_config.js` is intentionally NOT boot-gated, consistent with
  monitoring/environment/backup/authRemote/remoteBackend).
- No new UI surfaces. The Environment station's Deployment Readiness panel keeps
  its 4 existing buttons; only one button's label was corrected for honesty
  ("Record RLS Verified" → "Record RLS Operator Attestation") and its notify text.
- No live infrastructure, no credentials, no network calls, no Supabase project,
  no GitHub Pages.
- Production Guard still reports `PRODUCTION_BLOCKED` in LOCAL, blocking
  Authentication, Server persistence, RLS isolation verified — identical to v4.3.
