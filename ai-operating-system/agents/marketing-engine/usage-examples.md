# Bid Architect — Sovereign Subcontracting Engine — Usage Examples
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Example 1 — Weekly Solicitation Scout

**Scenario:** Monday morning SAM.gov scan.

**Command:**
```
/bid scout
```

**Expected Output:**
- Credential Plate rendered verbatim
- Three paste-ready Perplexity prompts (NAICS 561720, NAICS 562111, Set-Aside sweep)
- Instruction to log results to `logs/bid_scout_YYYY-MM-DD.md`

**Next Step:** Paste each prompt into Perplexity. Collect solicitation URLs. Run `/bid analyze`.

---

## Example 2 — Solicitation Qualification

**Scenario:** Two solicitation URLs returned from the scout. Qualify before investing bid prep time.

**Command:**
```
/bid analyze https://sam.gov/opp/[solicitation-1] https://sam.gov/opp/[solicitation-2]
```

**Expected Output:**
- Credential Plate rendered verbatim
- Manus Core Command (paste-ready for Manus session)
- Qualification Matrix for each solicitation with NAICS match, contract value, set-aside designation, bonding status
- Set-Aside Flag: FAST-TRACK ELIGIBLE or DISQUALIFIED with explicit reason

**Decision Gate:**
- FAST-TRACK ELIGIBLE → proceed to `/bid draft [solicitation_number]`
- DISQUALIFIED → log reason, stop. Do not invest further time.

---

## Example 3 — Full Bid Package

**Scenario:** Solicitation W912BV-26-R-0014 is Fast-Track Eligible. Draft the complete bid package.

**Command:**
```
/bid draft W912BV-26-R-0014
```

**Expected Output:**
- Credential Plate rendered verbatim
- Document 1: Capability Statement (complete except PAST PERFORMANCE — manual fill required)
- Document 2: NEPQ Proposal Draft (5 sections complete with agency name placeholder)

**Manual Fill Required Before Submission:**
- PAST PERFORMANCE: 2–3 prior contracts or relevant operational experience
- Agency name: replace `[Agency Name]` in Sections 1, 2, 3, 5
- Contact information confirmation

---

## Anti-Patterns

- **DO NOT** run `/bid analyze` without first running `/bid scout` — qualify before analyzing individual solicitations
- **DO NOT** submit a bid package with PAST PERFORMANCE left blank — disqualifying in most evaluations
- **DO NOT** target Open Competition contracts until all Fast-Track set-aside contracts are worked first
- **DO NOT** use this agent with outdated SAM.gov registration — confirm active status before each scout cycle
- **DO NOT** replace `[INSERT TODAY'S DATE]` in Perplexity prompts with an approximate date — use the exact current date
