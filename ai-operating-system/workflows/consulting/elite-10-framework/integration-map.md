# Elite 10 Consulting Framework — Integration Map
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Upstream Dependencies

| Source | What It Provides |
|--------|-----------------|
| `core/system-principles.md` | DSCR gate, Institutional Grade standard, Zero-Hype filter |
| `agents/identity/ARTHUR_MASTER_BIO.md` | Entity identity, LinkedIn summary, pitch deck one-liner |
| `agents/marketing-engine/` (Bid Architect) | Speed-to-Lead engine: `/bid scout`, `/bid analyze`, `/bid draft` for client installs |
| `agents/researcher/` | Market intelligence for client vertical assessment |
| NEPQ diagnostic script (`workflows/consulting/`) | Phase 1 intake conversation structure |

---

## Downstream Consumers

| Consumer | What It Receives |
|----------|-----------------|
| `workflows/consulting/elite-10-engine/` | Speed-to-Lead bid pipeline specifics for Phase 2 Engine 1 installs |
| `workflows/consulting/master-pathwy/` | 15-step delivery sequence that executes the framework |
| `workflows/bidding/government-bid-sop/` | Government bid submission workflow deployed for clients in Speed-to-Lead engine |
| Client GitHub repository (`/Scaffold`) | Operational infrastructure created per client engagement |
| Master Execution Ledger | Client engagement tracking (open → active → complete) |

---

## Workflow Position

```
Client Intake (NEPQ Diagnostic — Phase 1)
        ↓
Bottleneck Identified → Engine Selected
        ↓
3-Engine Install (Phase 2) — using master-pathwy/ for delivery sequence
        ↓
Middleman Bridge (Phase 3) — SB cert + subcontractor roster
        ↓
$5,000 Close (Phase 4) → Deposit Collected → /Scaffold [CLIENT_NAME]
        ↓
12-18 Month Sovereign System Delivery (master-pathwy/ Steps 1–15)
```

---

## Active Integrations

| System | Integration Type | Status |
|--------|-----------------|--------|
| Bid Architect agent | Speed-to-Lead engine core | Active |
| `/Scaffold` skill | Client folder + manifest creation | Active (skill must be deployed) |
| `/Prime` skill | Project Audit Log initialization | Active (skill must be deployed) |
| Master Execution Ledger | Manual bid/engagement tracking | Active |
| Cal eProcure SB/DVBE filter | Middleman Bridge activation | Pending SB cert |

---

## Technical Key Trigger

No slash command for the framework itself. Activated by loading `source.md` as context before any client engagement session.

**Phase-specific triggers:**
```
Phase 1: NEPQ diagnostic session (live conversation)
Phase 2: /Scaffold [CLIENT_NAME] → /Prime → engine-specific installs
Phase 3: SB cert verification → Cal eProcure activation → subcontractor roster
Phase 4: One-question close → deposit → engagement begins
```

---

## Redundancy Flags

**Relationship with `elite-10-engine/`:** The ENGINE is not redundant — it is the operational specification for one component (Speed-to-Lead) of Phase 2. Load both when working a Speed-to-Lead install: FRAMEWORK for methodology, ENGINE for pipeline specifics.

**Relationship with `master-pathwy/`:** The MASTER PATHWY is the delivery sequence for the full 15-step engagement. Load both for any active client engagement: FRAMEWORK for phase logic, MASTER PATHWY for step-by-step execution.
