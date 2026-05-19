# XERO XERO Betting Quant — Integration Map
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Upstream Dependencies

| Source | What It Provides |
|--------|-----------------|
| `core/system-principles.md` | Zero-Hype filter, DSCR gate, institutional grade standard |
| `agents/sportsbook-analyst/source.md` | 4-scan evaluation criteria, No-Lose Ladder protocol, output format |
| NFL injury reports | Q/D/O designations for key positions (QB, WR1, LT, CB1) — supplied manually |
| Vegas lines + line movement | Opening vs. current line data — supplied manually |
| Public betting sentiment | Fade logic threshold (>70%) — supplied manually |

---

## Downstream Consumers

| Consumer | What It Receives |
|----------|-----------------|
| ISE Betting Console dashboard | XERO XERO Dashboard table (`tools/betting_engine/public/dashboard.html`) |
| `tools/market_intelligence/draft_impact_2026.md` | Draft intelligence output (annual — Round 1–3) |
| `betting_engine/Canonical_Bet_History.json` | Logged bet outcomes for historical tracking |
| William Hill platform | Final parlay tickets constructed from Ticket 1, 2, and 3 outputs |

---

## Workflow Position

```
[Injury reports + Vegas lines + Public sentiment] (manual input)
        ↓
XERO XERO Betting Quant — 4-Scan Analysis
        ↓
No-Lose Ladder → Ticket 1 / Ticket 2 / Ticket 3
        ↓
Pre-Ticket Checklist (5-point gate)
        ↓
  All checks pass? ──Yes──→ Place on William Hill
                   ──No───→ Apply Pivot Rule or skip game
        ↓
ISE Betting Console Dashboard (output logged)
        ↓
betting_engine/Canonical_Bet_History.json (result archived)
```

---

## Active Integrations

| System | Integration Type | Status |
|--------|-----------------|--------|
| ISE Betting Console | Manual dashboard update via dashboard.html | Active — port 3132 |
| `Canonical_Bet_History.json` | Manual log after each ticket result | Active |
| William Hill | Manual bet placement from agent output | Active |
| `tools/market_intelligence/` | Manual file output — draft impact analysis | Active (NFL Draft season) |

---

## Technical Key Trigger

No slash command. Activated by loading `source.md` as context and providing the weekly game slate, injury reports, and line data.

**Recommended session opener:**
```
[Load: core/system-principles.md + agents/sportsbook-analyst/source.md]
Run XERO XERO weekly analysis for NFL Week [N], [YEAR].
[Provide: game slate, injury reports, lines, public sentiment]
```

---

## Redundancy Flags

None. This is the only sports analytics agent in the system. No overlap detected.

**Note:** `agents/betting_quant.md` in the root agents/ folder is the origin source of this import. Both files exist (copy strategy). The OS version (`sportsbook-analyst/source.md`) is the documented and maintained copy going forward.
