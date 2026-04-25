# Sovereign Grant Acquisition Engine — Standard Operating Procedure

---

```
═══════════════════════════════════════════════════════════════
  SOVEREIGN GRANT ACQUISITION ENGINE — STANDARD OPERATING PROCEDURE
  Entity:  Arthur F. Appling Sr. / Prime Pathwy
  EIN:     84-4788578  |  DUNS: 12-3035654
  Address: 425 Virginia St STE B, Vallejo, CA 94590
  NAICS:   561720 (Janitorial Services)  |  562111 (Hauling)  |  484110 (General Freight)  |  491110 (Postal Service)
  Classification: Institutional Grade | Audit-Ready | WAT Framework
═══════════════════════════════════════════════════════════════
```

**Author:** Arthur F. Appling Sr. — Lead Technical Architect
**Business:** Prime Pathwy
**Version:** 1.0 | Active Deployment
**Effective:** 2026-04-12

---

## Step 1 — System Objective

**What this engine does:** The Sovereign Grant Acquisition Engine enables Arthur F. Appling Sr. to identify, qualify, and apply for California State and Federal Small Business grants that fund operational expansion, workforce development, and community infrastructure — from the Cockpit, with zero duplicate effort.

**Primary Targets:**
- California State Grants — grants.ca.gov (Cal OES, CalRecycle, CDFA, GO-Biz)
- Federal Small Business Grants — SBA.gov, Grants.gov (NAICS 561720 / 562111 / 484110 eligible programs)
- **USPS eSourcing & Logistics Portal** — USPS non-dilutive logistics contracts and subcontract opportunities (NAICS 484110 / 491110); target: San Francisco CA RPDC at 2501 Rydin Rd., Richmond CA 94850
- Minority Business Development Agency (MBDA) grant programs
- Environmental Workforce Development grants (EPA Region 9 — covers Solano County)
- DOT Small Business Transportation Resource Center (SBTRC) — logistics and transportation-specific grant programs for NAICS 484110 operators

**Winning Definition:** A submitted, complete grant application that positions Prime Pathwy as a Sovereign System Integration provider — not a labor vendor — operating in an underserved community with documented operational infrastructure.

**Out of Scope:** Loans, lines of credit, venture funding, or grants requiring a 501(c)(3) designation. Grant programs with matching requirements exceeding current operational budget are LOW PRIORITY.

---

## Step 2 — Eligibility Phase

**Credential Plate (must be confirmed before any grant activity):**

| Field | Value |
|---|---|
| Entity | Arthur F. Appling Sr. / Prime Pathwy |
| EIN | 84-4788578 |
| DUNS | 12-3035654 |
| Address | 425 Virginia St STE B, Vallejo, CA 94590 |
| NAICS | 561720 (Janitorial) \| 562111 (Hauling) |
| Business Designation | Small Business / Minority-Owned |
| Jurisdiction | Vallejo, CA — City of Vallejo, Solano County, State of California |

**Identity Verification Checklist** *(run before every application — no exceptions):*

- [ ] EIN `84-4788578` confirmed active with IRS (verify via IRS online tools or EIN confirmation letter)
- [ ] DUNS `12-3035654` confirmed active on SAM.gov — not expired, not under review
- [ ] Business address `425 Virginia St STE B, Vallejo, CA 94590` matches all registered records
- [ ] NAICS 561720 and 562111 both listed on SAM.gov entity profile
- [ ] Small Business designation is active — not lapsed
- [ ] California Secretary of State registration is current
- [ ] No outstanding tax liens or delinquencies (state or federal)

**Eligibility Decision Logic:**

```
IF Grant requires Small Business designation
  AND entity is registered at SAM.gov with active DUNS
  AND NAICS 561720 or 562111 matches grant category
  → STATUS: ✦ GREEN — ELIGIBLE TO APPLY ✦

IF Grant requires Minority-Owned certification (MBE/DBE)
  AND certification is not yet obtained
  → STATUS: ⚠ YELLOW — PURSUE CERTIFICATION FIRST. Document intent.

IF Grant requires 501(c)(3) nonprofit status
  → STATUS: ✗ RED — DISQUALIFY. Not applicable to Prime Pathwy.

IF Matching funds required exceed available operating budget
  → STATUS: ⚠ LOW PRIORITY — Flag and defer until capital position improves.
```

---

## Step 3 — Digital Presence Compliance Package

Grant auditors for California State and Federal programs verify that applicants maintain a legitimate, accessible digital presence. The following documents serve as Prime Pathwy's **required legal evidence** for the Digital Presence portion of all grant applications.

**Compliance Document Registry:**

| Document | File | Standard | Status |
|---|---|---|---|
| Privacy Policy (CCPA) | `Prime_Pathwy_Turnover_System/privacy.html` | California Consumer Privacy Act | ✅ Live — 2026-04-12 |
| ADA / WCAG 2.1 Accessibility Statement | `Prime_Pathwy_Turnover_System/accessibility.html` | ADA Title III / WCAG 2.1 Level AA | ✅ Live — 2026-04-12 |
| Terms of Service | `Prime_Pathwy_Turnover_System/terms.html` | No Verbal Order Rule / Master Pathwy | ✅ Live — 2026-04-12 |

**Digital Presence Checklist** *(required for grant applications — confirm before submission):*

- [ ] `privacy.html` is accessible and loads correctly — submit URL or local path as evidence
- [ ] `accessibility.html` explicitly cites WCAG 2.1 Level AA compliance — use as ADA compliance evidence
- [ ] Privacy Policy confirms data is not sold to third parties — required for California grants under AB 375
- [ ] Accessibility Statement cites color contrast ratios — Matte Black `#050505` + Gold `#F5D98A` exceeds 4.5:1 WCAG minimum
- [ ] Both pages carry `Arthur F. Appling Sr. — Executive Principal` byline — confirms operational accountability
- [ ] `contact@primepathwy.com` is the listed contact *(update to `operations@primepathwy.com` when Namecheap email is live)*

**Where to attach in grant applications:**
- Digital Presence / Website section → link or attach `accessibility.html`
- Privacy Practices / Data Handling section → link or attach `privacy.html`
- Legal & Compliance section → attach all three as a combined Legal Infrastructure PDF

---

## Step 4 — Community Sovereignty Narrative

Every grant application requires a narrative section. Prime Pathwy's narrative is not a vendor pitch — it is a **Community Sovereignty Statement**. Use this framework for all grant narrative fields.

### The Problem Frame (NEPQ Gap Building)

**Current State — The Labor-Only Model:**

> California's waste management and property turnover sector is dominated by informal labor arrangements — no documentation, no accountability, no system. Municipal property managers and housing agencies routinely face:
>
> - **Unverifiable work records** — no before/after documentation, no proof of scope completion
> - **No-show labor** — jobs abandoned mid-completion with no recourse
> - **Compliance exposure** — no signed work orders, no audit trail for liability disputes
> - **Management overhead** — supervisors spending hours coordinating workers instead of managing outcomes
>
> This is not a labor shortage. This is a **systems failure**. The market has optimized for cheap and fast at the cost of reliable and defensible.

**The Implication Layer:**

> The cost of this failure falls disproportionately on underserved communities. In cities like Vallejo — where property turnover rates are high, landlord accountability is under scrutiny, and municipal budgets are strained — unreliable waste and turnover services directly contribute to blight, health code violations, and reduced tax base. When a unit sits vacant longer than it should because a vendor failed, a family loses housing. When a haul-out is undocumented, a disputed liability claim costs the agency thousands.

**The Sovereign System Solution:**

> Prime Pathwy does not sell labor. Prime Pathwy installs a **Sovereign System** — a self-managing, fully documented service operation that produces an institutional audit trail on every job. Every engagement generates:
>
> - A signed written work order (No Verbal Order Rule — enforced without exception)
> - Before and after photo documentation (Master Pathwy SOP)
> - Completion sign-off with scope verification
> - Retention of records for a minimum of 3 years
>
> The client does not manage Prime Pathwy. The system manages itself. This is not incremental improvement — it is a category shift from labor vendor to **Sovereign Systems Integrator**.

### Community Impact Statement

**Vallejo, CA — The Operating Theater:**

Prime Pathwy is based in Vallejo, California — a city with one of the highest property turnover rates in the Bay Area, a significant proportion of Section 8 and HUD-assisted housing, and a documented need for reliable, accountable property maintenance services. Our work directly addresses:

- **Community cleanliness** — systematic haul-outs and turnover services reduce blight in targeted neighborhoods
- **Housing availability** — faster, documented turnovers reduce unit vacancy time and return housing to market sooner
- **Local employment** — Prime Pathwy operates as a technology-driven local employer, using documented SOPs and digital systems to create replicable, trainable job roles — not casual day labor
- **Tech-driven local jobs** — the Sovereign System model creates structured roles with defined documentation requirements, enabling local residents to operate to an institutional standard without prior experience

**Workforce Development Narrative:**

> Prime Pathwy's operational model transforms unstructured service work into documented, trainable roles. By deploying digital work order systems, photo documentation protocols, and standardized SOPs, Prime Pathwy enables local Vallejo residents — including returning citizens and under-credentialed workers — to perform at an institutional grade. This is not just job creation. This is system-building that elevates the workforce alongside the work.

---

## Step 5 — Grant Scouting Protocol

**Research Targets:**

**California State (grants.ca.gov):**

```
Perplexity Prompt — CA State Grants:
Find active California State grant programs on grants.ca.gov for small businesses in
janitorial services (NAICS 561720) or waste hauling (NAICS 562111) operating in Solano County
or the City of Vallejo. Include programs from CalRecycle, GO-Biz, Cal OES, CDFA, or
California Workforce Development. List program name, administering agency, award range,
deadline, and eligibility requirements. Focus on minority-owned or community-impact programs.
```

**Federal (Grants.gov / SBA):**

```
Perplexity Prompt — Federal Small Business Grants:
Find active federal grant programs on Grants.gov or SBA.gov for small businesses in
NAICS 561720 (Janitorial Services), 562111 (Solid Waste Collection / Hauling), or
484110 (General Freight Trucking). Prioritize: Minority Business Development Agency
(MBDA) grants, EPA Environmental Workforce Development grants (Region 9, California),
SBA Community Navigator grants, DOT Small Business Transportation Resource Center
(SBTRC) grants, and EDA Economic Development grants for underserved communities.
Include program name, CFDA number, award range, deadline, and Small Business /
Minority-Owned eligibility.
```

**USPS eSourcing & Logistics Portal (Non-Dilutive Logistics Contracts):**

```
Perplexity Prompt — USPS Logistics Subcontracting Opportunities:
Find active USPS solicitations, Highway Contract Routes (HCR), or terminal-to-terminal
hauling subcontract opportunities on SAM.gov or the USPS eSourcing portal for Northern
California — specifically the San Francisco CA RPDC at 2501 Rydin Rd., Richmond CA 94850
and its Local Processing Centers (Oakland, San Francisco, Petaluma, San Jose, Eureka).
NAICS 484110 and 491110. Include solicitation numbers, award ranges, submission
deadlines, and any small business or supplier diversity set-asides.
```

**Action:** Submit PS Form 5436 to USPS Transportation Contracts to be added to the solicitation mailing list — this ensures Prime Pathwy receives HCR and RPDC hauling route notices automatically. See `workflows/USPS_Logistics_Identity.md` for full USPS registration and eSourcing onboarding SOP.

**Log Format:** Save scouting results in a dated file: `logs/grant_scout_YYYY-MM-DD.md`.

**Qualification Matrix:**

| Criterion | Requirement | GREEN | YELLOW | RED |
|---|---|---|---|---|
| Business type | Small Business / Minority-Owned | Match | Certification pending | Not applicable |
| NAICS match | 561720, 562111, 484110, or 491110 | Match | Adjacent NAICS | No match |
| Geography | CA / Solano County / Vallejo | In-scope | Statewide eligible | Out of state |
| Matching funds | Within operating budget | Not required or affordable | Review | Exceeds capacity |
| Designation required | None or Small Business | None required | MBE/DBE needed | 501(c)(3) required |

---

## Step 6 — Application Document Generation

**For each qualified grant, generate the following package:**

**Document 1 — Executive Summary (1 page)**
- Credential Plate header
- Grant program name and CFDA number (if federal)
- One-paragraph Community Sovereignty Statement (drawn from Step 4 narrative)
- Specific ask: dollar amount, use of funds, outcome metrics

**Document 2 — Organizational Profile**
- Legal name: Prime Pathwy
- EIN: 84-4788578
- DUNS: 12-3035654
- Address: 425 Virginia St STE B, Vallejo, CA 94590
- NAICS: 561720 / 562111
- Year established, owner, contact
- SAM.gov registration confirmation

**Document 3 — Digital Presence & Compliance Evidence**
- Attach or link: `privacy.html`, `accessibility.html`, `terms.html`
- Statement: "Prime Pathwy maintains a CCPA-compliant Privacy Policy, WCAG 2.1 Level AA Accessibility Statement, and published Terms of Service — all effective April 12, 2026."

**Document 4 — Community Impact Narrative**
- Use the Problem Frame, Implication Layer, and Sovereign System Solution from Step 4
- Tailor the final paragraph to the specific grant's stated community goals
- Never exceed 500 words in the narrative field — institutional brevity signals discipline

**Document 5 — Budget Justification**
- Line-item breakdown of how grant funds will be used
- Categories: Equipment, Workforce Training, Technology Infrastructure, Operational Expansion
- No vague line items — every dollar must map to a specific operational outcome

---

## Step 7 — Pre-Submission Review

**7-Point Grant Submission Checklist:**

- [ ] **Identity Lock:** EIN `84-4788578` and DUNS `12-3035654` match all submitted documents exactly
- [ ] **Digital Presence:** `privacy.html` and `accessibility.html` are attached or linked — URLs confirmed live
- [ ] **Narrative Integrity:** Community Sovereignty narrative present — no generic boilerplate language
- [ ] **NEPQ Frame:** Problem → Implication → Sovereign System → Proof → Ask structure intact
- [ ] **Budget Justified:** Every line item maps to a specific outcome — no rounding, no vague categories
- [ ] **Signature:** Arthur F. Appling Sr. signature block on all submitted documents
- [ ] **Confirmation Protocol:** Submission confirmation screenshot saved to `logs/grant_submissions.md`

**Do not submit until all 7 boxes are checked.**

---

## Step 8 — Submission & Log

**Submission Portals:**
- California State grants: grants.ca.gov
- Federal grants: Grants.gov
- SBA-specific programs: SBA.gov/funding-programs/grants
- USPS Logistics Contracts: USPS eSourcing portal (via about.usps.com/what/business-services/suppliers/becoming/) + SAM.gov for HCR solicitations
- DOT Transportation Grants: transportation.gov/grants (NAICS 484110 programs)

**Log every submission in `logs/grant_submissions.md`:**

```
## [GRANT PROGRAM NAME] — [ADMINISTERING AGENCY]
- Submitted: [DATE]
- CFDA / Program Number: [NUMBER]
- Award Range: $[MIN] – $[MAX]
- Use of Funds: [SUMMARY]
- Digital Presence Evidence: privacy.html + accessibility.html attached — ✅
- Confirmation: [SCREENSHOT PATH or CONFIRMATION NUMBER]
- Follow-Up Deadline: [DATE]
```

**Rule:** No grant is considered submitted without a confirmation record. Every submission is logged. Every follow-up is calendared.

---

*Prime Pathwy — Sovereign Systems for Operators Who Are Done With Chaos.*
*Arthur F. Appling Sr. | Lead Technical Architect*
