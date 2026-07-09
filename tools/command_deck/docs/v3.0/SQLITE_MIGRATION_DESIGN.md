# SYS_OS v3.0 — SQLite Migration Design (Phase 3)

**Non-destructive.** No data is migrated in this release. The Storage Adapter
Layer (`assets/js/storage.js`, shipped + verified) is the seam that makes the
migration a backend swap rather than a rewrite.

## Current state of record (localStorage keys)
| Key | Owner | Shape |
|---|---|---|
| `sysos.registry.v1` | store.js | `{ seedVersion, domains:{ <domain>:[records] } }` (9 domains) |
| `sysos.activity.v1` | store.js | `{ entries:[{ts,type,message}] }` (capped 50) |
| `sysos.vault.v1` | vault.js | `{ docs, chain, evidence, ocrQueue }` |
| `sysos.compliance.sched.v1` | compliance.js | `{ schedules:[...] }` |
| `sysos.ocr.v1`, `sysos.opsqueue.v1` | ocr/opsqueue | job/op arrays |

## The adapter (already shipped)
`SYSOS.storage` exposes `get/set/remove/keys/query/getJSON/setJSON/exportAll`
+ `registerBackend(impl)`. **Every** persist/restore site in store, vault,
compliance, ocr, and opsqueue now routes through it (verified: backend swap to
an in-memory impl stored+read a value, then reset to localStorage; live data
round-trips a reload through the adapter).

**Backend contract:** `{ name, getItem(k), setItem(k,v), removeItem(k), keys() }`.

## Target: SQLite backend
A future `assets/js/storage.sqlite.js` implements the same contract over
sql.js / better-sqlite3 (Electron/Bun host) or a thin local HTTP API:

```
SYSOS.storage.registerBackend(SqliteBackend({ file: 'data/sysos.db' }));
```

### Schema sketch (one table — KV parity first, normalize later)
```sql
CREATE TABLE kv (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT);
```
Phase A (KV parity): store the same JSON blobs keyed identically → zero
business-logic change, instant cutover, instant rollback (swap backend back).

Phase B (normalized, optional): per-domain tables (`clients`, `proposals`,
`contracts`, `audit_events`) with the query abstraction (`storage.query`)
upgraded to SQL `SELECT`. Business logic still calls `stores.all.*` — only the
adapter's internals change.

## Migration procedure (when executed)
1. `const snap = SYSOS.storage.exportAll()` (already implemented).
2. `registerBackend(sqlite)`; write `snap.data` blobs into `kv`.
3. Reload → `restore()` reads from SQLite via the same keys.
4. Verify: integrity scan + smoke + maintenance must match pre-migration.
5. Rollback = `resetBackend()` (localStorage retained until explicitly cleared).

## Backward compatibility
Guaranteed: localStorage remains the default backend; keys and JSON shapes are
unchanged; `registerBackend` is opt-in. A v2.9.9 build and a v3.0 build read
the same localStorage today.
