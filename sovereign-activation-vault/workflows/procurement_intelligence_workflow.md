# Prime Pathwy Live Procurement & Contract Intelligence Expansion
## Sovereign System Specification

### I. Strategic Objective
The procurement division of **Prime Pathwy** operates as a high-authority contract tracking and intelligence unit. Its primary mission is to identify, profile, and capture high-value municipal, state, and federal infrastructure modernization and recurring facilities contracts. 

By systematically tracking contract lifecycles, renewal cycles, incumbent weaknesses, and technological bottlenecks, the procurement engine enables Prime Pathwy to target incumbent vendors with precision and secure high-ticket sovereign installations.

---

### II. Comprehensive Contract Tracking Schema (13 Key Fields)
Every procurement opportunity is analyzed and recorded according to a standardized 13-point intelligence schema:

| Field ID | Field Name | Description / Validation Standard | Example Value |
| :--- | :--- | :--- | :--- |
| **01** | Issuing Agency | Government body, municipality, or state agency | Bay Area Air Quality Management District (BAAQMD) |
| **02** | Contract Value | Total award amount; must be verified via public filings | $1,250,000 |
| **03** | Incumbent Vendor | Current vendor holding the contract | Legacy Logistics Solutions Inc. |
| **04** | Renewal Timing | Exact expiration or renewal date of current contract | 2026-11-30 |
| **05** | Procurement Portal | URL to the official bid posting or procurement portal | https://www.baaqmd.gov/about-air-quality/rfp-rfq |
| **06** | Bid Windows | Start and end dates for new bid submissions | 2026-09-01 to 2026-10-15 |
| **07** | Submission Requirements| Explicit requirements (bonding, certifications, formats) | ISO 9001, BAAQMD VIP Certified, Matte Black Proposals |
| **08** | Contact Information | Direct email and phone of the contracting officer | procurement@baaqmd.gov |
| **09** | Contract Duration | Original duration plus available option years | 3 Years (with 2 x 1-Year Extensions) |
| **10** | Technology Indicators | Technical software/hardware systems currently utilized | Legacy On-Prem Oracle Database, Paper-based manifests |
| **11** | Operational Weaknesses | Identified bottlenecks, delays, or compliance gaps | Manual paper routing, 14-day delay in dispatch audits |
| **12** | Automation Opportunities| Specific AI/Automation integrations to solve weaknesses | Automated Manifest Parser, Sovereign Dispatch Database |
| **13** | Recurring Revenue Opps | Estimated annual recurring retainer value for Prime Pathwy| $120,000 / year (Retainer + API Maintenance) |

---

### III. The Procurement Intelligence Lifecycle
The tracking and pursuit of procurement opportunities follow a strict five-stage pipeline:

```
[1. IDENTIFICATION] ──► [2. INVENTORIAL AUDIT] ──► [3. REPLACEMENT TARGETING] ──► [4. PROPOSAL INGESTION] ──► [5. RETENTION]
```

#### Stage 1: Identification & Scraping
* Query state procurement databases (e.g., Cal eProcure), federal portals (SAM.gov), and municipal RFP listings.
* Filter contracts matching core Prime Pathwy domains: logistics, hauling, industrial services, records digitization, facilities management, and AI modernization.

#### Stage 2: Incumbent & Technological Audit
* Research the current contract holder (Incumbent Vendor).
* Audit their digital footprint, public complaints, or litigation history to identify operational weaknesses.
* Inspect their technology stack using DNS records, job postings, and public RFP documentation.

#### Stage 3: Replacement Targeting & Strategy
* Map out the replacement timeline (Renewal Timing).
* Formulate a "Sovereign System Modernization" proposal designed to solve the incumbent's weaknesses.
* Target the contracting officer and key decision-makers with NEPQ-style persuasion collateral.

#### Stage 4: Proposal Ingestion & Submission
* Draft high-authority, Matte Black and Gold proposal documents strictly conforming to the Issuing Agency's submission guidelines.
* Include clear ROI projections, zero-inference implementation timelines, and complete audit-readiness frameworks.

---

### IV. Procurement Renewal Forecasting Engine
To ensure Prime Pathwy is never late to a bid window, the system utilizes an automated renewal forecasting script located at `/tools/procurement_intelligence_engine.py`. 

This script:
1. Calculates the exact number of days remaining until the contract's renewal date.
2. Places opportunities into critical response tiers:
   * **Immediate Pursuit** (< 90 Days remaining): Active proposal development and direct outreach.
   * **Strategic Planning** (90–180 Days remaining): Technology audit and relationship mapping.
   * **Monitoring Phase** (> 180 Days remaining): Data enrichment and periodic check-ins.
3. Outputs active alerts and compiles them into `/temporary/procurement_alerts.json` for rapid ingestion.
