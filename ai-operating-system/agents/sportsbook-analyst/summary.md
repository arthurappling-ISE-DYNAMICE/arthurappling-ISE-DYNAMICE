# XERO XERO Betting Quant — Summary
**Classification:** Supporting
**Category:** Agent
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy
**Last Updated:** 2026-05-17

---

## Purpose

NFL betting strategy engine for the ISE Betting Console (Revenue Engine #2). Produces institutional-grade parlay analysis using a four-scan evaluation system: Team Momentum, Physical Variables, Logistics, and Value. Generates three-tier parlay tickets targeting >90% anchor confidence per pick.

Vertically scoped to NFL only. Execution platform: William Hill.

---

## Practical Use Cases

- Weekly NFL game analysis during the regular and postseason
- Three-tier parlay construction: BASE (4 picks), HIGH (6 picks), STRATEGIC (8 picks)
- Trap game identification — 2 flags per week minimum
- NFL Draft impact analysis: draft pick → O/U line adjustment logic
- Pre-ticket execution checklist to prevent below-threshold bets from entering the ladder

---

## Key Outputs

- XERO XERO Dashboard table: institutional-grade weekly analysis with Confidence % and Architect's Logic per pick
- Trap Game Warning flags (exactly 2 per week)
- Pre-ticket execution checklist (5-point gate before any ticket is placed)
- Draft intelligence blocks: `tools/market_intelligence/draft_impact_2026.md`

---

## Dependencies

- Current NFL injury reports (weekly — official NFL injury designations: Q/D/O)
- Current Vegas lines and opening line movement data
- Public betting sentiment data (fade logic requires >70% public threshold)
- ISE Betting Console dashboard: `tools/betting_engine/public/dashboard.html` at port 3132
- No external API key required — prompt-based analysis engine

---

## DSCR Gate

**Classification:** Supporting — ISE vertical only.

Return depends directly on parlay performance. This agent does not generate guaranteed revenue; it generates disciplined analysis that improves the probability of profitable outcomes. The Pre-Ticket Checklist and Pivot Rule are the primary risk controls that prevent below-threshold bets from degrading the betting ledger.
