# PRIME PATHWY — SOVEREIGN VAULT TROUBLESHOOTING & FAILURE RECOVERY MANUAL
**CONFIDENTIAL — FOR INTERNAL OPERATIONAL AUDIT ONLY**
*Author: Prime Pathwy Systems Intelligence Division*
*Aesthetic Standard: Matte Black and Gold (#0B0B0B, #C9A646)*

---

## I. SYSTEM DESCRIPTION & PURPOSE
This manual serves as the primary operational safeguard for the Prime Pathwy Sovereign Vault. It provides step-by-step diagnostic workflows, root-cause analyses, and recovery procedures for potential database, ingestion, synchronization, network, and deployment failures. Enforcing this manual ensures 100% system uptime, audit-readiness, and chargeback defense.

---

## II. CRITICAL FAILURE MATRIX

| Failure Domain | Symptom | Primary Root Cause | Repair Workflow | Prevention System |
| :--- | :--- | :--- | :--- | :--- |
| **Database Corruption** | SQLite returns `database disk image is malformed` (Error 11) | Abrupt process termination during write operation in non-WAL mode. | Run `.recover` script via sqlite3 CLI. | Force Write-Ahead Logging (`PRAGMA journal_mode = WAL;`). |
| **Ingestion Failure** | CSV import fails with `Unique Constraint Violation` | Duplicate record hashes or overlapping primary keys. | Execute deduplication pipeline. | Pre-compute record hash before write; use `INSERT OR IGNORE`. |
| **Graph Corruption** | Orphaned edges (edges referencing non-existent nodes) | Nodes deleted without cascading deletes to edge tables. | Run edge cleanup script. | Implement foreign key constraints (`PRAGMA foreign_keys = ON;`). |
| **Docker Failure** | Container exits immediately with code `137` | Out of memory (OOM) killer triggered by host OS. | Adjust Docker memory limits. | Implement resource constraints in `docker-compose.yml`. |
| **API Sync Failure** | API returns `401 Unauthorized` or `429 Too Many Requests` | Expired tokens or rate-limiting thresholds exceeded. | Rotate keys or implement exponential backoff. | Implement token caching and request queueing. |

---

## III. STEP-BY-STEP RECOVERY WORKFLOWS

### 1. SQLite Database Recovery (Corruption)
If the primary SQLite database file becomes corrupted due to hardware failure or power interruption, execute the following commands to restore integrity:

```bash
# Step 1: Backup the corrupted database file
cp PP_SOVEREIGN_VAULT.db PP_SOVEREIGN_VAULT_CORRUPTED.db

# Step 2: Run the SQLite recovery utility to dump valid SQL
sqlite3 PP_SOVEREIGN_VAULT.db ".recover" > recovery_dump.sql

# Step 3: Rebuild the database from the recovered SQL dump
sqlite3 PP_SOVEREIGN_VAULT_RECOVERED.db < recovery_dump.sql

# Step 4: Verify the recovered database integrity
sqlite3 PP_SOVEREIGN_VAULT_RECOVERED.db "PRAGMA integrity_check;"
```
*Pass Criteria:* The terminal must output `ok`. If it outputs any other string, halt and request a Ground Truth Audit.

---

### 2. Ingestion & Unique Constraint Recovery
If an automated CSV ingestion pipeline fails due to overlapping data structures, run the deduplication pipeline:

* **Exact Command:** `python3 tools/sovereign_router.py --deduplicate --table entities`
* **Pass Criteria:** `[SUCCESS] Deduplication complete. 0 duplicate records found. Integrity verified.`
* **Error Map:** If deduplication fails with `Locked Database Error`, run `fuser -k PP_SOVEREIGN_VAULT.db` to terminate active locks, then retry.

---

### 3. Graph Synchronization Recovery
If the relationship graph nodes and edges become out of sync with the primary SQL tables, execute the following synchronization protocol:

```bash
# Step 1: Export current SQL tables to temporary CSVs
sqlite3 -header -csv PP_SOVEREIGN_VAULT.db "SELECT * FROM entities;" > temporary/temp_entities.csv
sqlite3 -header -csv PP_SOVEREIGN_VAULT.db "SELECT * FROM procurement_opportunities;" > temporary/temp_procurement.csv

# Step 2: Re-run the knowledge graph generator to rebuild JSON and edge tables
python3 tools/generate_knowledge_graphs.py

# Step 3: Verify no orphaned edges exist
sqlite3 PP_SOVEREIGN_VAULT.db "SELECT COUNT(*) FROM graph_edges ge WHERE NOT EXISTS (SELECT 1 FROM graph_nodes gn WHERE gn.node_id = ge.source_node_id);"
```
*Pass Criteria:* The terminal must output `0`. Any positive integer indicates orphaned edges that must be purged.

---

## IV. ESCALATION LOGIC & THE ZERO-INFERENCE CONTRACT
If any system failure cannot be resolved after executing the designated recovery workflow twice:
1. **HALT execution immediately.** Do not attempt to guess or run unverified scripts.
2. **Document the exact environment state** using the Ground Truth Audit template.
3. **Generate a diagnostic log bundle** by running:
   ```bash
   tar -czf diagnostic_logs_$(date +%F).tar.gz /home/ubuntu/sovereign-vault/vault/SOVEREIGN_EXECUTION_VAULT/database_infrastructure/*.db /home/ubuntu/sovereign-vault/vault/SOVEREIGN_EXECUTION_VAULT/database_infrastructure/*.sql
   ```
4. **Present the diagnostic bundle** to the Lead Technical Architect and await manual review.

---
*End of Manual.*
