# ISE Betting Console — Setup
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

### [GROUND TRUTH GATE]

Before working with betting_engine data or triggering analysis, confirm the following are true.
Unconfirmed state = do not proceed. Request Ground Truth Audit.

- [ ] Port 3132 returns HTTP 200: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3132/`
- [ ] `tools/betting_engine/Canonical_Bet_History.json` exists and is non-zero
- [ ] Node.js v22+ available: `node --version`
- [ ] `tools/betting_engine/package.json` dependencies installed: `npm install` run from `tools/betting_engine/`

---

## Start the Console

**Command:**
```bash
cd C:/Users/arthu/GeminiEcosystem/tools/betting_engine
npx serve public -p 3132
```

**Pass Criteria:** Console running. `curl http://localhost:3132/` returns HTTP 200.

**Error Map:**

| Error | Cause | Resolution |
|-------|-------|------------|
| `EADDRINUSE :3132` | Port already in use | Another process holds 3132 — check with `netstat -ano | findstr :3132`; kill or reuse existing process |
| `npx: command not found` | Node/npm not on PATH | Confirm Node.js v22+ installed; restart terminal |
| HTTP 404 on index | `public/` directory empty or wrong serve root | Confirm `tools/betting_engine/public/index.html` exists |
| Bet history not loading | `bet_history.json` missing or malformed JSON | Restore from `Canonical_Bet_History.json` — never overwrite Canonical without Architect confirmation |

---

## Register Startup (Windows)

To auto-start console on system boot:
```powershell
# Run once — registers betting_engine as a startup task
C:/Users/arthu/GeminiEcosystem/tools/betting_engine/register_startup.ps1
```

**Pass Criteria:** Task appears in Windows Task Scheduler. Port 3132 live after next reboot.
