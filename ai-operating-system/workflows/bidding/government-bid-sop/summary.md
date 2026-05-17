# Sovereign Subcontracting Engine SOP — Summary
**Classification:** Foundational
**Category:** Workflow / SOP
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy
**Last Updated:** 2026-05-17

---

## Purpose

8-step Standard Operating Procedure for the full government subcontracting cycle — from SAM.gov solicitation scouting to compliant bid submission. Enables Arthur F. Appling Sr. to scout, qualify, and submit bids for federal and state contracts in NAICS 561720 (Janitorial) and 562111 (Hauling) with zero manual research redundancy.

---

## Practical Use Cases

- Weekly SAM.gov solicitation scout cycle (Monday + Thursday cadence)
- Pre-submission eligibility gate — prevents wasted bid prep on disqualified contracts
- Government bid package generation: Capability Statement + NEPQ Proposal
- Post-submission tracking and confirmation logging
- Set-aside prioritization — Fast-Track (set-aside) vs. Low Priority (open competition)

---

## Key Outputs

- Perplexity scouting prompts (3 per cycle) — paste-ready, date-stamped
- Eligibility Matrix result — GREEN / LOW PRIORITY / RED per solicitation
- Bid package: Capability Statement + NEPQ Proposal Draft
- Submission log entry: `logs/bid_submissions.md` with solicitation number, confirmation, and date
- 5-Point Pre-Submission Checklist — gate before any submission

---

## Dependencies

- SAM.gov registration active: EIN 84-4788578, DUNS 12-3035654, NAICS 561720 + 562111
- Perplexity access (Steps 3)
- Manus access (Step 4 — Manus Core Command)
- Bid Architect agent: `agents/marketing-engine/source.md` loaded for `/bid scout`, `/bid analyze`, `/bid draft`
- Legal pages live: `privacy.html`, `terms.html`, `accessibility.html` (Step 1 verification checklist)

---

## DSCR Gate

**Estimated Output/Input Ratio:** High — each Fast-Track eligible contract at ≤$100K ceiling.

A single awarded contract at $50K against near-zero SOP execution cost exceeds 7.42x by an order of magnitude. The Eligibility Matrix prevents wasted prep time on disqualified contracts, protecting the ratio by preserving time resources for viable bids.
