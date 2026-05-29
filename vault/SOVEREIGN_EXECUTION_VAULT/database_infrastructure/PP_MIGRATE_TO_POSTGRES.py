#!/usr/bin/env python3
"""
Prime Pathwy — Database Migration Script
Migrates from SQLite to PostgreSQL.
Usage: python3 migrate_to_postgres.py --pg-url postgresql://user:pass@host:5432/dbname
WAT: /tools
"""

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
