# PRIME PATHWY — DAILY PROCUREMENT MONITORING WORKFLOW
**Classification:** Sovereign Intelligence | Operational Use Only
**Compiled:** May 2026 | **Vault Section:** Workflows
**Version:** 1.0 | **Status:** Active

---

## SECTION 1 — OBJECTIVE

This Standard Operating Procedure (SOP) defines the daily process for monitoring global procurement portals, identifying high-value contract opportunities, and updating the Prime Pathwy Global Sovereign Intelligence Vault.

---

## SECTION 2 — EXECUTION STEPS

### 2.1 Daily Portal Querying

Every business day at 08:00 AM, the Sovereign Intelligence Agent must query the following portals for new solicitations matching target NAICS codes:

1. **SAM.gov:** Query for federal solicitations matching NAICS codes:
   - `541611` (Administrative Management Consulting)
   - `561210` (Facilities Support Services)
   - `518210` (Data Processing & Hosting)
2. **SamSearch:** Run natural language queries to aggregate state, local, and education (SLED) opportunities.
3. **eSupply (Dubai):** Check for active Middle East consulting and technology modernization contracts.

---

### 2.2 Opportunity Qualification

For every identified opportunity, apply the following qualification criteria:

| Criterion | Pass Threshold | Action if Failed |
|---|---|---|
| Estimated Contract Value | >$250,000 | Archive in secondary list |
| Set-Aside Type | 8(a), HUBZone, SDVOSB, or WOSB | Disqualify if open-market with high competition |
| Automation Potential | High (scope indicates manual processes) | Archive in secondary list |
| Technology Gaps | Visible (scope mentions legacy systems) | Archive in secondary list |

---

### 2.3 Vault Database Update

1. Open `/home/ubuntu/PRIME_PATHWY_VAULT/temporary/procurement_database.csv`.
2. Append qualified opportunities to the database, ensuring all fields are complete (ID, Agency, Title, Scope, Value, Incumbent, NAICS, Renewal Window, Portal, Status).
3. Update the `/home/ubuntu/PRIME_PATHWY_VAULT/MASTER_MANIFEST.md` to reflect the latest file status.

---

## SECTION 3 — VALIDATION CONTRACT

### 3.1 Exact Command
To validate that the procurement database has been updated correctly, run:
```bash
head -n 5 /home/ubuntu/PRIME_PATHWY_VAULT/temporary/procurement_database.csv
```

### 3.2 Pass Criteria
The command must output the header row followed by at least 4 valid opportunity records.

### 3.3 Error Map
- **Error:** `File not found`
- **Fix:** Run `python3 /home/ubuntu/PRIME_PATHWY_VAULT/tools/generate_vault_data.py` to regenerate the database.

---

*Workflow compiled by Prime Pathwy Sovereign Intelligence System | May 2026*
