-- ============================================================
-- PRIME PATHWY SOVEREIGN KNOWLEDGE VAULT
-- MASTER SQL SCHEMA v1.0.0
-- Created: 2026-05-29 | Author: Arthur F. Appling Sr.
-- ============================================================

-- Enable UUID extension (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: clients
-- Stores all Prime Pathwy client records and contract metadata.
-- ============================================================
CREATE TABLE IF NOT EXISTS clients (
    client_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name       VARCHAR(255) NOT NULL,
    client_email      VARCHAR(255) UNIQUE NOT NULL,
    client_type       VARCHAR(100) NOT NULL, -- 'Government', 'Commercial', 'Logistics', 'Acquisition'
    industry_sector   VARCHAR(100),
    contract_value    NUMERIC(14, 2) CHECK (contract_value >= 0),
    mrr               NUMERIC(10, 2) DEFAULT 0.00,
    contract_start    DATE,
    contract_end      DATE,
    sla_tier          VARCHAR(50) DEFAULT 'Standard', -- 'Standard', 'Premium', 'Sovereign'
    is_active         BOOLEAN DEFAULT TRUE,
    created_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at        TIMESTAMPTZ
);

-- ============================================================
-- TABLE: work_orders
-- Tracks all field service work orders and their resolution status.
-- ============================================================
CREATE TABLE IF NOT EXISTS work_orders (
    work_order_id     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id         UUID NOT NULL REFERENCES clients(client_id) ON DELETE RESTRICT,
    title             VARCHAR(255) NOT NULL,
    description       TEXT,
    priority          VARCHAR(50) NOT NULL DEFAULT 'Medium', -- 'Critical', 'High', 'Medium', 'Low'
    status            VARCHAR(50) NOT NULL DEFAULT 'Open', -- 'Open', 'In Progress', 'Resolved', 'Closed'
    assigned_to       VARCHAR(255),
    sla_deadline      TIMESTAMPTZ,
    resolved_at       TIMESTAMPTZ,
    resolution_notes  TEXT,
    created_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: invoices
-- Tracks all client invoices, payment status, and audit trail.
-- ============================================================
CREATE TABLE IF NOT EXISTS invoices (
    invoice_id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id         UUID NOT NULL REFERENCES clients(client_id) ON DELETE RESTRICT,
    invoice_number    VARCHAR(100) UNIQUE NOT NULL,
    invoice_date      DATE NOT NULL,
    due_date          DATE NOT NULL,
    subtotal          NUMERIC(14, 2) NOT NULL CHECK (subtotal >= 0),
    tax_amount        NUMERIC(10, 2) DEFAULT 0.00,
    total_amount      NUMERIC(14, 2) GENERATED ALWAYS AS (subtotal + tax_amount) STORED,
    payment_status    VARCHAR(50) DEFAULT 'Unpaid', -- 'Unpaid', 'Partial', 'Paid', 'Overdue', 'Disputed'
    paid_at           TIMESTAMPTZ,
    created_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: vendors
-- Tracks all approved vendors, dependency criticality, and contracts.
-- ============================================================
CREATE TABLE IF NOT EXISTS vendors (
    vendor_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_name       VARCHAR(255) NOT NULL,
    vendor_category   VARCHAR(100), -- 'Hardware', 'Software', 'Cloud', 'Subcontractor'
    dependency_level  VARCHAR(50) DEFAULT 'Supplementary', -- 'Critical', 'High', 'Medium', 'Supplementary'
    monthly_cost      NUMERIC(10, 2) DEFAULT 0.00,
    contract_start    DATE,
    contract_end      DATE,
    primary_contact   VARCHAR(255),
    contact_email     VARCHAR(255),
    is_active         BOOLEAN DEFAULT TRUE,
    created_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: incidents
-- Tracks all system incidents, severity, and post-mortem data.
-- ============================================================
CREATE TABLE IF NOT EXISTS incidents (
    incident_id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_code     VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'INC-20260529-01'
    severity          VARCHAR(50) NOT NULL, -- 'SEV-1', 'SEV-2', 'SEV-3', 'SEV-4'
    title             VARCHAR(255) NOT NULL,
    description       TEXT,
    root_cause        TEXT,
    status            VARCHAR(50) DEFAULT 'Open', -- 'Open', 'Investigating', 'Resolved', 'Post-Mortem'
    detected_at       TIMESTAMPTZ NOT NULL,
    resolved_at       TIMESTAMPTZ,
    postmortem_url    TEXT,
    created_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: automation_jobs
-- Tracks all scheduled and event-triggered automation job executions.
-- ============================================================
CREATE TABLE IF NOT EXISTS automation_jobs (
    job_id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_name          VARCHAR(255) NOT NULL,
    job_type          VARCHAR(100), -- 'Scheduled', 'Event-Triggered', 'Manual'
    cron_expression   VARCHAR(100),
    last_run_at       TIMESTAMPTZ,
    last_run_status   VARCHAR(50), -- 'Success', 'Failure', 'Timeout', 'Skipped'
    last_run_duration_ms INTEGER,
    failure_count     INTEGER DEFAULT 0,
    is_active         BOOLEAN DEFAULT TRUE,
    created_at        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INDEXES: Performance Optimization
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_clients_type ON clients(client_type);
CREATE INDEX IF NOT EXISTS idx_work_orders_client ON work_orders(client_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(status);
CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(payment_status);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);

-- ============================================================
-- TRIGGER: Auto-update timestamps on record modification
-- ============================================================
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_clients_timestamp
    BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_work_orders_timestamp
    BEFORE UPDATE ON work_orders
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_invoices_timestamp
    BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ============================================================
-- SCHEMA VERSION MARKER
-- ============================================================
CREATE TABLE IF NOT EXISTS schema_migrations (
    version       VARCHAR(50) PRIMARY KEY,
    applied_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    description   TEXT
);

INSERT INTO schema_migrations (version, description)
VALUES ('1.0.0', 'Initial Prime Pathwy Sovereign Vault Schema — 2026-05-29')
ON CONFLICT (version) DO NOTHING;

-- ============================================================
-- END OF SCHEMA
-- Prime Pathwy Sovereign Knowledge Vault — Confidential
-- ============================================================
