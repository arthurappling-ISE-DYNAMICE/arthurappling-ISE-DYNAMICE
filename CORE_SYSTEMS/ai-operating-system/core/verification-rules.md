# Verification Rules
**Architect:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy
**Classification:** Foundational | Core Governance
**Last Updated:** 2026-05-17

---

## Zero-Inference Rule

**Never assume system state.**

If a system state is not explicitly confirmed — by a direct observation, a command output, or a documented ground truth — it does not count as confirmed. Inference is not confirmation.

This applies to:
- File existence
- Service running status
- API key validity
- Environment variable presence
- Network connectivity
- Data accuracy

---

## Ground Truth Audit Trigger

If two consecutive actions fail or return unexpected results, **stop immediately**.

Do not attempt a third action. Do not try a workaround. Do not infer a cause.

**Trigger the Ground Truth Audit:**

```
GROUND TRUTH AUDIT TRIGGERED
Two consecutive failures detected.
Halt all further execution.

Required before resuming:
1. Confirm exact current state of [system/file/service].
2. Confirm expected state vs. observed state.
3. Identify the specific point of divergence.
4. Receive explicit instruction to proceed.
```

---

## Verification Hierarchy

Before acting on any assumed state, verify in this order:

| Priority | Verification Method | Validity |
|----------|-------------------|---------|
| 1 | Direct command output (run it now) | Ground truth |
| 2 | Documented state in a file (timestamped) | Valid if recent |
| 3 | Prior session memory | Requires re-verification |
| 4 | Inference / assumption | Never valid |

---

## Prohibited Patterns

The following patterns violate the Zero-Inference Rule and are prohibited across all sessions:

- "It should be working" without verification
- "The file probably exists" without a directory check
- "The API key is likely still valid" without a test call
- "That was working before" without a current confirmation
- Proceeding past two consecutive failures without a Ground Truth Audit
