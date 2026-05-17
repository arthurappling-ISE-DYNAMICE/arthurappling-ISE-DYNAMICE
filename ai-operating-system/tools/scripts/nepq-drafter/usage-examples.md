# NEPQ Drafter — Usage Examples
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Example 1 — Default Run (Solano Property Turnover Lead)

```bash
cd C:/Users/arthu/GeminiEcosystem/tools
node nepq_drafter.js
```

**Output:**
```
NEPQ Framework Loaded. Ready to draft outreach.
```

**Template loaded:**
```
Connection:  "I noticed your recent turnover activity in Solano..."
Problem:     "How are you currently handling the audit-trail for chargeback defense?"
Solution:    "We install the Sovereign System that handles the documentation for you."
Commitment:  "Does it make sense to see how this fits your current workflow?"
```

---

## Example 2 — Hauling/Logistics Vertical (Consulting Pipeline)

Edit template before run:

```javascript
const nepqTemplate = {
    connection: "I noticed you're running dispatch for hauling jobs in Vallejo...",
    problem: "How are you currently tracking driver hours and job completion across multiple sites?",
    solution: "We install the Sovereign System that eliminates the manual tracking and gives you a live dashboard.",
    commitment: "Does it make sense to see how this fits your current operation?"
};
```

```bash
node nepq_drafter.js
```

**Pass Criteria:** Customized template logged to console. Copy-paste ready for email or LinkedIn DM.

---

## Example 3 — Browser Scout Pipeline Integration

```bash
# Step 1: Run scout to generate leads
cd C:/Users/arthu/GeminiEcosystem/tools/market_intelligence
node scout.js

# Step 2: Review top_leads.md — select top prospect
# Step 3: Customize nepq_drafter.js template for that prospect's industry
# Step 4: Run drafter
cd ../
node nepq_drafter.js
```

**Pass Criteria:** NEPQ outreach draft produced. Send via email (sufficient) — written confirmation of receipt required per Rule Zero.

---

## Anti-Patterns

- **DO NOT** send default Solano template to a non-real-estate prospect — wrong `connection` and `problem` frame destroys credibility
- **DO NOT** add a 5th NEPQ stage — the 4-stage sequence (Connection → Problem → Solution → Commitment) is the protocol; extensions beyond this are not NEPQ
- **DO NOT** use for LinkedIn outreach without confirming ToS compliance for automated messaging
- **DO NOT** skip the Commitment close — it is the conversion hinge; leaving it out leaves the prospect without a clear next step
