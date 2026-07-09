# SOVEREIGN SYSTEM INSTALLATION SOP
### Prime Pathwy · AA Capital INC · Institutional-Grade Infrastructure Deployment

| Field | Value |
|---|---|
| Document Class | Standard Operating Procedure — Client-Facing Delivery |
| Framework | WAT (Workflows / Agents / Tools) |
| Engagement Tier | High-Ticket Sovereign System Installation ($5,000+) |
| Aesthetic Standard | Matte Black & Gold — all client deliverables |
| Owner | Arthur F. Appling Sr., Lead Architect |
| Version | 1.0 |
| Doctrine | Zero-Hype · Zero-Inference · Every step = Exact Command + Pass Criteria + Error Map |

---

## 0. OPERATING PRINCIPLES

1. **Concrete and Steel only.** Every deliverable is a real, running asset the client can click, run, and verify. No vaporware, no "coming soon."
2. **Zero-Inference.** Never assume client system state. Every phase opens with a Ground Truth Audit. Two consecutive failures = STOP, re-audit, do not improvise.
3. **Validation Contract.** Every installation step ships with: **Exact Command → Pass Criteria → Error Map.** A step without all three is not a step.
4. **WAT discipline.** All artifacts land in exactly one of three directories. No orphan files.

---

## 1. THE WAT FRAMEWORK (Client Infrastructure Skeleton)

Every Sovereign System install creates this exact tree at the client's system root:

```
<CLIENT_ROOT>/
├── workflows/     # Repeatable processes (.md SOPs — human + AI readable)
├── agents/        # AI agent prompt definitions (.md role files)
├── tools/         # Executable scripts (Node.js / PowerShell / Python)
├── CLAUDE.md      # AI operating constitution for the client's system
└── README.md      # Sovereign System manifest (Matte Black & Gold branded)
```

**Rule:** If a file is a process, it's a Workflow. If it's an AI persona/prompt, it's an Agent. If it executes, it's a Tool. No exceptions.

---

## 2. PHASE 0 — PRE-INSTALLATION GROUND TRUTH AUDIT

> Performed on a discovery call, screen-share, before any money milestone unlocks Phase 1.

### Step 0.1 — Verify Operating System & Shell
- **Exact Command:** `[System.Environment]::OSVersion.VersionString; $PSVersionTable.PSVersion` (PowerShell) or `uname -a` (macOS/Linux)
- **Pass Criteria:** Windows 10/11, macOS 13+, or Ubuntu 22.04+ reported.
- **Error Map:**
  - Unsupported OS → escalate to Architect; quote OS upgrade as change order.
  - Command not recognized → client is in CMD, not PowerShell. Have them type `powershell` first.

### Step 0.2 — Verify Node.js Runtime
- **Exact Command:** `node --version`
- **Pass Criteria:** Output is `v20.x.x` or higher.
- **Error Map:**
  - `'node' is not recognized` → proceed to Step 1.2 (Node install) — this is expected for new clients.
  - Version < 20 → uninstall old Node, then Step 1.2.

### Step 0.3 — Verify Git
- **Exact Command:** `git --version`
- **Pass Criteria:** `git version 2.40+`
- **Error Map:** Not found → Step 1.3.

### Step 0.4 — Inventory Existing Chaos
- **Exact Command:** Screen-share walkthrough; client opens their current "system" (spreadsheets, sticky notes, inbox).
- **Pass Criteria:** Architect documents every recurring manual process in the **Chaos Ledger** (`workflows/chaos_ledger_<client>.md`). Minimum 5 entries.
- **Error Map:** Client can't articulate processes → schedule a 30-min shadow session; do not proceed on guesswork.

**PHASE 0 GATE:** Chaos Ledger signed off by client in writing (email reply = sufficient). Then invoice milestone #1.

---

## 3. PHASE 1 — FOUNDATION INSTALL (Click-by-Click)

### Step 1.1 — Create the Sovereign Root
- **Exact Command (Windows):**
  ```powershell
  New-Item -ItemType Directory -Force "C:\<ClientName>Ecosystem"
  New-Item -ItemType Directory -Force "C:\<ClientName>Ecosystem\workflows","C:\<ClientName>Ecosystem\agents","C:\<ClientName>Ecosystem\tools"
  ```
- **Pass Criteria:** `ls C:\<ClientName>Ecosystem` shows exactly: `workflows`, `agents`, `tools`.
- **Error Map:** Access denied → run PowerShell as Administrator (Right-click → "Run as administrator").

### Step 1.2 — Install Node.js (if Phase 0 flagged)
1. **Click:** Browser → `https://nodejs.org` → click the **LTS** button (left, green).
2. **Click:** Run downloaded `.msi` → Next → accept license → Next → default path → Next → **check "Automatically install necessary tools"** → Install.
3. **Click:** Close installer → open a **new** PowerShell window.
- **Exact Command:** `node --version; npm --version`
- **Pass Criteria:** Both print version numbers, Node ≥ v20.
- **Error Map:** Still not recognized → reboot once; if it persists, manually add `C:\Program Files\nodejs\` to PATH (System Properties → Environment Variables → Path → New).

### Step 1.3 — Install Git
1. **Click:** Browser → `https://git-scm.com/download/win` → download starts automatically.
2. **Click:** Run installer → Next through all defaults (do NOT change the default editor unless client objects to Vim — if so, select "Use Visual Studio Code").
- **Exact Command:** `git --version`
- **Pass Criteria:** Version string prints.
- **Error Map:** Fails → new terminal window first; then reboot; then manual PATH fix as in 1.2.

### Step 1.4 — Initialize the Repository
- **Exact Command:**
  ```powershell
  cd C:\<ClientName>Ecosystem; git init; git add .; git commit -m "Sovereign System: Foundation laid" --allow-empty
  ```
- **Pass Criteria:** `git log --oneline` shows 1 commit.
- **Error Map:**
  - "Please tell me who you are" → run:
    ```powershell
    git config --global user.name "<Client Name>"; git config --global user.email "<client email>"
    ```
    then re-commit.

### Step 1.5 — Install the AI Constitution (CLAUDE.md)
- **Action:** Architect authors `CLAUDE.md` at client root from the Prime Pathwy constitution template, populated with the client's identity block (legal name, entity, contact) and the Chaos Ledger priorities.
- **Pass Criteria:** File exists; client reads it aloud on call and confirms identity fields are accurate.
- **Error Map:** Identity dispute → correct on the spot; never leave a wrong EIN/entity name in a constitution file.

**PHASE 1 GATE:** Foundation tree + git history + constitution verified live on screen-share. Invoice milestone #2.

---

## 4. PHASE 2 — WAT POPULATION (The Sovereign Build)

For **each** Chaos Ledger entry (top 3 minimum included in base package):

### Step 2.1 — Author the Workflow
- **Action:** Create `workflows/<process_name>.md` with: Purpose → Trigger → Steps (each with Exact Command + Pass Criteria + Error Map) → Owner.
- **Pass Criteria:** A stranger could execute the process from the doc alone. Test: client's least-technical team member runs it once unassisted.
- **Error Map:** Tester stalls at any step → that step is rewritten the same day. The doc is wrong, not the tester.

### Step 2.2 — Define the Agent
- **Action:** Create `agents/<role_name>.md` containing: Role, Inputs, Outputs, Constraints, Escalation rule ("two failures → stop and report").
- **Pass Criteria:** Agent file loaded into the client's AI tool produces correct output on a real sample input, live on call.
- **Error Map:** Wrong output → tighten constraints section; never patch by adding examples of the failure.

### Step 2.3 — Build the Tool
- **Action:** Create executable in `tools/<tool_name>/` (Node.js default). Include a one-line run command in the file header.
- **Exact Command (verify):** `node tools/<tool_name>/index.js`
- **Pass Criteria:** Exit code 0 + expected output on client's machine (not Architect's).
- **Error Map:**
  - Missing module → `npm install` inside the tool directory.
  - Env/secret missing → create `.env` per template; **confirm `.env` is in `.gitignore` before commit.**

### Step 2.4 — Commit the Triad
- **Exact Command:** `git add .; git commit -m "WAT: <process_name> installed"`
- **Pass Criteria:** One commit per completed W+A+T triad.

**PHASE 2 GATE:** All contracted triads demoed end-to-end by the **client's own hands** on a recorded call. Invoice milestone #3.

---

## 5. PHASE 3 — HARDENING & HANDOVER

### Step 3.1 — Secrets Sweep
- **Exact Command:** `git log -p | Select-String -Pattern "API_KEY|PASSWORD|SECRET|TOKEN" | Select-Object -First 10`
- **Pass Criteria:** Zero hits in history.
- **Error Map:** Hit found → rotate the exposed credential immediately, then purge history. Rotation is mandatory; purging alone is insufficient.

### Step 3.2 — Remote Backup
- **Exact Command:** `git remote add origin <private GitHub repo URL>; git push -u origin main`
- **Pass Criteria:** Repo visible on GitHub, marked **Private**, client account is owner.
- **Error Map:** Auth failure → client installs GitHub CLI (`gh auth login`) and authenticates in browser.

### Step 3.3 — Sovereignty Test (Final Acceptance)
- **Action:** Architect goes silent. Client executes one full workflow, runs one tool, and invokes one agent — alone, screen recorded.
- **Pass Criteria:** All three complete without Architect input.
- **Error Map:** Any failure → fix + 48-hour re-test. The system is not sovereign until the client doesn't need you.

### Step 3.4 — Handover Package
Deliver (Matte Black & Gold branding on all client-facing docs):
1. This SOP, customized.
2. Chaos Ledger → marked **RESOLVED** per line.
3. 30-day support terms + escalation contact.
4. Signed acceptance form.

**PHASE 3 GATE:** Acceptance signed. Final invoice. Engagement sealed.

---

## 6. ESCALATION DOCTRINE

| Condition | Action |
|---|---|
| Any step fails twice consecutively | STOP. Full Ground Truth Audit of the affected layer. No third blind attempt. |
| Client requests scope outside Chaos Ledger | Written change order. Never free-build mid-install. |
| Credential or PII exposure | Rotate first, notify client same day, document in engagement log. |
| Client machine fails minimum specs mid-engagement | Pause clock; hardware remediation is a separate quote. |

---

## 7. APPENDIX — INSTALL CHECKLIST (Print Version)

- [ ] Phase 0: Ground Truth Audit complete, Chaos Ledger signed
- [ ] 1.1 Sovereign root + WAT directories created
- [ ] 1.2 Node.js ≥ v20 verified
- [ ] 1.3 Git verified
- [ ] 1.4 Repo initialized, first commit
- [ ] 1.5 CLAUDE.md constitution installed & client-verified
- [ ] 2.x One W+A+T triad per contracted process, each demoed by client
- [ ] 3.1 Secrets sweep clean
- [ ] 3.2 Private remote backup live
- [ ] 3.3 Sovereignty Test passed unassisted
- [ ] 3.4 Handover package delivered, acceptance signed

---

*Prime Pathwy — Sovereign Systems. Concrete and Steel.*
