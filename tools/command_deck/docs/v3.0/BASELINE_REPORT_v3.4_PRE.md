# SYS_OS v3.4.0 — Pre-Build Baseline (Phase 1)

Measured live on v3.3.0 (port 4173) before any v3.4 change.

## Clean baseline (38 records)
| Metric | Value |
|---|---|
| Boot (DCL) | 189.5 ms |
| Stations rendered at boot | 0 |
| executive.metrics() | 1.0 ms |
| healthDistribution() | ~0 ms |
| client.dashboard() | 0.2 ms |
| integrity scan | 0.1 ms |
| smoke | 18/18 |
| maintenance | 10/10 |
| integrity | 88 / 0 broken |

## Scale baseline (1,532 records)
| Metric | Cold (1st call after reload) | Warm (repeat) |
|---|---|---|
| executive.metrics() | 50.2 ms | 33.4 ms |
| healthDistribution() | 28.6 ms | 19.0 ms |
| client.dashboard() | 10.1 ms | 2.0 ms |
| integrity scan | — | 0.5 ms |
| commercial.health (single) | — | 0.1 ms |

Note: there is no caching today — repeat calls are faster only due to JIT
warm-up, not memoization. Every `executive.metrics()` / `healthDistribution()`
call recomputes all client health from scratch. Under event-driven refresh
(multiple stations open, data changes), this recompute repeats per refresh.

## RBAC denial/audit (v3.3.0, verified)
- VIEWER denied on `vault.ingest` and `compliance.manage` (throws).
- Denials recorded as `permission_denied` audit events (targets logged).
- ADMINISTRATOR allowed; default operator = ADMINISTRATOR.

## The remaining ceiling
`executive.metrics()` and `healthDistribution()` are O(n) over clients with a
per-client constant (resolve + 6 health factors). At 500 clients: ~33–50ms each,
recomputed on every call. This is the only measured constraint v3.4 targets.
