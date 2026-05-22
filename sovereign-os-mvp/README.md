# Prime Pathwy Sovereign OS — Local MVP

**Version:** 0.1.0 | **Author:** Arthur F. Appling Sr. | **Classification:** Internal — Prime Pathwy

---

## System Overview

Prime Pathwy Sovereign OS is a local-first, single-user, audit-grade evidence management system. It provides hardened file uploads, SHA-256 evidence hashing, Tesseract OCR processing, immutable append-only audit logs, and PDF evidence export — all running on a local FastAPI server backed by SQLite WAL.

---

## Quick Start

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Set your API key in .env
# API_KEY=your_secure_key_here

# 3. Install dependencies
poetry install

# 4. Run database migrations
make migrate

# 5. Start the server
make run
```

Server binds to `http://127.0.0.1:8000` only.

---

## WAT Framework Compliance

| Category | Location |
| :--- | :--- |
| Workflows (.md) | `/workflows/` |
| Agents (Prompts) | `/agents/` |
| Tools (Scripts/Python) | `/tools/` |
| Temporary/Data | `/temporary/` |

---

## Architecture

```
API Layer (FastAPI Routes)
    ↓
Service Layer (Business Logic)
    ↓
Data Layer (SQLAlchemy Models + File Vault)
```

**Import Rule:** Dependencies flow inward only. API → Services → Models. No reverse imports.

---

## Security

- Localhost-only binding enforced via middleware.
- Static API key required on all requests via `X-API-Key` header.
- MIME validation on all uploads via `python-magic`.
- UUID-based secure file naming (original filenames discarded).
- Vault files stored with `0600` permissions.
- Audit logs are append-only, protected by SQLite triggers, and cryptographically chained.

---

## Backup

```bash
bash scripts/backup_db.sh
```

Generates a timestamped backup and records its SHA-256 hash in `backups/backups_manifest.txt`.

---

## License

Internal use only. Prime Pathwy — All rights reserved.
