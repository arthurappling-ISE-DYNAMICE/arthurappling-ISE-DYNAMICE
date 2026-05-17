# Sovereign Grant Acquisition Engine SOP — Setup
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

### [GROUND TRUTH GATE]

Before executing any step in this SOP, confirm the following are true in your current environment.
Unconfirmed state = do not proceed. Request Ground Truth Audit.

- [ ] EIN 84-4788578 confirmed active with IRS (EIN confirmation letter or IRS online verification)
- [ ] DUNS 12-3035654 confirmed active on SAM.gov — not expired, not under review
- [ ] Business address `425 Virginia St STE B, Vallejo, CA 94590` matches all registered records
- [ ] NAICS 561720 and 562111 both listed on SAM.gov entity profile
- [ ] CA Secretary of State registration is current — no lapsed status
- [ ] No outstanding tax liens or delinquencies (state or federal)
- [ ] Legal pages are live and accessible: `privacy.html`, `accessibility.html`, `terms.html`
- [ ] Perplexity accessible for Step 5 grant scouting

---

## Step-by-Step Execution

### Step 1 — Identity & Eligibility Verification

**Command:**
```
Run Identity Verification Checklist (Step 2 in source.md):
  EIN: 84-4788578 — confirm active with IRS
  DUNS: 12-3035654 — confirm active on SAM.gov
  Address: 425 Virginia St STE B, Vallejo, CA 94590 — confirm matches all records
  NAICS: 561720 + 562111 — confirm both on SAM.gov profile
  Small Business designation: confirm active
  CA Secretary of State: confirm registration current
```

**Pass Criteria:** All 7 identity checklist items confirmed. No outstanding liens.

**Error Map:**
| Error | Cause | Resolution |
|-------|-------|------------|
| DUNS expired on SAM.gov | Annual renewal missed | Renew at SAM.gov entity management — allow 5–7 business days |
| NAICS code missing | Not added at registration | Update entity profile on SAM.gov |
| CA SOS registration lapsed | Annual renewal missed | File Statement of Information with CA Secretary of State |

---

### Step 2 — Digital Presence Compliance (Step 3 in source.md)

**Command:**
```
Verify all three legal pages load and contain required content:
  privacy.html → confirm CCPA language + EIN 84-4788578 + data not sold to third parties
  accessibility.html → confirm WCAG 2.1 Level AA + color contrast ratio cited
  terms.html → confirm No Verbal Order Rule clause present
```

**Pass Criteria:** All three pages load. All required content present.

---

### Steps 3–8 — Full SOP Execution

**Step 3 — Narrative Preparation:**
Load Community Sovereignty Narrative from source.md Step 4. Tailor final paragraph to each grant's community goals.

**Step 4 — USPS Registration (one-time):**
```
File PS Form 5436 with USPS Transportation Contracts
→ adds Prime Pathwy to HCR and RPDC solicitation mailing list
Target: San Francisco CA RPDC, 2501 Rydin Rd., Richmond CA 94850
```

**Pass Criteria:** Confirmation of mailing list addition on file.

**Step 5 — Grant Scouting:**
```
Run 3 Perplexity prompts from source.md Step 5:
  Prompt 1: California State grants (grants.ca.gov)
  Prompt 2: Federal Small Business grants (Grants.gov / SBA.gov)
  Prompt 3: USPS logistics subcontracts (SAM.gov + USPS eSourcing)
Log results: logs/grant_scout_YYYY-MM-DD.md
```

**Step 6 — Application Package Generation:**
Generate 5-document package per qualified (GREEN) grant program.

**Step 7 — Pre-Submission Checklist (7-Point Gate):**
- [ ] Identity Lock: EIN and DUNS match all documents
- [ ] Digital Presence: privacy.html and accessibility.html attached/linked
- [ ] Narrative Integrity: Community Sovereignty narrative — no generic boilerplate
- [ ] NEPQ Frame: Problem → Implication → Sovereign System → Proof → Ask intact
- [ ] Budget Justified: every line item maps to specific outcome
- [ ] Signature: Arthur F. Appling Sr. on all submitted documents
- [ ] Confirmation Protocol: screenshot saved to `logs/grant_submissions.md`

**Step 8 — Submission + Log:**
Submit via appropriate portal. Log in `logs/grant_submissions.md`.

**Pass Criteria:** Confirmation number or screenshot on file. Submission logged with follow-up deadline.
