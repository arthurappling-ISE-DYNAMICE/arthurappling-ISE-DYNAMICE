# PRIME PATHWY: CLIENT ONBOARDING & COMPLIANCE SOP
## CATEGORY B — OPERATIONAL INFRASTRUCTURE

> **Sovereign System Statement:** This Standard Operating Procedure (SOP) governs the dual-grant onboarding and compliance pipeline for Prime Pathwy clients, enforcing UPS-standard chain-of-custody, telemetry tracking, and zero-inference compliance to secure up to $155,000 in non-dilutive capital.

---

## DOWNLOAD & USAGE INSTRUCTIONS
* **File Location in Repository:** `/workflows/CLIENT_ONBOARDING_COMPLIANCE_SOP.md`
* **Local Download Command:** `gh file view workflows/CLIENT_ONBOARDING_COMPLIANCE_SOP.md > CLIENT_ONBOARDING_COMPLIANCE_SOP.md`
* **Execution/Audit Command:** `python3 tools/sovereign_router.py --file workflows/CLIENT_ONBOARDING_COMPLIANCE_SOP.md --category B --type workflows`

---

## I. THE ONBOARDING PIPELINE (UPS-STANDARD FLOW)

To scale operations efficiently, client onboarding is modeled on the **UPS Package Flow Technology (PFT)** pipeline, establishing a clear, linear chain-of-custody from initial contract signing to final grant disbursement [1].

```
[1. INTAKE AUDIT] ──► [2. COMPLIANCE CHECK] ──► [3. DUAL-GRANT PORTAL] ──► [4. SYSTEM INSTALL] ──► [5. RETENTION AUDIT]
```

---

## II. THE 5-PHASE ONBOARDING WORKFLOW

### Phase 1: Client Intake & Data Sovereignty
1. **Intake Form:** Administer the Prime Pathwy Client Intake Questionnaire.
2. **Data Isolation:** Create a secure, isolated directory under `/temporary/clients/[client_name]` to store all proprietary business records, tax filings, and vehicle telematics data.
3. **Establish Chain-of-Custody:** Log all received client documents in the local client ledger to prevent information leakage or compliance gaps.

### Phase 2: Dual-Grant Compliance Check
Before submitting applications, the operator must verify the client's eligibility across both grant programs simultaneously [2] [3]:

| Eligibility Metric | BAAQMD VIP Requirement | Solano Workforce Stability Grant |
| :--- | :--- | :--- |
| **Fleet Size** | 20 or fewer vehicles | 500 or fewer employees (SBA small business) |
| **Location** | Operating within BAAQMD jurisdiction | Physical location in Solano County |
| **Baseline Compliance** | Operational vehicle, CA registered 24 mos | Active local business license, in good standing |
| **Workforce Requirement** | N/A | Must have 1+ employees (excluding owner) |
| **Retention Commitment** | Scrap old vehicle within 60 days | Commit to 50%+ employee retention for 6 months |

### Phase 3: Dual-Grant Portal Submission
1. **Solano WDB Portal:**
   * Prepare the written **Layoff Aversion Plan** using the template in `workflows/SOLANO_WORKFORCE_STABILITY_GRANT_SYSTEM.md`.
   * Upload local business license, signed IRS Form W-9, and documented economic impact proof.
   * **SOP Standard:** Submit within 48 hours of intake completion.
2. **BAAQMD VIP Portal:**
   * Match client with an approved BAAQMD VIP Dealership [4].
   * Compile 24 months of vehicle registration, insurance, and telematics logs.
   * Submit the application package through the approved dealer's portal.

### Phase 4: UPS-Standard System Installation
Upon grant award, initiate the operational modernization package:
1. **Smart Manifest System (PFT-Standard):** Configure digital manifests to automate scheduling.
2. **Mobile Driver Interface (DIAD-Standard):** Deploy ruggedized tablets with local, offline-capable mobile web hubs to capture digital signatures and GPS timestamps.
3. **Route Optimization (ORION-Lite):** Run the routing engine to sequence daily stops, reducing mileage by 8–12% [1].

### Phase 5: 6-Month Post-Award Retention Audit
1. **Filing:** Compile all technology receipts, software invoices, and training completion logs.
2. **Headcount Verification:** Verify client employee headcount to confirm compliance with the 50% retention mandate.
3. **Report Submission:** File the 6-month report with the Solano WDB to finalize the grant contract and secure the audit-ready trail.

---

## III. VALIDATION CONTRACT
* **Exact Command:** `python3 tools/sovereign_router.py --file workflows/CLIENT_ONBOARDING_COMPLIANCE_SOP.md --category B --type workflows`
* **Pass Criteria:** System registers the onboarding SOP in the master execution log as `COMPLIANT`.
* **Error Map:**
  * *Validation Failure:* Ensure the file resides in `/workflows` and is formatted as Markdown.

---

## IV. REFERENCES
[1] [UPS Supply Chain Solutions & Route Optimization Systems](https://www.ascendanalytics.co/post/how-upss-orion-system-slashed-delivery-costs-with-route-optimization)
[2] [BAAQMD Heavy Duty Vehicles Program Summer 2026 Window](https://www.baaqmd.gov/en/funding-and-incentives/businesses-and-fleets/trucks)
[3] [Solano Workforce Stability Grant Program Details PDF](https://solanoemployment.org/wp-content/uploads/2022/03/Workforce-Stability-Grant-Program-Details.pdf)
[4] [BAAQMD Carl Moyer Program & Approved Dealerships](https://www.baaqmd.gov/funding-and-incentives/funding-sources/carl-moyer-program)
