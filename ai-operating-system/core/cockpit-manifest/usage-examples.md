# COCKPIT MANIFEST — Usage Examples
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Example 1 — Session Context Load

**Scenario:** Beginning a new session. Need to orient quickly on ecosystem state.

```
1. Load: core/cockpit-manifest/source.md
2. Review: ACTIVE OPERATIONS table — confirm which revenue engines are live
3. Review: 1.5-YEAR AUTOMATION GOAL STATUS BOARD — confirm current milestone status
4. Cross-reference: run Recursive Integrity Audit PASS 1–5 to confirm current live state
5. Begin session work with full ecosystem context active
```

**Note:** Manifest is from 2026-04-18. Always verify live system state before assuming manifest data is current.

---

## Example 2 — Locating a System

**Scenario:** Need to find where the ISE Betting Console source code lives.

```
Load: core/cockpit-manifest/source.md
Navigate to: ACTIVE OPERATIONS → ISE_Betting_Console
File table shows:
  - server.cjs — server
  - public/index.html — dashboard UI
  - data/betting_log.json — live bet log
  - register_startup.ps1 — auto-start

Cross-reference: tools/integrations/betting-engine/source.md for live path confirmation
```

---

## Example 3 — Identifying Ground Truth Gaps

**Scenario:** Capital deployment decision requires knowing if vault/finances/capital_AA/ has content.

```
Load: core/cockpit-manifest/source.md → GROUND TRUTH GAPS table
Gap listed: "vault/finances/capital_AA/ appears empty — MEDIUM priority"
Gap date: 2026-04-18

Action: Do NOT assume gap still exists — run: ls vault/finances/capital_AA/
If still empty: confirm with Architect before capital deployment decision
If now has content: gap closed; proceed with live data
```

---

## Anti-Patterns

- **DO NOT** act on manifest file paths or ports without live verification — the manifest is a 2026-04-18 snapshot
- **DO NOT** use the manifest as a substitute for the Recursive Integrity Audit
- **DO NOT** update the manifest in place — generate a new dated version when ecosystem state changes significantly
- **DO NOT** treat Ground Truth Gaps as current open items without checking live filesystem first
