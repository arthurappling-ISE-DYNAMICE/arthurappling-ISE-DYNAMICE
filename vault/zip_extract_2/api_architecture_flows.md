# Prime Pathwy Sovereign OS: API Architecture & Flows

## Overview
This document defines the architectural flows for the Prime Pathwy local MVP API, covering authentication, the middleware stack, dependency injection, and background task interaction.

## 1. Authentication & Security Flow

The MVP operates in a strict single-user, local-first context. Network-level authentication is handled via a combination of network binding and a static API key.

### Local Authentication Flow
1.  **Request Arrival:** The client (e.g., local script or frontend) sends an HTTP request.
2.  **Middleware Intercept:** The `LocalhostMiddleware` intercepts the request. It checks `request.client.host`. If the IP is not `127.0.0.1` or `::1`, the connection is dropped with a `403 Forbidden`. This protects against local network scanning.
3.  **Dependency Intercept:** The `verify_api_key` dependency extracts the `X-API-Key` header.
4.  **Validation:** The key is compared against the `API_KEY` loaded in `src.config.settings`.
5.  **Rejection/Acceptance:** A mismatch yields a `403 Forbidden`. A match allows the request to proceed to the route handler.

## 2. Middleware Stack

The middleware stack is executed sequentially before the request reaches the router.

| Middleware Layer | Purpose | Action |
| :--- | :--- | :--- |
| **CORSMiddleware** | Cross-Origin Resource Sharing | Restricts origins to `http://localhost:*` and `http://127.0.0.1:*`. |
| **LocalhostMiddleware** | Network Isolation | Drops non-loopback requests. |
| **SizeLimitMiddleware** | DoS Protection | Inspects `Content-Length` header. Rejects requests > 50MB before parsing the body. |
| **AuditLoggingMiddleware** | Traceability | Logs incoming request path, method, and response status to the structured JSON logger. |

## 3. Dependency Injection Structure

FastAPI's dependency injection (`Depends`) is used to decouple state and security from business logic.

*   **`get_db()`:** Yields an `AsyncSession` bound to the SQLite WAL engine. Ensures the session is closed (`yield` block finishes) after the request completes.
*   **`verify_api_key()`:** Applied globally to the `FastAPI` instance. Extracts and validates the token.
*   **`get_current_user()`:** Since this is a single-user system, this dependency simply returns a static user object or ID representing the system owner, ensuring all audit logs have a valid `actor_id`.

## 4. Background Task Interaction Flow (OCR & Audit)

FastAPI `BackgroundTasks` are utilized to prevent blocking the event loop during heavy operations like OCR and cryptographic hashing.

### Upload & Queue Flow
1.  **Ingest:** `POST /api/v1/evidence/upload` receives the file.
2.  **Synchronous Phase:** The API hashes the file, validates MIME, writes to the Vault, inserts the `Evidence` DB record (`ocr_status='PENDING'`), and writes the `FILE_UPLOADED` audit log.
3.  **Task Enqueue:** The route handler calls `background_tasks.add_task(process_ocr, evidence_id, vault_path)`.
4.  **Response:** The API immediately returns `202 Accepted` with the evidence ID.
5.  **Asynchronous Phase:** The background task executes Tesseract.
6.  **Completion:** Upon OCR completion, the background task updates the DB (`ocr_status='COMPLETED'`) and appends an `OCR_COMPLETED` audit log.

### Audit Logging Flow
Audit logging must never fail silently. The `append_audit_log` service function is called synchronously within critical route handlers (e.g., upload, work order creation) and asynchronously within background tasks. It requires a DB session and guarantees cryptographic chaining by locking the previous hash.
