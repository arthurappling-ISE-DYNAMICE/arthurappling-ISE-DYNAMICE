# Elite 10 Engine — Sovereign Bid Acquisition System — Risks & Limitations
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Known Limitations

- **Cal eProcure SB/DVBE tier is locked** until CA Small Business certification is issued. This is the highest-value state pipeline — its activation is certification-dependent.
- **`/Scout` skill required for private sector track** — the private sector pipeline (property management companies in Solano County) requires the `/Scout` skill for automated lead scraping. Without it, prospecting is manual.
- **TypeScript and Python schemas are automation-ready, not deployed** — the technical layer exists as schema definitions only. A build step (bid tracking dashboard or automation script) is required to activate them.
- **Bid tracking is manual** — the Bid Pipeline Tracker in source.md is a static markdown table. There is no live data feed or automated status update.
- **GSA Advantage registration required** — federal micro-purchases require GSA Advantage vendor profile. If not yet registered, this pipeline source is inactive.
- **Private sector track deferred post-SBDC** — source.md notes `/Scout` activation is deferred until after the SBDC meeting (April 24, 2026 — now past). This track is now eligible for activation.

---

## Failure Modes

| Scenario | What Breaks | Mitigation |
|----------|-------------|------------|
| SB cert not renewed | Cal eProcure SB/DVBE filter deactivates; bids deprioritized | Calendar SB cert renewal — verify annually |
| Bid tracker not updated after cycle | Stale `lastChecked` dates; monitoring gaps accumulate | Update tracker immediately after each Monday/Thursday cycle |
| GSA Advantage profile inactive | Federal micro-purchase pipeline blocked | Complete GSA Advantage registration before Week 2 |
| `/Scout` not deployed | Private sector pipeline requires manual prospecting | Deploy `/Scout` skill or substitute manual Google Maps search |

---

## Deprecation Risk

**Low for pipeline sources.** SAM.gov, Cal eProcure, Solano County, City of Vallejo, and GSA Advantage are stable government procurement platforms. **Low-medium for schemas:** TypeScript/Python schemas are stable but may require updates if a bid tracking application is built that uses a different data model.

---

## Conflicts With

**Relationship with `elite-10-framework/`:** The ENGINE is a sub-component of the FRAMEWORK's Phase 2 Speed-to-Lead Engine. No conflict exists. If a contradiction appears between the two, the FRAMEWORK governs — it is the methodology doctrine; the ENGINE is the operational specification.

**Relationship with `workflows/bidding/government-bid-sop/`:** The SOP and the ENGINE cover overlapping federal pipeline territory. The SOP governs the submission process (how to submit). The ENGINE governs the sourcing strategy (where to look and in what order). Both are needed for a complete bid cycle.
