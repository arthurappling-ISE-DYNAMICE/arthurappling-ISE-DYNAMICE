# OODA Orchestrator — Integration Map
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Upstream Dependencies

| Source | What It Provides |
|--------|-----------------|
| `core/decision-frameworks.md` | OODA loop doctrine — the framework this tool implements |
| Python 3.x stdlib | `time` module — only dependency |
| Task string (caller-defined) | The task being processed through the 4-stage loop |

---

## Downstream Consumers

| Consumer | What It Receives |
|----------|-----------------|
| Architect (Arthur F. Appling Sr.) | stdout output — 4-stage confirmation + SUCCESS alignment message |
| Future extended implementations | Stage outputs from real OBSERVE/ORIENT/DECIDE/ACT logic (not yet built) |

---

## Workflow Position

```
Multi-step task identified (manual or agent-triggered)
        ↓
OODA Orchestrator — 4-stage sequential processing
        ↓
OBSERVE → ORIENT → DECIDE → ACT
        ↓
SUCCESS: Task aligned with mission constant
        ↓
Task result available for downstream use (manual handoff in current scaffold state)
```

---

## Active Integrations

| System | Integration Type | Status |
|--------|-----------------|--------|
| `core/decision-frameworks.md` | Doctrine reference | Active (framework governs) |
| Browser Scout Protocol | Future: ACT stage could trigger scout.js | Not yet implemented |
| NEPQ Drafter | Future: ACT stage could pipe leads to nepq_drafter.js | Not yet implemented |

---

## Technical Key Trigger

No slash command. Manual execution from terminal.

**Activation sequence:**
```
1. Define task string
2. python C:/Users/arthu/GeminiEcosystem/tools/ooda_orchestrator.py
3. Confirm: all 4 stages print + SUCCESS line
4. Capture stdout if result needed downstream
```

---

## Redundancy Flags

No redundancy in current scaffold form. When extended to production automation, review overlap with Browser Scout Protocol (OBSERVE stage may duplicate scout.js data pull) and NEPQ Drafter (ACT stage may duplicate drafter output). Document any integration before activating.
