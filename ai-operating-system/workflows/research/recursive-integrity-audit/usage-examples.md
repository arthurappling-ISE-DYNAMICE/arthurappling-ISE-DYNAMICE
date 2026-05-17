# Recursive Integrity Audit — Usage Examples
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Example 1 — Full 5-Pass Audit (Session Startup)

**Scenario:** Beginning a new session. Running audit before any operational work.

**Execution:**
```bash
# PASS 1 — Silo Integrity
ls C:/Users/arthu/GeminiEcosystem/tools/
ls C:/Users/arthu/GeminiEcosystem/agents/
ls C:/Users/arthu/GeminiEcosystem/workflows/
ls C:/Users/arthu/.claude/skills/

# PASS 2 — Live Services
curl -s -o /dev/null -w "%{http_code}" http://localhost:3132/

# PASS 3 — Agent Constants (manual file review)
# Open agents/researcher/source.md → verify DSCR 7.42x
# Open agents/identity/ARTHUR_MASTER_BIO.md → verify EIN 84-4788578
# Open agents/sportsbook-analyst/source.md → verify No-Lose Ladder

# PASS 4 — Workflow Integrity
ls C:/Users/arthu/GeminiEcosystem/.github/workflows/

# PASS 5 — Vault Assets (manual confirm)
# Verify: vault/AA_Capital_Institutional_Prospectus_FINAL.pdf
# Verify: vault/prime_pathwy_master/assets/Prime_Pathway_MASTER_MERGED_2026.pdf
```

**Expected output table:**
```
| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| tools/ silos | 5 folders | 5 found | PASS |
| Port 3132 | HTTP 200 | HTTP 200 | PASS |
| Agent constants | SBDC + DSCR + EIN | All present | PASS |
| sovereign_audit.yml | Present | Present | PASS |
| Vault assets | 2 PDFs | 2 found | PASS |
```

---

## Example 2 — Ground Truth Audit Trigger

**Scenario:** Zero-Inference rule fired. Two consecutive tool failures in session. Ground Truth Audit required.

**Action:** Run all 5 passes in sequence. Do not resume operational work until status table shows all PASS.

**If any FAIL:**
1. Stop all operational work
2. Alert Architect with exact FAIL row
3. Resolve the failure — use Error Map in setup.md
4. Re-run that pass only to confirm resolution
5. Resume operational work only after re-run PASS confirmed

---

## Example 3 — Post-Deployment Validation

**Scenario:** Major change deployed (new agent file, workflow restructure, skills update). Validate integrity.

**Focus passes:** PASS 1 (new silo check) + PASS 3 (constants in new files) only.

**Shortcut sequence:**
```bash
ls C:/Users/arthu/GeminiEcosystem/agents/
ls C:/Users/arthu/GeminiEcosystem/workflows/
# Then manually open any new agent files added to verify constants present
```

---

## Anti-Patterns

- **DO NOT** skip PASS 1 because "you just ran it" — directory state changes between sessions
- **DO NOT** accept verbal/mental confirmation for any pass — the status table must be produced in writing
- **DO NOT** continue session after any FAIL without resolving and re-confirming
- **DO NOT** check `agents/master_bio.md` (deprecated) — canonical path is `agents/identity/ARTHUR_MASTER_BIO.md`
- **DO NOT** run passes out of order — PASS 3 depends on PASS 1 confirming agent files exist
