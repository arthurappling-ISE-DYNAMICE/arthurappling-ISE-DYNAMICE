# ISE Betting Console — Integration Map
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Upstream Dependencies

| Source | What It Provides |
|--------|-----------------|
| `agents/sportsbook-analyst/` | XERO XERO 4-scan NFL analysis — input for No-Lose Ladder construction |
| Node.js v22+ | Runtime for app.js and npx serve |
| `tools/betting_engine/Canonical_Bet_History.json` | Permanent bet record — source of truth for all historical analysis |

---

## Downstream Consumers

| Consumer | What It Receives |
|----------|-----------------|
| Architect (Arthur F. Appling Sr.) | Visual parlay dashboard at localhost:3132 |
| `tools/betting_engine/bet_history.json` | Session bet entries logged per game week |
| `workflows/research/recursive-integrity-audit/` | HTTP 200 health signal — PASS 2 of system integrity audit |

---

## Workflow Position

```
XERO XERO Sportsbook Analyst — 4-scan NFL analysis complete
        ↓
No-Lose Ladder Protocol — 3-tier parlay construction
        ↓
ISE Betting Console (localhost:3132) — dashboard display
        ↓
bet_history.json — session log
        ↓
Canonical_Bet_History.json — permanent record (Architect-confirmed only)
```

---

## Active Integrations

| System | Integration Type | Status |
|--------|-----------------|--------|
| `agents/sportsbook-analyst/` | Analysis consumer → console display | Active |
| `workflows/research/recursive-integrity-audit/` | HTTP 200 health check (PASS 2) | Active |
| `.github/workflows/sovereign_audit.yml` | Nightly availability monitoring | Active |
| `tools/betting_engine/register_startup.ps1` | Windows boot-time auto-start | Manual — must be registered once |

---

## Technical Key Trigger

No slash command. Live service — manually started or auto-started via register_startup.ps1.

**Start sequence:**
```
1. cd C:/Users/arthu/GeminiEcosystem/tools/betting_engine
2. npx serve public -p 3132
3. Verify: curl http://localhost:3132/ → HTTP 200
4. Open: http://localhost:3132/ in browser for dashboard
```

---

## Redundancy Flags

No redundancy. The ISE Betting Console is the only live dashboard for betting intelligence in this ecosystem. It is a display layer — not a data source. All analytical logic lives in the sportsbook-analyst agent, not in the console.
