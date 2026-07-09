# SYS_OS v3.6 — Operator Knowledge Gaps (Phase 5)

Premise: **Arthur operates SYS_OS unassisted today.** Per station: *Can Arthur
successfully use this today?* — **YES** / **PARTIAL** / **NO**, with the specific
documentation/training/workflow/explanation gaps. Evidence: station inventory +
button/workflow audits + absence of operator-facing how-to docs (the existing
docs are architecture/release notes, not operator runbooks).

| Station | Usable today? | Primary gap |
|---|---|---|
| 01 Architect Core | **YES** | self-evident HUD; minor: what "INTEGRITY AUDIT" checks |
| 02 CEO Console | **PARTIAL** | must know it is a **demo/scripted** surface, not live execution |
| 03 COO Console | **PARTIAL** | same — scripted protocol output |
| 04 Knowledge Vault | **PARTIAL** | ingest works, but no doc on classification rules, OCR-provider absence, or that it stores **references not files** |
| 05 Legacy Shield | **PARTIAL** | OPTIMIZE button is cosmetic — needs to be labeled/understood as display-only |
| 06 Registry Grid | **PARTIAL** | full CRUD is **projects-only**; other domains view-only via UI (created by API) — not documented |
| 07 Live Ops | **PARTIAL** | telemetry/ops usable; OCR upload silently parks (no provider) — needs explanation |
| 08 Client Center | **YES** | core commercial workflow is discoverable |
| 09 Executive Dashboard | **YES** | reports + demo toggle clear |
| 10 Operator Workspace | **YES** | read-only, self-explanatory |
| 11 Activity Timeline | **YES** | read-only feed |
| 12 System Health | **YES** | bands are self-describing |
| 13 Access Control | **PARTIAL** | login/lock/unlock usable, but no doc on: ADMINISTRATOR is the default (no password), what each role can do, how to add evidence/OCR permissions |

## Missing documentation
- **Operator runbook / quick-start** (there is none — only architecture + release
  docs). How to: add a client→proposal→contract; ingest a document; read a report.
- **RBAC guide:** the 4 roles, the permission matrix, what LOCK/UNLOCK does, and
  that there is no passphrase yet (ADMINISTRATOR is the boot default).
- **Vault explainer:** classification taxonomy, hash-mode meaning (HEALTHY vs
  WARNING/FALLBACK), that documents are path+hash references not stored files,
  and that reset requires `{confirm:'RESET_VAULT'}` + admin.
- **OCR status note:** no provider ships; uploads park at AWAITING_PROVIDER.
- **"What is real vs demo" map:** CEO/COO consoles and Shield OPTIMIZE are
  presentation surfaces.

## Missing training
- How to interpret System Health YELLOW/RED and the vault WARNING state.
- How to recover: reading a recovery snapshot / quarantine key if a reset or
  corrupt-restore occurs (artifacts exist; no restore-from-snapshot UI).
- Console-only operations (reset, audit export) — these are not in the UI.

## Missing workflows (operator-facing)
- Guided **client onboarding** flow (currently separate +CLIENT/+PROPOSAL/+CONTRACT).
- A documented **document-intake** SOP tying Vault + OCR + evidence.
- A **backup/export** SOP (audit export + vault exportState are API-only).

## Missing explanations
- Why some registry domains are view-only.
- What the architect metrics (DSCR 7.42×, $130K, pipeline) are bound to.
- That persistence is local to this browser (no cloud/multi-device sync).

## Verdict
Arthur can operate the **commercial core** (Client Center, Registry projects,
Dashboard, Vault ingest, Access) **today** with light guidance. The blockers to
unassisted confidence are **documentation, not engineering**: a runbook, an RBAC
guide, a vault explainer, and a real-vs-demo map.
