# SYS_OS v4.3.0 — Operator Manual Addendum (LIVE_DEPLOYMENT_REHEARSAL)

Additive to v4.2. LOCAL mode is unchanged. New surfaces live in
**Station 15 // ENVIRONMENT**.

---

## Deployment Readiness panel (Station 15)

A new panel between the Production Guard and Runtime Monitoring. Rows:

| Field | Meaning |
|---|---|
| Hosting target | GitHub Pages |
| Hosting status | LOCAL (dev) / CONFIG_REQUIRED / VERIFIED (on `*.github.io`) |
| HTTPS | required (local) / verified (https) |
| Supabase config | missing / configured |
| Auth | unauthenticated / authenticated |
| RLS isolation | not tested / checklist required / verified |
| Monitoring | active / failed |
| CSP | local only / needs Supabase origin / verified |
| Rollback | documented |
| **Production status** | **BLOCKED / REHEARSAL_READY / READY** |

> **READY is never shown** without live Supabase + authenticated session +
> verified RLS + HTTPS hosting. In LOCAL you will see **REHEARSAL_READY — live
> checks pending (NOT production-ready)**. That is correct and honest.

### Buttons
- **Run RLS Isolation Checklist** — shows the 12-step A-vs-B isolation test.
- **Record RLS Verified** — marks RLS verified. **Rejected** unless a live
  Supabase backend is configured (you cannot verify isolation without one).
- **Reset RLS** — resets RLS status to `not_tested`.
- **Run Deployment Health Check** — logs `monitoring.deployment_health_checked`
  (origin, secure context, profile, backend mode, CSP note, guard status).

## Enabling the live pilot (operator steps — not done by this build)

1. Copy `assets/js/config.local.example.js` → `assets/js/config.local.js`
   (git-ignored). Fill in **anon key only**.
2. Add `<script src="assets/js/config.local.js"></script>` after `config.js` in
   your private deploy copy (not in the repo).
3. Add `connect-src https://YOUR_PROJECT_REF.supabase.co` to the CSP `<meta>`.
4. Load the Supabase JS SDK so `window.supabase` exists.
5. Apply `pilot_backend/supabase_schema.sql` in Supabase (enables RLS).
6. Station 16 → Check Remote Health → Sign In.
7. Station 15 → **Run RLS Isolation Checklist** → complete all 12 steps →
   **Record RLS Verified**.
8. Re-check the guard — it clears blocks only as each real check passes.

## Console hooks (advanced)
- `SYSOS.environment.deploymentReadiness()` — full readiness snapshot.
- `SYSOS.environment.getRLSStatus()` / `recordRLSResult(true|false)`.
- `SYSOS.monitoring.deploymentHealthCheck()` — deployment health probe.

## Rollback (fast path)
Revert the published commit, or disable Pages, or set `REMOTE_ENABLED=false` /
remove `config.local.js`. Local data is never touched. Keep a current v3.8 backup.

## Safety reminders
- Anon key only — never the service-role key.
- Never commit `config.local.js` with real values, `.env`, or backup JSON.
- Verify RLS before trusting remote with any client data.
