# Browser Scout Protocol — Setup
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

### [GROUND TRUTH GATE]

Before executing scout.js, confirm the following are true.
Unconfirmed state = do not proceed. Request Ground Truth Audit.

- [ ] Node.js v22.17.0+ confirmed: `node --version`
- [ ] Playwright v1.59.1+ confirmed: `npx playwright --version`
- [ ] Chromium binary installed: `npx playwright install chromium` (one-time)
- [ ] `tools/market_intelligence/` directory exists — scout.js write target
- [ ] `scout.js` file built and present at `tools/market_intelligence/scout.js`
- [ ] SBDC meeting (April 24, 2026) complete OR private sector track approved — see risks-and-limitations.md
- [ ] Ethical guardrails reviewed: public listings only, robots.txt respected, 2-second rate limit enforced

---

## Installation

**Step 1 — Verify runtime:**
```bash
node --version
# Expected: v22.17.0 or higher

npx playwright --version
# Expected: Version 1.59.1 or higher
```

**Step 2 — Install Chromium (one-time):**
```bash
npx playwright install chromium
```

**Pass Criteria:** Chromium installs without error. `npx playwright install chromium` exits 0.
**Error Map:**

| Error | Cause | Resolution |
|-------|-------|------------|
| `node: command not found` | Node.js not on PATH | Install Node.js v22+ from nodejs.org |
| Playwright version mismatch | Stale npx cache | `npm install -D playwright@latest` in project root |
| Chromium install fails — network error | Firewall or proxy blocking download | Run on direct connection; or download offline binary |

---

## scout.js Build Specification

`scout.js` does not exist yet — build required. Specification:

```javascript
// tools/market_intelligence/scout.js
// Playwright headless Google Maps scraper — Prime Pathwy lead intel

import { chromium } from 'playwright';
import { writeFileSync, appendFileSync } from 'fs';

const QUERIES = [
  'logistics companies Vallejo CA',
  'hauling companies Vallejo CA',
  'freight companies Vallejo CA',
  'last-mile delivery Vallejo CA'
];

const RATE_LIMIT_MS = 2000; // ethical guardrail — 2 seconds between requests

// Output: tools/market_intelligence/leads_vallejo.json
// Output: tools/market_intelligence/lead_log.csv
// Output: tools/market_intelligence/top_leads.md
```

**Pass Criteria:** scout.js executes, writes leads_vallejo.json, appends to lead_log.csv, produces top_leads.md. No ToS-violating targets scraped.

---

## Activation Command

```bash
cd C:/Users/arthu/GeminiEcosystem/tools/market_intelligence
node scout.js
```
