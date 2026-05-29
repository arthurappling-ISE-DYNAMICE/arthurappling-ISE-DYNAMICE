-- ============================================================
-- PRIME PATHWY SOVEREIGN KNOWLEDGE VAULT
-- AGENT EXECUTION LOG SCHEMA v1.0.0
-- Created: 2026-05-29 | Author: Arthur F. Appling Sr.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: agent_executions
-- Immutable audit log of every AI agent execution event.
-- ============================================================
CREATE TABLE IF NOT EXISTS agent_executions (
    execution_id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_name          VARCHAR(255) NOT NULL,
    agent_version       VARCHAR(50) NOT NULL,
    trigger_type        VARCHAR(100) NOT NULL, -- 'Scheduled', 'Event', 'Manual', 'API'
    input_payload       JSONB,
    output_payload      JSONB,
    status              VARCHAR(50) NOT NULL, -- 'Success', 'Failure', 'Timeout', 'Partial'
    tokens_consumed     INTEGER DEFAULT 0,
    duration_ms         INTEGER,
    error_message       TEXT,
    model_used          VARCHAR(100),
    executed_at         TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================
-- TABLE: workflow_runs
-- Tracks multi-step workflow execution sessions.
-- ============================================================
CREATE TABLE IF NOT EXISTS workflow_runs (
    run_id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_name       VARCHAR(255) NOT NULL,
    workflow_version    VARCHAR(50) NOT NULL,
    status              VARCHAR(50) NOT NULL DEFAULT 'Running', -- 'Running', 'Completed', 'Failed', 'Cancelled'
    triggered_by        VARCHAR(255),
    steps_total         INTEGER DEFAULT 0,
    steps_completed     INTEGER DEFAULT 0,
    steps_failed        INTEGER DEFAULT 0,
    started_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at        TIMESTAMPTZ,
    error_summary       TEXT
);

-- ============================================================
-- TABLE: workflow_steps
-- Tracks each individual step within a workflow run.
-- ============================================================
CREATE TABLE IF NOT EXISTS workflow_steps (
    step_id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id              UUID NOT NULL REFERENCES workflow_runs(run_id) ON DELETE CASCADE,
    step_name           VARCHAR(255) NOT NULL,
    step_order          INTEGER NOT NULL,
    status              VARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Running', 'Completed', 'Failed', 'Skipped'
    input_data          JSONB,
    output_data         JSONB,
    duration_ms         INTEGER,
    error_message       TEXT,
    executed_at         TIMESTAMPTZ
);

-- ============================================================
-- TABLE: kpi_snapshots
-- Daily snapshots of all tracked KPIs for trend analysis.
-- ============================================================
CREATE TABLE IF NOT EXISTS kpi_snapshots (
    snapshot_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kpi_name            VARCHAR(255) NOT NULL,
    snapshot_date       DATE NOT NULL,
    actual_value        NUMERIC(14, 4) NOT NULL,
    target_value        NUMERIC(14, 4) NOT NULL,
    variance            NUMERIC(14, 4) GENERATED ALWAYS AS (actual_value - target_value) STORED,
    is_alert_triggered  BOOLEAN DEFAULT FALSE,
    recorded_at         TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_agent_executions_agent ON agent_executions(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_executions_status ON agent_executions(status);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_status ON workflow_runs(status);
CREATE INDEX IF NOT EXISTS idx_kpi_snapshots_date ON kpi_snapshots(snapshot_date);
CREATE INDEX IF NOT EXISTS idx_kpi_snapshots_name ON kpi_snapshots(kpi_name);

-- ============================================================
-- SCHEMA VERSION MARKER
-- ============================================================
CREATE TABLE IF NOT EXISTS schema_migrations (
    version       VARCHAR(50) PRIMARY KEY,
    applied_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    description   TEXT
);

INSERT INTO schema_migrations (version, description)
VALUES ('1.0.0-agent-log', 'Agent Execution Log Schema — 2026-05-29')
ON CONFLICT (version) DO NOTHING;

-- ============================================================
-- END OF SCHEMA
-- Prime Pathwy Sovereign Knowledge Vault — Confidential
-- ============================================================
