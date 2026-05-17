# memory/ — Institutional Knowledge
**Architect:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Purpose

Persistent institutional knowledge for the AA Capital Inc. / Prime Pathwy operating system. Captures lessons from operational decisions, failed experiments, architecture choices, and market intelligence. This folder is the system's long-term memory — it survives individual sessions.

---

## Files & Subfolders

| File / Folder | Contents | Status |
|---------------|----------|--------|
| market-intelligence/ | Dated intelligence reports (YYYY-MM-DD-topic.md format) | Wave 4 — Pending |
| lessons-learned.md | What worked, what failed, and why — session-agnostic | Active |
| failed-experiments.md | Tools and approaches tested and disqualified — with documented reason | Active |
| architecture-decisions.md | Design decisions with rationale — prevents re-litigating solved problems | Active |
| optimization-log.md | Performance improvements logged with before/after metrics | Active |

---

## Wave 4 Import Queue

| Asset | Destination | Notes |
|-------|-------------|-------|
| `tools/market_intelligence/grant_scan_2026-04-25.md` | `memory/market-intelligence/2026-04-25-grant-scan.md` | Renamed to date-prefix convention |

---

## Writing Standards

- **lessons-learned.md:** Format — Date · System · What Happened · What Changed
- **failed-experiments.md:** Format — Date · Tool/Approach · What Was Tested · Why Disqualified
- **architecture-decisions.md:** Format — Date · Decision · Rationale · Alternatives Rejected
- **market-intelligence/:** Filename format — `YYYY-MM-DD-[topic].md`

All entries are timestamped. No undated entries.

---

## Integration

This folder is read by the Sovereign Intelligence Research Agent when preparing briefings. It prevents re-evaluation of already-disqualified tools and surfaces patterns across sessions that would otherwise be invisible.
