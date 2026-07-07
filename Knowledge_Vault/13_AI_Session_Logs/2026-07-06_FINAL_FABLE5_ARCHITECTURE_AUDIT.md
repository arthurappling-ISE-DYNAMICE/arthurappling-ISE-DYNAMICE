# 2026-07-06 — Final Fable 5 Architecture Audit / Commercial Readiness Review

**Mission:** SYS_OS v4.7.1 — deep architecture audit, commercial readiness review,
roadmap extraction. Read-only; this report is the sole artifact.
**Auditor:** Claude Fable 5, acting as senior architect / security reviewer /
deployment engineer / business-systems operator.
**HEAD at audit:** `56b3ed64` (delta from mission-expected `0ad30c31` = exactly the
two acknowledged Knowledge Vault commits, 57 files, zero code drift — mismatch
reported and resolved by evidence).
**No secrets in this document** (vault rule; identifiers masked).

---

## 1. Executive Summary

SYS_OS is an **honest machine**. Its defining engineering asset is not a feature —
it is the evidence discipline: a Production Guard that cannot be talked into
readiness, an RLS status that only a live machine test can set, a deploy artifact
that only an allowlist can populate, and a validator that has already caught real
mistakes (including two of its own author's). The Supabase backend layer is
genuinely verified end-to-end: live auth, persistence, and two-directional RLS
isolation, all machine-executed and integrity-gated.

The honest counterweight: **SYS_OS today is a single-operator command deck with a
verified per-user backend — not yet a multi-tenant product.** The frontend boots
Arthur's identity, Arthur's metrics, and Arthur's seed data for every visitor; the
storage model is a localStorage-first blob with manual push/pull sync; there is no
client onboarding path. None of this blocks the public *pilot* (which is exactly a
public demo of Arthur's own deck). All of it blocks *paying clients*.

**Verdict: GO for v4.7.1 Pages activation (demo posture). NOT READY for paying
clients — the gap is product-ization (seed/identity separation, onboarding,
support), not infrastructure.** The infrastructure work is done and proven.

## 2. Ground Truth (verified this session)

Branch `clean-vault-deployment` · HEAD `56b3ed64` · synced · nothing staged ·
CLAUDE.md + CURRENT_STATE + Knowledge_Vault (21 folders) tracked · deploy/public
tracked (51 files) · config.local.js ignored · 0 tracked `.env` · 0 secrets at
HEAD · GitHub Pages NOT_DEPLOYED. Runtime last boot-verified at the v4.7 close
(v4.6.0: smoke 18/18, drills 6/6, maintenance 10/10, integrity 88/0, gate 36/0,
vault valid, no console errors); the two commits since are docs-only, so that
evidence stands for this HEAD.

## 3. Architecture Map

```
OPERATOR (manual gates everywhere)
  │
  ├─ SOURCE: tools/command_deck/ ── index.html shell (strict <meta> CSP)
  │    boot: config.js → [config.local.js·ignored] → runtime_config.js →
  │          monitoring.js (parse-time capture) → 35 modules → bootcheck(36) → main
  │    ├─ runtime_config.js — single authority: config merge, key/URL validation,
  │    │    CSP-origin check, hosting state (consumed by all remote modules + guard)
  │    ├─ auth_remote.js — Supabase Auth boundary (validated client gate)
  │    ├─ remote_backend.js — per-user KV (RLS-scoped), explicit push/pull sync,
  │    │    backup-gated, confirmation phrases, pre-pull snapshot + rollback
  │    ├─ environment.js — profiles, Production Guard, RLS status model
  │    │    (TECHNICALLY_VERIFIED writable ONLY by runTechnicalRLSVerification();
  │    │     integrity gate: method+cleanup+projectRef+30-day freshness)
  │    ├─ backup.js — export/validate/restore (hash-verified, rollback,
  │    │    RLS-import sanitizer) · audit.js — append-only trail
  │    └─ storage.js — SYNCHRONOUS localStorage contract (remote swap deferred)
  │
  ├─ SERVER (Supabase, project xwgm***): Auth + Postgres + RLS policies
  │    (auth.uid()=user_id on every op) — stores opaque sysos.* blobs only;
  │    integrity/audit computed client-side by design
  │
  ├─ DEPLOY: scripts/build_public_deploy.js (allowlist-only; extracts URL+anon key
  │    ONLY into config.public.js; server keys abort) → deploy/public/ (51 files,
  │    committed v4.7) → scripts/validate_public_deploy.js (deterministic gate)
  │    → [NEXT: orphan gh-pages branch = artifact root → Pages]
  │
  └─ GOVERNANCE: CLAUDE.md (constitution) · docs/CURRENT_STATE.md (state anchor) ·
       VERSION_HISTORY + docs/v3.0 reports · Knowledge_Vault 00–20 (long memory)
```

Client-side only: everything except Supabase Auth/Postgres/RLS. Manual: all
deploys, all sync, all verification triggers, key/config provisioning.

## 4. What Is Solid (keep, don't touch)

1. **Evidence-gated readiness** — guard/RLS/hosting states are derived from
   measured reality; every false-PASS edge found this cycle was closed (attestation
   ceiling, import sanitizer, project-ref binding, hosting BLOCK-unless-hosted).
2. **The verified backend path** — live auth, persistence, two-directional RLS
   isolation with confirmed cleanup and an evidence-hashed, machine-local record.
3. **Deploy safety pipeline** — allowlist builder + validator with negative-test
   proof (planted credentials trip 6 rules); exactly one key-bearing file possible.
4. **Recovery depth** — v3.8 backup (hash-verified, rollback), pre-pull snapshots,
   24 versioned archives, idempotent schema, documented rollback at every layer.
5. **Governance portability** — constitution + state anchor + release history +
   operator checklists + this vault. A cold session can find its footing.
6. **Test anchors** — 18/6/10/88/36 held through ~15 consecutive builds without a
   single regression escape.

## 5. What Is Fragile

1. **Storage model** (`storage.js`) — synchronous localStorage contract; ~5MB
   browser ceiling; remote is *sync-on-command*, not live persistence
   (`register()` intentionally deferred). Whole-state overwrite push/pull = data-loss
   footgun with 2+ devices, mitigated only by gates and operator care.
2. **Single-operator content baked into the product** — identity, DSCR/capital
   metrics (index.html + config.js), business-flavored seeds (registry.js), NEPQ
   protocol copy. Fine for the pilot-as-demo; disqualifying for client deployments.
3. **Monitoring is session-local** — in-memory sink, no persistence, no external
   alerting; a hosted error is invisible unless the operator has the tab open.
4. **No unit-test harness** — validators/guards are proven by session evals and
   smoke anchors, not repo-run tests; a future refactor could silently regress the
   key/CSP validation matrix.
5. **Deploy build depends on the operator's machine** — config.public.js is
   generated from local config; repeatability relies on one laptop's state.
6. **index.local.html / local test wiring** — the local live-test surface is
   hand-rolled and now diverges from index.html across version bumps (badge only —
   assets load live — but drift is unmonitored).
7. **Historical Google API key in public git history** — the single standing
   security debt (rotation = operator action; purge = separate decision).

## 6. Public Pilot Blockers (before Pages goes live)

| # | Blocker | Status |
|---|---|---|
| 1 | 🔴 Rotate the historical Google key (public history!) | OPERATOR — urgent, pre-Pages |
| 2 | gh-pages activation mechanism (orphan branch) | Proposed, one small mission (v4.7.1) |
| 3 | Hosted verification incl. RLS rerun from hosted origin | Blocked on 2; method documented (§9) |
| 4 | Business-content final look at the rendered site | Signoff given; flags reserved — review the live page once up |

Nothing else blocks the pilot. The artifact is committed, validated, boot-proven.

## 7. Paid Client Blockers (the product-ization gap)

1. **Seed/identity separation** — a client must never boot Arthur's deck: neutral
   seeds (or empty-state onboarding), configurable identity/metrics, protocol copy
   removed or templated. This is the largest single work item.
2. **Client onboarding path** — account creation flow (dashboard-manual today),
   first-login experience, per-client config provisioning, training handoff.
3. **Support & operations** — persistent/hosted error visibility, a support
   process, per-client backup/restore policy, incident playbook.
4. **Multi-device story** — overwrite-sync must become safe (merge strategy or
   single-device policy stated in contract).
5. **Commercial scaffolding** — pricing, contract, data-handling terms (RLS is the
   technical basis; the promise needs paper), demo-vs-live data separation.
6. **Scale posture** — acceptable ≤10 pilot clients on current architecture with
   manual onboarding; beyond that see §10.

## 8. Security Findings

**Strengths:** DB-side RLS as the real authz boundary (verified, not assumed);
anon-key-only discipline enforced at 4 layers (validator shape-check, builder
abort, deploy validator, guard); strict CSP incl. scoped connect-src checking;
append-only audit; import sanitizer; machine-local technical-verification records;
zero secrets at HEAD (swept repeatedly).

**Gaps (severity · file · fix · blocks?):**
- 🔴 HIGH · git history (≤`32b3c71b`) · historical Google key on a PUBLIC repo ·
  rotate now, decide purge · **blocks pilot by policy** (was flagged pre-push).
- 🟠 MED · client-side trust ceiling · guard/RLS records are DevTools-forgeable
  locally (documented stance: footgun-protection, not tamper-proofing) · acceptable
  for pilot; for paying clients, server-side attestation could be a later hardening.
- 🟠 MED · monitoring.js · no persistence/alerting for hosted errors · pilot OK;
  fix before clients.
- 🟡 LOW · index.html CSP retains localhost connect-src entries in production
  artifact; telemetry probes localhost from hosted origin (nodes just read OFFLINE)
  · cosmetic; tidy in the next content build.
- 🟡 LOW · test users share the pilot project · rotate/remove before any client
  data enters the project.

Session-cleanup, key handling, and test-credential hygiene were exercised
repeatedly this cycle and held (burned credentials rotated; nothing in repo).

## 9. Deployment Findings

**Is the orphan gh-pages branch the best next step? Yes.** Rationale: Pages'
folder picker cannot target `deploy/public/`; publishing root is forbidden by F3;
an Action adds machinery and removes the manual gate the constitution favors. The
orphan branch is 4 commands, scriptable, reversible (delete branch/disable Pages),
and keeps every publish deliberate.

**What can go wrong + required safeguards before pushing gh-pages:**
1. Wrong content on the branch → the publish script must copy *only* validator-
   PASSED `deploy/public/` contents and must **run the validator itself** first.
2. Stale artifact → script rebuilds before validating (build → validate → branch).
3. Base-path 404s (`/<repo>/`) → relative asset paths already used; verify all-200
   post-deploy anyway.
4. Branch pollution over time → script always force-recreates the orphan from the
   current artifact (no incremental history to drift).

**Post-Pages verification (must all pass before any readiness claim):** HTTPS
padlock · assets 200 under base path · zero CSP violations · `CONFIGURED` ·
sign-in test1 · health PASS · **Technical RLS Verification rerun from the hosted
origin** — method: `config.public.js` (correctly) excludes TEST_USERS, so the
operator supplies them at runtime via DevTools console on the hosted page
(`window.__SYSOS_RUNTIME__.TEST_USERS = {...}` — read at call time, never stored),
runs the Station 15 button, then closes the tab · guard re-run: Hosting flips PASS
only via genuine `GITHUB_PAGES_VERIFIED`.

## 10. Scaling Findings (qualitative)

| Users | Assessment |
|---|---|
| 1 (now) | LOW risk everywhere — the system is built for exactly this. |
| 10 | MEDIUM operator burden (manual account creation, config provisioning, support by hand); DB/RLS LOW (per-user KV rows are tiny); Supabase free tier fine. |
| 100 | HIGH operator burden — manual onboarding breaks down; MEDIUM DB (fine technically); frontend fine (static); monitoring/support gap becomes acute; backup policy per client UNKNOWN; pricing tier likely paid. |
| 1,000 | Architecture boundary: localStorage-first + whole-blob sync is not a 1k-user product model; needs real server-state app (the `registerBackend` seam is the designed escape hatch). HIGH across ops/support/DB-shape. |
| 10,000 | Out of scope for this codebase by design — would be a rebuild on the same verified backend concepts. UNKNOWN/HIGH everywhere else. |

No numeric limits invented; Supabase plan limits not in repo → UNKNOWN, check at
client onboarding time.

## 11. Operator Experience Findings

**Top pain points observed this cycle (real, not theoretical):**
1. **Credential handoff** was the #1 time sink (multi-day). What finally worked:
   self-verifying Desktop tools that test values live before saving. Lesson banked:
   *never ask the operator to relay values through chat or blind-edit files; give
   a double-clickable tool with instant local PASS/FAIL.*
2. **Instruction-surface mismatch** — the operator reliably sees dialogs/questions;
   long chat prose gets missed. Put the action inside the gate itself.
3. **Multi-step browser flows don't land** — the working model is "model executes,
   operator approves/clicks one thing."
4. **Status legibility is now good** (Station 15/16 honest panels) — keep it.
**Simplify next (without overbuilding):** one `publish_pages_branch` script
(build+validate+branch in one command); one "rerun hosted RLS" doc card;
Desktop-helper cleanup note (SYSOS_*.bat/ps1 no longer needed).

## 12. Business Readiness Findings

**Category: DEMO-READY** (post-Pages) · **Pilot-ready:** yes, as *Arthur's own
public pilot* · **Client-ready: NOT READY.**

- Safe to sell today: the *approach* — evidence-gated ops platform, verified
  multi-tenant-capable backend (RLS proven), disciplined delivery; and consulting
  built on it.
- Must not be promised yet: multi-client hosting, client data onboarding, SLAs,
  multi-device sync, self-serve anything.
- Blockers before first public demo: §6 (essentially: rotate key + v4.7.1 + hosted
  verification).
- Before first pilot *client*: §7 items 1–3 minimum.
- Before first *paid* client: all of §7.

## 13. AI Replacement Findings

**Portable now:** constitution (CLAUDE.md), state anchor (CURRENT_STATE), release
history + per-release reports, operator checklists, vault structure, this audit.
A capable successor AI could resume from repo alone.

**Still trapped in session memory (add to vault):**
1. The operator-interaction lessons (§11) — highest value, least documented.
2. The Supabase activation war story details beyond the v4.5.3 milestone doc
   (key-format rejection → key-fixer tool pattern; already partially banked).
3. The hosted-RLS-rerun DevTools method (§9 — now written here).
4. The archive-contamination protocol (strip config.local/supabase.local/unrelated
   files from every `cp -r` archive — bitten twice, caught twice).
**Read-first order for future sessions:** CLAUDE.md → docs/CURRENT_STATE.md →
latest `13_AI_Session_Logs/` entry → `VERSION_HISTORY.md` top → relevant checklist.

## 14. Roadmap Priority Ranking

| Mission | Rank | Reason |
|---|---|---|
| Rotate old Google key | **NOW** | Public-history exposure; blocks pilot by policy; 10 minutes |
| v4.7.1 gh-pages activation (scripted) | **NOW** | Only step between committed artifact and live pilot |
| Hosted verification (incl. hosted-origin RLS rerun) | **NOW** | Completes v4.7; gates any readiness language |
| Public demo review + content flags decision | **NEXT** | Operator reserved flags; review the *rendered* site |
| Knowledge Vault update process (session logs cadence) | **NEXT** | Cheap, compounding; templates exist |
| Client onboarding template + seed/identity separation | **SOON** | The paid-client critical path (§7.1–2) |
| Command library | **SOON** | Operator leverage; small |
| AI-guided client interview | **LATER** | Needs onboarding foundation first |
| Orbit / executive dashboard | **LATER** | Constitution: parked until mission arrives |
| Graphify / token-saving evaluation | **PARK** | Constitution parking lot; no current-mission fit |
| NVIDIA evaluation | **PARK** | Same |
| MCP connectors | **PARK** | Same |

## 15. Knowledge Vault Update Recommendations (not executed — approval required)

- `13_AI_Session_Logs/2026-07-06_FINAL_FABLE5_ARCHITECTURE_AUDIT.md` — **this file**.
- `04_Lessons_Learned/2026-07-06_operator_credential_handoff_pattern.md` — the
  self-verifying Desktop-tool pattern + interaction-surface lessons (§11).
- `03_Engineering_Decisions/2026-07-06_gh_pages_orphan_branch_decision.md` — F2/F3
  resolution + why branch-over-Action (§9).
- `17_Risk_and_Compliance/2026-07-06_public_repo_exposure_register.md` — public
  repo posture, anon-key rationale, historical-key debt, client-data rules.
- `19_Platform_Productization/2026-07-06_paid_client_gap_analysis.md` — §7 as the
  productization backlog.
- `10_Checklists/HOSTED_VERIFICATION_CHECKLIST.md` — §9 post-Pages list.
- `11_Release_History/RELEASE_INDEX.md` — append v4.6.0 (shipped), v4.7 artifact
  (shipped/pushed), Pages still not deployed.

## 16. Final Verdict

**Infrastructure: done and proven. Honesty machinery: exemplary. Pilot: one key
rotation and one small scripted mission away. Business: sell the discipline, not
yet the multi-client product — the productization gap (§7) is now the real
roadmap.** SYS_OS's most valuable property is that nowhere in this system can
anyone — including its own AI — claim readiness without evidence. Protect that
property above every feature.

---
*Session log per vault rules: no secrets, summarized not transcribed. Auditor
inspection depth: all remote/deploy/governance surfaces read in full at this HEAD;
registry/commercial/executive audited structurally (sizes, seeds, API surface via
test anchors) rather than line-by-line.*

## Addendum — Google API Key Finding Closed

**Closeout date: 2026-07-06** (same-day follow-up to this audit).

- The original audit above flagged the historical Google/Gemini API key as
  🔴 urgent because it existed in **public** git history (§8, §6, §14 "NOW").
- A read-only forensic sweep then established the full lifecycle: the key
  existed only in one file (`gemini-app/.env`, later
  `CORE_SYSTEMS/gemini-app/.env`), introduced at `eb9907ca`, carried through
  `a02b3c07`/`2b714a54`, removed from tracking at `968288a3`.
- **Follow-up verification confirmed the exposed key is invalid/revoked** — a
  single read-only Generative Language API probe returned HTTP 400 (API key not
  valid). The exposure window is closed.
- The **active local key is a different, replacement key** (rotation had already
  been performed); **current HEAD contains no active tracked Google API key**.
- **This item no longer blocks the public pilot.** The audit's §6 blocker #1 and
  §14 "Rotate old Google key — NOW" entry are superseded by this closeout.
- Optional future cleanup only: purging the dead key from git history
  (`git filter-repo`) if a business need ever justifies rewriting public
  history — not required for deployment.
- Process note: no secrets were printed, reconstructed, or committed at any
  point in the verification or this closeout.
