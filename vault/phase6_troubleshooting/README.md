# PHASE 6 — MASTER TROUBLESHOOTING, FAILURE ANALYSIS, & RECOVERY VAULT
## SOVEREIGN INCIDENT RESPONSE PLAYBOOK
### Version: 1.0.0 | Authority: Arthur F. Appling Sr.

---

## 1. INFRASTRUCTURE & SERVER FAILURES

System downtime directly impacts revenue and operational integrity. Incident response must be systematic, logical, and fully documented.

### Incident Severity Levels

| Severity | Definition | Target Response Time | Action Owner |
|---|---|---|---|
| **SEV-1 (Critical)** | Core system down; client operations halted. | < 15 Minutes | Lead Systems Architect |
| **SEV-2 (High)** | Major system degraded; workarounds active. | < 1 Hour | Systems Engineer |
| **SEV-3 (Medium)** | Minor system failure; no direct client impact. | < 4 Hours | Technical Support |
| **SEV-4 (Low)** | Informational / Cosmetic issue. | < 24 Hours | Junior Developer |

### Linux Server Boot Failure Diagnostics

```
                     [ SERVER BOOT FAILURE DETECTED ]
                                    │
                                    ▼
                         [ ACCESS OUT-OF-BAND ]
                        (IPMI, iDRAC, or Proxmox)
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼ (GRUB Menu OK)           ▼ (Kernel Panic)           ▼ (No Power)
  [ BOOT SINGLE-USER ]       [ BOOT RESCUE MEDIA ]      [ VERIFY POWER/PDU ]
  - Edit GRUB options        - Mount root filesystem    - Cycle PDU outlet
  - Add 'init=/bin/bash'     - Run chroot /mnt          - Check physical cords
```

---

## 2. DATABASE CORRUPTION & RECOVERY

Database corruption can lead to catastrophic data loss if recovery steps are not executed with precision.

### PostgreSQL Corruption Diagnostic Workflow

If PostgreSQL logs indicate disk I/O errors or index corruption:

1. **Immediately Stop Database Writes:**
   ```bash
   sudo systemctl stop postgresql
   ```
2. **Perform a Physical Block-Level Backup:**
   ```bash
   sudo tar -cvpzf /mnt/storage/backups/pg_corrupt_backup.tar.gz /var/lib/postgresql/
   ```
3. **Run PostgreSQL Check Utilities:**
   Restart PostgreSQL in single-user mode and execute verification:
   ```bash
   postgres --single -D /var/lib/postgresql/14/main/ template1
   # Inside single-user prompt:
   VACUUM ANALYZE;
   ```
4. **Rebuild Corrupted Indexes:**
   If specific indexes are corrupted, drop and recreate them:
   ```sql
   REINDEX DATABASE prime_pathwy_prod;
   ```

---

## 3. DOCKER & CONTAINERIZATION TROUBLESHOOTING

Containerized applications can fail due to resource exhaustion, network misconfigurations, or permission issues.

### Common Docker Failure Patterns

| Symptom | Root Cause | Diagnostics Command | Resolution Action |
|---|---|---|---|
| **Container loops (CrashLoopBackOff)** | Missing environment variables or bad entrypoint. | `docker logs <container_id>` | Verify `.env` file matches container expectations. |
| **Out of Memory (OOM) Kill** | Container exceeded allocated RAM limits. | `docker inspect <container_id> | grep OustKilled` | Increase memory limit in `docker-compose.yml`. |
| **Network Unreachable** | Custom bridge network driver collision. | `docker network inspect <network_name>` | Prune unused networks and recreate bridge. |
| **Disk Space Exhausted** | Unused layers and dangling volumes. | `docker system df` | Run `docker system prune -a --volumes -f`. |

---

## 4. API & INTEGRATION FAILURE ANALYSIS

API integrations are highly vulnerable to external changes, rate limits, and network latency.

### API Failure Diagnosis Checklist

- [ ] **Verify Authentication State:** Ensure API keys or OAuth tokens have not expired.
- [ ] **Inspect HTTP Status Codes:**
  - `401 Unauthorized` / `403 Forbidden`: Check credentials and scopes.
  - `429 Too Many Requests`: Implement exponential backoff and rate limiting.
  - `502 Bad Gateway` / `503 Service Unavailable`: Target server is down; route traffic to fallback provider.
- [ ] **Analyze Payload Schema:** Verify the outgoing payload matches the target API's expected JSON structure exactly.
- [ ] **Measure Latency:** If API response time exceeds 5 seconds, implement asynchronous processing queues (e.g., Celery or Redis).

---

## 5. SOVEREIGN INCIDENT POST-MORTEM TEMPLATE

Every SEV-1 or SEV-2 incident requires a formal post-mortem to analyze root causes and implement permanent prevention systems.

```markdown
# INCIDENT POST-MORTEM
**Incident ID:** INC-20260529-01
**Severity:** SEV-1 (Critical)
**Date:** 2026-05-29
**Lead Investigator:** Arthur F. Appling Sr.

## EXECUTIVE SUMMARY
On 2026-05-29 at 14:22 UTC, the primary PostgreSQL database instance suffered a write failure due to disk space exhaustion on the `/var` partition. This caused the API engine to return `500 Internal Server Errors` for all client invoice submissions. Full recovery was achieved at 14:45 UTC by pruning docker logs and expanding the logical volume. Total downtime was 23 minutes.

## TIMELINE OF EVENTS
- **14:22 UTC:** Automated monitoring alert triggers: `/var partition > 95% usage`.
- **14:25 UTC:** Database stops accepting writes. API returns 500 errors.
- **14:28 UTC:** Investigator logs in via SSH; diagnoses docker log file accumulation.
- **14:35 UTC:** Docker system pruned; log rotation limits enforced.
- **14:40 UTC:** PostgreSQL service restarted. Integrity check completed successfully.
- **14:45 UTC:** API health check returns `OPERATIONAL`. Incident resolved.

## ROOT CAUSE ANALYSIS (5 WHYS)
1. **Why did the API fail?** Because the database stopped accepting writes.
2. **Why did the database stop accepting writes?** Because the `/var` partition was 100% full.
3. **Why was the partition full?** Because Docker container logs grew to 45GB.
4. **Why did container logs grow unchecked?** Because no log-rotation limits were defined in `docker-compose.yml`.
5. **Why were limits not defined?** Lack of standardized deployment templates for containerized services.

## PREVENTATIVE ACTIONS
- [ ] Enforce log-rotation limits in all future `docker-compose.yml` templates.
- [ ] Implement automated weekly pruning cron jobs on all production servers.
- [ ] Set up Zabbix alerts to trigger at 80% disk space usage (previously 95%).
```

---

*Prime Pathwy Sovereign Incident Response Playbook — Confidential Institutional Asset*
