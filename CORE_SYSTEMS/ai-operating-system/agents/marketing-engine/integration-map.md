# Bid Architect — Sovereign Subcontracting Engine — Integration Map
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Upstream Dependencies

| Source | What It Provides |
|--------|-----------------|
| `core/system-principles.md` | Identity constants, DSCR gate, Zero-Hype filter |
| `agents/identity/ARTHUR_MASTER_BIO.md` | EIN, DUNS, address, entity name — rendered in Credential Plate |
| `agents/researcher/` | Intelligence briefings that flag new contracting opportunities or NAICS-relevant regulatory changes |
| Perplexity / web search | Live SAM.gov solicitation data for `/bid scout` |
| SAM.gov | Source of all solicitation records |
| Manus | Advanced solicitation analysis via Manus Core Command |

---

## Downstream Consumers

| Consumer | What It Receives |
|----------|-----------------|
| `workflows/bidding/government_bid_SOP.md` | Completed bid packages feed into the SOP submission workflow |
| `logs/bid_scout_YYYY-MM-DD.md` | Solicitation scan results (manual log) |
| `logs/bid_draft_[bid_id]_YYYY-MM-DD.md` | Completed bid packages before submission |
| Federal contracting agencies | Final submitted bid packages |

---

## Workflow Position

```
Sovereign Intelligence Agent (market signals)
        ↓
Bid Architect — /bid scout (SAM.gov solicitation scan)
        ↓
Bid Architect — /bid analyze (Qualification Matrix + Set-Aside flag)
        ↓
  FAST-TRACK ELIGIBLE? ──Yes──→ Bid Architect — /bid draft (complete package)
                       ──No───→ Log disqualification. Stop.
        ↓
workflows/bidding/government_bid_SOP.md (submission workflow)
```

---

## Active Integrations

| System | Integration Type | Status |
|--------|-----------------|--------|
| Perplexity | Prompt-based — paste prompts manually | Active |
| Manus | Prompt-based — paste Manus Core Command manually | Active |
| SAM.gov | Manual lookup via Perplexity prompts | Active |
| `logs/` directory | Manual file log after each session | Active |

---

## Technical Key Trigger

**Slash commands:**
```
/bid scout                         ← Weekly solicitation scan
/bid analyze [URL or text]         ← Qualification gate
/bid draft [solicitation_number]   ← Full bid package generation
```

All three commands require `source.md` loaded as context. All three produce Credential Plate as first output.

---

## Redundancy Flags

None. The Bid Architect is the only government contracting agent in the system. No overlap with any other current agent.
