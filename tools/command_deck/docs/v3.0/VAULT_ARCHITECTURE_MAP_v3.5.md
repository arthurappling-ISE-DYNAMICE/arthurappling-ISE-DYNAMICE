# SYS_OS v3.5 — Vault Architecture Map (Phase 6, read-only)

Complete map of the Knowledge Vault subsystem as it exists at v3.4.0. Source:
`vault.js` (engine + station UI), with integration seams in `ocr.js`,
`audit.js`, `auth.js`, `storage.js`, `utils.js`, `config.js`, `relations`
(store.js). No code was modified to produce this map. Runtime facts were
measured live on port 4173.

## 1. Module surface (`SYSOS.vault`)
- **State:** `documents` (Map id→doc), `index` (Map token→Set<docId>),
  `auditChain` (Array), `evidence` (Map docId→[records]), `ocrProvider`,
  `ocrQueue`, `hooks{intake,classify,hash,index,seal}`.
- **Pipeline:** `ingest(meta)`, `use(stage,fn)`, `runHooks`, `classify`,
  `tokenize`, `indexDoc`, `makeId`.
- **Chain:** `appendAudit(action,docId,payloadHash)`, `verifyChain()`.
- **Evidence:** `attachEvidence(docId,record)`.
- **OCR hooks:** `registerOCRProvider(provider)`.
- **Search:** `search(query)`.
- **Persistence:** `persist()`, `restore()`, `reset()`, `exportState()`,
  `seedAll()`, `totalRows()`.
- **UI (`vault.ui`):** `init`, `row`, `renderAll`, `prependRow`, `refreshMeta`.
- Boot gate requires: `ingest`, `verifyChain`, `init` (bootcheck manifest).

## 2. Ingestion pipeline (the single write spine)
`ingest(meta)` runs 5 sealed stages, each with a hook point:
1. **INTAKE** — build doc envelope (id, path, source, ingestedAt, links via
   `normalizeDocLinks`, ocr.required from `OCR_PATTERN`).
2. **CLASSIFY** — rule-based taxonomy (`CLASSIFICATIONS`, first-match-wins:
   INVOICE/RECEIPT/CONTRACT/COMPLIANCE/RESEARCH/SOP/PROJECT → else UNCLASSIFIED).
3. **HASH** — `utils.hash(path|ingestedAt|content)` or `meta.hashOverride`.
4. **INDEX** — `indexDoc` adds tokens to the inverted index; OCR-eligible docs
   push to `ocrQueue` (status QUEUED if provider, else AWAITING_PROVIDER).
5. **SEAL** — `appendAudit('INGEST', id, hash)` links into the hash chain.
Then: `documents.set`, `persist()`, `activity.log`, dispatch
`sysos:vault:ingested`.

## 3. Write paths (every one)
| # | Entry point | Path | Seals chain? | RBAC | Persists |
|---|---|---|---|---|---|
| W1 | `vault.ingest()` | manual / seed / simulator | yes (INGEST) | **`auth.enforce('vault.ingest')`** | yes |
| W2 | `vault.attachEvidence()` | evidence attach | yes (EVIDENCE) | none (no enforce) | yes |
| W3 | `ocr.upload()` → `ocr.process()` → `ocr.store()` → `vault.ingest()` | OCR | yes (via W1) | **`auth.enforce('vault.ingest')`** at `ocr.upload` | yes |
| W4 | `vault.registerOCRProvider()` | promotes queued OCR | no | none | yes |
| W5 | `vault.reset()` | destructive wipe + reseed | rebuilds | **none** | direct `localStorage.removeItem` |
| W6 | `vault.seedAll()` | boot seed (no restore) | yes (per seed) | inherits W1 | via W1 |

## 4. Read paths (every one)
| # | Entry point | Returns |
|---|---|---|
| R1 | `vault.search(query)` | inverted-index token match (prefix) → docs |
| R2 | `vault.documents` / `vault.totalRows()` | doc map / count (+LEGACY_BASELINE_ROWS 35) |
| R3 | `vault.verifyChain()` | full chain recompute → {valid,length,brokenAt} |
| R4 | `vault.evidence` | per-doc evidence records |
| R5 | `vault.exportState()` | full snapshot (docs+chain+evidence+queue) |
| R6 | `ui.renderAll/refreshMeta` | station 04 table + chain health badge |
| R7 | `relations.integrity()` / `backlinks()` | scans vault doc links symmetrically |
| R8 | `ocr.list/get/stats` | OCR job views |

## 5. Document / attachment / photo / evidence storage flows
- **Documents:** metadata records (id, path, classification, hash, links,
  status, ocr). **No binary/file bytes are stored** — the vault holds a path +
  cryptographic hash + relationship links, not the artifact itself.
- **Photos / images / PDFs:** detected by `OCR_PATTERN`
  (`.png|jpg|jpeg|pdf|tiff|heic`) → flagged `ocr.required`, queued for OCR.
- **OCR:** `ocr.upload(File|descriptor)` → QUEUED → (provider) PROCESSING →
  EXTRACTED → `ocr.store()` ingests **extracted text** as a first-class vault
  doc (hashed + chained). No provider ships today → jobs park at
  AWAITING_PROVIDER (measured: ocrProvider=false, queue=0).
- **Evidence:** `attachEvidence(docId, record)` appends a timestamped record to
  `evidence[docId]`, hashes it, and seals an `EVIDENCE` chain entry.

## 6. Audit linkage (Vault ↔ Audit subsystems)
- **Two independent trails.** The vault keeps its **own** tamper-evident
  hash-chain (`vault.auditChain`, sealed in `appendAudit`). The central audit
  system (`SYSOS.audit`, key `sysos.audit.v1`) auto-captures clients/proposals/
  contracts (store wrap) + compliance + lifecycle + demo + auth.
- **The vault does NOT call `SYSOS.audit.record`.** `vault.ingest`/
  `attachEvidence` seal only into the vault chain. **Measured:
  `audit.query({domain:'documents'}).length = 0`** — the central audit-of-record
  has zero vault events. `audit.export()` therefore does not back up vault
  activity. (See Risk Review §R1.)
- The only crossover: a denied `vault.ingest` is recorded as
  `permission_denied` by `auth.enforce` (→ central audit). Successful vault
  writes are not.

## 7. Integrity protections
- **Hash chain:** every entry binds `prevHash`; `verifyChain` recomputes each
  `entryHash` and checks linkage; reports `brokenAt`.
- **Hash primitive:** SHA-256 via WebCrypto **only in a secure context**;
  otherwise FNV-1a (32-bit, labeled in `algo`). Measured here: secure context,
  `sha256`, 64-hex. (See Risk Review §R2.)
- **Relationship integrity:** vault doc links normalized symmetric with store
  LINK_DOMAINS → `relations.integrity()` scans them (measured 88 links / 0
  broken includes vault).
- **Smoke/maintenance:** smoke `VaultChain` asserts chain length > 0;
  maintenance asserts `chain.valid`.

## 8. Recovery protections
- `restore()` rebuilds documents + index + chain + evidence from the persisted
  blob, with legacy class/link migration. On parse failure → returns false →
  `init()` reseeds (see Risk §R5).
- `exportState()` provides a manual full snapshot (backup primitive).
- `reset()` wipes and reseeds (destructive; see Risk §R4).
- No automatic chain backup / last-good snapshot / self-heal.

## 9. RBAC protections
- `vault.ingest` enforced at W1 and at `ocr.upload` (W3) via
  `auth.enforce('vault.ingest', {domain:'documents'})` — throws + audits
  `permission_denied`. Permission held by ADMINISTRATOR/MANAGER/OPERATOR;
  READ_ONLY denied (verified in prior phases).
- **Not gated:** `attachEvidence` (W2), `registerOCRProvider` (W4), `reset`
  (W5). (See Risk §R3/§R4.)

## 10. Persistence mechanisms
- Single key `sysos.vault.v1` via the storage adapter; **monolithic blob**
  `{v, docs[], chain[], evidence[], ocrQueue[]}` rewritten in full on every
  `persist()` (every ingest/evidence/provider change).
- Demo-guarded (`stores._suspendPersist` short-circuits persist).
- OCR jobs persist separately at `sysos.ocr.v1`.
- `reset()` deletes via **direct `localStorage.removeItem`**, bypassing the
  adapter. (See Risk §R4.)

## Measured runtime snapshot (port 4173, this session)
docs 3 · index tokens 20 · chain 3 entries / valid · evidence 0 · OCR provider
none / queue 0 · vault key present · central audit events 1,232 · **vault events
in central audit: 0** · integrity 88/0 · isSecureContext true · hash sha256(64).
