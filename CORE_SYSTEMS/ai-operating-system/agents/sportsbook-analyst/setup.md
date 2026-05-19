# XERO XERO Betting Quant — Setup
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

### [GROUND TRUTH GATE]

Before activating this agent, confirm the following are true in your current environment.
Unconfirmed state = do not proceed. Request Ground Truth Audit.

- [ ] NFL season is active (regular season or playoffs) — this agent produces no actionable output in the offseason
- [ ] Current week's injury reports are available (official NFL designation: Q/D/O)
- [ ] Current Vegas lines are available (opening line + current line for movement tracking)
- [ ] Public betting sentiment data is available for fade logic
- [ ] ISE Betting Console is running at port 3132 (if outputting to dashboard)
- [ ] Source file loaded as context: `agents/sportsbook-analyst/source.md`

---

## Installation

This is a prompt-based agent. No runtime or dependency installation required.

The linked dashboard (`tools/betting_engine/public/dashboard.html`) requires the ISE Betting Console server to be running separately. Dashboard output is a secondary function — the agent produces analysis regardless of dashboard status.

### Step 1 — Load Context

**Action:**
```
1. ai-operating-system/core/system-principles.md
2. ai-operating-system/agents/sportsbook-analyst/source.md
```

**Pass Criteria:** Agent responds to a weekly analysis request with the four-scan sequence (TEAM MOMENTUM → PHYSICAL VARIABLES → LOGISTICS → VALUE) and produces output in the XERO XERO Dashboard table format.

**Error Map:**
| Error | Cause | Resolution |
|-------|-------|------------|
| Output lacks confidence percentages | Source not loaded or query too vague | Re-load source.md; specify week and game slate |
| Pre-ticket checklist not produced | Agent outputting analysis only | Explicitly request checklist after table output |
| Dashboard not updating | ISE Betting Console server not running | Start server: `node tools/betting_engine/app.js` at port 3132 |

---

### Step 2 — Weekly Analysis Invocation

**Command:**
```
[With source.md loaded]
Run XERO XERO weekly analysis for NFL Week [N], [YEAR].
Available games: [paste game slate].
Current injury reports: [paste key injuries].
Current lines: [paste opening and current lines].
Public sentiment: [paste % on each side if available].
Output: XERO XERO Dashboard table + 2 Trap Game Warnings + Pre-Ticket Checklist.
```

**Pass Criteria:** Output includes Dashboard table with Confidence % column populated, exactly 2 Trap Game Warnings, and the 5-point Pre-Ticket Checklist.

**Error Map:**
| Error | Cause | Resolution |
|-------|-------|------------|
| Confidence % all identical | Insufficient input data | Provide injury reports and line movement — agent cannot differentiate without them |
| Fewer than 2 Trap Game Warnings | Analysis incomplete | Explicitly request: "Identify exactly 2 trap games" |
| Pre-Ticket Checklist items unchecked | Below-threshold picks in Ticket 1 | Apply Pivot Rule: swap ML leg for O/U on the same game |
