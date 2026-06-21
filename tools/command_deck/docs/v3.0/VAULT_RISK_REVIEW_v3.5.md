# SYS_OS v3.5 — Vault Risk Review (Phase 6, read-only)

Measured risk assessment of the Vault subsystem at v3.4.0. Companion to
`VAULT_ARCHITECTURE_MAP_v3.5.md`. No code modified. Risks are ranked by
severity × likelihood, with the measured evidence behind each.

## Current strengths
- **S1 — Tamper-evident chain.** Each entry binds `prevHash`; `verifyChain`
  recomputes the whole chain and reports `brokenAt`. Measured valid (3 entries).
- **S2 — Real 5-stage pipeline with hooks.** INTAKE→CLASSIFY→HASH→INDEX→SEAL,
  extensible via `use(stage,fn)`; OCR rides the same sealed spine.
- **S3 — RBAC on the primary write path.** `vault.ingest` and `ocr.upload`
  enforce `vault.ingest`; denials throw + audit. READ_ONLY denied (verified).
- **S4 — Crypto-grade IDs + SHA-256 in secure context.** Measured sha256/64-hex.
- **S5 — Symmetric relationship integrity.** Vault links scanned by
  `relations.integrity()` (88/0 broken includes vault).
- **S6 — Demo isolation.** `persist()` short-circuits under `_suspendPersist`.
- **S7 — Backward-compatible restore.** Legacy class remap + link normalization.
- **S8 — Manual export primitive.** `exportState()` yields a full snapshot.

## Current weaknesses / measured risks
Severity: 🔴 high · 🟠 medium · 🟡 low.

### 🔴 R1 — Vault writes are absent from the central audit-of-record
**Measured:** `audit.query({domain:'documents'}).length = 0` while the vault
chain holds 3 sealed entries. `vault.ingest`/`attachEvidence` seal only into
`vault.auditChain`; they never call `SYSOS.audit.record`. The central audit
(`sysos.audit.v1`) — the queryable, exportable system of record used by
`audit.reportText`/`audit.export` — has **no vault events**. A
compliance/forensic query or an audit backup silently omits all document
activity. **Likelihood: certain (structural). Impact: high (audit completeness).**

### 🔴 R2 — Chain silently degrades to a non-cryptographic hash off secure context
**Measured:** secure here (sha256). But `utils.hash` falls back to **FNV-1a
(32-bit, collision-trivial)** whenever `!window.isSecureContext` (e.g. `file://`
or plain-`http` non-localhost). `verifyChain` still returns `valid:true` with
FNV hashes, and the UI shows **HEALTHY**. A vault served on a non-secure origin
produces a forgeable chain that presents as sound. **Likelihood: deployment-
dependent. Impact: high (tamper-evidence defeated, undetected).**

### 🟠 R3 — Evidence + provider writes are not RBAC-gated
`attachEvidence` (W2) and `registerOCRProvider` (W4) perform sealed writes /
trust changes with **no `auth.enforce`**. A READ_ONLY/guest session can attach
evidence into the chain or bind an OCR provider. **Likelihood: medium. Impact:
medium (integrity-of-record, supply-trust).**

### 🟠 R4 — Destructive reset: no RBAC, no confirmation, adapter-bypassing
`reset()` calls **direct `localStorage.removeItem`** (not `storage.remove`), is
**not** permission-gated, performs **no export-first**, and wipes docs + chain +
evidence before reseeding. One call irreversibly destroys the chain. **Likelihood:
low. Impact: high (irrecoverable loss).**

### 🟠 R5 — Corrupt restore silently discards real documents
`restore()` on JSON-parse failure returns false → `init()` **reseeds**. A
corrupted `sysos.vault.v1` value is overwritten by seeds with no quarantine —
real documents lost, boot looks healthy. **Likelihood: low–medium. Impact:
high (silent data loss).**

### 🟠 R6 — Monolithic full-snapshot persistence (scale write risk)
`persist()` re-serializes **all** docs+chain+evidence+queue to one key on every
write — the same O(n)-write pattern that was normalized away for the registry in
v3.2 but **not** for the vault. At scale: write latency grows with vault size and
the single blob approaches the localStorage ~5MB quota (no chunking). **Likelihood:
grows with adoption (low today at 3 docs). Impact: medium.**

### 🟡 R7 — Artifacts are references, not bytes
Documents store path + hash, not file content; OCR stores extracted text. The
hash verifies the *record*, not a file you still hold. "Photo/evidence" is
tracked by reference; losing the external artifact loses it entirely. **Likelihood:
n/a (by design). Impact: medium for evidentiary use — document the limitation.**

### 🟡 R8 — Persist failures swallowed
`persist()` catches quota/unavailable and only `console.warn`s, leaving memory
ahead of storage with no surfaced error → silent divergence on reload.
**Likelihood: low. Impact: medium.**

### 🟡 R9 — No chain backup / self-heal
`verifyChain` detects breakage but there is no last-good snapshot or re-anchor.
A single corrupted entry strands the chain at DEGRADED with no remediation.

## Deployment risks
- **D1 (🔴):** serving on a non-secure origin ⇒ FNV-1a chain (R2). **Serve over
  https or localhost only.**
- **D2 (🟠):** no server-side backup — loss of browser storage = loss of vault +
  chain (export is manual, R9).
- **D3 (🟡):** monolithic blob vs localStorage quota at scale (R6).
- **D4 (🟢):** CSP `connect-src` limited to self + localhost:3132/4173 — aligned
  with the sovereign-offline model; no external exfiltration surface.

## Risk summary
| ID | Risk | Sev | Measured? |
|---|---|---|---|
| R1 | Vault events absent from central audit | 🔴 | yes (0 events) |
| R2 | Hash downgrade off secure context | 🔴 | yes (fallback path) |
| R3 | Evidence/provider not RBAC-gated | 🟠 | yes (source) |
| R4 | Destructive reset, no guard | 🟠 | yes (source) |
| R5 | Corrupt restore → silent reseed | 🟠 | yes (source) |
| R6 | Monolithic persistence | 🟠 | yes (source) |
| R7 | References not artifacts | 🟡 | by design |
| R8 | Swallowed persist failures | 🟡 | yes (source) |
| R9 | No chain backup/self-heal | 🟡 | yes (source) |
