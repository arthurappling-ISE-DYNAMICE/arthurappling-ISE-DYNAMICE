# SYS_OS v4.4.3 — RELEASE REPORT (ARCHITECTURE_CLEANUP_RLS_HARDENING)

- **Version:** 4.4.3 · **Codename:** ARCHITECTURE_CLEANUP_RLS_HARDENING · **Previous:** 4.3.0
- **Type:** Controlled cleanup build (no live infrastructure)
- **Verification:** live, in-browser via static server on :4173 (`http-server`)

---

## Scope shipped

1. **`runtime_config.js`** (new) — centralizes backend-config merge, Supabase
   URL/key format validation, CSP-Supabase-origin detection, and hosting-state
   detection. Replaces 4 duplicated config-merge copies and 2 duplicated
   CSP-detection copies.
2. **Supabase config validation** — non-secret format checks (Phase 6): malformed
   URL/wrong-host/localhost → `CONFIG_INVALID`; service-role-named key → `BLOCK`;
   valid `*.supabase.co` HTTPS URL + JWT-shaped key → `CONFIGURED`.
3. **RLS hardening** (Phase 7) — 7-state model replacing the loose
   verified/not-verified self-attestation. Operator attestation now produces
   **WARN**, never PASS, on the Production Guard. New
   `verifyRLSIsolationTechnical()` placeholder always returns `CONFIG_REQUIRED`.
4. **Hosting-readiness alignment** (Phase 8) — Guard and Deployment panel now
   read from the same `getHostingState()` authority.

## Files changed
- `assets/js/runtime_config.js` — **new**.
- `assets/js/auth_remote.js` — `cfg()`/`isConfigured()`/`getAuthStatus()` routed through `runtimeConfig`.
- `assets/js/remote_backend.js` — `cfg()` routed through `runtimeConfig`.
- `assets/js/monitoring.js` — `deploymentHealthCheck()` CSP/backend logic routed through `runtimeConfig`.
- `assets/js/environment.js` — `backendCfg`/`cspSupabaseState` duplicates removed; new RLS status model (`RLS_STATUSES`, `effectiveRLS`, `recordRLSChecklistStarted`, `recordRLSResult`, `verifyRLSIsolationTechnical`); guard checks + `deploymentReadiness()` updated; one button label + notify text corrected for honesty.
- `assets/js/config.js` — VERSION/CODENAME/PREVIOUS bump.
- `index.html` — load `runtime_config.js` after `config.js`; version badge 4.3.0→4.4.3.
- `docs/v3.0/ARCHITECTURE_CLEANUP_RLS_HARDENING_v4.4.3.md`, `OPERATOR_MANUAL_v4.4.3_ADDENDUM.md`, `RELEASE_REPORT_v4.4.3.md` — **new**.
- `docs/VERSION_HISTORY.md` — v4.4.3 entry.
- `archives/v4.4.3/**`, `index_v4.4.3.html` — snapshot.

## Verification evidence (measured, in-browser)

### Baseline (pre-build, v4.3.0)
HEAD `968288a3`, synced, nothing staged. smoke 18/18 · drills 6/6 · maintenance
10/10 · integrity 88/0 · gate 36/0 · vault valid · monitoring active · deployment
panel present · no console errors.

### Post-build fresh boot (v4.4.3)
Boots **v4.4.3** (`ARCHITECTURE_CLEANUP_RLS_HARDENING`). smoke **18/18** · drills
**6/6** · maintenance **10/10** · integrity **88/0** · gate **36/0** (unchanged —
`runtime_config.js` intentionally not boot-gated) · vault **valid** · monitoring
**active** · **no console errors**.

### Centralization proof
`grep` confirms zero remaining `CONFIG.BACKEND) || {}` merge duplicates outside
`runtime_config.js`; all 4 consumer modules (`auth_remote.js`, `remote_backend.js`,
`environment.js`, `monitoring.js`) reference `SYSOS.runtimeConfig`.

### Validation proof (live)
| Input | Result |
|---|---|
| empty / placeholder URL | `CONFIG_REQUIRED` |
| malformed URL | `CONFIG_INVALID` ("not a valid URL") |
| wrong host (`evil.example.com`) | `CONFIG_INVALID` ("hostname does not end with .supabase.co") |
| `http://localhost:5432` | `CONFIG_INVALID` ("must be https") |
| `https://abcdefghij.supabase.co` | `CONFIGURED` |
| empty key | `CONFIG_REQUIRED` |
| short key | `CONFIG_INVALID` |
| key naming "service_role" | **`BLOCK`** |
| JWT-shaped key | `CONFIGURED` |

### RLS hardening proof (live, no network calls)
- Attestation with no config → **rejected** `config_required`.
- `verifyRLSIsolationTechnical()` → always `CONFIG_REQUIRED`, even with config present.
- With a shape-valid **in-page stub only** config (no real credentials, no network) →
  attestation succeeds as `OPERATOR_ATTESTED`; Production Guard's `RLS isolation
  verified` check = **WARN**, detail *"Operator attested; technical RLS
  verification still required."* — **never PASS**.
- Reset restores `CONFIG_REQUIRED`; stub config removed; guard/panel confirmed back
  to clean baseline (`PRODUCTION_BLOCKED`, blocking = Authentication, Server
  persistence, RLS isolation verified — identical to pre-refactor).

### Hosting alignment proof
`SYSOS.runtimeConfig.getHostingState()` consumed by both `runProductionGuard()`
and `deploymentReadiness()`; live check in LOCAL returns `{state:'LOCAL', detail:
'local dev context (secure)'}` and both surfaces report consistent WARN-level
hosting/HTTPS status.

### Preservation (v4.3 intact)
Self-test all six types true · backup export/validate valid/PASS · remote
`preview()` no-config → `config_required` · commercialUI mounted/valid + client
edit renders · Environment + Pilot Backend stations render · deployment health
check event now carries `hostingState`/`cspState` fields in addition to the v4.3
fields.

## RULE ZERO compliance
v4.3 not broken · SYS_OS not rewritten · LOCAL not replaced · no live Supabase · no
GitHub Pages enabled · no credentials created · no live API calls · no security
weakened (validation is strictly additive/stricter) · no new UI beyond the required
button-label honesty fix · no AI/agents/voice/payments/connectors · no
secrets/.env/config.local.js/service-role/backup JSON committed · no unrelated
files touched.
