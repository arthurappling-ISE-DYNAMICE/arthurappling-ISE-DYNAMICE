# SYS_OS v4.3.0 — LIVE_DEPLOYMENT_REHEARSAL

A **rehearsal layer** for the first real hosted pilot on **GitHub Pages**. It adds
deployment-readiness controls, a safe Supabase config template, an RLS isolation
verification workflow, a deployment health probe, and an honest production guard —
**without deploying, exposing secrets, or claiming production readiness**.

Status after v4.3: deployment panel reports **REHEARSAL_READY** (live checks
pending); production guard stays **PRODUCTION_BLOCKED**. Never **READY** without
live Supabase + verified RLS + HTTPS hosting.

---

## 1. config.local template + secret exclusion

- **`assets/js/config.local.example.js`** (committed, placeholders only) shows how
  to enable Supabase: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (anon only),
  `BACKEND_MODE`/`MODE`, `REMOTE_ENABLED`, `ENVIRONMENT_PROFILE`.
- **`tools/command_deck/.gitignore`** ignores the **real** `assets/js/config.local.js`
  (and `*.backup.json`, `.env*`). The example template is intentionally tracked.
- Verified: `git check-ignore` → `config.local.js` IGNORED, `config.local.example.js`
  NOT ignored.

> The real `config.local.js` is **not** loaded by the shipped `index.html` (keeps
> the default app offline + 404-free). Operators add the `<script>` tag in their
> private deploy copy only — see the commented pointer in `index.html` after
> `config.js`.

## 2. GitHub Pages deployment

### Enablement
1. Push the branch (this build stops before push).
2. GitHub → **Settings → Pages**.
3. **Source:** Deploy from a branch.

### Source branch/folder decision
SYS_OS lives in `tools/command_deck/`. A GitHub *project* site serves at
`https://<user>.github.io/<repo>/`. Either:
- **(a) Subtree publish (recommended):** publish a branch/`gh-pages` whose root is
  `tools/command_deck/**`. Relative asset paths (`assets/...`) resolve.
- **(b) `/docs` path:** only if the app is relocated/copied under `/docs`.

### HTTPS confirmation
GitHub Pages is **HTTPS by default** → `window.isSecureContext === true` →
cryptographic vault hash (no degrade). Confirm the padlock; the Environment
guard's `Hosting / HTTPS` row should read **WARN** (secure ctx) not **BLOCK**.

### ⚠ Project base path issue
A project site is served under `/<repo>/`, not the domain root. Verify every asset
(`assets/css`, `assets/js`, `assets/fonts`) returns **200** under the base path
before go-live. If assets 404, the publish source root is wrong — fix the source
(do **not** loosen CSP).

### Test the deployed URL
- Open the Pages URL; confirm the deck boots and the version badge shows v4.3.0.
- Open **Station 15 // ENVIRONMENT → Deployment Readiness**; `Hosting status`
  should read **VERIFIED** (on `*.github.io`) and `HTTPS` **verified**.
- Click **Run Deployment Health Check** → confirm origin/secure-context/profile.

### Rollback
- **By reverting:** `git revert <commit>` (or re-point Pages to a prior commit) →
  redeploys the previous release.
- **Disable remote backend:** set `REMOTE_ENABLED=false` or remove
  `config.local.js` → instant LOCAL; local data untouched.
- **Disable Pages:** Settings → Pages → unset source → back to LOCAL-only.
- Always keep a current **v3.8 backup export** as the portable escape hatch.

### Confirm monitoring still captures errors on the hosted site
Open DevTools console on the Pages URL and run:
```js
SYSOS.monitoring.selfTest()   // all true
setTimeout(function(){ throw new Error('HOSTED_TEST'); },0)  // captured -> runtime_error+1
SYSOS.monitoring.getStatus().counts
```

### Confirm CSP does not block required outbound calls
With Supabase configured, open the console on the hosted site after a sign-in
attempt. If you see a CSP `connect-src` violation, the Supabase origin is missing
from the CSP (see §3). The Environment guard's `CSP Supabase origin` row flags
this as **BLOCK** when configured-but-missing.

### Avoid committing secrets
Anon key only; never service-role. Never commit `config.local.js`, `.env`, or
backup JSON. The `.gitignore` enforces this; the safety review (Phase 14) scans
the staged set.

## 3. CSP live-Supabase strategy

The committed `<meta>` CSP stays LOCAL-safe (`connect-src 'self' http://localhost:3132
http://localhost:4173`). GitHub Pages cannot set HTTP headers, so the meta tag IS
the policy. To enable a configured deploy, add **only** your project origin — one
scoped HTTPS origin, **no wildcard, no real URL committed**:

```
connect-src 'self' https://YOUR_PROJECT_REF.supabase.co
```

The production guard **flags the mismatch** when detectable: if a Supabase URL is
configured but its origin is absent from the CSP, `CSP Supabase origin` = **BLOCK**.

## 4. Live RLS verification workflow

Before any client deployment, prove **User A cannot read User B's data**. Run the
checklist from **Station 15 → Run RLS Isolation Checklist**:

1. Create a Supabase project. 2. Apply `pilot_backend/supabase_schema.sql` (enables
RLS). 3. Create `test_user_a`. 4. Create `test_user_b`. 5. Sign in as A.
6. Push one test SYS_OS state key (Station 16). 7. Sign out. 8. Sign in as B.
9. Confirm **B cannot see A's row**. 10. Sign back in as A. 11. Confirm A can see
A's row. 12. **Record the result** (audit-logged).

- **Record RLS Verified** is **rejected** unless a live Supabase backend is
  configured (`config_required`) — you cannot honestly verify RLS without a real
  backend. Status persists at `sysos.deploy.rls.v1`.
- The guard's `RLS isolation verified` is **PASS** only when Supabase is configured
  **and** the operator recorded the checklist as verified.

## 5. Deployment Readiness panel (Station 15)

Ten fields: hosting target / hosting status / HTTPS / Supabase config / auth / RLS
isolation / monitoring / CSP / rollback / **production status**
(`BLOCKED` | `REHEARSAL_READY` | `READY`). **READY is never shown** unless all real
live checks pass. Buttons: Run RLS Isolation Checklist · Record RLS Verified ·
Reset RLS · Run Deployment Health Check.

## 6. Monitoring deployment health (`monitoring.deployment_health_checked`)

`SYSOS.monitoring.deploymentHealthCheck()` captures: origin, secure context,
protocol, profile, backend mode, monitoring active, CSP note, production guard
status. LOCAL-only (no external service), routed to audit + activity.

## 7. What v4.3 does NOT do (deferred)

Deploy to Pages, connect live Supabase, auto-verify RLS, add external alerting, or
flip the synchronous storage backend to async. PRODUCTION stays honestly BLOCKED
until auth + persistence + hosting + live RLS are real.
