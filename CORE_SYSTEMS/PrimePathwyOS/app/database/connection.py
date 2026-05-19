import os
from pathlib import Path
from datetime import datetime
from sqlalchemy import create_engine, event, text, inspect
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

_ENV_PATH = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(_ENV_PATH, override=True)

from app.config import PRIMEPATHWY_ROOT, DATABASE_DIR

DATABASE_DIR.mkdir(parents=True, exist_ok=True)

_db_path = DATABASE_DIR / "prime_pathwy.sqlite"
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{_db_path}")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

@event.listens_for(engine, "connect")
def _set_wal_mode(dbapi_conn, connection_record):
    """Enable WAL journal mode and NORMAL sync on every new SQLite connection."""
    cursor = dbapi_conn.cursor()
    cursor.execute("PRAGMA journal_mode=WAL")
    cursor.execute("PRAGMA synchronous=NORMAL")
    cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def _migrate_schema() -> None:
    """Add new columns to existing tables without data loss (SQLite-safe, idempotent)."""
    inspector = inspect(engine)
    table_names = set(inspector.get_table_names())

    def existing_cols(table: str) -> set:
        if table not in table_names:
            return set()
        return {c["name"] for c in inspector.get_columns(table)}

    with engine.connect() as conn:
        # ── clients ───────────────────────────────────────────────────────────
        cols = existing_cols("clients")
        for col, dtype in {
            "client_ref": "VARCHAR",
            "status":     "VARCHAR",
            "address":    "TEXT",
            "phone":      "VARCHAR",
            "email":      "VARCHAR",
            "updated_at": "DATETIME",
        }.items():
            if col not in cols:
                conn.execute(text(f"ALTER TABLE clients ADD COLUMN {col} {dtype}"))

        # ── work_orders ───────────────────────────────────────────────────────
        cols = existing_cols("work_orders")
        for col, dtype in {
            "wo_ref":         "VARCHAR",
            "title":          "VARCHAR",
            "evidence_score": "REAL",
            "updated_at":     "DATETIME",
            "started_at":     "DATETIME",
            "completed_at":   "DATETIME",
            "invoiced_at":    "DATETIME",
        }.items():
            if col not in cols:
                conn.execute(text(f"ALTER TABLE work_orders ADD COLUMN {col} {dtype}"))

        # Migrate legacy "Active" status to Tier 3 lifecycle vocab
        if "work_orders" in table_names:
            conn.execute(text(
                "UPDATE work_orders SET status = 'IN_PROGRESS' WHERE status = 'Active'"
            ))

        # ── invoices ─────────────────────────────────────────────────────────
        cols = existing_cols("invoices")
        for col, dtype in {
            "inv_ref":        "VARCHAR",
            "invoice_status": "VARCHAR",
            "updated_at":     "DATETIME",
        }.items():
            if col not in cols:
                conn.execute(text(f"ALTER TABLE invoices ADD COLUMN {col} {dtype}"))

        # ── receipts (Tier 2 columns — idempotent guard) ──────────────────────
        cols = existing_cols("receipts")
        for col, dtype in {
            "ocr_confidence":  "REAL",
            "ocr_processed_at": "DATETIME",
        }.items():
            if col not in cols:
                conn.execute(text(f"ALTER TABLE receipts ADD COLUMN {col} {dtype}"))

        # ── audit_logs — Tier 6 chain columns (idempotent) ────────────────────
        cols = existing_cols("audit_logs")
        for col, dtype in {
            "previous_hash": "VARCHAR",
            "entry_hash":    "VARCHAR",
        }.items():
            if col not in cols:
                conn.execute(text(f"ALTER TABLE audit_logs ADD COLUMN {col} {dtype}"))

        # ── operators (Tier 6 — created by Base.metadata if new) ──────────────
        # operators table is created by Base.metadata.create_all() above;
        # migration guard only needed if adding columns to an existing table.
        cols = existing_cols("operators")
        for col, dtype in {
            "is_active": "BOOLEAN",
        }.items():
            if col not in cols and "operators" in table_names:
                conn.execute(text(f"ALTER TABLE operators ADD COLUMN {col} {dtype} DEFAULT 1"))

        # ── tasks (Tier 7 — task engine) ──────────────────────────────────────
        cols = existing_cols("tasks")
        for col, dtype in {
            "task_ref":             "VARCHAR",
            "title":                "VARCHAR",
            "description":          "TEXT",
            "priority":             "VARCHAR",
            "status":               "VARCHAR",
            "assigned_to":          "VARCHAR",
            "due_date":             "DATETIME",
            "created_at":           "DATETIME",
            "updated_at":           "DATETIME",
            "completed_at":         "DATETIME",
            "linked_work_order_id": "INTEGER",
            "linked_client_id":     "INTEGER",
        }.items():
            if col not in cols and "tasks" in table_names:
                conn.execute(text(f"ALTER TABLE tasks ADD COLUMN {col} {dtype}"))

        # ── notifications (Tier 7 — local alert store) ────────────────────────
        cols = existing_cols("notifications")
        for col, dtype in {
            "notif_type":  "VARCHAR",
            "severity":    "VARCHAR",
            "message":     "TEXT",
            "entity_type": "VARCHAR",
            "entity_id":   "INTEGER",
            "is_read":     "BOOLEAN",
            "created_at":  "DATETIME",
            "read_at":     "DATETIME",
        }.items():
            if col not in cols and "notifications" in table_names:
                conn.execute(text(f"ALTER TABLE notifications ADD COLUMN {col} {dtype}"))

        # ── FTS5 virtual tables (Tier 5 — idempotent) ─────────────────────────
        try:
            conn.execute(text(
                "CREATE VIRTUAL TABLE IF NOT EXISTS receipt_search USING fts5("
                "  receipt_id UNINDEXED, vendor, raw_text,"
                "  invoice_number, payment_method, checksum UNINDEXED"
                ")"
            ))
            conn.execute(text(
                "CREATE VIRTUAL TABLE IF NOT EXISTS audit_search USING fts5("
                "  audit_id UNINDEXED, action, entity_type, details"
                ")"
            ))
            conn.execute(text(
                "CREATE VIRTUAL TABLE IF NOT EXISTS work_order_search USING fts5("
                "  work_order_id UNINDEXED, wo_ref, title, status"
                ")"
            ))
            conn.execute(text(
                "CREATE VIRTUAL TABLE IF NOT EXISTS task_search USING fts5("
                "  task_id UNINDEXED, task_ref, title, description, assigned_to, status"
                ")"
            ))
        except Exception:
            pass  # FTS5 unavailable in this SQLite build — search degrades gracefully

        conn.commit()


def generate_ref(prefix: str, pk: int) -> str:
    """Build a human-readable operational ID: PREFIX-YEAR-NNNN."""
    year = datetime.now().year
    return f"{prefix}-{year}-{pk:04d}"


def init_db() -> None:
    from app.database.models import Base
    Base.metadata.create_all(bind=engine)
    _migrate_schema()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
