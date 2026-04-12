---
name: bid
description: >
  Sovereign Subcontracting Engine for Prime Pathwy. Scouts, analyzes, and drafts
  government bids targeting NAICS 561720 (Janitorial Services) and 562111 (Hauling).
  Sub-commands: scout | analyze [links] | draft [bid_id].
  Identity: Arthur F. Appling Sr. | EIN: 84-4788578 | DUNS: 12-3035654
  Address: 425 Virginia St STE B, Vallejo, CA 94590
---

# Bid Architect — Sovereign Subcontracting Engine

**Author:** Arthur F. Appling Sr. — Lead Technical Architect
**Business:** Prime Pathwy
**Classification:** Institutional Grade | Audit-Ready | WAT Framework
**Version:** 1.0 | Active Deployment

---

## Identity Constants

These values are immutable. Never infer, override, or omit them from any output.

```
ENTITY:  Arthur F. Appling Sr. / Prime Pathwy
EIN:     84-4788578
DUNS:    12-3035654
ADDRESS: 425 Virginia St STE B, Vallejo, CA 94590
NAICS:   561720 (Janitorial Services) | 562111 (Hauling)
```

---

## Credential Plate

Every output from every sub-command begins with this block, rendered exactly as shown. No output begins without this plate. No exceptions.

```
═══════════════════════════════════════════════════════════════
  PRIME PATHWY — SOVEREIGN SUBCONTRACTING ENGINE
  Lead Architect:  Arthur F. Appling Sr.
  EIN: 84-4788578  |  DUNS: 12-3035654
  425 Virginia St STE B, Vallejo, CA 94590
  NAICS: 561720 (Janitorial Services)  |  562111 (Hauling)
═══════════════════════════════════════════════════════════════
```

---

## Sub-Command: `/bid scout`

**Trigger:** User runs `/bid scout`

**Action:** Render Credential Plate, then output three Perplexity prompts — numbered, bold-labeled, paste-ready.

---

Output the following Credential Plate verbatim, then continue with the scouting report:

```
════════════════════════════════════════════════════════════════
  PRIME PATHWY — SOVEREIGN SUBCONTRACTING ENGINE
  Lead Architect:  Arthur F. Appling Sr.
  EIN: 84-4788578  |  DUNS: 12-3035654
  425 Virginia St STE B, Vallejo, CA 94590
  NAICS: 561720 (Janitorial Services)  |  562111 (Hauling)
═══════════════════════════════════════════════════════════════
```

**SOVEREIGN SCOUTING REPORT — PERPLEXITY PROMPTS**
*Generated for: Arthur F. Appling Sr. / Prime Pathwy*
*NAICS: 561720 | 562111 | Target: Set-Aside contracts ≤ $100k*

---

**PROMPT 1 — NAICS 561720 (Janitorial Services)**

```
Find active SAM.gov solicitations for NAICS code 561720 (Janitorial Services) in California
under $100,000 contract value. List: solicitation number, agency name, submission deadline,
set-aside designation (Small Business / 8(a) / HUBZone / WOSB / Open). Prioritize set-aside
contracts. Current date: [INSERT TODAY'S DATE].
```

**PROMPT 2 — NAICS 562111 (Hauling / Solid Waste Collection)**

```
Find active SAM.gov solicitations for NAICS code 562111 (Hauling / Solid Waste Collection)
in California under $100,000 contract value. List: solicitation number, agency name, submission
deadline, set-aside designation (Small Business / 8(a) / HUBZone / WOSB / Open). Prioritize
set-aside contracts. Current date: [INSERT TODAY'S DATE].
```

**PROMPT 3 — SET-ASIDE PRIORITY SWEEP**

```
List all active federal government set-aside contracts (Small Business, 8(a), HUBZone, WOSB,
Minority-Owned) for NAICS codes 561720 and 562111. Any federal agency. Active solicitations only.
Include: solicitation number, agency name, deadline, contract ceiling, and set-aside type.
Current date: [INSERT TODAY'S DATE].
```

---

*Copy each prompt into Perplexity. Log results to `logs/bid_scout_YYYY-MM-DD.md`. Then run `/bid analyze [links]` with the solicitation URLs.*

---

## Sub-Command: `/bid analyze [links]`

**Trigger:** User runs `/bid analyze` followed by 1–5 solicitation URLs or pasted solicitation text.

**Action:** Render Credential Plate, generate Manus Core Command, produce Qualification Matrix with Set-Aside flag.

---

Output the following Credential Plate verbatim, then continue with the analysis report:

```
═══════════════════════════════════════════════════════════════
  PRIME PATHWY — SOVEREIGN SUBCONTRACTING ENGINE
  Lead Architect:  Arthur F. Appling Sr.
  EIN: 84-4788578  |  DUNS: 12-3035654
  425 Virginia St STE B, Vallejo, CA 94590
  NAICS: 561720 (Janitorial Services)  |  562111 (Hauling)
═══════════════════════════════════════════════════════════════
```

**SOVEREIGN ANALYSIS REPORT**
*Analyzing: [USER-PROVIDED LINKS OR TEXT]*

---

### Manus Core Command

Copy and execute this command in Manus:

```
MANUS CORE COMMAND — BID QUALIFICATION ANALYSIS

You are a federal contracting analyst working for Prime Pathwy (Small Business, NAICS 561720 / 562111).
Analyze the following solicitation(s) and extract ALL of the following:

1. SCOPE OF WORK: Exact services required. Does it match janitorial (561720) or hauling (562111)?
2. CONTRACT VALUE: Total ceiling and individual task order limits if applicable.
3. SUBMISSION DEADLINE: Exact date, time, and timezone.
4. SET-ASIDE DESIGNATION: Identify exactly — Small Business / 8(a) / HUBZone / WOSB / Minority-Owned / Open Competition.
5. BONDING AND INSURANCE: Any surety bond requirements or insurance minimums.
6. INCUMBENT CONTRACTOR: Is there a current vendor? Name them if disclosed.
7. EVALUATION CRITERIA: How bids are scored — price, technical approach, past performance, certifications.

Solicitation(s): [USER PASTES LINKS OR TEXT HERE]

Output as a structured table. Bold the SET-ASIDE DESIGNATION field. Flag any disqualifying requirements.
```

---

### Qualification Matrix

| Criterion | Requirement | Arthur's Status | Decision |
|---|---|---|---|
| NAICS code match | 561720 or 562111 | Registered on SAM.gov | GREEN / RED |
| Contract value | ≤ $100,000 | Target ceiling | GREEN / RED |
| Set-Aside designation | Small Business preferred | Small Business active | GREEN / LOW PRIORITY |
| Bonding requirement | Within current capacity | Assess per contract | GREEN / YELLOW |
| Location / jurisdiction | CA or federal remote | Vallejo, CA base | GREEN / RED |

---

### Set-Aside Flag Logic

```
IF set-aside = Small Business / 8(a) / WOSB / HUBZone / Minority-Owned:
  → ✦ FAST-TRACK ELIGIBLE — SMALL BUSINESS SET-ASIDE CONFIRMED ✦
  → PROCEED to /bid draft [solicitation_number]

IF set-aside = Open Competition:
  → ⚠ LOW PRIORITY — OPEN COMPETITION. DEPRIORITIZE.
  → Do not invest bid preparation time until all FAST-TRACK contracts are worked.

IF NAICS does not match 561720 or 562111:
  → ✗ DISQUALIFIED — OUT OF SCOPE NAICS. STOP.

IF bonding requirement exceeds current capacity:
  → ✗ DISQUALIFIED — BONDING GAP. STOP.
```

---

## Sub-Command: `/bid draft [bid_id]`

**Trigger:** User runs `/bid draft` followed by a solicitation number (e.g., `W912BV-26-R-0014`).

**Action:** Render Credential Plate, generate Capability Statement, then generate NEPQ Proposal Draft.

---

Output the following Credential Plate verbatim, then continue with the bid package:

```
═══════════════════════════════════════════════════════════════
  PRIME PATHWY — SOVEREIGN SUBCONTRACTING ENGINE
  Lead Architect:  Arthur F. Appling Sr.
  EIN: 84-4788578  |  DUNS: 12-3035654
  425 Virginia St STE B, Vallejo, CA 94590
  NAICS: 561720 (Janitorial Services)  |  562111 (Hauling)
═══════════════════════════════════════════════════════════════
```

**SOVEREIGN BID PACKAGE — [BID_ID]**
*Prepared by: Arthur F. Appling Sr. / Prime Pathwy*
*EIN: 84-4788578 | DUNS: 12-3035654*

---

### DOCUMENT 1: CAPABILITY STATEMENT

```
═══════════════════════════════════════════════════════════════
  PRIME PATHWY — CAPABILITY STATEMENT
  Lead Architect:  Arthur F. Appling Sr.
  EIN: 84-4788578  |  DUNS: 12-3035654
  425 Virginia St STE B, Vallejo, CA 94590
  NAICS: 561720 (Janitorial Services)  |  562111 (Hauling)
  Business Type: Small Business
═══════════════════════════════════════════════════════════════
```

**CORE COMPETENCIES**

- **Janitorial Services (NAICS 561720):** Commercial and government facility cleaning, recurring scheduled maintenance, compliance-ready documentation, crew management systems
- **Hauling / Solid Waste Collection (NAICS 562111):** Waste removal, logistics coordination, route optimization, reliable dispatch, documented chain-of-custody protocols

**KEY DIFFERENTIATORS**

- **Sovereign System Integration:** Prime Pathwy does not deliver labor. We install a self-managing operational system — documented SOPs, automated dispatch, accountability layers — that eliminates the government agency's management overhead entirely. The evaluator does not manage us; our system manages itself.
- **Small Business Agility:** Faster mobilization, direct principal contact, zero vendor bureaucracy. Arthur F. Appling Sr. is personally accountable on every contract.
- **Institutional Grade Documentation:** Every deliverable is audit-ready, formatted to federal standards, and fully transferable to the contracting officer upon completion.

**PAST PERFORMANCE**

[MANUAL FILL — List 2-3 prior contracts or directly relevant operational experience. Include: contract name/number, agency or client, dollar value, period of performance, services provided, point of contact.]

**CONTACT**

Arthur F. Appling Sr. — Lead Technical Architect
Prime Pathwy
425 Virginia St STE B, Vallejo, CA 94590
EIN: 84-4788578  |  DUNS: 12-3035654
NAICS: 561720 | 562111
SAM.gov: Registered and Active

---

### DOCUMENT 2: PROPOSAL DRAFT — NEPQ FRAMEWORK

**Solicitation:** [BID_ID]
**Submitted by:** Arthur F. Appling Sr. / Prime Pathwy
**EIN:** 84-4788578  |  **DUNS:** 12-3035654

---

**SECTION 1 — PROBLEM FRAME**

[Agency Name] is managing a [janitorial / hauling] service contract with a vendor model that creates a predictable problem: service gaps, compliance documentation shortfalls, and the internal management overhead of supervising providers who are not accountable to a system — only to instructions. The question is not whether this is happening. The question is how much it is costing.

**SECTION 2 — IMPLICATION LAYER**

Unreliable service delivery at a government facility is not an inconvenience — it is a liability. Failed inspections, non-compliance citations, and internal staff hours diverted to vendor management are quantifiable costs. Every contract cycle that continues under a labor-vendor model locks in those costs permanently. The agency absorbs what the vendor cannot systematize.

**SECTION 3 — SOVEREIGN SYSTEM INTEGRATION FRAME** *(NEPQ: Solution Awareness)*

Prime Pathwy delivers **Sovereign System Integration** — not labor, not a vendor relationship, not a service contract that requires your team to manage ours. We install a self-managing, fully documented operational system that removes [Agency Name] from the supervision loop entirely.

Every Prime Pathwy engagement includes:
- Written SOPs for every service procedure — auditable, transferable, federally formatted
- Documented crew accountability protocols — no supervision required from the agency side
- Automated scheduling and reporting layers — compliance evidence generated automatically
- A single accountable principal: **Arthur F. Appling Sr.** answers directly for every deliverable

The result is not a cleaner facility or a completed haul. The result is an operational system that eliminates the agency's management headache and produces compliance evidence without agency effort. That is the difference between hiring labor and installing a Sovereign System.

**SECTION 4 — PROOF LAYER**

- **Entity:** Arthur F. Appling Sr. / Prime Pathwy
- **EIN:** 84-4788578  |  **DUNS:** 12-3035654
- **SAM.gov:** Registered and Active
- **NAICS:** 561720 (Janitorial Services) | 562111 (Hauling)
- **Business Status:** Small Business — Set-Aside Eligible
- **Operational Proof:** [REFERENCE PAST PERFORMANCE OR ATTACH CAPABILITY STATEMENT]

**SECTION 5 — COMMITMENT ASK**

Prime Pathwy is prepared to mobilize immediately upon contract award for Solicitation [BID_ID]. We are not asking for an opportunity to perform a service. We are offering to install a system that performs it — permanently, without requiring [Agency Name] management overhead to sustain it.

**Point of Contact:** Arthur F. Appling Sr.
425 Virginia St STE B, Vallejo, CA 94590
EIN: 84-4788578  |  DUNS: 12-3035654

---

*Prime Pathwy — Sovereign Systems for Operators Who Are Done With Chaos.*
*Arthur F. Appling Sr. | Lead Technical Architect*
