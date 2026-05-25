# PRIME PATHWY: GROUND TRUTH AUDIT
## ZERO-INFERENCE INCIDENT REPORT & SYSTEM DIAGNOSTIC

> **Zero-Inference Rule:** If a script, workflow, or system fails its validation contract twice during testing, the agent or operator must halt execution immediately. Do not guess the fix. Document the exact state of the environment below to preserve data sovereignty and allow rapid technical intervention.

---

## DOWNLOAD & USAGE INSTRUCTIONS
* **File Location in Repository:** `/temporary/GROUND_TRUTH_AUDIT.md`
* **Local Download Command:** `gh file view temporary/GROUND_TRUTH_AUDIT.md > GROUND_TRUTH_AUDIT.md`
* **Purpose:** Fill out this template immediately when any system fails its validation contract twice. Do not attempt to fix the system until this audit is complete and reviewed by the Lead Technical Architect.

---

### I. INCIDENT OVERVIEW

| Field | Incident Details |
| :--- | :--- |
| **Audit Timestamp** | [YYYY-MM-DD HH:MM:SS] |
| **Failing System** | [Name of the script or system that failed] |
| **Category** | [CATEGORY A / B / C / D] |
| **WAT File Path** | [e.g., /tools/failing_script.py] |
| **Operator/Agent** | [Name of the Agent or Operator] |

---

### II. ENVIRONMENT STATE AT FAILURE

Provide the exact environmental variables and system metrics at the time of the second failure.

* **Operating System:** `Ubuntu 22.04 LTS`
* **Python Version:** `Python 3.11`
* **Active Working Directory:** `[e.g., /home/ubuntu/arthurappling-ISE-DYNAMICE]`
* **Recent Terminal Command Run:**
```bash
# Insert exact terminal command that triggered the failure
```

---

### III. GROUND TRUTH LOGS & ERROR TRACES

Paste the raw, unedited error logs or stdout/stderr output. **Do not truncate or summarize.**

```
[PASTE RAW LOGS HERE]
```

---

### IV. SCREENSHOT / VISUAL VERIFICATION (IF APPLICABLE)

If the failure occurred in a browser-based environment, dashboard, or UI component:
* **UI URL:** `[e.g., http://localhost:8080]`
* **Saved Screenshot Path:** `[e.g., /temporary/screenshots/failure_01.png]`
* **Visual Description of Failure State:** [Describe what was rendered vs what was expected]

---

### V. PREVENTATIVE ACTION MAP

Before resuming, the technical architect must define the exact fix to prevent future occurrences.

| Expected Behavior | Observed Behavior | Resolution Action Required |
| :--- | :--- | :--- |
| [What the system was supposed to do] | [What the system actually did] | [The precise fix to be implemented] |
