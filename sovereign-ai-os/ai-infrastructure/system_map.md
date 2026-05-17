# SYSTEM MAP
**Prime Pathwy — AI OS Infrastructure Layer**
*Sovereign AI Operating System*
*Last Updated: 2026-05-17*

---

## REPOSITORY ARCHITECTURE

The `arthurappling-ISE-DYNAMICE` repository is the central operating system for Prime Pathwy. It integrates multiple business lines (Consulting, Health, Betting, Logistics, Real Estate) into a single, automated intelligence engine.

The repository strictly adheres to the **WAT Framework**:
*   **Workflows** (`/workflows`): Markdown SOPs and execution scripts
*   **Agents** (`/agents`): AI prompts and persona definitions
*   **Tools** (`/tools`): Python/JS scripts and automation engines
*   **Temporary** (`/temporary`): Transient data and briefing logs

---

## CORE SYSTEM COMPONENTS

### 1. The Sovereign AI OS (Intelligence Layer)
**Location:** `/sovereign-ai-os/`
**Purpose:** The central intelligence vault built by the Sovereign Systems Agent.
**Sub-Systems:**
*   **Procurement Engine:** Tracks government bids, incumbents, and cycles (`/procurement`).
*   **Grant Engine:** Maps FEMA, EPA, and CalRecycle funding pathways (`/grants`).
*   **Market Intelligence:** Tracks NorCal competitors and B2B leads (`/market-intelligence`).
*   **Sports Analytics:** NFL quantitative betting datasets (`/sports-analytics`).
*   **Knowledge Management:** Institutional memory and SOPs (`/knowledge-management`).

### 2. ISE Health Console
**Location:** `/ISE_Health_Console/`
**Purpose:** Health and vitality tracking dashboard for the founder.
**Stack:** Node.js, Vite, React (implied by `node_modules`).
**Integration:** Feeds into the `04_Founder_Vitality` protocols.

### 3. ISE Betting Console & Quant Engine
**Location:** `/ISE_Betting_Console/` and `/tools/betting_engine/`
**Purpose:** Quantitative sports betting infrastructure.
**Key Files:**
*   `Canonical_Bet_History.json`: Master ledger of wagers.
*   `betting_quant.md` (Agent): Quantitative analysis prompt.

### 4. Consulting Wing (Elite 10)
**Location:** `/tools/consulting_wing/` and `/workflows/ELITE_10_CONSULTING_FRAMEWORK.md`
**Purpose:** High-ticket consulting infrastructure for $5,000+ system installations.
**Key Components:**
*   `sovereign-promo/`: Remotion-based video generation for marketing.
*   `consulting_elite_10.md`: Core consulting SOP.

### 5. Automation & Orchestration Tools
**Location:** `/tools/`
**Purpose:** Scripts that execute workflows automatically.
**Key Files:**
*   `ooda_orchestrator.py`: Python script for Observe, Orient, Decide, Act loops.
*   `nepq_drafter.js`: NEPQ-style persuasion drafting script.
*   `register_startup.ps1`: Windows PowerShell startup automation.

### 6. Core Agents
**Location:** `/agents/`
**Purpose:** Specialized AI personas for specific operational tasks.
**Key Files:**
*   `ARTHUR_MASTER_BIO.md`: Core identity constraint file.
*   `bid_architect.md`: Agent for drafting government bid responses.
*   `research_agent.md`: Agent for deep intelligence gathering.

---

## SYSTEM INTEGRATION FLOW

1.  **Input:** The `research_agent` gathers data and feeds it into the `/temporary` directory.
2.  **Processing:** `ooda_orchestrator.py` analyzes the data.
3.  **Action:** The `bid_architect` or `nepq_drafter` generates outputs based on the `/workflows` SOPs.
4.  **Storage:** Final intelligence is committed to the `/sovereign-ai-os` vault.
5.  **Execution:** Outputs are deployed via the `Consulting Wing` or direct procurement portals.

---

*This document serves as the high-level map of the Prime Pathwy ecosystem. For detailed dependency tracking, refer to `dependency_graph.md`.*
