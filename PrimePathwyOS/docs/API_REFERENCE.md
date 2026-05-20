# API REFERENCE: Prime Pathwy Sovereign OS

## 1. Overview
The Prime Pathwy Sovereign OS backend exposes a RESTful API built with FastAPI. In the local-first deployment, this API is consumed by the local frontend. In the future SaaS deployment, this API will be secured via OAuth2 and exposed for enterprise integrations.

## 2. Core Endpoints

### 2.1 System Health
`GET /api/health`
- **Description:** Verifies system integrity, database connectivity, and core service availability.
- **Response:**
  ```json
  {
    "status": "PASS",
    "message": "System Integrity: PASS"
  }
  ```

### 2.2 Receipt Intake
`POST /api/upload/receipt`
- **Description:** Accepts a multipart form-data upload of a receipt image or PDF. Triggers the OCR pipeline, generates checksums, and logs the audit event.
- **Request Body:** `multipart/form-data` containing the `file`.
- **Response:**
  ```json
  {
    "status": "success",
    "receipt_id": 1042,
    "ocr_data": {
      "vendor": "Home Depot",
      "date": "2026-05-13",
      "amount": 145.20
    }
  }
  ```

### 2.3 Work Order Management (Draft)
`GET /api/work-orders/{id}`
- **Description:** Retrieves the full state of a Work Order, including linked receipts, photos, and compliance scores.

`POST /api/work-orders/{id}/evidence-package`
- **Description:** Triggers the asynchronous generation of the Master Evidence Package PDF for the specified Work Order.
- **Response:** Returns a task ID for polling generation status.

## 3. API Hardening Checklist (SaaS Roadmap)
- [ ] Implement JWT-based authentication via OAuth2.
- [ ] Enforce HTTPS/TLS 1.3 for all external traffic.
- [ ] Implement Redis-based rate limiting (e.g., 100 requests/minute per IP/Token).
- [ ] Sanitize all inputs to prevent SQL Injection (handled natively by SQLAlchemy, but strict Pydantic validation is required for all payloads).
- [ ] Ensure CORS (Cross-Origin Resource Sharing) policies strictly limit access to authorized domains.
