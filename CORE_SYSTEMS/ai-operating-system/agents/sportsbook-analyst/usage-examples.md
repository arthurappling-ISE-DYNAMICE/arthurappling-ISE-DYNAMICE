# XERO XERO Betting Quant — Usage Examples
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Example 1 — Standard Weekly Analysis

**Scenario:** NFL Week 8 regular season. Full game slate available.

**Command:**
```
[With source.md loaded]
Run XERO XERO weekly analysis for NFL Week 8, 2026.
Game slate: [paste full week schedule]
Key injuries this week: [QB designations, WR1 status, CB1 status for each team]
Opening lines vs. current lines: [paste]
Public betting % by game: [paste if available]
```

**Expected Output:**
1. XERO XERO Dashboard table — all games assessed, Confidence % per pick, one-sentence Architect's Logic
2. Ticket 1 (BASE) — 4 Anchor picks at ≥90% each
3. Ticket 2 (HIGH) — Ticket 1 + 2 additions at ≥85% each
4. Ticket 3 (STRATEGIC) — 8 total picks at ≥80% each
5. Trap Game Warnings — exactly 2, with reason
6. Pre-Ticket Checklist — all 5 items checked before any ticket is placed

---

## Example 2 — Pivot Rule Application

**Scenario:** During weekly analysis, Chiefs ML confidence drops to 82% due to QB injury report.

**Command:**
```
Chiefs QB is listed Q (questionable) this week. Current Chiefs ML confidence: 82%.
Apply the Pivot Rule. Recommend replacement leg for Ticket 1.
```

**Expected Output:**
- Pivot Rule triggered: Chiefs ML removed from Ticket 1
- Replacement: Chiefs O/U total for the same game, with confidence reassessed
- Updated Ticket 1 (BASE) with replacement leg identified

---

## Example 3 — NFL Draft Impact Analysis

**Scenario:** Round 1 complete. Assess O/U line implications for first 4 games.

**Command:**
```
[With source.md loaded]
NFL Draft Round 1 complete. Draft picks: [paste Round 1 selections].
Apply Draft Analysis Protocol:
- Flag all teams that drafted CB1, EDGE, DT, or LB → tighten Over totals
- Flag all teams that drafted WR1 or TE1 → tighten Under totals
Output formatted for: tools/market_intelligence/draft_impact_2026.md
```

**Expected Output:** Table with columns: Team | Pick | Position | O/U Impact | Confidence Shift. Formatted for direct paste into draft_impact_2026.md.

---

## Anti-Patterns

- **DO NOT** place any ticket without running the Pre-Ticket Checklist — all 5 items must be confirmed
- **DO NOT** include a leg with confidence below 80% in any ticket — below threshold, skip the game entirely
- **DO NOT** ignore the Pivot Rule — a leg below 85% that stays as ML on Ticket 1 degrades the entire BASE ticket
- **DO NOT** run this agent without current injury reports — confidence percentages calculated without injury data are unreliable
- **DO NOT** use this agent for sports other than NFL — evaluation criteria are NFL-specific and do not transfer
- **DO NOT** fade the public on divisional games without applying the 5% divisional confidence reduction first
