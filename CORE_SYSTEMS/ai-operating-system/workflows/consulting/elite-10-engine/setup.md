# Elite 10 Engine — Sovereign Bid Acquisition System — Setup
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

### [GROUND TRUTH GATE]

Before activating the bid pipeline, confirm the following are true in your current environment.
Unconfirmed state = do not proceed. Request Ground Truth Audit.

- [ ] SAM.gov registration active: EIN 84-4788578, NAICS 561720 + 562111 (484110 if USPS track active)
- [ ] Cal eProcure account created at caleprocure.ca.gov (free registration — does not require SB cert)
- [ ] SB certification status known: Active / Pending — affects Cal eProcure SB/DVBE tier access
- [ ] City of Vallejo Purchasing contact identified (cityofvallejo.net → Finance → Purchasing)
- [ ] Solano County Purchasing contact identified (solanocounty.com → Departments → Purchasing)
- [ ] GSA Advantage vendor registration status known (gsaadvantage.gov)

---

## Execution Sequence — Ordered by Speed to First Dollar

### Week 1 — Local Micro-Purchase Activation

**Step 1 — City of Vallejo Vendor List:**
```
Call: City of Vallejo Purchasing Division
URL: cityofvallejo.net → City Hall → Finance → Purchasing
Ask: "We are a certified local Small Business in Vallejo, NAICS 561720/562111.
We would like to be added to your informal vendor list for janitorial and hauling services."
```
**Pass Criteria:** Added to vendor notification list. Contact name and email on file.

**Step 2 — Solano County Vendor Registration:**
```
Call: Solano County Purchasing Division
URL: solanocounty.com → Departments → Purchasing → Open Bids
Ask: "We are a Vallejo-based Small Business, NAICS 561720/562111.
We would like to register for bid notifications for janitorial and hauling contracts."
```
**Pass Criteria:** Registered for bid notifications. Contact name on file.

---

### Week 2 — State + Federal Pipeline

**Step 3 — Cal eProcure Registration:**
```
Register at: caleprocure.ca.gov
Set email alerts for NAICS 561720 and 562111
Note: SB/DVBE Option filter activates after SB cert is issued
```
**Pass Criteria:** Account active. Email alerts configured. SB/DVBE filter status noted.

**Step 4 — GSA Advantage Vendor Registration:**
```
Register at: gsaadvantage.gov
NAICS: 561720 (Janitorial) | 484110 (Freight/Micro-purchases)
Target: Federal facilities in Solano County / Vallejo corridor
```
**Pass Criteria:** GSA Advantage vendor profile active.

**Step 5 — SAM.gov Federal Pipeline (Monday/Thursday cadence):**
```
Filter: NAICS 561720 / 562111 / 484110 + SB Set-Aside + Active + California
Size sweet spot: $25K–$250K
Run /bid scout via Bid Architect agent for prompt generation
```

---

### Error Map (All Steps)

| Error | Cause | Resolution |
|-------|-------|------------|
| Cal eProcure SB/DVBE filter inaccessible | SB cert not yet issued | Note status: Pending. Revisit when cert issued. |
| City/County contact not responding | Wrong department contacted | Check Purchasing Division directly — not Public Works or Finance |
| SAM.gov registration not found | Registration lapsed or NAICS missing | Verify at sam.gov entity management before Monday cycle |
