# ISE Betting Console — Summary
**Classification:** Integration Reference
**Category:** Tools / Integrations / Live Services
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy
**Last Updated:** 2026-05-17

---

## Purpose

Live betting intelligence console running on port 3132. Hosts the XERO XERO quant dashboard — visual interface for No-Lose Ladder parlay construction, bet history tracking, and NFL game analysis output. Served via `npx serve public -p 3132` from `tools/betting_engine/`. Referenced by the Sportsbook Analyst agent and monitored by the Recursive Integrity Audit (PASS 2 health check).

---

## Practical Use Cases

- Session startup: verify HTTP 200 at localhost:3132 confirms console is live
- Parlay construction: XERO XERO 4-scan NFL analysis output displayed in dashboard
- Bet history review: Canonical_Bet_History.json tracked in `tools/betting_engine/`
- No-Lose Ladder visualization: 3-tier (≥90%, ≥85%, ≥80%) parlay ladders rendered per game week

---

## Key Files

| File | Purpose |
|------|---------|
| `tools/betting_engine/app.js` | Express server — serves public/ and bet history API |
| `tools/betting_engine/public/` | Dashboard UI (HTML/CSS/JS) |
| `tools/betting_engine/Canonical_Bet_History.json` | Authoritative bet record (never overwrite without confirmation) |
| `tools/betting_engine/bet_history.json` | Working session bet log |
| `tools/betting_engine/package.json` | Node.js dependencies |
| `tools/betting_engine/register_startup.ps1` | Windows startup registration script |

---

## DSCR Gate

**Input:** Port 3132 always-on service (~0 marginal cost once started)
**Output:** Betting intelligence interface for XERO XERO quant analysis
**Status:** Live service — health check is PASS 2 of Recursive Integrity Audit
