# Prime Pathwy Sovereign OS: Error Handling & Concurrency

## Overview
This document outlines the error handling rules, concurrency risks, and dangerous patterns for the Prime Pathwy local MVP API. It ensures the system remains robust under failure conditions and avoids architectural dead ends.

## 1. Error Handling Rules

The API employs global exception handlers to map Python exceptions to standard HTTP responses, preventing stack traces from leaking to the client.

### Global Handlers
*   **`ValueError`:** Mapped to `400 Bad Request`. Used for domain-level validation failures (e.g., "Unsupported MIME type").
*   **`sqlalchemy.exc.IntegrityError`:** Mapped to `409 Conflict`. Used when a unique constraint is violated (e.g., uploading a file with an existing SHA-256 hash).
*   **`FileNotFoundError`:** Mapped to `404 Not Found`. Used when vault files are missing.
*   **`Exception` (Catch-all):** Mapped to `500 Internal Server Error`. Triggers a critical log entry.

### Rollback Behavior
Every route that modifies state must utilize a database session within a `try/except` block. If any exception occurs before `await db.commit()`, an `await db.rollback()` MUST be executed. Furthermore, if file system operations (like writing to the vault) occurred before the DB failure, the rollback block must explicitly delete the orphaned file to prevent vault pollution.

## 2. Concurrency Risks & Sync Bottlenecks

While FastAPI is asynchronous, certain operations can block the event loop if not handled correctly.

### Blocking Operations
*   **File Hashing:** Calculating a SHA-256 hash of a large file is CPU-bound. If done synchronously on the main thread, it blocks all other requests. **Mitigation:** Use `run_in_threadpool` or process the file in chunks asynchronously.
*   **PDF Generation:** ReportLab generation is CPU-bound and synchronous. **Mitigation:** Execute PDF generation within a FastAPI `BackgroundTask` or a thread pool, returning a job ID to the client for polling.
*   **Tesseract OCR:** Spawning a subprocess is synchronous if using standard `subprocess.run`. **Mitigation:** Ensure this is strictly isolated within a `BackgroundTask` and utilizes `asyncio.create_subprocess_exec` if fine-grained control is needed.

### SQLite Concurrency Risks
Even with WAL mode enabled, SQLite allows only one concurrent writer. If the background OCR task takes too long to write its results and holds a transaction open, the main API thread may encounter `SQLITE_BUSY` errors when trying to insert new work orders.
**Mitigation:** Keep DB transactions extremely short. The OCR task must compute the text *outside* the transaction, and only open the transaction to execute the final `UPDATE` and audit log insertion.

## 3. Dangerous Endpoint Patterns

### Anti-Patterns to Avoid
1.  **Trusting Client Filenames:** Never use the `filename` provided in the `UploadFile` object to save the file to disk. This invites path traversal attacks (`../../../etc/passwd`). Always generate a UUID.
2.  **In-Memory File Buffering:** Calling `await file.read()` on a 1GB file will crash the local server via Out-Of-Memory (OOM) errors. Always stream large files directly to disk using `shutil.copyfileobj` with a secure temporary path.
3.  **Silent Failures in Audit Logging:** Wrapping the audit log insertion in a `try/except pass` block is forbidden. If the audit log fails to write, the parent transaction must fail, and the request must be aborted. An un-audited action is a compromised system.
4.  **Exposing Internal Paths:** API responses must never return absolute vault paths (e.g., `/var/lib/vault/file.pdf`). They should only return the UUID identifier, which the client uses to construct a download URL (`/api/v1/evidence/{id}/download`).
