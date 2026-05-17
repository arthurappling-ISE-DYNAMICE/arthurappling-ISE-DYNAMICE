# Recursive Integrity Audit — Summary
**Classification:** Operational
**Category:** Workflow / Research / System Health
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy
**Last Updated:** 2026-05-17

---

## Purpose

5-pass system integrity check for the entire Sovereign Engine. Detects operational drift, context scramble, missing agent files, downed services, and vault asset corruption. Runs in order — each pass must complete before the next begins. Produces a clean status table (PASS/FAIL per check) for rapid Architect review.

---

## Practical Use Cases

- Session startup: run before any operational task to confirm system state
- Post-deployment validation: after any major change to agents/, tools/, or workflows/
- Monthly audit: scheduled integrity sweep to catch silent drift
- Ground Truth Audit trigger: when Zero-Inference rule fires (two consecutive failures)

---

## Audit Passes

| Pass | Name | What It Checks |
|------|------|----------------|
| PASS 1 | Silo Integrity | All expected directories present in tools/, agents/, workflows/, .claude/skills/ |
| PASS 2 | Live Services Check | Port 3132 (Betting Console) returns HTTP 200 |
| PASS 3 | Agent Constants Verification | SBDC date, DSCR 7.42x, EIN 84-4788578 present in canonical agent files |
| PASS 4 | Workflow Integrity | `.github/workflows/sovereign_audit.yml` present |
| PASS 5 | Vault Assets | Two canonical PDFs confirmed at vault paths |

---

## Output Format

Status table — one row per check:
```
| Check | Expected | Actual | Status |
```
PASS = green light. FAIL = stop, alert Architect, do not proceed.

---

## DSCR Gate

**Input:** ~5 minutes per audit run
**Output:** Confirmed operational state = zero wasted session time on broken assumptions
**Estimated Output/Input Ratio:** Every session protected from Zero-Inference violations = effectively infinite leverage on session productivity
