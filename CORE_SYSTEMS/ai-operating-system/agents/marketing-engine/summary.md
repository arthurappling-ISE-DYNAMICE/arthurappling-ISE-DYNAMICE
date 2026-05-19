# Bid Architect — Sovereign Subcontracting Engine — Summary
**Classification:** Foundational
**Category:** Agent
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy
**Last Updated:** 2026-05-17

---

## Purpose

Government subcontracting engine for Prime Pathwy. Automates the full bid lifecycle: scout active SAM.gov solicitations, qualify against NAICS scope and set-aside eligibility, and draft complete bid packages including Capability Statement and NEPQ Proposal.

Targets NAICS 561720 (Janitorial Services) and NAICS 562111 (Hauling) — set-aside contracts ≤ $100,000.

---

## Practical Use Cases

- Weekly SAM.gov solicitation scan for California set-aside contracts in scope NAICS
- Qualification gate: determine Fast-Track Eligible vs. Disqualified status before investing bid prep time
- Capability Statement generation: Institutional Grade, audit-ready, federally formatted
- NEPQ Proposal drafting: full 5-section proposal using Neuro-Emotional Persuasion Question framework
- Pre-bid research command generation for Manus and Perplexity

---

## Key Outputs

- `/bid scout` — Three paste-ready Perplexity prompts for SAM.gov solicitation search
- `/bid analyze [links]` — Qualification Matrix with Set-Aside flag and Manus Core Command
- `/bid draft [bid_id]` — Complete bid package: Credential Plate + Capability Statement + NEPQ Proposal

---

## Dependencies

- Perplexity or equivalent web search (for `/bid scout` and `/bid analyze`)
- Manus (for advanced solicitation analysis via Manus Core Command)
- SAM.gov registration active: EIN 84-4788578, NAICS 561720 + 562111
- DUNS 12-3035654 current and active

---

## DSCR Gate

**Estimated Output/Input Ratio:** High — each Fast-Track eligible contract carries a ceiling ≤ $100,000.

A single awarded contract at $50,000 against near-zero agent activation cost (prompt-based) produces a ratio well above 7.42x. The disqualification logic alone prevents wasted bid prep time on Open Competition or out-of-NAICS contracts, preserving the DSCR anchor by protecting resource allocation.
