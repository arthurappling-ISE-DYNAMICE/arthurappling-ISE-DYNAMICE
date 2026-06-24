# SYS_OS — VERSION HISTORY

## v4.0.0 — PILOT_BACKEND_FOUNDATION (2026-06-23) · CURRENT
Additive first pilot-backend foundation over v3.9.0. Adds a Supabase-shaped
remote backend foundation (auth boundary + per-user KV adapter + schema/RLS +
config + UI + guard wiring) **while fully preserving the local-first system**.
Default is **LOCAL/localStorage** — identical to v3.9, fully offline. Remote is
**opt-in**, **never auto-overwrites local data**, and is **not configured in the
repo** (no secrets). No backend deployed, no real auth enforced yet, no hosting,
no AI. Snapshot `index_v4.0.0.html` + `archives/v4.0.0/`. Gate 36.

- **Pilot backend artifacts (`pilot_backend/`):** `supabase_schema.sql`
  (`sysos_kv_state` + `sysos_backup_events`, indexes, updated-at trigger, **RLS
  enabled + 6 per-user policies** — server-side authz that fixes client-side-RBAC
  for real client use), `README.md` (setup/security/rollback/sovereign-exit),
  `.env.example` (placeholders only).
- **`auth_remote.js` (`SYSOS.authRemote`):** Supabase login boundary
  (isConfigured/getSession/signIn/signOut/getUser/onAuthStateChange/getAuthStatus).
  Safe no-op when SDK/config absent (the shipped default). No secrets, no
  hardcoded credentials. Does not replace local auth/RBAC or lock/unlock.
- **`remote_backend.js` (`SYSOS.remoteBackend`)** + **Station 16 // PILOT
  BACKEND:** async per-user KV primitives (list/get/set/remove/clearNamespace),
  `healthCheck`, explicit operator `syncToLocal`/`syncFromLocal` (deferred), and a
  guarded `register()`. **Honest design:** the live storage contract is
  synchronous and Supabase is async, so the foundation does **not** auto-swap the
  live backend or auto-sync — that async-storage path is deferred. LOCAL preserved.
- **Config (`config.js`):** `BACKEND` block (MODE local default · REMOTE_ENABLED
  false · empty SUPABASE_URL/ANON_KEY placeholders · KV_TABLE). Real values come
  from a git-ignored runtime `config.local.js` (`window.__SYSOS_RUNTIME__`); no
  secrets in the bundle. Missing config warns, never crashes.
- **Guard integration (`environment.js`):** Authentication + Server-persistence
  checks become **backend-aware** — PASS only when remote is configured +
  authenticated; otherwise BLOCK. With no remote (default), PRODUCTION stays
  **honestly PRODUCTION_BLOCKED**. Never marks production secure.
- **Verified:** LOCAL boots normally with no Supabase; missing config does not
  crash; remote disabled by default; localStorage + backup export/validate +
  restore guard + commercial UI + client edit + archive/delete + demo/reset
  guards + READ_ONLY restore denial all intact; PRODUCTION honestly blocked
  (auth+persistence BLOCK); RLS enabled + 6 policies; no service-role key, no real
  creds, no backup JSON; smoke 18/18, drills 6/6, maintenance 10/10, integrity
  88/0, gate 36/0, vault chain valid, H1-H5 intact; no console errors. **Live
  Supabase tests SKIPPED / CONFIG_REQUIRED (no credentials).**
- **Docs:** PILOT_BACKEND_FOUNDATION_v4.0, OPERATOR_MANUAL_v4.0_ADDENDUM,
  RELEASE_REPORT_v4.0. **Deferred:** async-storage live swap, real auth
  enforcement, hosting, monitoring, automated sync (next pilot steps).

## v3.9.0 — ENVIRONMENT_PROFILES_PRODUCTION_GUARD (2026-06-23)
Additive deployment-discipline safety layer over v3.8.0. SYS_OS now understands
its environment (DEV/LOCAL/STAGING/PRODUCTION) and **honestly blocks unsafe
production behavior** before any backend/auth/hosting exists. Default profile is
**LOCAL**, where behavior is identical to v3.8. No backend, no real auth, no
hosting; no change to vault H1-H5, backup, store, registry, or commercial
behavior. Snapshot `index_v3.9.0.html` + `archives/v3.9.0/`. Gate 36 (environment
is operator-invoked, intentionally not boot-gated).

- **New module `environment.js` (`SYSOS.environment`)** + **Station 15 //
  ENVIRONMENT** (router-registered, lazy). Profiles: DEV (LOW), LOCAL (LOW,
  default), STAGING (MEDIUM, advisory warnings), PRODUCTION (CRITICAL, guard
  active). Detection: `?profile=` URL override → `sysos.environment.profile`
  storage key → `CONFIG.PROFILE` → default LOCAL.
- **Production guard (honest):** `runProductionGuard()` scores 11 checks
  (auth/persistence/hosting/monitoring/backup/audit/vault/integrity/demo/reset/
  localhost). Because backend auth, server persistence, hosting, and monitoring
  are missing, PRODUCTION is reported **PRODUCTION_BLOCKED** — never falsely
  "secure". Language is truthful (local-first only).
- **Guard integration (additive prechecks; no-op in LOCAL):** in PRODUCTION,
  `demo.enter()` is blocked (stays LIVE + audited) and `vault.reset()` is blocked
  (`production_guard_blocked`, before the v3.8 guarded-reset path — H1-H5
  untouched). v3.8 backup/export stays available; restore stays RBAC-gated
  (READ_ONLY denied). `setProfile` requires `system.configure` (ADMIN).
- **API:** getCurrentProfile/getProfileRules/runProductionGuard/isProduction/
  isStaging/isLocal/isDev/getBlockedActions/getWarnings/blocks/setProfile.
- **Audit events:** environment.profile_detected / guard_checked /
  production_blocked / warning_issued / reset_blocked / demo_blocked /
  override_rejected.
- **Verified (28 cases):** DEV/LOCAL normal; STAGING warns; PRODUCTION blocked +
  honest; demo/reset blocked + audited in PRODUCTION; LOCAL unchanged (demo works,
  reset RBAC-guarded); v3.8 backup + commercial UI + H1-H5 + lock/unlock intact;
  smoke 18/18, drills 6/6, maintenance 10/10, integrity 88/0, gate 36/0, chain
  valid; no console errors.
- **Docs:** ENVIRONMENT_PROFILES_PRODUCTION_GUARD_v3.9, OPERATOR_MANUAL_v3.9_
  ADDENDUM, RELEASE_REPORT_v3.9. **Deferred:** real auth, server persistence,
  hosting, monitoring (Pilot, Option B) — the guard names exactly these as the
  blockers.

## v3.8.0 — BACKUP_EXPORT_RESTORE (2026-06-22)
Additive deployment-foundation release over v3.7.0 — closes the highest immediate
risk (no backup / data loss) from the v3.8 Deployment Foundation Audit. Local-
first, auditable full-state backup/export/restore. No backend, no auth, no
hosting; no change to vault H1-H5, store, registry, or commercial behavior.
Snapshot `index_v3.8.0.html` + `archives/v3.8.0/`. Gate 36 (backup is operator-
invoked, intentionally not boot-gated).

- **New module `backup.js` (`SYSOS.backup`)** + **Station 14 // BACKUP** (router-
  registered, lazy): export full `sysos.*` state to a downloadable JSON, validate
  a backup, and restore conservatively.
- **Export:** verifies vault chain + integrity first; builds a JSON with metadata
  (schema/version/role/backup_id/origin), the full storage payload, a verification
  block (`state_hash`, vault/audit/integrity status, record counts, schema
  signature), a restore policy, and a human summary. Downloads as
  `SYS_OS_BACKUP_v<ver>_YYYY-MM-DD_HHMMSS.json`. No secrets/tokens/credentials.
- **Validate:** 20-point check (JSON, required sections, schema/version,
  `created_by_sys_os`, required state families, **state-hash match**, forbidden-key
  scan, chain-status presence, emptiness) → `{valid, severity PASS/WARNING/FAIL,
  errors[], warnings[], can_restore}`. Invalid backups never mutate state.
- **Restore (conservative):** RBAC + confirmation (`RESTORE SYS_OS BACKUP`) →
  validate → **pre-restore snapshot** → overwrite `sysos.*` → re-hydrate →
  **re-verify vault chain** → audit. **Rollback to snapshot on any failure.**
- **RBAC:** new `backup.export` (all roles incl. READ_ONLY) + `backup.restore`
  (ADMIN/MANAGER/OPERATOR; READ_ONLY denied). Both audited.
- **Audit events:** export_started/created/failed; validation_passed/failed;
  restore_started/completed/failed/rejected.
- **Verified (30 cases):** round-trip export→validate→restore→reload; vault chain
  + integrity 88/0 preserved; invalid JSON / missing metadata / hash-tamper /
  empty / forbidden-key / missing-family all rejected; confirmation required;
  READ_ONLY restore denied; fault-injected restore failure rolled back cleanly;
  smoke 18/18, drills 6/6, maintenance 10/10, gate 36/0, chain valid, H1-H5 +
  demo + lock/unlock + v3.7 commercial UI all intact; no console errors.
- **Docs:** BACKUP_EXPORT_RESTORE_v3.8, OPERATOR_MANUAL_v3.8_ADDENDUM,
  RELEASE_REPORT_v3.8. **Deferred:** environment profiles / production config
  guard / server backup (later milestones).

## v3.7.0 — COMMERCIAL_RECORD_MANAGEMENT_UI (2026-06-21)
Additive operator-completion release over v3.5.0. Closes v3.6 validation gap
**F2** (commercial records were create/view-only in the UI) and guards **F1**
(delete that would orphan a reference). No redesign, no schema/persistence-format
change, no change to Vault H1-H5. Snapshot `index_v3.7.0.html` +
`archives/v3.7.0/`. Gate 36.

- **Commercial record UI (client.js):** per-record **EDIT / ARCH·UNARCH / DEL**
  controls on Client Center rows (clients) and workspace items (proposals,
  contracts). `handleCommercialAction` dispatcher; client row is now a
  `div[role=button]` hosting the controls (selection unchanged).
- **Edit (commercial_ui.js):** generalized the pre-existing edit form to
  `edit(recordMode, id)` — the update logic already existed and was simply
  unwired; now reachable for client/proposal/contract (prefilled form → COMMIT).
- **Relationship safety (F1):** `linkRisk()` checks backlinks + Vault document
  links before any hard delete. References present → **delete blocked + audited
  (`<domain>.delete_blocked`)**, operator directed to ARCHIVE (links preserved).
  Unreferenced records → two-step confirm + post-delete integrity check. Dangling
  links are unreachable via the UI.
- **RBAC/audit unchanged:** EDIT/ARCH→`<domain>.update`, DEL→`<domain>.delete`
  via the existing store enforcement + audit wrap; denials notified + audited.
- **Verified:** edit prefilled+persisted+audited; archive/unarchive; two-step
  delete of an unlinked record; delete-blocked on a linked client; READ_ONLY
  denied; survived reload. smoke 18/18, drills 6/6, maintenance 10/10, integrity
  88/0, gate 36/0, vault chain valid, H1-H5 + demo + SQLite swap + lock/unlock intact.
- **Docs:** COMMERCIAL_RECORD_UI_v3.7, OPERATOR_MANUAL_v3.7_ADDENDUM,
  RELEASE_REPORT_v3.7. **New modules:** none (additive to existing).
- Note: v3.6 was an audit/validation cycle (no version bump); this is the next
  sealed code release after v3.5.0.

## v3.5.0 — SESSION_BOUND_RBAC_VAULT_HARDENING (2026-06-20)
Additive security + scalability release over v3.4.0. No redesign, no destructive
migration, no schema change, no persistence-format change. Snapshot
`index_v3.5.0.html` + `archives/v3.5.0/`. Gate 36. Every phase measured and
verified individually; full regression green at seal.

- **Session persistence (Phase 2):** `auth_ui` persists `{operator,role,since}`
  through the storage adapter (`sysos.session.v1`); `restore()` re-applies it on
  boot. ADMINISTRATOR remains the boot default when no session exists (default-
  deny flip deferred by directive). `bootcheck` gates `authUI.restore`.
- **Lock / Unlock (Phase 3):** memory-only `lock()`/`unlock()` — LOCK drops the
  active role to READ_ONLY preserving the prior operator; UNLOCK restores it.
  Lock state does not persist across reload (by design). Gate-validated.
- **Registry Grid pagination (Phase 4):** `registry.js renderTable` lifts the
  proven Client-Center pattern — filter/sort full dataset → 25-row page slice →
  PREV/NEXT + count. Verified 308 records → **25 DOM rows**, O(page) not O(n).
- **Proposal/Contract pagination closure (Phase 5):** measured proof that both
  render through the single Registry Grid path (already paginated in Phase 4);
  no separate table exists. `PAGINATION_CLOSURE_v3.5.md`. No code added.
- **Vault hardening (Phase 6, H1–H5) — closes risk review R1–R5:**
  - **H1** Vault→Central Audit bridge: ingest/evidence/ocr_stored/reset now
    record `document.*` events in `SYSOS.audit` (was 0). Vault chain preserved.
  - **H2** Hash-mode visibility: `vault.hashMode()`; weak FNV-1a (non-secure
    context) surfaces WARNING/YELLOW + boot warn + startup audit event — no
    longer silently HEALTHY. `verifyChain` unchanged.
  - **H3** Reset protection: `vault.reset({confirm:'RESET_VAULT'})` requires
    ADMINISTRATOR + token + verified recovery snapshot before deletion (aborts
    if snapshot fails); full audit lifecycle. New permission `vault.reset`.
  - **H4** Corrupt-restore quarantine: boot restore validates with distinct
    reasons; corrupt payload quarantined (`sysos.vault.quarantine.<ts>`) before
    any reseed; quarantine-write failure aborts without overwrite;
    `vault.restoreStatus()` + WARNING surface. `restore()` (demo/sqlite) intact.
  - **H5** Vault RBAC completion: `attachEvidence` + `registerOCRProvider` gated
    (`vault.attachEvidence`, `vault.ocrProvider`) with structured denials +
    audit; boot recovery and pre-authorized OCR completion intentionally ungated.
- **Deferred:** H7 normalized vault persistence (vault is 3 docs; no scale need).
- **Regression at seal:** smoke 18/18, drills 6/6, maintenance 10/10, integrity
  88/0, gate 36/0, vault chain valid, demo isolation + SQLite swap intact.
- **New modules:** none (all additive to existing modules). **Docs:**
  BASELINE_REPORT_v3.5_PRE, PAGINATION_CLOSURE_v3.5, VAULT_ARCHITECTURE_MAP_v3.5,
  VAULT_RISK_REVIEW_v3.5, VAULT_HARDENING_PLAN_v3.5, RELEASE_REPORT_v3.5.

## v3.4.0 — INCREMENTAL_HEALTH (2026-06-16)
Removes the last measured health O(n) constant via per-client memoization with
change-token invalidation. Additive, no business changes. Snapshot
`index_v3.4.0.html` + `archives/v3.4.0/` (43 files, 33 JS modules). Gate 36.

- **healthcache.js (new):** `SYSOS.healthCache` change-token model —
  `clientToken[id]` (client/proposal/contract/stage changes) + `globalToken`
  (project/compliance/vault/batch/demo) + `_version` (gates dist/metrics).
  Invalidation driven by existing DataStore events; no new plumbing.
- **commercial.health(id):** memoized; raw body preserved as `_computeHealth`
  for slow-path equality tests.
- **healthDistribution / executive.metrics:** cached by version; rebuild reuses
  per-client cache.
- **Measured @1,532:** healthDistribution 28.6ms cold → **0ms cache hit / 1ms
  after one change**; executive.metrics 50ms cold → **0ms cache hit**.
- **Correctness:** health === _computeHealth (0 mismatches, 60-client sample);
  invalidation verified (house_account 67→83 on proposal add, fast==slow);
  global invalidation on project change; distribution == from-scratch.
- **Regression:** smoke 18/18, drills 6/6, maintenance 10/10, integrity 1585/0,
  RBAC denials audited, demo isolation, SQLite swap, lazy render (0 at boot) —
  all intact. 0 regressions.
- **Docs:** BASELINE_REPORT_v3.4_PRE, HEALTH_PIPELINE_MAP_v3.4,
  TABLE_RENDERING_REVIEW_v3.4 (Phase 7), RBAC_SESSION_BINDING_PLAN_v3.4
  (Phase 8), PERFORMANCE_REPORT_v3.4.
- Residual: `forecast()` (~10ms) is now the largest piece of executive.metrics
  after a change — next memoization candidate (not health, out of scope).

## v3.3.0 — LAZY_RENDER (2026-06-16)
Performance/scalability release — eliminates the v3.2.0 boot/render-at-scale
ceiling. Additive, no business changes. Snapshot `index_v3.3.0.html` +
`archives/v3.3.0/` (42 files, 32 JS modules). Gate 35.

- **Lazy station rendering (Phase 2):** `router.register` defers `render()` to
  first `switch()`. Verified: 0 of 8 dynamic stations render at boot (was 8).
  registries + liveops init refactored into their render callbacks.
- **Backlink index (Phase 3):** `relations.buildIndex/index/invalidateIndex/
  backlinksFast/linkStatsFast`. O(1) reverse lookups; invalidated on mutation.
  `backlinksFast===backlinks` verified (6=6), integrity 0 broken at 1,582 links.
- **healthDistribution O(n) (Phase 4):** `commercial._buildClientIndex` makes
  `proposalsFor`/`contractsFor` O(1); `client.metrics` uses `linkStatsFast`.
  **client.dashboard 493ms → 2.9ms (170×)** at 1,532 records.
- **Pagination (Phase 5):** client list = 25-row pages; filter/search/sort on
  full dataset before paging. Verified 110 matches → 25 DOM rows.
- **RBAC completion (Phase 6):** `auth.enforce()` gates vault.ingest,
  compliance.schedule/complete, ocr.upload, opsQueue.enqueue (+ `ops.dispatch`
  perm). Verified VIEWER denied + audited on vault & compliance.
- **Scale (Phase 7):** 1,532 records — 0 boot render, first activation 56–63ms.
- **Regression (Phase 8/10):** smoke 18/18, drills 6/6, maintenance 10/10,
  integrity 1,582/0, demo isolation + SQLite swap intact at scale. 0 regressions.
- Remaining bottleneck: healthDistribution O(n) constant — next target is
  per-client health memoization.

## v3.2.0 — NORMALIZED_TENANT (2026-06-16)
Scalability release — eliminates the v3.1.1 bulk-write O(n²) ceiling. Additive,
backward compatible. Snapshot `index_v3.2.0.html` + `archives/v3.2.0/` (42 files,
32 JS modules). Gate 35.

- **Storage normalization (Phase 2):** per-domain keys (`sysos.reg.<domain>` +
  manifest) replace the monolithic `sysos.registry.v1` blob. A single write
  re-serializes only its collection. Legacy blob auto-migrated on restore.
  Verified: client write leaves proposals key untouched.
- **Transaction batching (Phase 3):** `stores.beginBatch/commitBatch/
  rollbackBatch`. Defers storage + activity + audit flushes AND suppresses
  per-record UI events to one coalesced refresh. **300 records: 23,492ms →
  112ms (209×); 1500 records: 780ms.**
- **RBAC enforcement (Phase 4):** `_enforce()` at every DataStore write path;
  denials throw + audit `permission_denied`. Verified VIEWER blocked, OPERATOR
  create-yes/delete-no, ADMIN all.
- **Audit expansion (Phase 5):** added `reason` field; events
  permission_denied/batch_begin/batch_commit/batch_rollback/migration_start/
  migration_complete/import/export. Verified all captured.
- **SQLite (Phase 6):** transactions added; round-trip localStorage→sqlite→
  localStorage, dataParity true, no data loss.
- **Large scale (Phase 7):** 500×500×500 = 1531 records, integrity 1581/0,
  survived reload.
- **Resilience (Phase 8):** corrupt rejected · broken-link flagged · permission
  blocked+audited · batch rollback clean · migration recovery no-loss — 5/5.
- Fixed Persistence smoke test (was coupled to the retired legacy key).
- FINDING: boot at 1531 records = 14.5s (eager all-station render +
  healthDistribution O(n²)) — the next ceiling, logged. Write path objective met.
- All v2.7–v3.1.1 preserved; integrity 88/0; smoke 18/18; 0 regressions.

## v3.1.1 — OFFLINE_SOVEREIGN (hardening) (2026-06-15)
Completes the v3.1 infrastructure gaps. Additive over v3.1.0. Snapshot
`index_v3.1.1.html` + `archives/v3.1.1/` (42 files, 32 JS modules). Gate 35.

- **Transactions (Phase 2 gap):** `SqliteBackend.transaction(fn)` (defer-flush +
  rollback) and `storage.transaction(fn)` (backend passthrough / localStorage
  emulation). Verified commit persists (a=1,b=2), rollback discards (c absent).
  Backend swap round-trip localStorage→sqlite→localStorage with no app change.
- **Migration Engine (Phase 3):** `SYSOS.sqlite.migrate()` — measured before/
  after across registry/vault/activity/compliance/ocr/ops + integrity.
  Verified dataParity true, integrity 88=88, registry 38=38; activity asserted
  monotonic (append-only).
- **Audit coverage (Phase 4):** added `notes` + `source module`; wrapped
  compliance schedule/complete; system events (demo, auth) recorded; lifecycle
  captured. `audit.reportText()`. Verified 5 action types incl.
  compliance.complete + lifecycle.transition, notes present.
- **Auth (Phase 5):** verified ADMIN(all)/OPERATOR(create-yes,delete-no)/
  VIEWER=READ_ONLY(create-no,report-yes).
- **Offline (Phase 6):** 0 external resources confirmed.
- **VISUAL_SYSTEM_V2 (Phase 7):** concrete color/type/card/sidebar/nav/button/
  form/table token blueprint.
- **Stress (Phase 8):** 100/100/100 → 338 records, integrity 388/0, survived
  reload (boot 881ms). Reads fast (integrity 0.7ms, forecast 0.8ms, report
  4.2ms). FINDING: bulk write ~23.5s for 300 (O(n²) full-snapshot-per-write) —
  logged as technical debt; fix path = normalized per-row SQLite.
- 2 in-build bugs found by verification (transaction arg, migration parity) —
  fixed + re-verified. All v2.7–v3.1.0 preserved; integrity clean; 0 regressions.

## v3.1.0 — OFFLINE_SOVEREIGN (2026-06-15)
Deployment-grade infrastructure. New modules `sqlite_backend.js`, `audit.js`,
`auth_ui.js`; locally compiled Tailwind + self-hosted fonts; strict CSP.
Snapshot `index_v3.1.0.html` + `archives/v3.1.0/` (42 files, 32 JS modules).
Boot gate validates 35 modules; 13 stations.

- **SQLite backend (Phase 2):** `sqlite_backend.js` — KV-table model
  (connect/initialize/get/set/remove/query/export/import) on the storage
  adapter. Verified CRUD, SQL `SELECT...LIKE`, backend swap, and **persistence
  across restart** (boots on sqlite from a flag; record survived reload).
- **Audit history (Phase 3):** `audit.js` — append-only, uncapped; user/role/
  ts/action/domain/target/before/after/source. Auto-captures client/proposal/
  contract mutations (verified before:PROSPECT→after:ACTIVE). Queryable + exportable.
- **Auth surface (Phase 4):** `auth_ui.js` station 13 — login/logout/session,
  identity, role + permission display. Verified ADMIN/OPERATOR/READ_ONLY
  enforce correctly; logout fails closed; invalid role rejected.
- **Offline (Phase 5):** Tailwind compiled locally → `assets/css/tailwind.build.css`
  (scans HTML + JS); fonts self-hosted (6 woff2, 108K). CDN + Google Fonts
  removed. Verified zero external resources, styling intact (sidebar 320px,
  Share Tech Mono, gold accents), boot FASTER (427ms vs 569ms).
- **Strict CSP (Phase 6):** `script-src 'self'`, `font-src 'self'`, no
  unsafe-eval. `style-src 'unsafe-inline'` retained (documented exception:
  DSCR inline width + bootcheck halt panel). Zero CSP violations.
- **Failure recovery (Phase 8):** 6/6 drills + db-unavailable (no crash,
  in-memory recovered), permission denial, invalid login — all graceful.
- **Performance (Phase 9):** boot 427ms, integrity 0.2ms, audit query 0.2ms,
  auth 0.3ms/100, report 1.4ms, storage write 0.1ms.
- **Docs:** DEPLOYMENT_READINESS_REPORT + 6 prior v3.0 architecture docs.
- All v2.7–v3.0 preserved; integrity 88/0; smoke 18/18; 0 regressions.

## v3.0.0 — SOVEREIGN_COMPILE (2026-06-15)
Deployment-grade infrastructure — additive, zero redesign, zero destructive
migration. New modules `storage.js`, `auth.js`; persistence routed through the
adapter across all stores; demo expanded to a full sandbox. 6 architecture docs
under `docs/v3.0/`. Snapshot `index_v3.0.0.html` + `archives/v3.0.0/` (31 files,
29 JS modules). Boot gate validates 32 modules.

- **Storage Adapter Layer (Phase 3):** `SYSOS.storage` (get/set/remove/keys/
  query/exportAll/registerBackend). Every persist/restore in store, vault,
  compliance, ocr, opsqueue routes through it — same keys/JSON (backward
  compatible). Verified: backend swap to in-memory impl + reset; live data
  round-trips a reload through the adapter.
- **Auth Architecture (Phase 5):** `SYSOS.auth` — 4 roles, permissions matrix,
  attribution, `can()`. Verified OPERATOR can create not delete/configure;
  admin all. No login UI (architecture-first).
- **Full Demo Sandbox (Phase 6):** one `_suspendPersist` flag now guards every
  store; demo isolates registry + vault + activity. Verified registry/vault
  storage untouched in demo, client + vault demo leaks gone on exit, live
  restored.
- **Design deliverables:** DEPENDENCY_REPORT, SQLITE_MIGRATION_DESIGN,
  AUDIT_HISTORY_ARCHITECTURE, AUTH_ARCHITECTURE, VISUAL_SYSTEM, SYSTEM_MAP.
- **Preservation (measured):** 12 stations, 38 records, integrity 88/0, chain
  valid, smoke 18/18, maintenance 10/10, 0 boot errors. All v2.7–v2.9.9 intact.

## v2.9.9 — EXECUTIVE_COMMAND_CENTER (2026-06-14)
Additive executive layer — 4 new stations, zero existing stations touched.
New modules `executive.js`, `executive_ui.js`, `demo.js`; guards added to
`store.js`. Snapshot `index_v2.9.9.html` + `archives/v2.9.9/` (29 files, 27 JS
modules). Boot gate validates 30 modules. Stations: 8 → 12.

- **Navigation:** 4 stations via the router contract — 09 Dashboard, 10
  Operator, 11 Timeline, 12 System Health — all mount/refresh/validate.
- **Executive Dashboard:** 12 metrics, each with a documented derivation
  source; values measured (pipeline $7,500, expected $6,250, projected $11,250).
- **System Health Center:** 8 subsystem checks → GREEN/YELLOW/RED + overall;
  measured 7 GREEN / 1 YELLOW (telemetry, :3132 genuinely offline).
- **Activity Timeline:** view over the persistent activity ledger, type filter,
  chronological. Verified events persist across reload (16 events, test client
  + lifecycle event survived).
- **Operator Workspace:** today's tasks, upcoming compliance/renewals, expiring
  proposals, open pipeline, recent activity — all derived with sources shown.
- **Reports:** executive/pipeline/compliance/health text from live data.
- **Demo Mode:** DEMO/LIVE toggle; persistence suspended in DEMO. Verified
  live storage untouched during demo, demo mutation never persisted, LIVE
  restored on exit (4 live clients ↔ 3 demo clients, $7.5K ↔ $135K pipeline).
- **Visual:** restrained professional cards for the new stations (no existing
  station restyled).
- Fixed an in-build defect: exec button helper omitted label text (a11y) —
  caught by verification, corrected, re-verified.
- v2.7–v2.9.8 preserved; integrity 88/0; smoke 18/18; 0 boot errors.

## v2.9.8 — PIPELINE_HARDENING (2026-06-14)
Hardening release — additive, zero redesign. New modules `money.js`,
`smoketest.js`, `maintenance.js`; refactors to `commercial.js`, `client.js`,
`commercial_ui.js`. Snapshot `index_v2.9.8.html` + `archives/v2.9.8/` (26 files,
24 JS modules). Boot gate now validates 27 modules.

- **Stage history (debt #4 closed):** all stage writes route through
  `commercial.setStage(id, stage, {user,source,notes})`; the admin form no
  longer writes `stage` directly. Verified UI path (source=admin-ui) + API path
  (source=api-test) both record from/to/ts/user/source/notes.
- **Money safety (debt #3 closed):** `money.js` integer-cents layer; forecast/
  portfolio compute in cents (`forecast().cents` exposed). Verified
  0.1+0.2=0.30 exact, 1050.10×0.6=630.06 exact, projected = cents/100.
- **Station mounting contract (debt #1 closed):** `clientStation` and
  `commercialUI` expose init/mount/unmount/refresh/validate; admin UI mounts
  panel-scoped (no shared-anchor global lookups). validate() → mounted:true.
- **Data-level filtering (debt #2 closed):** client list filters in the data
  layer (`clientStation.setListFilter`) before render; no DOM show/hide.
  Verified 2 rows rendered on stage filter, none hidden.
- **Smoke framework (debt #5):** `smoketest.run()` 18 subsystem tests + 
  `failureDrills()` 6 fault-injection drills. Verified 18/18 + 6/6 PASS.
- **Maintenance automation:** `maintenance.run()` 10-check sequence + report.
  Verified 10/10 healthy.
- **Failure recovery:** missing module/function (gate), corrupt proposal/
  contract (store reject), broken link (integrity flag), invalid stage (reject)
  — all caught, reported, recoverable.
- **Stress test:** 20+20+20 records → 98 total persisted across reload,
  integrity 148/0; 60 cleaned to baseline 38/88.
- **Performance (measured):** boot DCL 569ms; integrity 0.5ms, health 1.4ms,
  revenue <1ms, smoke 0.4ms, maintenance 17ms (at 98 records).
- v2.7–v2.9.7 preserved; 0 regressions; 0 boot errors.

## v2.9.7 — PIPELINE_AUTOMATION_UI (2026-06-14)
Additive operations layer over v2.9.6. New modules `commercial_ui.js`,
`bootcheck.js`; `commercial.js`/`client.js`/`store.js`/`vault.js` extended.
Snapshot: `index_v2.9.7.html` + `archives/v2.9.7/` (23 files, 21 JS modules).

- **D-1 hardened:** `relations.linkStats()` counts forward+reverse across all 8
  link domains; `client.metrics.linkedEntities` verified 2+2=4.
- **Relationship symmetry:** LINK_DOMAINS expanded to projects/workflows/agents/
  documents/clients/proposals/contracts/compliance; vault docs symmetric.
  Backlinks resolve proposal→client and contract→proposal. Integrity 90/0.
- **Proposal CRUD + schema:** +description/probability/owner; statuses
  DRAFT/REVIEW/SENT/ACCEPTED/REJECTED/EXPIRED.
- **Proposal automation:** `proposalAutomation()` (days-remaining, 30/14/7/3/1
  thresholds, upcoming/expired queues, acceptance rate); `sweepExpiredProposals()`
  auto-expires (verified 1 swept → EXPIRED).
- **Contract CRUD + monitoring:** +renewalDate/owner; `contractMonitoring()`
  (expiration + renewal queues, alerts). Verified renewal at 5d → 7d threshold.
- **Revenue ops:** `forecast` + `revenueByClient/ByProposalStatus/ByLifecycleStage`;
  per-proposal probability override. Verified expected $6,250 / projected $11,250.
- **Health engine:** 6 factors (added Document activity) normalized to 100 +
  risk flags. Verified RED 33 with 4 flags; distribution 1/1/1.
- **Admin UI** (`commercial_ui.js`): client/proposal/contract forms, lifecycle +
  status controls, search/filter, validation feedback — injected into station 08,
  no redesign. Verified live create + validation rejection.
- **Boot gate** (`bootcheck.js`): 22-module manifest validated pre-boot, visible
  halt panel on failure. Verified detects missing module and restores.
- **Persistence:** SEED_VERSION 4→5; all domains survive reload. Prior layers
  (v2.7–v2.9.6) preserved, 0 regressions, 0 boot errors.

## v2.9.6 — COMMERCIAL_PIPELINE (2026-06-14)
Additive commercial pipeline over v2.9.5. Snapshot: `index_v2.9.6.html` +
`archives/v2.9.6/`. New module `commercial.js`; `client.js` extended for
workspace/report/dashboard integration; registry.js gained 2 domains.

- **D-1 fixed:** `client.metrics().linkedEntities` now = forwardLinks +
  reverseLinks (was reverse-only). Verified sample_consulting_a: 2 fwd + 2 rev
  = 4. New fields `forwardLinks`/`reverseLinks` exposed.
- **Client lifecycle engine:** `commercial.setStage/stageHistory/clientsByStage`;
  8 states LEAD→…→ARCHIVED; `stage` + `stageHistory[]` on client records;
  timestamped transitions; persisted (verified across reload).
- **Proposals domain:** DataStore `proposals` (idPrefix PRO) — clientId, title,
  amount, status (DRAFT…EXPIRED), createdDate, proposalDate, expectedCloseDate,
  notes, links. 2 seeds.
- **Contracts domain:** DataStore `contracts` (idPrefix CON) — clientId,
  proposalId, title, status (NOT_SENT…TERMINATED), effectiveDate,
  expirationDate, value, links. 1 seed; proposalId linkage verified.
- **Revenue forecast engine:** `commercial.forecast([clientId])` — Pipeline /
  Proposal / Contract / Closed / Expected (probability-weighted) / Projected.
  All derived; verified portfolio $7,500 / $4,750 expected / $9,750 projected.
- **Client health engine:** `commercial.health(clientId)` — deterministic
  0-100 over 5 explainable signals → GREEN/YELLOW/RED. Distribution 1/2/0.
- **Executive commercial dashboard** (station 08) + **reporting layer** extended
  with lifecycle/proposal/contract/revenue/health sections (`report` + `reportText`).
- **Persistence:** SEED_VERSION 3→4; proposals/contracts persist in
  `sysos.registry.v1`. **v2.9.5 preserved:** integrity 0 broken (87 checked),
  vault chain valid, all prior domains/relationships/telemetry/ops intact.

## v2.9.5 — COMMERCIAL_READINESS (2026-06-13)
Additive client layer for multi-client commercial operation. Full snapshot:
`index_v2.9.5.html` + `archives/v2.9.5/`. (Minor release layered in-place on
v2.9.0; the last full pre-this-work snapshot is `archives/v2.8.0/`.)

**New module:** `client.js` — Client Workspace Model, dashboard metrics,
reporting layer, and Client Center station (08).

**Schema:** new `clients` DataStore domain (idPrefix CLT) — fields name,
segment, status, tier, contact, email, value, notes + standard envelope.
Seeded with 3 real records: house_account (AA Capital INC, links 4 projects +
1 doc) and two clearly-labeled SAMPLE consulting/e-commerce prospects.

**Relationships:** `clients` added to the shared `LINK_DOMAINS` and to vault
`normalizeDocLinks` — so Client↔Project and Client↔Vault resolve
**bidirectionally** through the existing relations/backlinks/integrity engine
with no special-casing. Every entity now carries a `links.clients` bucket.

**Persistence:** clients persist in the existing `sysos.registry.v1` store;
`SEED_VERSION` bumped 2→3 to migrate the new domain + link bucket.

**Verified:** 3 seed clients (+1 live-created) survived reload; workspace
resolves 4 projects/1 doc/2 compliance for the house account; bidirectional
backlinks confirmed both ways; reporting layer emits structured + text reports;
integrity 83 links / 0 broken; v2.9 (telemetry/ops/routing/compliance/ocr) and
the vault chain fully preserved; zero boot errors.

## v2.9.0 — LIVE_OPERATIONS (2026-06-12)
Additive live-operations layer over the verified v2.8 system of record.
Archive: `index_v2.8.html` + full module snapshot in `archives/v2.8.0/`.
Only `config.js`, `main.js`, `index.html` touched in v2.8 surface (additively).

**6 new modules (1,300+ LOC), station 07 LIVE OPS via the expansion contract:**
- **telemetry.js** — real `fetch()`-probe node health, `performance.now()` RTT,
  AbortController timeout. Measured states ONLINE/DEGRADED/OFFLINE. Verified:
  self 5ms, hyperframes 10ms, betting_engine OFFLINE (true negative — :3132 down).
- **opsqueue.js** — persistent operations queue, state machine
  PENDING→RUNNING→COMPLETED/FAILED, bounded retry, crash-safe restore.
- **routing.js** — Agent Registry → executable routing contracts (7 contracts:
  5 executable / 2 provisioned). Registry preserved as truth; `bind()` is the
  v3.0 live-endpoint seam.
- **compliance.js** — scheduler layer (due dates, reminders, escalation) over
  the preserved Compliance Registry. Verified ESCALATED/DUE_SOON/COMPLETED.
- **ocr.js** — Upload→Process→Extract→Store→Link framework on the existing
  vault OCR hook. No provider shipped (by directive); parks at
  AWAITING_PROVIDER, stores to real vault chain once a provider binds.
- **liveops.js** — LIVE OPS station UI surfacing all five subsystems.

**v2.8 preserved (measured):** 32 registry records, vault chain valid, 0 broken
links, all persistence/relationships/docs intact, zero boot errors.

**Validation:** docs/LIVE_OPERATIONS_v2.9.md — all five subsystems exercised
live including failure/retry and provider-bind paths; full persistence
round-trip across reload.

## v2.8.0 — OPERATIONAL_TRUTH (2026-06-12)
Dashboard → operational system of record. Archive: `index_v2.7.html` +
complete module snapshot in `archives/v2.7.0/`.

**Data layer (new `store.js`)**
- `SYSOS.DataStore`: persistent, schema-validated collections — create/update/
  archive/delete, filtering, search, mutation events. All six registries share
  `localStorage["sysos.registry.v1"]` (write-through, seedVersion-guarded).
- `SYSOS.activity`: persistent capped activity ledger (every mutation sealed).
- `SYSOS.relations`: cross-entity link resolution (forward + backlinks) and
  full referential-integrity scanning across registries AND vault.

**Registries (rebuilt on DataStore, real records)**
- Projects: full schema + complete CRUD with UI form, search, status filter,
  two-step delete confirm. Seeded with 8 real Prime Pathwy projects (Prime
  Pathwy OS, Shopify Platform, Certificate of Rehabilitation, Compliance
  Library, AI Consulting Framework, Turnover System, Fleet Capital ZEV,
  Health Console).
- Agents: 7-agent control layer (Architect/CEO/COO/Research/Compliance/
  Vault/Operations) with roles, responsibilities, workflow/project links.
- Workflows: 6 real workflows with triggers, steps, outputs, status tracking;
  create_project and project_audit are live executing systems.
- Relationship-resolving detail panel (forward links + referenced-by) for
  every domain.

**Vault** — operational taxonomy (CONTRACT/INVOICE/RECEIPT/SOP/COMPLIANCE/
RESEARCH/PROJECT), document↔project/workflow links, v2.7 store migration,
activity-ledger integration. OCR/vector hooks unchanged.

**Executive Command Center** — 8 metrics computed from live store state
(never scripted) + persistent recent-activity feed; re-renders on every
mutation event. Integrity audit now runs the project_audit workflow and
reports measured chain + link-integrity results.

**Validation:** docs/OPERATIONAL_TRUTH_v2.8.md — all 7 success criteria
measured PASS (33 records, 76 links/0 broken, chain verified, full
persistence round-trip).

## v2.7.0 — PRODUCTION_HARDENING (2026-06-11)
Full audit (35 findings, `AUDIT_v2.6.md`) → modular platform rebuild.
Archive: `index_v2.6.html` taken before migration.

**Security**
- F-27 **closed & regression-tested**: DOM-XSS in custom directives eliminated
  (all user input via textContent; live hostile-payload test renders inert).
- CSP installed (scripts: self + pinned CDN only; object-src none).
- Tailwind pinned 3.4.16 (F-28). Crypto-grade document IDs (F-08).

**Performance**
- Canvas engine rebuilt: pause/resume + freezeFrame API, visibilitychange
  auto-pause, 30fps cap with time-normalized motion, squared-distance link
  pass, DPR-aware rendering (F-12/14/15/16/18). **Screenshot capture works
  for the first time — verified.**
- All 3 `alert()` calls → non-blocking aria-live toasts (F-17).
- Terminal logs capped at 60 entries (F-10); ingestion pulse made finite (F-11).

**Architecture**
- Monolith → 9 modules under `SYSOS.*` namespace (F-31); every constant
  centralized in config.js (F-32); agent copy/protocol extracted from engine
  code (F-33); state classes single-sourced in SYSOS.UI (F-06).
- Router rebuilt: delegated events, `aria-current`, persistent active-bar
  elements (F-07/13), **runtime station registration contract**.
- CEO/COO consoles generated from one component + protocol config (F-04/05).

**Vault (presentation → engine)**
- 5-stage hooked ingestion pipeline; rule-based classification taxonomy;
  inverted-index search layer + UI filter; **hash-chained audit ledger with
  full verification**; evidence records sealed into chain; OCR provider hooks
  with auto-queueing; localStorage persistence (verified across reload) (F-35).

**Platform**
- Six sovereign registries (agents/workflows/SOPs/projects/intelligence/
  compliance) on one Registry class; 22 seed entries from real ecosystem
  assets; Registry Grid shipped as dynamically registered station 06.

**Accessibility / responsive**
- aria-live logs, Enter-to-submit forms, focus-visible ring, aria-current nav,
  h1/h2 hierarchy, prefers-reduced-motion honored incl. canvas, responsive
  shell (sidebar stacks under md:) (F-19–F-25).
- gold-950 palette gap fixed — P2 card gradient and fresh-ingest badge render
  as designed for the first time (F-02).

**Docs:** SYSTEM_ARCHITECTURE, DEPLOYMENT_GUIDE, MAINTENANCE_GUIDE,
VERSION_HISTORY, FUTURE_ROADMAP, AUDIT_v2.6.

## v2.6.0 — SYSTEM ARCHITECTURE OS (2026-06-11)
Single-file rebuild: Orbitron/Share Tech Mono cyber theme, neural-web canvas
background, 5 stations, CEO/COO mock terminals, vault ingestion simulator,
kinetic audit triggers. Deployed and verified in preview (port 4173).
Archived as `index_v2.6.html`.

## v2.5 — AI OS COMMAND DECK (2026-06-11)
JetBrains Mono theme, CRT scanline overlay, SVG-icon nav, 5 stations.
Archived as `index_v2.5.html`.

## v1 (2026-06-11)
Initial command deck. Archived as `index_v1.html`.
