# Prime Pathwy Sovereign OS: SQLite Schema Architecture

## Overview
This document details the FULL production-grade SQLite schema architecture for the Prime Pathwy local MVP. It leverages SQLite WAL mode to ensure concurrency and durability, providing an immutable evidence chain, append-only audit logs, and secure file tracking.

## 1. Schema Definition

### Table: `users` (Single User Context)
*   **Purpose:** Represents the sole local user.
*   **Columns:**
    *   `id` (TEXT/UUID, Primary Key)
    *   `username` (TEXT, Unique)
    *   `created_at` (DATETIME, Default UTC NOW)
*   **Relationships:** 1:N with `work_orders`, `audit_logs`.
*   **Query Patterns:** Lookup on startup/auth.

### Table: `work_orders`
*   **Purpose:** Manages discrete units of work or cases.
*   **Columns:**
    *   `id` (TEXT/UUID, Primary Key)
    *   `user_id` (TEXT/UUID, Foreign Key -> `users.id`)
    *   `title` (TEXT, Not Null)
    *   `status` (TEXT, Not Null, e.g., 'OPEN', 'CLOSED')
    *   `created_at` (DATETIME, Default UTC NOW)
    *   `updated_at` (DATETIME, Default UTC NOW)
*   **Relationships:** 1:N with `evidence`.
*   **Query Patterns:** Filter by status, paginate by `created_at`.

### Table: `evidence`
*   **Purpose:** Tracks uploaded files and their vault references.
*   **Columns:**
    *   `id` (TEXT/UUID, Primary Key)
    *   `work_order_id` (TEXT/UUID, Foreign Key -> `work_orders.id`)
    *   `original_filename` (TEXT, Not Null)
    *   `vault_path` (TEXT, Not Null, Unique)
    *   `mime_type` (TEXT, Not Null)
    *   `file_size_bytes` (INTEGER, Not Null)
    *   `sha256_hash` (TEXT, Not Null, Unique)
    *   `ocr_status` (TEXT, Default 'PENDING')
    *   `created_at` (DATETIME, Default UTC NOW)
*   **Indexes:** `idx_evidence_hash` on `sha256_hash`.
*   **Relationships:** 1:1 with `ocr_extractions`.
*   **Query Patterns:** Lookup by hash to prevent duplicates, filter by `ocr_status`.

### Table: `ocr_extractions`
*   **Purpose:** Stores text extracted by Tesseract.
*   **Columns:**
    *   `id` (TEXT/UUID, Primary Key)
    *   `evidence_id` (TEXT/UUID, Foreign Key -> `evidence.id`, Unique)
    *   `extracted_text` (TEXT)
    *   `confidence_score` (REAL)
    *   `processed_at` (DATETIME, Default UTC NOW)
*   **Relationships:** 1:1 with `evidence`.
*   **Query Patterns:** Full-text search (via SQLite FTS5 if enabled, otherwise LIKE).

### Table: `audit_logs` (Append-Only)
*   **Purpose:** Immutable record of all system actions.
*   **Columns:**
    *   `id` (INTEGER, Primary Key Auto-increment) - *Integer preferred here for strict chronological ordering.*
    *   `timestamp` (DATETIME, Default UTC NOW)
    *   `action` (TEXT, Not Null, e.g., 'FILE_UPLOADED', 'OCR_COMPLETED')
    *   `actor_id` (TEXT/UUID, Foreign Key -> `users.id`)
    *   `target_resource_id` (TEXT/UUID, Nullable)
    *   `details_json` (TEXT, JSON payload of changes)
    *   `previous_hash` (TEXT) - *Cryptographic link to previous log entry.*
    *   `current_hash` (TEXT) - *Hash of (timestamp + action + details + previous_hash).*
*   **Constraints:** No UPDATE or DELETE allowed.
*   **Triggers:**
    *   `trg_prevent_audit_update`: `BEFORE UPDATE ON audit_logs BEGIN SELECT RAISE(ABORT, 'Updates not allowed'); END;`
    *   `trg_prevent_audit_delete`: `BEFORE DELETE ON audit_logs BEGIN SELECT RAISE(ABORT, 'Deletes not allowed'); END;`
*   **Query Patterns:** Sequential read for export/verification.

## 2. SQLAlchemy Model Structure

*   Use `uuid.uuid4` for primary keys (except `audit_logs`).
*   Use `sqlalchemy.sql.func.now()` for timestamps.
*   Use `JSON` type for `audit_logs.details_json` (SQLAlchemy handles serialization to SQLite TEXT).

## 3. Database Tuning & Strategy

### WAL Tuning Recommendations
Execute these PRAGMAs on connection:
```sql
PRAGMA journal_mode=WAL;
PRAGMA synchronous=NORMAL;
PRAGMA busy_timeout=5000;
PRAGMA foreign_keys=ON;
```

### Migration Strategy
*   Use Alembic.
*   Always define migrations manually; do not rely solely on `--autogenerate`.
*   Since SQLite has limited `ALTER TABLE` support, Alembic uses batch mode (table recreation) for complex changes.

### Backup-Safe Query Rules
*   Use the SQLite Backup API (`sqlite3.Connection.backup`) or `VACUUM INTO 'backup.db'` to safely copy the database while WAL is active. Do not just `cp file.db`.

### Corruption Recovery Considerations
*   Regularly run `PRAGMA integrity_check;`.
*   Keep the `.db` and `.db-wal` files together during manual file operations.

## 4. Architectural Analysis

### Future PostgreSQL Compatibility Risks
*   SQLite's dynamic typing vs Postgres' strict typing. Ensure SQLAlchemy models define types strictly (e.g., String lengths).
*   SQLite `JSON` functions differ slightly from Postgres `JSONB`. Use SQLAlchemy's abstraction.

### Dangerous Schema Patterns & Anti-Patterns
*   **Storing large files in BLOBs:** *Anti-pattern.* Store in the filesystem vault and keep paths in the DB.
*   **Mutable Audit Logs:** *Dangerous.* Enforced via SQLite triggers above.
*   **Missing Foreign Keys:** SQLite disables FKs by default. Must explicitly enable via PRAGMA.

### Unnecessary Abstractions
*   Complex polymorphic relationships (keep it flat and relational).
*   Soft deletes on audit logs (they should never be deleted anyway).
