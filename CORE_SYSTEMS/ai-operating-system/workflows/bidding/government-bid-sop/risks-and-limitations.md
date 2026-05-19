# Sovereign Subcontracting Engine SOP — Risks & Limitations
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Known Limitations

- **SAM.gov registration must be maintained** — expiration or status change disqualifies all bids. Monthly verification is mandatory.
- **PAST PERFORMANCE requires manual fill** — no automation can produce real past performance data. Every bid package requires human input before submission.
- **Contract ceiling is $100,000** — SOP is calibrated for small set-aside contracts. Larger prime contracts require additional bonding and qualification steps not covered here.
- **Manus dependency** — Step 4 Manus Core Command requires Manus platform access. If unavailable, analysis must be performed manually.
- **California-primary scope** — Perplexity prompts target California solicitations. Federal remote contracts are included in the set-aside sweep but require manual jurisdiction review.
- **No automated alert system** — scouting is manual (Monday/Thursday cadence). Solicitations posted between cycles may be missed.

---

## Failure Modes

| Scenario | What Breaks | Mitigation |
|----------|-------------|------------|
| SAM.gov registration lapses | All submissions rejected at portal | Verify monthly — calendar alert on renewal date |
| DUNS not recognized | Registration lookup fails | Verify DUNS 12-3035654 at dnb.com and sam.gov before every cycle |
| PAST PERFORMANCE submitted blank | Near-certain bid disqualification | Mandatory manual review before Step 7 checklist |
| Legal pages offline at submission | Digital presence verification fails if audited | Verify all three pages load before any bid cycle |
| Manus unavailable | Step 4 analysis incomplete | Use manual Manus Core Command structure from source.md directly in another AI tool |

---

## Deprecation Risk

**Low for SOP logic.** The 8-step sequence is process-level and not platform-specific. **Medium for tool integrations:** Perplexity prompt format may require updates if SAM.gov changes its data schema; Manus Core Command requires Manus platform continuity.

---

## Conflicts With

No conflicts. This SOP is the operational companion to the Bid Architect agent (`agents/marketing-engine/`). They are designed to work together — SOP provides the sequence, agent provides the output generation. No contradiction exists between them.
