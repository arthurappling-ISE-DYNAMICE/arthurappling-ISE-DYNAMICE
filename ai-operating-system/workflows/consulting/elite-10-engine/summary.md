# Elite 10 Engine — Sovereign Bid Acquisition System — Summary
**Classification:** Supporting
**Category:** Workflow / Bid Sourcing Operations
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy
**Last Updated:** 2026-05-17

---

## Purpose

Operational bid sourcing specification for the Speed-to-Lead engine installed inside Elite 10 Consulting client engagements. Defines 6 pipeline sources (federal, state, local, micro-purchase, private sector), contract thresholds, monitoring cadence, and the execution sequence ordered by speed to first dollar. Also contains TypeScript and Python data schemas for future automation of the bid tracking system.

This is the WHERE and HOW document for bid sourcing. For the overall consulting methodology, see `elite-10-framework/`. For the full 15-step delivery sequence, see `master-pathwy/`.

---

## Practical Use Cases

- Speed-to-Lead Engine installation: configuring a client's bid pipeline across all 6 sources
- Micro-purchase strategy: immediate cash flow via contracts under $10K (no bonding required)
- Cal eProcure SB/DVBE option activation after SB certification is issued
- Solano County and City of Vallejo vendor list registration (local preference advantage)
- GSA Advantage vendor registration for federal micro-purchases
- Bid pipeline tracker: monitoring cadence and threshold management per source
- TypeScript/Python schema: automation-ready bid record interfaces for future code integration

---

## Key Outputs

- Bid Pipeline Tracker: 6-source table with type, NAICS, threshold, and current status
- Execution Sequence: Week-by-week action plan ordered by speed to first dollar
- TypeScript interface definitions: `BidRecord`, `BidRepository`, `BidFilters`, `ApiResponse`
- Python dataclasses: `BidRecord`, `BidThreshold` — automation-ready
- Contact targets: Solano County Purchasing, City of Vallejo Purchasing, USPS Transportation

---

## Dependencies

- SB certification issued (unlocks Cal eProcure SB/DVBE tier — currently pending)
- SAM.gov registration active: EIN 84-4788578, NAICS 561720 + 562111 + 484110
- Cal eProcure account registered (free — register before SB cert is issued)
- GSA Advantage vendor registration (for federal micro-purchases)
- `/Scout` skill available (for private sector property management lead scraping)

---

## DSCR Gate

**Estimated Output/Input Ratio:** Variable by source and contract size.

Micro-purchase strategy (contracts under $10K) targets 2–4 awards/month = $15K–$40K immediate pipeline. No bonding required at this threshold — activation cost is near zero. This is the fastest path to first dollar while larger bids are in flight.
