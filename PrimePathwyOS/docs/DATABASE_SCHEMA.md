# DATABASE SCHEMA & DATA ENGINEERING: Prime Pathwy Sovereign OS

## 1. Enterprise Database Evolution Roadmap
The system currently utilizes SQLite for local-first, zero-configuration operation. The evolutionary roadmap is structured as follows:
1. **Phase 1 (Current):** SQLite with WAL (Write-Ahead Logging) enabled for high concurrency and robust local data integrity.
2. **Phase 2 (Scale):** Migration to PostgreSQL for multi-tenant SaaS deployment, utilizing row-level security (RLS) for tenant isolation.
3. **Phase 3 (Intelligence):** Integration of pgvector (or a local vector DB like ChromaDB) for semantic search and AI-assisted receipt matching.

## 2. Multi-Tenant Schema Strategy
For future SaaS expansion, the schema will adopt a **Pool/Tenant Model**:
- Every table will include a `tenant_id` column.
- Row-Level Security (RLS) policies in PostgreSQL will strictly enforce that queries only return data where `tenant_id == current_session_tenant`.

## 3. Core Entity-Relationship (ER) Architecture

```text
[CLIENTS] 1 <---> * [WORK_ORDERS]
[WORK_ORDERS] * <---> * [SUBCONTRACTORS] (via work_order_subcontractors)
[WORK_ORDERS] 1 <---> * [RECEIPTS]
[WORK_ORDERS] 1 <---> * [PHOTOS]
[WORK_ORDERS] 1 <---> * [INVOICES]
[ANY_ENTITY] 1 <---> * [AUDIT_LOGS]
```

## 4. Indexing & Query Optimization Strategy
To maintain sub-second response times as the archive grows to millions of records:
- **B-Tree Indexes:** Applied to foreign keys (`work_order_id`, `client_id`) and high-cardinality search fields (`vendor`, `invoice_number`).
- **Full-Text Search (FTS):** SQLite FTS5 virtual tables will index the `ocr_text` column in the `Receipts` table, allowing instantaneous keyword retrieval across the entire historical archive.
- **Archive Partitioning:** Historical data older than 5 years will be logically partitioned or moved to cold-storage tables to keep active query tables lean.

## 5. Audit-Log Immutability & Checksum Validation
The `AuditLogs` table is the cryptographic spine of the system.
- **Schema:** `id`, `event_type`, `entity_type`, `entity_id`, `timestamp`, `user`, `hash`, `details`.
- **Integrity Validation System:** A scheduled background job (e.g., nightly cron) iterates through the `Receipts` and `Photos` tables, re-calculating the SHA-256 hash of the physical files in the Vault, and comparing them against the database `checksum` column and the `AuditLogs` hash. Any discrepancy triggers a severe system alert.
- **Evidence Lineage:** Every transformation (e.g., OCR extraction, PDF generation) creates a new AuditLog entry linked to the parent entity, creating a forensic chain of custody.

## 6. Snapshot Engine & Backup Schema
- **Snapshot Table:** Tracks point-in-time backups (`id`, `snapshot_timestamp`, `archive_size`, `manifest_hash`, `status`).
- **Backup Logic:** The database is locked briefly, a SQLite `.backup` command is executed, and the resulting file is hashed and copied to the secure backup directory alongside the Vault files.

## 7. Migration & Rollback Procedures
- **Versioning:** Alembic is used for strict schema versioning.
- **Rollback:** Every migration script (`up()`) must have a corresponding, fully tested rollback script (`down()`).
- **Corruption Recovery:** If the main SQLite database is corrupted, the system automatically halts, renames the corrupted file, and restores the latest verified snapshot from the backup directory.
