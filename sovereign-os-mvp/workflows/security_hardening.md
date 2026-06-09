# Prime Pathwy Sovereign OS: Security Hardening Implementation Plan

## Overview
This document defines the REALISTIC local-MVP security hardening implementation plan for the Prime Pathwy Sovereign OS. It is scoped for a single-user localhost deployment utilizing FastAPI, SQLite, and Tesseract OCR, focusing on mitigating local privilege escalation, malicious file execution, and audit tampering.

## 1. Attack Surface Analysis

| Threat Vector | Description | MVP Mitigation Strategy |
| :--- | :--- | :--- |
| **Malicious File Uploads** | Uploading executables or scripts disguised as PDFs/images. | Strict MIME validation via `python-magic`, stripping execution bits, vault isolation. |
| **Path Traversal** | Manipulating filenames to overwrite system files (`../../etc/passwd`). | Secure filename generation (UUIDs), strict path resolution checks. |
| **OCR Exploit Vectors** | Crafted images triggering buffer overflows in Tesseract. | Running Tesseract in a restricted subprocess with timeouts; input sanitization. |
| **Audit Tampering** | Modifying the SQLite database to alter history. | Cryptographic chaining of logs, SQLite `BEFORE UPDATE/DELETE` triggers. |
| **Ransomware/Data Loss** | Malware encrypting the SQLite DB or vault. | Immutable backup snapshots, restricted file permissions on the vault directory. |
| **Local Privilege Escalation** | App running as root being compromised. | Run app as a dedicated, non-root user (`pathwy_user`). |

## 2. Exact Implementations

### A. Middleware Requirements
*   **Localhost Restriction:** FastAPI middleware that rejects any request where `request.client.host` is not `127.0.0.1` or `::1`.
*   **Security Headers:** Apply `Helmet`-style headers (Content-Security-Policy, X-Content-Type-Options: nosniff).

### B. Upload Validation Pipeline
1.  **Size Limit:** FastAPI `UploadFile` bounded by a strict max size (e.g., 50MB) via dependency.
2.  **MIME Validation:** Read the first 2048 bytes and use `magic.from_buffer()` to verify it is `application/pdf`, `image/png`, or `image/jpeg`. Reject mismatches immediately.
3.  **Secure Naming:** Discard the user-provided filename. Generate a new name using `uuid.uuid4().hex` + validated extension.
4.  **Vault Storage:** Save to `/var/lib/prime_pathwy/vault/` (or equivalent local path) with `0600` permissions (read/write by owner only).

### C. OCR Sandboxing Strategy
*   Invoke Tesseract via Python's `subprocess.run()`.
*   Pass `shell=False` strictly.
*   Enforce a timeout (e.g., `timeout=30` seconds) to prevent Denial of Service via complex images.
*   Drop privileges if possible, or run within a minimal Docker container (see Isolation below).

### D. Backup Verification Process
*   Script (`backup_db.sh`) uses `sqlite3 db.sqlite ".backup 'backup.sqlite'"`.
*   Generates a SHA-256 hash of the backup file and appends it to a `backups_manifest.txt`.
*   Cron job runs daily to verify the current hash against the manifest to detect silent corruption or tampering.

### E. Secrets Handling Rules
*   Even for a local MVP, NEVER hardcode API keys (e.g., if adding OpenAI later).
*   Use a `.env` file located outside the web root, read via Pydantic `BaseSettings`.
*   `.env` file permissions must be `0600`.

### F. Authentication Recommendations
*   **Single-User Local:** Since it binds to localhost, network auth is less critical, but a static API Key passed via `Authorization: Bearer <TOKEN>` header is recommended to prevent Cross-Site Request Forgery (CSRF) if the user clicks a malicious link in their browser while the local server is running.

## 3. Process & OS Isolation Recommendations

*   **Docker Isolation (Recommended):** Package the FastAPI app and Tesseract in a Docker container.
    *   Mount the SQLite DB and Vault as volumes.
    *   Run the container as a non-root user (`USER 1000:1000` in Dockerfile).
    *   Set `read_only: true` for the container root filesystem, mounting only `/tmp` and the vault as writable.
*   **OS-Level Protections:** If running bare-metal, use AppArmor or SELinux profiles to restrict the Python process to only read/write the specific vault and DB directories.

## 4. Vulnerability Remediation Priority

1.  **Highest-Risk / First Priority:** Path traversal and malicious uploads. (If compromised, the host OS is at risk).
2.  **Easiest Wins:** Localhost-only middleware binding and static API key auth.
3.  **Crucial for Integrity:** Append-only SQLite triggers and cryptographic audit log chaining.
