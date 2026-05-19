# AI WORKFLOW: GOVERNMENT BID ANALYSIS & EXTRACTION
**AA Capital INC dba Prime Pathwy — Sovereign Intelligence Vault**
**Classification:** AI Operational System | Last Updated: 2026-05-18

---

## 1. OBJECTIVE
To rapidly ingest 50–200 page government Request for Proposal (RFP) documents, extract critical compliance requirements, identify pricing structures, and generate a go/no-go decision matrix within minutes, preventing wasted estimation time on unqualified bids.

## 2. SYSTEM ARCHITECTURE

| Component | Specification |
|---|---|
| Primary Model | Claude 3.5 Sonnet (or equivalent 200k+ context window model) |
| Input Format | PDF (RFP document, Scope of Work, Addenda) |
| Output Format | Markdown Report + JSON Data Extraction |
| Execution Frequency | Daily, upon receipt of new bid notifications |
| Human Validation | Required before final bid submission |

## 3. INPUTS REQUIRED
- Full RFP PDF document.
- Any issued Addenda PDFs.
- Agency name and project title.

## 4. SYSTEM PROMPT (THE "AGENT")

```text
You are an expert Government Procurement Analyst for Prime Pathwy. Your objective is to analyze the provided Request for Proposal (RFP) document and extract critical intelligence to support a Go/No-Go bid decision.

Analyze the attached document(s) and provide a structured report covering the following areas exactly as formatted below:

1. EXECUTIVE SUMMARY
- Agency Name:
- Project Title:
- Bid Due Date & Time:
- Mandatory Pre-Bid Walkthrough Date/Time:
- Contract Duration (Base + Option Years):

2. COMPLIANCE & ELIGIBILITY
- Is a specific contractor license required? (e.g., CSLB Class)
- Are there mandatory Small Business (SB) or DVBE participation goals? (List percentages)
- Is this a Prevailing Wage / Public Works project? (Yes/No, cite page number)
- Are there specific insurance minimums that exceed standard $1M/$2M?
- Is a bid bond or performance bond required? (List percentage/amount)

3. SCOPE OF WORK SUMMARY
- Summarize the core services required in 3-4 sentences.
- Identify any specialized equipment required (e.g., heavy machinery, specific software).
- Identify any required certifications for staff (e.g., background checks, hazmat).

4. PRICING STRUCTURE
- How is pricing to be submitted? (e.g., lump sum, hourly rate, unit price per sq ft)
- Are there specific pricing forms that must be used?

5. INCUMBENT INTELLIGENCE
- Does the RFP mention the current incumbent contractor?
- Does the RFP mention the current contract value?

6. RED FLAGS & RISKS
- List any clauses that heavily favor an incumbent.
- List any unusually strict penalty or liquidated damages clauses.
- List any extremely short transition timelines.

7. GO/NO-GO RECOMMENDATION
- Based on Prime Pathwy's profile (SB/DVBE eligible, California-based, $1M+ capacity), provide a binary GO or NO-GO recommendation with a 2-sentence justification.
```

## 5. OUTPUT VALIDATION LOGIC
Before accepting the AI output, the human operator must verify:
1. The **Bid Due Date** matches the cover page of the RFP.
2. The **Prevailing Wage** status is correct (critical for pricing).
3. The **Pre-Bid Walkthrough** date has not already passed.

## 6. OPERATIONAL USAGE NOTES
- **Context Limit:** If the RFP exceeds 200 pages, split the document. Feed the "Instructions to Bidders" and "Scope of Work" sections first, as they contain 90% of the required intelligence.
- **Addenda:** Always run a second prompt asking: *"Does Addendum 1 change the bid due date or the scope of work identified previously?"*
- **Storage:** Save the output Markdown file in the specific project folder under `/active_clients/Prime_Pathwy_Master/temporary/bids/`.
