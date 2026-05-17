# Claude Skills Reference Blueprint — Risks & Limitations
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Known Limitations

- **4 skills only — not exhaustive** — source.md was adapted from ComposioHQ Awesome Claude Skills; only 4 patterns were selected for this ecosystem. New skills relevant to emerging verticals (real estate, fleet operations, grant writing) are not yet documented.
- **Read-Only Data Summarizer has no enforcement layer** — the "read-only" constraint is a behavioral rule, not a technical lock. Claude Code file permissions do not prevent writes. Discipline is the only enforcement mechanism.
- **Brand Guidelines require manual review** — no automated linter enforces the Matte Black/Gold standard or the banned phrase list. Every deliverable requires human (or agent) review pass before release.
- **Recursive Research disk checkpointing is manual** — the skill specifies "checkpoint to disk after each source tier," but there is no automated checkpoint trigger. The operator must remember to write intermediate findings between tiers.
- **Root-Cause Tracing stops at the agent level** — if the root cause is in an external system (SAM.gov API change, Perplexity rate limit, Google Maps block), the skill cannot resolve it — only escalate to Architect.

---

## Failure Modes

| Scenario | What Breaks | Mitigation |
|----------|-------------|------------|
| Root-Cause Tracing skipped (3rd retry attempted) | Zero-Inference rule violated; compounding failures | Two failures = hard stop, no exceptions |
| Recursive Research checkpoint skipped | Tier 1 findings lost if session crashes before completion | Write to disk before moving to Tier 2 — non-negotiable |
| Brand Guidelines applied inconsistently | Institutional Grade standard violated; client perception risk | Brand review is a pass criterion on every deliverable — mark complete only after review |
| Read-Only summarizer writes to source file | Source data corrupted | Never open source files with write permissions during analysis; write summary to separate file only |

---

## Deprecation Risk

**Low.** All 4 skills are based on stable operational principles (failure tracing, tiered research, brand consistency, data safety). The specific targets (SAM.gov, Matte Black/Gold) may change with business phase shifts, but the skill patterns themselves are durable.

---

## Conflicts With

None. The 4 skills are orthogonal — they govern different operational contexts and do not conflict with each other or with any agent or workflow in this ecosystem. If a future skill added to this reference conflicts with an existing agent's behavior, the agent's source.md governs for that agent's specific domain; the skill governs at the cross-agent level.
