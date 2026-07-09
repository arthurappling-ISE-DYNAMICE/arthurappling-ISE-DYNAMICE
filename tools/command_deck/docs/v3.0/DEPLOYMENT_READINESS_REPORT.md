# SYS_OS v3.1 — Deployment Readiness Report (Phase 7)

**Status:** deployment-ready, fully offline, backend-swappable, RBAC-enabled,
audit-complete. All claims below are measured (port 4173, clean boot).

## 1. System architecture
31 JS modules across 5 tiers (foundation → data → domain engines → executive/UI
→ validation/boot), 13 router-registered stations, single `SYSOS` namespace,
boot gate validating 35 modules. See `SYSTEM_MAP.md`.

## 2. Storage architecture
Business logic ⇄ `SYSOS.storage` adapter ⇄ pluggable backend.
- **localStorage** (default) and **sqlite(kv)** (`sqlite_backend.js`) both
  implement the contract `{name,getItem,setItem,removeItem,keys}` + SQLite extras
  `connect/initialize/query/export/import`.
- Backend swap: `SYSOS.sqlite.migrateAndActivate()` (non-destructive copy +
  activate, sets a persistent flag) / `rollbackToLocal()`. Verified: CRUD on
  SQLite, SQL `SELECT ... LIKE`, and **persistence across restart** (app
  re-activates SQLite on boot from the flag; a record created on SQLite survived
  a full reload).
- KV-parity schema (`kv(key,value,updated_at)`); host swap to sql.js/native
  changes only the table primitives.

## 3. Authentication architecture
`auth.js` RBAC engine (4 roles, permission matrix) + `auth_ui.js` login surface
(station 13). Login/logout/session, operator identity, role + permission display.
Verified: ADMINISTRATOR all-allow; OPERATOR create-yes/delete-no/configure-no;
READ_ONLY report-yes/create-no; logout fails closed to READ_ONLY; invalid role
rejected.

## 4. Audit architecture
`audit.js` append-only, uncapped log (own key, adapter-persisted). Captures
user, role, timestamp, action, domain, target, **before+after**, source.
Client/proposal/contract mutations auto-captured by store wrapping; lifecycle
via event stream. Verified: update event recorded `before:PROSPECT → after:ACTIVE`.
Queryable (`query(filter)`) + exportable (`export()`). No delete API.

## 5. Deployment architecture
Static file deployment — any web server (or `file://` with relative paths).
Zero runtime external dependencies (Tailwind compiled locally, fonts self-hosted).
Requirements: a static host + a secure context (localhost/HTTPS) for WebCrypto
SHA-256 (vault degrades to labeled FNV otherwise).

```
# Build (one-time, offline-capable after npm install):
npm install            # dev: tailwindcss 3.4.16
node_modules/.bin/tailwindcss -c build/tailwind.config.cjs \
  -i build/tailwind.input.css -o assets/css/tailwind.build.css --minify
# Serve:
npx serve tools/command_deck -l 4173   # or any static server
```

## 6. Backup architecture
- Registry/activity/vault/compliance/ocr/ops: `SYSOS.storage.exportAll()` → full
  JSON snapshot of every key.
- Audit: `SYSOS.audit.export()`.
- SQLite: `SYSOS.sqlite.instance.export()` (the `kv` table dump).
- All exports are plain JSON — portable, diff-able, restorable.

## 7. Recovery architecture
- Crash/restart: every store restores from its persisted key on boot; in-flight
  ops revert PENDING; SQLite re-activates from flag.
- DB unavailable: persist failures are caught — the platform keeps running
  in-memory (verified: a throwing backend did not crash boot or mutation).
- Corrupt record: store validation rejects pre-write (verified).
- Broken relationship: integrity scan flags, does not crash (verified).
- Module failure: boot gate halts visibly (verified).
- SQLite rollback: `rollbackToLocal()` restores the localStorage backend.

## Requirements / Risks / Dependencies / Migration / Verification

**Requirements:** static host; secure context for WebCrypto; modern browser
(ES6, localStorage). Optional: telemetry node hosts on :3132/:4173.

**Risks:** (1) localStorage ~5MB cap until SQLite is activated; (2) `style-src
'unsafe-inline'` retained for the DSCR inline-width + bootcheck halt panel
(documented exception — no `unsafe-eval`, no external script); (3) single-tenant
data until login/session is enforced on writes (engine is permissive by design);
(4) screenshot tooling intermittently times out (environment, not platform).

**Dependencies (runtime):** none external. **Build-time:** tailwindcss (dev).
Fonts self-hosted (assets/fonts/, 6 woff2, 108K).

**Migration path (localStorage → SQLite):** `migrateAndActivate()` → verify
(integrity + smoke + maintenance must match) → operate → `rollbackToLocal()` if
needed. Non-destructive; localStorage retained.

**Verification path:** boot gate (35) → smoke (18) → maintenance (10) → System
Health station (8 subsystems) → failure drills (6) → integrity scan (88/0).
