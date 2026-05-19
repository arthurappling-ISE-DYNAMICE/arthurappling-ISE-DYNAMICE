# USPS Logistics Identity — Standard Operating Procedure

---

```
═══════════════════════════════════════════════════════════════
  USPS LOGISTICS IDENTITY — SYSTEM OF RECORD
  Entity:   AA Capital INC dba Prime Pathwy
  EIN:      84-4788578  |  DUNS: 12-3035654
  Address:  425 Virginia St STE B, Vallejo, CA 94590
  NAICS:    491110 (Postal Service)  |  484110 (General Freight)  |  562111 (Hauling)
  Target:   San Francisco CA RPDC — 2501 Rydin Rd., Richmond, CA 94850
  Classification: Institutional Grade | Audit-Ready | Sovereign System
═══════════════════════════════════════════════════════════════
```

**Author:** Arthur F. Appling Sr. — Lead Technical Architect / Principal
**Business:** Prime Pathwy (AA Capital INC)
**Version:** 1.0 | Active Deployment
**Effective:** 2026-04-12

---

## Purpose

This document seals Prime Pathwy's identity as a USPS Logistics vendor. It provides the complete registration pathway, credential requirements, SCAC application instructions, NAICS alignment, and financial readiness framing needed to compete for USPS Regional Hauling Subcontract opportunities under the Delivering for America RPDC ground-transport network.

**Every field in this document reduces USPS transition risk by ensuring Prime Pathwy arrives at any solicitation fully documented, fully registered, and fully audit-ready.**

---

## Section 1 — NAICS Alignment for USPS Logistics

USPS solicitations for ground hauling and postal logistics may reference any of the following NAICS codes. Prime Pathwy must have all three listed in its SAM.gov profile to ensure maximum solicitation visibility.

| NAICS Code | Title | Relevance to USPS Work |
|---|---|---|
| **491110** | Postal Service | Identifies Prime Pathwy as a participant in the postal logistics supply chain; used for postal facility support contracts and USPS-adjacent service work |
| **484110** | General Freight Trucking, Local | Primary NAICS for Highway Contract Routes (HCR), terminal-to-terminal hauling, and RPDC-to-LPC ground transport — the core USPS subcontract category |
| **562111** | Solid Waste Collection / Hauling | Existing Prime Pathwy credential; supports waste logistics contracts and postal facility support hauling |

**Action:** Log in to SAM.gov and confirm all three NAICS codes are listed on the AA Capital INC entity profile. If 491110 or 484110 are missing, add them before any USPS solicitation response.

---

## Section 2 — USPS eSourcing & Supplier Registration Checklist

USPS uses two parallel systems for logistics vendor management:
1. **SAM.gov** — federal registration, required for all government contracting
2. **USPS Supplier Portal / eSourcing** — USPS-specific vendor registration and RFQ response system

Complete both in order. SAM.gov must be active before USPS eSourcing registration.

---

### 2A — SAM.gov Registration Verification (Pre-Condition)

- [ ] Log in to [sam.gov](https://sam.gov) using registered account for AA Capital INC
- [ ] Confirm entity status: **Active** (not Expired, not Pending Renewal)
- [ ] Verify EIN `84-4788578` is the primary tax identifier on file
- [ ] Verify DUNS `12-3035654` and confirm UEI (Unique Entity Identifier) has been assigned — DUNS was replaced by UEI; both may appear, UEI is the current standard
- [ ] Confirm all three NAICS codes are listed: **491110, 484110, 562111**
- [ ] Confirm mailing address: `425 Virginia St STE B, Vallejo, CA 94590`
- [ ] Confirm business type: Small Business (check size standard — 484110 threshold is $34M annual revenue; Prime Pathwy qualifies)
- [ ] Confirm no exclusion / debarment flag on entity record
- [ ] Download and save the SAM.gov entity registration PDF — attach to all bid packages

---

### 2B — PS Form 5436 Submission (Transportation Solicitation List)

**This is the most time-sensitive action.** PS Form 5436 places Prime Pathwy on the USPS Transportation Contracts mailing list — ensuring Prime Pathwy receives solicitation notices when HCR and terminal hauling routes for the Richmond RPDC corridor go live.

**Steps:**
1. Download PS Form 5436 from: `https://about.usps.com/forms/ps5436.pdf`
2. Complete all fields:
   - Company Name: AA Capital INC dba Prime Pathwy
   - EIN: 84-4788578
   - Address: 425 Virginia St STE B, Vallejo, CA 94590
   - Service type: Highway Contract Routes (HCR) / Terminal-to-Terminal Hauling
   - Geographic area: Northern California — Solano County, Contra Costa County, Alameda County, San Francisco, Marin County
   - NAICS: 484110
3. Submit to: USPS Transportation Contracts (address on form)
4. Log submission in `logs/usps_submissions.md` with date and confirmation

---

### 2C — USPS Supplier Portal Registration

- [ ] Navigate to the USPS Supplier / Vendor registration portal via `about.usps.com/what/business-services/suppliers/becoming/`
- [ ] Register AA Capital INC as a new supplier — use EIN `84-4788578` as primary identifier
- [ ] Select commodity category: **Transportation & Logistics / Ground Freight**
- [ ] Upload the following documents during registration:
  - SAM.gov active registration confirmation (PDF)
  - Certificate of Incorporation / Business Registration (AA Capital INC)
  - NAICS certification (491110, 484110, 562111)
  - Insurance certificates (when obtained — see Compliance Matrix)
- [ ] Complete the Supplier Diversity profile — designate as Small Business; assess and enter any applicable minority/disadvantaged business certifications
- [ ] Save supplier portal login credentials to secure credential vault — do not store in plaintext

---

### 2D — USPS eSourcing (RFQ / Solicitation Response System)

Once supplier registration is complete, USPS will issue RFQ (Request for Quotation) invitations through its eSourcing platform for active solicitations.

- [ ] Confirm eSourcing access is enabled on the supplier account
- [ ] Set up email notifications for new RFQs in the following categories:
  - Highway Contract Routes (HCR)
  - Terminal-to-Terminal Hauling
  - Regional Processing and Distribution Center (RPDC) Support
  - Ground Transport — Northern California
- [ ] Monitor SAM.gov simultaneously for any USPS logistics solicitations published outside the eSourcing portal (some HCR routes post to SAM.gov directly)
- [ ] Target solicitation area: San Francisco CA RPDC — 2501 Rydin Rd., Richmond, CA 94850 and all LPCs it serves (Oakland, San Francisco, Petaluma, San Jose, Eureka)

---

## Section 3 — SCAC Code Application (Standard Carrier Alpha Code)

A SCAC code is a unique 2–4 letter identifier assigned to transportation companies by the **National Motor Freight Traffic Association (NMFTA)**. USPS requires a valid SCAC for all contracted trucking and hauling vendors. This is non-negotiable for HCR and terminal-to-terminal hauling contracts.

### What the SCAC Does

- Identifies Prime Pathwy as a registered motor carrier in federal logistics systems
- Required on all USPS Bills of Lading and freight documentation
- Validates carrier identity in transportation management systems (TMS)
- Signals institutional-grade operations to procurement officers

### SCAC Application — Step-by-Step

**Step 1 — Gather Required Information**

Before starting the application, have the following ready:
- Legal company name: AA Capital INC dba Prime Pathwy
- Business address: 425 Virginia St STE B, Vallejo, CA 94590
- EIN: 84-4788578
- FMCSA Motor Carrier (MC) number — *obtain this first if not yet active (see Step 2 below)*
- DOT number (USDOT) — obtain from FMCSA if not yet active
- Contact: Arthur F. Appling Sr., Lead Technical Architect / Principal
- Email: `contact@primepathwy.com` (or `operations@primepathwy.com` when active)

**Step 2 — FMCSA Operating Authority (Prerequisite)**

If not already obtained, apply for FMCSA Motor Carrier authority before the SCAC application:
1. Go to: `https://portal.fmcsa.dot.gov/URS/` (Unified Registration System)
2. Register for a USDOT number and MC number
3. Select operating authority type: **For-Hire Motor Carrier, Property**
4. Pay application fee (~$300)
5. Allow 20–25 business days for processing
6. Once MC number is issued, post the required $750,000 minimum cargo liability bond (Form BMC-84) or trust fund agreement (Form BMC-85)
7. Obtain Federal filing of insurance (Form MCS-90 endorsement from insurance carrier)

**Step 3 — Apply for SCAC at NMFTA**

1. Go to: `https://www.nmfta.org/pages/scac`
2. Select: **Apply for a New SCAC Code**
3. Complete the online application form:
   - Company legal name: AA Capital INC dba Prime Pathwy
   - Business type: For-Hire Motor Carrier / Trucking
   - EIN: 84-4788578
   - USDOT / MC Number: [enter when obtained]
   - Operating states: California (primary); multi-state if applicable
4. Choose your SCAC code — NMFTA will suggest available codes; request a code that represents the business (e.g., PMPW, PPWY, AACX — 2 to 4 characters)
5. Pay the annual fee: **~$69/year** (renewed annually — calendar the renewal date)
6. NMFTA processes within 5–10 business days
7. SCAC code is issued via email — save immediately to credential vault

**Step 4 — Register SCAC in USPS Systems**

Once issued:
- Add SCAC code to USPS Supplier Portal profile
- Include SCAC on all USPS freight documentation, BOLs, and proposal packages
- Print SCAC on company letterhead and capability statement

**SCAC Renewal:** Annual. Set a calendar reminder 30 days before expiration. A lapsed SCAC disqualifies Prime Pathwy from active USPS hauling contracts.

---

## Section 4 — Pro-Forma Revenue Statement (3-Year Revenue Question)

USPS solicitations and supplier qualification forms frequently ask for 3-year revenue history. As an emerging Sovereign System, Prime Pathwy answers this question through the AA Capital INC corporate structure, framing financial readiness through capital position, infrastructure investment, and operational trajectory — not backward-looking revenue averages.

### Framing Principle

> Prime Pathwy does not compete on historical revenue. Prime Pathwy competes on **institutional readiness** — the documented systems, legal infrastructure, and operational architecture that eliminate transition risk for the USPS ground network. Revenue history is a proxy for reliability. Our proxy is verifiable: published legal compliance documents, registered federal credentials, and a Sovereign System model built for audit-grade performance from day one.

### Pro-Forma Statement Template

Use this as the basis for any revenue/financial history field in USPS applications:

---

**PRIME PATHWY — FINANCIAL READINESS STATEMENT**
*AA Capital INC dba Prime Pathwy | EIN: 84-4788578*
*Prepared by: Arthur F. Appling Sr., Lead Technical Architect / Principal*
*Date: 2026-04-12*

Prime Pathwy (AA Capital INC) is an emerging logistics and hauling operator entering the USPS Regional Hauling Subcontractor pipeline as part of the Delivering for America ground-network expansion.

**Revenue Position:**
As an early-stage operator targeting the October 2026 RPDC ground-transport ramp, Prime Pathwy presents the following financial readiness profile in lieu of a 3-year revenue history:

| Financial Indicator | Status |
|---|---|
| Legal Entity | AA Capital INC (California Corporation) — dba Prime Pathwy |
| EIN | 84-4788578 — active, IRS-registered |
| SAM.gov Status | Active (verify current) |
| Capital Structure | Founder-capitalized; no outstanding liens or delinquencies |
| Revenue History | Pre-revenue / Early operations — 2024–2026 launch phase |
| Projected Y1 Revenue (USPS Contract) | [Insert projected run revenue based on specific route award] |
| Projected Y2 Revenue | [Insert] |
| Projected Y3 Revenue | [Insert] |
| Bonding Capacity | [Insert surety bond amount when obtained] |
| Insurance Position | Commercial General Liability + Commercial Auto (in procurement — see Compliance Matrix) |

**Compensating Factors:**

1. **Institutional Legal Infrastructure:** Prime Pathwy operates with a published Privacy Policy (CCPA-compliant), ADA/WCAG 2.1 Accessibility Statement, and Terms of Service — all effective April 12, 2026. This level of documented compliance is atypical for emerging logistics operators and demonstrates the institutional maturity required for USPS audit-grade performance.

2. **Federal Registration Completeness:** SAM.gov registration, EIN confirmation, and DUNS/UEI on file — all credentials are verifiable and current.

3. **Zero Liability Exposure:** No outstanding tax liens, legal judgments, debarment flags, or regulatory violations on record for AA Capital INC or Prime Pathwy.

4. **System-of-Record Operational Model:** Prime Pathwy's core operating principle is 100% documentation on every engagement — signed work orders, photo documentation, completion sign-off, and 3-year record retention. Applied to USPS hauling, this means every load, every run, every delivery is documented, traceable, and audit-ready without prompting. This directly reduces USPS's transition risk from air-cargo reliance to ground-network accountability.

5. **Geographic Position:** Vallejo, CA (Solano County) — 27 miles from San Francisco CA RPDC at 2501 Rydin Rd., Richmond, CA 94850. Prime Pathwy is positioned inside the direct service corridor for the North Bay LPC network.

**Bank / Financial Reference:** [Insert banking institution and account officer name when established — do not include account numbers in any submission]

---

*This statement is submitted as a good-faith representation of Prime Pathwy's financial readiness and operational capability. AA Capital INC invites USPS procurement officers to verify all federal registrations and contact Arthur F. Appling Sr. directly for any supplemental financial documentation.*

*Arthur F. Appling Sr.
Lead Technical Architect / Principal
AA Capital INC dba Prime Pathwy
425 Virginia St STE B, Vallejo, CA 94590
contact@primepathwy.com*

---

## Section 5 — USPS Logistics Identity Quick-Reference Card

```
╔══════════════════════════════════════════════════════════════╗
║          PRIME PATHWY — USPS LOGISTICS IDENTITY             ║
╠══════════════════════════════════════════════════════════════╣
║  Entity:     AA Capital INC dba Prime Pathwy                ║
║  EIN:        84-4788578                                     ║
║  DUNS:       12-3035654                                     ║
║  Address:    425 Virginia St STE B, Vallejo CA 94590        ║
╠══════════════════════════════════════════════════════════════╣
║  NAICS:      491110 | 484110 | 562111                       ║
║  SCAC:       [PENDING — apply at nmfta.org]                 ║
║  MC Number:  [PENDING — apply at fmcsa.dot.gov]             ║
║  USDOT:      [PENDING — apply at fmcsa.dot.gov]             ║
╠══════════════════════════════════════════════════════════════╣
║  Target RPDC: San Francisco CA RPDC                         ║
║               2501 Rydin Rd., Richmond, CA 94850            ║
║               ~27 miles from Vallejo HQ                     ║
╠══════════════════════════════════════════════════════════════╣
║  eSourcing:   usps.com supplier portal                      ║
║  SAM.gov:     sam.gov (UEI — verify active)                 ║
║  PS 5436:     Submit ASAP — get on solicitation list        ║
╠══════════════════════════════════════════════════════════════╣
║  Contact:    Arthur F. Appling Sr.                          ║
║              Lead Technical Architect / Principal           ║
╚══════════════════════════════════════════════════════════════╝
```

---

*Prime Pathwy — A System of Record for the USPS Ground Network.*
*Arthur F. Appling Sr. | Lead Technical Architect / Principal*
