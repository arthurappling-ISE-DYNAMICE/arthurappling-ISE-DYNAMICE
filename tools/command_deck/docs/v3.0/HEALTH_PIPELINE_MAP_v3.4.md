# SYS_OS v3.4.0 — Health Pipeline Map (Phase 2)

Traced from source on v3.3.0. Identifies every function in the health/metrics
path, its complexity, and where memoization attaches.

## Call graph
```
executive.metrics()                         [executive.js]
  ├─ commercial.forecast()                  [commercial.js]  O(clients+proposals+contracts), cents math
  ├─ commercial.healthDistribution()        [commercial.js]  O(clients) × health()
  └─ opsQueue.stats()                        [opsqueue.js]    O(ops)

commercial.healthDistribution()             [commercial.js]
  └─ for each client: commercial.health(id)  ← the O(n) loop, n = client count

commercial.health(clientId)                 [commercial.js]  per-client, ~6 factors
  ├─ clients().get(id)                        O(1)
  ├─ activity scan (recent)                   O(50, capped)
  ├─ commercial.proposalsFor(id)              O(1) via _clientIndex (v3.3)
  ├─ commercial.contractsFor(id)              O(1) via _clientIndex (v3.3)
  ├─ relations.resolve('clients', id)         O(client links × find)
  └─ compliance scan                          O(compliance records)

client.dashboard()                          [client.js]      O(clients) × metrics()
  └─ client.metrics(id)
       └─ relations.linkStatsFast(id)         O(1) reverse via index (v3.3)

client.metrics(clientId)                    [client.js]      forward links + linkStatsFast
```

## Complexity table (current, v3.3.0)
| Function | File | Complexity | Inputs | Outputs | Notes |
|---|---|---|---|---|---|
| executive.metrics | executive.js | O(n) | stores, vault | 12 metric objects | recomputes every call |
| healthDistribution | commercial.js | O(n) | clients | {GREEN,YELLOW,RED} | loops health() |
| commercial.health | commercial.js | O(k) per client | client + links | {score,status,signals,riskFlags} | k = links+factors |
| client.dashboard | client.js | O(n) | clients | rows[] | metrics() per client |
| client.metrics | client.js | O(1)* | client | metric object | *linkStatsFast indexed |

## Invalidation points (what changes a client's health)
- client update (status/stage/links)
- proposal create/update/delete for that client
- contract create/update/delete for that client
- compliance schedule/complete affecting linked projects
- vault document linked to the client
- project status change on a linked project
- relationship/link mutation

## Where memoization attaches
1. **commercial.health(clientId)** — per-client memoized result, keyed by a
   per-client change token. The single highest-value attach point (everything
   above funnels through it).
2. **commercial.healthDistribution()** — cache the rollup; rebuild only when a
   client token changed (reusing per-client cache for unchanged clients).
3. **executive.metrics()** — cache the composed result; invalidate on the same
   token. forecast() stays live (cheap) or joins the cache.

## Token model
- `globalToken` — bumped on broad/unmappable changes (project, compliance,
  vault, deletes that can't be mapped to a client, batch).
- `clientToken[id]` — bumped when that client or its proposals/contracts change.
- `health(id)` valid iff its cached `(globalToken, clientToken[id])` matches.
- distribution/execMetrics valid iff no token changed since last build.

## Backward-compat guarantee
`_computeHealth(clientId)` (the current body) remains callable for slow-path
equality tests. `health()` must return a value deep-equal to `_computeHealth()`.
