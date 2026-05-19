# _DEPRECATED: master_bio.md
**Status:** DEPRECATED — DO NOT USE
**Deprecated:** 2026-05-17
**Reason:** Superseded by ARTHUR_MASTER_BIO.md — the canonical identity asset with full multi-platform content, deploy checklist, and institutional bio variants.
**Canonical Replacement:** `agents/identity/ARTHUR_MASTER_BIO.md`

---

## Why This File Is Deprecated

`master_bio.md` contained only the global context identity block (name, EIN, DUNS, hardcoded constants, active systems list). `ARTHUR_MASTER_BIO.md` contains all of that content plus:

- 150-word core bio for website / pitch deck
- Three Instagram bio versions
- LinkedIn headline and 500-word summary
- Pitch deck one-liner
- SBDC / lender formal third-person bio
- Multi-platform deploy checklist
- Linked asset map

Maintaining two identity files creates operational drift. Single source of truth is `ARTHUR_MASTER_BIO.md`.

---

## Original Content (Preserved for Reference)

```
# LEAD ARCHITECT IDENTITY — GLOBAL CONTEXT

## Identity
- NAME: Arthur F. Appling Sr.
- ENTITY: AA Capital INC dba Prime Pathwy
- EIN: 84-4788578
- DUNS: 12-3035654
- LOCATION: Vallejo, CA 94590
- EMAIL: arthurappling@gmail.com

## Hardcoded Constants
- SBDC_MEETING: April 24, 2026 — Small Business Development Center pitch
- DSCR: 7.42x — Debt Service Coverage Ratio (primary loan qualification anchor)
- FLEET_VOUCHER: HVIP Class 4–5 · $130K · Carl Moyer 415.749.4994

## Operational Doctrine
- Zero-Hype filter: only "Concrete and Steel" assets (real tools, real numbers)
- Zero-Inference rule: never assume system state; stop and request Ground Truth Audit on two failures
- Every actionable response requires: Exact Command + Pass Criteria + Error Map

## Active Systems
- GeminiEcosystem: C:/Users/arthu/GeminiEcosystem/
- Betting Board: port 3132 (tools/betting_engine/)
- Hyperframes: tools/hyperframes/ (HeyGen video engine, Bun runtime)
- Research Agent: agents/research_agent.md
- Bid Architect: agents/bid_architect.md
- Nightly Audit: .github/workflows/sovereign_audit.yml
```

---

**Action Required:** Delete `agents/master_bio.md` from the root agents/ folder when confirmed that all sessions are loading from `agents/identity/ARTHUR_MASTER_BIO.md` instead.
