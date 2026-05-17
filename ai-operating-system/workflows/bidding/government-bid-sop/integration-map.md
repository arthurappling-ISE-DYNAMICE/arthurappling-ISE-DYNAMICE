# Sovereign Subcontracting Engine SOP — Integration Map
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Upstream Dependencies

| Source | What It Provides |
|--------|-----------------|
| `core/system-principles.md` | Identity constants, DSCR gate, Institutional Grade standard |
| `agents/marketing-engine/source.md` | `/bid scout`, `/bid analyze`, `/bid draft` command execution |
| `agents/identity/ARTHUR_MASTER_BIO.md` | EIN, DUNS, address — rendered in Credential Plate |
| SAM.gov | Solicitation database — primary source for all federal bids |
| Perplexity | Solicitation search execution (Steps 3) |
| Manus | Deep solicitation analysis (Step 4 Manus Core Command) |
| `Prime_Pathwy_Turnover_System/` legal pages | Digital presence verification (Step 1) |

---

## Downstream Consumers

| Consumer | What It Receives |
|----------|-----------------|
| `logs/bid_scout_YYYY-MM-DD.md` | Solicitation scan results, eligibility decisions |
| `logs/bid_submissions.md` | Confirmed submission records with solicitation number + confirmation |
| `workflows/bidding/grant-acquisition-sop/` | Parallel capital acquisition track — both feed the same Credential Plate |
| Federal contracting agencies | Submitted bid packages (Capability Statement + NEPQ Proposal) |

---

## Workflow Position

```
Sovereign Intelligence Agent (market signals, regulatory updates)
        ↓
government-bid-sop — Step 1 (Legal Verification)
        ↓
government-bid-sop — Step 2 (Credential Verification)
        ↓
Bid Architect /bid scout → Perplexity → solicitation URLs
        ↓
Bid Architect /bid analyze → Manus → Eligibility Matrix
        ↓
  GREEN? ──Yes──→ Bid Architect /bid draft → Bid Package
         ──No───→ Log + Stop
        ↓
5-Point Pre-Submission Checklist → SAM.gov Submission → logs/bid_submissions.md
```

---

## Active Integrations

| System | Integration Type | Status |
|--------|-----------------|--------|
| Bid Architect agent | Prompt-based — `/bid` commands | Active |
| SAM.gov | Manual portal submission | Active |
| Perplexity | Manual — paste scouting prompts | Active |
| Manus | Manual — paste Core Command | Active |
| `logs/` directory | Manual file log after each cycle | Active |

---

## Technical Key Trigger

No slash command for the SOP itself. The SOP sequences the Bid Architect agent commands:

```
Step 3: /bid scout
Step 4: /bid analyze [links]
Step 6: /bid draft [solicitation_number]
```

Full SOP activation: open `source.md` and execute Steps 1–8 in order.

---

## Redundancy Flags

None. This SOP and the Bid Architect agent are complementary, not redundant. The SOP is the sequence; the agent is the output generator.
