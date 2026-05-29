
-- ============================================================
-- Prime Pathwy Sovereign Vault — Production SQLite Schema
-- Version: 2.0 | Generated: 2026-05-29 12:00:58
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
