# Sovereign Subcontracting Engine — Standard Operating Procedure

---

```
═══════════════════════════════════════════════════════════════
  SOVEREIGN SUBCONTRACTING ENGINE — STANDARD OPERATING PROCEDURE
  Entity:  Arthur F. Appling Sr. / Prime Pathwy
  EIN:     84-4788578  |  DUNS: 12-3035654
  Address: 425 Virginia St STE B, Vallejo, CA 94590
  NAICS:   561720 (Janitorial Services)  |  562111 (Hauling)
  Classification: Institutional Grade | Audit-Ready | WAT Framework
═══════════════════════════════════════════════════════════════
```

**Author:** Arthur F. Appling Sr. — Lead Technical Architect
**Business:** Prime Pathwy
**Version:** 1.0 | Active Deployment

---

## Step 1 — System Objective

**What this engine does:** The Sovereign Subcontracting Engine enables Arthur F. Appling Sr. to scout, qualify, and bid on federal and state government subcontracts in janitorial and hauling services from the Cockpit — with zero manual research redundancy.

**Target:** Federal and state solicitations under $100,000. Priority: Small Business / Minority-Owned set-asides.

**NAICS Scope:**
- 561720 — Janitorial Services
- 562111 — Hauling / Solid Waste Collection

**Winning Definition:** A submitted, compliant bid that leverages Small Business set-aside status as the fast-track advantage, backed by an Institutional Grade Capability Statement.

**Out of Scope:** Prime contracts requiring bonding beyond current capacity. Open competition contracts without set-aside designation are LOW PRIORITY.

**Legal Infrastructure Verification Checklist** *(confirm before submitting any bid — these pages are LIVE on local build as of 2026-04-12):*

| Document | File | Status |
|---|---|---|
| Privacy Policy (CCPA) | `Prime_Pathwy_Turnover_System/privacy.html` | ✅ Live |
| Terms of Service (No Verbal Order Rule) | `Prime_Pathwy_Turnover_System/terms.html` | ✅ Live |
| ADA / WCAG 2.1 Accessibility Statement | `Prime_Pathwy_Turnover_System/accessibility.html` | ✅ Live |

- [ ] All three legal pages load correctly at their local paths
- [ ] Privacy Policy lists EIN 84-4788578 and address 425 Virginia St STE B, Vallejo, CA 94590
- [ ] Terms of Service No Verbal Order Rule clause is present and visible
- [ ] ADA Statement cites WCAG 2.1 Level AA compliance
- [ ] `contact@primepathwy.com` is the active contact — update to `operations@primepathwy.com` when Namecheap email is live

---

## Step 2 — Required Setup

**Credential Plate (must be confirmed before any bid activity):**

| Field | Value |
|---|---|
| Entity | Arthur F. Appling Sr. / Prime Pathwy |
| EIN | 84-4788578 |
| DUNS | 12-3035654 |
| Address | 425 Virginia St STE B, Vallejo, CA 94590 |
| NAICS | 561720 (Janitorial) \| 562111 (Hauling) |

**SAM.gov Registration Checklist:**
- [ ] SAM.gov account active and not expired
- [ ] NAICS codes 561720 and 562111 listed on profile
- [ ] Small Business designation confirmed on profile
- [ ] EIN and DUNS match registration exactly
- [ ] Point of Contact: Arthur F. Appling Sr.

**Tool Access Required:**
- [ ] Claude Code — for running `/bid scout`, `/bid analyze`, `/bid draft`
- [ ] Perplexity — for executing scouting prompts from `/bid scout`
- [ ] Manus — for executing analysis commands from `/bid analyze`

---

## Step 3 — Perplexity Research

**Protocol:** Run `/bid scout` in Claude Code to generate the three Perplexity prompts. Copy and paste each prompt into Perplexity. Log every result.

**Manual Query Structure (if Claude Code is unavailable):**

Prompt 1 — Janitorial:
```
Find active SAM.gov solicitations for NAICS code 561720 (Janitorial Services) in California
under $100,000 contract value. List solicitation number, agency, deadline, and set-aside designation.
Focus on Small Business and Minority-Owned set-asides. Current date: [today's date].
```

Prompt 2 — Hauling:
```
Find active SAM.gov solicitations for NAICS code 562111 (Hauling / Solid Waste Collection)
in California under $100,000 contract value. List solicitation number, agency, deadline,
and set-aside designation. Focus on Small Business and Minority-Owned set-asides. Current date: [today's date].
```

Prompt 3 — Set-Aside Priority:
```
List all active federal government set-aside contracts (Small Business, 8(a), HUBZone, WOSB,
Minority-Owned) for NAICS codes 561720 and 562111. Any federal agency. Active solicitations only.
Include solicitation number, agency name, deadline, and contract ceiling. Current date: [today's date].
```

**Log Format:** Save results in a dated file: `logs/bid_scout_YYYY-MM-DD.md`.

---

## Step 4 — Manus Core Command

**Protocol:** Run `/bid analyze [links]` in Claude Code with the solicitation URLs from Step 3. Claude Code will generate the Manus Core Command. Copy and execute it in Manus.

**Manual Manus Core Command Structure (if Claude Code is unavailable):**

```
MANUS CORE COMMAND — SOLICITATION ANALYSIS

You are a government contracting analyst. Analyze the following solicitation(s) and extract:

1. SCOPE OF WORK: Exact services required (janitorial, hauling, or both)
2. CONTRACT VALUE: Total ceiling and any individual task order limits
3. SUBMISSION DEADLINE: Date and time, including timezone
4. SET-ASIDE DESIGNATION: Is this Small Business, 8(a), HUBZone, WOSB, Minority-Owned, or Open Competition?
5. BONDING / INSURANCE: Any required bonding amounts or insurance minimums
6. INCUMBENT: Is there a current contractor? If so, who?
7. EVALUATION CRITERIA: How will bids be scored (price, technical, past performance)?

Solicitation(s): [PASTE LINKS OR TEXT HERE]

Output as a structured table. Flag SET-ASIDE status in bold.
```

---

## Step 5 — Result Analysis (Eligibility Matrix)

**Decision Logic — run this for every solicitation:**

```
IF Set-Aside = Small Business / 8(a) / WOSB / HUBZone / Minority-Owned
  AND NAICS = 561720 or 562111
  AND Contract Value ≤ $100,000
  → STATUS: ✦ GREEN — PURSUE ✦

IF Set-Aside = Open Competition
  AND NAICS = 561720 or 562111
  AND Contract Value ≤ $100,000
  → STATUS: ⚠ LOW PRIORITY — OPEN COMPETITION. DEPRIORITIZE.

IF NAICS ≠ 561720 and ≠ 562111
  → STATUS: ✗ RED — DISQUALIFY. OUT OF SCOPE NAICS.

IF Bonding requirement exceeds current capacity
  → STATUS: ✗ RED — DISQUALIFY. BONDING GAP.

IF Set-Aside confirmed AND scope match AND value ≤ $100k
  → STATUS: ✦ FAST-TRACK ELIGIBLE — SMALL BUSINESS SET-ASIDE CONFIRMED ✦
```

**Eligibility Matrix:**

| Criterion | Requirement | GREEN | LOW PRIORITY | RED |
|---|---|---|---|---|
| NAICS match | 561720 or 562111 | Match | — | No match |
| Contract value | ≤ $100,000 | ≤ $100k | — | > $100k |
| Set-Aside | Small Business or Minority | Set-aside present | Open competition | — |
| Bonding | Within current capacity | Within capacity | Review needed | Exceeds capacity |
| Location | CA or federal remote eligible | CA / federal | — | Out of jurisdiction |

**Rule:** Set-Aside contracts are the fast-track lane. Non-set-aside contracts are LOW PRIORITY by default and should not consume bid preparation time until all GREEN contracts are worked.

---

## Step 6 — Document Generation

**Protocol:** Run `/bid draft [bid_id]` in Claude Code where `bid_id` is the solicitation number from SAM.gov (e.g., `W912BV-26-R-0014`).

> **Dependency:** This step requires `/agents/bid_architect.md` to be deployed. If not yet available, use the Capability Statement Required Fields below as a manual template and apply the NEPQ framework directly for the proposal draft.

Claude Code will generate:
1. **Capability Statement** — one-page institutional credential document
2. **Proposal Draft** — NEPQ-framed proposal targeting the contracting officer's pain points

**Output:** Review both documents, fill in the Past Performance section with real project data, and proceed to Step 7.

**Capability Statement Required Fields:**
- Credential Plate header (EIN, DUNS, Address, NAICS)
- Core Competencies (Janitorial / Hauling)
- Key Differentiators (Sovereign System Integration)
- Past Performance (manual fill — 2-3 prior contracts or relevant experience)
- Contact Block

---

## Step 7 — Final Manual Review

**5-Point Pre-Submission Checklist:**

- [ ] **Credential Accuracy:** EIN `84-4788578` and DUNS `12-3035654` match SAM.gov registration exactly
- [ ] **Scope Match:** Proposed services directly match the solicitation's Statement of Work
- [ ] **Set-Aside Eligibility:** Confirmed Small Business designation is active on SAM.gov profile
- [ ] **Pricing Sanity:** Proposed price is competitive but not below operational cost
- [ ] **Signature:** Arthur F. Appling Sr. signature block present on all submitted documents

**Do not submit until all 5 boxes are checked.**

---

## Step 8 — Submission

**SAM.gov Portal Submission Steps:**
1. Log in to SAM.gov with registered account
2. Navigate to the solicitation by number
3. Upload Capability Statement (PDF)
4. Upload Proposal (PDF)
5. Confirm submission — screenshot the confirmation page
6. Log submission in `logs/bid_submissions.md`:

```
## [SOLICITATION NUMBER] — [AGENCY NAME]
- Submitted: [DATE]
- NAICS: [561720 or 562111]
- Set-Aside: [TYPE]
- Contract Value: $[AMOUNT]
- Confirmation: [SCREENSHOT PATH or CONFIRMATION NUMBER]
```

**Rule:** Every submission is logged. No bid is considered submitted without a confirmation record.

---

*Prime Pathwy — Sovereign Systems for Operators Who Are Done With Chaos.*
*Arthur F. Appling Sr. | Lead Technical Architect*
