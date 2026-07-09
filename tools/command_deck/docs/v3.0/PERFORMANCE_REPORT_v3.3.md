# SYS_OS v3.3.0 — Performance Report (Phase 9)

All values measured live (port 4173). Objective: eliminate the v3.2.0 boot/
render-at-scale ceiling (eager station rendering + O(n²) backlink/health).

## Headline — render at scale (1,532 records)
| Metric | v3.2.0 | v3.3.0 | Δ |
|---|---|---|---|
| Stations rendered at boot | 8 (all, eager) | **0 (lazy)** | eliminated |
| client.dashboard() | 493 ms | **2.9 ms** | **170×** |
| Client Center refresh | 549.8 ms | ~63 ms (first activation) | ~9× |
| Client list DOM rows | 502 | **25** (paginated) | 20× fewer |
| healthDistribution() | 31.4 ms | 23.5 ms | 1.3× |
| executive.metrics() | 34.6 ms | 36.5 ms | flat |
| integrity scan | 1.3 ms | 1.8 ms | flat |

## Clean baseline (38 records)
| Metric | v3.2.0 | v3.3.0 |
|---|---|---|
| Boot (DCL) | 204 ms | ~200 ms |
| client.dashboard() | 1.4 ms | <1 ms |
| Stations rendered at boot | 8 | 0 |

## First station activation @1,532 records (the new render cost, on demand)
Clients 63.4ms · Dashboard 56.6ms · Operator 13.5ms · Registries 3.6ms.
Previously all of this ran at boot, synchronously, for every station.

## What improved
- **Lazy rendering:** `router.register` defers `render()` to first `switch()`.
  Boot renders zero dynamic stations; heavy compute waits for the operator.
- **Backlink index (`relations.buildIndex/backlinksFast/linkStatsFast`):**
  reverse lookups O(scan-all) → O(1). `client.metrics` (via `linkStatsFast`)
  drove client.dashboard 493ms → 2.9ms.
- **Client-index (`commercial._buildClientIndex`):** `proposalsFor`/
  `contractsFor` O(all) → O(1); `healthDistribution` is now O(n).
- **Pagination:** client list renders one 25-row page; filter/search/sort run on
  the full dataset before paging (verified: 110 matches, 25 rows rendered).

## What did not improve materially
- `executive.metrics()` (~36ms @1,532): dominated by `healthDistribution`
  iterating all clients. O(n) now, but the per-client constant (resolve + 6
  health factors) keeps it in the tens-of-ms range at 500 clients.
- `integrity()` unchanged (already O(total links), 1.8ms @1,582).

## Remaining bottleneck
`healthDistribution()` is O(n) but with a non-trivial per-client constant
(resolve + 6 factors). At 5,000+ clients this becomes the next item. Fix path:
memoize per-client health keyed by a change-token; recompute only changed
clients (cache invalidation hooks already exist via `sysos:data`).

## Indexing correctness
`backlinksFast(id).length === backlinks(id).length` verified (6=6); integrity
0 broken at 88 and 1,582 links; index invalidated on every mutation (`emit`)
and at batch commit.

## Recommended next target
Per-client health memoization (change-token cache) to take `executive.metrics`
and `healthDistribution` from O(n) to O(Δ) on incremental changes.
