# SYS_OS v3.6 — Workflow Audit (Phase 3)

Each workflow executed live on v3.5.0 this audit. Persistence/reload proven on
the Client workflow as the representative DataStore round-trip (all registry
domains share the same persistence + audit mechanism); vault/session reload
proven directly in v3.5 phase work. Test data created during this audit was
removed; baseline restored (clients 3, vault 3 docs, integrity 88/0).

| Workflow | Start state | Operator actions | Result | Persistence | Reload | Audit |
|---|---|---|---|---|---|---|
| **Client** | 3 clients | create client | record created (`CLT-…`) | persisted to `sysos.reg.clients` | **survived reload (proven)** | `clients/create` captured (verified) |
| **Project** | 8 projects | create project | record created (`PRJ-…`) | persisted (shared store) | inherits store mechanism | store-wrap audit |
| **Proposal** | 2 proposals | create proposal | created; forecast recomputes | persisted | shared store | store-wrap audit |
| **Contract** | 1 contract | create contract | created; monitoring recomputes | persisted | shared store | store-wrap audit |
| **Vault** | 3 docs | ingest document | doc sealed, chain valid | persisted to `sysos.vault.v1` | proven in H1/H4 | `document.created` (H1 bridge) |
| **Evidence** | 0 evidence | attach evidence | sealed into chain, chain valid | persisted | proven | `document.evidence_attached` |
| **OCR** | no provider | bind stub + upload + process | job → STORED, doc ingested | persisted | proven | `document.ocr_stored` |
| **Session** | ADMIN default | login → restore → logout | role round-trips; cleared on logout | `sysos.session.v1` written/cleared | **proven in Phase 2** | `login`/`logout`/`system.auth` |
| **RBAC** | ADMIN | drop to READ_ONLY, attempt writes | client write + evidence **denied** | n/a (no mutation) | n/a | `permission_denied` / `document.evidence_denied` |
| **Audit** | n+ events | query + report | grows; query + reportText work | `sysos.audit.v1` append-only | survives reload | self (append-only) |

## Measured results (this audit)
```
session:  persisted=true, restoredRole=ADMINISTRATOR, clearedOnLogout=true
client:   created=true, dashboardWorks=true, workspaceWorks=true
project:  created=true
proposal: created=true, forecastWorks=true
contract: created=true, monitoringWorks=true
vault:    ingested=true, chainValid=true
evidence: attached=true, inChain=true
ocr:      jobStatus=STORED, stored=true
rbac:     writeDenied=true, evidenceDenied=true
audit:    grew=true, queryWorks=true, reportWorks=true
reload:   survivedReload=true, auditCapturedCreate=true, baseline restored (3 clients), integrity 88/0
```

## Observations
- All 10 workflows execute end-to-end. Persistence + reload + audit-capture
  proven directly for Client and (in v3.5) Vault/Session; the remaining registry
  domains use the identical DataStore write path (shared mechanism → generalizes).
- **OCR is the only workflow that cannot complete without external input** (a
  provider); the stub path proves the framework, not a shipped capability.
- RBAC correctly blocks unauthorized writes with structured denials + audit.
- No workflow produced a broken/silent-failure state during the audit.
