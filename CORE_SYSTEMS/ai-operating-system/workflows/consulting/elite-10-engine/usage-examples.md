# Elite 10 Engine — Sovereign Bid Acquisition System — Usage Examples
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Example 1 — Week 1 Immediate Pipeline (Micro-Purchase)

**Scenario:** SB cert pending. Need cash flow now. Target: City of Vallejo and Solano County micro-purchases.

**Action:**
```
Week 1, Day 1: Call City of Vallejo Purchasing — request informal vendor list addition
Week 1, Day 2: Call Solano County Purchasing — register for bid notifications
Week 1, Day 3–5: Monitor both portals for informal bid requests under $15K
```

**Pitch to use:**
```
"We are a certified local Small Business in Vallejo, NAICS 561720/562111,
available for same-week janitorial and hauling service.
Fixed written quote, 2–3 day turnaround, before/after photo documentation."
```

**Target:** 2–4 micro-purchase contracts/month = $15K–$40K immediate pipeline.

---

## Example 2 — Post-SB Cert: Cal eProcure SB/DVBE Activation

**Scenario:** CA Small Business certification issued. Activate Cal eProcure SB/DVBE Option tier.

**Action:**
```
1. Log into caleprocure.ca.gov
2. Update entity profile — add SB certification number and issuance date
3. Enable SB/DVBE Option filter on bid search
4. Set email alerts for NAICS 561720 and 562111 under SB/DVBE Option category
5. Target agencies: Caltrans, CDCR, DGS, state universities in Northern CA
```

**Pass Criteria:** SB/DVBE Option filter active. Email alerts configured for both NAICS codes.

---

## Example 3 — TypeScript Schema Integration

**Scenario:** Developer is building a bid tracking dashboard. Need to implement `BidRecord` interface.

**From source.md:**
```typescript
interface BidRecord {
  readonly id: string
  source: BidSource
  type: string
  naics: NaicsCode[]
  threshold: BidThreshold
  status: BidStatus
  lastChecked?: string   // ISO 8601 date string
  notes?: string
}
```

**Usage:** Instantiate for each pipeline source. `status` field maps to Bid Pipeline Tracker states. `lastChecked` drives the Monday/Thursday monitoring cadence alert.

---

## Anti-Patterns

- **DO NOT** pursue Cal eProcure SB/DVBE contracts before SB cert is issued — applications will be rejected
- **DO NOT** skip the local micro-purchase track while waiting for larger contracts — $15K–$40K/month immediate pipeline is available now without bonding
- **DO NOT** check SAM.gov on days other than Monday and Thursday — mid-week checks waste time without proportional results
- **DO NOT** use the bid tracker as a static document — update `lastChecked` and `status` after every monitoring cycle
