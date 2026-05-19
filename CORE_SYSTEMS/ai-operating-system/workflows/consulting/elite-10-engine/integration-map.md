# Elite 10 Engine — Sovereign Bid Acquisition System — Integration Map
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Upstream Dependencies

| Source | What It Provides |
|--------|-----------------|
| `core/system-principles.md` | DSCR gate, Institutional Grade standard |
| `workflows/consulting/elite-10-framework/` | Phase 2 Speed-to-Lead methodology context |
| `agents/marketing-engine/` (Bid Architect) | `/bid scout`, `/bid analyze`, `/bid draft` for SAM.gov federal pipeline |
| SAM.gov | Federal SB set-aside solicitations (Monday/Thursday cadence) |
| Cal eProcure | State SB/DVBE option contracts (post-SB cert) |
| Solano County / City of Vallejo Purchasing | Local micro-purchase notifications |
| GSA Advantage | Federal micro-purchase vendor list |

---

## Downstream Consumers

| Consumer | What It Receives |
|----------|-----------------|
| `workflows/bidding/government-bid-sop/` | Qualified solicitations forwarded for full submission cycle |
| Bid Pipeline Tracker (source.md) | Updated status per source after each monitoring cycle |
| Future bid tracking dashboard | TypeScript/Python schemas — `BidRecord`, `BidRepository` interfaces |
| Client Speed-to-Lead installs | This engine is the template deployed inside client's business (Phase 2 Engine 1) |

---

## Workflow Position

```
elite-10-framework/ Phase 2 — Engine 1 (Speed-to-Lead) selected
        ↓
Elite 10 Engine — 6-source pipeline activated
        ↓
Week 1: Local micro-purchases (Vallejo + Solano County)
Week 2: State (Cal eProcure) + Federal (SAM.gov via Bid Architect)
Week 3+: First informal bid submitted
Post-SB cert: Cal eProcure SB/DVBE Option tier unlocks
        ↓
Qualified solicitations → government-bid-sop/ → submission
```

---

## Active Integrations

| System | Integration Type | Status |
|--------|-----------------|--------|
| SAM.gov (federal) | Via Bid Architect `/bid scout` | Active |
| Cal eProcure | Manual portal monitoring | Active (SB/DVBE tier: pending cert) |
| City of Vallejo Purchasing | Phone + portal | Active (vendor list registration required) |
| Solano County Purchasing | Phone + portal | Active (bid notification registration required) |
| GSA Advantage | Vendor profile | Registration required |
| `/Scout` skill | Automated private sector lead scraping | Eligible for activation (post-SBDC) |

---

## Technical Key Trigger

No slash command. Activated as part of client Speed-to-Lead engine install (Phase 2 of elite-10-framework/).

**Standalone activation:**
```
Load: workflows/consulting/elite-10-engine/source.md
Execute: Execution Sequence — Weeks 1–3 in order
Update: Bid Pipeline Tracker status after each cycle
```

---

## Redundancy Flags

**Overlaps with `workflows/bidding/government-bid-sop/`** on federal SAM.gov pipeline. The ENGINE defines sourcing strategy; the SOP defines submission process. Both required for complete bid cycle — not redundant, complementary.
