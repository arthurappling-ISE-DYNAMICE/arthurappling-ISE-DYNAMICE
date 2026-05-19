# Bid Architect — Sovereign Subcontracting Engine — Risks & Limitations
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Known Limitations

- **NAICS scope is fixed** — agent covers 561720 and 562111 only. Expanding to additional NAICS codes requires updating `source.md` identity constants and qualification matrix.
- **Contract ceiling is $100,000** — the agent is calibrated for small set-aside contracts. Larger contract vehicles require separate qualification logic not present in this version.
- **PAST PERFORMANCE requires manual fill** — the agent cannot fabricate past performance. Every bid package requires human input for this section before submission.
- **No direct SAM.gov API integration** — scouting is prompt-based through Perplexity. Direct API integration would increase throughput but is not in current scope.
- **Manus dependency for analysis** — the Manus Core Command in `/bid analyze` requires Manus access. Without it, the analysis step is incomplete.
- **California-scoped by default** — scouting prompts target California solicitations. Federal remote contracts are included in the set-aside sweep but require manual review for scope match.

---

## Failure Modes

| Scenario | What Breaks | Mitigation |
|----------|-------------|------------|
| SAM.gov registration lapses | All bids disqualified at submission | Verify active registration before each scout cycle (monthly minimum) |
| Credential Plate omitted from output | Non-compliant bid package — identity not established | Always re-load source.md if Credential Plate is missing from any output |
| Perplexity returns stale solicitations | Scout results include closed or awarded contracts | Always include `Current date: [TODAY]` in Perplexity prompts — never omit |
| PAST PERFORMANCE section submitted blank | Likely bid disqualification | Manual review gate before any submission |
| DUNS not recognized | Registration issues at SAM.gov | Verify DUNS 12-3035654 at dnb.com and at sam.gov before scout cycle |

---

## Deprecation Risk

**Low for core logic.** The NEPQ proposal framework and qualification matrix are not platform-dependent. The Perplexity prompt format may require updates if SAM.gov changes its data structure or search interface.

**Medium for Manus integration.** The Manus Core Command is dependent on Manus platform availability. If Manus is deprecated or access is lost, the analysis step requires a replacement AI research tool.

---

## Conflicts With

None within this OS. The Bid Architect is the sole government contracting agent. Its outputs feed `workflows/bidding/` but do not conflict with any current workflow file.
