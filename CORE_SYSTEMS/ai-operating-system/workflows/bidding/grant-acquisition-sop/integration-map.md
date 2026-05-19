# Sovereign Grant Acquisition Engine SOP — Integration Map
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Upstream Dependencies

| Source | What It Provides |
|--------|-----------------|
| `core/system-principles.md` | Identity constants, DSCR gate, Institutional Grade standard |
| `agents/identity/ARTHUR_MASTER_BIO.md` | EIN, DUNS, entity name — Credential Plate and all document headers |
| `Prime_Pathwy_Turnover_System/` legal pages | Digital Presence Compliance Package (Step 3 — required for grant applications) |
| Perplexity | Grant scouting prompts execution (Step 5) |
| grants.ca.gov / Grants.gov / SBA.gov | Grant program databases |
| USPS eSourcing portal / SAM.gov | USPS RPDC logistics solicitations |

---

## Downstream Consumers

| Consumer | What It Receives |
|----------|-----------------|
| `logs/grant_scout_YYYY-MM-DD.md` | Scouting results and eligibility decisions |
| `logs/grant_submissions.md` | Confirmed submission records with follow-up dates |
| `memory/market-intelligence/` | Dated grant intelligence reports (e.g., `2026-04-25-grant-scan.md`) |
| Grant administering agencies | 5-Document Application Packages |
| AA Capital Inc. capital position | Non-dilutive grant awards strengthen DSCR anchor |

---

## Workflow Position

```
Identity & Registration Verification (Ground Truth Gate)
        ↓
Digital Presence Compliance Package verified (legal pages)
        ↓
Community Sovereignty Narrative prepared
        ↓
Perplexity Grant Scout (CA State + Federal + USPS)
        ↓
Eligibility Matrix: GREEN / YELLOW / RED
        ↓
  GREEN? ──Yes──→ 5-Document Application Package
         ──No───→ YELLOW: queue for later | RED: disqualify
        ↓
7-Point Pre-Submission Checklist → Portal Submission → logs/grant_submissions.md
```

---

## Active Integrations

| System | Integration Type | Status |
|--------|-----------------|--------|
| grants.ca.gov | Manual portal submission | Active |
| Grants.gov | Manual portal submission | Active |
| SBA.gov | Manual portal submission | Active |
| USPS eSourcing | Manual portal + PS Form 5436 mailing list | Active (form pending) |
| `logs/` directory | Manual file log after each submission | Active |
| `memory/market-intelligence/` | Manual file copy for dated intelligence reports | Active |

---

## Technical Key Trigger

No slash command. Activated by opening `source.md` and executing Steps 1–8 in order.

**USPS-specific activation:**
```
PS Form 5436 → filed with USPS Transportation Contracts
Target: San Francisco CA RPDC, 2501 Rydin Rd., Richmond CA 94850
Adds Prime Pathwy to automatic HCR and RPDC solicitation notifications
```

---

## Redundancy Flags

No redundancy with government-bid-sop. Both SOPs share the same Credential Plate and identity constants but target distinct funding mechanisms. They are parallel tracks, not duplicates. Running both maximizes total capital acquisition surface.
