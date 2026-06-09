# Prime Pathwy Sovereign OS: Local MVP Repository Architecture

## Overview
This document outlines the COMPLETE production-grade LOCAL MVP repository structure for the Prime Pathwy Sovereign OS. It is designed for local-first, single-user deployment using FastAPI, SQLite WAL, SQLAlchemy, and Tesseract OCR, optimized for Claude Code execution and audit-readiness.

## 1. Repository Tree (MVP Required)

```text
prime_pathwy_os/
├── .env.example
├── .gitignore
├── alembic.ini
├── docker-compose.yml
├── Dockerfile
├── Makefile
├── pyproject.toml
├── README.md
├── scripts/
│   ├── backup_db.sh
│   ├── run_dev.sh
│   └── setup_env.sh
├── src/
│   ├── __init__.py
│   ├── main.py
│   ├── config/
│   │   ├── __init__.py
│   │   └── settings.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── exceptions.py
│   │   ├── logging.py
│   │   └── security.py
│   ├── db/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── session.py
│   │   └── migrations/
│   ├── models/
│   │   ├── __init__.py
│   │   ├── audit.py
│   │   ├── evidence.py
│   │   └── work_order.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── audit.py
│   │   ├── evidence.py
│   │   └── work_order.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── dependencies.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── audit.py
│   │   │   ├── evidence.py
│   │   │   └── work_order.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── audit_service.py
│   │   ├── evidence_service.py
│   │   ├── ocr_service.py
│   │   └── pdf_service.py
│   ├── workers/
│   │   ├── __init__.py
│   │   └── ocr_queue.py
│   └── utils/
│       ├── __init__.py
│       ├── file_vault.py
│       └── hash_utils.py
└── tests/
    ├── __init__.py
    ├── conftest.py
    └── ...
```

## 2. Directory and File Breakdown

### Root Level
*   `pyproject.toml`: **Purpose:** Dependency management and build configuration (Poetry/uv). **Dependencies:** None. **Role:** Lifecycle entry point for environment setup.
*   `alembic.ini`: **Purpose:** SQLAlchemy migration configuration. **Dependencies:** `src.db.base`. **Role:** Schema evolution.
*   `Makefile`: **Purpose:** Developer shortcuts (e.g., `make run`, `make migrate`). **Dependencies:** Bash. **Role:** Operational utility.

### `scripts/`
*   `backup_db.sh`: **Purpose:** Securely copies the SQLite WAL database and vault files. **Dependencies:** OS utilities. **Role:** Disaster recovery.
*   `run_dev.sh`: **Purpose:** Starts FastAPI and queue workers. **Dependencies:** Uvicorn. **Role:** Startup script.

### `src/config/`
*   `settings.py`: **Purpose:** Loads `.env` variables via Pydantic BaseSettings. **Dependencies:** `pydantic-settings`. **Role:** Application configuration root.

### `src/core/`
*   `logging.py`: **Purpose:** Configures structured JSON logging for auditability. **Dependencies:** `logging`. **Role:** Immutable event tracking foundation.
*   `security.py`: **Purpose:** Implements localhost-only checks, API key validation (if needed for single user), and basic sanitization. **Dependencies:** FastAPI. **Role:** Perimeter defense.
*   `exceptions.py`: **Purpose:** Global exception handlers mapped to standard HTTP responses. **Dependencies:** FastAPI. **Role:** Error boundary.

### `src/db/`
*   `session.py`: **Purpose:** Configures SQLAlchemy async engine with SQLite WAL pragmas (`PRAGMA journal_mode=WAL`). **Dependencies:** `sqlalchemy`. **Role:** Connection lifecycle.
*   `base.py`: **Purpose:** SQLAlchemy DeclarativeBase registry. **Dependencies:** `sqlalchemy`. **Role:** Model registry.

### `src/models/` (Database Models)
*   `audit.py`: **Purpose:** Append-only log table. **Dependencies:** `src.db.base`. **Role:** Immutable evidence chain.
*   `evidence.py`: **Purpose:** Tracks uploaded files, SHA-256 hashes, and OCR status. **Dependencies:** `src.db.base`. **Role:** File metadata storage.

### `src/api/`
*   `dependencies.py`: **Purpose:** FastAPI Depends functions (e.g., `get_db`, `verify_local_user`). **Dependencies:** `src.db.session`. **Role:** Request scoping.
*   `routes/evidence.py`: **Purpose:** Upload and retrieval endpoints. **Dependencies:** `src.services.evidence_service`. **Role:** HTTP Interface.

### `src/services/` (Business Logic)
*   `evidence_service.py`: **Purpose:** Orchestrates upload hashing, vault storage, and DB record creation. **Dependencies:** `src.utils.file_vault`, `src.models.evidence`. **Role:** Core business logic.
*   `ocr_service.py`: **Purpose:** Wraps Tesseract calls. **Dependencies:** `pytesseract`. **Role:** Data extraction.

### `src/workers/`
*   `ocr_queue.py`: **Purpose:** Async background task processor (using FastAPI BackgroundTasks or a lightweight local queue like `huey` or `arq`). **Dependencies:** `src.services.ocr_service`. **Role:** Non-blocking processing.

### `src/utils/`
*   `file_vault.py`: **Purpose:** Hardened local filesystem operations (MIME checking, path traversal prevention). **Dependencies:** `os`, `shutil`. **Role:** Secure storage layer.
*   `hash_utils.py`: **Purpose:** SHA-256 generation. **Dependencies:** `hashlib`. **Role:** Integrity validation.

## 3. Separations

### Future-Scale Files (Not in MVP)
*   `src/db/redis.py`: Redis connection pooling (SQLite is sufficient for single-user).
*   `src/workers/celery_app.py`: Celery is overkill for local MVP.

### Unnecessary Enterprise Abstractions
*   Complex CQRS patterns (Command Query Responsibility Segregation).
*   Event Sourcing architectures (beyond simple append-only logs).
*   Microservices routing gateways.

## 4. Architecture Rules

### 1. Clean Architecture
*   **API Layer** -> **Service Layer** -> **Data Layer (Models/Vault)**.
*   API routes MUST NOT contain business logic. They only handle HTTP parsing and validation.

### 2. Import Flow Rules
*   `src.models` cannot import from `src.services` or `src.api`.
*   `src.services` cannot import from `src.api`.
*   Circular imports are strictly forbidden.

### 3. Dependency Direction Rules
*   Dependencies always point inwards toward domain models and interfaces.

### 4. Anti-Pattern Warnings
*   **Direct DB calls in routes:** Use the service layer.
*   **In-memory state:** Rely on SQLite for all state to ensure restart resilience.
*   **Trusting file extensions:** Always validate MIME types using `python-magic` or similar in `file_vault.py`.

### 5. Future Migration-Safe Abstraction Points
*   `src.db.session`: Centralized engine creation makes swapping to PostgreSQL trivial.
*   `src.utils.file_vault`: Interface-driven storage allows swapping local disk for S3 later.
