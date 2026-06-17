# SYS_OS v3.4.0 — Performance Report (Phase 11)

Measured live (port 4173). Objective: remove the remaining health O(n) constant
via per-client memoization with change-token invalidation.

## Before / after at 1,532 records
| Operation | v3.3.0 (cold) | v3.3.0 (warm) | v3.4.0 cache HIT | v3.4.0 after 1 client change |
|---|---|---|---|---|
| healthDistribution() | 28.6 ms | 19.0 ms | **0 ms** | **1.0 ms** |
| executive.metrics() | 50.2 ms | 33.4 ms | **0 ms** | 10.2 ms* |
| commercial.health (1) | — | 0.1 ms | 0 ms (cached) | recompute only if changed |

\* `executive.metrics()` after a change is dominated by `commercial.forecast()`
(O(proposals+contracts), ~10ms @1,532) — NOT health. The health portion is now
~1ms. Forecast memoization is out of scope (health release) and noted as the
next minor item.

## What this means operationally
- **Repeated calls cost 0ms** (cache hit). Under event-driven refresh (multiple
  stations open, data changes), the previous behavior recomputed all client
  health on every refresh; now an unchanged dataset returns cached results.
- **A single client change recomputes one client** (O(Δ)), not all 500
  (healthDistribution 22ms → 1ms).
- **Broad changes** (project/compliance/vault/batch/demo) bump the global token
  and fully invalidate — correct, conservative.

## Functions improved
- `commercial.health(id)` — now memoized; raw body preserved as
  `commercial._computeHealth(id)` (slow-path, used by equality tests).
- `commercial.healthDistribution()` — cached by version; rebuild reuses per-
  client cache.
- `executive.metrics()` — cached by version; invalidates on data + ops events.

## Cache invalidation design
`SYSOS.healthCache` (healthcache.js):
- `clientToken[id]` bumped on: client update, proposal/contract create·update·
  (mappable) delete for that client, stage transition.
- `globalToken` bumped on: project/compliance/vault changes, unmappable deletes,
  batch commit, demo enter/exit. Clears all per-client caches.
- `_version` gates distribution + metrics caches; `sysos:ops` refreshes metrics
  only (openOperations).
- Driven entirely by existing DataStore mutation events — no new plumbing.

## Correctness (measured)
- `health(id) === _computeHealth(id)` for all clients (0 mismatches at 3 and at
  60-client sample @1,534).
- After adding a proposal: house_account 67 → 83, proposal signal 0 → 20, fast
  equals slow.
- Global invalidation on project change verified (token 0 → 1).
- Distribution equals a from-scratch (cache-reset) recompute.

## Risks remaining
- `executive.metrics()` after a change still pays `forecast()` (~10ms @1,532) —
  health is fixed; forecast is the next memoization candidate.
- Cache is in-memory only (rebuilds on reload) — by design; first call after
  reload is the cold path (~22ms @1,532), acceptable and one-time.

## Technical debt remaining
1. `forecast()` not memoized (the residual cost inside `executive.metrics`).
2. Registry Grid table renders full domain (see TABLE_RENDERING_REVIEW_v3.4).
3. RBAC role-bound, not session-bound (see RBAC_SESSION_BINDING_PLAN_v3.4).
4. SQLite remains the browser KV-table model.

## Recommendation for v3.5 → SESSION_BOUND_RBAC + TABLE_VIRTUALIZATION
1. Persisted session + default-deny boot + local passphrase elevation.
2. Registry Grid pagination (lift the client-list pattern).
3. Optional: memoize `forecast()` on the same token model.
