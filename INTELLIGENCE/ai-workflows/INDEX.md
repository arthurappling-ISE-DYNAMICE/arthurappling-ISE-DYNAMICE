# AI WORKFLOW LIBRARY — MASTER INDEX
**AA Capital INC dba Prime Pathwy — Sovereign Intelligence Vault**
**Classification:** AI Operational System | Last Updated: 2026-05-18

---

## DIRECTORY STRUCTURE

```
ai-workflows/
├── INDEX.md                                      ← This file
├── procurement/
│   └── BID_ANALYSIS_WORKFLOW.md                  ← RFP extraction & Go/No-Go logic
├── compliance/
│   └── CONTRACT_SUMMARIZATION_WORKFLOW.md        ← Legal risk extraction
├── executive-briefings/
│   └── EXECUTIVE_REPORTING_WORKFLOW.md           ← Weekly data synthesis
├── operations/                                   ← Operations management prompts
├── finance/                                      ← Financial analysis prompts
├── estimating/                                   ← Pricing & estimation logic
├── customer-service/                             ← Intake & support routing
├── sales/                                        ← NEPQ persuasion prompts
├── risk-analysis/                                ← Risk scoring models
├── sports-analytics/                             ← Betting/quant models
└── real-estate/                                  ← DSCR & property analysis
```

---

## WORKFLOW DEPLOYMENT RULES

1. **Zero-Inference:** AI models must not invent data. If data is missing from the input, the output must explicitly state "DATA MISSING".
2. **Deterministic Output:** All workflows use strict formatting templates (Markdown/JSON) to ensure output can be parsed by downstream systems.
3. **Human-in-the-Loop:** AI outputs for financial decisions, contract signatures, and bid submissions require human validation.

---

## CROSS-REFERENCES

- Sovereign OS Prompts → `/prompts/`
- AI Operating System Core → `/ai-operating-system/core/`
- Executable Python Tools → `/tools/`
