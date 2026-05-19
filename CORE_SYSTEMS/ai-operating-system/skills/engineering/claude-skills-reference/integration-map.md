# Claude Skills Reference Blueprint — Integration Map
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Upstream Dependencies

| Source | What It Provides |
|--------|-----------------|
| ComposioHQ Awesome Claude Skills (external) | Original skill blueprints — adapted for Sovereign Engineering Engine |
| `core/system-principles.md` | Zero-Hype filter + Zero-Inference rule — doctrine that Root-Cause Tracing enforces |
| `core/prompting-standards.md` | Banned phrases list — referenced by Brand Guidelines skill |
| `core/verification-rules.md` | Pass Criteria standard — governs all 4 skills' completion criteria |

---

## Downstream Consumers

| Consumer | Skill Applied |
|----------|--------------|
| All agents (researcher, marketing-engine, sportsbook-analyst) | Root-Cause Tracing on failure; Brand Guidelines on outputs |
| `workflows/research/browser-scout-protocol/` | Recursive Research pattern governs scrape-to-intelligence sequence |
| `workflows/research/recursive-integrity-audit/` | Root-Cause Tracing governs FAIL resolution sequence |
| `workflows/bidding/government-bid-sop/` | Recursive Research pattern for SAM.gov contract mapping |
| `tools/integrations/betting-engine/` | Read-Only Data Summarizer governs Canonical_Bet_History.json analysis |
| All client-facing deliverables (Master Pathwy SOP outputs) | Brand Guidelines skill — mandatory before any deliverable is released |

---

## Workflow Position

```
Any operational task begins
        ↓
Skill 3 (Brand Guidelines) — governs all deliverable output
        ↓
Task encounters failure? → Skill 1 (Root-Cause Tracing) fires
Research required? → Skill 2 (Recursive Research) governs sequence
Data analysis required? → Skill 4 (Read-Only Summarizer) governs access
        ↓
Task complete — all 4 skills remain in force across session
```

---

## Active Integrations

| System | Skill | Integration Type | Status |
|--------|-------|-----------------|--------|
| All agents | Root-Cause Tracing | Failure response protocol | Active — behavioral |
| All deliverables | Brand Guidelines | Output standard | Active — review required |
| Research workflows | Recursive Research | Sequence pattern | Active — governs all intelligence sweeps |
| Betting/financial data | Read-Only Summarizer | Data access standard | Active — behavioral |

---

## Technical Key Trigger

No slash command. Skills are behavioral patterns — always active, not invoked.

**Activation:**
```
Root-Cause Tracing: auto-triggers on second consecutive failure
Recursive Research: load when beginning any multi-source research task
Brand Guidelines: load before producing any client-facing deliverable
Read-Only Summarizer: load before opening any financial or statistical backend file
```

---

## Redundancy Flags

No redundancy. Each of the 4 skills governs a distinct operational domain. Root-Cause Tracing and the Zero-Inference rule (core/system-principles.md) reinforce each other — they are complementary, not redundant. Zero-Inference triggers the audit; Root-Cause Tracing governs how the audit executes.
