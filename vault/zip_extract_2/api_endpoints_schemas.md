# Prime Pathwy Sovereign OS: API Endpoints & Schemas

## Overview
This document details the FULL API contract specification for the Prime Pathwy local MVP. It covers all endpoints, request/response schemas, validation rules, and lifecycle roles.

## 1. Route Grouping & Versioning Strategy

*   **Versioning:** All endpoints are prefixed with `/api/v1`.
*   **Groups (Tags):**
    *   `System` (`/api/v1/system`): Health, status.
    *   `Work Orders` (`/api/v1/work-orders`): Case management.
    *   `Evidence` (`/api/v1/evidence`): File uploads, retrieval, OCR status.
    *   `Audit` (`/api/v1/audit`): Immutable log retrieval.
    *   `Export` (`/api/v1/export`): PDF generation.

## 2. Endpoint Contracts

### 2.1 System Group

#### `GET /api/v1/system/health`
*   **Purpose:** Liveness probe.
*   **Request Schema:** None.
*   **Response Schema:** `{"status": "string", "version": "string"}`
*   **Status Codes:** `200 OK`.
*   **Auth:** Requires `X-API-Key`.
*   **Security Risks:** Minimal. Exposes version info.
*   **Failure Conditions:** Database connection failure (returns 503).

### 2.2 Work Orders Group

#### `POST /api/v1/work-orders`
*   **Purpose:** Create a new work order/case.
*   **Request Schema (`WorkOrderCreate`):**
    *   `title` (string, required, max 255 chars)
*   **Response Schema (`WorkOrderOut`):**
    *   `id` (uuid)
    *   `title` (string)
    *   `status` (string: OPEN, CLOSED)
    *   `created_at` (datetime)
*   **Status Codes:** `201 Created`, `400 Bad Request`, `422 Validation Error`.
*   **Auth:** Requires `X-API-Key`.
*   **Security Risks:** Title could contain XSS payloads (mitigated by strict frontend rendering, but API should strip HTML).
*   **Lifecycle Role:** Entry point for organizing evidence.
*   **Failure Conditions:** DB constraint violation.
*   **Rollback Behavior:** SQLAlchemy session rollback.

#### `GET /api/v1/work-orders/{id}`
*   **Purpose:** Retrieve work order details and associated evidence list.
*   **Response Schema (`WorkOrderDetailOut`):** Includes `WorkOrderOut` fields + `evidence: List[EvidenceOut]`.
*   **Status Codes:** `200 OK`, `404 Not Found`.

### 2.3 Evidence Group

#### `POST /api/v1/evidence/upload`
*   **Purpose:** Upload a file, hash it, store in vault, and enqueue OCR.
*   **Request Schema:** `multipart/form-data`.
    *   `file` (UploadFile, required)
    *   `work_order_id` (uuid, required)
*   **Response Schema (`EvidenceUploadOut`):**
    *   `id` (uuid)
    *   `sha256_hash` (string)
    *   `ocr_status` (string: PENDING)
*   **Status Codes:** `202 Accepted`, `400 Bad Request` (MIME invalid), `409 Conflict` (Hash already exists), `413 Payload Too Large`.
*   **Auth:** Requires `X-API-Key`.
*   **Security Risks:** **CRITICAL**. Malicious file execution, path traversal, DoS via massive file.
*   **Lifecycle Role:** Core ingestion point. Triggers async OCR.
*   **Failure Conditions:** MIME validation fails, Vault write fails, DB insert fails.
*   **Rollback Behavior:** If DB insert fails, the file MUST be deleted from the vault (`os.remove`).

#### `GET /api/v1/evidence/{id}/ocr`
*   **Purpose:** Retrieve extracted text for a piece of evidence.
*   **Response Schema (`OcrExtractionOut`):**
    *   `evidence_id` (uuid)
    *   `extracted_text` (string)
    *   `confidence_score` (float)
    *   `status` (string: PENDING, COMPLETED, FAILED)
*   **Status Codes:** `200 OK`, `404 Not Found`.

### 2.4 Audit Group

#### `GET /api/v1/audit`
*   **Purpose:** Retrieve the immutable audit chain.
*   **Request Schema:** Query params `limit` (int, default 100), `offset` (int, default 0).
*   **Response Schema:** `List[AuditLogOut]`
    *   `id` (int)
    *   `timestamp` (datetime)
    *   `action` (string)
    *   `target_resource_id` (string)
    *   `current_hash` (string)
    *   `previous_hash` (string)
*   **Status Codes:** `200 OK`.
*   **Auth:** Requires `X-API-Key`.
*   **Security Risks:** Exposure of sensitive operational metadata.
*   **Lifecycle Role:** Compliance and verification.

### 2.5 Export Group

#### `POST /api/v1/export/pdf`
*   **Purpose:** Generate a PDF report of a work order and its evidence.
*   **Request Schema (`ExportRequest`):**
    *   `work_order_id` (uuid, required)
*   **Response Schema:** `FileResponse` (application/pdf).
*   **Status Codes:** `200 OK`, `404 Not Found`.
*   **Auth:** Requires `X-API-Key`.
*   **Security Risks:** DoS if report generation consumes too much memory.
*   **Lifecycle Role:** Final output generation.
*   **Failure Conditions:** PDF generation library failure.

## 3. Schemas (Pydantic)

All schemas strictly enforce types and boundaries.

```python
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class WorkOrderCreate(BaseModel):
    title: str = Field(..., max_length=255, description="Title of the work order")

class EvidenceOut(BaseModel):
    id: str
    original_filename: str
    sha256_hash: str
    mime_type: str
    file_size_bytes: int
    ocr_status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class WorkOrderOut(BaseModel):
    id: str
    title: str
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class WorkOrderDetailOut(WorkOrderOut):
    evidence: List[EvidenceOut] = []
```
