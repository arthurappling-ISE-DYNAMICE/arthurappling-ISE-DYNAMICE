# Stage ZIP2 implementation files into src/ locations
import shutil, os

SRC_DIR  = r"C:/Users/arthu/GeminiEcosystem/vault/zip_extract_2"
DEST_ROOT = r"C:/Users/arthu/GeminiEcosystem/.claude/worktrees/vigilant-cohen-998ad1/PrimePathwyOS"
DOC_DEST  = os.path.join(DEST_ROOT, "docs")
SCRIPT_DEST = os.path.join(DEST_ROOT, "scripts")

# (source_filename, destination_relative_path)
PLACEMENTS = [
    # ── Entry point ─────────────────────────────────────────────────────────
    ("main.py",             "src/main.py"),

    # ── API routes ──────────────────────────────────────────────────────────
    ("system.py",           "src/api/routes/system.py"),
    ("work_orders.py",      "src/api/routes/work_orders.py"),
    ("evidence.py",         "src/api/routes/evidence.py"),
    ("audit.py",            "src/api/routes/audit.py"),
    ("export.py",           "src/api/routes/export.py"),

    # ── Core ────────────────────────────────────────────────────────────────
    ("security.py",         "src/core/security.py"),

    # ── DB ──────────────────────────────────────────────────────────────────
    ("session.py",          "src/db/session.py"),

    # ── Middleware ──────────────────────────────────────────────────────────
    ("localhost.py",        "src/middleware/localhost.py"),

    # ── Schemas ─────────────────────────────────────────────────────────────
    ("work_order.py",       "src/schemas/work_order.py"),

    # ── Services ────────────────────────────────────────────────────────────
    ("audit_service.py",    "src/services/audit_service.py"),
    ("file_vault.py",       "src/services/file_vault.py"),

    # ── Scripts ─────────────────────────────────────────────────────────────
    ("backup_db.sh",        "scripts/backup_db.sh"),
    ("scaffold_generator.sh", "scripts/scaffold_generator.sh"),
]

# Documentation files (flat names after sanitization)
DOC_PLACEMENTS = [
    ("Prime Pathwy Sovereign OS_ Full API Contract Specification.md",
     "docs/API_CONTRACT.md"),
    ("api_architecture_flows.md",
     "docs/api_architecture_flows.md"),
    ("api_endpoints_schemas.md",
     "docs/api_endpoints_schemas.md"),
    ("api_errors_concurrency.md",
     "docs/api_errors_concurrency.md"),
    # Master spec (use the ZIP2 version)
    ("Prime Pathwy Sovereign OS_ Local MVP Repository Architecture.md",
     "docs/REPO_ARCHITECTURE.md"),
    ("Prime Pathwy Sovereign OS_ SQLite Schema Architecture.md",
     "docs/SQLITE_SCHEMA.md"),
    ("Prime Pathwy Sovereign OS_ Security Hardening Implementation Plan.md",
     "docs/SECURITY_HARDENING.md"),
]

errors = []

for src_name, dest_rel in PLACEMENTS + DOC_PLACEMENTS:
    src_path  = os.path.join(SRC_DIR, src_name)
    dest_path = os.path.join(DEST_ROOT, dest_rel.replace("/", os.sep))
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)

    if not os.path.exists(src_path):
        print(f"MISSING SOURCE: {src_name}")
        errors.append(src_name)
        continue

    shutil.copy2(src_path, dest_path)
    print(f"PLACED: {dest_rel}")

print()
if errors:
    print(f"ERRORS ({len(errors)}): {errors}")
else:
    print("All files placed successfully.")
