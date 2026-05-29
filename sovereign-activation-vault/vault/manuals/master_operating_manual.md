# Prime Pathwy Final Activation & Enrichment Engine
## Master Operating & Deployment Manual

### I. System Overview & Core Philosophy
This **Master Operating & Deployment Manual** serves as the authoritative, institutional-grade playbook for operating and scaling the **Prime Pathwy Sovereign Activation & Enrichment Engine**. 

Designed for Arthur F. Appling Sr. and the Prime Pathwy engineering core, this system operates on the core belief of **Systems over Labor** and **Documentation over Assumption**. Every workflow is deterministic, repeatable, and audit-ready to support high-ticket B2B installations and complete chargeback defense.

---

### II. Core System Architecture & Folder Navigation
The engine's physical files are distributed across five dedicated directories in accordance with the **WAT Framework**:

1. **`/workflows`**: Step-by-step SOPs governing CRM enrichment, procurement, database management, monetization, and relationship mapping.
2. **`/agents`**: Prompts and instruction sets governing AI agents.
3. **`/tools`**: Python scripts executing automation, database updates, network mapping, and master exports.
4. **`/temporary`**: Temporary logs, transaction files, and active JSON alerts.
5. **`/vault`**: Enriched databases, CSV/XLSX exports, SQLite master files, and HTML network visualizations.

---

### III. Step-by-Step Deployment Instructions

#### 1. System Scaffolding & Setup
To deploy the system from scratch, execute the following commands in sequence:
```bash
# 1. Create directory structure
mkdir -p /home/ubuntu/prime-pathwy-sovereign-vault/{workflows,agents,tools,temporary,vault/{crm,procurement,database,monetization,relationships,manifests,manuals,exports/{csv,xlsx,json,sqlite}}}

# 2. Grant execution permissions to tools
chmod +x /home/ubuntu/prime-pathwy-sovereign-vault/tools/*.py
```

#### 2. Running the CRM Enrichment Engine
To ingest raw leads and enrich them using the 27-point schema:
```bash
# Execute the enrichment engine
python3 /home/ubuntu/prime-pathwy-sovereign-vault/tools/crm_enrichment_engine.py
```
* **Success Criteria**: Screen displays `Successfully enriched: [Entity Name]` and writes output to `/vault/crm/enriched_crm_database.csv`.
* **Likely Failure**: Missing Python dependencies. *Fix*: Run `pip3 install pandas openpyxl`.

#### 3. Running the Procurement Intelligence Engine
To track active RFPs, audit incumbents, and forecast renewal bid windows:
```bash
# Execute the procurement engine
python3 /home/ubuntu/prime-pathwy-sovereign-vault/tools/procurement_intelligence_engine.py
```
* **Success Criteria**: Output JSON file generated at `/temporary/procurement_alerts.json` displaying response tiers (`IMMEDIATE_PURSUIT`, `STRATEGIC_PLANNING`).

#### 4. Syncing to SQLite Master Database
To import all enriched datasets and establish relational links:
```bash
# Run the database manager
python3 /home/ubuntu/prime-pathwy-sovereign-vault/tools/database_manager.py
```
* **Success Criteria**: Diagnostic report displays `database_integrity: PASS` with counts matching ingested entities.

#### 5. Generating D3.js Relationship Visualizations
To compile relationships and generate the interactive Matte Black and Gold map:
```bash
# Execute relationship mapper
python3 /home/ubuntu/prime-pathwy-sovereign-vault/tools/relationship_mapper.py
```
* **Success Criteria**: HTML file generated at `/vault/relationships/relationship_map.html` with interactive nodes.

#### 6. Exporting the Master Vault
To export all database tables to CSV, JSON, and a multi-sheet Excel file:
```bash
# Run vault exporter
python3 /home/ubuntu/prime-pathwy-sovereign-vault/tools/vault_exporter.py
```
* **Success Criteria**: Multi-sheet XLSX created at `/vault/exports/xlsx/prime_pathwy_master_intelligence.xlsx`.

---

### IV. Scaling the Infrastructure Globally
To scale this platform to support multiple regions and larger data volumes:
1. **Migrate to TiDB/MySQL**: For multi-user environments, replace the local SQLite engine with a managed MySQL or TiDB cluster. Update connection strings in `/tools/database_manager.py`.
2. **Implement Cron Scheduling**: Automate enrichment and procurement scraping cycles using cron jobs:
   ```cron
   # Run CRM enrichment every Monday at 00:00 UTC
   0 0 * * 1 /usr/bin/python3 /home/ubuntu/prime-pathwy-sovereign-vault/tools/crm_enrichment_engine.py >> /home/ubuntu/prime-pathwy-sovereign-vault/temporary/cron_crm.log 2>&1
   ```
3. **Deploy Web-Based Dashboard**: Expose the `/vault/relationships/relationship_map.html` and CRM tables through a secure, React-based web interface using the Prime Pathwy Matte Black and Gold aesthetic.

---

### V. Audit-Readiness & Chargeback Defense Protocol
Every transaction, lead enrichment, and contract bid must be accompanied by an **Audit Folder** in `/vault/exports/json/` containing:
1. The **Enrichment Integrity Hash** matching the exact state business registry record.
2. A timestamped PDF/screenshot of the procurement portal or bid submission confirmation.
3. The complete SQLite transaction log proving compliance with all regional data standards.
