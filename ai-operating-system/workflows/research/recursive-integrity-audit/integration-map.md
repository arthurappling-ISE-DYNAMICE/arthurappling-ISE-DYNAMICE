# Recursive Integrity Audit — Integration Map
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Upstream Dependencies

| Source | What It Provides |
|--------|-----------------|
| `core/system-principles.md` | Hardcoded constants to verify against (DSCR 7.42x, EIN 84-4788578, SBDC date) |
| `agents/identity/ARTHUR_MASTER_BIO.md` | Canonical identity file — PASS 3 check target |
| `agents/researcher/source.md` | Research agent — PASS 3 constants check |
| `agents/sportsbook-analyst/source.md` | Betting quant — PASS 3 constants check |
| `tools/betting_engine/` | Betting Console — PASS 2 live services check (port 3132) |
| `.github/workflows/sovereign_audit.yml` | Nightly audit workflow — PASS 4 check target |
| `vault/` | Canonical PDF assets — PASS 5 check targets |

---

## Downstream Consumers

| Consumer | What It Receives |
|----------|-----------------|
| All active sessions | Confirmed operational state before task execution |
| `memory/lessons-learned.md` | Any FAIL entries logged for institutional retention |
| Architect (Arthur F. Appling Sr.) | Status table with PASS/FAIL per check — immediate escalation on any FAIL |

---

## Workflow Position

```
Session start / Ground Truth Audit trigger / Post-deployment event
        ↓
Recursive Integrity Audit — 5-pass sequence
        ↓
PASS 1: Silo Integrity → PASS 2: Live Services → PASS 3: Agent Constants
        ↓
PASS 4: Workflow Integrity → PASS 5: Vault Assets
        ↓
All PASS: Resume operational work
Any FAIL: Stop, alert Architect, resolve before proceeding
```

---

## Active Integrations

| System | Integration Type | Status |
|--------|-----------------|--------|
| `core/ARTHUR_MASTER_BIO.md` | PASS 3 read target | Active (path updated 2026-05-17) |
| `tools/betting_engine/` (port 3132) | PASS 2 HTTP health check | Active |
| `.github/workflows/sovereign_audit.yml` | PASS 4 file presence check | Active |
| `vault/` PDFs | PASS 5 file presence check | Active |

---

## Technical Key Trigger

No slash command. Manually initiated. Mandatory at session start and after any structural change to agents/, tools/, workflows/, or vault/.

**Activation sequence:**
```
1. Load: workflows/research/recursive-integrity-audit/source.md
2. Execute PASS 1 → confirm all expected silos present
3. Execute PASS 2 → confirm port 3132 HTTP 200
4. Execute PASS 3 → open `core/ARTHUR_MASTER_BIO.md` — confirm EIN 84-4788578 present
5. Execute PASS 4 → confirm sovereign_audit.yml present
6. Execute PASS 5 → confirm both vault PDFs present
7. Produce status table → all PASS before resuming any work
```

---

## Redundancy Flags

No redundancy. source.md PASS 3 path updated to `core/ARTHUR_MASTER_BIO.md` on 2026-05-17. All references consistent.
