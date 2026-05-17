# Sovereign Intelligence Research Agent — Integration Map
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Upstream Dependencies

| Source | What It Provides |
|--------|-----------------|
| `core/system-principles.md` | Zero-Hype filter rules, DSCR 7.42x gate, MYTHOS governance |
| `core/prompting-standards.md` | Standard prompt header, banned phrases list |
| `agents/identity/ARTHUR_MASTER_BIO.md` | Entity identity constants, active systems list |
| Web search / Perplexity | Current AI engineering data to analyze |

---

## Downstream Consumers

| Consumer | What It Receives |
|----------|-----------------|
| `agents/marketing-engine/` (Bid Architect) | AI capability assessments relevant to contracting automation |
| `memory/lessons-learned.md` | Logged intelligence findings for institutional retention |
| SBDC / lender sessions | Pre-meeting briefs (verified facts only) |
| GeminiEcosystem active systems | Evaluation inputs for tool adoption or rejection decisions |

---

## Workflow Position

```
[Web / Perplexity] → Sovereign Intelligence Research Agent → Intelligence Brief
                                                          → memory/lessons-learned.md (log)
                                                          → Bid Architect (contracting signals)
                                                          → Pre-meeting briefs (capital sessions)
```

This agent sits at the top of the intelligence stack. It feeds all downstream agents. It does not receive output from any other agent.

---

## Active Integrations

| System | Integration Type | Status |
|--------|-----------------|--------|
| Perplexity / web search | Manual — paste results into session | Active |
| `memory/lessons-learned.md` | Manual log — copy findings after each brief | Active |
| SBDC meeting prep | Manual — session-based brief generation | Active |

---

## Technical Key Trigger

No slash command. Activated by loading `source.md` as context and issuing a scoped intelligence query.

**Recommended session opener:**
```
[Load: core/system-principles.md + agents/identity/ARTHUR_MASTER_BIO.md + agents/researcher/source.md]
Run Sovereign Intelligence brief: [scope]
```

---

## Redundancy Flags

None. This is the only intelligence agent in the system. No overlap detected with any other agent.
