# Prime Pathwy CRM & Entity Enrichment Workflow
## Sovereign System Specification

### I. Institutional Standard & Aesthetic Alignment
In accordance with the **Prime Pathwy Sovereign Systems Architecture**, this workflow enforces an institutional-grade, zero-inference entity enrichment protocol. Every business entity processed through this engine must be systematically mapped across 27 distinct operational and metadata fields to ensure complete audit-readiness and chargeback defense.

The visual, operational, and database standards align with the Prime Pathwy institutional aesthetic:
* **Primary Color/Aesthetic Theme**: Matte Black (`#0B0B0B`) and Gold (`#C9A646`).
* **Systems over Labor**: Heavy reliance on automated, deterministic validation structures rather than manual assumptions.
* **Documentation over Assumption**: Every data point must be traceable to a public business registry, procurement portal, or verified public filing.

---

### II. The 27-Point Entity Enrichment Schema
To eliminate operational gaps, every lead or business record in the Prime Pathwy CRM is enriched according to the following comprehensive data schema:

| Field ID | Field Name | Data Type | Validation Rule / Standard | Example Value |
| :--- | :--- | :--- | :--- | :--- |
| **01** | Legal Business Name | String | Match state business registry exactly | Prime Pathwy LLC |
| **02** | DBA Names | String | List all registered "Doing Business As" names | Prime Pathwy Systems |
| **03** | Executive Names | String | Primary officers (CEO, President, CFO) | Arthur F. Appling Sr. |
| **04** | Ownership Structures | String | Corporate structure (LLC, S-Corp, C-Corp, JV) | Single-Member LLC |
| **05** | Decision-Makers | String | Target decision-makers with titles | Lead Technical Architect |
| **06** | Direct Business Phone | String | E.164 format; must pass HLR lookup | +1-510-555-0199 |
| **07** | Verified Public Emails | String | Must pass SMTP handshake verification | systems@primepathwy.com |
| **08** | Website URL | String | Fully qualified domain with HTTPS | https://www.primepathwy.com |
| **09** | LinkedIn Pages | String | Valid LinkedIn Company or Personal URL | https://linkedin.com/company/primepathwy |
| **10** | Physical Address | String | USPS-standardized address | 100 Pine St, San Francisco, CA 94111 |
| **11** | Industry Classification | String | Primary industry category | Industrial Systems Automation |
| **12** | NAICS Code | Integer | 6-digit North American Industry Classification | 541512 (Computer Systems Design Services) |
| **13** | SIC Code | Integer | 4-digit Standard Industrial Classification | 8742 (Management Consulting Services) |
| **14** | Estimated Employee Count| Integer | Verified headcount bracket | 15 (Sovereign Core Team) |
| **15** | Estimated Operational Scale| String | Revenue range based on public records | $1.5M - $5.0M |
| **16** | Regional Footprint | String | Geographic operational areas | Northern California (Bay Area, Solano County) |
| **17** | Vendor Dependencies | String | Core suppliers, logistics, and tech vendors | UPS Logistics, AWS, Twilio, Snowflake |
| **18** | Subcontracting Patterns | String | Common outsourced services | Specialized hardware fab, localized hauling |
| **19** | Probable Recurring Spend | String | Estimated monthly operational overhead | $45,000 / month |
| **20** | Probable Tech Stack | String | Software, infrastructure, and API stack | React, Tailwind, SQLite, Python, OpenAI API |
| **21** | Operational Pain Points | String | Identified workflow bottlenecks | Manual CRM data entry, fragmented contract tracking |
| **22** | AI Automation Opportunities| String | Targeted high-ticket AI system solutions | Automated CRM Enrichment Engine, Contract Parser |
| **23** | Recurring Revenue Potential| String | Monthly Retainer potential for Prime Pathwy | $5,000 - $15,000 / month |
| **24** | Lead Source | String | Source of initial lead ingestion | State Procurement Portal |
| **25** | Lead Status | String | Current pipeline stage | Active - Enriched |
| **26** | Last Enrichment Date | ISO Date | Timestamp of last successful enrichment run | 2026-05-28T12:00:00Z |
| **27** | Enrichment Integrity Hash | String | SHA-256 hash of critical record fields | a3f9b2d8c7e6... |

---

### III. Enrichment Engine Step-by-Step Workflow
The enrichment engine operates via a strict four-stage pipeline to ensure zero-inference integrity:

```
[1. INGESTION] ──► [2. PUBLIC REGISTRY MATCH] ──► [3. TECH & FINANCIAL PROFILING] ──► [4. INTEGRITY HASHING]
```

#### Step 1: Ingestion & Deduplication
* Import raw record from CSV, API, or manual entry.
* Clean and normalize string inputs (trim whitespace, lowercase emails, strip non-digits from phone numbers).
* Query existing SQLite database for exact matches on **Legal Business Name** or **Verified Public Email** to prevent duplicates.

#### Step 2: Public Registry & Corporate Structuring
* Query state business registries (e.g., California Secretary of State) using automated scraping or API lookup to verify **Legal Business Name**, **DBA Names**, **Ownership Structures**, and **Executive Names**.
* Cross-reference the SEC EDGAR database or OpenCorporates to confirm corporate standing and parent-subsidiary relationships.

#### Step 3: Digital Footprint & Technical Profiling
* Perform DNS lookups to verify domain existence and active mail servers (MX records).
* Analyze website technology stacks using tools like Wappalyzer or built-in header inspection (identifying **Probable Tech Stack**).
* Scrape LinkedIn Company pages to extract verified employee count ranges and executive profiles.

#### Step 4: Operational & Financial Modeling
* Map the business to its standard **NAICS** and **SIC** codes.
* Estimate operational scale and recurring spend using regional industry benchmarks (e.g., Solano Workforce Stability datasets).
* Identify specific operational pain points based on industry classification (e.g., logistics bottlenecks, legacy records systems).
* Calculate **Recurring Revenue Potential** using the Prime Pathwy High-Ticket Service Ladder.

#### Step 5: Validation & Integrity Hashing
* Compute a SHA-256 hash of the following combined fields: `Legal Business Name + Verified Public Email + USPS Address + NAICS Code`.
* Save this as the **Enrichment Integrity Hash** to act as a tamper-proof audit trail for future synchronization cycles.

---

### IV. Verification Protocols
To support audit-readiness and chargeback defense, the following validation rules must be met before a record is marked as `Active - Enriched`:
1. **SMTP Handshake**: Every email must return a `250 OK` status from the recipient mail server.
2. **Address Standardization**: Physical addresses must be validated against the USPS Address Database.
3. **NAICS Integrity**: The assigned NAICS code must exist within the official U.S. Census Bureau NAICS index.
4. **Phone Validation**: Phone numbers must be verified as active mobile or landline numbers using HLR (Home Location Register) queries.

---

### V. Operational Ingestion Manifest
This workflow is governed by the master enrichment ingestion script located at `/tools/crm_enrichment_engine.py`.
All temporary output and logs are routed to `/temporary/crm_enrichment_log.csv`.
Final enriched records are written directly to `/vault/crm/enriched_crm_database.csv`.
