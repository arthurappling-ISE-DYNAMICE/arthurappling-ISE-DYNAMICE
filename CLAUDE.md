# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js project for experimenting with Google's Gemini AI API. It uses ES6 modules (`"type": "module"`) and requires Node.js >=20.

## Running the Apps

All commands run from the `gemini-app/` directory:

```bash
cd gemini-app
node index.js   # Console output: generates motivational text via Gemini
node chat.js    # TTS output: generates motivational text and speaks it aloud
```

## Architecture

Two standalone scripts sharing the same pattern:

- **index.js** — Calls Gemini API and prints the response to the console.
- **chat.js** — Same as index.js, but also pipes the response through `speak()`, which chunks text into ≤350-character segments and uses Windows PowerShell's `System.Speech.Synthesis.SpeechSynthesizer` ("Microsoft Zira Desktop" voice) for TTS. TTS is Windows-only.

Both scripts attempt `gemini-2.5-pro` first and fall back to `gemini-2.5-flash` on failure.

## Configuration

The Gemini API key is loaded from `gemini-app/.env`:

```
GOOGLE_API_KEY=your_key_here
```

## Dependencies

- `@google/genai` — Google Gemini JS SDK
- `dotenv` — Loads `.env` into `process.env
git remote -v`

---

# SOVEREIGN ENTERPRISE EXECUTION PROTOCOL
## Supreme Architectural Law — AA Capital INC dba Prime Pathwy
### Architect: Arthur F. Appling Sr. | EIN: 84-4788578 | DUNS: 12-3035654
### Effective: 2026-05-18 | Status: PERMANENT GOVERNANCE LOCK

This protocol governs every AI agent, session, and automated process operating within
this repository. It supersedes all default behaviors. It is not a suggestion.

---

## SECTION 1 — SOVEREIGN IDENTITY & LEGAL ANCHOR

```
ENTITY:    AA Capital INC dba Prime Pathwy
ARCHITECT: Arthur F. Appling Sr., Lead Technical Architect
EIN:       84-4788578
DUNS:      12-3035654
LOCATION:  Vallejo, CA 94590
EMAIL:     arthurappling@gmail.com
```

Hardcoded Financial Constants — never overwrite, never infer:
- `DSCR: 7.42x` — primary loan qualification anchor
- `FLEET_VOUCHER: HVIP Class 4–5 · $130K · Carl Moyer 415.749.4994`
- `SBDC_MEETING: April 24, 2026`

This repository is classified as:
- Future commercial IP
- Future licensing infrastructure
- Future audit-sensitive property
- Future acquisition-grade architecture

---

## SECTION 2 — PERMANENT FOUR-LAYER ARCHITECTURE LAW

The repository operates exclusively under four sovereign zones. This structure is
PERMANENT GOVERNANCE LAW. No agent may create top-level directories outside these zones
without explicit written authorization from the Lead Architect.

```
GeminiEcosystem/
├── CORE_SYSTEMS/     ← live operational applications, APIs, DBs, dashboards
├── INTELLIGENCE/     ← institutional knowledge, procurement, compliance, SOPs
├── AUTOMATION/       ← workflows, orchestrators, schedulers, pipelines
├── ARCHIVE/          ← immutable historical storage, snapshots, retired systems
├── docs/             ← repository documentation (root-level permitted)
├── .github/          ← CI/CD workflows (root-level permitted)
└── [config files]    ← CLAUDE.md, .gitignore, package.json, README.md, LICENSE
```

**CORE_SYSTEMS** — contains only live, executable production systems:
- `PrimePathwyOS/` — FastAPI sovereign operating system (port 8005)
- `ISE_Betting_Console/` — quantitative betting engine
- `ISE_Health_Console/` — biometric health dashboard

**INTELLIGENCE** — contains only institutional knowledge assets:
- `SOVEREIGN_KNOWLEDGE_VAULT/`, `government-intelligence/`, `competitive-intelligence/`
- `commercial-intelligence/`, `compliance-intelligence/`, `ai-workflows/`
- `finance-intelligence/`, `real-estate-intelligence/`

**AUTOMATION** — contains only deterministic execution systems:
- workflows, orchestrators, schedulers, ingestion pipelines, notification services

**ARCHIVE** — immutable. Nothing is modified once placed here.

---

## SECTION 3 — ZERO-INFERENCE EXECUTION DOCTRINE

```
RULE: Never assume system state.
RULE: Never guess file locations.
RULE: Never infer application status.
RULE: Two consecutive failures = STOP. Request Ground Truth Audit.
```

Every actionable response requires the Validation Triad:
1. **Exact Command** — the precise shell command to execute
2. **Pass Criteria** — the exact output that confirms success
3. **Error Map** — the exact failure modes and their remediation steps

Violating any element of the Validation Triad is a protocol breach.

---

## SECTION 4 — APPLICATION PROTECTION PROTOCOL

The following are PERMANENTLY PROTECTED. No agent may modify these without explicit
written authorization from the Lead Architect:

| Protected Asset | Location | Reason |
|---|---|---|
| FastAPI routes | `CORE_SYSTEMS/PrimePathwyOS/app/backend/` | Production API surface |
| SQLite schemas | `CORE_SYSTEMS/PrimePathwyOS/DATABASE/` | Live client data |
| Auth systems | `CORE_SYSTEMS/PrimePathwyOS/app/security/` | Security boundary |
| Frontend layouts | `CORE_SYSTEMS/PrimePathwyOS/app/frontend/` | Live UI |
| API endpoints | Any `@app.get/post/put/delete` decorator | Contract surface |
| Validation suites | `CORE_SYSTEMS/PrimePathwyOS/tests/` | Tier validation |
| Client archives | `CORE_SYSTEMS/PrimePathwyOS/ARCHIVE/` | Immutable records |
| Environment vars | Any `.env` file | Credential boundary |
| Database files | Any `.db`, `.db-wal`, `.db-shm` | Live data |
| Dependencies | `requirements.txt`, `package.json` | Runtime contract |

**NEVER** `git rm` a protected asset without explicit authorization.
**NEVER** rename API endpoints without a migration plan.
**NEVER** move a hot SQLite database (`.db-wal` present = locked = stop).

---

## SECTION 5 — GIT LINEAGE & BRANCH GOVERNANCE

This repository preserves permanent Git lineage. The following operations are
FORBIDDEN without explicit Lead Architect authorization:

```
FORBIDDEN: git push --force
FORBIDDEN: git reset --hard (on shared branches)
FORBIDDEN: git rebase -i (on published commits)
FORBIDDEN: git commit --amend (on published commits)
FORBIDDEN: git branch -D (without archival review)
FORBIDDEN: --no-verify (hook bypass)
```

**Active branch structure:**
- `main` — production-sealed. Merge-only. No direct commits.
- `mvp-hardening` — active hardening branch. All governance operations land here first.
- `feat/*` — feature branches. Merge to `mvp-hardening` before `main`.

**Commit message law:** All structural governance commits use the prefix:
- `arch:` — architectural changes
- `chore:` — index/tracking maintenance
- `feat:` — new capability
- `fix:` — defect remediation
- `hardening:` — security/stability hardening

**git mv is the ONLY permitted relocation tool.** Never copy-and-delete tracked files.

---

## SECTION 6 — INTELLIGENCE ZONE LAW

The `/INTELLIGENCE/` zone is the institutional brain of the ecosystem.

Permitted contents:
- Government procurement intelligence (federal, state, NorCal)
- Competitive intelligence (competitor matrices, market data)
- Commercial property intelligence
- Compliance vaults (Cal/OSHA, prevailing wage, SOPs)
- Finance intelligence (SBA, DSCR, lender matrices)
- Real estate intelligence (OZ data, acquisition scoring)
- AI reasoning workflows (bid analysis, contract summarization)
- Sovereign Knowledge Vault (MASTER_INDEX, SYSTEM_MAP, DEPENDENCY_GRAPH)

**Rule:** No executable application code enters INTELLIGENCE/.
**Rule:** No database files enter INTELLIGENCE/.
**Rule:** All intelligence assets are read-only reference material.

---

## SECTION 7 — AUTOMATION ZONE LAW

The `/AUTOMATION/` zone contains only deterministic execution engines.

Permitted contents:
- Workflow orchestrators (`ooda_orchestrator.py`, etc.)
- OCR and document ingestion pipelines
- AI agent schedulers and task runners
- SAM.gov and procurement scraping scripts
- GitHub Actions and CI/CD helpers
- Notification and sync services
- Background processing daemons

**Rule:** No UI code enters AUTOMATION/.
**Rule:** No client data enters AUTOMATION/.
**Rule:** All automation must be idempotent and logged.

---

## SECTION 8 — ARCHIVE ZONE LAW

The `/ARCHIVE/` zone is immutable historical storage.

Permitted contents:
- Versioned system snapshots (`Prime_Pathwy_BACKUP_APRIL28/`)
- Legacy application versions (`archived_old_versions/`)
- Retired deployments and sealed packages
- Historical audit records
- Export artifacts (PDFs, ZIPs generated by the system)

**Rule:** Nothing in ARCHIVE/ is ever modified after placement.
**Rule:** Nothing in ARCHIVE/ is ever deleted without Lead Architect sign-off.
**Rule:** ARCHIVE/ is append-only.

---

## SECTION 9 — SOVEREIGN COMMIT PROTOCOL

Before any commit is executed, the following gate must pass:

```
PRE-COMMIT GATE:
1. git status — confirm only intended files are staged
2. git diff --cached — read every line of the staged diff
3. No protected assets in the diff
4. No .env, .db, .db-wal, or credential files staged
5. Commit message follows Section 5 prefix law
6. Validation Triad (Section 3) has been satisfied
```

Post-commit verification (mandatory — not optional):
```
git log -1 --format="%H  %s"   ← confirm hash and message
git status                       ← confirm clean working tree
```

A commit is not complete until post-commit verification output is returned.

---

## SECTION 10 — OPERATIONAL CONSTANTS & SYSTEM REGISTRY

```
ACTIVE SYSTEMS:
  FastAPI Core      → CORE_SYSTEMS/PrimePathwyOS/      (port 8005)
  Betting Engine    → CORE_SYSTEMS/ISE_Betting_Console/ (port 3132)
  Health Console    → CORE_SYSTEMS/ISE_Health_Console/
  Gemini App        → gemini-app/                       (Node.js, ES6)

ACTIVE BRANCH:      mvp-hardening
PRODUCTION BRANCH:  main
WORKTREE PATH:      .claude/worktrees/dreamy-kare-3ed512/

INTELLIGENCE VAULT: INTELLIGENCE/ (37 files — sealed 2026-05-18)
ARCHIVE:            ARCHIVE/ (initialized 2026-05-18)

NIGHTLY AUDIT:      .github/workflows/sovereign_audit.yml
DSCR ANCHOR:        7.42x
FLEET VOUCHER:      HVIP Class 4-5 · $130K · Carl Moyer 415.749.4994

SBDC PITCH DATE:    April 24, 2026
```

**This is a permanent institutional governance lock.**
**Protect the fortress.**

---
*Sealed by Arthur F. Appling Sr., Lead Technical Architect — 2026-05-18*