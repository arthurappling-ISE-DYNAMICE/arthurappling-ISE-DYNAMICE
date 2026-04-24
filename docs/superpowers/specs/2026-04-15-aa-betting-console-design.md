# AA Betting Board — Design Spec
**Date:** 2026-04-15  
**Authority:** Arthur Fitzgerald Appling Sr. — AA Capital INC  
**Status:** APPROVED — Deploy authorized  

---

## Overview

Standalone local web dashboard for tracking ISE Dynamics V5 Supreme parlay execution. Serves from `ISE_Betting_Console/` on port **3132**, mirrors the ISE Health Console pattern (port 3131). No build step — React + Recharts loaded via CDN, served by a plain Node HTTP server.

---

## Architecture

```
ISE_Betting_Console/
├── server.cjs            # Node HTTP server — port 3132
├── public/
│   └── index.html        # Standalone React + Recharts (CDN) dashboard
├── data/
│   └── betting_log.json  # Persistent data store
├── register_startup.ps1  # Windows Task Scheduler — auto-start at login
└── shortcut.bat          # Quick launch
```

**Server routes:**
- `GET /` → `public/index.html`
- `GET /api/log` → read `data/betting_log.json`
- `POST /api/log` → append new week entry
- `PUT /api/log/:index` → update entry (mark outcome, record payout)

---

## Data Model

```json
{
  "date": "2026-04-15",
  "week": 1,
  "unit": 100,
  "type": "4-Leg",
  "status": "Ready | Pending | Hit | Miss",
  "ss_avg": 92,
  "wri_avg": 8,
  "payout": 0,
  "net_profit": 0,
  "teams": [
    { "slot": 1, "tier": "Foundation", "name": "TBD", "ss": 0, "wri": 0, "outcome": null, "momentum": "" }
  ]
}
```

**Net Profit formula:** `payout - (unit × tickets_placed_this_week)`  
- Weekly investment = $100 × number of active ticket types (4/6/8-leg each = $300 max)  
- Empire Curve plots **cumulative** net profit across all weeks

---

## UI Panels

### Graph A — Empire Curve (Recharts AreaChart)
- X axis: Week number (1–18 + Playoffs)
- Y axis: Cumulative net profit in dollars
- Baseline at $0 (break-even line in dim gold)
- Gold fill above baseline, red fill below
- Tooltip: Week, gross payout, total invested, net profit

### Graph B — SS vs Outcome (Recharts BarChart)
- 8 bars (one per team slot), grouped by tier with visual dividers
- Bar height = SS score (85–100 range)
- Colors: Gold = Hit, Red = Miss, Grey = Pending
- **Hover tooltip:** Team name, SS score, WRI %, Tier, Momentum tag
- Tier legend: T1–4 (Foundation, SS≥90), T5–6 (Extension, SS≥88), T7–8 (Risk, SS≥85)

### The Ladder — 4-6-8 Connection Mandate
- Vertical stack: 4-leg (bottom, ACTIVE), 6-leg (middle), 8-leg (top)
- Locked tiers are dimmed until foundation is complete
- Each tier shows its team slots with names once populated
- Connection Mandate rules displayed beneath

### Stealth Tracker — Weekly Exposure
- Horizontal progress bar: $0 → $500 (red flag zone starts at $400)
- Red flag triggers at **$500** (5 units)
- Indicator turns red when threshold breached
- Shows: current exposure, unit count, red flag distance

---

## Connection Mandate (Hard Rules — from william_hill_logic.py)
1. Teams 1–4 are the **Foundational Lock** — must anchor every ticket
2. Teams 5–6 added **only** to the 4-leg foundation → creates 6-leg
3. Teams 7–8 added **only** to the 6-leg foundation → creates 8-leg
4. No leg may skip tiers or bypass SS threshold clearance

---

## Theme
- Background: `#0c0c0c` (Matte Black)
- Panels: `#141414`
- Gold: `#c9a227` (Wins, active states, labels)
- White: `#f0f0f0` (Data text)
- Red: `#e74c3c` (Miss, red flag)
- Green: `#2ecc71` (Hit confirmation)
- Font: `Courier New` monospace

---

## Startup Registration
- Windows Task Scheduler task: `"ISE Betting Console Startup"`
- Triggers at logon, same pattern as Health Console (`"ISE Health Console Startup"`)
- Server restarts up to 3× on failure, 2-minute intervals
