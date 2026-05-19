# agents/ — Autonomous Agent Definitions
**Architect:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Purpose

Houses all autonomous agent definitions for the AA Capital Inc. / Prime Pathwy operating system. Each agent has a defined role, activation trigger, output format, and integration map. Agents are not general-purpose AI sessions — they are purpose-built operational systems with hardcoded identity and scoped behavior.

---

## Agent Registry

| Agent | Folder | Classification | Role |
|-------|--------|---------------|------|
| Sovereign Intelligence | [researcher/](researcher/) | Foundational | Lead intelligence officer — AI engineering updates, Zero-Hype filtered |
| Bid Architect | [marketing-engine/](marketing-engine/) | Foundational | Government subcontracting engine — scout, analyze, draft |
| XERO XERO Betting Quant | [sportsbook-analyst/](sportsbook-analyst/) | Supporting | NFL parlay strategist — ISE Betting Console |
| Identity (Canonical) | [identity/](identity/) | Foundational | Architect identity asset — all-platform bio |

---

## Identity Standard

The canonical identity file for all agents and outputs is:
`agents/identity/ARTHUR_MASTER_BIO.md`

All other identity files are deprecated. See `agents/identity/_deprecated-master_bio.md`.

---

## Navigation Per Agent

Each agent folder contains:
- `source.md` — unmodified original file
- `summary.md` — classification, purpose, use cases, DSCR gate
- `setup.md` — [GROUND TRUTH GATE] + activation steps
- `usage-examples.md` — concrete invocation patterns
- `risks-and-limitations.md` — constraints, failure modes
- `integration-map.md` — upstream/downstream, Technical Key Trigger

---

## Dependencies

All agents inherit governance from `../core/`. Load order:
1. `core/system-principles.md`
2. `agents/identity/ARTHUR_MASTER_BIO.md`
3. Target agent `source.md`
