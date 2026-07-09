#!/usr/bin/env python3
"""Prime Pathwy Vault Initializer.

Provisions the local SQLite vault at data/prime_pathwy_vault.db with the
three core tables: internal_leads, operational_tasks, platform_metrics.

Idempotent: safe to re-run. Existing tables and data are never dropped.

Usage:
    python tools/initialize_vault.py
"""

import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

# Resolve paths relative to the repo root (parent of tools/), so the script
# works no matter which directory it is invoked from.
REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "data"
DB_PATH = DATA_DIR / "prime_pathwy_vault.db"

CORE_TABLES = {
    "internal_leads": """
        CREATE TABLE IF NOT EXISTS internal_leads (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            company_name    TEXT    NOT NULL,
            industry        TEXT,
            contact_phone   TEXT,
            status          TEXT    NOT NULL DEFAULT 'new',
            estimated_value REAL    DEFAULT 0.0
        )
    """,
    "operational_tasks": """
        CREATE TABLE IF NOT EXISTS operational_tasks (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id        INTEGER,
            task_description TEXT    NOT NULL,
            status           TEXT    NOT NULL DEFAULT 'pending',
            timestamp        TEXT    NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (client_id) REFERENCES internal_leads (id)
        )
    """,
    "platform_metrics": """
        CREATE TABLE IF NOT EXISTS platform_metrics (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            metric_name  TEXT    NOT NULL UNIQUE,
            metric_value REAL,
            last_updated TEXT    NOT NULL DEFAULT (datetime('now'))
        )
    """,
}


def initialize_vault() -> int:
    """Create the vault database and core tables. Returns a process exit code."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.execute("PRAGMA foreign_keys = ON")
        with conn:  # one transaction; rolls back automatically on error
            for ddl in CORE_TABLES.values():
                conn.execute(ddl)

        # Validate: every core table must actually exist in the schema.
        rows = conn.execute(
            "SELECT name FROM sqlite_master WHERE type = 'table'"
        ).fetchall()
        existing = {row[0] for row in rows}
        missing = sorted(set(CORE_TABLES) - existing)
        if missing:
            print(f"[FAIL] Vault validation failed — missing tables: {', '.join(missing)}")
            return 1

        stamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        print("[PASS] PRIME PATHWY VAULT INITIALIZED")
        print(f"       Database : {DB_PATH}")
        print(f"       Tables   : {', '.join(sorted(CORE_TABLES))}")
        print(f"       Verified : {stamp}")
        return 0

    except sqlite3.Error as exc:
        print(f"[FAIL] SQLite error during vault initialization: {exc}")
        return 1
    finally:
        if conn is not None:
            conn.close()


if __name__ == "__main__":
    sys.exit(initialize_vault())
