# Sovereign Intelligence Research Agent — Setup
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

### [GROUND TRUTH GATE]

Before activating this agent, confirm the following are true in your current environment.
Unconfirmed state = do not proceed. Request Ground Truth Audit.

- [ ] The source file is loaded as context: `agents/researcher/source.md`
- [ ] Hardcoded constants are current (verify DSCR, entity name, active systems list)
- [ ] Web search or Perplexity access is available in the active session
- [ ] The session has not already produced an unreviewed intelligence brief

---

## Installation

This is a prompt-based agent. No installation, runtime, or dependency management required.

### Step 1 — Load Governance Context

**Action:** Load in this order before activating the agent:
```
1. ai-operating-system/core/system-principles.md
2. ai-operating-system/agents/identity/ARTHUR_MASTER_BIO.md
3. ai-operating-system/agents/researcher/source.md
```

**Pass Criteria:** All three files loaded as context in the active session without error.

**Error Map:**
| Error | Cause | Resolution |
|-------|-------|------------|
| File not found | Path incorrect or file moved | Verify path against design manifest; locate original at `agents/research_agent.md` |
| Context window exceeded | Session already loaded with heavy context | Start a fresh session; load governance files first |

---

### Step 2 — Activate Agent

**Command:**
```
You are the Sovereign Intelligence Research Agent for Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy.
Apply the Zero-Hype filter. Report only Concrete and Steel assets.
[Paste your intelligence query here]
```

**Pass Criteria:** Agent response begins with an assessment of concrete capability, not marketing framing.

**Error Map:**
| Error | Cause | Resolution |
|-------|-------|------------|
| Response contains hype language | Governance context not loaded first | Re-load source.md and re-issue query |
| Agent references stale constants | Constants block not current | Update HARDCODED CONSTANTS in source.md before activating |

---

## Configuration

No environment variables or API keys required.

Update hardcoded constants in `source.md` when:
- DSCR anchor changes
- Active systems list changes
- New hardcoded dates become relevant
