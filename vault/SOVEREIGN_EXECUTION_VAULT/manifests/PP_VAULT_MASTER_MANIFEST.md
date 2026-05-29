# PRIME PATHWY — SOVEREIGN EXECUTION VAULT
## MASTER MANIFEST & NAVIGATION GUIDE
**Version:** 2.0 — Authentic Intelligence & Execution Layer
**Generated:** 2026-05-29
**Operator:** Arthur F. Appling Sr. — Lead Technical Architect
**Classification:** CONFIDENTIAL — INTERNAL OPERATIONAL INTELLIGENCE

---

## I. VAULT INTEGRITY SUMMARY

| Module | Files | Rows / Records | Status |
| :--- | :--- | :--- | :--- |
| Entity Enrichment | 7 files | 2,000 entities | VERIFIED |
| Procurement Intelligence | 9 files | 3,000 contracts | VERIFIED |
| Knowledge Graphs | 6 files | 2,117 nodes / 1,948 edges | VERIFIED |
| Database Infrastructure | 5 files | 9,065 total DB records | VERIFIED |
| Monetization Systems | 1 file | 3 Sovereign Offer Tiers | VERIFIED |
| Troubleshooting Archive | 1 file | 14 failure domains | VERIFIED |

**Total Deliverables:** 29 files across 6 operational modules.

---

## II. FILE NAVIGATION INDEX

### A. Entity Enrichment (`/entity_enrichment/`)
| File | Description | Rows |
| :--- | :--- | :--- |
| `PP_ENTITY_MASTER_ENRICHED.csv` | Full 2,000-entity enriched database — all industries, all regions | 2,000 |
| `PP_ENTITY_NORCAL_ENRICHED.csv` | NorCal-only entity subset — primary deployment territory | 783 |
| `PP_ENTITY_TIER1_TARGETS.csv` | Highest-priority immediate outreach targets | 491 |
| `PP_AI_OPPORTUNITY_TOP500.csv` | Top 500 entities by AI automation opportunity score | 500 |
| `PP_ENTITY_MASTER_DATABASE.xlsx` | Matte Black & Gold formatted XLSX master database | 2,000 |
| `PP_ENTITY_RELATIONSHIP_GRAPH.json` | Entity relationship graph (nodes + edges) | 2,169 nodes |
| `PP_REGION_INDUSTRY_ADJACENCY.csv` | Region × Industry adjacency matrix | 27 regions |

### B. Procurement Intelligence (`/procurement_intelligence/`)
| File | Description | Rows |
| :--- | :--- | :--- |
| `PP_PROCUREMENT_MASTER.csv` | Full 3,000-record multi-region procurement database | 3,000 |
| `PP_PROCUREMENT_US.csv` | US-only procurement opportunities | 1,870 |
| `PP_PROCUREMENT_NORCAL.csv` | NorCal-specific procurement opportunities | 935 |
| `PP_PROCUREMENT_INTERNATIONAL.csv` | CA/UK/AU international procurement opportunities | 1,130 |
| `PP_PROCUREMENT_CRITICAL_PRIORITY.csv` | CRITICAL priority — bid now or position immediately | 777 |
| `PP_PROCUREMENT_MASTER_DATABASE.xlsx` | Formatted XLSX procurement master database | 3,000 |
| `PP_PROCUREMENT_RENEWAL_FORECAST.csv` | Renewal cycle forecast sorted by days to renewal | 3,000 |
| `PP_VENDOR_REPLACEMENT_MAP.csv` | Incumbent displacement opportunities | 903 |
| `PP_PROCUREMENT_RELATIONSHIP_GRAPH.json` | Agency–Vendor relationship graph | 89 nodes |

### C. Knowledge Graphs (`/knowledge_graphs/`)
| File | Description | Records |
| :--- | :--- | :--- |
| `PP_MASTER_KNOWLEDGE_GRAPH.json` | Full multi-type knowledge graph | 2,117 nodes / 1,948 edges |
| `PP_RELATIONSHIP_EDGES.csv` | Flat edge table for database ingestion | 1,948 edges |
| `PP_GRAPH_NODES.csv` | Flat node table for database ingestion | 2,117 nodes |
| `PP_WEIGHTED_ADJACENCY_MATRIX.csv` | Weighted region × industry adjacency matrix | 27 regions |
| `PP_OWNERSHIP_HIERARCHY.json` | Parent–subsidiary ownership hierarchy | 169 parents |
| `PP_MONETIZATION_POTENTIAL_MAP.csv` | High-value relationship extraction | 1,700 relationships |

### D. Database Infrastructure (`/database_infrastructure/`)
| File | Description |
| :--- | :--- |
| `PP_SOVEREIGN_VAULT.db` | Production-ready SQLite database (9,065 records ingested) |
| `PP_SQLITE_SCHEMA.sql` | Normalized SQLite DDL with all indexes and constraints |
| `PP_POSTGRESQL_SCHEMA.sql` | PostgreSQL-compatible DDL with full-text search indexes and views |
| `PP_MIGRATE_TO_POSTGRES.py` | Automated migration script (SQLite → PostgreSQL) |
| `PP_DB_VALIDATION_REPORT.json` | Post-ingestion integrity validation report |

### E. Monetization Systems (`/monetization_systems/`)
| File | Description |
| :--- | :--- |
| `PP_MONETIZATION_PLAYBOOKS.md` | Sovereign System offer architecture, NEPQ scripts, pricing calculators, and deployment workflows |

### F. Troubleshooting Archive (`/troubleshooting_archive/`)
| File | Description |
| :--- | :--- |
| `PP_TROUBLESHOOTING_MANUAL.md` | 14-domain failure matrix, step-by-step recovery workflows, escalation logic, and Zero-Inference protocol |

---

## III. OPERATIONAL DEPLOYMENT INSTRUCTIONS

### Step 1: Database Activation
```bash
# Verify database integrity
sqlite3 vault/SOVEREIGN_EXECUTION_VAULT/database_infrastructure/PP_SOVEREIGN_VAULT.db "PRAGMA integrity_check;"
# Expected output: ok
```

### Step 2: Query Tier 1 Targets
```bash
sqlite3 vault/SOVEREIGN_EXECUTION_VAULT/database_infrastructure/PP_SOVEREIGN_VAULT.db \
  "SELECT legal_company_name, industry, city, executive_name, verified_email, ai_opportunity_score_pct FROM entities WHERE sovereign_target_tier LIKE '%Tier 1%' ORDER BY ai_opportunity_score_pct DESC LIMIT 20;"
```

### Step 3: Query Critical Procurement
```bash
sqlite3 vault/SOVEREIGN_EXECUTION_VAULT/database_infrastructure/PP_SOVEREIGN_VAULT.db \
  "SELECT issuing_agency, contract_title, estimated_contract_value, bid_close_date, contact_email FROM procurement_opportunities WHERE prime_pathwy_priority LIKE '%CRITICAL%' ORDER BY bid_close_date ASC LIMIT 20;"
```

### Step 4: Migrate to PostgreSQL (Production)
```bash
python3 vault/SOVEREIGN_EXECUTION_VAULT/database_infrastructure/PP_MIGRATE_TO_POSTGRES.py \
  --sqlite vault/SOVEREIGN_EXECUTION_VAULT/database_infrastructure/PP_SOVEREIGN_VAULT.db \
  --pg-url postgresql://user:password@your-host:5432/prime_pathwy
```

---

## IV. VALIDATION CONTRACT
* **Exact Command:** `sqlite3 vault/SOVEREIGN_EXECUTION_VAULT/database_infrastructure/PP_SOVEREIGN_VAULT.db "PRAGMA integrity_check;"`
* **Pass Criteria:** Terminal outputs `ok` on a single line.
* **Error Map:** If output is not `ok`, execute the SQLite Recovery Workflow in `PP_TROUBLESHOOTING_MANUAL.md`.

---

*End of Manifest.*
