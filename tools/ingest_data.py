#!/usr/bin/env python3
"""Prime Pathwy Vault Data Ingestor.

Writes records into data/prime_pathwy_vault.db (provisioned by
tools/initialize_vault.py). Three subcommands:

    lead    Insert a new lead into internal_leads
    task    Append an operational task into operational_tasks
    metric  Upsert a metric row into platform_metrics (keyed on metric_name)

All values are bound as SQLite parameters — never interpolated into SQL.
Each write runs in an automatic transaction: committed on success, rolled
back on any failure.

Usage examples:
    python tools/ingest_data.py lead --company "Acme Corp" --industry logistics --phone 707-555-0100 --value 25000
    python tools/ingest_data.py task --description "Send proposal" --client-id 1
    python tools/ingest_data.py metric --name dscr --value 7.42
"""

import argparse
import sqlite3
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DB_PATH = REPO_ROOT / "data" / "prime_pathwy_vault.db"

LEAD_STATUSES = ("new", "contacted", "qualified", "won", "lost")
TASK_STATUSES = ("pending", "in_progress", "done", "blocked")


def non_empty(value: str) -> str:
    """argparse type: reject blank or whitespace-only strings."""
    if not value or not value.strip():
        raise argparse.ArgumentTypeError("value must be a non-empty string")
    return value.strip()


def positive_int(value: str) -> int:
    """argparse type: integer >= 1 (row ids)."""
    try:
        n = int(value)
    except ValueError:
        raise argparse.ArgumentTypeError(f"'{value}' is not an integer")
    if n < 1:
        raise argparse.ArgumentTypeError("must be a positive integer")
    return n


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="ingest_data.py",
        description="Insert leads, tasks, and metrics into the Prime Pathwy vault.",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    lead = sub.add_parser("lead", help="Insert a new lead into internal_leads")
    lead.add_argument("--company", type=non_empty, required=True, help="Company name")
    lead.add_argument("--industry", type=non_empty, default=None, help="Industry sector")
    lead.add_argument("--phone", type=non_empty, default=None, help="Contact phone")
    lead.add_argument("--status", choices=LEAD_STATUSES, default="new", help="Lead status")
    lead.add_argument("--value", type=float, default=0.0, help="Estimated value (USD)")

    task = sub.add_parser("task", help="Append a task into operational_tasks")
    task.add_argument("--description", type=non_empty, required=True, help="Task description")
    task.add_argument("--client-id", type=positive_int, default=None,
                      help="internal_leads.id this task belongs to")
    task.add_argument("--status", choices=TASK_STATUSES, default="pending", help="Task status")

    metric = sub.add_parser("metric", help="Upsert a metric into platform_metrics")
    metric.add_argument("--name", type=non_empty, required=True, help="Metric name (unique key)")
    metric.add_argument("--value", type=float, required=True, help="Metric value")

    return parser


def insert_lead(conn: sqlite3.Connection, args: argparse.Namespace) -> str:
    cur = conn.execute(
        "INSERT INTO internal_leads (company_name, industry, contact_phone, status, estimated_value) "
        "VALUES (?, ?, ?, ?, ?)",
        (args.company, args.industry, args.phone, args.status, args.value),
    )
    return (f"[PASS] LEAD INSERTED — id={cur.lastrowid} company='{args.company}' "
            f"status={args.status} value=${args.value:,.2f}")


def insert_task(conn: sqlite3.Connection, args: argparse.Namespace) -> str:
    cur = conn.execute(
        "INSERT INTO operational_tasks (client_id, task_description, status) VALUES (?, ?, ?)",
        (args.client_id, args.description, args.status),
    )
    client = f"client_id={args.client_id}" if args.client_id else "unassigned"
    return f"[PASS] TASK APPENDED — id={cur.lastrowid} {client} status={args.status}"


def upsert_metric(conn: sqlite3.Connection, args: argparse.Namespace) -> str:
    conn.execute(
        "INSERT INTO platform_metrics (metric_name, metric_value, last_updated) "
        "VALUES (?, ?, datetime('now')) "
        "ON CONFLICT(metric_name) DO UPDATE SET "
        "metric_value = excluded.metric_value, last_updated = excluded.last_updated",
        (args.name, args.value),
    )
    row = conn.execute(
        "SELECT id, last_updated FROM platform_metrics WHERE metric_name = ?",
        (args.name,),
    ).fetchone()
    return (f"[PASS] METRIC UPSERTED — id={row[0]} name='{args.name}' "
            f"value={args.value} last_updated={row[1]} UTC")


HANDLERS = {"lead": insert_lead, "task": insert_task, "metric": upsert_metric}


def main(argv=None) -> int:
    args = build_parser().parse_args(argv)

    if not DB_PATH.exists():
        print(f"[FAIL] Vault not found at {DB_PATH} — run 'python tools/initialize_vault.py' first")
        return 1

    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.execute("PRAGMA foreign_keys = ON")
        with conn:  # auto-commit on success, auto-rollback on exception
            message = HANDLERS[args.command](conn, args)
        print(message)
        return 0
    except sqlite3.IntegrityError as exc:
        print(f"[FAIL] Integrity violation (transaction rolled back): {exc}")
        return 1
    except sqlite3.Error as exc:
        print(f"[FAIL] SQLite error (transaction rolled back): {exc}")
        return 1
    finally:
        if conn is not None:
            conn.close()


if __name__ == "__main__":
    sys.exit(main())
