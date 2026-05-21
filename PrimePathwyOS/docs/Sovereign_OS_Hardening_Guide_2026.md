# Sovereign OS Hardening Guide 2026
## Production-Ready Infrastructure & Security Blueprint

This guide provides institutional-grade hardening protocols for the Prime Pathwy Sovereign OS, addressing vulnerabilities identified in the 2026 Engineering Audit. It delivers concrete implementations for secure file ingestion, containerized OCR isolation, and transaction-safe SQLite replication.

---

## 1. Hardened FastAPI Upload Endpoint

The default FastAPI `UploadFile` implementation is vulnerable to path traversal, MIME-spoofing, and memory exhaustion (Denial of Service). To achieve production-grade security, the endpoint must enforce:
- **Magic Number Validation:** Verifying file signatures via `python-magic` rather than relying on client-provided `Content-Type` headers [1].
- **Content-Length Limits:** Rejecting oversized payloads before streaming them to disk [2].
- **UUID Renaming:** Stripping original filenames to prevent path traversal and collision attacks [2].

### Implementation: `app/backend/upload_handler.py`

```python
import os
import uuid
import magic
import aiofiles
from pathlib import Path
from fastapi import APIRouter, File, UploadFile, HTTPException, Request, status

router = APIRouter()

# Configuration
UPLOAD_DIR = Path("/data/vault/processing")
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB limit
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "application/pdf"}

# Ensure processing directory exists
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/api/upload/secure", status_code=status.HTTP_201_CREATED)
async def secure_upload(request: Request, file: UploadFile = File(...)):
    """
    Hardened upload endpoint with strict MIME validation, size limits, and UUID renaming.
    """
    # 1. Enforce Content-Length Limit (DoS Prevention)
    content_length = request.headers.get("content-length")
    if not content_length:
        raise HTTPException(
            status_code=status.HTTP_411_LENGTH_REQUIRED,
            detail="Content-Length header is missing."
        )
    
    if int(content_length) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {MAX_FILE_SIZE / (1024*1024)} MB."
        )

    # 2. Magic Number Validation (MIME Spoofing Prevention)
    # Read the first 2048 bytes to analyze the file signature
    header_bytes = await file.read(2048)
    await file.seek(0)  # Rewind the file pointer for streaming
    
    actual_mime_type = magic.from_buffer(header_bytes, mime=True)
    if actual_mime_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Invalid file type: {actual_mime_type}. Allowed types: {', '.join(ALLOWED_MIME_TYPES)}"
        )

    # 3. Secure UUID Renaming (Path Traversal Prevention)
    # Extract extension safely and generate a cryptographically secure filename
    file_extension = Path(file.filename).suffix.lower()
    if file_extension not in [".jpg", ".jpeg", ".png", ".pdf"]:
        file_extension = ".bin" # Fallback for safety

    secure_filename = f"{uuid.uuid4().hex}{file_extension}"
    secure_path = UPLOAD_DIR / secure_filename

    # 4. Stream to Disk (Memory Efficiency)
    try:
        async with aiofiles.open(secure_path, "wb") as out_file:
            while chunk := await file.read(1024 * 1024):  # 1MB chunks
                await out_file.write(chunk)
    except Exception as e:
        if secure_path.exists():
            secure_path.unlink()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while saving the file."
        )
    finally:
        await file.close()

    return {
        "status": "success",
        "stored_filename": secure_filename,
        "mime_type": actual_mime_type,
        "size_bytes": int(content_length)
    }
```

---

## 2. Production Dockerfile: Tesseract + FastAPI Isolation

Executing OCR operations on untrusted binary blobs directly on the host OS is a critical vulnerability. The application must be containerized to isolate the `libtesseract` dependencies and the Python runtime from the host environment [3]. 

This multi-stage Dockerfile utilizes a Debian-slim base image to minimize the attack surface while ensuring Tesseract binaries are natively available [4].

### Implementation: `Dockerfile`

```dockerfile
# ---------------------------------------------------------
# STAGE 1: Builder
# ---------------------------------------------------------
FROM python:3.10-slim-bookworm AS builder

# Set environment variables for non-interactive installs
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /build

# Install build dependencies (compilers required for python-magic and others)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies into a specific prefix for easy copying
COPY requirements.txt .
RUN pip install --prefix=/install --no-cache-dir -r requirements.txt

# ---------------------------------------------------------
# STAGE 2: Production Runtime
# ---------------------------------------------------------
FROM python:3.10-slim-bookworm

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

# Create a non-root user for security
RUN groupadd -r sovereign && useradd -r -g sovereign sovereign

WORKDIR /app

# Install runtime dependencies ONLY (Tesseract OCR and libmagic)
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-eng \
    libmagic1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy installed Python packages from builder
COPY --from=builder /install /usr/local

# Copy application code
COPY --chown=sovereign:sovereign ./app ./app
COPY --chown=sovereign:sovereign ./tools ./tools

# Ensure the vault directory exists and is owned by the non-root user
RUN mkdir -p /data/vault && chown -R sovereign:sovereign /data/vault

# Switch to non-root user
USER sovereign

# Health check to ensure API is responsive
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

EXPOSE 8000

# Execute FastAPI via Uvicorn (Gunicorn recommended for higher concurrency)
CMD ["uvicorn", "app.backend.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

---

## 3. Transaction-Safe SQLite Replication Script

The custom "Snapshot Engine" proposed in earlier iterations risks causing `database is locked` errors under concurrent load. The correct, institutional-grade approach utilizes the native SQLite Backup API via the `.backup` dot-command [5]. This creates a transactionally consistent snapshot without halting active readers or writers.

The following Bash script automates this process, incorporating `PRAGMA integrity_check` to ensure semantic validation before archiving [6].

### Implementation: `/usr/local/bin/sovereign-backup.sh`

```bash
#!/bin/bash
# ==============================================================================
# Prime Pathwy Sovereign OS - Transaction-Safe SQLite Backup Protocol
# Executes online backups using the SQLite Backup API and verifies integrity.
# ==============================================================================

set -euo pipefail

# Configuration
DATA_DIR="/data/vault/database"
BACKUP_DIR="/data/backups/sqlite"
LOG_FILE="/var/log/sovereign-backup.log"
DB_FILE="${DATA_DIR}/prime_pathwy.db"

# Retention Policy (Days)
DAILY_RETAIN=7

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [INFO] $*" | tee -a "$LOG_FILE"
}

error() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [ERROR] $*" | tee -a "$LOG_FILE" >&2
}

log "=== Initiating Sovereign Backup Protocol ==="

# 1. Generate timestamped backup filename
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/prime_pathwy_${TIMESTAMP}.db"

# 2. Execute Transaction-Safe Online Backup
# The .backup command utilizes the SQLite Backup API for a consistent snapshot
log "Executing online backup to ${BACKUP_FILE}..."
if ! sqlite3 "$DB_FILE" ".backup '$BACKUP_FILE'"; then
    error "SQLite backup command failed."
    exit 1
fi

# 3. Semantic Integrity Validation
# Crucial defense against ransomware: Ensure the backup is a valid, readable database
log "Running PRAGMA integrity_check on snapshot..."
INTEGRITY_RESULT=$(sqlite3 "$BACKUP_FILE" "PRAGMA integrity_check;")

if [ "$INTEGRITY_RESULT" = "ok" ]; then
    log "Integrity check passed. Compressing snapshot..."
    gzip "$BACKUP_FILE"
    log "Backup successful: ${BACKUP_FILE}.gz"
else
    error "Integrity check failed! Output: $INTEGRITY_RESULT"
    error "Removing corrupted snapshot..."
    rm -f "$BACKUP_FILE"
    exit 1
fi

# 4. Enforce Retention Policy
log "Pruning backups older than ${DAILY_RETAIN} days..."
find "$BACKUP_DIR" -name "prime_pathwy_*.db.gz" -type f -mtime "+${DAILY_RETAIN}" -delete -print | \
    while read -r file; do
        log "Deleted expired backup: $file"
    done

log "=== Sovereign Backup Protocol Completed ==="
```

### Automation Setup (Cron)

To automate the execution of this protocol nightly at 02:00 AM, configure the system crontab:

```bash
# Make the script executable
chmod +x /usr/local/bin/sovereign-backup.sh

# Add to crontab (execute as root or the user owning the database)
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/sovereign-backup.sh") | crontab -
```

---

## References

[1] D. Muraya, "How to Handle File Uploads in FastAPI," *davidmuraya.com*, Oct. 2025. [Online]. Available: https://davidmuraya.com/blog/fastapi-file-uploads/  
[2] S. Ulili, "Uploading Files Using FastAPI: A Complete Guide to Secure File Handling," *betterstack.com*, Jul. 2025. [Online]. Available: https://betterstack.com/community/guides/scaling-python/uploading-files-using-fastapi/  
[3] C. Mukherjee, "From Image to Text in Seconds — Tesseract OCR in a Docker Container," *dev.to*, Aug. 2025. [Online]. Available: https://dev.to/moni121189/from-image-to-text-in-seconds-tesseract-ocr-in-a-docker-container-1ohi  
[4] FastLaunchAPI Team, "FastAPI Docker Deployment: Production Guide with Multi-Stage Builds," *fastlaunchapi.dev*, Jan. 2026. [Online]. Available: https://fastlaunchapi.dev/blog/fastapi-docker-deployment-guide  
[5] Stack Overflow Contributors, "BASH: SQLite3 .backup command," *stackoverflow.com*, Apr. 2014. [Online]. Available: https://stackoverflow.com/questions/23164445/bash-sqlite3-backup-command  
[6] N. Dhandala, "How to Back Up SQLite Databases on Ubuntu," *oneuptime.com*, Mar. 2026. [Online]. Available: https://oneuptime.com/blog/post/2026-03-02-how-to-back-up-sqlite-databases-on-ubuntu/view  
