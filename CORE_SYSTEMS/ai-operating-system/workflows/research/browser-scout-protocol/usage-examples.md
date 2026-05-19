# Browser Scout Protocol — Usage Examples
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Example 1 — First Activation (Post-SBDC)

**Scenario:** SBDC meeting complete. Private sector consulting pipeline needs seed leads.

```bash
# Step 1: Install Chromium (one-time)
npx playwright install chromium

# Step 2: Run scout
cd C:/Users/arthu/GeminiEcosystem/tools/market_intelligence
node scout.js
```

**Expected output:**
```
Scraping: logistics companies Vallejo CA...
Scraping: hauling companies Vallejo CA...
Found 47 businesses. Deduped: 38 unique.
Top 10 written to top_leads.md.
leads_vallejo.json updated.
lead_log.csv appended (2026-05-17T09:22:00Z).
```

**Pass Criteria:** leads_vallejo.json contains structured records. top_leads.md has 10 ranked entries with signal scores.

---

## Example 2 — Monthly Refresh

**Scenario:** Month 2. Re-run scout to capture new market entrants.

```bash
cd C:/Users/arthu/GeminiEcosystem/tools/market_intelligence
node scout.js
```

**Deduplication behavior:** scout.js compares against existing leads_vallejo.json. New entries appended. Existing entries updated if data changed. lead_log.csv timestamps each run for audit trail.

---

## Example 3 — NEPQ Outreach Pipeline

**Scenario:** top_leads.md produced. Feed top prospect into NEPQ Drafter.

```bash
# After scout.js run — pipe top lead into NEPQ drafter
node nepq_drafter.js --lead "Premier Logistics Vallejo" --industry "hauling"
```

**Expected output:** Draft outreach email using NEPQ framework:
- Problem Frame: "What does your dispatch process look like when you're running 3 jobs at once?"
- Implication Layer: dollar cost of operational chaos
- Sovereign System Solution: Prime Pathwy consulting install

---

## Anti-Patterns

- **DO NOT** scrape LinkedIn — ToS violation; triggers account suspension
- **DO NOT** remove rate limit delay (2000ms) — triggers IP block from Google Maps
- **DO NOT** run scout.js without Chromium binary installed — Playwright will throw `browserType.launch` error
- **DO NOT** activate before private sector track confirmed active — SBDC trigger date (April 24, 2026) is past; verify track status before production run
- **DO NOT** skip deduplication — lead_log.csv becomes unusable without clean unique-record tracking
