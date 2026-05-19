# NEPQ Drafter — Setup
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

### [GROUND TRUTH GATE]

Before running nepq_drafter.js, confirm the following are true.
Unconfirmed state = do not proceed. Request Ground Truth Audit.

- [ ] Node.js v22+ available: `node --version`
- [ ] `tools/nepq_drafter.js` exists at correct path
- [ ] Target prospect identified — do not run with default Solano template in live outreach without customization
- [ ] Browser Scout Protocol has been run if using scout-generated leads — top_leads.md must exist

---

## Run the Drafter

**Command:**
```bash
cd C:/Users/arthu/GeminiEcosystem/tools
node nepq_drafter.js
```

**Expected output:**
```
NEPQ Framework Loaded. Ready to draft outreach.
```

**Pass Criteria:** Script exits 0. NEPQ template object is accessible in scope for downstream use or customization.

**Error Map:**

| Error | Cause | Resolution |
|-------|-------|------------|
| `node: command not found` | Node.js not on PATH | Install Node.js v22+ from nodejs.org |
| `Cannot find module 'fs'` | Node.js stdlib unavailable (rare) | Reinstall Node.js |
| Template fields not customized | Default Solano template sent to wrong vertical | Always update `connection`, `problem`, `solution`, `commitment` for each new target profile before use |

---

## Customizing the Template

Edit `source.js` to target a new vertical:

```javascript
const nepqTemplate = {
    connection: "I noticed your [SPECIFIC SIGNAL] in [GEOGRAPHY]...",
    problem: "How are you currently handling [SPECIFIC BOTTLENECK]?",
    solution: "We install the Sovereign System that handles [SPECIFIC PAIN] for you.",
    commitment: "Does it make sense to see how this fits your current workflow?"
};
```

**Verticals in scope:** Property turnover (real estate), hauling/logistics (consulting), government contractors (bidding).

Each vertical requires its own `connection` and `problem` field. `solution` and `commitment` are stable across verticals.
