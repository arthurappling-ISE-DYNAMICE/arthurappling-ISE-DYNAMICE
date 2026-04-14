# Sovereign Subcontracting Engine — Design Specification
**Author:** Arthur F. Appling Sr. — Lead Technical Architect  
**Business:** Prime Pathwy  
**Date:** 2026-04-12  
**Classification:** Institutional Grade | Audit-Ready | WAT Framework  
**Version:** 1.0 | Design Lock

---

## System Overview

The **Sovereign Subcontracting Engine** enables Arthur F. Appling Sr. to operate as the Technical Architect from his Cockpit, targeting high-ticket government subcontracts in janitorial and hauling services. The system automates the full bid lifecycle: research, qualification, and document generation.

**Target:** Federal and state solicitations under $100k, prioritizing Small Business / Minority-Owned set-asides.  
**NAICS Codes:** 561720 (Janitorial Services) | 562111 (Hauling)  
**Aesthetic Standard:** Matte Black + Gold authority — bold headers, no fluff, audit-ready.

---

## Architecture

**Pattern:** Approach A — Single Orchestrator Skill + Companion SOP

```
/workflows/government_bid_SOP.md    ← 8-step reference doc ("Digital Pink Slip")
/agents/bid_architect.md            ← executable skill, registered as /bid
```

### Data Flow

```
/bid scout
  → Credential Plate injected into output header
  → 3 Perplexity prompts generated (NAICS 561720 / 562111, <$100k, Set-Aside priority)

/bid analyze [links]
  → Manus Core Command generated
  → Requirements extracted + Small Business / Set-Aside flag check
  → Qualification Matrix: 5 criteria, RED / GREEN / LOW PRIORITY decision

/bid draft [bid_id]
  → Capability Statement generated (Credential Plate header, competencies, proof)
  → Proposal Draft generated (NEPQ logic: Problem → Implication → Sovereign System Integration → Proof → CTA)
  → Institutional Grade formatting enforced throughout
```

### Identity Anchor Strategy

A single `IDENTITY` block is hard-coded at the top of both files. All command outputs inherit from it — no credential is typed or inferred at runtime.

```
Entity:  Arthur F. Appling Sr. / Prime Pathwy
EIN:     84-4788578
DUNS:    12-3035654
Address: 425 Virginia St STE B, Vallejo, CA 94590
NAICS:   561720 (Janitorial) | 562111 (Hauling)
```

---

## File 1: `/workflows/government_bid_SOP.md`

### Purpose

The "Digital Pink Slip" for all government bid operations. Institutional-grade, audit-ready, presentable to partners at UPS or Amazon.

### Credential Plate Header (appears at top of file)

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

### 8-Step Body

**Step 1 — System Objective**  
What this engine targets, what winning looks like, scope constraints.

**Step 2 — Required Setup**  
Credential Plate anchor, SAM.gov registration checklist, tool access requirements (Perplexity, Manus, Claude Code).

**Step 3 — Perplexity Research**  
Exact search protocol. Run `/bid scout` or use the manual query structure defined here.

**Step 4 — Manus Core Command**  
Exact Manus prompt structure. Run `/bid analyze` or paste manually. Covers requirements extraction and set-aside designation lookup.

**Step 5 — Result Analysis (Eligibility Matrix)**  
Red/Green/Low Priority decision logic:
- `GREEN — PURSUE`: Small Business / Minority-Owned Set-Aside confirmed, scope matches NAICS, under $100k
- `YELLOW — EVALUATE`: Open competition but scope matches, bonding/insurance requirements need review
- `RED — DISQUALIFY`: Prime contract only, outside NAICS, bonding requirements not met
- `LOW PRIORITY FLAG`: Contract is NOT a Small Business set-aside → flag and deprioritize to protect time

Decision rule: **Set-Aside contracts are the fast-track lane. Non-set-aside contracts are Low Priority by default.**

**Step 6 — Document Generation**  
Run `/bid draft [bid_id]`. Capability Statement and Proposal Draft template fields defined here.

**Step 7 — Final Manual Review**  
5-point pre-submission checklist: credential accuracy, scope match, set-aside eligibility confirmation, pricing sanity check, signature.

**Step 8 — Submission**  
SAM.gov / agency portal submission steps. Confirmation record protocol — every submission logged.

### Formatting Rules
- Bold step headers
- No paragraph longer than 5 lines
- Decision points rendered as `IF / THEN` logic blocks
- No helper fluff

---

## File 2: `/agents/bid_architect.md`

### Purpose

Executable Claude Code skill. Registered as `/bid`. Operates as the Sovereign Bidding Orchestrator.

### Skill Metadata

```yaml
name: bid
description: >
  Sovereign Subcontracting Engine for Prime Pathwy. Scouts, analyzes, and drafts
  government bids targeting NAICS 561720 (Janitorial) and 562111 (Hauling).
  Sub-commands: scout | analyze [links] | draft [bid_id].
  Identity: Arthur F. Appling Sr. | EIN: 84-4788578 | DUNS: 12-3035654
```

### Credential Plate (injected into every output header)

Rendered as federal letterhead at the top of every `/bid` command output:

```
═══════════════════════════════════════════════════════════════
  PRIME PATHWY — SOVEREIGN SUBCONTRACTING ENGINE
  Lead Architect:  Arthur F. Appling Sr.
  EIN: 84-4788578  |  DUNS: 12-3035654
  425 Virginia St STE B, Vallejo, CA 94590
  NAICS: 561720 (Janitorial)  |  562111 (Hauling)
═══════════════════════════════════════════════════════════════
```

### Sub-Command: `/bid scout`

**Behavior:**
1. Render Credential Plate
2. Generate 3 ready-to-paste Perplexity prompts:
   - Prompt 1: Active SAM.gov solicitations under $100k for NAICS 561720 in California
   - Prompt 2: Active SAM.gov solicitations under $100k for NAICS 562111 in California
   - Prompt 3: Set-Aside contracts (Small Business / 8(a) / Minority-Owned) for NAICS 561720 and 562111, federal agencies, active
3. Output format: numbered, bold-labeled, paste-ready

### Sub-Command: `/bid analyze [links]`

**Behavior:**
1. Render Credential Plate
2. Accept 1–5 solicitation URLs or pasted solicitation text
3. Generate Manus Core Command covering:
   - Scope of work extraction
   - Submission deadline
   - Set-aside designation (Small Business, 8(a), WOSB, HUBZone, Minority-Owned)
   - Bonding and insurance requirements
   - Incumbent contractor (if disclosed)
4. Produce **Qualification Matrix** — 5 criteria checked against Arthur's credentials:

| Criterion | Check | Status |
|---|---|---|
| NAICS code match | 561720 or 562111 | GREEN / RED |
| Contract value ≤ $100k | Stated value | GREEN / RED |
| Set-Aside designation | Small Business or Open | GREEN / LOW PRIORITY |
| Bonding requirement | Within current capacity | GREEN / YELLOW |
| Location / jurisdiction | CA or federal, remote eligible | GREEN / RED |

5. **Set-Aside Fast-Track Flag:**
   - IF contract is designated Small Business, 8(a), WOSB, or HUBZone → render bold banner: `✦ FAST-TRACK ELIGIBLE — SMALL BUSINESS SET-ASIDE CONFIRMED ✦`
   - IF contract is NOT a set-aside → render: `⚠ LOW PRIORITY — OPEN COMPETITION. DEPRIORITIZE.`

### Sub-Command: `/bid draft [bid_id]`

**Behavior:**
1. Render Credential Plate
2. Generate **Capability Statement** containing:
   - Credential Plate header (federal letterhead style)
   - Core competencies: Janitorial Services (NAICS 561720) and Hauling/Waste Collection (NAICS 562111)
   - Key differentiators: Sovereign System Integration, documented SOPs, small business agility
   - Past performance placeholder (structured for manual fill)
   - Contact block: Arthur F. Appling Sr., 425 Virginia St STE B, Vallejo CA 94590, EIN 84-4788578, DUNS 12-3035654

3. Generate **Proposal Draft** using NEPQ persuasion logic:

   - **Problem Frame:** State the government agency's operational pain — unreliable janitorial coverage, hauling delays, compliance exposure, management overhead of multiple vendors
   - **Implication Layer:** Cost of inaction — failed facility inspections, contract non-compliance penalties, internal staff time wasted managing service gaps
   - **Sovereign System Integration Frame:** Prime Pathwy delivers a Sovereign System Integration — not a labor vendor. We eliminate the agency's management headache by installing a self-managing, documented service system with built-in accountability. The evaluator does not manage us; our system manages itself.
   - **Proof Layer:** Arthur F. Appling Sr. credentials, NAICS alignment, Small Business designation, EIN/DUNS/SAM registration, documented operational SOPs
   - **Commitment Ask:** Direct CTA to the contracting officer — specific, confident, no hedging

4. Output: bold headers, Institutional Grade, PDF-export ready

---

## Constraints & Edge Cases

- **PDF not yet read:** When `government_bid_system.pdf` is confirmed present in repo root, read it and update this spec with any 8-step logic that differs from the user-provided steps.
- **No live API calls:** The skill generates prompts and commands for Perplexity and Manus — it does not call them directly. Arthur executes the generated prompts.
- **Credential immutability:** EIN, DUNS, and address are never inferred or overridden by runtime input. They are constants.
- **NAICS scope lock:** The engine only scouts and analyzes within 561720 and 562111. Out-of-scope NAICS in a contract triggers a RED flag.

---

## Success Criteria

- `/bid scout` produces 3 paste-ready Perplexity prompts with Credential Plate header
- `/bid analyze` produces Manus Core Command + Qualification Matrix with correct Set-Aside flag logic
- `/bid draft` produces Capability Statement + NEPQ Proposal with "Sovereign System Integration" framing and Credential Plate
- Both files pass WAT framework placement: `/workflows/` and `/agents/`
- EIN `84-4788578` and DUNS `12-3035654` appear correctly in every output
- No output begins without the Arthur F. Appling Sr. Credential Plate

---

*Prime Pathwy — Sovereign Systems for Operators Who Are Done With Chaos.*  
*Arthur F. Appling Sr. | Lead Technical Architect*
