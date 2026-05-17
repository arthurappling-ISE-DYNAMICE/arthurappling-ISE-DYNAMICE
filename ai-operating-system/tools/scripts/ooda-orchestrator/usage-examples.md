# OODA Orchestrator — Usage Examples
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Example 1 — Default Run (Property Turnover Analysis)

```bash
cd C:/Users/arthu/GeminiEcosystem/tools
python ooda_orchestrator.py
```

**Output:**
```
[*] STARTING OODA LOOP: Analyze Local Property Turnover Leads
[+] OBSERVE: Processing...
[+] ORIENT: Processing...
[+] DECIDE: Processing...
[+] ACT: Processing...
[!] SUCCESS: Task aligned with 1.5-Year Automation / Prime Pathwy
```

---

## Example 2 — Custom Task String

```python
# In ooda_orchestrator.py __main__ block:
if __name__ == "__main__":
    agent = OODAAgent()
    agent.execute_loop("Evaluate SAM.gov bid for NAICS 561720 — Solano County")
```

```bash
python ooda_orchestrator.py
```

**Output:**
```
[*] STARTING OODA LOOP: Evaluate SAM.gov bid for NAICS 561720 — Solano County
[+] OBSERVE: Processing...
[+] ORIENT: Processing...
[+] DECIDE: Processing...
[+] ACT: Processing...
[!] SUCCESS: Task aligned with 1.5-Year Automation / Prime Pathwy
```

---

## Example 3 — Programmatic Import (Future Extension)

```python
from ooda_orchestrator import OODAAgent

agent = OODAAgent(mission="Elite 10 Client Acquisition")
agent.execute_loop("Score top 3 consulting prospects from browser scout output")
```

---

## Anti-Patterns

- **DO NOT** run with the default task string in production outreach context — it is a demo task; customize before any real workflow use
- **DO NOT** treat stage "Processing..." output as actual data analysis — the current implementation is scaffold only
- **DO NOT** extend stage logic without adding Pass Criteria and Error Map for each new stage method
- **DO NOT** change the mission constant without Architect confirmation — it is a hardcoded operational anchor
