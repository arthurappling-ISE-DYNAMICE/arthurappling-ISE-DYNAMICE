# ARCHITECTURE OVERVIEW
**Prime Pathwy — AI OS Infrastructure Layer**
*Sovereign AI Operating System*
*Last Updated: 2026-05-17*

---

## SYSTEM ARCHITECTURE

The Sovereign AI Operating System is a hybrid intelligence infrastructure combining local repository management, automated scripting, and AI agent orchestration. It is designed for maximum durability, audit-readiness, and operational leverage.

### 1. Data Layer (The Vault)
The data layer consists of normalized CSV databases and structured Markdown files. This layer is designed to be machine-readable, ensuring that future AI agents and automation pipelines can easily parse the intelligence.

**Key Components:**
*   `/procurement/procurement_master_registry.csv`
*   `/grants/sovereign_grant_master_database.csv`
*   `/market-intelligence/norcal_b2b_master_leads.csv`
*   `/sports-analytics/nfl_quant_master_dataset.csv`

### 2. Logic Layer (Workflows & Tools)
The logic layer dictates *how* the data is processed and acted upon. It combines human-readable SOPs with executable code.

**Key Components:**
*   **Workflows (`/workflows`):** Markdown files defining the step-by-step execution protocols (e.g., `government_bid_SOP.md`).
*   **Tools (`/tools`):** Python, JavaScript, and PowerShell scripts that automate the workflows (e.g., `ooda_orchestrator.py`, `nepq_drafter.js`).

### 3. Agent Layer (Prompts)
The agent layer consists of specialized AI personas designed to execute specific tasks within the logic layer.

**Key Components:**
*   **Identity (`ARTHUR_MASTER_BIO.md`):** The foundational constraint file that ensures all outputs align with the Prime Pathwy brand (Matte Black/Gold, institutional grade).
*   **Specialists (`/agents`):** Task-specific prompts (e.g., `bid_architect.md` for procurement, `betting_quant.md` for sports analytics).

### 4. Interface Layer (Consoles)
The interface layer provides human-readable dashboards and interactive environments for the founder.

**Key Components:**
*   **Health Console (`/ISE_Health_Console`):** Vitality tracking.
*   **Betting Console (`/ISE_Betting_Console`):** Quantitative sports analysis.

---

## DESIGN PRINCIPLES

1.  **Zero-Inference:** The system does not guess. If data is missing, the process halts, and a Ground Truth Audit is requested.
2.  **Audit-Readiness:** Every action, decision, and output must be documented and defensible against chargebacks or scrutiny.
3.  **Systems Over Labor:** The architecture prioritizes automated workflows and machine-readable data over manual effort.
4.  **Institutional Grade:** The aesthetic and tone of all outputs must reflect a high-authority, $5,000+ consulting firm.

---

## FUTURE EXPANSION

The architecture is designed to be modular. Future expansions should focus on:
*   **API Integrations:** Connecting the data layer to live feeds (e.g., SAM.gov API, sports odds APIs).
*   **Automated Scraping:** Replacing manual research with scheduled Python scrapers.
*   **Web Deployments:** Moving the local consoles (Health, Betting) to secure web environments.
