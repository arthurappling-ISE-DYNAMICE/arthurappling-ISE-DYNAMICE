# SYS_OS v3.2.0 — Performance Report (Phase 9)

All values measured live (port 4173). The v3.2 objective was eliminating the
v3.1.1 bulk-write O(n²) ceiling via per-domain normalization + transaction
batching.

## Bulk write — the headline result
| Workload | v3.1.1 (unbatched) | v3.2.0 (batched) | Improvement |
|---|---|---|---|
| 300 records (100×3) | 23,492 ms | **112 ms** | **209×** |
| 1500 records (500×3) | ~117,000 ms (extrapolated) | **780 ms** | **~150×** |

Mechanism: a batch defers (a) per-domain storage flushes → 3 writes instead of
~600, (b) activity-log writes → 1, (c) audit writes → 1, and (d) per-record UI
re-render events → 1 coalesced event. The dominant cost was (d), not storage.

## Per-operation (measured)
| Operation | @38 records | @1531 records |
|---|---|---|
| Integrity scan | 0.2 ms | 1.8 ms |
| Forecast | 0.8 ms | 1.1 ms |
| Health distribution | 1.4 ms | 41.2 ms |
| Executive metrics | 10 ms | 33.9 ms |
| Report generation | 4.2 ms | 39.8 ms |
| Audit query | 0.2 ms | 1.2 ms |

## Boot
| Dataset | Boot (DOMContentLoaded) |
|---|---|
| 38 records (baseline) | ~428 ms |
| 1531 records | ~14,504 ms |

## Single-record write (normalization win)
A client write now re-serializes only `sysos.reg.clients`, leaving
`sysos.reg.proposals`/`contracts`/etc. untouched (verified). Storage moved from
one `sysos.registry.v1` blob to 9 per-domain keys + a manifest.

## Improvements
- Bulk write: **O(n²) → O(n)**, 150–209× faster.
- Single write: only the mutated collection is serialized.
- Demo, audit, and activity all batch-aware (single flush at commit).

## Remaining bottlenecks (measured, next-release targets)
1. **Boot at scale (14.5s @1531):** every station renders eagerly at boot;
   several compute O(n) or O(n²) aggregates. Dominant: `healthDistribution()`
   is O(n²) — `health(clientId)` calls `backlinks()` which scans all entities,
   run per client (500 × 1531). Fix path: memoize backlinks per scan / lazy
   station render / health index.
2. **healthDistribution O(n²)** at 41ms@1531 — acceptable now, scales poorly.
3. localStorage ~5MB cap persists until SQLite is the active backend.

## Scaling limits
- Write path: comfortably handles 1500+ records in <1s (batched).
- Read/compute: sub-2ms for integrity/forecast at 1531; health/report tens of ms.
- Boot/render is now the binding constraint at >1000 records, not writes.
