# Prime Pathwy Sovereign OS: Full API Contract Specification

**Version:** 1.0.0 | **Author:** Arthur F. Appling Sr., Lead Technical Architect | **Classification:** Internal — Prime Pathwy

---

## Part I: Route Architecture

### 1.1 Versioning Strategy

All endpoints are served under the `/api/v1` prefix. The version is embedded in the URL path rather than a header to ensure explicit, cacheable, and debuggable contracts. When a breaking change is required, a new `/api/v2` prefix is introduced in parallel, and `/api/v1` is maintained until all consumers are migrated. For the local MVP, a single version is sufficient.

### 1.2 Route Grouping

| Tag | Prefix | Responsibility |
| :--- | :--- | :--- |
| **System** | `/api/v1/system` | Liveness probes, health checks |
| **Work Orders** | `/api/v1/work-orders` | Case/project lifecycle management |
| **Evidence** | `/api/v1/evidence` | Hardened file ingestion, retrieval, OCR polling |
| **Audit** | `/api/v1/audit` | Immutable chain retrieval and verification |
| **Export** | `/api/v1/export` | PDF evidence package generation |

---

## Part II: Complete Endpoint Contracts

### 2.1 System Group

#### `GET /api/v1/system/health`

**Purpose:** Confirms the API server and SQLite database are operational. Used as a liveness probe on startup and for monitoring.

**Security Risks:** Minimal. Returns the API version string, which is acceptable for a local-only deployment. In a future multi-user deployment, this endpoint should be unauthenticated but rate-limited.

**Expected Lifecycle:** Called on startup by the operator. Called periodically by any monitoring script.

**Failure Conditions:** If the database is unreachable, `db_status` returns `"error"` but the HTTP status remains `200`. A `503 Service Unavailable` is appropriate if the DB is completely down.

| Field | Type | Value |
| :--- | :--- | :--- |
| `status` | string | `"ok"` |
| `version` | string | `"1.0.0"` |
| `db_status` | string | `"ok"` or `"error"` |
| `environment` | string | `"local"` |

---

### 2.2 Work Orders Group

#### `POST /api/v1/work-orders`

**Purpose:** Creates a new work order, which is the organizational container for all related evidence files. Every evidence upload must be associated with a work order.

**Security Risks:** The `title` field is a free-text string. Any downstream rendering system (e.g., a local web UI) must treat this as untrusted HTML and escape it. The API itself does not sanitize HTML because it is a JSON API, not an HTML renderer.

**Expected Lifecycle:** Called once per case or project. The returned `id` is used in all subsequent evidence upload calls.

**Failure Conditions:** Empty title (`422`). Database write failure (`500`).

**Rollback Behavior:** SQLAlchemy session `rollback()` is called in the `except` block. The audit log is written within the same transaction as the work order creation, so both are rolled back atomically if either fails.

| Request Field | Type | Validation |
| :--- | :--- | :--- |
| `title` | string | Required, `min_length=1`, `max_length=255` |

| Response Field | Type | Description |
| :--- | :--- | :--- |
| `id` | string (UUID) | Unique work order identifier |
| `title` | string | Work order title |
| `status` | string | `OPEN` \| `IN_PROGRESS` \| `CLOSED` |
| `created_at` | datetime | UTC creation timestamp |
| `updated_at` | datetime | UTC last-modified timestamp |

**Status Codes:** `201 Created`, `422 Unprocessable Entity`, `500 Internal Server Error`.

---

#### `GET /api/v1/work-orders`

**Purpose:** Returns all work orders ordered by creation date descending. This is the primary data source for any dashboard or case list view.

**Failure Conditions:** Database unavailable (`500`).

**Status Codes:** `200 OK`.

---

#### `GET /api/v1/work-orders/{work_order_id}`

**Purpose:** Retrieves a single work order by its UUID.

**Failure Conditions:** Work order not found (`404`).

**Status Codes:** `200 OK`, `404 Not Found`.

---

#### `PATCH /api/v1/work-orders/{work_order_id}`

**Purpose:** Updates the `title` or `status` of a work order. Status transitions follow the lifecycle: `OPEN` → `IN_PROGRESS` → `CLOSED`. The `status` field is validated against a regex pattern at the Pydantic schema level.

**Rollback Behavior:** Full session rollback on any exception. The audit log entry is written within the same transaction.

**Status Codes:** `200 OK`, `404 Not Found`, `422 Unprocessable Entity`.

---

### 2.3 Evidence Group

#### `POST /api/v1/evidence/upload`

**Purpose:** The most critical endpoint in the system. Accepts a file and a `work_order_id` via `multipart/form-data`. Executes the full upload pipeline: size check → MIME validation → vault storage → SHA-256 hashing → DB record → audit log → OCR enqueue.

**Security Risks:** This is the highest-risk endpoint in the system. The following threats are mitigated in sequence:

| Threat | Mitigation |
| :--- | :--- |
| Oversized file (DoS) | `Content-Length` pre-check; `SizeLimitMiddleware` |
| Malicious file type | `python-magic` MIME validation on raw bytes |
| Path traversal | UUID filename generation; original name stored in DB only |
| Duplicate ingestion | SHA-256 unique constraint; `409 Conflict` on duplicate |
| Vault/DB desync | Vault file deleted if DB commit fails |

**Expected Lifecycle:** Client uploads file → API returns `202 Accepted` immediately → OCR runs in background → client polls `/evidence/{id}/ocr` for status.

**Failure Conditions:**

| Condition | HTTP Status |
| :--- | :--- |
| File > 50MB | `413 Payload Too Large` |
| Invalid MIME type | `400 Bad Request` |
| Duplicate SHA-256 hash | `409 Conflict` |
| Vault write failure | `500 Internal Server Error` |
| DB insert failure | `500` + vault file deleted |

**Rollback Behavior:** If the DB commit fails after the vault write, the vault file is explicitly deleted via `os.remove()` before the exception is re-raised. This prevents orphaned files accumulating in the vault.

| Request Field | Type | Description |
| :--- | :--- | :--- |
| `file` | UploadFile | The file to upload (PDF, PNG, JPEG) |
| `work_order_id` | string (form) | UUID of the parent work order |

| Response Field | Type | Description |
| :--- | :--- | :--- |
| `id` | string (UUID) | Evidence record ID |
| `sha256_hash` | string | SHA-256 digest of the file |
| `ocr_status` | string | Always `PENDING` on upload |
| `message` | string | Confirmation message |

---

#### `GET /api/v1/evidence/{evidence_id}`

**Purpose:** Returns the metadata for a specific evidence record. The `vault_path` is never included in the response — only the `id` is exposed, which the client uses to construct download or OCR URLs.

**Status Codes:** `200 OK`, `404 Not Found`.

---

#### `GET /api/v1/evidence/{evidence_id}/ocr`

**Purpose:** Polling endpoint for OCR status. Returns `PENDING` immediately after upload, `PROCESSING` while Tesseract is running, and `COMPLETED` or `FAILED` when done.

**Expected Lifecycle:** Client polls this endpoint at a configurable interval (e.g., every 3 seconds) until `ocr_status` is `COMPLETED` or `FAILED`.

**Status Codes:** `200 OK`, `404 Not Found`.

---

#### `GET /api/v1/evidence/{evidence_id}/download`

**Purpose:** Serves the original file from the vault. The vault path is **always** retrieved from the database record — it is never derived from user input. This is the primary path traversal protection for file serving.

**Failure Conditions:** Evidence record not found (`404`). Vault file missing (vault/DB desync) → `404` with a specific integrity warning message.

**Status Codes:** `200 OK` (FileResponse), `404 Not Found`.

---

### 2.4 Audit Group

#### `GET /api/v1/audit`

**Purpose:** Returns paginated audit log entries in chronological order. This is the primary compliance and chargeback defense interface.

**Security Risks:** Contains sensitive operational metadata (filenames, action timestamps, actor IDs). Protected by the global API key dependency.

| Query Parameter | Type | Default | Constraint |
| :--- | :--- | :--- | :--- |
| `limit` | integer | `100` | `1` to `500` |
| `offset` | integer | `0` | `>= 0` |

**Status Codes:** `200 OK`.

---

#### `GET /api/v1/audit/verify`

**Purpose:** Walks the entire audit chain from the `GENESIS` entry and recomputes each `current_hash`. If any entry's recomputed hash does not match the stored `current_hash`, the chain is broken and the first broken entry ID is returned. This is the tamper detection mechanism.

**Security Risks:** CPU-intensive for large chains. For the local MVP this is acceptable. In a future multi-user deployment, this should be rate-limited or moved to a background job.

**Failure Conditions:** Chain broken → `chain_valid: false` with `first_broken_at_id`.

| Response Field | Type | Description |
| :--- | :--- | :--- |
| `total_entries` | integer | Total number of audit entries checked |
| `chain_valid` | boolean | `true` if chain is intact |
| `first_broken_at_id` | integer | ID of first broken entry, or `null` |
| `message` | string | Human-readable status |

---

### 2.5 Export Group

#### `POST /api/v1/export/pdf`

**Purpose:** Generates a formatted PDF evidence package for a given work order. The PDF includes the work order title, a table of all evidence records (ID, filename, MIME type, SHA-256 short hash, OCR status), styled in Prime Pathwy Matte Black and Gold (`#0B0B0B`, `#C9A646`).

**Security Risks:** A work order with thousands of evidence records could cause high memory consumption during PDF generation. For the MVP (single-user, local), this is acceptable. For scale, this should be moved to a background job that returns a download URL.

**Expected Lifecycle:** Called after all evidence has been uploaded and OCR is complete. The PDF is the final deliverable.

**Failure Conditions:** Work order not found (`404`). ReportLab failure (`500`). Temp file is deleted on failure.

**Rollback Behavior:** The temporary PDF file at `/tmp/export_{uuid}.pdf` is deleted if generation fails. The audit log entry is only written after successful generation.

| Request Field | Type | Description |
| :--- | :--- | :--- |
| `work_order_id` | string (UUID) | Target work order |

**Response:** `FileResponse` with `Content-Type: application/pdf`.

---

## Part III: Authentication & Middleware Stack

### 3.1 Authentication Flow

The MVP uses a static API key passed via the `X-API-Key` HTTP header. This key is loaded from the `.env` file via Pydantic `BaseSettings` and applied as a global `Depends` on the `FastAPI` application instance, meaning every route requires it without per-route decoration.

```
Request → SizeLimitMiddleware → LocalhostMiddleware → CORSMiddleware
       → verify_api_key (global Depends) → Route Handler
```

### 3.2 Middleware Stack (Execution Order)

Starlette/FastAPI middleware is applied in reverse registration order. The stack below is listed in the order requests encounter it:

| Order | Middleware | Purpose |
| :--- | :--- | :--- |
| 1 | `SizeLimitMiddleware` | Rejects bodies > 50MB before parsing |
| 2 | `LocalhostMiddleware` | Drops non-loopback IPs with `403` |
| 3 | `CORSMiddleware` | Restricts origins to `localhost:*` |
| 4 | `verify_api_key` (Depends) | Validates `X-API-Key` header |

### 3.3 Dependency Injection Structure

| Dependency | Scope | Purpose |
| :--- | :--- | :--- |
| `get_db()` | Per-request | Yields an `AsyncSession`; closed after response |
| `verify_api_key()` | Global | Validates API key on every request |
| `BackgroundTasks` | Per-request | FastAPI-injected task queue for async OCR |

---

## Part IV: Background Task Interaction

### 4.1 OCR Queue Flow

```
POST /evidence/upload
    │
    ├─ [SYNC]  Read file → Hash → Validate MIME → Write Vault
    ├─ [SYNC]  Insert Evidence record (ocr_status=PENDING)
    ├─ [SYNC]  Append FILE_UPLOADED audit log
    ├─ [SYNC]  Commit transaction → Return 202 Accepted
    │
    └─ [ASYNC] background_tasks.add_task(process_ocr, evidence_id, vault_path)
                    │
                    ├─ Run Tesseract (subprocess, shell=False, timeout=30s)
                    ├─ Update Evidence.ocr_status = COMPLETED/FAILED
                    ├─ Insert OcrExtraction record
                    └─ Append OCR_COMPLETED/OCR_FAILED audit log
```

### 4.2 Audit Logging Flow

Every state-changing operation appends an audit log entry within the same database transaction as the state change. This guarantees that if the state change is rolled back, the audit log entry is also rolled back — there are no phantom audit entries for operations that never completed.

---

## Part V: Error Handling Rules

### 5.1 Global Exception Map

| Exception | HTTP Status | Trigger |
| :--- | :--- | :--- |
| `ValueError` | `400 Bad Request` | MIME validation failure, domain rule violation |
| `IntegrityError` | `409 Conflict` | Duplicate SHA-256 hash, unique constraint |
| `HTTPException(404)` | `404 Not Found` | Resource not found |
| `HTTPException(413)` | `413 Payload Too Large` | File exceeds 50MB |
| `RuntimeError` | `500 Internal Server Error` | Tesseract not installed, vault write failure |
| `Exception` (catch-all) | `500 Internal Server Error` | Unexpected system error |

### 5.2 Rollback Contract

Every route that modifies state follows this pattern without exception:

```python
try:
    # 1. Perform filesystem operations (vault write)
    # 2. db.flush() — stage DB changes
    # 3. append_audit_log() — within same transaction
    # 4. db.commit() — finalize
except Exception:
    await db.rollback()
    # Clean up filesystem side effects (delete vault file)
    raise
```

---

## Part VI: Dangerous Patterns & Concurrency Analysis

### 6.1 Dangerous Endpoint Patterns

**Anti-Pattern 1 — Trusting Client Filenames:** Using `file.filename` directly as the vault path is a path traversal vulnerability. The correct pattern is to store `file.filename` in the database for display purposes only and generate a `uuid4().hex` name for the actual vault path.

**Anti-Pattern 2 — Silent Audit Failures:** Catching exceptions from `append_audit_log()` with a `pass` block creates unaudited system state. If the audit log cannot be written, the parent transaction must fail. An un-audited action is a compromised system.

**Anti-Pattern 3 — Returning Internal Paths:** Any response that includes the `vault_path` column value exposes the server's filesystem layout. All download operations must go through the `/download` endpoint, which resolves the path server-side from the database.

**Anti-Pattern 4 — In-Memory Buffering of Large Files:** `await file.read()` loads the entire file into RAM. For the MVP (50MB limit, single user), this is acceptable. For v2, files should be streamed directly to a temporary path using `shutil.copyfileobj` before hashing.

### 6.2 Concurrency Risks

| Risk | Description | Mitigation |
| :--- | :--- | :--- |
| **SQLite Write Lock** | OCR background task holds a write transaction while the API is also writing | Keep OCR DB transactions minimal; compute text outside the transaction |
| **CPU-Bound Hashing** | SHA-256 of large files blocks the async event loop | Use `asyncio.to_thread()` for hashing in v2 |
| **PDF Generation Block** | ReportLab is synchronous and CPU-bound | Move to `BackgroundTask` + polling in v2 |
| **Audit Chain Race** | Two concurrent uploads could read the same `previous_hash` | Serialize audit log writes with a DB-level lock or sequential flush |

### 6.3 Sync Bottlenecks (MVP vs. V2)

| Operation | MVP Approach | V2 Approach |
| :--- | :--- | :--- |
| File hashing | Synchronous in service layer | `asyncio.to_thread(calculate_hash, content)` |
| OCR processing | FastAPI `BackgroundTask` | Dedicated worker process (arq, huey) |
| PDF generation | Synchronous in route handler | `BackgroundTask` + job ID polling |
| Audit chain verification | Full sequential scan | Cached checkpoint hash |

---

## Part VII: Validation Contract

| Check | Exact Command | Pass Criteria | Error Map |
| :--- | :--- | :--- | :--- |
| Health check | `curl http://127.0.0.1:8000/api/v1/system/health -H "X-API-Key: <key>"` | `{"status":"ok","db_status":"ok"}` | Verify DB path in `.env` |
| Create work order | `curl -X POST .../work-orders -H "X-API-Key: <key>" -d '{"title":"Case 001"}'` | `201` with UUID in response | Check `Content-Type: application/json` header |
| Upload evidence | `curl -X POST .../evidence/upload -F "file=@test.pdf" -F "work_order_id=<id>"` | `202` with `ocr_status: PENDING` | Verify `python-magic` and `libmagic` are installed |
| MIME rejection | Upload a `.exe` renamed to `.pdf` | `400 Bad Request: Unsupported file type` | Confirm `python-magic` reads raw bytes |
| Audit chain verify | `curl .../audit/verify -H "X-API-Key: <key>"` | `{"chain_valid": true}` | If false, check `first_broken_at_id` |
| PDF export | `curl -X POST .../export/pdf -d '{"work_order_id":"<id>"}'` | `200` with PDF download | Verify `reportlab` is installed |
