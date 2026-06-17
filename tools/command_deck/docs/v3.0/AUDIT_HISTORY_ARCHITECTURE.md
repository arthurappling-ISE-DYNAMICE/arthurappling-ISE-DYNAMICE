# SYS_OS v3.0 — Audit History Architecture (Phase 4)

**Verify-architecture-only** per directive. No new store shipped; this is the
design the storage adapter + SQLite backend make implementable without
business-logic change.

## Current limitation (measured)
`SYSOS.activity` is capped at `ACTIVITY_CAP = 50` and stores `{ts, type,
message}`. The Activity Timeline (station 11) reads it. Sufficient for recent
operational context; insufficient for a full, attributable audit trail.

## Target event schema
A dedicated, **uncapped** audit log (own storage key `sysos.audit.v1`, own
DataStore-style collection) where every event is:

```
{
  id:        'EVT-YYYYMMDD-XXXX',
  timestamp: ISO-8601,
  actor:     string,        // from SYSOS.auth.actor()
  role:      ADMINISTRATOR|MANAGER|OPERATOR|READ_ONLY,
  source:    'admin-ui'|'api'|'automation'|'system',
  action:    'create'|'update'|'archive'|'delete'|'transition'|'ingest'|...,
  domain:    'clients'|'proposals'|'contracts'|'compliance'|'vault'|'system',
  target:    string,        // entity id
  metadata:  object         // before/after, amounts, stage from->to, etc.
}
```

## Coverage map (event sources already emit; audit layer subscribes)
| History | Existing signal | Audit binding |
|---|---|---|
| Full event history | `sysos:data`, `sysos:activity` events | subscribe → append |
| Lifecycle history | `commercial.setStage` stageHistory (has from/to/ts/user/source/notes) | promote to audit events |
| Client history | DataStore create/update/archive/remove | append on mutation |
| Proposal/Contract history | same DataStore events | append |
| Operator history | `SYSOS.auth.setOperator` log + `auth.attribute()` | append |
| System history | bootcheck, smoketest, maintenance, telemetry | append on run |

## Implementation path (deferred)
1. `audit.js` → `SYSOS.audit.record(event)` writing through `SYSOS.storage`
   (uncapped; SQLite `audit_events` table when that backend lands).
2. One delegated listener on `document` for `sysos:*` events maps each to an
   audit event using `auth.attribute()` for actor/role.
3. Timeline station gains an "Audit (full)" source toggle alongside the capped
   recent feed.
4. Retention: KV/localStorage holds recent N; SQLite holds full history.

## Why it's safe now
The attribution primitive already exists (`auth.attribute`, `setStage` history
fields), and the storage seam already exists. The audit layer is a pure
subscriber — additive, no mutation of existing flows.
