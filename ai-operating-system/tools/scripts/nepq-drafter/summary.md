# NEPQ Drafter — Summary
**Classification:** Supporting
**Category:** Tools / Scripts / Outreach
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy
**Last Updated:** 2026-05-17

---

## Purpose

Node.js NEPQ outreach template engine. Loads the 4-point NEPQ framework (Connection → Problem → Solution → Commitment) as a structured JavaScript object and outputs a ready-to-draft outreach sequence. Currently configured for Solano County property turnover leads. Consumed downstream by Browser Scout Protocol to auto-draft outreach from scored lead data.

---

## Practical Use Cases

- Lead outreach drafting: load a prospect from top_leads.md, customize template fields, produce NEPQ-structured message
- NEPQ training: shows the 4-stage framework structure for any new outreach target vertical
- Browser Scout integration: scout.js pipes top lead data into nepq_drafter.js for automated draft generation
- Platform-agnostic: output can be sent via email, LinkedIn DM, or SMS — template is channel-neutral

---

## NEPQ Framework Structure

| Stage | Purpose | Current Template |
|-------|---------|-----------------|
| Connection | Context + credibility | "I noticed your recent turnover activity in Solano..." |
| Problem | Diagnostic question | "How are you currently handling the audit-trail for chargeback defense?" |
| Solution | Sovereign System offer | "We install the Sovereign System that handles the documentation for you." |
| Commitment | Low-friction close | "Does it make sense to see how this fits your current workflow?" |

---

## DSCR Gate

**Input:** ~15 minutes to customize template per target vertical
**Output:** NEPQ-structured outreach for each scored lead — each converted lead = $5,000+ consulting engagement
**Estimated Output/Input Ratio:** Single close per batch = 20x+ on draft time investment
