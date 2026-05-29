# PHASE 1 — GLOBAL TECHNICAL INFRASTRUCTURE & SYSTEMS ENGINEERING VAULT
## SOVEREIGN SYSTEMS ARCHITECTURE MANUAL
### Version: 1.0.0 | Authority: Arthur F. Appling Sr.

---

## 1. LINUX & WINDOWS ENTERPRISE ADMINISTRATION

Enterprise systems architecture requires rigorous operating system configurations to prevent single points of failure, maintain compliance, and support high-throughput automation pipelines.

### Linux Administration Hardening Matrix

| Component | Standard Configuration | Security / Operational Objective | Verification Command |
|---|---|---|---|
| **Kernel Hardening** | `sysctl.conf` tuning | Disable IP forwarding, restrict core dumps, enable BPF JIT hardening. | `sysctl -a` |
| **User Access** | Sudoers lockdown | Restrict root login, enforce key-based SSH only, configure PAM limits. | `cat /etc/pam.d/common-auth` |
| **Filesystem Security** | `/tmp` and `/var` isolation | Mount `/tmp` with `noexec`, `nosuid`, and `nodev` options. | `mount | grep tmp` |
| **Process Monitoring** | Systemd service sandboxing | Run custom services as non-root users with `ProtectSystem=strict`. | `systemctl status` |

### Windows Enterprise Configuration Matrix

| Component | Policy Specification | Security / Operational Objective | Verification Command |
|---|---|---|---|
| **Active Directory** | Group Policy Objects (GPO) | Enforce LAPS (Local Administrator Password Solution), disable LLMNR/NBT-NS. | `gpresult /h gpreport.html` |
| **PowerShell Security** | ExecutionPolicy & Logging | Set `ExecutionPolicy AllSigned`, enable Script Block Logging (Event ID 4104). | `Get-ExecutionPolicy` |
| **Service Accounts** | Group Managed Service Accounts | Automate password rotation, scope privileges to minimum required. | `Get-ADServiceAccount` |

### SSH Hardening Protocol

Secure Shell (SSH) access must be hardened to prevent brute-force attacks and unauthorized intrusion.

- **Port Obfuscation:** Move SSH from the default port `22` to a non-standard port (e.g., `2222`).
- **Key-Based Authentication Only:** Explicitly disable password-based authentication.
- **Root Login Restriction:** Disable direct root login; users must log in via standard accounts and escalate privileges via `sudo`.

```ini
# /etc/ssh/sshd_config Hardening Directive
Port 2222
Protocol 2
PermitRootLogin no
MaxAuthTries 3
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
ChallengeResponseAuthentication no
UsePAM yes
X11Forwarding no
AllowAgentForwarding no
ClientAliveInterval 300
ClientAliveCountMax 2
```

---

## 2. NETWORKING, VLANS, & REVERSE PROXIES

Sovereign network architecture relies on absolute isolation, minimal attack surfaces, and strict traffic routing.

### Network Segmentation and VLAN Architecture

```
                                  [ INTERNET ]
                                       │
                                       ▼
                             [ HARDWARE FIREWALL ]
                                       │
                ┌──────────────────────┼──────────────────────┐
                ▼                      ▼                      ▼
           [ VLAN 10 ]            [ VLAN 20 ]            [ VLAN 30 ]
          Public/DMZ             Internal Apps           GPU/Compute
         (NGINX Proxy)         (Postgres, APIs)        (Local LLMs)
```

- **VLAN 10 (Public/DMZ):** Hosts NGINX reverse proxies and external-facing web portals. No direct database connections allowed.
- **VLAN 20 (Internal Applications):** Hosts application servers, SQLite/PostgreSQL instances, and task orchestrators.
- **VLAN 30 (GPU Compute / Local AI):** Air-gapped or strictly controlled subnet for local GPU nodes running LLM inference models.

### NGINX Reverse Proxy Configuration

The NGINX configuration must enforce TLS 1.3, strict security headers, and rate limiting to prevent denial of service (DoS) attacks.

```nginx
# /etc/nginx/nginx.conf - NGINX Reverse Proxy Standard
user nginx;
worker_processes auto;
pid /run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Rate Limiting Definition
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

    # SSL Configuration
    ssl_protocols TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    server {
        listen 443 ssl http2;
        server_name api.primepathwy.internal;

        ssl_certificate /etc/letsencrypt/live/primepathwy.internal/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/primepathwy.internal/privkey.pem;

        # Security Headers
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Content-Security-Policy "default-src 'self';" always;
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

        location / {
            limit_req zone=api_limit burst=20 nodelay;
            proxy_pass http://127.0.0.1:8000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

---

## 3. STORAGE ARCHITECTURE & FILE SYSTEM ORGANIZATION

Sovereign systems require organized, predictable storage hierarchies to prevent data loss and support auditability.

### Storage Hierarchy Standard

- **`/opt/prime-pathwy/`:** Master directory for all production applications, codebases, and configurations.
- **`/var/log/prime-pathwy/`:** Centralized log storage for all custom automation systems and operational logs.
- **`/mnt/storage/backups/`:** Dedicated, isolated backup mount point (RAID 10 or ZFS pool).
- **`/mnt/storage/data/`:** High-throughput storage mount for databases and AI training/inference data.

### ZFS Storage Pool Creation and Maintenance

For absolute data integrity, use ZFS with scheduled scrub jobs and snapshot schedules.

```bash
# Create a mirrored ZFS pool for database storage
zpool create -f db_pool mirror /dev/sdb /dev/sdc

# Enable compression and set mountpoint
zfs set compression=lz4 db_pool
zfs set mountpoint=/mnt/storage/data db_pool

# Create daily snapshot cron job
echo "0 1 * * * root zfs snapshot db_pool@daily-\$(date +\%F)" > /etc/cron.d/zfs-snapshots
```

---

## 4. SOFTWARE SYSTEMS & PYTHON SYSTEMS ENGINEERING

Python is the operational backbone of Prime Pathwy automation. All Python services must run asynchronously to maximize performance under resource constraints.

### Asynchronous API Template with FastAPI

This template provides structured logging, database pooling, and graceful error handling.

```python
# /opt/prime-pathwy/tools/TOOL_API_ENGINE_V1.py
import logging
import time
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn

# Configure Institutional Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler("/var/log/prime-pathwy/api_engine.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("PrimePathwyAPI")

app = FastAPI(title="Prime Pathwy Sovereign API Engine", version="1.0.0")

class SystemStatus(BaseModel):
    status: str
    timestamp: float
    load_average: list[float]

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    logger.info(f"Method: {request.method} Path: {request.url.path} Status: {response.status_code} Duration: {duration:.4f}s")
    return response

@app.get("/api/v1/health", response_model=SystemStatus)
async def health_check():
    try:
        import os
        load_avg = os.getloadavg()
        return SystemStatus(
            status="OPERATIONAL",
            timestamp=time.time(),
            load_average=list(load_avg)
        )
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal system health degradation")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception: {str(exc)} on path {request.url.path}")
    return JSONResponse(
        status_code=500,
        content={"error": "Sovereign API internal execution failure", "message": str(exc)}
    )

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, log_config=None)
```

---

## 5. DATABASE SYSTEMS: POSTGRESQL & SQLITE

Sovereign data storage uses a two-tier database architecture: SQLite for local, single-process, zero-configuration caching, and PostgreSQL for concurrent, relational, transactional workloads.

### PostgreSQL Schema Normalization Standard

All PostgreSQL tables must use `UUID` primary keys, track creation/update timestamps, and implement soft deletes.

```sql
-- PostgreSQL Institutional Schema Blueprint
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE prime_pathwy_clients (
    client_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) UNIQUE NOT NULL,
    contract_value NUMERIC(12, 2) NOT NULL CHECK (contract_value >= 0),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Trigger for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_timestamp
BEFORE UPDATE ON prime_pathwy_clients
FOR EACH ROW
EXECUTE FUNCTION update_timestamp_column();
```

---

## 6. DISASTER RECOVERY & TROUBLESHOOTING PLAYBOOK

Operational continuity requires structured recovery plans for infrastructure and database failures.

### Database Recovery Playbook

1. **Detection:** Database returns `500 Internal Server Error` or connection timeout.
2. **Diagnostics:** Check database process status and system logs.
   ```bash
   systemctl status postgresql
   tail -n 100 /var/log/postgresql/postgresql.log
   ```
3. **Mitigation (Process Restart):**
   ```bash
   sudo systemctl restart postgresql
   ```
4. **Recovery (Backup Restoration):** If database is corrupted, restore from the latest daily ZFS snapshot.
   ```bash
   # Stop PostgreSQL service
   sudo systemctl stop postgresql
   # Rollback database directory to latest snapshot
   sudo zfs rollback db_pool@daily-2026-05-28
   # Restart PostgreSQL service
   sudo systemctl start postgresql
   ```

---

## 7. ENTERPRISE CONTAINERIZATION (DOCKER) & CI/CD PIPELINES

Containerization ensures that development, staging, and production environments remain completely identical, eliminating "works on my machine" failure points.

### Docker Compose Production Blueprint

```yaml
# /opt/prime-pathwy/docker-compose.prod.yml
version: '3.8'

services:
  api_engine:
    image: primepathwy/api_engine:latest
    container_name: api_engine_prod
    restart: always
    environment:
      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@db_prod:5432/prime_pathwy_prod
      - LOCAL_LLM_URL=http://ollama:11434
    ports:
      - "8000:8000"
    volumes:
      - /var/log/prime-pathwy:/var/log/prime-pathwy
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    depends_on:
      - db_prod

  db_prod:
    image: postgres:14-alpine
    container_name: postgres_prod
    restart: always
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=prime_pathwy_prod
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  db_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/storage/data
```

### GitHub Actions CI/CD Pipeline Specification

To automate deployment and maintain institutional code standards, all pushes to the `main` branch must pass automated syntax checking, security audits, and Docker image builds.

```yaml
# .github/workflows/deploy.yml
name: Sovereign CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  audit-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-node: '3.11'

      - name: Install Dependencies
        run: |
          python -m pip install --upgrade pip
          pip install flake8 black pytest safety

      - name: Run Linter (Flake8)
        run: flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics

      - name: Run Code Formatter (Black)
        run: black --check .

      - name: Run Security Audit (Safety)
        run: safety check

  build-and-deploy:
    needs: audit-and-test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Sovereign Server via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ubuntu
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: 2222
          script: |
            cd /opt/prime-pathwy
            git pull origin main
            docker-compose -f docker-compose.prod.yml up -d --build
```

---

*Prime Pathwy Sovereign Systems Architecture Manual — Confidential Institutional Asset*
