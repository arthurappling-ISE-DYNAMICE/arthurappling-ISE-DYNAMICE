# ELITE 10 ENGINE — SOVEREIGN BID ACQUISITION SYSTEM
**Author:** Arthur F. Appling Sr. — Lead Technical Architect
**Entity:** AA Capital INC dba Prime Pathwy · EIN 84-4788578
**NAICS:** 561720 (Janitorial) · 562111 (Hauling) · 484110 (Freight)
**Classification:** Institutional Grade | Bid Sourcing Doctrine
**Version:** 1.0 | Active Deployment

> **Rule:** Target contracts you can win today. Scale to contracts you qualify for tomorrow.

---

## 1. FEDERAL PIPELINE (SAM.gov)
- **Portal:** sam.gov/search → Filter by NAICS 561720 / 562111 / 484110
- **Target:** Small Business Set-Aside contracts in CA / Northern CA / Solano County
- **Size sweet spot:** $25K–$250K — large enough to matter, small enough to win without bonding
- **Cadence:** Check Monday + Thursday — most solicitations post midweek
- **Key filter:** "SB Set-Aside" + "Active" + "California"

---

## 2. STATE PIPELINE (Cal eProcure)
- **Portal:** caleprocure.ca.gov → Bid Search → Category: Janitorial / Hauling
- **Strategy:** Filter for **"SB/DVBE Option"** contracts under $250K — these are reserved for certified SB vendors
- **Why it matters:** SB certification (Ledger Task #03) unlocks this entire tier
- **Immediate action:** Register on Cal eProcure now — even before SB cert is issued, get the account active
- **Target agencies:** Caltrans, CDCR, DGS, state universities in Northern CA

---

## 3. FEDERAL MICRO-PURCHASES (GSA / Agency P-Cards)
- **Threshold:** Under $10,000 — no formal bid required, agency buyers can issue directly
- **Strategy:** Get on agency vendor lists for janitorial supplies and small hauling jobs
- **Portal:** GSA Advantage — register as a vendor at gsaadvantage.gov
- **Target:** Federal facilities in Solano County / Vallejo corridor (Mare Island, Travis AFB area)

---

## 4. STATE & LOCAL PIVOT — THE "HOME FIELD" STRATEGY

### Source 1 — Cal eProcure (State)
- **Focus:** "SB/DVBE Option" contracts under $250K
- **Advantage:** SB certification gives preference weighting — you win on paper, not just price
- **Action:** Set up email alerts for NAICS 561720 and 562111 on Cal eProcure

### Source 2 — Solano County Purchasing
- **Portal:** solanocounty.com → Departments → Purchasing → Open Bids
- **Target:** Janitorial Services, Waste Hauling, Facility Maintenance
- **Contact:** Solano County Purchasing Division — call to get on the vendor notification list
- **Advantage:** Local preference — Vallejo address is a competitive edge for Solano County awards

### Source 3 — City of Vallejo Public Works
- **Portal:** cityofvallejo.net → City Hall → Finance → Purchasing
- **Target:** "Public Works" small-purchase thresholds — search for informal bid requests
- **Threshold:** City of Vallejo small purchase limit is typically $5K–$15K — no formal RFP required
- **Strategy:** Introduce Prime Pathwy directly to the Purchasing contact — ask to be added to the informal vendor list

### Micro-Purchase Strategy — Immediate Cash Flow
- **Target:** All contracts under $10K — city, county, and state agencies
- **Why:** No bonding required. No lengthy RFP process. Agency buyer can issue a PO same day.
- **Pitch:** "We are a certified local small business in Vallejo, NAICS 561720/562111, available for same-week service."
- **Goal:** 2–4 micro-purchase contracts per month = $15K–$40K immediate pipeline while larger bids are in flight

---

## 5. PRIVATE SECTOR BRIDGE (While Certifications Finalize)
- **Target:** Property management companies in Solano County (Vallejo, Benicia, Fairfield)
- **NAICS:** 561720 — turnover cleaning, post-eviction clean-outs, haul-away
- **Outreach:** `/Scout` skill — Playwright scan for property management companies in 30mi radius
- **Pitch anchor:** Fixed written quote. 2–3 day turnaround. Before/after photo documentation.

---

## BID PIPELINE TRACKER

| Source | Type | NAICS | Threshold | Status |
|--------|------|-------|-----------|--------|
| SAM.gov | Federal SB Set-Aside | 561720 / 562111 | $25K–$250K | Monitor 2x/week |
| Cal eProcure | State SB/DVBE Option | 561720 / 562111 | <$250K | Activate post-SB cert |
| Solano County | Local Open Bids | 561720 / 562111 | $5K–$100K | Call to register |
| City of Vallejo | Public Works Micro | 561720 / 562111 | <$15K | Contact Purchasing |
| GSA Advantage | Federal Micro-Purchase | 561720 / 484110 | <$10K | Register as vendor |
| Private (PM cos.) | Turnover / Haul-Away | 561720 / 562111 | $1K–$15K | `/Scout` after SBDC |

---

## TECHNICAL LAYER — Bid Schema Definitions
> Automation-ready types mirroring the tracker above. Human table is the source of truth; these types enforce it in code.

### TypeScript Interfaces

```typescript
type NaicsCode = '561720' | '562111' | '484110'

type BidSource =
  | 'sam_gov'
  | 'cal_eprocure'
  | 'solano_county'
  | 'city_of_vallejo'
  | 'gsa_advantage'
  | 'private'

type BidStatus =
  | 'monitoring'
  | 'pending_cert'
  | 'call_to_register'
  | 'contact_purchasing'
  | 'register_as_vendor'
  | 'scout_after_sbdc'
  | 'bid_submitted'
  | 'awarded'

interface BidThreshold {
  min: number
  max: number
}

interface BidRecord {
  readonly id: string
  source: BidSource
  type: string
  naics: NaicsCode[]
  threshold: BidThreshold
  status: BidStatus
  lastChecked?: string   // ISO 8601 date string
  notes?: string
}

interface BidFilters {
  naics?: NaicsCode
  source?: BidSource
  status?: BidStatus
  maxThreshold?: number
  state?: 'CA'
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}

interface BidRepository {
  findAll(filters?: BidFilters): Promise<ApiResponse<BidRecord[]>>
  findById(id: string): Promise<BidRecord | null>
  create(data: Omit<BidRecord, 'id'>): Promise<BidRecord>
  update(id: string, data: Partial<BidRecord>): Promise<BidRecord>
  delete(id: string): Promise<void>
}
```

### Python Dataclasses

```python
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Literal

NaicsCode = Literal['561720', '562111', '484110']

BidSource = Literal[
    'sam_gov',
    'cal_eprocure',
    'solano_county',
    'city_of_vallejo',
    'gsa_advantage',
    'private',
]

BidStatus = Literal[
    'monitoring',
    'pending_cert',
    'call_to_register',
    'contact_purchasing',
    'register_as_vendor',
    'scout_after_sbdc',
    'bid_submitted',
    'awarded',
]

@dataclass(frozen=True)
class BidThreshold:
    min: float
    max: float

@dataclass(frozen=True)
class BidRecord:
    id: str
    source: BidSource
    type: str
    naics: tuple[NaicsCode, ...]
    threshold: BidThreshold
    status: BidStatus
    last_checked: str | None = None   # ISO 8601 date string
    notes: str | None = None
```

---

## EXECUTION SEQUENCE (ordered by speed to first dollar)

1. **Week 1:** Call City of Vallejo Purchasing — ask to be added to informal vendor list
2. **Week 1:** Call Solano County Purchasing — register for bid notifications
3. **Week 2:** Register on Cal eProcure (free) — SB cert posts here when issued
4. **Week 2:** Run `/Scout` — pull Solano County property management leads
5. **Week 3:** Submit first informal bid (Vallejo or Solano County micro-purchase)
6. **Post-SB Cert:** Activate Cal eProcure SB/DVBE Option filter — bids reserved for you open up

---

## LINKED RESOURCES
- Consulting Framework: `workflows/ELITE_10_CONSULTING_FRAMEWORK.md`
- Government Bid SOP: `workflows/government_bid_SOP.md`
- Grant Acquisition SOP: `workflows/grant_acquisition_SOP.md`
- SB Cert Payload: `workflows/SB_CERT_PAYLOAD.md`
- Ledger: `workflows/MASTER_EXECUTION_LEDGER.csv`
