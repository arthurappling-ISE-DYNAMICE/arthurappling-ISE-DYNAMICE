# Recursive Integrity Audit — Setup
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

### [GROUND TRUTH GATE]

Before executing any audit pass, confirm the following are true.
Unconfirmed state = do not proceed. Request Ground Truth Audit.

- [ ] Running from within a Claude Code session with filesystem access to `C:/Users/arthu/GeminiEcosystem/`
- [ ] Port 3132 check requires local network access (WSL or Windows terminal curl)
- [ ] Vault PDF paths are accessible — confirm vault/ directory is mounted and readable
- [ ] Agent file paths below reflect current canonical structure (see risks-and-limitations.md for stale path warnings)

---

## PASS 1 — Silo Integrity

**Command:**
```bash
ls C:/Users/arthu/GeminiEcosystem/tools/
ls C:/Users/arthu/GeminiEcosystem/agents/
ls C:/Users/arthu/GeminiEcosystem/workflows/
ls C:/Users/arthu/.claude/skills/
```

**Pass Criteria:** All expected silos present. No unexpected folders.

| Silo | Expected Contents |
|------|------------------|
| `tools/` | `betting_engine`, `consulting_wing`, `hyperframes`, `market_intelligence`, `video_production` |
| `agents/` | `research_agent.md`, `bid_architect.md`, `betting_quant.md`, `identity/ARTHUR_MASTER_BIO.md` |
| `workflows/` | Vertical folders present (bidding/, consulting/, real-estate/, research/) |
| `.claude/skills/` | All registered skills present |

**Error Map:**

| Error | Cause | Resolution |
|-------|-------|------------|
| Expected silo missing | Folder deleted or renamed | STOP — alert Architect; do not restore without confirmation |
| Unexpected folder present | Unlogged addition | Log in memory/lessons-learned.md; investigate before accepting |
| `agents/master_bio.md` found at root agents/ | Deprecated file not yet removed | See risks-and-limitations.md — canonical path is `agents/identity/ARTHUR_MASTER_BIO.md` |

---

## PASS 2 — Live Services Check

**Command:**
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3132/
```

**Pass Criteria:** HTTP 200.

**Error Map:**

| Error | Cause | Resolution |
|-------|-------|------------|
| HTTP 000 or connection refused | Betting Console not running | `cd tools/betting_engine && npx serve public -p 3132` |
| HTTP 404 | Server running but wrong root | Check serve config — public/ directory must be the serve target |

---

## PASS 3 — Agent Constants Verification

**Command:** Open each file and confirm presence of constants.

```
1. Open agents/researcher/source.md → confirm SBDC date and DSCR 7.42x present
2. Open agents/identity/ARTHUR_MASTER_BIO.md → confirm EIN 84-4788578 present
3. Open agents/sportsbook-analyst/source.md → confirm No-Lose Ladder and Draft window present
```

**Pass Criteria:** All three constants present in canonical files.

**Error Map:**

| Error | Cause | Resolution |
|-------|-------|------------|
| DSCR or EIN missing | File edited without constant restore | Hardcode restore from `~/.claude/CLAUDE.md` |
| SBDC date missing | File corruption or overwrite | Restore from: `core/system-principles.md` HARDCODED_CONSTANTS block |

---

## PASS 4 — Workflow Integrity

**Command:**
```bash
ls C:/Users/arthu/GeminiEcosystem/.github/workflows/
```

**Pass Criteria:** `sovereign_audit.yml` present.

**Error Map:**

| Error | Cause | Resolution |
|-------|-------|------------|
| `sovereign_audit.yml` missing | File deleted or directory removed | STOP — alert Architect; restore from last known git commit before re-creating |

---

## PASS 5 — Vault Assets

**Command:** Confirm file existence at canonical paths.

```
Confirm: vault/AA_Capital_Institutional_Prospectus_FINAL.pdf
Confirm: vault/prime_pathwy_master/assets/Prime_Pathway_MASTER_MERGED_2026.pdf
```

**Pass Criteria:** Both PDFs confirmed present and non-zero size.

**Error Map:**

| Error | Cause | Resolution |
|-------|-------|------------|
| PDF missing | File deleted, moved, or vault not mounted | STOP — alert Architect; do not attempt reconstruction without Ground Truth Audit |
| PDF zero bytes | Corruption during write | Alert Architect; restore from backup before any session that depends on vault content |
