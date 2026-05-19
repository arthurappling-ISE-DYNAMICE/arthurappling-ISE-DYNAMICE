# DEPENDENCY GRAPH
**Prime Pathwy — AI OS Infrastructure Layer**
*Sovereign AI Operating System*
*Last Updated: 2026-05-17*

---

## SYSTEM DEPENDENCIES

This graph outlines the operational dependencies between workflows, agents, tools, and data within the Prime Pathwy ecosystem.

### 1. Government Procurement Dependencies
*   **Workflow:** `government_bid_SOP.md`, `grant_acquisition_SOP.md`
*   **Agent Required:** `bid_architect.md`
*   **Data Source:** `/sovereign-ai-os/procurement/procurement_master_registry.csv`
*   **Tool Required:** None (Manual submission via portal)
*   **External Dependency:** Active SAM.gov, Cal eProcure, or County Portal registration.

### 2. High-Ticket Consulting (Elite 10)
*   **Workflow:** `ELITE_10_CONSULTING_FRAMEWORK.md`, `consulting_elite_10.md`
*   **Agent Required:** `ARTHUR_MASTER_BIO.md` (Identity constraint)
*   **Tool Required:** `/tools/consulting_wing/sovereign-promo/` (Remotion video generator)
*   **External Dependency:** Node.js environment for Remotion rendering.

### 3. Quantitative Betting Engine
*   **Workflow:** None (Tool-driven)
*   **Agent Required:** `betting_quant.md`
*   **Tool Required:** `/tools/betting_engine/app.js`
*   **Data Source:** `/tools/betting_engine/Canonical_Bet_History.json`
*   **External Dependency:** Live odds API or manual data entry.

### 4. Client Intake & Persuasion
*   **Workflow:** `client_intake_script.md`
*   **Agent Required:** None
*   **Tool Required:** `nepq_drafter.js`
*   **Data Source:** `/market-intelligence/norcal_b2b_master_leads.csv`
*   **External Dependency:** None.

### 5. Sovereign System Automation
*   **Workflow:** `recursive_integrity_audit.md`
*   **Agent Required:** `research_agent.md`
*   **Tool Required:** `ooda_orchestrator.py`
*   **Data Source:** `/temporary/Daily_Intelligence_Briefing.md`
*   **External Dependency:** Python 3 environment.

---

## CRITICAL PATHS (Single Points of Failure)

1.  **Identity Constraint:** All outward-facing communication relies on the constraints defined in `ARTHUR_MASTER_BIO.md`. If this file is altered or ignored, the brand identity ("Prime Pathwy", Matte Black/Gold) is compromised.
2.  **Data Integrity:** The `ooda_orchestrator.py` script relies on accurate data in the `/temporary` directory. If the `research_agent.md` fails to format data correctly, the OODA loop breaks.
3.  **Compliance:** Government bidding (`government_bid_SOP.md`) requires the `SB_CERT_PAYLOAD.md`. Failure to maintain active SB/DVBE certification halts the primary revenue vector.

---

## RECOMMENDED UPGRADES

*   **API Integration:** The betting engine currently relies on local JSON files. Integrate a live sports data API.
*   **Automated Scraping:** Replace manual research with Python-based scraping tools for the procurement and market intelligence layers.
*   **CI/CD Pipeline:** Implement GitHub Actions to automatically run the `recursive_integrity_audit.md` on every commit.
