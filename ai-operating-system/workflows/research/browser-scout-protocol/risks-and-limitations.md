# Browser Scout Protocol — Risks & Limitations
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Known Limitations

- **scout.js not yet built** — the script specification exists in setup.md, but the file at `tools/market_intelligence/scout.js` has not been written. No scraping can execute until scout.js is built and tested.
- **SBDC trigger date is stale** — source.md status reads "STAGED — Execute after SBDC meeting (April 24, 2026)." That date has passed (current date: 2026-05-17). The protocol is eligible for activation if the private sector consulting track is confirmed open. Verify track status before first run.
- **Google Maps scraping subject to ToS drift** — Google Maps terms of service change without notice. The protocol targets public business listings, but scraping behavior must be validated against current robots.txt on each run.
- **Playwright stealth requires additional plugin** — `playwright-extra` + `puppeteer-extra-plugin-stealth` are referenced in source.md but may require separate installation: `npm install playwright-extra puppeteer-extra-plugin-stealth`
- **Lead data is publicly available, not proprietary** — competitors can run equivalent scrapes. Lead quality advantage comes from NEPQ sequencing, not data exclusivity.
- **No API fallback** — if Google Maps blocks headless scraping, no backup data source is configured. Manual fallback: Yelp Fusion API (requires key) or Yellow Pages direct scrape.

---

## Failure Modes

| Scenario | What Breaks | Mitigation |
|----------|-------------|------------|
| scout.js not built | Nothing executes | Build scout.js per setup.md specification before activation |
| Chromium binary missing | `browserType.launch` error on run | `npx playwright install chromium` (one-time) |
| Google Maps blocks headless browser | Zero results returned | Rotate user-agent string; add `playwright-extra` stealth plugin |
| Rate limit removed from scout.js | IP block from Google Maps within minutes | Enforce 2000ms delay between all page requests — non-negotiable |
| leads_vallejo.json corrupted | Deduplication fails; duplicate leads accumulate | Keep timestamped backup of leads_vallejo.json before each run |
| NEPQ drafter missing | No outreach draft generated | tools/nepq_drafter.js must exist; build separately if not present |

---

## Deprecation Risk

**Low-Medium.** The target geography (Vallejo CA, 30-mile radius) and industry (logistics/hauling) are stable. Google Maps as a scrape target carries moderate fragility — their anti-bot detection evolves. The scout.js architecture should be reviewed if scrapes produce zero results across 2+ consecutive monthly runs.

---

## Conflicts With

None. Browser Scout Protocol is an input-only research tool — it feeds the consulting pipeline but does not govern any downstream agent or workflow. If lead scoring methodology conflicts with Elite 10 Framework client profile criteria ($80K+ revenue, willing to document, 12-month commitment), Elite 10 Framework qualification criteria govern.
