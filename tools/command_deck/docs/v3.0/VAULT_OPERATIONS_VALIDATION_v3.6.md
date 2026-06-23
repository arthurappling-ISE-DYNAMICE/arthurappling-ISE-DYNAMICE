# SYS_OS v3.6 — Vault Operations Validation (Phase 4)

Real document workflows executed live on v3.5.0; persisted, with the platform's
own guarded reset used to validate recovery. Baseline restored (3 docs, chain
valid, integrity 88/0). No code changed.

## Test records
Document `DOC-20260621-418EBD` (`/tools/val_doc.md`) + one evidence record.

## Results
| Operation | Action | Result | Persisted | Audit | Chain |
|---|---|---|---|---|---|
| **Ingest** | ingest document | sealed, indexed | ✅ `sysos.vault.v1` | ✅ `document.created` | valid |
| **Evidence attach** | attach evidence record | sealed into chain | ✅ | ✅ `document.evidence_attached` | valid |
| **Chain verification** | `verifyChain()` | valid throughout | n/a | n/a | **valid** |
| **Audit generation** | both writes | both captured (H1 bridge) | ✅ append-only | ✅ | n/a |
| **Recovery** | guarded `reset({confirm})` | reseeded 3 clean docs | ✅ | ✅ reset lifecycle | valid |

## Measured
- **Chain validity:** valid after ingest, after evidence, after reload, and after
  the recovery reset (3 entries, valid).
- **Audit events:** `document.created` and `document.evidence_attached` each
  recorded in the central audit with the correct document target.
- **Persistence:** the ingested document survived a reload (loaded from
  `sysos.vault.v1`).
- **Recovery artifacts:** the guarded reset produced a recovery snapshot key
  (`sysos.vault.recovery.<ts>`) **before** any deletion, then reseeded the clean
  3-document baseline — recovery readiness **confirmed working**. (The test
  recovery key was cleaned afterward.)

## Recovery readiness (validated)
- Reset is **guarded**: requires ADMINISTRATOR + `{confirm:'RESET_VAULT'}` + a
  verified recovery snapshot (aborts if the snapshot fails) — re-confirmed here.
- Corrupt-restore quarantine (H4) verified separately in v3.5; recovery artifacts
  (`sysos.vault.quarantine.<ts>`) are produced and readable.
- **Gap (operational, not a defect):** restoring **from** a recovery/quarantine
  snapshot is a **console/engineering step** — there is no operator-facing
  restore-from-snapshot function. Documented in the Operator Manual's Recovery
  section; flagged as a Pilot-readiness item.

## Verdict
Vault operations are **VALIDATED**: ingest/evidence persist + audit + keep the
chain valid; recovery (snapshot + guarded reset) works. One operational gap
(no operator restore-from-snapshot UI). No defects found.
