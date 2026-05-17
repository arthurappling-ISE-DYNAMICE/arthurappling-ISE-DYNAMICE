# ARCHITECTURE DECISIONS LOG (ADR)
**Prime Pathwy — Knowledge Management Layer**
*Sovereign AI Operating System*
*Last Updated: 2026-05-17*

---

## ADR 001: Adoption of the WAT Framework

**Date:** 2026-05-17
**Status:** Accepted
**Context:** The repository required a strict organizational structure to prevent data sprawl and ensure AI agents could reliably find required files.
**Decision:** All files must be categorized into Workflows (`/workflows`), Agents (`/agents`), Tools (`/tools`), or Temporary (`/temporary`).
**Consequences:** Ensures audit-readiness and clear separation of concerns (SOPs vs. Prompts vs. Code).

---

## ADR 002: CSV over JSON for Master Datasets

**Date:** 2026-05-17
**Status:** Accepted
**Context:** The system required a format for storing large intelligence datasets (Procurement, Grants, Market Leads).
**Decision:** Selected normalized CSV formats over JSON for all master databases.
**Consequences:** CSVs are natively readable by spreadsheet software (Excel/Sheets), easily parsed by Python/Pandas, and highly compressible. JSON is reserved for specific tool configurations (e.g., `betting_engine`).

---

## ADR 003: Subcontractor-First Grant Strategy

**Date:** 2026-05-17
**Status:** Accepted
**Context:** Research revealed that for-profit entities are ineligible for the majority of environmental and cleanup grants.
**Decision:** The system's grant intelligence layer is architected to identify *government and nonprofit recipients* of grants, positioning Prime Pathwy as the preferred vendor/subcontractor.
**Consequences:** Shifts marketing efforts from grant writing to B2G (Business-to-Government) relationship building.

---

## ADR 004: Local Owner-Operator Market Positioning

**Date:** 2026-05-17
**Status:** Accepted
**Context:** The NorCal facility maintenance market is saturated with national franchises.
**Decision:** The system's market intelligence layer focuses on identifying gaps where local, owner-operated, and government-certified (SB/DVBE/SLEB) firms have a competitive advantage.
**Consequences:** Directs lead generation efforts away from national accounts toward local property management firms and county governments.

---

## ADR 005: nflverse for Sports Analytics

**Date:** 2026-05-17
**Status:** Accepted
**Context:** Required a reliable, free, and comprehensive dataset for NFL quantitative analysis.
**Decision:** Utilized the `nfl-data-py` wrapper for the `nflverse` data repository.
**Consequences:** Provides access to highly accurate historical spreads, totals, and weather data without requiring paid API subscriptions.
