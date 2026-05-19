# XERO XERO Betting Quant — Risks & Limitations
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Known Limitations

- **NFL only** — evaluation criteria (injury designations, ATS trends, TNF short-week logic) are NFL-specific. Do not apply to NBA, MLB, or other sports without rebuilding the scan logic.
- **No live data feed** — this is a prompt-based agent. It requires the operator to supply current injury reports, Vegas lines, and public sentiment data. It does not pull live data autonomously.
- **Confidence is analytical, not actuarial** — percentage confidence outputs are structured assessment outputs, not statistically modeled probabilities. They reflect the evaluation criteria in source.md, not historical win-rate data.
- **William Hill platform dependency** — the agent is calibrated for William Hill's parlay structure and bet types. Other platforms may have different rules for ML and O/U parlays.
- **Offseason limitation** — no actionable output during NFL offseason (February–August). Draft analysis is the only active function during that window.
- **Calendar intelligence is time-bound** — the 2026 NFL Draft monitoring window (April 23–25) is now past. This section requires updating each year.

---

## Failure Modes

| Scenario | What Breaks | Mitigation |
|----------|-------------|------------|
| Injury data not provided | Confidence percentages unreliable; Anchors may include injured QBs | Always supply current injury reports before analysis |
| Line movement data absent | Fade logic cannot engage; sharp money signals missed | Pull opening vs. current lines before running agent |
| Pre-Ticket Checklist skipped | Below-threshold picks enter the ladder | Checklist is non-negotiable — run it before every ticket placement |
| Pivot Rule not applied | ML leg below 85% stays in Ticket 1; ticket integrity compromised | Apply Pivot Rule automatically when any Anchor drops below 85% |
| ISE Betting Console offline | Dashboard output fails | Analysis still runs — dashboard is secondary output; fix server separately |

---

## Deprecation Risk

**Medium.** The core evaluation logic (4 scans, No-Lose Ladder, Pivot Rule) is stable and not platform-dependent. However:
- William Hill platform changes could affect bet type compatibility
- Calendar intelligence sections require annual updates (draft window dates)
- NFL rule changes (game scheduling, IR designations) may require scan logic updates

---

## Conflicts With

None within this OS. The XERO XERO Betting Quant is the sole sports analytics agent. It does not overlap with any contracting, research, or consulting agent.
