# ISE Betting Console — Risks & Limitations
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Known Limitations

- **Port 3132 is not auto-starting by default** — `register_startup.ps1` must be run once to enable boot-time auto-start. Until registered, the console requires manual `npx serve public -p 3132` each session.
- **No authentication on localhost:3132** — the console is unprotected on the local network. Do not expose port 3132 to external networks or via port forwarding without adding authentication.
- **Bet history is not synced to vault** — `bet_history.json` and `Canonical_Bet_History.json` are stored only in `tools/betting_engine/`. No automated vault backup. Manual copy required before any destructive operation on the tools/ directory.
- **No CI/CD integration** — the console has no tests, no deployment pipeline, and no watchdog. `sovereign_audit.yml` provides nightly health checks but does not restart the service if found down.
- **William Hill platform dependency** — the XERO XERO protocol is built for William Hill. If platform changes or access is lost, the entire 4-scan analysis sequence needs platform re-targeting.

---

## Failure Modes

| Scenario | What Breaks | Mitigation |
|----------|-------------|------------|
| Port 3132 down at session start | Recursive Integrity Audit PASS 2 fails | Restart: `cd tools/betting_engine && npx serve public -p 3132` |
| bet_history.json overwritten | Session bet records lost | Always diff against Canonical before any write; restore from Canonical if corrupted |
| Canonical_Bet_History.json overwritten | Permanent record lost — unrecoverable | Never overwrite Canonical without explicit Architect confirmation — treat as read-only |
| `app.js` modified unexpectedly | Dashboard stops serving | Restore from last known git commit: `git checkout tools/betting_engine/app.js` |
| npx serve not available | Console cannot start | `npm install -g serve` or use `node app.js` as fallback if app.js has standalone serve logic |

---

## Deprecation Risk

**Low.** The console is a local tool with no external dependencies beyond Node.js and serve. Platform risk (William Hill) is external and uncontrolled — maintain awareness of account status.

---

## Conflicts With

No conflicts. The betting console is a standalone UI tool — it receives analysis output from the sportsbook-analyst agent and does not govern any other workflow. The Recursive Integrity Audit monitors it but does not depend on it for its own execution.
