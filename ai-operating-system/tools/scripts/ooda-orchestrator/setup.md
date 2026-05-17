# OODA Orchestrator — Setup
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

### [GROUND TRUTH GATE]

Before running or extending ooda_orchestrator.py, confirm the following are true.
Unconfirmed state = do not proceed. Request Ground Truth Audit.

- [ ] Python 3.x available: `python --version` or `python3 --version`
- [ ] No external dependencies required — stdlib only (`time` module)
- [ ] Task string defined before execution — do not run with default task in production context
- [ ] Mission constant matches current operational doctrine: `1.5-Year Automation / Prime Pathwy`

---

## Run the Orchestrator

**Command:**
```bash
cd C:/Users/arthu/GeminiEcosystem/tools
python ooda_orchestrator.py
```

**Expected output:**
```
[*] STARTING OODA LOOP: Analyze Local Property Turnover Leads
[+] OBSERVE: Processing...
[+] ORIENT: Processing...
[+] DECIDE: Processing...
[+] ACT: Processing...
[!] SUCCESS: Task aligned with 1.5-Year Automation / Prime Pathwy
```

**Pass Criteria:** All 4 stages print. SUCCESS line confirms mission alignment.

**Error Map:**

| Error | Cause | Resolution |
|-------|-------|------------|
| `python: command not found` | Python not on PATH | Use `python3` instead; or install Python 3.x from python.org |
| `ModuleNotFoundError: time` | Corrupted stdlib (rare) | Reinstall Python |
| Stage hangs | `time.sleep(0.5)` frozen | Ctrl+C to interrupt; check system resource state |

---

## Extending Stage Logic

To extend beyond scaffold, replace `print` statements in `execute_loop()` with real logic:

```python
def execute_loop(self, task):
    # OBSERVE: pull live data
    data = self.observe(task)
    # ORIENT: analyze against mission context
    analysis = self.orient(data)
    # DECIDE: apply rule engine
    decision = self.decide(analysis)
    # ACT: execute decision (API call, file write, alert)
    self.act(decision)
```

Each stage method should have its own Pass Criteria and Error Map before extending to production use.
