# Browser Scout Protocol — Summary
**Classification:** Operational
**Category:** Workflow / Research / Lead Intelligence
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy
**Last Updated:** 2026-05-17

---

## Purpose

Zero-labor lead scraping engine for Prime Pathwy consulting pipeline. Headless Playwright-driven scrape of Google Maps and public business listings targeting logistics and hauling operators in Vallejo, CA and 30-mile radius. Produces structured lead data (JSON) and ranked prospect list (Markdown) for NEPQ outreach sequencing.

---

## Practical Use Cases

- Post-SBDC pipeline build: activate scout.js to generate first 50+ local leads
- Ongoing market mapping: re-run monthly to capture new businesses entering target geography
- Pre-outreach qualification: score leads by signal strength (job postings = active growth)
- Feed into NEPQ Drafter (tools/nepq_drafter.js) for automated outreach drafts

---

## Key Outputs

- `tools/market_intelligence/leads_vallejo.json` — structured lead dump (name, phone, address, website)
- `tools/market_intelligence/lead_log.csv` — timestamped append log for all scrape runs
- `tools/market_intelligence/top_leads.md` — top 10 scored prospects per run

---

## Runtime Stack

| Component | Version | Status |
|-----------|---------|--------|
| Node.js | v22.17.0 | Confirmed installed |
| Playwright | v1.59.1 | Confirmed via `npx playwright` |
| Chromium | headless | Install once: `npx playwright install chromium` |

---

## DSCR Gate

**Input:** ~2 hours build time (scout.js) + ~10 minutes per scrape run
**Output:** Pipeline of qualified local consulting leads — each converted client = $5,000+
**Estimated Output/Input Ratio:** 25x+ Year 1 (single client close justifies entire build cost)
