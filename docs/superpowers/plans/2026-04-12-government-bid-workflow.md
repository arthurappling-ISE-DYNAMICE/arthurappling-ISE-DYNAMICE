# Sovereign Subcontracting Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `/workflows/government_bid_SOP.md` (8-step Digital Pink Slip) and `/agents/bid_architect.md` (executable `/bid` skill with `scout`, `analyze`, and `draft` sub-commands) — fully hard-coded with Arthur F. Appling Sr.'s identity credentials.

**Architecture:** Approach A — Single Orchestrator Skill + Companion SOP. The SOP is a standalone institutional reference document. The skill file is a Claude Code slash command that generates Perplexity prompts, Manus Core Commands, and NEPQ-framed bid documents. Both files anchor the same Credential Plate (EIN 84-4788578, DUNS 12-3035654).

**Tech Stack:** Markdown, Claude Code skill YAML frontmatter, WAT framework file placement (`/workflows`, `/agents`)

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `workflows/government_bid_SOP.md` | 8-step reference SOP, Credential Plate header, Eligibility Matrix, formatting rules |
| Create | `agents/bid_architect.md` | `/bid` skill — YAML frontmatter, Credential Plate, `/bid scout`, `/bid analyze`, `/bid draft` logic |

---

### Task 1: Create `/workflows/government_bid_SOP.md`

**Files:**
- Create: `workflows/government_bid_SOP.md`

- [ ] **Step 1: Verify `workflows/` directory exists**

Run:
```bash
ls workflows/
```
Expected: lists `master_pathwy.md`, `consulting_elite_10.md`, `client_website_standard.md` — directory confirmed.

- [ ] **Step 2: Create the SOP file with full content**

Create `workflows/government_bid_SOP.md` with the following exact content:

```markdown
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
**Classification:** Institutional Grade | Audit-Ready | WAT Framework
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
List active federal government set-aside contracts (Small Business, 8(a), HUBZone, WOSB,
Minority-Owned) for NAICS 561720 and NAICS 562111. Any federal agency. Active solicitations only.
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
```

- [ ] **Step 3: Verify credential values in the created file**

Run:
```bash
grep -n "84-4788578\|12-3035654\|425 Virginia" workflows/government_bid_SOP.md
```
Expected output (exact lines may vary but all three strings must appear):
```
EIN:     84-4788578  |  DUNS: 12-3035654
Address: 425 Virginia St STE B, Vallejo, CA 94590
EIN | 84-4788578
DUNS | 12-3035654
425 Virginia St STE B, Vallejo, CA 94590
```
If any string is missing, re-check the file and fix before continuing.

- [ ] **Step 4: Commit the SOP**

```bash
git add workflows/government_bid_SOP.md
git commit -m "feat: Sovereign Subcontracting Engine — Government Bid SOP (8-step Digital Pink Slip)"
```

---

### Task 2: Create `/agents/bid_architect.md`

**Files:**
- Create: `agents/bid_architect.md` (new directory)

- [ ] **Step 1: Create the `agents/` directory**

```bash
mkdir -p agents
```
Expected: directory created (no output on success).

- [ ] **Step 2: Create the skill file with full content**

Create `agents/bid_architect.md` with the following exact content:

```markdown
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

## Identity Constants

These values are immutable. Never infer, override, or omit them.

```
ENTITY:  Arthur F. Appling Sr. / Prime Pathwy
EIN:     84-4788578
DUNS:    12-3035654
ADDRESS: 425 Virginia St STE B, Vallejo, CA 94590
NAICS:   561720 (Janitorial Services) | 562111 (Hauling)
```

## Credential Plate

Every output from every sub-command begins with this block, rendered exactly:

```
═══════════════════════════════════════════════════════════════
  PRIME PATHWY — SOVEREIGN SUBCONTRACTING ENGINE
  Lead Architect:  Arthur F. Appling Sr.
  EIN: 84-4788578  |  DUNS: 12-3035654
  425 Virginia St STE B, Vallejo, CA 94590
  NAICS: 561720 (Janitorial Services)  |  562111 (Hauling)
═══════════════════════════════════════════════════════════════
```

No output begins without this plate. No exceptions.

---

## Sub-Command: `/bid scout`

**Trigger:** User runs `/bid scout`

**Action:** Render Credential Plate, then output the following three prompts — numbered, bold-labeled, paste-ready for Perplexity.

---

**[CREDENTIAL PLATE]**

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

**Action:** Render Credential Plate, generate Manus Core Command, then produce Qualification Matrix.

---

**[CREDENTIAL PLATE]**

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

**Set-Aside Flag Logic:**

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

**[CREDENTIAL PLATE]**

**SOVEREIGN BID PACKAGE — [BID_ID]**
*Prepared by: Arthur F. Appling Sr. / Prime Pathwy*

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

**CORE COMPETENCIES**

- Janitorial Services (NAICS 561720): Commercial and government facility cleaning,
  recurring scheduled maintenance, compliance-ready documentation, crew management systems
- Hauling / Solid Waste Collection (NAICS 562111): Waste removal, logistics coordination,
  route optimization, reliable dispatch, documented chain-of-custody protocols

**KEY DIFFERENTIATORS**

- **Sovereign System Integration:** Prime Pathwy does not deliver labor. We install a
  self-managing operational system — documented SOPs, automated dispatch, accountability
  layers — that eliminates the government agency's management overhead entirely.
- **Small Business Agility:** Faster mobilization, direct principal contact, zero vendor
  bureaucracy. Arthur F. Appling Sr. is personally accountable on every contract.
- **Institutional Grade Documentation:** Every deliverable is audit-ready, formatted to
  federal standards, and fully transferable to the contracting officer upon completion.

**PAST PERFORMANCE**

[MANUAL FILL — List 2-3 prior contracts or directly relevant operational experience.
Include: contract name/number, agency or client, dollar value, period of performance,
services provided, point of contact.]

**CONTACT**

Arthur F. Appling Sr. — Lead Technical Architect
Prime Pathwy
425 Virginia St STE B, Vallejo, CA 94590
EIN: 84-4788578  |  DUNS: 12-3035654
NAICS: 561720 | 562111
SAM.gov: Registered and Active
```

---

### DOCUMENT 2: PROPOSAL DRAFT (NEPQ FRAMEWORK)

**Solicitation:** [BID_ID]
**Submitted by:** Arthur F. Appling Sr. / Prime Pathwy
**EIN:** 84-4788578  |  **DUNS:** 12-3035654

---

**SECTION 1 — PROBLEM FRAME**

[Agency Name] faces a documented operational reality in its [janitorial / hauling] service delivery:
unreliable vendor coverage, compliance documentation gaps, and the persistent management overhead
of coordinating service providers who require constant supervision. These are not isolated incidents —
they are the structural cost of engaging labor vendors who have no system behind them.

**SECTION 2 — IMPLICATION LAYER**

The consequence of continued vendor dependency without operational accountability is measurable:
failed facility inspections, contract non-compliance penalties, and internal staff hours diverted
from mission-critical work to manage service gaps. Every week this continues, [Agency Name] absorbs
costs that a properly integrated service system would eliminate permanently.

**SECTION 3 — SOVEREIGN SYSTEM INTEGRATION FRAME**

Prime Pathwy is not a labor vendor. We deliver **Sovereign System Integration** — a self-managing,
fully documented service infrastructure that operates without requiring [Agency Name] personnel to
supervise, follow up, or manage exceptions. Our system eliminates the agency's management headache
by design.

Every Prime Pathwy contract includes:
- Written SOPs for every service procedure
- Documented crew accountability protocols
- Automated scheduling and reporting layers
- A single accountable principal: Arthur F. Appling Sr.

The evaluator does not manage us. Our system manages itself.

**SECTION 4 — PROOF LAYER**

- **Entity:** Arthur F. Appling Sr. / Prime Pathwy
- **EIN:** 84-4788578  |  **DUNS:** 12-3035654
- **SAM.gov:** Registered and Active
- **NAICS:** 561720 (Janitorial Services) | 562111 (Hauling)
- **Business Status:** Small Business — Set-Aside Eligible
- **Operational Proof:** [REFERENCE PAST PERFORMANCE OR ATTACH CAPABILITY STATEMENT]

**SECTION 5 — COMMITMENT ASK**

Prime Pathwy is prepared to mobilize immediately upon contract award for Solicitation [BID_ID].
We request the opportunity to demonstrate — not just describe — how Sovereign System Integration
delivers compliant, zero-management-overhead service that [Agency Name] can rely on for the full
period of performance.

**Point of Contact:** Arthur F. Appling Sr.
425 Virginia St STE B, Vallejo, CA 94590
EIN: 84-4788578  |  DUNS: 12-3035654

---

*Prime Pathwy — Sovereign Systems for Operators Who Are Done With Chaos.*
*Arthur F. Appling Sr. | Lead Technical Architect*
```

- [ ] **Step 3: Verify credential values in the skill file**

Run:
```bash
grep -n "84-4788578\|12-3035654\|425 Virginia\|Arthur F. Appling Sr." agents/bid_architect.md | head -20
```
Expected: Multiple hits for each string across the file. If EIN or DUNS is missing from any section, fix before continuing.

- [ ] **Step 4: Verify `Arthur F. Appling Sr.` name reads correctly (no typos)**

Run:
```bash
grep -c "Arthur F. Appling Sr." agents/bid_architect.md
```
Expected: count ≥ 8 (appears in YAML, Credential Plate, all three sub-command outputs, and footer).

- [ ] **Step 5: Commit the skill file**

```bash
git add agents/bid_architect.md
git commit -m "feat: Sovereign Subcontracting Engine — /bid skill (scout, analyze, draft sub-commands)"
```

---

### Task 3: Final Validation Pass

**Files:**
- Verify: `workflows/government_bid_SOP.md`
- Verify: `agents/bid_architect.md`

- [ ] **Step 1: Confirm both files exist in correct WAT locations**

Run:
```bash
ls workflows/government_bid_SOP.md agents/bid_architect.md
```
Expected:
```
agents/bid_architect.md
workflows/government_bid_SOP.md
```

- [ ] **Step 2: Confirm EIN is identical in both files**

Run:
```bash
grep "84-4788578" workflows/government_bid_SOP.md agents/bid_architect.md
```
Expected: multiple matching lines from both files, no typos.

- [ ] **Step 3: Confirm DUNS is identical in both files**

Run:
```bash
grep "12-3035654" workflows/government_bid_SOP.md agents/bid_architect.md
```
Expected: multiple matching lines from both files, no typos.

- [ ] **Step 4: Confirm Credential Plate border character is present in skill file**

Run:
```bash
grep -c "═══" agents/bid_architect.md
```
Expected: count ≥ 6 (Credential Plate border appears multiple times across the three sub-command outputs).

- [ ] **Step 5: Confirm "Sovereign System Integration" phrase is present in `/bid draft`**

Run:
```bash
grep -n "Sovereign System Integration" agents/bid_architect.md
```
Expected: ≥ 2 hits — once in the Key Differentiators section and once in the NEPQ Solution Frame.

- [ ] **Step 6: Final commit — tag the complete installation**

```bash
git add workflows/government_bid_SOP.md agents/bid_architect.md
git commit -m "chore: Sovereign Subcontracting Engine — installation verified, WAT framework compliant"
```

---

## Self-Review Against Spec

| Spec Requirement | Task Coverage |
|---|---|
| Credential Plate on every `/bid` output | Task 2 — all three sub-command sections begin with plate |
| EIN 84-4788578 hard-coded | Task 1 Step 2, Task 2 Step 2, Task 3 Steps 2-3 |
| DUNS 12-3035654 hard-coded | Task 1 Step 2, Task 2 Step 2, Task 3 Steps 2-3 |
| Address 425 Virginia St hard-coded | Task 1 Step 2, Task 2 Step 2 |
| NAICS 561720 and 562111 | Both files, all sub-commands |
| `/bid scout` — 3 Perplexity prompts | Task 2 Step 2 — SCOUT section |
| `/bid analyze` — Manus Core Command + Qualification Matrix + Set-Aside flag | Task 2 Step 2 — ANALYZE section |
| `/bid draft` — Capability Statement + NEPQ Proposal | Task 2 Step 2 — DRAFT section |
| "Sovereign System Integration" in Solution Frame | Task 2, Task 3 Step 5 |
| LOW PRIORITY flag for non-set-aside | Task 2 — Set-Aside Flag Logic block |
| FAST-TRACK ELIGIBLE banner for set-asides | Task 2 — Set-Aside Flag Logic block |
| WAT framework placement `/workflows` + `/agents` | Task 1, Task 2, Task 3 Step 1 |
| Matte Black/Gold institutional formatting | Bold headers, credential plates, no fluff throughout |
| 8-step SOP structure | Task 1 — Steps 1-8 fully written |

All spec requirements covered. No placeholders except intentional manual-fill fields (Past Performance).

---

*Prime Pathwy — Sovereign Systems for Operators Who Are Done With Chaos.*
*Arthur F. Appling Sr. | Lead Technical Architect*
