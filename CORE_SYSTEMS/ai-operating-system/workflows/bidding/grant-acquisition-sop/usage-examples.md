# Sovereign Grant Acquisition Engine SOP — Usage Examples
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Example 1 — California State Grant Application

**Scenario:** CalRecycle grant for waste hauling infrastructure identified. GREEN eligibility confirmed.

**Sequence:**
1. Confirm Ground Truth Gate (all identity checklist items confirmed)
2. Confirm legal pages live (Step 2)
3. Load Community Sovereignty Narrative — tailor final paragraph to CalRecycle's stated community goals
4. Generate 5-Document Package:
   - Executive Summary: CalRecycle program name + CFDA number + Community Sovereignty Statement + ask
   - Org Profile: EIN, DUNS, address, NAICS, SAM.gov status
   - Digital Presence Evidence: attach `privacy.html` and `accessibility.html`
   - Community Impact Narrative: Vallejo blight reduction + housing availability + local employment
   - Budget Justification: equipment + workforce training + technology line items
5. Run 7-Point Pre-Submission Checklist
6. Submit at grants.ca.gov → screenshot confirmation → log in `logs/grant_submissions.md`

---

## Example 2 — USPS RPDC Logistics Subcontract

**Scenario:** USPS solicitation for hauling route from San Francisco RPDC (Richmond, CA) identified.

**Sequence:**
1. Confirm NAICS 484110 eligibility (not 561720/562111 — this is a freight NAICS)
2. Confirm PS Form 5436 filed — mailing list registration confirmed
3. Run Perplexity Prompt 3 (USPS logistics) — collect solicitation number
4. Run Eligibility Matrix: NAICS 484110 match, contract value, geography (27mi from Vallejo — in scope)
5. Generate application package per Step 6 — adapt Capability Statement for freight scope
6. Submit via USPS eSourcing portal or SAM.gov per solicitation instructions

---

## Example 3 — MBE Certification YELLOW Flag

**Scenario:** MBDA grant requires Minority Business Enterprise certification. Not yet obtained.

**Decision:**
```
Grant requires MBE/DBE certification → STATUS: YELLOW
→ Do NOT apply yet — certification is a prerequisite
→ Log program with follow-up date: apply after MBE certification is issued
→ Initiate MBE certification process in parallel
```

**Action:** Document program in `logs/grant_scout_YYYY-MM-DD.md` as YELLOW — pending certification. Calendar follow-up for application submission date.

---

## Anti-Patterns

- **DO NOT** submit any grant application without running the 7-Point Pre-Submission Checklist
- **DO NOT** submit a narrative with generic boilerplate — every narrative must reference Vallejo specifically and apply the Community Sovereignty framework
- **DO NOT** leave budget justification with vague line items — every dollar must map to a specific operational outcome
- **DO NOT** pursue grants requiring 501(c)(3) status — Prime Pathwy is a for-profit entity and is disqualified automatically
- **DO NOT** skip the follow-up calendar entry — every submission must have a dated follow-up in `logs/grant_submissions.md`
