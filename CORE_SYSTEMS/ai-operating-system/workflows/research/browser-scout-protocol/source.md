# BROWSER SCOUT PROTOCOL
## Zero-Labor Lead Scraping for Prime Pathwy
## STATUS: STAGED — Execute after SBDC meeting (April 24, 2026)

---

## DEPENDENCIES (Already Installed)
- **Playwright v1.59.1** — available via `npx playwright`
- **Node.js v22.17.0** — runtime confirmed
- **Browser binaries** — install once with: `npx playwright install chromium`

No additional installs required. Playwright is the recommended choice over Puppeteer:
- Built-in waiting/retry logic (fewer flaky scrapes)
- Stealth mode via `playwright-extra` + `puppeteer-extra-plugin-stealth`
- Handles JS-rendered pages (Google Maps, LinkedIn, etc.)

---

## ONE ACTIONABLE STEP (Post-SBDC)

```bash
cd C:/Users/arthu/GeminiEcosystem/tools/market_intelligence
npx playwright install chromium
node scout.js
```

`scout.js` will be built to:
1. Open headless Chromium
2. Search Google Maps for "logistics companies Vallejo CA" + "hauling companies Vallejo CA"
3. Extract: business name, phone, address, employee count (if listed), website
4. Write results to `tools/market_intelligence/leads_vallejo.json`
5. Append a timestamped row to `tools/market_intelligence/lead_log.csv`

---

## TARGET PROFILE (Prime Pathwy Lead Criteria)
- Geography: Vallejo, CA + 30-mile radius (Benicia, Fairfield, Napa, Richmond)
- Industry: Logistics, hauling, freight, last-mile delivery, warehouse ops
- Size: 10–200 employees (owner-operated to mid-market)
- Signal: Job postings for drivers/dispatchers = active growth = consulting opportunity

---

## SCOUT WORKFLOW (Full Sequence)
```
Google Maps scrape → dedupe against existing leads → score by signal strength
→ output top 10 to /market_intelligence/top_leads.md
→ optional: auto-draft outreach via NEPQ drafter (tools/nepq_drafter.js)
```

---

## ETHICAL GUARDRAILS
- Scrape public business listings only (Google Maps, Yelp, Yellow Pages)
- Respect `robots.txt` on all targets
- No LinkedIn scraping (ToS violation)
- Rate-limit: 2-second delay between page requests

---

## NEXT TRIGGER
**After April 24 SBDC meeting closes** — activate with:
`cd C:/Users/arthu/GeminiEcosystem/tools/market_intelligence && node scout.js`
