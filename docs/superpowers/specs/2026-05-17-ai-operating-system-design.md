# AI Operating System — Master Design Manifest
**Architect:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy
**EIN:** 84-4788578 | **DUNS:** 12-3035654
**Date:** 2026-05-17
**Status:** APPROVED — Active Execution

---

## 1. Mission

Centralize all AI capabilities, workflows, agents, tools, and institutional knowledge into a single navigable repository operating as a structured AI Operating System inside GeminiEcosystem.

**Non-goals:** Replace or relocate active live applications (ISE_Betting_Console, ISE_Health_Console, Prime_Pathwy_Turnover_System, gemini-app). All active apps remain in their original locations with zero path disruption.

---

## 2. Location & Migration Strategy

- **Path:** `GeminiEcosystem/ai-operating-system/`
- **Migration:** Copy — originals stay in place. No relative-path references broken.
- **Doc depth:** Template + auto-fill from source content. No placeholder boilerplate.
- **Import order:** Bottom-Up — skills documented individually before the master index is built.

---

## 3. Folder Architecture

```
ai-operating-system/
├── README.md
├── system-map.md                    ← Built last (Wave 4 completion)
├── core/                            ← Governing principles and execution rules
│   ├── README.md
│   ├── system-principles.md
│   ├── execution-protocol.md
│   ├── verification-rules.md
│   ├── prompting-standards.md
│   └── decision-frameworks.md
├── agents/                          ← Autonomous agent definitions by role
│   ├── README.md
│   ├── identity/                    ← Canonical identity assets
│   ├── researcher/
│   ├── marketing-engine/
│   ├── sportsbook-analyst/
│   ├── auditor/
│   └── frontend-builder/
├── skills/                          ← Imported AI skills by domain
│   ├── README.md
│   ├── engineering/
│   ├── research/
│   ├── frontend/
│   ├── marketing/
│   ├── automation/
│   └── archive/
├── workflows/                       ← Repeatable SOP sequences by vertical
│   ├── README.md
│   ├── betting/
│   ├── bidding/                     ← government_bid_SOP, grant_acquisition_SOP
│   ├── consulting/                  ← ELITE_10 framework + engine + master_pathwy
│   ├── finance/
│   ├── real-estate/                 ← TURNOVER_CHECKLIST
│   └── research/                    ← browser_scout_protocol, recursive_integrity_audit
├── templates/                       ← Reusable prompt, report, dashboard, SOP structures
│   ├── README.md
│   ├── prompts/
│   ├── reports/
│   ├── dashboards/
│   └── SOPs/
├── memory/                          ← Institutional knowledge and market intelligence
│   ├── README.md
│   ├── market-intelligence/         ← Dated intelligence reports (YYYY-MM-DD format)
│   ├── lessons-learned.md
│   ├── failed-experiments.md
│   ├── architecture-decisions.md
│   └── optimization-log.md
└── tools/                           ← Executable tools, scripts, and integrations
    ├── README.md
    ├── repomix/
    ├── vexor/
    ├── scripts/
    └── integrations/
```

---

## 4. Import Sequence — Bottom-Up Execution

### Wave 1 — Agents (this session)
| Asset | Classification | Destination |
|-------|---------------|-------------|
| research_agent.md | Foundational | agents/researcher/ |
| bid_architect.md | Foundational | agents/marketing-engine/ |
| betting_quant.md | Supporting | agents/sportsbook-analyst/ |
| ARTHUR_MASTER_BIO.md | Foundational (canonical) | agents/identity/ |
| master_bio.md | Deprecated | agents/identity/_deprecated-master_bio.md |

### Wave 2 — Workflows / SOPs
| Asset | Classification | Destination |
|-------|---------------|-------------|
| TURNOVER_CHECKLIST_TEMPLATE.md | Foundational | workflows/real-estate/ |
| government_bid_SOP.md | Foundational | workflows/bidding/ |
| grant_acquisition_SOP.md | Supporting | workflows/bidding/ |
| ELITE_10_CONSULTING_FRAMEWORK.md | Foundational | workflows/consulting/ |
| ELITE_10_ENGINE.md | Supporting | workflows/consulting/ |
| browser_scout_protocol.md | Supporting | workflows/research/ |
| master_pathwy.md | Foundational | workflows/consulting/ |
| recursive_integrity_audit.md | Supporting | workflows/research/ |

### Wave 3 — Tools
| Asset | Classification | Destination |
|-------|---------------|-------------|
| betting_engine/ | Foundational (reference) | tools/integrations/ |
| ooda_orchestrator.py | Experimental | tools/scripts/ |
| nepq_drafter.js | Supporting | tools/scripts/ |

### Wave 4 — Skills + Master Index
| Asset | Classification | Destination |
|-------|---------------|-------------|
| claude_skills_reference.md | Foundational | skills/engineering/ |
| COCKPIT_MANIFEST.md | Foundational | core/ |
| grant_scan_2026-04-25.md | Archive | memory/market-intelligence/ |
| system-map.md | Master Index | ai-operating-system/ root |

---

## 5. Per-Skill Doc Template — 5-File Standard

Every imported asset folder contains:

| File | Purpose |
|------|---------|
| `source.md` | Unmodified copy of original — never edited |
| `summary.md` | Classification, purpose, use cases, DSCR gate, dependencies |
| `setup.md` | [GROUND TRUTH GATE] + Exact Command + Pass Criteria + Error Map |
| `usage-examples.md` | Concrete activation patterns + anti-patterns |
| `risks-and-limitations.md` | Constraints, failure modes, conflict flags |
| `integration-map.md` | Upstream/downstream, Technical Key Trigger, redundancy flags |

**Deprecated assets:** `risks-and-limitations.md` only. No setup or usage docs written.

---

## 6. Identity Standard

| File | Status |
|------|--------|
| ARTHUR_MASTER_BIO.md | CANONICAL — single source of truth for all platforms |
| master_bio.md | DEPRECATED — flagged for deletion; integration-map documents reason |

---

## 7. Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Folders | kebab-case | sportsbook-analyst/ |
| Source copies | source.md | unchanged content |
| Doc files | lowercase-hyphenated | integration-map.md |
| Dated intelligence | YYYY-MM-DD-topic.md | 2026-04-25-grant-scan.md |
| Deprecated assets | _deprecated- prefix | _deprecated-master_bio.md |

---

## 8. Rule Zero — Active Across Every File in This Repository

1. **Zero-Hype filter** — Concrete and Steel assets only. No marketing language inside docs.
2. **Zero-Inference rule** — Never assume system state. Two failures = stop, request Ground Truth Audit.
3. **Owner field (global)** — Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy
4. **No AI attribution** — All authorship attributed to Arthur F. Appling Sr.
5. **[GROUND TRUTH GATE]** — Mandatory in every `setup.md` above the installation section.
6. **Technical Key Trigger** — Mandatory field in every `integration-map.md`.
7. **DSCR Gate** — Estimated output/input ratio documented in every `summary.md`.

---

## 9. Conflict & Redundancy Log (Detected During Design)

| Asset | Issue | Resolution |
|-------|-------|------------|
| ELITE_10_CONSULTING_FRAMEWORK.md + ELITE_10_ENGINE.md | Overlap in consulting logic | Both imported; integration-map documents relationship explicitly |
| ARTHUR_MASTER_BIO.md vs master_bio.md | Duplicate identity files | ARTHUR_MASTER_BIO.md canonical; master_bio.md deprecated |
| Root-level .md files vs agents/workflows/ copies | 9 files duplicated | Copy strategy; originals untouched |
| grant_scan_2026-04-25.md | Dated intelligence report, not a workflow | Routes to memory/market-intelligence/, not workflows/ |
