# SECURITY MODEL & HARDENING: Prime Pathwy Sovereign OS

## 1. Threat Model & Attack Surface Analysis
The Prime Pathwy Sovereign OS operates on a local-first paradigm, significantly reducing external attack vectors. However, internal threats, ransomware, and future SaaS deployment require a robust defense-in-depth strategy.

### Primary Threat Vectors:
- **T1: Ransomware / Local Encryption:** Malicious software encrypting the local Vault and SQLite database.
- **T2: Insider Threat / Tampering:** Unauthorized modification of receipts, invoices, or audit logs to commit fraud.
- **T3: Application Exploits:** Path traversal during file upload, SQL injection, or Cross-Site Scripting (XSS) in the dashboard.
- **T4: Data Exfiltration:** Unauthorized copying of the Vault or database.

## 2. Immutable Audit Systems & Anti-Tamper Logic
To counter T2 (Insider Threat):
- **Cryptographic Chain of Custody:** Every file uploaded is hashed (SHA-256). This hash is stored in the database and linked to the `AuditLogs` table.
- **Append-Only Architecture:** The application logic strictly forbids `UPDATE` or `DELETE` operations on historical financial data. Corrections require a new entry (e.g., a "Correction" event) linked to the original record, preserving the error history.
- **Checksum Verification Layers:** The system performs runtime checks. Before rendering an Evidence Package PDF, the system recalculates the hash of all included receipts. If a hash mismatch is detected, the generation halts, and a "Tamper Alert" is logged.

## 3. Secure Upload Pipeline
To counter T3 (Application Exploits):
- **File Type Validation:** Strict MIME-type checking (not just extension validation) utilizing `python-magic`. Only `image/jpeg`, `image/png`, and `application/pdf` are permitted.
- **Path Traversal Prevention:** Uploaded files are renamed to a UUID or a secure hash-based filename upon ingestion. The original filename is stored only in the database, preventing directory traversal attacks via malicious filenames (e.g., `../../../etc/passwd`).
- **Sandboxed Processing:** The OCR pipeline (Tesseract) processes images in a restricted, temporary directory before the structured data is committed to the database.

## 4. Ransomware Recovery & Backup Strategy
To counter T1 (Ransomware):
- **Isolated Backups:** Backups must be written to an isolated volume (e.g., an external drive or a dedicated NAS) that the main OS user does not have modify/delete permissions for, utilizing a pull-based backup strategy rather than push-based.
- **Encrypted Backup Strategy:** Database snapshots and Vault archives are encrypted using AES-256 before being moved to cold storage, ensuring that even if the backup medium is compromised, the data remains secure.

## 5. Future SaaS Hardening (Zero-Trust Architecture)
When migrating to a multi-tenant cloud environment:
- **Authentication:** Implementation of OAuth2 / OIDC with mandatory Multi-Factor Authentication (MFA).
- **RBAC (Role-Based Access Control):** Strict separation of duties (e.g., `Technician` can upload, `Admin` can generate packages, `Auditor` has read-only access).
- **Environment Isolation:** Complete logical separation of tenants using PostgreSQL Row-Level Security (RLS) and isolated S3 buckets/prefixes for file storage.
- **Rate Limiting & Abuse Prevention:** Implementation of Redis-based rate limiting on API endpoints to prevent DDoS and brute-force attacks.
