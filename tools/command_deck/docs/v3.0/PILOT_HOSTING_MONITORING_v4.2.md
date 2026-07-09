# SYS_OS v4.2.0 — PILOT_HOSTING_MONITORING

Hosting target: **GitHub Pages**. Status: monitoring **active (LOCAL)**; hosting +
live Supabase remain **CONFIG_REQUIRED**; **PRODUCTION stays BLOCKED**.

This release prepares SYS_OS for HTTPS static hosting and adds a client-side
runtime monitoring sink, while preserving LOCAL-first behaviour. It does **not**
deploy, connect live Supabase, or flip PRODUCTION to ready.

---

## 1. Monitoring sink (`assets/js/monitoring.js`)

A LOCAL-only observation layer. Nothing leaves the browser — events route into
the existing central audit trail and the recent-activity ledger.

- Installs global `error` + `unhandledrejection` listeners at **parse time**
  (earliest capture, before `main.js` boots).
- Captured event types (also recorded as audit actions, domain `monitoring`):
  `monitoring.runtime_error`, `monitoring.unhandled_rejection`,
  `monitoring.guard_failure`, `monitoring.vault_failure`,
  `monitoring.integrity_failure`, `monitoring.health_checked`.
- Defensive: every sink call is guarded (`try/catch` + reentrancy flag); a
  monitoring outage can never crash the platform, and it works even if
  audit/activity are unavailable.
- **Not boot-gated** (like backup/environment/remoteBackend): absent from the
  bootcheck MANIFEST so a monitoring fault never halts the OS. Boot gate stays
  36/0; smoke 18, drills 6, maintenance 10 are unchanged.
- Status surface: **Station 15 // ENVIRONMENT** renders a "Runtime Monitoring"
  panel (status, capture state, per-type counters + last event, LOCAL-only
  warning). Hooks: `SYSOS.monitoring.getStatus()`, `.selfTest()`, `.reset()`.

## 2. CSP / Supabase hosting readiness (`index.html`)

The committed CSP stays **LOCAL-safe** (`connect-src 'self' http://localhost:3132
http://localhost:4173`). It is delivered via `<meta http-equiv>` because **GitHub
Pages cannot set HTTP headers** — the meta tag IS the policy.

To enable a configured remote deploy, the operator adds **only their own** project
origin — a single scoped HTTPS origin, **no wildcard, no real URL committed**:

```
connect-src 'self' https://YOUR_PROJECT_REF.supabase.co
```

The CSP is **not weakened broadly** and uses no wildcards. The exact edit is
documented here and in the operator addendum. No real Supabase URL is hardcoded
anywhere in the repo.

## 3. GitHub Pages hosting

### Setup steps
1. Push the branch to GitHub (this build stops before push — see release report).
2. GitHub → repo **Settings → Pages**.
3. **Source:** Deploy from a branch.
4. **Branch/source strategy:** SYS_OS lives in `tools/command_deck/`. A GitHub
   *project* site serves at `https://<user>.github.io/<repo>/`. Choose one:
   - **(a) Subtree publish (recommended):** publish a branch whose root is the
     app, or use a `gh-pages` deploy that pushes `tools/command_deck/**` to the
     site root. Asset paths are relative (`assets/...`), so they resolve.
   - **(b) `/docs` path:** only if the app is relocated/copied under `/docs`.
5. Save → wait for the Pages build → open the published URL.

### HTTPS confirmation
GitHub Pages serves over **HTTPS by default** → `window.isSecureContext` is
`true` → the vault hash uses the cryptographic path (no degrade). Confirm the
padlock and that the Environment guard's `Hosting / HTTPS` row is **WARN**
(secure context OK) rather than **BLOCK**.

### ⚠ Project base path warning
A project site is served under `/<repo>/`, **not** the domain root. Verify every
asset (`assets/css`, `assets/js`, `assets/fonts`) returns **200** under the base
path before go-live. If assets 404, the publish source root is wrong (see step 4)
— do not "fix" by loosening the CSP.

### Rollback strategy
- **Host-level:** revert the published commit (or re-point Pages to a prior
  commit/branch); or disable Pages → instant return to LOCAL-only distribution.
- **App-level (existing):** set `BACKEND.REMOTE_ENABLED=false` / remove
  `config.local.js` → instant LOCAL; v3.8 backup JSON is the portable escape
  hatch. Local data is never touched.

## 4. Supabase `config.local.js` strategy (no secrets in repo)

Remote is **opt-in**. Provide runtime config via a **git-ignored**
`assets/js/config.local.js` (never committed):

```js
window.__SYSOS_RUNTIME__ = {
  BACKEND: { MODE: 'remote_supabase', REMOTE_ENABLED: true,
    SUPABASE_URL: 'https://YOUR_PROJECT_REF.supabase.co',
    SUPABASE_ANON_KEY: 'YOUR_ANON_PUBLIC_KEY' }   // ANON only — never service-role
};
```

Then add the matching `connect-src` origin (§2). See
`pilot_backend/README.md` for the schema + RLS setup.

### 🔒 No secrets in repo
- Frontend uses the **ANON (public) key only**, never the service-role key.
- Never commit `.env`, real keys, service-role keys, or backup JSON.
- `config.local.js` is git-ignored and is **not** published by Pages logic — but
  remember Pages serves whatever is in the publish source, so keep it ignored and
  out of the published tree.

## 5. Production guard (Station 15)

`runProductionGuard()` now reports monitoring honestly and adds explicit line
items. PRODUCTION remains BLOCKED until ALL are real:

| Check | This build |
|---|---|
| Monitoring | **PASS** (LOCAL sink active) |
| Runtime error capture | **PASS** |
| Guard failure capture | **PASS** |
| Hosting / HTTPS | WARN (secure ctx) / CONFIG_REQUIRED (no host) |
| Authentication | **BLOCK** (no live backend auth) |
| Server persistence | **BLOCK** (localStorage only) |
| RLS isolation verified | **BLOCK** (CONFIG_REQUIRED) |
| Rollback path | **PASS** (documented) |

Result: `PRODUCTION_BLOCKED`. No false READY claim.

## 6. What this build does NOT do (deferred)

Deploy to Pages, connect live Supabase, verify live RLS isolation, add external
alerting, or flip the synchronous storage backend to async. PRODUCTION stays
honestly BLOCKED until auth + persistence + hosting + monitoring alerting + live
RLS are real.
