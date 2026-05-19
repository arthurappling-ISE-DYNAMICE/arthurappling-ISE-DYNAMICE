# Bid Architect — Sovereign Subcontracting Engine — Setup
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

### [GROUND TRUTH GATE]

Before activating this agent, confirm the following are true in your current environment.
Unconfirmed state = do not proceed. Request Ground Truth Audit.

- [ ] SAM.gov registration is active for EIN 84-4788578 (verify at sam.gov — do not assume)
- [ ] NAICS codes 561720 and 562111 are registered and active on SAM.gov
- [ ] DUNS 12-3035654 is current (Dun & Bradstreet confirmation)
- [ ] Perplexity or web search access is available for `/bid scout` and `/bid analyze`
- [ ] Manus is accessible if running `/bid analyze` with Manus Core Command
- [ ] Source file is loaded as context: `agents/marketing-engine/source.md`

---

## Installation

This is a prompt-based agent. No runtime installation required.

### Step 1 — Load Context

**Action:** Load in this order:
```
1. ai-operating-system/core/system-principles.md
2. ai-operating-system/agents/identity/ARTHUR_MASTER_BIO.md
3. ai-operating-system/agents/marketing-engine/source.md
```

**Pass Criteria:** All three files loaded as context. Agent responds to `/bid scout` with the Credential Plate rendered first.

**Error Map:**
| Error | Cause | Resolution |
|-------|-------|------------|
| Credential Plate missing from output | Source file not loaded | Re-load `source.md` before issuing any `/bid` command |
| Identity constants incorrect in output | Wrong source file loaded | Verify `source.md` contains EIN 84-4788578 and DUNS 12-3035654 |

---

### Step 2 — Activate via Sub-Command

**Commands (three available):**
```
/bid scout
/bid analyze [paste solicitation URL or text]
/bid draft [solicitation number e.g. W912BV-26-R-0014]
```

**Pass Criteria:** Each command produces output beginning with the Credential Plate block verbatim.

**Error Map:**
| Error | Cause | Resolution |
|-------|-------|------------|
| Output skips Credential Plate | Context lost mid-session | Re-load source.md and re-issue command |
| Qualification Matrix shows wrong NAICS | Query included out-of-scope codes | Confirm scope: 561720 and 562111 only |
| PAST PERFORMANCE section left blank | Manual fill required | Complete before submitting bid package |

---

## Configuration

No environment variables. No API keys.

Update `source.md` when:
- SAM.gov registration details change
- NAICS codes are added or removed
- Bonding capacity changes (affects Qualification Matrix YELLOW/RED thresholds)
- Address changes from 425 Virginia St STE B, Vallejo, CA 94590

---

## Log Output

After each `/bid scout` session, log results to:
```
logs/bid_scout_YYYY-MM-DD.md
```
After each `/bid draft` completion, log to:
```
logs/bid_draft_[bid_id]_YYYY-MM-DD.md
```
