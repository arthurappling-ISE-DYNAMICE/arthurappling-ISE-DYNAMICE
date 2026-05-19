# Sovereign Subcontracting Engine SOP — Usage Examples
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Example 1 — Standard Weekly Bid Cycle

**Cadence:** Monday and Thursday

**Sequence:**
1. Verify SAM.gov registration active (Ground Truth Gate)
2. Run `/bid scout` → paste 3 Perplexity prompts → collect solicitation URLs
3. Log scout results: `logs/bid_scout_YYYY-MM-DD.md`
4. Run `/bid analyze [URLs]` for each solicitation → apply Eligibility Matrix
5. GREEN results only → run `/bid draft [solicitation_number]`
6. Complete PAST PERFORMANCE manually → run 5-Point Pre-Submission Checklist
7. Submit to SAM.gov → screenshot confirmation → log in `logs/bid_submissions.md`

**Target output per cycle:** 2+ bid submissions per month.

---

## Example 2 — Set-Aside Fast-Track

**Scenario:** Perplexity returns a solicitation — NAICS 561720, California, contract value $45,000, Small Business set-aside confirmed.

**Decision:**
```
NAICS match: 561720 ✓
Contract value: $45,000 ≤ $100,000 ✓
Set-Aside: Small Business ✓
→ FAST-TRACK ELIGIBLE — proceed immediately to /bid draft
```

**Command:**
```
/bid draft [solicitation number from SAM.gov]
```

**Expected output:** Credential Plate + Capability Statement + NEPQ Proposal Draft (Sections 1–5 complete).

---

## Example 3 — Open Competition Deprioritization

**Scenario:** Solicitation returned — NAICS 561720, California, $30,000, Open Competition (no set-aside).

**Decision:**
```
Set-Aside: Open Competition
→ LOW PRIORITY — do not invest bid prep time
→ Log to bid_scout file with status: LOW PRIORITY
→ Return to Fast-Track queue
```

No bid package generated. Time preserved for set-aside contracts.

---

## Anti-Patterns

- **DO NOT** submit a bid without running the 5-Point Pre-Submission Checklist — missing EIN/DUNS mismatch causes rejection
- **DO NOT** leave PAST PERFORMANCE blank in any bid package — this is a disqualifying gap in most evaluations
- **DO NOT** pursue Open Competition contracts before working all Fast-Track set-aside contracts
- **DO NOT** submit without a confirmation record — every submission must be logged with a confirmation number or screenshot
- **DO NOT** use approximate dates in Perplexity prompts — insert exact current date every time
