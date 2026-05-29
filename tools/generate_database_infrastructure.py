#!/usr/bin/env python3
"""
Prime Pathwy — Phase 4: Live Ingestion & Operational Database Activation
Builds production-ready SQLite DB, PostgreSQL-compatible schemas, ingestion pipelines,
deduplication, indexing, and validation systems.
WAT: /tools
"""

import sqlite3
import csv
import json
import os
import hashlib
from datetime import datetime

OUTPUT_DIR = "/home/ubuntu/sovereign-vault/vault/SOVEREIGN_EXECUTION_VAULT/database_infrastructure"
os.makedirs(OUTPUT_DIR, exist_ok=True)

ENTITY_CSV = "/home/ubuntu/sovereign-vault/vault/SOVEREIGN_EXECUTION_VAULT/entity_enrichment/PP_ENTITY_MASTER_ENRICHED.csv"
PROCUREMENT_CSV = "/home/ubuntu/sovereign-vault/vault/SOVEREIGN_EXECUTION_VAULT/procurement_intelligence/PP_PROCUREMENT_MASTER.csv"
GRAPH_NODES_CSV = "/home/ubuntu/sovereign-vault/vault/SOVEREIGN_EXECUTION_VAULT/knowledge_graphs/PP_GRAPH_NODES.csv"
GRAPH_EDGES_CSV = "/home/ubuntu/sovereign-vault/vault/SOVEREIGN_EXECUTION_VAULT/knowledge_graphs/PP_RELATIONSHIP_EDGES.csv"

DB_PATH = f"{OUTPUT_DIR}/PP_SOVEREIGN_VAULT.db"

# ─────────────────────────────────────────────────────────────────────────────
# SCHEMA DEFINITIONS
# ─────────────────────────────────────────────────────────────────────────────

SQLITE_SCHEMA = """
-- ============================================================
-- Prime Pathwy Sovereign Vault — Production SQLite Schema
-- Version: 2.0 | Generated: {timestamp}
-- ============================================================

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
PRAGMA synchronous = NORMAL;

-- ─────────────────────────────────────────────────────────────
-- TABLE: entities
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS entities (
    entity_id           TEXT PRIMARY KEY,
    legal_company_name  TEXT NOT NULL,
    dba_name            TEXT,
    parent_company      TEXT,
    industry            TEXT NOT NULL,
    naics_code          TEXT,
    sic_code            TEXT,
    executive_name      TEXT,
    executive_title     TEXT,
    verified_phone      TEXT,
    verified_email      TEXT,
    website             TEXT,
    operational_address TEXT,
    city                TEXT,
    county_region       TEXT,
    state_province      TEXT,
    country             TEXT DEFAULT 'US',
    employee_estimate   TEXT,
    revenue_range       TEXT,
    founded_date        TEXT,
    digital_footprint_score TEXT,
    tech_stack          TEXT,
    operational_bottleneck TEXT,
    recurring_service_dependencies TEXT,
    probable_vendor_spend TEXT,
    infrastructure_dependencies TEXT,
    ai_automation_opportunity TEXT,
    ai_opportunity_score_pct INTEGER DEFAULT 0,
    recurring_revenue_potential TEXT,
    sovereign_target_tier TEXT,
    data_enrichment_date TEXT,
    source              TEXT,
    record_hash         TEXT UNIQUE,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: procurement_opportunities
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS procurement_opportunities (
    procurement_id          TEXT PRIMARY KEY,
    issuing_agency          TEXT NOT NULL,
    agency_type             TEXT,
    agency_location         TEXT,
    country                 TEXT DEFAULT 'US',
    contract_title          TEXT NOT NULL,
    contract_category       TEXT,
    naics_code              TEXT,
    estimated_contract_value TEXT,
    incumbent_vendor        TEXT,
    contract_duration       TEXT,
    bid_open_date           TEXT,
    bid_close_date          TEXT,
    renewal_date            TEXT,
    last_award_date         TEXT,
    submission_requirements TEXT,
    procurement_portal      TEXT,
    contact_email           TEXT,
    contact_phone           TEXT,
    vendor_dependencies     TEXT,
    operational_weakness    TEXT,
    automation_opportunity  TEXT,
    recurring_revenue_potential TEXT,
    prime_pathwy_priority   TEXT,
    data_date               TEXT,
    source                  TEXT,
    record_hash             TEXT UNIQUE,
    created_at              DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: graph_nodes
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS graph_nodes (
    node_id     TEXT PRIMARY KEY,
    label       TEXT NOT NULL,
    node_type   TEXT NOT NULL,
    industry    TEXT,
    region      TEXT,
    country     TEXT,
    revenue     TEXT,
    employees   TEXT,
    ai_score    INTEGER DEFAULT 0,
    tier        TEXT,
    tech_stack  TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: graph_edges
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS graph_edges (
    edge_id                     INTEGER PRIMARY KEY AUTOINCREMENT,
    source_node_id              TEXT NOT NULL,
    target_node_id              TEXT NOT NULL,
    relationship_type           TEXT NOT NULL,
    weight                      REAL DEFAULT 0.5,
    operational_dependency_level TEXT,
    recurring_revenue_relevance TEXT,
    monetization_potential      TEXT,
    contract_value              TEXT,
    renewal_date                TEXT,
    prime_pathwy_priority       TEXT,
    created_at                  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_node_id) REFERENCES graph_nodes(node_id),
    FOREIGN KEY (target_node_id) REFERENCES graph_nodes(node_id)
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: outreach_log
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS outreach_log (
    log_id          INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_id       TEXT,
    procurement_id  TEXT,
    contact_name    TEXT,
    contact_email   TEXT,
    contact_phone   TEXT,
    outreach_type   TEXT,  -- 'email', 'call', 'proposal', 'meeting'
    outreach_date   TEXT,
    outcome         TEXT,  -- 'no_response', 'interested', 'meeting_set', 'proposal_sent', 'won', 'lost'
    follow_up_date  TEXT,
    notes           TEXT,
    revenue_value   TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: contracts_won
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contracts_won (
    contract_id         INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_id           TEXT,
    procurement_id      TEXT,
    client_name         TEXT NOT NULL,
    contract_title      TEXT NOT NULL,
    contract_value      REAL,
    monthly_recurring   REAL,
    start_date          TEXT,
    end_date            TEXT,
    renewal_date        TEXT,
    status              TEXT DEFAULT 'active',  -- 'active', 'completed', 'at_risk', 'renewed'
    service_category    TEXT,
    notes               TEXT,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: ingestion_log
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ingestion_log (
    log_id          INTEGER PRIMARY KEY AUTOINCREMENT,
    source_file     TEXT NOT NULL,
    table_name      TEXT NOT NULL,
    records_ingested INTEGER DEFAULT 0,
    records_skipped  INTEGER DEFAULT 0,
    records_failed   INTEGER DEFAULT 0,
    ingestion_status TEXT DEFAULT 'pending',  -- 'pending', 'running', 'complete', 'failed'
    error_message   TEXT,
    started_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at    DATETIME
);

-- ─────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_entities_industry ON entities(industry);
CREATE INDEX IF NOT EXISTS idx_entities_region ON entities(county_region);
CREATE INDEX IF NOT EXISTS idx_entities_country ON entities(country);
CREATE INDEX IF NOT EXISTS idx_entities_tier ON entities(sovereign_target_tier);
CREATE INDEX IF NOT EXISTS idx_entities_ai_score ON entities(ai_opportunity_score_pct);
CREATE INDEX IF NOT EXISTS idx_entities_state ON entities(state_province);

CREATE INDEX IF NOT EXISTS idx_procurement_agency ON procurement_opportunities(issuing_agency);
CREATE INDEX IF NOT EXISTS idx_procurement_country ON procurement_opportunities(country);
CREATE INDEX IF NOT EXISTS idx_procurement_category ON procurement_opportunities(contract_category);
CREATE INDEX IF NOT EXISTS idx_procurement_priority ON procurement_opportunities(prime_pathwy_priority);
CREATE INDEX IF NOT EXISTS idx_procurement_renewal ON procurement_opportunities(renewal_date);
CREATE INDEX IF NOT EXISTS idx_procurement_incumbent ON procurement_opportunities(incumbent_vendor);

CREATE INDEX IF NOT EXISTS idx_graph_nodes_type ON graph_nodes(node_type);
CREATE INDEX IF NOT EXISTS idx_graph_nodes_country ON graph_nodes(country);
CREATE INDEX IF NOT EXISTS idx_graph_edges_source ON graph_edges(source_node_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_target ON graph_edges(target_node_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_type ON graph_edges(relationship_type);
CREATE INDEX IF NOT EXISTS idx_graph_edges_weight ON graph_edges(weight);

CREATE INDEX IF NOT EXISTS idx_outreach_entity ON outreach_log(entity_id);
CREATE INDEX IF NOT EXISTS idx_outreach_date ON outreach_log(outreach_date);
CREATE INDEX IF NOT EXISTS idx_outreach_outcome ON outreach_log(outcome);

CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts_won(status);
CREATE INDEX IF NOT EXISTS idx_contracts_renewal ON contracts_won(renewal_date);
"""

POSTGRESQL_SCHEMA = """
-- ============================================================
-- Prime Pathwy Sovereign Vault — PostgreSQL-Compatible Schema
-- Version: 2.0 | Generated: {timestamp}
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- TABLE: entities
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS entities (
    entity_id               VARCHAR(20) PRIMARY KEY,
    legal_company_name      VARCHAR(255) NOT NULL,
    dba_name                VARCHAR(255),
    parent_company          VARCHAR(255),
    industry                VARCHAR(100) NOT NULL,
    naics_code              VARCHAR(10),
    sic_code                VARCHAR(10),
    executive_name          VARCHAR(100),
    executive_title         VARCHAR(100),
    verified_phone          VARCHAR(30),
    verified_email          VARCHAR(150),
    website                 VARCHAR(255),
    operational_address     VARCHAR(255),
    city                    VARCHAR(100),
    county_region           VARCHAR(100),
    state_province          VARCHAR(50),
    country                 CHAR(2) DEFAULT 'US',
    employee_estimate       VARCHAR(30),
    revenue_range           VARCHAR(50),
    founded_date            DATE,
    digital_footprint_score VARCHAR(50),
    tech_stack              TEXT,
    operational_bottleneck  TEXT,
    recurring_service_dependencies TEXT,
    probable_vendor_spend   VARCHAR(50),
    infrastructure_dependencies TEXT,
    ai_automation_opportunity TEXT,
    ai_opportunity_score_pct SMALLINT DEFAULT 0 CHECK (ai_opportunity_score_pct BETWEEN 0 AND 100),
    recurring_revenue_potential VARCHAR(50),
    sovereign_target_tier   VARCHAR(50),
    data_enrichment_date    DATE,
    source                  VARCHAR(100),
    record_hash             VARCHAR(64) UNIQUE,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: procurement_opportunities
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS procurement_opportunities (
    procurement_id          VARCHAR(20) PRIMARY KEY,
    issuing_agency          VARCHAR(255) NOT NULL,
    agency_type             VARCHAR(50),
    agency_location         VARCHAR(150),
    country                 CHAR(2) DEFAULT 'US',
    contract_title          TEXT NOT NULL,
    contract_category       VARCHAR(100),
    naics_code              VARCHAR(10),
    estimated_contract_value VARCHAR(50),
    incumbent_vendor        VARCHAR(255),
    contract_duration       VARCHAR(50),
    bid_open_date           DATE,
    bid_close_date          DATE,
    renewal_date            DATE,
    last_award_date         DATE,
    submission_requirements TEXT,
    procurement_portal      VARCHAR(255),
    contact_email           VARCHAR(150),
    contact_phone           VARCHAR(30),
    vendor_dependencies     TEXT,
    operational_weakness    TEXT,
    automation_opportunity  TEXT,
    recurring_revenue_potential VARCHAR(50),
    prime_pathwy_priority   VARCHAR(50),
    data_date               DATE,
    source                  VARCHAR(100),
    record_hash             VARCHAR(64) UNIQUE,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: graph_nodes
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS graph_nodes (
    node_id     VARCHAR(100) PRIMARY KEY,
    label       VARCHAR(255) NOT NULL,
    node_type   VARCHAR(50) NOT NULL,
    industry    VARCHAR(100),
    region      VARCHAR(100),
    country     CHAR(2),
    revenue     VARCHAR(50),
    employees   VARCHAR(30),
    ai_score    SMALLINT DEFAULT 0,
    tier        VARCHAR(100),
    tech_stack  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: graph_edges
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS graph_edges (
    edge_id                     BIGSERIAL PRIMARY KEY,
    source_node_id              VARCHAR(100) NOT NULL REFERENCES graph_nodes(node_id),
    target_node_id              VARCHAR(100) NOT NULL REFERENCES graph_nodes(node_id),
    relationship_type           VARCHAR(50) NOT NULL,
    weight                      NUMERIC(5,3) DEFAULT 0.5,
    operational_dependency_level VARCHAR(20),
    recurring_revenue_relevance VARCHAR(20),
    monetization_potential      TEXT,
    contract_value              VARCHAR(50),
    renewal_date                DATE,
    prime_pathwy_priority       VARCHAR(50),
    created_at                  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: outreach_log
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS outreach_log (
    log_id          BIGSERIAL PRIMARY KEY,
    entity_id       VARCHAR(20) REFERENCES entities(entity_id),
    procurement_id  VARCHAR(20) REFERENCES procurement_opportunities(procurement_id),
    contact_name    VARCHAR(100),
    contact_email   VARCHAR(150),
    contact_phone   VARCHAR(30),
    outreach_type   VARCHAR(20) CHECK (outreach_type IN ('email','call','proposal','meeting','linkedin','text')),
    outreach_date   DATE,
    outcome         VARCHAR(30) CHECK (outcome IN ('no_response','interested','meeting_set','proposal_sent','won','lost','follow_up')),
    follow_up_date  DATE,
    notes           TEXT,
    revenue_value   VARCHAR(50),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: contracts_won
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contracts_won (
    contract_id         BIGSERIAL PRIMARY KEY,
    entity_id           VARCHAR(20) REFERENCES entities(entity_id),
    procurement_id      VARCHAR(20) REFERENCES procurement_opportunities(procurement_id),
    client_name         VARCHAR(255) NOT NULL,
    contract_title      TEXT NOT NULL,
    contract_value      NUMERIC(15,2),
    monthly_recurring   NUMERIC(12,2),
    start_date          DATE,
    end_date            DATE,
    renewal_date        DATE,
    status              VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','completed','at_risk','renewed','cancelled')),
    service_category    VARCHAR(100),
    notes               TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- INDEXES (PostgreSQL)
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_entities_industry ON entities(industry);
CREATE INDEX IF NOT EXISTS idx_entities_region ON entities(county_region);
CREATE INDEX IF NOT EXISTS idx_entities_country ON entities(country);
CREATE INDEX IF NOT EXISTS idx_entities_tier ON entities(sovereign_target_tier);
CREATE INDEX IF NOT EXISTS idx_entities_ai_score ON entities(ai_opportunity_score_pct DESC);
CREATE INDEX IF NOT EXISTS idx_entities_state ON entities(state_province);
CREATE INDEX IF NOT EXISTS idx_entities_fulltext ON entities USING gin(to_tsvector('english', legal_company_name || ' ' || COALESCE(industry,'') || ' ' || COALESCE(city,'')));

CREATE INDEX IF NOT EXISTS idx_procurement_agency ON procurement_opportunities(issuing_agency);
CREATE INDEX IF NOT EXISTS idx_procurement_country ON procurement_opportunities(country);
CREATE INDEX IF NOT EXISTS idx_procurement_category ON procurement_opportunities(contract_category);
CREATE INDEX IF NOT EXISTS idx_procurement_priority ON procurement_opportunities(prime_pathwy_priority);
CREATE INDEX IF NOT EXISTS idx_procurement_renewal ON procurement_opportunities(renewal_date ASC);
CREATE INDEX IF NOT EXISTS idx_procurement_incumbent ON procurement_opportunities(incumbent_vendor);

CREATE INDEX IF NOT EXISTS idx_graph_edges_source ON graph_edges(source_node_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_target ON graph_edges(target_node_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_type ON graph_edges(relationship_type);
CREATE INDEX IF NOT EXISTS idx_graph_edges_weight ON graph_edges(weight DESC);

-- ─────────────────────────────────────────────────────────────
-- VIEWS
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_tier1_targets AS
    SELECT entity_id, legal_company_name, industry, city, state_province, country,
           executive_name, verified_email, verified_phone, ai_opportunity_score_pct,
           recurring_revenue_potential, operational_bottleneck
    FROM entities
    WHERE sovereign_target_tier LIKE '%Tier 1%'
    ORDER BY ai_opportunity_score_pct DESC;

CREATE OR REPLACE VIEW v_critical_procurement AS
    SELECT procurement_id, issuing_agency, contract_title, contract_category,
           estimated_contract_value, incumbent_vendor, bid_close_date, renewal_date,
           contact_email, procurement_portal, recurring_revenue_potential
    FROM procurement_opportunities
    WHERE prime_pathwy_priority LIKE '%CRITICAL%'
    ORDER BY bid_close_date ASC;

CREATE OR REPLACE VIEW v_revenue_pipeline AS
    SELECT
        c.contract_id, c.client_name, c.contract_title, c.monthly_recurring,
        c.status, c.renewal_date, c.service_category
    FROM contracts_won c
    WHERE c.status = 'active'
    ORDER BY c.monthly_recurring DESC;
"""

MIGRATION_SCRIPT = """#!/usr/bin/env python3
\"\"\"
Prime Pathwy — Database Migration Script
Migrates from SQLite to PostgreSQL.
Usage: python3 migrate_to_postgres.py --pg-url postgresql://user:pass@host:5432/dbname
WAT: /tools
\"\"\"

import argparse
import sqlite3
import csv
import sys

TABLES = ['entities', 'procurement_opportunities', 'graph_nodes', 'graph_edges', 'outreach_log', 'contracts_won', 'ingestion_log']

def migrate(sqlite_path, pg_url):
    try:
        import psycopg2
    except ImportError:
        print("ERROR: psycopg2 not installed. Run: pip install psycopg2-binary")
        sys.exit(1)

    sqlite_conn = sqlite3.connect(sqlite_path)
    sqlite_conn.row_factory = sqlite3.Row
    pg_conn = psycopg2.connect(pg_url)
    pg_cur = pg_conn.cursor()

    for table in TABLES:
        print(f"Migrating table: {table}")
        try:
            rows = sqlite_conn.execute(f"SELECT * FROM {table}").fetchall()
            if not rows:
                print(f"  No rows in {table}, skipping.")
                continue
            cols = list(rows[0].keys())
            placeholders = ','.join(['%s'] * len(cols))
            col_str = ','.join(cols)
            insert_sql = f"INSERT INTO {table} ({col_str}) VALUES ({placeholders}) ON CONFLICT DO NOTHING"
            data = [tuple(row) for row in rows]
            pg_cur.executemany(insert_sql, data)
            pg_conn.commit()
            print(f"  Migrated {len(data)} rows.")
        except Exception as e:
            print(f"  ERROR migrating {table}: {e}")
            pg_conn.rollback()

    sqlite_conn.close()
    pg_conn.close()
    print("Migration complete.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--sqlite", default="PP_SOVEREIGN_VAULT.db")
    parser.add_argument("--pg-url", required=True)
    args = parser.parse_args()
    migrate(args.sqlite, args.pg_url)
"""

# ─────────────────────────────────────────────────────────────────────────────
# INGESTION ENGINE
# ─────────────────────────────────────────────────────────────────────────────

def compute_hash(row_dict):
    content = json.dumps(row_dict, sort_keys=True, default=str)
    return hashlib.sha256(content.encode()).hexdigest()

def load_csv(filepath):
    rows = []
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                rows.append(dict(row))
    except Exception as e:
        print(f"  Warning: Could not load {filepath}: {e}")
    return rows

def ingest_entities(conn, entities):
    cur = conn.cursor()
    ingested = skipped = failed = 0
    for e in entities:
        try:
            h = compute_hash(e)
            cur.execute("""
                INSERT OR IGNORE INTO entities (
                    entity_id, legal_company_name, dba_name, parent_company, industry,
                    naics_code, sic_code, executive_name, executive_title,
                    verified_phone, verified_email, website, operational_address,
                    city, county_region, state_province, country,
                    employee_estimate, revenue_range, founded_date,
                    digital_footprint_score, tech_stack, operational_bottleneck,
                    recurring_service_dependencies, probable_vendor_spend,
                    infrastructure_dependencies, ai_automation_opportunity,
                    ai_opportunity_score_pct, recurring_revenue_potential,
                    sovereign_target_tier, data_enrichment_date, source, record_hash
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """, (
                e.get("entity_id"), e.get("legal_company_name"), e.get("dba_name"),
                e.get("parent_company"), e.get("industry"), e.get("naics_code"),
                e.get("sic_code"), e.get("executive_name"), e.get("executive_title"),
                e.get("verified_phone"), e.get("verified_email"), e.get("website"),
                e.get("operational_address"), e.get("city"), e.get("county_region"),
                e.get("state_province"), e.get("country"), e.get("employee_estimate"),
                e.get("revenue_range"), e.get("founded_date"),
                e.get("digital_footprint_score"), e.get("tech_stack"),
                e.get("operational_bottleneck"), e.get("recurring_service_dependencies"),
                e.get("probable_vendor_spend"), e.get("infrastructure_dependencies"),
                e.get("ai_automation_opportunity"),
                int(e.get("ai_opportunity_score_pct", 0) or 0),
                e.get("recurring_revenue_potential"), e.get("sovereign_target_tier"),
                e.get("data_enrichment_date"), e.get("source"), h
            ))
            if cur.rowcount > 0:
                ingested += 1
            else:
                skipped += 1
        except Exception as ex:
            failed += 1
    conn.commit()
    return ingested, skipped, failed

def ingest_procurement(conn, records):
    cur = conn.cursor()
    ingested = skipped = failed = 0
    for p in records:
        try:
            h = compute_hash(p)
            cur.execute("""
                INSERT OR IGNORE INTO procurement_opportunities (
                    procurement_id, issuing_agency, agency_type, agency_location, country,
                    contract_title, contract_category, naics_code, estimated_contract_value,
                    incumbent_vendor, contract_duration, bid_open_date, bid_close_date,
                    renewal_date, last_award_date, submission_requirements, procurement_portal,
                    contact_email, contact_phone, vendor_dependencies, operational_weakness,
                    automation_opportunity, recurring_revenue_potential, prime_pathwy_priority,
                    data_date, source, record_hash
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """, (
                p.get("procurement_id"), p.get("issuing_agency"), p.get("agency_type"),
                p.get("agency_location"), p.get("country"), p.get("contract_title"),
                p.get("contract_category"), p.get("naics_code"),
                p.get("estimated_contract_value"), p.get("incumbent_vendor"),
                p.get("contract_duration"), p.get("bid_open_date"), p.get("bid_close_date"),
                p.get("renewal_date"), p.get("last_award_date"),
                p.get("submission_requirements"), p.get("procurement_portal"),
                p.get("contact_email"), p.get("contact_phone"),
                p.get("vendor_dependencies"), p.get("operational_weakness"),
                p.get("automation_opportunity"), p.get("recurring_revenue_potential"),
                p.get("prime_pathwy_priority"), p.get("data_date"), p.get("source"), h
            ))
            if cur.rowcount > 0:
                ingested += 1
            else:
                skipped += 1
        except Exception as ex:
            failed += 1
    conn.commit()
    return ingested, skipped, failed

def ingest_graph_nodes(conn, nodes):
    cur = conn.cursor()
    ingested = skipped = failed = 0
    for n in nodes:
        try:
            cur.execute("""
                INSERT OR IGNORE INTO graph_nodes (node_id, label, node_type, industry, region, country, revenue, employees, ai_score, tier, tech_stack)
                VALUES (?,?,?,?,?,?,?,?,?,?,?)
            """, (
                n.get("id"), n.get("label"), n.get("type"), n.get("industry"),
                n.get("region"), n.get("country"), n.get("revenue"), n.get("employees"),
                int(n.get("ai_score", 0) or 0), n.get("tier"), n.get("tech_stack")
            ))
            if cur.rowcount > 0:
                ingested += 1
            else:
                skipped += 1
        except Exception as ex:
            failed += 1
    conn.commit()
    return ingested, skipped, failed

def ingest_graph_edges(conn, edges):
    cur = conn.cursor()
    ingested = failed = 0
    for e in edges:
        try:
            cur.execute("""
                INSERT INTO graph_edges (source_node_id, target_node_id, relationship_type, weight,
                    operational_dependency_level, recurring_revenue_relevance, monetization_potential,
                    contract_value, renewal_date, prime_pathwy_priority)
                VALUES (?,?,?,?,?,?,?,?,?,?)
            """, (
                e.get("source"), e.get("target"), e.get("relationship_type"),
                float(e.get("weight", 0.5) or 0.5),
                e.get("operational_dependency_level"), e.get("recurring_revenue_relevance"),
                e.get("monetization_potential"), e.get("contract_value"),
                e.get("renewal_date"), e.get("prime_pathwy_priority")
            ))
            ingested += 1
        except Exception as ex:
            failed += 1
    conn.commit()
    return ingested, 0, failed

def log_ingestion(conn, source_file, table_name, ingested, skipped, failed, status, error=None):
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO ingestion_log (source_file, table_name, records_ingested, records_skipped, records_failed, ingestion_status, error_message, completed_at)
        VALUES (?,?,?,?,?,?,?,?)
    """, (source_file, table_name, ingested, skipped, failed, status, error, datetime.now().isoformat()))
    conn.commit()

def run_validation(conn):
    """Run integrity checks and return validation report."""
    cur = conn.cursor()
    report = {}
    tables = ["entities", "procurement_opportunities", "graph_nodes", "graph_edges", "outreach_log", "contracts_won", "ingestion_log"]
    for t in tables:
        try:
            cur.execute(f"SELECT COUNT(*) FROM {t}")
            count = cur.fetchone()[0]
            report[t] = {"row_count": count, "status": "OK"}
        except Exception as e:
            report[t] = {"row_count": 0, "status": f"ERROR: {e}"}

    # Check for orphaned edges
    try:
        cur.execute("""
            SELECT COUNT(*) FROM graph_edges ge
            WHERE NOT EXISTS (SELECT 1 FROM graph_nodes gn WHERE gn.node_id = ge.source_node_id)
        """)
        orphaned = cur.fetchone()[0]
        report["orphaned_edges"] = {"count": orphaned, "status": "WARNING" if orphaned > 0 else "OK"}
    except Exception as e:
        report["orphaned_edges"] = {"count": 0, "status": f"ERROR: {e}"}

    # Entity completeness
    try:
        cur.execute("SELECT COUNT(*) FROM entities WHERE verified_email IS NULL OR verified_email = ''")
        missing_email = cur.fetchone()[0]
        report["entities_missing_email"] = {"count": missing_email, "status": "WARNING" if missing_email > 100 else "OK"}
    except Exception as e:
        report["entities_missing_email"] = {"count": 0, "status": f"ERROR: {e}"}

    return report

# ─────────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    print("[Phase 4] Writing SQLite schema file...")
    with open(f"{OUTPUT_DIR}/PP_SQLITE_SCHEMA.sql", "w") as f:
        f.write(SQLITE_SCHEMA.format(timestamp=ts))
    print("  SQLite schema written.")

    print("[Phase 4] Writing PostgreSQL schema file...")
    with open(f"{OUTPUT_DIR}/PP_POSTGRESQL_SCHEMA.sql", "w") as f:
        f.write(POSTGRESQL_SCHEMA.format(timestamp=ts))
    print("  PostgreSQL schema written.")

    print("[Phase 4] Writing migration script...")
    with open(f"{OUTPUT_DIR}/PP_MIGRATE_TO_POSTGRES.py", "w") as f:
        f.write(MIGRATION_SCRIPT)
    print("  Migration script written.")

    print("[Phase 4] Initializing SQLite database...")
    conn = sqlite3.connect(DB_PATH)
    conn.executescript(SQLITE_SCHEMA.format(timestamp=ts))
    conn.commit()
    print(f"  Database initialized: {DB_PATH}")

    print("[Phase 4] Loading and ingesting entities...")
    entities = load_csv(ENTITY_CSV)
    ing, skp, fail = ingest_entities(conn, entities)
    log_ingestion(conn, ENTITY_CSV, "entities", ing, skp, fail, "complete")
    print(f"  Entities: {ing} ingested, {skp} skipped, {fail} failed")

    print("[Phase 4] Loading and ingesting procurement records...")
    procurement = load_csv(PROCUREMENT_CSV)
    ing, skp, fail = ingest_procurement(conn, procurement)
    log_ingestion(conn, PROCUREMENT_CSV, "procurement_opportunities", ing, skp, fail, "complete")
    print(f"  Procurement: {ing} ingested, {skp} skipped, {fail} failed")

    print("[Phase 4] Loading and ingesting graph nodes...")
    nodes = load_csv(GRAPH_NODES_CSV)
    ing, skp, fail = ingest_graph_nodes(conn, nodes)
    log_ingestion(conn, GRAPH_NODES_CSV, "graph_nodes", ing, skp, fail, "complete")
    print(f"  Graph nodes: {ing} ingested, {skp} skipped, {fail} failed")

    print("[Phase 4] Loading and ingesting graph edges...")
    edges = load_csv(GRAPH_EDGES_CSV)
    ing, skp, fail = ingest_graph_edges(conn, edges)
    log_ingestion(conn, GRAPH_EDGES_CSV, "graph_edges", ing, skp, fail, "complete")
    print(f"  Graph edges: {ing} ingested, {skp} skipped, {fail} failed")

    print("[Phase 4] Running validation checks...")
    report = run_validation(conn)
    with open(f"{OUTPUT_DIR}/PP_DB_VALIDATION_REPORT.json", "w") as f:
        json.dump({"generated": ts, "database": DB_PATH, "validation": report}, f, indent=2)
    for table, result in report.items():
        print(f"  {table}: {result}")

    conn.close()

    print(f"\n[Phase 4] COMPLETE — Sovereign Vault database operational.")
    print(f"  Database: {DB_PATH}")
    print(f"  Output directory: {OUTPUT_DIR}")
