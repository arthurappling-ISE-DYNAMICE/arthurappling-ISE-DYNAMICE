# PRIME PATHWY — OSINT RELATIONSHIP & BUSINESS INTELLIGENCE VAULT
**Classification:** Sovereign Intelligence | Operational Use Only
**Compiled:** May 2026 | **Vault Section:** Relationship_Maps
**Version:** 1.0 | **Status:** Active

---

## SECTION 1 — INDUSTRY RELATIONSHIP MAPS

### 1.1 U.S. Government Contracting Ecosystem Map

```
FEDERAL GOVERNMENT PROCUREMENT ECOSYSTEM
=========================================

CONGRESS (Budget Authority)
    │
    ▼
OFFICE OF MANAGEMENT & BUDGET (OMB)
    │
    ├──► FEDERAL ACQUISITION REGULATORY COUNCIL (FAR Council)
    │       └── Publishes FAR/DFARS regulations
    │
    ├──► GENERAL SERVICES ADMINISTRATION (GSA)
    │       ├── Federal Acquisition Service (FAS)
    │       │   ├── Multiple Award Schedules (MAS)
    │       │   ├── OASIS+ (Professional Services)
    │       │   └── SEWP V (IT Products)
    │       └── Public Buildings Service (PBS)
    │           └── Facilities management contracts
    │
    ├──► SMALL BUSINESS ADMINISTRATION (SBA)
    │       ├── 8(a) Program
    │       ├── HUBZone Program
    │       ├── WOSB Program
    │       └── SDVOSB Program
    │
    └──► INDIVIDUAL AGENCIES (Contracting Officers)
            ├── DoD (Defense) — $400B+/year
            ├── DHS (Homeland Security) — $20B+/year
            ├── VA (Veterans Affairs) — $30B+/year
            ├── HHS (Health & Human Services) — $25B+/year
            ├── DOE (Energy) — $40B+/year
            ├── DOT (Transportation) — $15B+/year
            └── State/Local — $2T+/year
```

**Key Relationship Nodes for Prime Pathwy:**
- Contracting Officers (CO) — Authority to award contracts
- Contracting Officer Representatives (COR) — Day-to-day contract management
- Small Business Specialists — Facilitate set-aside opportunities
- Program Managers — Define requirements and scope
- Chief Information Officers (CIO) — Technology contract authority

---

### 1.2 Commercial Real Estate Ecosystem Map

```
COMMERCIAL REAL ESTATE ECOSYSTEM
=================================

INSTITUTIONAL INVESTORS (Pension funds, sovereign wealth funds)
    │
    ▼
PRIVATE EQUITY REAL ESTATE FIRMS
(Blackstone, Brookfield, Carlyle, KKR)
    │
    ├──► REITs (Public)
    │   ├── Industrial: Prologis, STAG, EastGroup
    │   ├── Office: Boston Properties, Vornado
    │   ├── Retail: Simon Property, Realty Income
    │   └── Data Centers: Equinix, Digital Realty
    │
    ├──► PROPERTY MANAGEMENT COMPANIES
    │   ├── CBRE (largest globally)
    │   ├── JLL (Jones Lang LaSalle)
    │   ├── Cushman & Wakefield
    │   └── Colliers International
    │
    └──► SERVICE VENDORS (Prime Pathwy Target Market)
        ├── Facilities Management: ABM, Aramark, Sodexo
        ├── Security: Allied Universal, Securitas
        ├── HVAC: Comfort Systems, Johnson Controls
        ├── Janitorial: ServiceMaster, Coverall
        ├── Landscaping: BrightView, TruGreen
        └── Technology: Various regional vendors
```

**Prime Pathwy Entry Strategy:**
Target the **Service Vendors** layer first (highest pain, lowest barrier), then use case studies to penetrate the **Property Management Companies** layer, then position for **REIT-level enterprise contracts**.

---

### 1.3 Logistics Ecosystem Map

```
GLOBAL LOGISTICS ECOSYSTEM
===========================

SHIPPERS (Manufacturers, Retailers, E-commerce)
    │
    ▼
FREIGHT BROKERS & 3PLs
(C.H. Robinson, Echo Global, Coyote Logistics)
    │
    ├──► ASSET-BASED CARRIERS
    │   ├── Full Truckload (FTL): J.B. Hunt, Werner, Schneider
    │   ├── Less-Than-Truckload (LTL): XPO, Old Dominion, Estes
    │   ├── Parcel: UPS, FedEx, USPS, Amazon
    │   └── Intermodal: J.B. Hunt, Hub Group
    │
    ├──► OCEAN FREIGHT
    │   ├── Maersk, MSC, CMA CGM, COSCO
    │   └── NVOCCs and freight forwarders
    │
    ├──► AIR FREIGHT
    │   ├── FedEx Express, UPS Air, DHL Express
    │   └── Air freight forwarders
    │
    └──► LAST-MILE DELIVERY
        ├── Amazon Logistics, Instacart, DoorDash
        ├── Regional carriers (OnTrac, LSO, Spee-Dee)
        └── Gig economy (Uber Freight, Convoy)
```

**Technology Stack Intelligence (Automation Gaps):**
- TMS (Transportation Management System): Many regional carriers use basic or no TMS
- WMS (Warehouse Management System): Many warehouses use spreadsheets
- ELD (Electronic Logging Device): Mandated but compliance varies
- Visibility platforms: Fragmented — major opportunity for unified intelligence

---

## SECTION 2 — VENDOR ECOSYSTEM INTELLIGENCE

### 2.1 Technology Vendor Ecosystem Map

**Tier 1 — Enterprise Platforms (Prime Pathwy Competes Against or Integrates With):**

| Platform | Category | Market Share | Integration Opportunity |
|---|---|---|---|
| Salesforce | CRM | 20%+ | High — API integration |
| ServiceNow | ITSM/Operations | 30%+ | High — workflow integration |
| SAP | ERP | 25%+ | Medium — data integration |
| Oracle | ERP/Database | 20%+ | Medium — data integration |
| Microsoft 365 | Productivity | 50%+ | Very High — native integration |
| Workday | HR/Finance | 15%+ | Medium — data integration |
| Coupa | Procurement | 15%+ | High — procurement integration |
| Procore | Construction | 40%+ | High — field operations |

**Tier 2 — Mid-Market Platforms (Prime Pathwy Displaces or Augments):**

| Platform | Category | Target Market | Weakness |
|---|---|---|---|
| QuickBooks | Accounting | SMB | No operations management |
| Jobber | Field Service | SMB | Limited AI capabilities |
| ServiceTitan | HVAC/Plumbing | SMB-Mid | Expensive, complex |
| Housecall Pro | Field Service | SMB | Limited compliance features |
| BuilderTrend | Construction | SMB-Mid | No AI automation |
| CoConstruct | Construction | SMB | Limited scale |
| FieldEdge | HVAC | SMB | Legacy platform |
| Connecteam | Field Workforce | SMB | Limited intelligence |

**Prime Pathwy Displacement Strategy:** Target businesses using Tier 2 platforms that have outgrown their capabilities. These businesses are actively looking for upgrades and have demonstrated willingness to pay for software.

---

### 2.2 Procurement Portal Vendor Ecosystem

**Procurement Intelligence Platforms:**

| Platform | Annual Cost | Best For | Data Coverage |
|---|---|---|---|
| SamSearch | $500–$5,000/year | AI-powered federal+SLED | 5,000+ sources |
| GovWin IQ | $15,000–$29,000/year | Enterprise BD teams | Deep federal+SLED |
| Bloomberg Government | $10,000–$25,000/year | Policy + contracting | Federal + policy |
| GovTribe | $2,000–$8,000/year | Federal + state | Federal + state |
| BidNet Direct | $1,000–$5,000/year | State + local | SLED focus |
| Periscope Holdings | $5,000–$15,000/year | State + local | SLED focus |
| Onvia | $3,000–$10,000/year | State + local | SLED focus |

**Recommended Prime Pathwy Stack:**
- SAM.gov (free) — federal monitoring
- SamSearch ($2,400/year) — AI-powered aggregation
- State portal direct monitoring (free) — targeted state markets

**Total Annual Cost:** ~$2,400 for comprehensive federal + state monitoring

---

## SECTION 3 — ECONOMIC INTELLIGENCE BY REGION

### 3.1 U.S. Regional Economic Intelligence

**Southeast Region (Primary Target):**

| State | GDP | Key Industries | Government Spending | Prime Pathwy Opportunity |
|---|---|---|---|---|
| Georgia | $750B+ | Logistics, film, tech | $50B+/year | Very High |
| Florida | $1.3T+ | Tourism, healthcare, defense | $80B+/year | Very High |
| North Carolina | $700B+ | Finance, tech, pharma | $45B+/year | High |
| South Carolina | $300B+ | Manufacturing, logistics | $25B+/year | High |
| Tennessee | $450B+ | Healthcare, logistics, auto | $30B+/year | High |
| Alabama | $280B+ | Aerospace, defense, auto | $25B+/year | High |

**Southwest Region (Secondary Target):**

| State | GDP | Key Industries | Government Spending | Prime Pathwy Opportunity |
|---|---|---|---|---|
| Texas | $2.4T+ | Energy, tech, defense | $150B+/year | Very High |
| Arizona | $500B+ | Tech, real estate, defense | $35B+/year | Very High |
| Nevada | $250B+ | Gaming, logistics, tech | $20B+/year | High |
| Colorado | $500B+ | Tech, aerospace, energy | $35B+/year | High |
| New Mexico | $120B+ | Defense, energy | $15B+/year | Moderate |

---

### 3.2 International Economic Intelligence

**UAE/Gulf Region:**

| Country | GDP | Key Sectors | Government Procurement | AI Readiness |
|---|---|---|---|---|
| UAE | $500B+ | Finance, logistics, tourism | $50B+/year | Very High |
| Saudi Arabia | $1T+ | Energy, construction, Vision 2030 | $150B+/year | High |
| Qatar | $200B+ | LNG, finance, infrastructure | $30B+/year | High |
| Kuwait | $150B+ | Oil, finance | $20B+/year | Moderate |
| Bahrain | $40B+ | Finance, logistics | $5B+/year | High |

**UAE Vision 2031 Intelligence:**
- $150B+ in infrastructure investment planned
- AI strategy targeting 25% of government services automated
- Smart city initiatives in Dubai and Abu Dhabi
- Digital economy target: 20% of GDP by 2031
- **Prime Pathwy Opportunity:** Premium pricing ($25K–$100K installations), low competition, high government procurement volume

**Singapore/ASEAN Intelligence:**

| Country | GDP | Key Sectors | Digital Readiness | Prime Pathwy Opportunity |
|---|---|---|---|---|
| Singapore | $500B+ | Finance, logistics, tech | Very High | High |
| Malaysia | $400B+ | Manufacturing, palm oil, tech | High | Moderate |
| Indonesia | $1.4T+ | Resources, manufacturing | Moderate | Moderate |
| Thailand | $600B+ | Tourism, manufacturing | Moderate | Moderate |
| Vietnam | $450B+ | Manufacturing, tech | Moderate | Moderate |
| Philippines | $450B+ | BPO, services | Moderate | Moderate |

---

## SECTION 4 — OSINT INTELLIGENCE COLLECTION PROTOCOLS

### 4.1 Business Intelligence Collection Sources

**Tier 1 — Free Public Sources:**

| Source | Data Type | Update Frequency | Strategic Value |
|---|---|---|---|
| SAM.gov | Federal contracts, vendor registrations | Daily | Very High |
| USASpending.gov | Federal spending, awards, contracts | Daily | Very High |
| SEC EDGAR | Public company filings, financials | Quarterly | High |
| LinkedIn | Executive contacts, company intelligence | Daily | Very High |
| Google News | Industry news, company announcements | Real-time | High |
| State procurement portals | State contracts, vendor lists | Daily | High |
| PACER (court records) | Litigation, bankruptcies | Daily | Moderate |
| OpenCorporates | Business registrations globally | Daily | High |
| Dun & Bradstreet (free tier) | Business credit, basic profiles | Monthly | Moderate |
| Crunchbase (free tier) | Startup/company funding | Monthly | Moderate |

**Tier 2 — Low-Cost Intelligence Sources:**

| Source | Annual Cost | Data Type | Strategic Value |
|---|---|---|---|
| SamSearch | $2,400 | Federal + SLED procurement | Very High |
| ZoomInfo (basic) | $5,000–$15,000 | B2B contact data | Very High |
| Apollo.io | $1,200–$5,000 | B2B contact + company data | Very High |
| Crunchbase Pro | $3,000 | Company funding, investors | High |
| PitchBook (limited) | $10,000+ | Private company data | High |
| Dun & Bradstreet | $5,000–$20,000 | Business credit, supply chain | High |

**Recommended Prime Pathwy Intelligence Stack (Annual Cost ~$10,000):**
- SAM.gov + USASpending.gov (free)
- SamSearch ($2,400)
- Apollo.io ($2,400)
- LinkedIn Sales Navigator ($1,200)
- Google Workspace (monitoring + alerts) ($1,200)
- State portal monitoring (free)
- Industry association memberships ($2,000)

---

### 4.2 Competitive Intelligence Collection Protocol

**Monthly Intelligence Gathering Routine:**

**Week 1 — Procurement Intelligence:**
- Review SAM.gov for new solicitations in target NAICS codes
- Review USASpending.gov for recent awards to competitors
- Check state portals for target state opportunities
- Update procurement database

**Week 2 — Competitor Intelligence:**
- Review competitor websites for new case studies, pricing, services
- Monitor LinkedIn for competitor hiring (signals of growth/weakness)
- Review Glassdoor for competitor culture/operational intelligence
- Update competitor database

**Week 3 — Market Intelligence:**
- Review industry publications (trade press, analyst reports)
- Monitor news for client industry developments
- Track regulatory changes affecting target industries
- Update market intelligence database

**Week 4 — Client Intelligence:**
- Review existing client performance metrics
- Identify expansion opportunities within current clients
- Monitor client news for growth/change signals
- Update client intelligence database

---

*Archive compiled by Prime Pathwy Sovereign Intelligence System | May 2026*
*All data sourced from public records, business directories, procurement portals, and verified industry sources*
