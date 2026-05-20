# SYSTEM ARCHITECTURE: Prime Pathwy Sovereign OS

## 1. Enterprise System Topology
The Prime Pathwy Sovereign OS is architected as a local-first, compliance-grade operational platform. Designed for 20+ year durability, it abstracts volatile dependencies (cloud APIs, third-party OCR) into strictly localized, immutable processes.

### 1.1 Modular Backend Scaling Structure
The backend utilizes FastAPI to provide asynchronous event-loop routing, ensuring high concurrency even in a local execution environment. The architecture is decoupled into discrete service layers:
- **API Gateway / Routing Layer:** Handles all incoming requests (UI, future mobile sync).
- **Service Layer:** Business logic (Receipt ingestion, Evidence generation, Work-Order state machines).
- **Data Access Layer (DAL):** SQLAlchemy ORM wrapping the local SQLite/PostgreSQL engine.
- **Worker Architecture:** Future implementation will utilize Celery with a local Redis/RabbitMQ broker for async processing of OCR and PDF generation tasks, preventing UI blocking during heavy batch operations.

### 1.2 Frontend Component Architecture
The frontend is designed using a Matte Black (#0B0B0B) and Gold (#C9A646) high-authority theme. It relies on vanilla HTML/CSS/JS (or a lightweight framework like Vue/React in future iterations) communicating with the backend via RESTful APIs.
- **State Management:** Local browser storage handles session state, while all permanent state is synced immediately to the backend SQLite database.
- **Offline Operation Strategy:** The UI is inherently offline-first, served directly from the local Python server (`127.0.0.1`).

### 1.3 Event-Driven Architecture & Async Processing Roadmap
To scale to enterprise operational loads:
1. **Event Bus:** Implementation of an internal event bus (e.g., `EventDispatcher` class) where actions like `RECEIPT_UPLOADED` trigger asynchronous listeners for OCR, hashing, and audit logging.
2. **Queue System:** Transitioning from synchronous `process_receipt()` to an async task queue.
3. **Caching:** Local caching (LRU cache or local Redis) for frequently accessed dashboard metrics and work-order summaries.

### 1.4 Production Deployment Topology (Future SaaS)
When migrating to a multi-tenant SaaS model:
- **Environment Separation:** Strict DEV, STAGING, and PROD environments.
- **Microservice Migration:** Extracting the OCR Pipeline and PDF Engine into isolated Docker containers orchestrated via Kubernetes.
- **Local-First Sync:** Desktop clients will utilize CRDTs (Conflict-free Replicated Data Types) or differential sync (e.g., WatermelonDB logic) to push local SQLite changes to a centralized PostgreSQL cloud cluster when online, ensuring zero data loss during offline field operations.

## 2. Immutable Storage & Abstraction Layer
The storage system is abstracted to prevent lock-in. The `VaultManager` class dictates all file operations, enforcing:
- **Checksum Validation:** SHA-256 hashes generated pre-write and post-write.
- **Directory Structure:** Strict `/YEAR/CLIENT/WORK_ORDER/` taxonomy.
- **Plugin System:** The storage interface (`IStorageProvider`) allows swapping local disk storage for S3-compatible storage (MinIO) without altering business logic.

## 3. Telemetry & Observability
- **Logging Architecture:** Structured JSON logging (using Python's `logging` module or `loguru`) capturing `timestamp`, `event_type`, `user`, `entity_id`, and `hash`.
- **Audit Immutability:** Logs are append-only. Deletions are soft-deletes with explicit tombstone records.
