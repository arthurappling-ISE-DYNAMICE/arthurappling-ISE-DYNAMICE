# SYS_OS v3.5 — Vault Hardening Plan (Phase 6, proposal only)

Proposed remediation for the risks in `VAULT_RISK_REVIEW_v3.5.md`. **No code is
written by this document.** Every item is additive over existing functions, with
no schema change, no destructive migration, and no redesign — consistent with the
v3.5 engineering standard. Sequenced by value-to-risk (highest value / lowest
delivery risk first). Each item is independently revertible.

## Recommended hardening order

### H1 — Bridge vault writes into the central audit (closes R1) · 🔴 · lowest risk
**What:** in `vault.ingest` and `attachEvidence`, additionally call
`SYSOS.audit.record({ domain:'documents', action:'vault.ingest'|'vault.evidence',
target:docId, source:'vault', metadata:{ hash, classification } })`, try-guarded
so it can never break the seal (mirrors the audit module's own wrap discipline).
**Why first:** highest-value, smallest, additive change; the vault chain remains
the tamper-evident record, while the central audit becomes complete.
**Files:** `vault.js` (uses the existing `SYSOS.audit` API only).
**Pass criteria:** after one ingest, `audit.query({domain:'documents'}).length`
increments; `audit.export()` contains the vault events; vault chain unchanged;
smoke 18/18, drills 6/6, integrity 88/0, gate 36/0.

### H2 — Surface weak-hash / non-secure context (closes R2) · 🔴 · low risk
**What:** when `algo === 'fnv1a'` (or `!window.isSecureContext`), have
`refreshMeta`/`verifyChain` reporting render a **WARNING/DEGRADED** chain state
(not HEALTHY), and emit a one-time boot console warning. Optionally tag each
chain entry with its `algo` for `verifyChain` to flag downgraded entries.
**Why:** makes the silent cryptographic downgrade visible instead of green.
**Files:** `vault.js` (UI/report only; no hashing change).
**Pass criteria:** simulated non-secure context → chain state shows WARNING and
the boot warning fires; secure context unchanged (HEALTHY, sha256).

### H3 — Guard the destructive reset (closes R4) · 🟠 · low risk
**What:** gate `reset()` behind `auth.enforce('system.configure')`, auto-call
`exportState()` (persist a `sysos.vault.backup.<ts>` snapshot) before wiping, and
route deletion through `storage.remove` instead of direct `localStorage`.
**Files:** `vault.js`.
**Pass criteria:** READ_ONLY `reset()` denied + audited; a backup key exists
after an authorized reset; no direct `localStorage` call remains in `reset`.

### H4 — Quarantine corrupt restores (closes R5) · 🟠 · low risk
**What:** in `restore()`’s catch, copy the raw bad value to
`sysos.vault.corrupt.<ts>` before returning false (so reseed never destroys the
original bytes); log a surfaced warning.
**Files:** `vault.js`.
**Pass criteria:** a deliberately corrupted vault key is quarantined (recoverable
key present) and the platform still boots on seeds.

### H5 — RBAC on evidence + provider (closes R3) · 🟠 · low risk
**What:** add `auth.enforce('vault.ingest')` to `attachEvidence` and
`auth.enforce('system.configure')` to `registerOCRProvider`.
**Files:** `vault.js`.
**Pass criteria:** READ_ONLY denied + audited on both; ADMIN/MANAGER allowed.

### H6 — Surface persist failures (closes R8) · 🟡 · low risk
**What:** on a `persist()` write failure, set a visible chain-meta warning /
`utils.notify` instead of only `console.warn`, so memory↔storage divergence is
not silent.
**Files:** `vault.js`.
**Pass criteria:** a forced quota failure raises a visible warning.

### H7 — Normalized / append persistence (closes R6) · 🟠 · structural · defer
**What:** move the vault off the monolithic blob to per-record / append-style
keys (mirror the v3.2 registry normalization), so a single ingest re-serializes
only its delta.
**Why deferred:** vault is 3 docs today (low exposure per the table review);
this is the largest structural change and should wait until doc count is
expected to climb. Not recommended for the first hardening pass.
**Pass criteria (when done):** single ingest does not rewrite the whole vault;
round-trip parity; quota headroom measured at scale.

### H8 — Document the reference-not-artifact model (closes R7) · 🟡 · docs only
**What:** state explicitly (in the deployment/maintenance docs) that the vault
tracks path + hash + links, not file bytes; evidentiary use must retain the
external artifact. No code change.

## Recommended first cut
**H1 → H2 → H3 → H4 → H5**, each as its own measured, phase-gated step (the
established cadence). H6 optional alongside. **H7 deferred** until scale demands
it. H8 is documentation.

## Rollback considerations
- **Additive only.** Every item adds calls/branches to existing functions; none
  changes the persisted vault format (H1 writes to the *audit* key, which is
  already append-only and independently revertible). Backward compatible —
  pre-hardening vault keys still restore unchanged.
- **Per-item revert.** H1–H6 are confined to `vault.js`; `git checkout --
  tools/command_deck/assets/js/vault.js` reverts the lot, or revert the single
  commit per step. H1 touches no other module’s code (audit API is consumed,
  not modified).
- **No migration to undo.** H3/H4 only *add* backup/quarantine keys; removing
  them on rollback leaves the primary `sysos.vault.v1` untouched.
- **Archive intact.** v3.4.0 snapshot is byte-identical; the pre-Phase-6 baseline
  is restorable at any point.
- **Verification gates unchanged.** Each step must preserve smoke 18/18, drills
  6/6, maintenance 10/10, integrity 88/0, boot gate 36/0, lazy render — any
  regression halts that step.

## Out of scope (explicitly not proposed)
Binary/file storage, server-side backup, external KMS, cloud audit sink, or any
redesign of the chain/pipeline. These exceed the sovereign-offline model and the
additive mandate.
