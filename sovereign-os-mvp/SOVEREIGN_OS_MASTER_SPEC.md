# Prime Pathwy Sovereign OS — Master Specification
**Version:** 1.0.0 | **Author:** Arthur F. Appling Sr., Lead Technical Architect | **Classification:** Internal — Prime Pathwy

---

## PART I: Repository Architecture

### 1.1 Design Philosophy

The Prime Pathwy Sovereign OS is built on a single governing principle: **Systems over Labor.** Every architectural decision is made to maximize audit-readiness, chargeback defense, and long-term maintainability over short-term convenience. The system is local-first, single-user, and designed to be operated from a terminal with zero cloud dependencies.

### 1.2 Complete Repository Tree

```text
prime_pathwy_os/
├── .env.example                    # Environment variable template
├── .gitignore                      # Excludes .env, *.db, vault/
├── alembic.ini                     # Alembic migration config
├── docker-compose.yml              # Docker isolation (localhost-only)
├── Dockerfile                      # Non-root container build
├── Makefile                        # Developer shortcuts
├── pyproject.toml                  # Poetry dependency manifest
├── README.md                       # Operational quick-start
│
├── scripts/
│   ├── backup_db.sh                # SQLite backup + SHA-256 manifest
│   └── run_dev.sh                  # Uvicorn startup (127.0.0.1 only)
│
├── src/
│   ├── main.py                     # FastAPI app factory + router registration
│   ├── config/
│   │   └── settings.py             # Pydantic BaseSettings from .env
│   ├── core/
│   │   ├── exceptions.py           # Global exception handlers
│   │   ├── logging.py              # Structured JSON logging
│   │   └── security.py             # Localhost check + API key validation
│   ├── db/
│   │   ├── base.py                 # SQLAlchemy DeclarativeBase
│   │   ├── session.py              # Async engine + WAL PRAGMA setup
│   │   └── migrations/             # Alembic revision scripts
│   ├── models/
│   │   ├── audit.py                # Append-only audit log table
│   │   ├── evidence.py             # File metadata + hash tracking
│   │   ├── ocr_extraction.py       # Tesseract output storage
│   │   └── work_order.py           # Case/work order management
│   ├── schemas/
│   │   └── evidence.py             # Pydantic I/O schemas
│   ├── api/
│   │   ├── dependencies.py         # get_db, verify_local_user
│   │   └── routes/
│   │       └── evidence.py         # Upload + retrieval endpoints
│   ├── services/
│   │   ├── audit_service.py        # Cryptographic log chaining
│   │   ├── evidence_service.py     # Upload orchestration
│   │   ├── ocr_service.py          # Tesseract subprocess wrapper
│   │   └── pdf_service.py          # ReportLab evidence export
│   ├── workers/
│   │   └── ocr_queue.py            # Async background OCR processor
│   └── utils/
│       ├── file_vault.py           # MIME validation + secure storage
│       └── hash_utils.py           # SHA-256 generation
│
├── workflows/                      # WAT: Architecture documents (.md)
│   ├── repo_architecture.md
│   ├── sqlite_schema.md
│   └── security_hardening.md
├── agents/                         # WAT: Agent prompts
├── tools/                          # WAT: Scripts and Python tools
├── temporary/                      # WAT: Transient data
└── tests/
    ├── conftest.py
    └── ...
```

### 1.3 File Classification

| Classification | Files |
| :--- | :--- |
| **MVP Required** | All files in `src/`, `scripts/`, `pyproject.toml`, `.env.example`, `Makefile`, `alembic.ini` |
| **Future-Scale** | `src/db/redis.py`, `src/workers/celery_app.py`, `src/api/routes/webhooks.py` |
| **Optional** | `docker-compose.yml`, `Dockerfile` (useful but not blocking for local dev) |
| **Unnecessary Enterprise Abstractions** | CQRS, Event Sourcing, API Gateway, Service Mesh |

### 1.4 File-by-File Specification

**`src/main.py`** — The FastAPI application factory. Registers all routers and attaches global middleware (localhost enforcement, API key validation). Lifecycle role: system entry point. Dependencies: `src.api.routes.*`, `src.core.security`.

**`src/config/settings.py`** — Loads all environment variables via Pydantic `BaseSettings`. Any module that needs configuration imports `settings` from here. This is the single source of truth for runtime configuration. Dependencies: `pydantic-settings`, `.env` file.

**`src/core/security.py`** — Two FastAPI dependency functions: `verify_local_access` (rejects non-localhost IPs) and `verify_api_key` (validates the `X-API-Key` header). Applied globally in `main.py`. Dependencies: FastAPI, `src.config.settings`.

**`src/core/logging.py`** — Configures a `JSONFormatter` that emits structured log lines with `timestamp`, `level`, `module`, and `message`. Every log line is machine-parseable for audit review. Dependencies: Python `logging`.

**`src/db/session.py`** — Creates the SQLAlchemy async engine. Attaches a `connect` event listener that fires `PRAGMA journal_mode=WAL`, `PRAGMA synchronous=NORMAL`, `PRAGMA foreign_keys=ON`, and `PRAGMA busy_timeout=5000` on every new connection. This is the WAL activation point. Dependencies: `sqlalchemy`, `aiosqlite`.

**`src/models/audit.py`** — The `AuditLog` table. Uses an integer primary key for strict chronological ordering. Contains `previous_hash` and `current_hash` columns that form a cryptographic chain. Any tampering with a row breaks the chain and is detectable. Append-only enforcement is provided by SQLite triggers (defined in migration scripts). Dependencies: `src.db.base`.

**`src/models/evidence.py`** — Tracks every uploaded file. The `sha256_hash` column is unique-indexed, preventing duplicate uploads. The `vault_path` stores the UUID-based secure filename, not the original. Dependencies: `src.db.base`.

**`src/services/audit_service.py`** — The `append_audit_log` function queries the last log entry, extracts its `current_hash`, and uses it as `previous_hash` for the new entry. The new `current_hash` is computed as `SHA-256(action + actor + target + details + previous_hash)`. This makes the log chain tamper-evident. Dependencies: `src.models.audit`, `hashlib`.

**`src/utils/file_vault.py`** — The hardened upload handler. Reads the first 2048 bytes of every upload and validates the MIME type via `python-magic`. Rejects anything not in the allowlist (`application/pdf`, `image/png`, `image/jpeg`). Generates a `uuid4().hex` filename. Writes the file with `chmod 0600`. Dependencies: `python-magic`, `os`, `uuid`.

**`src/workers/ocr_queue.py`** — Wraps OCR processing as a FastAPI `BackgroundTask`. The upload endpoint returns immediately; OCR runs asynchronously. On completion or failure, an audit log entry is appended. Dependencies: `src.services.ocr_service`, `src.services.audit_service`.

**`scripts/backup_db.sh`** — Uses SQLite's `.backup` command (safe for WAL mode) to create a timestamped copy. Computes the SHA-256 of the backup and appends `timestamp | path | hash` to `backups/backups_manifest.txt`. This manifest is the integrity baseline for disaster recovery.

### 1.5 Clean Architecture Rules

The system enforces a strict three-layer dependency hierarchy. The **API Layer** handles only HTTP parsing, validation, and response formatting. It delegates all decisions to the **Service Layer**, which contains all business logic and orchestration. The Service Layer reads and writes through the **Data Layer** (SQLAlchemy models and the file vault utility). No layer may import from a layer above it. This rule is absolute.

**Import Flow:** `src.api.routes` → `src.services` → `src.models` / `src.utils`. The `src.config.settings` and `src.core.*` modules are horizontal utilities importable by any layer.

**Anti-Pattern Warnings:**

| Anti-Pattern | Consequence | Correct Approach |
| :--- | :--- | :--- |
| Direct DB calls in route handlers | Untestable, violates SRP | Always delegate to a service function |
| In-memory state between requests | Lost on restart, not audit-safe | All state lives in SQLite |
| Trusting file extensions | Bypass of MIME validation | Always use `python-magic` on file bytes |
| Hardcoded secrets | Credential exposure in git history | Always use `.env` + Pydantic settings |

**Future Migration-Safe Abstraction Points:** The `src.db.session` module is the sole location for engine creation, making a future swap to PostgreSQL (change one `DATABASE_URL` string) trivial. The `src.utils.file_vault` module can be refactored to an interface-driven storage class, allowing S3 or other backends to be substituted without touching any service or route code.

---

## PART II: SQLite Schema Architecture

### 2.1 Schema Overview

The database schema is designed around four principles: immutability of the audit chain, referential integrity via foreign keys, query efficiency via targeted indexing, and future portability to PostgreSQL. All tables use UUID string primary keys except `audit_logs`, which uses an auto-incrementing integer to guarantee strict chronological ordering.

### 2.2 Complete Schema Definition

```sql
-- Enable WAL and safety PRAGMAs (executed on every connection)
PRAGMA journal_mode=WAL;
PRAGMA synchronous=NORMAL;
PRAGMA foreign_keys=ON;
PRAGMA busy_timeout=5000;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY,
    username    TEXT NOT NULL UNIQUE,
    created_at  DATETIME DEFAULT (datetime('now', 'utc'))
);

-- Table: work_orders
CREATE TABLE IF NOT EXISTS work_orders (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL REFERENCES users(id),
    title       TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'OPEN'
                    CHECK(status IN ('OPEN', 'IN_PROGRESS', 'CLOSED')),
    created_at  DATETIME DEFAULT (datetime('now', 'utc')),
    updated_at  DATETIME DEFAULT (datetime('now', 'utc'))
);
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(status);

-- Table: evidence
CREATE TABLE IF NOT EXISTS evidence (
    id                  TEXT PRIMARY KEY,
    work_order_id       TEXT REFERENCES work_orders(id),
    original_filename   TEXT NOT NULL,
    vault_path          TEXT NOT NULL UNIQUE,
    mime_type           TEXT NOT NULL,
    file_size_bytes     INTEGER NOT NULL,
    sha256_hash         TEXT NOT NULL UNIQUE,
    ocr_status          TEXT NOT NULL DEFAULT 'PENDING'
                            CHECK(ocr_status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
    created_at          DATETIME DEFAULT (datetime('now', 'utc'))
);
CREATE INDEX IF NOT EXISTS idx_evidence_hash ON evidence(sha256_hash);
CREATE INDEX IF NOT EXISTS idx_evidence_ocr_status ON evidence(ocr_status);

-- Table: ocr_extractions
CREATE TABLE IF NOT EXISTS ocr_extractions (
    id                  TEXT PRIMARY KEY,
    evidence_id         TEXT NOT NULL UNIQUE REFERENCES evidence(id),
    extracted_text      TEXT,
    confidence_score    REAL,
    processed_at        DATETIME DEFAULT (datetime('now', 'utc'))
);

-- Table: audit_logs (APPEND-ONLY)
CREATE TABLE IF NOT EXISTS audit_logs (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp           DATETIME NOT NULL DEFAULT (datetime('now', 'utc')),
    action              TEXT NOT NULL,
    actor_id            TEXT REFERENCES users(id),
    target_resource_id  TEXT,
    details_json        TEXT,
    previous_hash       TEXT,
    current_hash        TEXT NOT NULL
);

-- Append-Only Enforcement Triggers
CREATE TRIGGER IF NOT EXISTS trg_prevent_audit_update
BEFORE UPDATE ON audit_logs
BEGIN
    SELECT RAISE(ABORT, 'AUDIT VIOLATION: Updates to audit_logs are forbidden');
END;

CREATE TRIGGER IF NOT EXISTS trg_prevent_audit_delete
BEFORE DELETE ON audit_logs
BEGIN
    SELECT RAISE(ABORT, 'AUDIT VIOLATION: Deletes from audit_logs are forbidden');
END;
```

### 2.3 Table Analysis

| Table | Purpose | Key Relationships | Primary Query Pattern |
| :--- | :--- | :--- | :--- |
| `users` | Single local user context | 1:N with `work_orders`, `audit_logs` | Lookup on startup |
| `work_orders` | Case/project management | 1:N with `evidence` | Filter by `status`, paginate by `created_at` |
| `evidence` | File metadata and vault references | 1:1 with `ocr_extractions` | Lookup by `sha256_hash` (dedup), filter by `ocr_status` |
| `ocr_extractions` | Tesseract output storage | 1:1 with `evidence` | Full-text search via `LIKE` or FTS5 |
| `audit_logs` | Immutable event chain | References `users` | Sequential read for export and chain verification |

### 2.4 WAL Tuning Recommendations

SQLite in WAL mode allows concurrent readers while a writer is active, which is ideal for the OCR background worker writing results while the API serves read requests. `synchronous=NORMAL` provides an excellent balance between durability and performance for a local single-user system — data is safe against OS crashes but not against power loss (acceptable for a laptop/workstation). `busy_timeout=5000` prevents the OCR worker from immediately failing with `SQLITE_BUSY` when the API is mid-transaction.

### 2.5 Dangerous Schema Patterns to Avoid

Storing file content as BLOBs in the database is the most dangerous anti-pattern for this system. It bloats the database file, makes backups slow, and prevents per-file permission hardening. All binary content belongs in the vault filesystem. Soft-delete patterns (an `is_deleted` flag) on the `evidence` table are also inadvisable, as they create ambiguity in the audit chain. Deletions, if ever permitted, must be recorded as explicit audit events, not silent row mutations.

### 2.6 Future PostgreSQL Compatibility

The schema is designed for clean migration. UUID string primary keys are compatible with Postgres `UUID` type. The `details_json` TEXT column maps directly to Postgres `JSONB`. The primary incompatibility risk is SQLite's `CHECK` constraints, which are syntactically identical in Postgres but enforced differently — this is a safe migration. The append-only triggers must be rewritten as Postgres `RULE` or `BEFORE` trigger functions, which is a direct translation.

---

## PART III: Security Hardening Implementation Plan

### 3.1 Attack Surface Analysis

The local MVP has a smaller attack surface than a cloud deployment, but the risks are qualitatively different. The primary threats are not remote attackers but rather malicious files processed by the system, local privilege escalation if the process runs as root, and audit log tampering by a compromised local session.

| Threat | Risk Level | Primary Mitigation |
| :--- | :--- | :--- |
| Malicious file upload (disguised executable) | **Critical** | MIME validation via `python-magic` on raw bytes |
| Path traversal via filename manipulation | **Critical** | UUID-based filename generation; original name discarded |
| OCR exploit via crafted image | **High** | Subprocess timeout; `shell=False`; Docker isolation |
| Audit log tampering | **High** | SQLite triggers + SHA-256 chain verification |
| Ransomware / data loss | **High** | Immutable daily backups with SHA-256 manifest |
| Local privilege escalation | **Medium** | Run as non-root `pathwy_user`; Docker `USER 1000` |
| CSRF via malicious browser link | **Low** | Static API key required on all requests |

### 3.2 Exact Middleware Requirements

```python
# src/core/security.py

from fastapi import Request, HTTPException, Security
from fastapi.security import APIKeyHeader
from src.config.settings import settings

api_key_header = APIKeyHeader(name="X-API-Key")

async def verify_local_access(request: Request):
    """Reject any request not originating from localhost."""
    if request.client.host not in ("127.0.0.1", "::1"):
        raise HTTPException(status_code=403, detail="Localhost access only.")

async def verify_api_key(api_key: str = Security(api_key_header)):
    """Validate the static API key on every request."""
    if api_key != settings.api_key:
        raise HTTPException(status_code=403, detail="Invalid API Key.")
    return api_key
```

Both dependencies are applied globally in `main.py` via `FastAPI(dependencies=[...])`, ensuring no route can be accessed without passing both checks.

### 3.3 Exact Upload Validation Pipeline

The upload pipeline is a strict sequential gate. A file is rejected at the first failing check and never written to disk.

```
1. SIZE CHECK       → Reject if > 50MB (FastAPI UploadFile limit)
2. MIME VALIDATION  → Read first 2048 bytes; validate via python-magic
                      Allowlist: application/pdf, image/png, image/jpeg
                      Reject on mismatch (e.g., .pdf header but ELF binary)
3. SECURE NAMING    → Generate uuid4().hex + validated extension
                      Discard original filename entirely
4. VAULT WRITE      → Write to /vault/{secure_name}
                      Apply chmod 0600 immediately after write
5. HASH & RECORD    → Compute SHA-256 of full content
                      Insert Evidence record in SQLite
6. AUDIT LOG        → Append FILE_UPLOADED event to audit chain
```

### 3.4 Exact OCR Sandboxing Strategy

```python
# src/services/ocr_service.py

import subprocess

def run_tesseract(image_path: str) -> str:
    result = subprocess.run(
        ["tesseract", image_path, "stdout", "--psm", "6"],
        capture_output=True,
        text=True,
        timeout=30,       # Hard kill after 30 seconds
        shell=False        # NEVER use shell=True with user-controlled input
    )
    return result.stdout.strip()
```

The `shell=False` directive is non-negotiable. Passing `shell=True` with any path derived from user input creates a command injection vulnerability. The 30-second timeout prevents a crafted image from hanging the worker indefinitely.

### 3.5 Exact Backup Verification Process

```bash
# scripts/backup_db.sh
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backups/prime_pathwy_${TIMESTAMP}.db"
mkdir -p backups

# Use SQLite's safe backup API (WAL-aware)
sqlite3 prime_pathwy.db ".backup '$BACKUP_FILE'"

# Record SHA-256 in manifest
HASH=$(sha256sum "$BACKUP_FILE" | awk '{print $1}')
echo "$TIMESTAMP $BACKUP_FILE $HASH" >> backups/backups_manifest.txt
```

To verify integrity, run: `sha256sum -c <(awk '{print $3"  "$2}' backups/backups_manifest.txt)`. Any mismatch indicates tampering or corruption.

### 3.6 Exact Secrets Handling Rules

The `.env` file must be created from `.env.example` and never committed to git (enforced by `.gitignore`). File permissions must be set to `0600` (`chmod 0600 .env`) immediately after creation. The `API_KEY` value must be a randomly generated string of at least 32 characters. For generation: `python3 -c "import secrets; print(secrets.token_hex(32))"`.

### 3.7 Vulnerability Remediation Priority

**Priority 1 — Implement Immediately:** Path traversal protection and MIME validation in `file_vault.py`. These are the only vulnerabilities that can compromise the host operating system.

**Priority 2 — Implement Before First Use:** Localhost middleware binding and static API key enforcement. These are the easiest wins and take under 20 lines of code.

**Priority 3 — Implement Before Any Evidence Is Stored:** Append-only SQLite triggers and SHA-256 audit chain. Once evidence is stored without these protections, the chain cannot be retroactively established.

**Priority 4 — Implement Before Production Use:** Docker isolation with non-root user, read-only container filesystem, and daily backup cron job.

---

## PART IV: Validation Contract

Every deployment of this system must satisfy the following pass criteria before being considered operational.

| Check | Exact Command | Pass Criteria | Error Map |
| :--- | :--- | :--- | :--- |
| Server starts | `make run` | Terminal shows `Uvicorn running on http://127.0.0.1:8000` | Check `pyproject.toml` dependencies are installed |
| Health check | `curl http://127.0.0.1:8000/health -H "X-API-Key: <key>"` | `{"status":"ok","system":"Prime Pathwy OS"}` | Verify `API_KEY` in `.env` matches header value |
| Localhost enforcement | `curl http://0.0.0.0:8000/health` | Connection refused or `403 Forbidden` | Verify `--host 127.0.0.1` in `run_dev.sh` |
| MIME rejection | Upload a `.exe` renamed to `.pdf` | `400 Bad Request: Unsupported file type` | Verify `python-magic` is installed (`pip show python-magic`) |
| Audit chain | Insert two log entries; verify `previous_hash` of entry 2 = `current_hash` of entry 1 | Hashes match | Check `audit_service.py` query logic |
| Backup integrity | Run `backup_db.sh`; verify manifest entry exists | `backups/backups_manifest.txt` contains new line | Verify `sqlite3` CLI is installed |
