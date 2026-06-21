# SYS_OS v3.5.0 — Release Report

**Codename:** SESSION_BOUND_RBAC_VAULT_HARDENING
**Date:** 2026-06-20 · **Previous:** v3.4.0 (INCREMENTAL_HEALTH)
**Branch:** clean-vault-deployment

## 1. Executive summary
v3.5.0 is an **additive** security + scalability release. It binds RBAC to a
persisted session, extends table pagination to the Registry Grid (and proves
proposals/contracts already covered), and completes a five-step Vault hardening
track that closes risks **R1–R5** from `VAULT_RISK_REVIEW_v3.5.md`. No new
product features, no redesign, no destructive migration, no schema change, no
persistence-format change. Every phase was measured and verified individually;
full regression is green at seal.

## 2. Files modified (9, all under tools/command_deck/)
| File | Phases |
|---|---|
| `assets/js/config.js` | version metadata (3.4.0→3.5.0) |
| `index.html` | version badge |
| `assets/js/auth.js` | H3, H5 (permissions: vault.reset, vault.attachEvidence, vault.ocrProvider) |
| `assets/js/auth_ui.js` | Phase 2 (session persistence), Phase 3 (lock/unlock) |
| `assets/js/bootcheck.js` | manifest: authUI.restore/lock/unlock, vault.hashMode/restoreStatus |
| `assets/js/executive.js` | H2/H4 (system-health vault chain band) |
| `assets/js/main.js` | H2 (hash-mode startup event), H4 (restore-audit flush) |
| `assets/js/ocr.js` | H5 (respect RBAC denial in registerProvider) |
| `assets/js/registry.js` | Phase 4 (Registry Grid pagination) |
| `assets/js/vault.js` | H1–H5 (audit bridge, hashMode, guarded reset, quarantine, RBAC) |
| `docs/VERSION_HISTORY.md` | v3.5.0 entry |
| `docs/v3.0/TABLE_RENDERING_REVIEW_v3.4.md` | Phase 5 addendum |

## 3. Files created (docs + archive)
- `docs/v3.0/BASELINE_REPORT_v3.5_PRE.md`
- `docs/v3.0/PAGINATION_CLOSURE_v3.5.md`
- `docs/v3.0/VAULT_ARCHITECTURE_MAP_v3.5.md`
- `docs/v3.0/VAULT_RISK_REVIEW_v3.5.md`
- `docs/v3.0/VAULT_HARDENING_PLAN_v3.5.md`
- `docs/v3.0/RELEASE_REPORT_v3.5.md` (this file)
- `index_v3.5.0.html` + `archives/v3.5.0/` snapshot

## 4. Phase-by-phase summary
- **Phase 2 — Session persistence:** persist `{operator,role,since}` via the
  storage adapter; `restore()` on boot. ADMINISTRATOR boot default retained
  (default-deny flip deferred by directive). Verified round-trip + logout clear.
- **Phase 3 — Lock/Unlock:** memory-only LOCK→READ_ONLY (remembers operator),
  UNLOCK restores; not persisted across reload (documented). Verified.
- **Phase 4 — Registry Grid pagination:** filter/sort full dataset → 25-row page
  → PREV/NEXT + count footer. Verified 308 records → 25 DOM rows; O(page).
- **Phase 5 — Proposal/Contract closure:** measured proof both render via the
  single Registry Grid `renderTable` (already paginated). No code added.
- **Phase 6 H1 — Audit bridge:** vault writes record `document.*` central audit
  events (was 0). Chain preserved. Verified ingest/evidence/ocr_stored/reset.
- **Phase 6 H2 — Hash-mode visibility:** `hashMode()`; weak FNV-1a surfaces
  WARNING/YELLOW + boot warn + startup audit event. `verifyChain` unchanged.
- **Phase 6 H3 — Reset protection:** admin + confirmation token + verified
  recovery snapshot before deletion; aborts if snapshot fails; full audit.
- **Phase 6 H4 — Corrupt-restore quarantine:** distinct reasons; quarantine raw
  before reseed; abort-on-quarantine-failure; `restoreStatus()` + WARNING.
- **Phase 6 H5 — Vault RBAC completion:** `attachEvidence` + `registerOCRProvider`
  gated with structured denials + audit; recovery/OCR-completion ungated by design.

## 5. Security improvements
- RBAC bound to a persisted, restorable session (Phase 2).
- Lock/unlock operator control (Phase 3).
- New permissions: `vault.reset` (admin), `vault.attachEvidence`
  (admin/manager/operator), `vault.ocrProvider` (admin/manager).
- Every previously-unguarded Vault mutation path now enforces RBAC (H5).

## 6. Vault hardening improvements (R1–R5 closed)
| Risk | Description | Closed by | Status |
|---|---|---|---|
| R1 | Vault writes absent from central audit | H1 | **CLOSED** |
| R2 | Hash downgrade off secure context shown HEALTHY | H2 | **CLOSED** |
| R3 | Evidence/provider writes ungated | H5 | **CLOSED** |
| R4 | Destructive reset: no RBAC/confirm/backup | H3 | **CLOSED** |
| R5 | Corrupt restore silently discards data | H4 | **CLOSED** |

## 7. Performance / table improvements
- Registry Grid render is now O(page): 308 records → 25 DOM rows (Phase 4).
- Proposals/contracts inherit the same bounded rendering (Phase 5, no code).
- No change to boot performance or lazy rendering (0 dynamic stations at boot).

## 8. Session / RBAC improvements
- Persisted session restores authenticated identity on reload (Phase 2).
- Lock/unlock without losing the session (Phase 3).
- RBAC matrix extended additively; no existing rule weakened.

## 9. Audit improvements
- Central audit now records document activity: `document.created`,
  `document.evidence_attached`, `document.ocr_stored`, plus reset
  (requested/denied/snapshot_created/completed/failed), restore
  (quarantined/reseeded/failed), hash-mode, and RBAC denials.
- Vault's internal tamper-evident hash chain preserved unchanged alongside.

## 10. Regression results (measured at seal)
smoke **18/18** · drills **6/6** · maintenance **10/10** · integrity **88/0** ·
boot gate **36/0** · vault chain **valid** · demo isolation **intact** · SQLite
swap **intact** · session persistence **works** · lock/unlock **works** ·
registry pagination **works** · H1–H5 **all verified**. No console errors at boot.

## 11. Remaining technical debt
- Vault persistence is still a monolithic single-key blob (full snapshot per
  write) — the H7 candidate. Low exposure today (3 documents).
- Vault stores references (path + hash + links), not file bytes (by design).
- Restore-from-snapshot/quarantine is a readable artifact but not a one-click
  restore function (out of H3/H4 scope).

## 12. Deferred items
- **H7 — Normalized vault persistence:** explicitly deferred until document
  count climbs; not warranted at current scale.
- Default-deny boot flip: deferred by directive (ADMINISTRATOR default retained);
  session-persistence groundwork makes it a low-risk future change.

## 13. Deployment readiness assessment
- **Verified locally** on the static preview (localhost, secure context →
  SHA-256). All regression anchors green; boots clean as v3.5.0.
- **Deployment caveat (from H2):** serve over **https or localhost** — a
  non-secure origin downgrades the chain to FNV-1a (now surfaced as WARNING, not
  silently HEALTHY).
- No claim is made beyond this verified local evidence. Production deployment,
  server-side backup, and external load are **not** validated by this release.

## 14. Rollback plan
- All changes additive and confined to `tools/command_deck/`. Revert with
  `git checkout -- tools/command_deck/assets/js/{config,auth,auth_ui,bootcheck,executive,main,ocr,registry,vault}.js tools/command_deck/index.html`
  and remove the v3.5 docs/archive.
- No schema, persistence-format, or chain-structure change → pre-v3.5 storage
  keys restore unchanged. `restore()` (demo/sqlite) untouched.
- v3.4.0 archive remains byte-identical; the prior release is restorable.

## 15. Next recommended version
**v3.6 — VAULT_PERSISTENCE_NORMALIZATION (H7)** when vault document volume grows,
or a focused **default-deny session** release building on Phase 2. Neither is
required now.

---
**Seal status:** H1–H5 **sealed**; R1–R5 **closed**; H7 **deferred**. No
deployment claim beyond verified local evidence.
