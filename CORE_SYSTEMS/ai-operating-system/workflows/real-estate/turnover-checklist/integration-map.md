# Turnover Inspection Checklist — Integration Map
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Upstream Dependencies

| Source | What It Provides |
|--------|-----------------|
| `core/system-principles.md` | Institutional Grade standard, no verbal agreements rule |
| `core/execution-protocol.md` | Pass/Fail criteria format for each checkpoint |
| Signed scope of work | Defines which of the 10 points are in scope for the job |
| Client vault folder structure | Storage destination for all job documentation |

---

## Downstream Consumers

| Consumer | What It Receives |
|----------|-----------------|
| `vault/[CLIENT]/reports/` | Completed signed checklist — permanent job record |
| `vault/[CLIENT]/photos/` | Before and after photo sets — dispute defense archive |
| `vault/[CLIENT]/receipts/` | Disposal receipts — billing evidence |
| Prime Pathwy billing / invoicing | Job closure trigger — invoice issued after Point 10 PASS |
| Government grant applications | Before/after documentation serves as proof of work quality for grant narrative |

---

## Workflow Position

```
Signed Scope of Work (pre-job)
        ↓
Turnover Inspection Checklist — Points 1–10
        ↓
OVERALL VERDICT: PASS? ──Yes──→ Job Closed → Invoice Issued
                        ──No───→ Punch List Open → Return Visit Scheduled
        ↓
Documentation archived to vault/[CLIENT]/
```

---

## Active Integrations

| System | Integration Type | Status |
|--------|-----------------|--------|
| Vault (Google Drive or equivalent) | Manual photo and document upload | Active |
| Prime Pathwy invoicing | Manual trigger — invoice issued after Point 10 PASS | Active |
| Grant application packages | Manual reference — photos and checklist cited as proof of work | Active |

---

## Technical Key Trigger

No slash command. Activated by opening `source.md` at job start and completing the Job Header block before any crew action.

**Field activation:**
```
Open: workflows/real-estate/turnover-checklist/source.md
Complete Job Header → execute Points 1–10 in sequence → obtain sign-off → archive to vault
```

---

## Redundancy Flags

None. This is the only turnover inspection workflow in the system.
