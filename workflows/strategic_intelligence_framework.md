# STRATEGIC INTELLIGENCE FRAMEWORK
### Prime Pathwy · AA Capital INC · Local-First Intelligence Architecture

| Field | Value |
|---|---|
| Document Class | Standard Operating Procedure — Permanent Architecture Document |
| Framework | WAT (Workflows / Agents / Tools) |
| System of Record | `data/prime_pathwy_vault.db` (local SQLite) |
| Owner | Arthur F. Appling Sr., Lead Architect |
| Version | 1.0 |
| Effective Date | 2026-06-11 |
| Doctrine | Zero-Hype · Zero-Inference · Every step = Exact Command + Pass Criteria + Error Map |

---

## 0. PURPOSE & SCOPE

This SOP defines how Prime Pathwy captures, stores, and protects business intelligence — leads, operational tasks, and platform metrics — using the local SQLite vault. It is the permanent reference for:

1. **Provisioning** the vault (`tools/initialize_vault.py`)
2. **Ingesting** intelligence (`tools/ingest_data.py`)
3. **Protecting** the database file (Appendix A)
4. **Rationing** AI token spend when operating against the vault (Appendix B)

**Scope boundary:** This document governs the *local* vault only. Cloud sync, client-facing deliverables, and the document vault (`vault/`) are governed by their own SOPs.

---

## 1. OPERATING PRINCIPLES

1. **Concrete and Steel only.** Every record in the vault maps to a real company, a real task, or a real measured number. No placeholder rows, no speculative pipeline inflation.
2. **Zero-Inference.** Never assume vault state. Query it. Two consecutive command failures = STOP and run the Ground Truth Audit (§2).
3. **Local-first sovereignty.** The vault lives on the Architect's machine. It is never committed to git, never uploaded to a third-party service, never embedded in a client deliverable.
4. **Single writer discipline.** All writes flow through `tools/ingest_data.py`. No ad-hoc `sqlite3` write sessions against production data.
5. **Validation Contract.** Every operational step below ships with **Exact Command → Pass Criteria → Error Map.**

---

## 2. GROUND TRUTH AUDIT (Run Before Any Vault Session)

### Step 2.1 — Verify the vault exists and is schema-complete
- **Exact Command:**
  ```
  python tools/initialize_vault.py
  ```
- **Pass Criteria:** Exit code 0 and the banner `[PASS] PRIME PATHWY VAULT INITIALIZED` listing all three tables. The script is idempotent — running it against a healthy vault changes nothing.
- **Error Map:**
  - `[FAIL] Vault validation failed — missing tables` → schema damage; archive the file per Appendix A.4, then re-run.
  - `[FAIL] SQLite error` → file locked or `data/` read-only; close other processes holding the DB, check folder permissions.
  - `'python' is not recognized` → Python not on PATH; install Python 3.10+ or invoke via `py`.

### Step 2.2 — Verify row counts before trusting any report
- **Exact Command:**
  ```
  python -c "import sqlite3; c=sqlite3.connect('data/prime_pathwy_vault.db'); print({t: c.execute(f'SELECT COUNT(*) FROM {t}').fetchone()[0] for t in ('internal_leads','operational_tasks','platform_metrics')}); c.close()"
  ```
- **Pass Criteria:** A dictionary of three non-negative integers prints. Numbers match operator expectation.
- **Error Map:**
  - `no such table` → vault was deleted or replaced; return to Step 2.1.
  - Counts wildly off expectation → STOP. Do not write. Investigate with read-only queries first.

---

## 3. CORE DATA MODEL (System of Record)

| Table | Purpose | Key Columns |
|---|---|---|
| `internal_leads` | Pipeline: every prospective client | `id`, `company_name`, `industry`, `contact_phone`, `status` (`new/contacted/qualified/won/lost`), `estimated_value` |
| `operational_tasks` | Execution: work items, optionally bound to a lead | `id`, `client_id` (FK → `internal_leads.id`), `task_description`, `status` (`pending/in_progress/done/blocked`), `timestamp` |
| `platform_metrics` | Telemetry: one row per named metric, upserted in place | `id`, `metric_name` (UNIQUE), `metric_value`, `last_updated` |

**Integrity guarantees (enforced by the tooling, not by convention):**
- Foreign keys are ON (`PRAGMA foreign_keys = ON`) — a task cannot reference a nonexistent lead.
- `metric_name` is UNIQUE — metrics never duplicate; they update in place with a fresh `last_updated`.
- All timestamps are SQLite `datetime('now')` — UTC, machine-generated, never hand-typed.

---

## 4. INGESTION PROTOCOL

All three flows below are parameter-bound (SQL injection inert), transactional (commit on success, automatic rollback on failure), and validated by argparse before any database contact.

### Step 4.1 — Register a new lead
- **Exact Command:**
  ```
  python tools/ingest_data.py lead --company "Acme Corp" --industry logistics --phone 707-555-0100 --status new --value 25000
  ```
  (`--industry`, `--phone`, `--status`, `--value` optional; defaults: `new`, `0.0`)
- **Pass Criteria:** Exit 0 and `[PASS] LEAD INSERTED — id=<n> company='...' status=... value=$...`
- **Error Map:**
  - Exit 2 + usage text → argparse rejected an argument (blank company, invalid status, non-numeric value). Fix the flag it names.
  - `[FAIL] Vault not found` → run §2.1 first.

### Step 4.2 — Append an operational task
- **Exact Command:**
  ```
  python tools/ingest_data.py task --description "Send proposal" --client-id 1 --status pending
  ```
  (`--client-id` optional — omit for unassigned tasks)
- **Pass Criteria:** Exit 0 and `[PASS] TASK APPENDED — id=<n> client_id=<n> status=...`
- **Error Map:**
  - `[FAIL] Integrity violation ... FOREIGN KEY constraint failed` → the `--client-id` does not exist in `internal_leads`. Look up the real id first; the transaction was rolled back, nothing was written.
  - Exit 2 → blank description or non-positive client id; argparse names the offender.

### Step 4.3 — Upsert a platform metric
- **Exact Command:**
  ```
  python tools/ingest_data.py metric --name dscr --value 7.42
  ```
- **Pass Criteria:** Exit 0 and `[PASS] METRIC UPSERTED — id=<n> name='...' value=... last_updated=<UTC>`. Re-running with a new value keeps the same `id` and refreshes `last_updated` — that is correct upsert behavior, not a bug.
- **Error Map:**
  - Exit 2 → missing `--name` or `--value`; both are required.
  - `[FAIL] SQLite error` → locked DB; close competing processes and retry once. Second failure = Ground Truth Audit (§2).

---

## 5. READ PROTOCOL (Reporting Without Risk)

Reads are unrestricted but must be explicitly read-only when scripted.

- **Exact Command (safe ad-hoc read):**
  ```
  python -c "import sqlite3; c=sqlite3.connect('file:data/prime_pathwy_vault.db?mode=ro', uri=True); [print(r) for r in c.execute('SELECT id, company_name, status, estimated_value FROM internal_leads ORDER BY estimated_value DESC')]; c.close()"
  ```
- **Pass Criteria:** Rows print; no write occurred (`mode=ro` makes writes impossible at the connection level).
- **Error Map:**
  - `unable to open database file` with `mode=ro` → vault missing; §2.1.
  - Need a recurring report → promote the query into a named tool under `tools/`, never paste raw SQL into chat sessions repeatedly.

---

## APPENDIX A — SQLITE PROTECTION RULES

**A.1 — Source-control firewall.** `data/` is permanently listed in `.gitignore` (rule: `data/`, committed `54f7c257`). The binary vault must never enter git history.
- **Exact Command (verify the firewall holds):** `git check-ignore -v data/prime_pathwy_vault.db`
- **Pass Criteria:** Output cites the `.gitignore` line matching `data/`.
- **Error Map:** No output (exit 1) → the rule was removed. STOP. Restore `data/` to `.gitignore` before any `git add`. If the DB was already committed, treat it as an incident: remove it from the index (`git rm --cached`) and rewrite history before any push.

**A.2 — Single-writer rule.** Only `tools/ingest_data.py` writes to production. Ad-hoc write sessions (`sqlite3` shell, one-off scripts) are prohibited against the live vault — they bypass validation, FK enforcement, and the transaction wrapper.

**A.3 — Read-only by default.** Any exploratory connection uses `file:...?mode=ro` URI form (§5). A connection that *can't* write *won't* write.

**A.4 — Backup before destructive maintenance.** Before any schema migration, bulk delete, or repair:
- **Exact Command:** `Copy-Item data/prime_pathwy_vault.db ("data/prime_pathwy_vault.{0}.bak" -f (Get-Date -Format yyyyMMdd_HHmmss))`
- **Pass Criteria:** A timestamped `.bak` file exists in `data/` (also covered by the `.gitignore` firewall).
- **Error Map:** Copy fails → DB locked; close writers first. Never run destructive SQL without a same-day `.bak`.

**A.5 — No cloud egress.** The vault contains contact phone numbers and deal values. It is never uploaded, pasted into AI chat sessions wholesale, emailed, or synced to OneDrive/Drive. Aggregates (counts, sums) may be shared; raw rows require deliberate need.

**A.6 — Two-failure stop.** Any two consecutive `[FAIL]` results against the vault trigger the Zero-Inference rule: stop all writes and run the full Ground Truth Audit (§2) before proceeding.

---

## APPENDIX B — LOCAL TOKEN-RATIONING SAFEGUARDS

AI sessions (Claude Code, Gemini) operating against this framework must conserve context-window and API token spend. Tokens are a metered input; spend them like capital.

**B.1 — Query the vault, don't paste the vault.** Never dump full tables into an AI conversation. Pull the minimum rows needed with a targeted `SELECT ... WHERE ... LIMIT`. A 10-row answer must not cost a 10,000-row paste.

**B.2 — Aggregates first.** Start every analysis request with `COUNT`, `SUM`, `GROUP BY` summaries. Drill into raw rows only after the aggregate proves the drill-down is needed.

**B.3 — One session, one objective.** Scope each AI session to a single deliverable. Sprawling multi-topic sessions force re-reading of stale context on every turn — the most expensive token pattern there is.

**B.4 — Reuse the tools, don't regenerate them.** `initialize_vault.py` and `ingest_data.py` are finished assets. Asking an AI to re-derive or re-explain them in-session burns tokens on solved problems. Reference them by path; read them only when changing them.

**B.5 — Batch ingestion offline.** Bulk data entry (10+ rows) goes through a loop in PowerShell or a CSV-driven script — not row-by-row through an AI conversation. AI time is for judgment calls, not data entry.

**B.6 — Cheap models for cheap work.** Formatting, file moves, and boilerplate go to the fastest/cheapest available model tier. Reserve top-tier model sessions for architecture, debugging, and analysis that actually needs the horsepower.

**B.7 — Kill failed loops early.** If an AI agent fails the same operation twice, stop the session (this is the Zero-Inference two-failure rule applied to spend). Re-prompting a confused agent in a long context is the fastest way to burn budget with zero output.

---

## REVISION LOG

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-06-11 | Initial issue. Codifies deployed vault architecture (`ef7f0dda`), git firewall (`54f7c257`), protection rules, and token-rationing doctrine. |
