# tools/ — Executable Tools & Integrations
**Architect:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Purpose

Houses executable tools, automation scripts, and live system integrations. Tools in this folder have runtime dependencies (Node.js, Python, Bun) and are not prompt-based. Each tool is documented with the 5-file standard.

**Note:** Active live systems (ISE Betting Console, Prime Pathwy Turnover System) remain in their original locations in GeminiEcosystem. This folder holds references, scripts, and non-app tooling only.

---

## Subfolders

| Folder | Contents | Status |
|--------|----------|--------|
| integrations/ | References to live system integrations (betting engine, consulting wing) | Wave 3 — Pending |
| scripts/ | Standalone automation scripts (NEPQ drafter, OODA orchestrator) | Wave 3 — Pending |
| repomix/ | Repomix tooling for codebase packaging | Wave 4 — Pending |
| vexor/ | Vexor integration if activated | Wave 4 — Pending |

---

## Wave 3 Import Queue

| Asset | Classification | Destination | Notes |
|-------|---------------|-------------|-------|
| `betting_engine/` | Foundational (reference) | tools/integrations/ | Reference + doc only; live code stays at original path |
| `tools/ooda_orchestrator.py` | Experimental | tools/scripts/ | Not production-validated |
| `tools/nepq_drafter.js` | Supporting | tools/scripts/ | Sales script generator |

---

## Runtime Requirements

| Tool | Runtime | Port / Entry Point |
|------|---------|-------------------|
| Betting Engine | Node.js ≥20 | Port 3132 · `app.js` |
| OODA Orchestrator | Python ≥3.10 | `ooda_orchestrator.py` |
| NEPQ Drafter | Node.js ≥20 | `nepq_drafter.js` |

---

## Standards

Every tool in this folder requires a `setup.md` with a [GROUND TRUTH GATE] block. Tools classified as Experimental must include their validation status in `risks-and-limitations.md`.
