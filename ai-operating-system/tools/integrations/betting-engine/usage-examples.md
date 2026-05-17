# ISE Betting Console — Usage Examples
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Example 1 — Session Health Check

**Scenario:** Beginning a session that involves betting analysis. Verify console is live.

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3132/
```

**Expected:** `200`

If not 200:
```bash
cd C:/Users/arthu/GeminiEcosystem/tools/betting_engine
npx serve public -p 3132
```

---

## Example 2 — No-Lose Ladder Parlay Construction

**Scenario:** XERO XERO sportsbook-analyst completes 4-scan NFL analysis. Parlay is ready to build.

**Sequence:**
1. Open `http://localhost:3132/` in browser — dashboard live
2. Load XERO XERO analysis output (3 games, Tier 1/2/3 assigned per confidence)
3. Build parlay ladder:
   - Tier 1 (≥90%): Leg 1 — highest confidence pick
   - Tier 2 (≥85%): Leg 2 — second pick
   - Tier 3 (≥80%): Leg 3 — anchor pick
4. Log final parlay to `bet_history.json`

**Pass Criteria:** 3-leg parlay documented in bet_history.json with game, pick, confidence, and stake recorded.

---

## Example 3 — Bet History Audit

**Scenario:** End of NFL week. Review canonical bet record for accuracy.

```bash
# Confirm Canonical record not overwritten
diff C:/Users/arthu/GeminiEcosystem/tools/betting_engine/Canonical_Bet_History.json \
     C:/Users/arthu/GeminiEcosystem/tools/betting_engine/bet_history.json
```

**Pass Criteria:** All settled bets logged. Canonical_Bet_History.json updated only after Architect review and confirmation. No session bets missing from working bet_history.json.

---

## Anti-Patterns

- **DO NOT** overwrite `Canonical_Bet_History.json` without explicit Architect confirmation — it is the permanent record
- **DO NOT** run parlay construction without XERO XERO 4-scan complete — no analysis = no bet
- **DO NOT** skip health check at session start — assume port 3132 is down until HTTP 200 confirmed
- **DO NOT** build a 4th parlay leg — No-Lose Ladder is 3-tier maximum by protocol
