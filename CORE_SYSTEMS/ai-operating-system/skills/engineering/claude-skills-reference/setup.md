# Claude Skills Reference Blueprint — Setup
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

### [GROUND TRUTH GATE]

These skills are reference patterns, not installed packages. Confirm the following before invoking any skill:

- [ ] Relevant skill pattern identified from the 4-skill inventory in source.md
- [ ] Execution context confirmed (Claude Code session, Perplexity Pro, or local terminal as appropriate)
- [ ] For Root-Cause Tracing: Zero-Inference rule has fired (two consecutive command failures confirmed)
- [ ] For Read-Only Data Summarizer: no write operations planned — analysis only

---

## Skill 1 — Root-Cause Tracing (Failure Control)

**Activate when:** Any command or tool fails twice consecutively in a session.

**Sequence:**
```
1. STOP all current work
2. Record exact error message verbatim
3. Trace back: what was the last successful operation before the failure?
4. Identify the original technical trigger (not the symptom — the root cause)
5. Document root cause before attempting any fix
6. Attempt fix once — if it fails, request Ground Truth Audit from Architect
```

**Pass Criteria:** Root cause identified and documented before any fix is attempted.

---

## Skill 2 — Recursive Research (Autonomous Scouting)

**Activate when:** Multi-step research required (SAM.gov contract mapping, grant intelligence, competitor analysis).

**Sequence:**
```
1. Define research objective — one sentence, specific
2. Tier sources: Primary (SAM.gov, Cal eProcure, official databases) → Secondary (Perplexity, news) → Tertiary (general web)
3. Search primary sources first — extract structured data
4. Checkpoint to disk after each source tier: write intermediate findings before moving to next tier
5. Cross-reference findings across tiers
6. Produce final intelligence report in YYYY-MM-DD-topic.md format → memory/market-intelligence/
```

**Pass Criteria:** Research report written to disk. Findings sourced and tier-labeled.

---

## Skill 3 — Brand Guidelines (Institutional Grade)

**Activate when:** Producing any client-facing deliverable, presentation, or document.

**Standards:**
```
Background: #0B0B0B (Matte Black)
Accent:     #C9A646 (Gold)
Typography: Professional hierarchy — H1 > H2 > body — no decorative fonts
Structure:  Owner field + date on every document header
No AI attribution: Authorship = Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy
Banned phrases: See core/prompting-standards.md banned list
```

**Pass Criteria:** Every deliverable reviewed against color, typography, and authorship standard before delivery.

---

## Skill 4 — Read-Only Data Summarizer (Data-Verified Analytics)

**Activate when:** Analyzing bet_history.json, bank ledger, health_data.json, or any financial/statistical backend file.

**Rules:**
```
1. Open file in READ mode only — no write operations
2. Confirm file checksum or last-modified timestamp before analysis
3. Summarize: extract key metrics, identify anomalies, produce structured output
4. Write summary to a separate file — NEVER overwrite source data
5. If analysis reveals a write requirement → STOP, confirm with Architect before proceeding
```

**Pass Criteria:** Source file unchanged after analysis. Summary delivered as a separate artifact.
