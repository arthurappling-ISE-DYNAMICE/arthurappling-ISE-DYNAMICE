
-- ============================================================
-- Prime Pathwy Sovereign Vault — PostgreSQL-Compatible Schema
-- Version: 2.0 | Generated: 2026-05-29 12:00:58
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
