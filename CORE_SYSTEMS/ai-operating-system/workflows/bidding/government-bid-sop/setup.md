# Sovereign Subcontracting Engine SOP — Setup
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

### [GROUND TRUTH GATE]

Before executing any step in this SOP, confirm the following are true in your current environment.
Unconfirmed state = do not proceed. Request Ground Truth Audit.

- [ ] SAM.gov registration is active — EIN 84-4788578, DUNS 12-3035654 confirmed (verify at sam.gov — do not assume)
- [ ] NAICS 561720 and 562111 are both listed and active on SAM.gov entity profile
- [ ] Small Business designation is confirmed active on SAM.gov
- [ ] Legal pages are live at local path or deployed URL: `privacy.html`, `terms.html`, `accessibility.html`
- [ ] `contact@primepathwy.com` is the active contact (or `operations@primepathwy.com` when live)
- [ ] Perplexity is accessible for Step 3
- [ ] Manus is accessible for Step 4
- [ ] Bid Architect agent is loaded if using `/bid` commands

---

## Step-by-Step Execution

### Step 1 — System Objective & Legal Verification

**Command:**
```
Verify legal infrastructure before any bid activity:
  Open: Prime_Pathwy_Turnover_System/privacy.html → confirm EIN 84-4788578 and address present
  Open: Prime_Pathwy_Turnover_System/terms.html → confirm No Verbal Order Rule clause present
  Open: Prime_Pathwy_Turnover_System/accessibility.html → confirm WCAG 2.1 Level AA cited
```

**Pass Criteria:** All three pages load and contain required content.

**Error Map:**
| Error | Cause | Resolution |
|-------|-------|------------|
| Page not found | Server not running | Start server: `node Prime_Pathwy_Turnover_System/server.js` |
| EIN missing from Privacy Policy | Template not updated | Edit privacy.html to include EIN 84-4788578 and address |

---

### Step 2 — Credential Verification

**Command:**
```
Confirm Credential Plate values before proceeding:
  EIN: 84-4788578
  DUNS: 12-3035654
  NAICS: 561720 + 562111
  Address: 425 Virginia St STE B, Vallejo, CA 94590
  SAM.gov: Active
```

**Pass Criteria:** All values match SAM.gov registration exactly.

---

### Steps 3–8 — Full SOP Execution

Load `agents/marketing-engine/source.md` and execute via slash commands:

**Step 3 — Solicitation Scout:**
```
/bid scout
```
Copy prompts into Perplexity. Log results: `logs/bid_scout_YYYY-MM-DD.md`

**Step 4 — Solicitation Analysis:**
```
/bid analyze [URL or pasted solicitation text]
```
Copy Manus Core Command into Manus. Record Qualification Matrix result.

**Step 5 — Eligibility Decision:**
```
GREEN (Fast-Track) → proceed to Step 6
LOW PRIORITY / RED → log disqualification, stop
```

**Step 6 — Document Generation:**
```
/bid draft [solicitation_number]
```
Complete PAST PERFORMANCE section manually before submission.

**Step 7 — Pre-Submission Checklist (5-Point Gate):**
- [ ] EIN 84-4788578 and DUNS 12-3035654 match SAM.gov exactly
- [ ] Scope match confirmed — services align with solicitation Statement of Work
- [ ] Small Business designation active on SAM.gov
- [ ] Proposed price competitive but above operational cost
- [ ] Arthur F. Appling Sr. signature block present on all documents

**Step 8 — Submission + Log:**
Submit via SAM.gov portal. Screenshot confirmation. Log in `logs/bid_submissions.md`.

**Pass Criteria (Step 8):** Confirmation number or screenshot on file. Submission logged.

**Error Map:**
| Error | Cause | Resolution |
|-------|-------|------------|
| SAM.gov rejects upload | File format incorrect | Convert to PDF. Confirm file size under portal limit. |
| Registration not found | DUNS/EIN mismatch | Verify exact values on SAM.gov entity page before resubmitting |
