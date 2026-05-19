# workflows/bidding/ — Government Contract & Grant Acquisition SOPs
**Architect:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Purpose

Full-cycle SOPs for government subcontracting and grant acquisition under AA Capital Inc. / Prime Pathwy. Covers federal and state contract pursuit (NAICS 561720, 562111) and grant acquisition across California State, federal SBA, USPS logistics, and DOT programs.

---

## Workflows

| Folder | Asset | Classification | Status |
|--------|-------|---------------|--------|
| [government-bid-sop/](government-bid-sop/) | Sovereign Subcontracting Engine SOP (8 steps) | Foundational | Wave 2 — Complete |
| [grant-acquisition-sop/](grant-acquisition-sop/) | Sovereign Grant Acquisition Engine SOP (8 steps) | Supporting | Wave 2 — Complete |

---

## Agent Dependency

Both workflows integrate directly with the Bid Architect agent:
- `/bid scout` → feeds Step 3 (Perplexity Research) in government-bid-sop
- `/bid analyze` → feeds Step 4 (Manus Core Command)
- `/bid draft` → feeds Step 6 (Document Generation)

Load `agents/marketing-engine/source.md` before running either workflow.

---

## Priority Rule

Set-Aside contracts (Small Business, 8(a), WOSB, HUBZone, Minority-Owned) are FAST-TRACK.
Open Competition contracts are LOW PRIORITY until all set-aside contracts are worked.
This rule is non-negotiable across both SOPs.
