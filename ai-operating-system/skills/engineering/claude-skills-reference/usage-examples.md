# Claude Skills Reference Blueprint — Usage Examples
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Example 1 — Root-Cause Tracing (Ground Truth Audit)

**Scenario:** `/bid scout` fails twice with `fetch error`. Zero-Inference rule fires.

```
STOP. Two failures confirmed.
Last successful operation: loaded SAM.gov search parameters
Error verbatim: "TypeError: Failed to fetch — CORS policy blocked"
Root cause: SAM.gov API endpoint changed; agent is using stale URL
Fix attempt: Update endpoint URL in bid_architect source.md
Pass Criteria: /bid scout returns valid results on next run
```

**Do not:** Retry the same command a third time. Root cause first.

---

## Example 2 — Recursive Research (Grant Intelligence Sweep)

**Scenario:** Researching new NAICS 561720 grant opportunities for Q3 2026.

```
Objective: Identify open grant programs for NAICS 561720 in California — Q3 2026 window

Tier 1 (Primary): calosba.ca.gov, grants.ca.gov, sam.gov
  → Extract: program name, amount, deadline, NAICS eligibility, application URL
  → Checkpoint: write preliminary findings to memory/market-intelligence/draft-2026-Q3.md

Tier 2 (Secondary): Perplexity — "California NAICS 561720 grants 2026"
  → Cross-reference against Tier 1 findings
  → Add any new programs not in Tier 1

Tier 3 (Tertiary): General web search for edge programs
  → Only if Tier 1+2 produced < 5 programs

Final: write memory/market-intelligence/2026-Q3-grant-scan.md in YYYY-MM-DD-topic format
```

---

## Example 3 — Brand Guidelines Enforcement

**Scenario:** Producing Chaos Cost Statement for new Elite 10 consulting client.

```
Document header:
  Owner: Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy
  Date: 2026-MM-DD
  Background: #0B0B0B
  Accent: #C9A646 (dollar figures, section headers)
  No AI attribution anywhere in document
  No banned phrases (check core/prompting-standards.md)
```

**Pass Criteria:** Client-facing document delivered with full brand standard applied. No AI language patterns present.

---

## Anti-Patterns

- **DO NOT** skip Root-Cause Tracing and attempt a third fix — two failures = stop
- **DO NOT** write to source data files during Read-Only Data Summarizer runs
- **DO NOT** use Tier 3 (general web) for research before exhausting Tier 1 and Tier 2
- **DO NOT** deliver any client document without Brand Guidelines review
