# Prime Pathwy Active Database & Ingestion Infrastructure
## Sovereign System Specification

### I. Database Architecture & Design Standards
To transition Prime Pathwy from passive archives to an active intelligence platform, the database layer must support complex relational queries, integrity constraints, and scalable ingestion. 

The core storage engine is built on **SQLite**, chosen for its lightweight footprint, zero-configuration overhead, and robust SQL support. To maintain high-authority institutional standards, the schema strictly enforces foreign key relationships, data normalization, and unique indexing.

---

### II. Entity-Relationship (ER) Schema Design
The database consists of three core tables: `crm_entities`, `procurement_contracts`, and `entity_relationships`.

```
  +------------------+             +----------------------+
  |   crm_entities   |             | procurement_contracts|
  +------------------+             +----------------------+
  | PK entity_id     |             | PK contract_id       |
  |    legal_name    |             |    issuing_agency    |
  |    email         |             |    contract_value    |
  |    address       |             |    renewal_timing    |
  |    naics_code    |             | FK incumbent_id      |
  +--------+---------+             +----------+-----------+
           |                                  |
           | 1                                | 1
           |                                  |
           |           +----------------------+
           |           |
           |           | M
           v           v
  +--------------------+
  |entity_relationships|
  +--------------------+
  | PK relationship_id |
  | FK source_entity_id|
  | FK target_entity_id|
  |    rel_type        |
  +--------------------+
```

---

### III. Table Schema SQL Definitions

#### 1. CRM Entities Table (`crm_entities`)
Stores comprehensive enriched profiles for target leads, clients, and partners.
```sql
CREATE TABLE IF NOT EXISTS crm_entities (
    entity_id INTEGER PRIMARY KEY AUTOINCREMENT,
    legal_business_name TEXT NOT NULL UNIQUE,
    dba_names TEXT,
    executive_names TEXT,
    ownership_structures TEXT,
    decision_makers TEXT,
    direct_business_phone TEXT,
    verified_public_emails TEXT NOT NULL UNIQUE,
    website_url TEXT,
    linkedin_pages TEXT,
    physical_address TEXT,
    industry_classification TEXT,
    naics_code INTEGER,
    sic_code INTEGER,
    estimated_employee_count INTEGER,
    estimated_operational_scale TEXT,
    regional_footprint TEXT,
    vendor_dependencies TEXT,
    subcontracting_patterns TEXT,
    probable_recurring_spend TEXT,
    probable_tech_stack TEXT,
    operational_pain_points TEXT,
    likely_ai_automation_opportunities TEXT,
    recurring_revenue_potential TEXT,
    lead_source TEXT,
    lead_status TEXT DEFAULT 'Active - Enriched',
    last_enrichment_date TEXT,
    enrichment_integrity_hash TEXT NOT NULL UNIQUE
);
```

#### 2. Procurement Contracts Table (`procurement_contracts`)
Tracks contract opportunities, bid windows, and current incumbents.
```sql
CREATE TABLE IF NOT EXISTS procurement_contracts (
    contract_id INTEGER PRIMARY KEY AUTOINCREMENT,
    issuing_agency TEXT NOT NULL,
    contract_value TEXT,
    incumbent_id INTEGER,
    renewal_timing TEXT NOT NULL,
    procurement_portal TEXT,
    bid_windows TEXT,
    submission_requirements TEXT,
    contact_information TEXT,
    contract_duration TEXT,
    technology_indicators TEXT,
    operational_weaknesses TEXT,
    automation_opportunities TEXT,
    recurring_revenue_opportunities TEXT,
    FOREIGN KEY (incumbent_id) REFERENCES crm_entities(entity_id) ON DELETE SET NULL
);
```

#### 3. Entity Relationships Table (`entity_relationships`)
Maps operational and corporate linkages between different entities.
```sql
CREATE TABLE IF NOT EXISTS entity_relationships (
    relationship_id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_entity_id INTEGER NOT NULL,
    target_entity_id INTEGER NOT NULL,
    relationship_type TEXT NOT NULL, -- e.g., 'parent_company', 'vendor_dependency', 'subcontractor'
    relationship_details TEXT,
    last_updated TEXT,
    FOREIGN KEY (source_entity_id) REFERENCES crm_entities(entity_id) ON DELETE CASCADE,
    FOREIGN KEY (target_entity_id) REFERENCES crm_entities(entity_id) ON DELETE CASCADE,
    UNIQUE(source_entity_id, target_entity_id, relationship_type)
);
```

---

### IV. Ingestion & Synchronization Pipeline
The ingestion engine uses a strict transactional pipeline to ensure zero data corruption:

1. **Transaction Begin**: All inserts and updates occur within an explicit SQL transaction block (`BEGIN TRANSACTION`).
2. **Constraint Verification**: The database validates that `verified_public_emails` are unique and `naics_code` matches standard length.
3. **Foreign Key Enforcement**: Enforces `PRAGMA foreign_keys = ON;` before any relational writes.
4. **Error Handling & Rollback**: Any failure in CSV parsing or SQL syntax triggers an immediate `ROLLBACK` to the last known healthy state.
5. **Commit**: Upon complete validation, the transaction is finalized via `COMMIT`.

---

### V. Ingestion Scripts & Automation
This architecture is deployed and managed via `/tools/database_manager.py`. 
The script automates database creation, CSV import, relationship linking, and integrity reporting.
Database file is located at `/vault/exports/sqlite/prime_pathwy_sovereign.db`.
