# SYS_OS v3.8 — Backup / Export / Restore

Local-first, auditable full-state backup. Closes the highest immediate deployment
risk (R-02 local-only data loss / R-04 no backup) from the v3.8 Deployment
Foundation Audit. Additive: no backend, no auth, no hosting; no change to vault
H1-H5, store, registry, audit, RBAC, or commercial behavior.

## What it is (and is not)
- **Is:** a one-file JSON export of the entire SYS_OS operating state, validatable
  and restorable, with the vault chain re-verified on restore.
- **Is NOT:** production authentication, a server-side backup, or encryption. It is
  a local operator backup — **store the downloaded file securely.**

## Module / surface
- `assets/js/backup.js` → `SYSOS.backup` (`exportAll`, `validate`, `restore`,
  `readiness`). Operator UI: **Station 14 // BACKUP** (router-registered, lazy).
- Not added to the boot gate (operator-invoked, non-boot-critical) → gate stays 36.

## Data surface (what is backed up)
Every `sysos.*` storage key (dynamic — not a hardcoded list), e.g.:
`sysos.reg.*` (clients/proposals/contracts/projects/agents/workflows/sops/
intelligence/compliance + manifest), `sysos.vault.v1`, `sysos.audit.v1`,
`sysos.activity.v1`, `sysos.session.v1`, `sysos.ocr.v1`, `sysos.compliance.sched.v1`,
`sysos.opsqueue.v1`. **Excluded:** transient `sysos.backup.prerestore.*`, and any
key matching the forbidden pattern (token/secret/password/api_key/private_key/
credential). No browser tokens, no external credentials.

## Backup file contract (schema 1.0)
`SYS_OS_BACKUP_v<version>_YYYY-MM-DD_HHMMSS.json`:
- **metadata:** `backup_schema_version`, `sys_os_version`, `release_name`,
  `exported_at`, `exported_by_role`/`operator`, `app_commit`, `origin_environment`,
  `backup_id`, `created_by_sys_os:true`.
- **payload.storage:** `{ "<sysos.key>": "<raw JSON string>" }` for all keys.
- **verification:** `state_hash` (SHA-256 of the canonical payload),
  `audit_chain_status_at_export` (append-only + event count),
  `vault_chain_status_at_export` (valid + length), `integrity_status_at_export`,
  `record_counts`, `storage_key_count`, `schema_signature`.
- **restore_policy:** `restore_mode: OVERWRITE`, `destructive_restore_required:true`,
  `compatible_versions`, `created_by_sys_os:true`, `operator_confirmation_required:true`.
- **summary:** clients/proposals/contracts/vault_documents/audit_events/
  integrity_broken counts + `export_status` (HEALTHY/ATTENTION).

## Validation (20-point, before any restore)
JSON parses · metadata/payload/verification/restore_policy present ·
schema_version/sys_os_version/backup_id/exported_at present · `created_by_sys_os` ·
required families present (clients/proposals/contracts/vault/audit) · **state_hash
matches payload** · no forbidden keys · not empty · vault+audit status present ·
version compatibility. Result: `{valid, severity PASS|WARNING|FAIL, errors[],
warnings[], can_restore}`. **An invalid backup never mutates state.**

## Restore (conservative flow)
RBAC (`backup.restore`) → confirmation phrase `RESTORE SYS_OS BACKUP` → validate →
**pre-restore snapshot** (`sysos.backup.prerestore.<ts>` + in-memory) → clear
`sysos.*` → write backup keys → re-hydrate stores/vault/audit/activity → **re-verify
vault chain** + integrity → audit `restore_completed`. **On any failure: roll back
to the snapshot, re-hydrate, audit `restore_failed`.** Reload recommended after a
successful restore to fully refresh the UI.

## RBAC
- `backup.export`: ADMIN/MANAGER/OPERATOR/**READ_ONLY** (read = may export).
- `backup.restore`: ADMIN/MANAGER/OPERATOR (**READ_ONLY denied**); OPERATOR needs
  the confirmation phrase like everyone. Denials audited.

## Audit events
`backup.export_started|created|failed`, `backup.validation_passed|failed`,
`backup.restore_started|completed|failed|rejected` — each with role, backup_id,
schema, counts, and reason where applicable.

## Verified (30 test cases) — all pass
Round-trip export→validate→restore→reload; vault chain + integrity 88/0 preserved;
invalid JSON / missing metadata / hash-tamper / empty / forbidden-key /
missing-family rejected; confirmation required; READ_ONLY restore denied;
fault-injected restore failure rolled back; smoke 18/18, drills 6/6, maintenance
10/10, gate 36/0, H1-H5 + demo + lock/unlock + v3.7 commercial UI intact; no
console errors.

## Deferred (next milestones)
Environment profiles (DEV/LOCAL/STAGING/PRODUCTION) + production config guard;
server-side backup; encryption; automated scheduled backups.
