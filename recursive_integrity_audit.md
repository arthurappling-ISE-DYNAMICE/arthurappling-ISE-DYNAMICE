# RECURSIVE INTEGRITY AUDIT — VAULT PROTOCOL
## Purpose: Detect operational drift and context scramble across all Sovereign Engine folders

---

## AUDIT SEQUENCE (run in order)

### PASS 1 — SILO INTEGRITY
```bash
ls C:/Users/arthu/GeminiEcosystem/tools/
ls C:/Users/arthu/GeminiEcosystem/agents/
ls C:/Users/arthu/GeminiEcosystem/workflows/
ls C:/Users/arthu/.claude/skills/
```
Pass Criteria: All expected silos present. No unexpected folders.
Expected silos: `betting_engine`, `consulting_wing`, `hyperframes`, `market_intelligence`, `video_production`
Expected agents: `master_bio.md`, `research_agent.md`, `bid_architect.md`, `betting_quant.md`

### PASS 2 — LIVE SERVICES CHECK
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3132/
```
Pass Criteria: HTTP 200. If not — restart: `cd tools/betting_engine && npx serve public -p 3132`

### PASS 3 — AGENT CONSTANTS VERIFICATION
- Open `agents/research_agent.md` → confirm SBDC date and DSCR 7.42x present
- Open `agents/master_bio.md` → confirm EIN 84-4788578 present
- Open `agents/betting_quant.md` → confirm No-Lose Ladder and Draft window present

### PASS 4 — WORKFLOW INTEGRITY
```bash
ls C:/Users/arthu/GeminiEcosystem/.github/workflows/
```
Pass Criteria: `sovereign_audit.yml` present. If missing — restore from agents/research_agent.md context.

### PASS 5 — VAULT ASSETS
- Confirm: `vault/AA_Capital_Institutional_Prospectus_FINAL.pdf` exists
- Confirm: `vault/prime_pathwy_master/assets/Prime_Pathway_MASTER_MERGED_2026.pdf` exists

---

## DRIFT FLAGS (escalate immediately)
- Any expected agent file missing → STOP, alert Architect
- Port 3132 down and watchdog not running → restart both
- DSCR or EIN missing from constants → hardcode restore from `~/.claude/CLAUDE.md`
- `sovereign_audit.yml` missing → re-create from last known config

---

## OUTPUT FORMAT
Print a clean status table:
| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| tools/ silos | 5 folders | X found | PASS/FAIL |
| Port 3132 | HTTP 200 | HTTP XXX | PASS/FAIL |
| Agent constants | SBDC + DSCR | Present/Missing | PASS/FAIL |
| Vault assets | 2 PDFs | X found | PASS/FAIL |
