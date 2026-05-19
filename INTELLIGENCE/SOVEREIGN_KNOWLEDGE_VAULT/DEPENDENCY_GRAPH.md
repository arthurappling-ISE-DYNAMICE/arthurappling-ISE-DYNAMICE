# DEPENDENCY GRAPH
**AA Capital INC dba Prime Pathwy — Sovereign Intelligence Vault**
**Classification:** Institutional Knowledge | Last Updated: 2026-05-18

---

## SYSTEM DEPENDENCIES

This document maps which operational systems rely on other systems or data structures to function correctly. If a parent node is modified, all dependent child nodes must be reviewed for compatibility.

### 1. AI WORKFLOW DEPENDENCIES

| AI Workflow | Dependent Data Source | Required Compliance Check |
|---|---|---|
| `BID_ANALYSIS_WORKFLOW.md` | `/government-intelligence/bid-language-patterns/` | Prevailing Wage, Insurance Minimums |
| `CONTRACT_SUMMARIZATION_WORKFLOW.md` | `/commercial-intelligence/property_lead_scoring_template.csv` | Indemnification limits |
| `EXECUTIVE_REPORTING_WORKFLOW.md` | `/finance-intelligence/cashflow/` | Bi-weekly budget constraints |

### 2. INTELLIGENCE DEPENDENCIES

| Intelligence Node | Dependent Data Source | Update Trigger |
|---|---|---|
| `COMPETITOR_MATRIX.md` | SAM.gov / USASpending.gov | Quarterly |
| `property_lead_scoring_template.csv` | County Assessor / Code Enforcement | Monthly |
| `acquisition_target_template.csv` | County Tax Collector / LoopNet | Bi-annually |

### 3. COMPLIANCE DEPENDENCIES

| Compliance Protocol | Dependent Operation | Enforcement Mechanism |
|---|---|---|
| `IIPP (Injury & Illness Prevention)` | All field operations | Cal/OSHA Audit |
| `Prevailing Wage Registration` | Government contract bidding | DIR eCPR system |
| `Hazardous Waste Manifests` | Debris/Cleanup operations | EPA / DTSC Audit |

---

## CRITICAL PATHWAYS

**The Bid Execution Pathway:**
`Government Procurement Intelligence` -> `AI Bid Analysis Workflow` -> `Compliance Checklist` -> `Estimating Model` -> `Executive Approval` -> `Submission`

**The Real Estate Acquisition Pathway:**
`Real Estate Intelligence Engine` -> `DSCR Financial Model` -> `Capital Allocation (SBA/Conventional)` -> `Executive Approval` -> `Acquisition`

**The Commercial Service Pathway:**
`Commercial Property Intelligence` -> `Competitor Matrix` -> `NEPQ Sales Agent Prompt` -> `Contract Summarization Workflow` -> `Execution`
