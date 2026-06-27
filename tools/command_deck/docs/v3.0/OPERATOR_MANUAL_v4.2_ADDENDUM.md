# SYS_OS v4.2.0 — Operator Manual Addendum (PILOT_HOSTING_MONITORING)

Additive to the v4.1 operator workflow. LOCAL mode is unchanged.

---

## Runtime Monitoring (Station 15 // ENVIRONMENT)

A new **Runtime Monitoring** panel sits below the Production Guard.

- **MONITORING ACTIVE / capture ON** — global error + unhandled-rejection
  listeners are installed; runtime faults are captured automatically.
- **Counters** — Runtime errors · Unhandled rejections · Guard failures · Vault
  failures · Integrity failures. Each shows the last event detail when > 0.
- **LOCAL-ONLY** — events are routed into the central **Audit** trail (domain
  `monitoring`) and the **Recent Activity** feed. Nothing is sent externally.

### What gets captured automatically
| Fault | When |
|---|---|
| Runtime error | any uncaught JS error (`window.error`) |
| Unhandled rejection | any unhandled promise rejection |
| Guard failure | production guard run in PRODUCTION with blocking checks |
| Vault failure | guard detects an invalid vault chain |
| Integrity failure | guard detects broken relationship links |

### Operator console hooks (advanced)
- `SYSOS.monitoring.getStatus()` — full status object.
- `SYSOS.monitoring.recent(10)` — last 10 captured events.
- `SYSOS.monitoring.selfTest()` — forces one of each fault, verifies capture.
- `SYSOS.monitoring.reset()` — clears counters/last/events (e.g. after a self-test).

> Self-test note: `selfTest()` and forced errors are **intentional** test faults.
> They are captured and counted; run `reset()` to clear them. A genuine uncaught
> error will also appear in the browser console (that is expected — it is captured
> too, not suppressed).

## Going live (preview of next steps — not done in this build)

1. Read `PILOT_HOSTING_MONITORING_v4.2.md` (hosting + Supabase + CSP).
2. Enable GitHub Pages (HTTPS); verify assets resolve under `/<repo>/`.
3. Create `assets/js/config.local.js` (git-ignored) with ANON key only.
4. Add `connect-src https://YOUR_PROJECT_REF.supabase.co` to the CSP.
5. Open **Station 16 // PILOT BACKEND** → Check Remote Health → Sign In.
6. Verify two-account RLS isolation before trusting remote.
7. Re-run the Production Guard — it stays BLOCKED until all checks are real.

## Rollback (fast path)

- Remote acting up → `BACKEND.REMOTE_ENABLED=false` or delete `config.local.js`
  → instant LOCAL. Local data untouched.
- Host issue → revert the published commit or disable GitHub Pages.
- Always keep a current **v3.8 backup export** as the portable escape hatch.
