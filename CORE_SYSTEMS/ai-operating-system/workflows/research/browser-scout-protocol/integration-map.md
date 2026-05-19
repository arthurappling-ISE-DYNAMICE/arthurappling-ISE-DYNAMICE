# Browser Scout Protocol — Integration Map
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Upstream Dependencies

| Source | What It Provides |
|--------|-----------------|
| `tools/market_intelligence/` | Write target directory for all scout outputs (must exist) |
| Node.js v22.17.0 | Runtime for scout.js execution |
| Playwright v1.59.1 | Headless browser engine for scraping |
| Google Maps (public) | Primary lead source — business listings |
| `agents/marketing-engine/` | NEPQ outreach sequencing for scored leads |

---

## Downstream Consumers

| Consumer | What It Receives |
|----------|-----------------|
| `tools/market_intelligence/leads_vallejo.json` | Structured lead records (name, phone, address, website) |
| `tools/market_intelligence/lead_log.csv` | Timestamped run log for audit trail |
| `tools/market_intelligence/top_leads.md` | Top 10 ranked prospects per run |
| `tools/nepq_drafter.js` | Prospect data for NEPQ outreach draft generation |
| `workflows/consulting/elite-10-framework/` | Upstream qualification filter for lead-to-client conversion |

---

## Workflow Position

```
Google Maps / Yelp / Yellow Pages (public data)
        ↓
Browser Scout Protocol — scout.js headless scrape
        ↓
leads_vallejo.json + lead_log.csv + top_leads.md
        ↓
NEPQ Drafter (tools/nepq_drafter.js) → outreach drafts
        ↓
Elite 10 Framework — Phase 1 qualification criteria
        ↓
Elite 10 Engine — bid pipeline sourcing
        ↓
Master Pathwy SOP — client engagement execution
```

---

## Active Integrations

| System | Integration Type | Status |
|--------|-----------------|--------|
| `tools/market_intelligence/` | File write target — JSON + CSV + Markdown | Directory exists; scout.js not yet built |
| `tools/nepq_drafter.js` | Lead-to-outreach pipeline | Manual trigger after top_leads.md produced |
| `agents/marketing-engine/` | Bid Architect — receives qualified leads | Active |

---

## Technical Key Trigger

No slash command. Manual activation after SBDC track confirmation.

**Activation sequence:**
```bash
1. Confirm: private sector consulting track open (SBDC meeting 2026-04-24 is past)
2. Confirm: Chromium installed (npx playwright install chromium)
3. Confirm: scout.js built at tools/market_intelligence/scout.js
4. Execute: cd C:/Users/arthu/GeminiEcosystem/tools/market_intelligence && node scout.js
5. Review: top_leads.md — score top prospects against Elite 10 client profile
6. Optional: pipe top lead into tools/nepq_drafter.js for outreach draft
```

---

## Redundancy Flags

No redundancy. Browser Scout Protocol is the only automated lead generation tool in the ecosystem. Manual lead sourcing (LinkedIn search, referrals) operates in parallel but is not a replacement — manual sources are not deduplicated against the scout output.
