# workflows/research/ — Intelligence & Integrity SOPs
**Architect:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Purpose

Research and verification workflows for the GeminiEcosystem. Covers external lead scouting (Browser Scout Protocol) and internal system integrity validation (Recursive Integrity Audit). Both workflows enforce the Zero-Inference Rule — state must be verified, not assumed.

---

## Workflows

| Folder | Asset | Classification | Status |
|--------|-------|---------------|--------|
| [browser-scout-protocol/](browser-scout-protocol/) | Playwright-based lead scraping — Vallejo logistics market | Supporting | Wave 2 — Complete |
| [recursive-integrity-audit/](recursive-integrity-audit/) | 5-Pass system audit — drift detection across all silos | Supporting | Wave 2 — Complete |

---

## Execution Notes

**Browser Scout Protocol** — requires Playwright runtime. Build `scout.js` before executing. Target: Google Maps scrape for logistics/hauling leads within 30-mile radius of Vallejo CA.

**Recursive Integrity Audit** — run at session start when system state is uncertain, or any time two consecutive failures trigger the Ground Truth Audit protocol. This workflow operationalizes the Zero-Inference Rule from `core/verification-rules.md`.

---

## Path Update Notice

The Recursive Integrity Audit references `agents/master_bio.md` in its PASS 3 check. This path is now deprecated. The correct path is `agents/identity/ARTHUR_MASTER_BIO.md`. The source file has been preserved as-is; the corrected path is documented in `recursive-integrity-audit/risks-and-limitations.md`.
