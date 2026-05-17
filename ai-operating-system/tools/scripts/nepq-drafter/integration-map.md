# NEPQ Drafter — Integration Map
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Upstream Dependencies

| Source | What It Provides |
|--------|-----------------|
| `workflows/research/browser-scout-protocol/` | Scored lead data (top_leads.md) — manual input to template customization |
| `agents/marketing-engine/` | Bid Architect — NEPQ is the outreach framework for consulting pipeline leads |
| Node.js v22+ | Runtime for source.js execution |
| Target prospect data | Connection context and problem frame — must be manually inserted before run |

---

## Downstream Consumers

| Consumer | What It Receives |
|----------|-----------------|
| Architect (Arthur F. Appling Sr.) | NEPQ-structured outreach draft — 4-stage message ready to send |
| `workflows/consulting/elite-10-framework/` | Upstream qualification gate — NEPQ drafter feeds prospects into Phase 1 diagnosis |
| Email / LinkedIn DM / SMS | Final outreach channel (channel-neutral output) |

---

## Workflow Position

```
Browser Scout Protocol — top_leads.md scored prospects
        ↓
Manual: select top prospect, customize NEPQ template fields
        ↓
NEPQ Drafter (source.js) — 4-stage outreach structure generated
        ↓
Outreach sent → prospect responds
        ↓
Elite 10 Framework Phase 1 — NEPQ diagnostic continues
        ↓
Elite 10 Framework Phase 4 — Close → Master Pathwy SOP → engagement begins
```

---

## Active Integrations

| System | Integration Type | Status |
|--------|-----------------|--------|
| `workflows/research/browser-scout-protocol/` | Lead data consumer | Manual (no automated pipe yet) |
| `agents/marketing-engine/` | NEPQ framework alignment | Active — Bid Architect uses same 4-stage structure |
| `workflows/consulting/elite-10-framework/` | Outreach-to-diagnosis pipeline | Active — NEPQ is Phase 1 entry |

---

## Technical Key Trigger

No slash command. Manual execution after prospect selection and template customization.

**Activation sequence:**
```
1. Review top_leads.md — select target prospect
2. Edit source.js: update connection, problem for target's industry/geography
3. cd C:/Users/arthu/GeminiEcosystem/tools
4. node nepq_drafter.js
5. Copy output → send via email or direct message
6. Log outreach date and prospect name in working notes
```

---

## Redundancy Flags

**Potential overlap with Bid Architect NEPQ outputs.** The marketing-engine agent also uses NEPQ framing for government bid outreach. The drafter script is for private sector consulting lead outreach. These operate in parallel — no conflict, but outputs should be kept in separate prospect logs to avoid confusion.
