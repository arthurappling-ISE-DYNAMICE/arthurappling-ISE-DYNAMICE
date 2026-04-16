# Reno Input Portal — Design Spec
**Date:** 2026-04-16  
**Project:** ISE_Betting_Console  
**Port:** 3132  
**Status:** Approved

---

## Overview

A manual data-entry portal added to the existing AA Betting Board dashboard. Allows the Architect to enter William Hill ticket IDs, exact payouts, and Win/Loss outcomes per tier (4-Leg, 6-Leg, 8-Leg) for any NFL week (1–18). All writes are dual-target: the live console log and the vault master record.

---

## Architecture

**Files modified (no new files):**
- `ISE_Betting_Console/public/index.html` — slide-in drawer UI + client logic
- `ISE_Betting_Console/server.cjs` — new `/api/sync` POST endpoint + dual-write on all mutations

**Data targets (both written on every mutation):**
1. `ISE_Betting_Console/data/betting_log.json` — live console source of truth
2. `vault/engine/betting_algorithm/betting_log.json` — vault master record

**Failure policy:** Vault write failure is logged to console but non-blocking. Console write always completes first.

---

## UI — Slide-In Drawer

### Trigger
- Gold `[⬡ RENO]` badge button added to the nav bar (right side, before the status pill).
- Clicking toggles the drawer open/closed.
- Drawer state does not affect polling or chart rendering.

### Drawer Layout
```
┌─────────────────────────────────────┐
│ RENO INPUT PORTAL          [✕ CLOSE]│
│ WEEK [ selector 1–18 ]              │
├─────────────────────────────────────┤
│ 4-LEG · Foundation Lock             │
│  Ticket ID: [__________________]    │
│  Payout $:  [__________]            │
│  Stake:      $100 (locked)          │
│  Result:    [HIT]  [MISS]           │
├─────────────────────────────────────┤
│ 6-LEG · Extension Tier              │
│  Ticket ID: [__________________]    │
│  Payout $:  [__________]            │
│  Stake:      $100 (locked)          │
│  Result:    [HIT]  [MISS]           │
├─────────────────────────────────────┤
│ 8-LEG · Risk Tier                   │
│  Ticket ID: [__________________]    │
│  Payout $:  [__________]            │
│  Stake:      $100 (locked)          │
│  Result:    [HIT]  [MISS]           │
├─────────────────────────────────────┤
│ [ ⬡ RENO COMMITMENT — EXECUTE ]     │
└─────────────────────────────────────┘
```

### Field Specifications
| Field | Type | Notes |
|-------|------|-------|
| Week Selector | `<select>` 1–18 | Defaults to last week in log + 1 |
| Ticket ID | `<input type="text">` | Min-width for `004014-0188-0612-0035`; `maxlength=40` |
| Payout $ | `<input type="number">` | Min 0, step 1, dollar amount from physical ticket |
| Stake | Static display | Always `$100` — not editable |
| Result toggles | Two `<button>` elements | `HIT` (gold) / `MISS` (red); disabled until after Commitment |

---

## Validation

**On RENO COMMITMENT click:**
- If any Ticket ID field is empty → soft inline warning below that field: `"Ticket ID required for Audit Integrity."` Block submission until all three are filled.
- If all Ticket IDs present → proceed with commit.

---

## RENO COMMITMENT Button

**Action sequence:**
1. Client-side validates all three Ticket ID fields are non-empty.
2. POST `/api/sync` with payload:
Three entries posted, one per tier, each matching existing schema:
```json
{ "week": 3, "date": "2026-04-16", "type": "4-Leg", "status": "Active",
  "unit": 100, "payout": 0, "net_profit": 0, "ticketId": "004014-...",
  "ticketPayout": 1000, "ss_avg": 0, "wri_avg": 0, "teams": [] }
{ "week": 3, "date": "2026-04-16", "type": "6-Leg", ... "ticketPayout": 5000 }
{ "week": 3, "date": "2026-04-16", "type": "8-Leg", ... "ticketPayout": 18500 }
```
3. Server appends **3 separate log entries** to both JSON files — one per tier (4-Leg, 6-Leg, 8-Leg) — matching the existing schema where each entry has a `type` field. If entries for this week+type already exist, they are updated in-place rather than duplicated.
4. Server responds 201.
5. Client closes drawer, re-fetches `/api/log`, board re-renders.
6. Nav status pill changes from `DRAFT` → `ACTIVE`.
7. Empire Curve deducts $300 (3 × $100 stakes) immediately.

---

## HIT / MISS Toggles

**Enabled state:** After RENO COMMITMENT has been executed for the selected week.

**On HIT:**
- Updates the tier's `result` field to `"Hit"`.
- Empire Curve spikes by the **exact payout amount** entered for that tier.
- PUT `/api/log/:index` → server updates both JSON files.

**On MISS:**
- Updates the tier's `result` field to `"Miss"`.
- No payout added to curve.
- PUT `/api/log/:index` → server updates both JSON files.

**Cascade Fail Rule:**
- If any of T1–T4 (Foundation tier / 4-Leg) is marked MISS:
  - 6-Leg and 8-Leg tier blocks visually darken (opacity 0.35).
  - Both show a red `LADDER COLLAPSED` banner inside their blocks.
  - Their HIT/MISS toggles are disabled and greyed out.
  - Their result is auto-set to `"Miss"` in both JSON files.

---

## Server — New `/api/sync` Endpoint

```
POST /api/sync
Body: { week, date, status, unit, tiers }
```

**Behavior:**
1. `readLog()` from console path.
2. Find existing entry for `week`; if found, merge ticket data. If not found, push new entry.
3. `writeLog()` to `ISE_Betting_Console/data/betting_log.json`.
4. `writeLog()` to `vault/engine/betting_algorithm/betting_log.json` (non-blocking — catch errors, log, continue).
5. Respond 201 `{ ok: true }`.

**Updated PUT `/api/log/:index`:**
- After writing to console path, also mirror full log to vault path.

---

## Dual-Write Helper

Server extracts a `mirrorToVault(data)` function:
- Resolves vault path relative to project root: `../vault/engine/betting_algorithm/betting_log.json`
- Wraps in try/catch; on failure: `console.error('[VAULT MIRROR FAILED]', err.message)` and continues.

---

## Verification Test

After implementation, the server startup sequence includes a one-time verification:
1. Write a test record to both paths.
2. Read both back.
3. Compare with `JSON.stringify`.
4. Log `[VAULT SYNC ✓] Both targets identical` or `[VAULT SYNC ✗] MISMATCH DETECTED`.

---

## Port & Stability

- Port: **3132** — unchanged.
- No dependency changes; pure vanilla JS + Node.js built-ins only.
- Polling interval: 30s — unchanged.

---

## Out of Scope

- No team-slot editing via this portal (existing board handles that).
- No delete functionality (append/update only).
- No authentication.
