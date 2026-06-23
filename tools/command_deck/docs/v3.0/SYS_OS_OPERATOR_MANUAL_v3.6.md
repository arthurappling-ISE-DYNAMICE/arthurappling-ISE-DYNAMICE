# SYS_OS Operator Manual — v3.6

**Platform:** SYS_OS v3.5.0 (SESSION_BOUND_RBAC_VAULT_HARDENING)
**Audience:** the operator (Arthur), running the platform **unassisted**.
**Source of truth:** the v3.6 Operator Readiness Audit (System Inventory, Button
Audit, Workflow Audit, Verified vs Assumed, Knowledge Gaps, Gap Analysis,
Scorecard, Master Report). **Every behavior below is VERIFIED unless explicitly
marked ASSUMED.** No capability is claimed on appearance alone.

> This manual documents the platform exactly as it is. It does not promise
> features that do not exist. Where a control is a demo/cosmetic surface, it says so.

---

## 0. Orientation (read this first)

**What SYS_OS is:** a single-screen "command deck" that runs entirely in your web
browser. It is your operational system of record — clients, projects, proposals,
contracts, a document vault, and live-ops monitoring — with a tamper-evident
audit trail.

**Three facts that change how you operate:**
1. **Your data lives in this browser only.** SYS_OS saves to the browser's local
   storage. It is *not* in the cloud and does *not* sync to other devices or
   browsers. The browser profile you use *is* your database.
2. **You are signed in as ADMINISTRATOR by default — with no password.** Anyone
   at this machine has full control. There is no login wall yet (by design).
3. **Some panels are demonstrations, not live tools.** The CEO and COO consoles
   and the Shield "Optimize" button show scripted output. They are clearly listed
   in §"Real vs Demo" so you never mistake a demo for a result.

**How to launch:** see the Day One Guide. In short: serve the `tools/command_deck`
folder over `localhost` and open it in a browser. Using `localhost` matters —
it gives the Vault strong (SHA-256) cryptography. Opening the file any other way
can downgrade the Vault to a weak hash (the Vault will warn you — see Station 04).

**The 13 stations** (left sidebar, top to bottom):
01 Architect Core · 02 CEO Console · 03 COO Console · 04 Knowledge Vault ·
05 Legacy Shield · 06 Registry Grid · 07 Live Ops · 08 Client Center ·
09 Executive Dashboard · 10 Operator Workspace · 11 Activity Timeline ·
12 System Health · 13 Access Control.

**Golden rules**
- Work in **LIVE** mode for real records; flip to **DEMO** (Station 09) when
  showing the platform off — DEMO changes are never saved.
- The **Vault chain** and **System Health** should read green/HEALTHY. If the
  Vault shows **WARNING**, you are not on a secure origin (see Station 04).
- Destructive actions (Vault reset) are **console-only** and require a typed
  confirmation — you cannot wipe the Vault by clicking.

---

## How to read each station entry
Purpose · Business use · Controls · What each control does (VERIFIED/ASSUMED) ·
Example workflow · Common mistakes · Recovery · Related stations · Verified vs
assumed · Deployment relevance.

---

## Station 01 — Architect Core
1. **Purpose:** the home HUD — headline metrics, environment node monitor,
   governance directives, and a one-click integrity audit.
2. **Business use:** your at-a-glance cockpit; confirm the system is alive and
   run a quick integrity check before serious work.
3. **Controls:** `PING_NODE` (×3, one per node), `INITIALIZE INTEGRITY AUDIT`.
4. **What they do:**
   - **PING_NODE** — probes that environment node and updates its status
     indicator (VERIFIED; real reachability check).
   - **INITIALIZE INTEGRITY AUDIT** — runs the integrity/relationship scan and
     shows a result toast; logs an activity entry (VERIFIED).
   - The four metric cards (DSCR 7.42×, $130K capital, pipeline, timeline) are
     **bound from configuration** — they are fixed reference figures, not live
     calculations (VERIFIED as static display).
5. **Example workflow:** open SYS_OS → land on Architect Core → click INITIALIZE
   INTEGRITY AUDIT → confirm the toast reports links checked / 0 broken.
6. **Common mistakes:** reading the four top metric cards as live computed values
   — they are static config anchors. Live numbers live on Station 09.
7. **Recovery:** if a node shows offline, that is usually a true negative (the
   external service is down) — not a SYS_OS fault. Re-PING after the service is up.
8. **Related stations:** 12 System Health (deeper checks), 07 Live Ops (node detail).
9. **Verified vs assumed:** PING + integrity audit VERIFIED; node *services* being
   healthy is environment-dependent (ASSUMED per node).
10. **Deployment relevance:** good demo landing screen; no blockers.

## Station 02 — CEO Intel Console  *(DEMO SURFACE)*
1. **Purpose:** a strategic-protocol console styled as an executive terminal.
2. **Business use:** narrative/demo of strategic protocols (capital stack, NEPQ
   pipeline, consulting delivery).
3. **Controls:** 3 protocol buttons + `EXECUTE`.
4. **What they do:** emit **scripted** terminal output from configuration. **No
   real computation or backend action occurs** (VERIFIED as mock).
5. **Example workflow:** click a protocol → read the scripted briefing during a
   walkthrough.
6. **Common mistakes:** believing EXECUTE performs real analysis or changes data.
   It does not.
7. **Recovery:** none needed — nothing is created or changed.
8. **Related stations:** 08 Client Center / 09 Dashboard (the *real* commercial data).
9. **Verified vs assumed:** scripted output VERIFIED; "execution" is ASSUMED/absent.
10. **Deployment relevance:** **relabel or hide before any client demo** so it is
    not mistaken for a live capability.

## Station 03 — COO Deploy Console  *(DEMO SURFACE)*
Identical nature to Station 02, for operational protocols (asset turnover, RPDC
anchor, environment health). Buttons emit **scripted** output only (VERIFIED mock).
Same mistakes/recovery/deployment note as Station 02.

## Station 04 — Knowledge Vault
1. **Purpose:** ingest documents into a hash-chained, tamper-evident ledger with
   search.
2. **Business use:** your evidence/document register — SOPs, contracts, compliance
   files — each sealed with a cryptographic hash and a verifiable chain.
3. **Controls:** `+ INGEST_SPEC_DOCUMENT`, search box, the ledger table, and the
   chain-state indicators (rows, sovereignty, **Index State**).
4. **What they do:**
   - **+ INGEST_SPEC_DOCUMENT** — runs the real pipeline (intake → classify →
     hash → index → seal), adds a row, and records a central audit event
     `document.created` (VERIFIED; RBAC-gated `vault.ingest`).
   - **search** — inverted-index filter over id/path/classification (VERIFIED).
   - **Index State** — reads **HEALTHY** (green) when the chain verifies on strong
     hashing; **WARNING** (amber) if the hash mode fell back to non-cryptographic
     FNV-1a (you are not on a secure origin); **DEGRADED** (red) if the chain
     breaks or a corrupt-restore quarantine occurred (VERIFIED).
5. **Example workflow:** open Vault → + INGEST_SPEC_DOCUMENT → a new row appears,
   Index State stays HEALTHY, chain entry count increments.
6. **Common mistakes:** (a) expecting the Vault to **store the file itself** — it
   stores the **path + hash + links**, not the bytes; keep the original file.
   (b) Ignoring a **WARNING** state — it means weak hashing; relaunch via localhost.
7. **Recovery:** if Index State is WARNING → relaunch on `localhost`/HTTPS.
   If DEGRADED after a corrupt restore → a quarantine key was saved
   (`sysos.vault.quarantine.<timestamp>`); your data was preserved, the platform
   reseeded a clean baseline. (Restoring from a quarantine/snapshot is a
   console/engineering step — see §Recovery & Console Ops.)
8. **Related stations:** 07 Live Ops (OCR intake), 13 Access (who may ingest).
9. **Verified vs assumed:** ingest/search/chain/hash-mode VERIFIED. Production OCR
   extraction and storing actual file bytes are ASSUMED/absent.
10. **Deployment relevance:** **must run over HTTPS** for a pilot (else weak hash).

## Station 05 — Legacy Shield  *(DISPLAY SURFACE)*
1. **Purpose:** a capital-asset register display (20-year horizon framing).
2. **Business use:** a static "fortress capital" summary card for presentations.
3. **Controls:** `OPTIMIZE ALLOCATION MATRIX`.
4. **What it does:** shows a notification only — **there is no allocation engine**
   (VERIFIED cosmetic).
5. **Example workflow:** display the asset cards during a narrative; do not expect
   the button to compute anything.
6. **Common mistakes:** treating OPTIMIZE as a real financial action.
7. **Recovery:** none needed.
8. **Related stations:** 01 Architect (capital metric), 09 Dashboard (live numbers).
9. **Verified vs assumed:** display VERIFIED; optimization ASSUMED/absent.
10. **Deployment relevance:** relabel as display-only before client use.

## Station 06 — Registry Grid
1. **Purpose:** the system of record across **9 domains** — projects, agents,
   workflows, SOPs, intelligence, compliance, clients, proposals, contracts.
2. **Business use:** browse, search, filter, and (for Projects) fully manage your
   operational records.
3. **Controls:** 9 domain cards · search · status filter · `+ NEW_PROJECT` ·
   form (`COMMIT RECORD` / `CANCEL`) · per-row `VIEW` / `EDIT` / `ARCHIVE` /
   `DELETE` · `PREV` / `NEXT`.
4. **What they do:**
   - **domain card** — selects the domain, resets to page 1 (VERIFIED).
   - **+ NEW_PROJECT / COMMIT RECORD** — create/update a **Project** (full CRUD is
     **Projects only**); writes persist and are audited (VERIFIED, RBAC-gated).
   - **VIEW** — detail panel with forward links + "referenced by" backlinks.
   - **EDIT / ARCHIVE / DELETE** — manage a project (DELETE is **two-click**:
     click once → it says CONFIRM? → click again within 3s) (VERIFIED).
   - **PREV / NEXT** — 25 rows per page; filter/sort apply to the full dataset
     first (VERIFIED at 300+ records).
5. **Example workflow:** select Projects → + NEW_PROJECT → fill name/category/
   status/priority/owner → COMMIT RECORD → row appears, audit logs a create.
6. **Common mistakes:** trying to create/edit in the **non-Projects** domains via
   the grid — those are **view-only** here; clients/proposals/contracts are
   created on Station 08, others are seeded/API.
7. **Recovery:** an accidental ARCHIVE is reversible (record retained, status
   ARCHIVED). A DELETE is permanent — the two-click confirm exists to prevent it.
8. **Related stations:** 08 Client Center (commercial CRUD), 11 Timeline (history).
9. **Verified vs assumed:** Projects CRUD + pagination + detail/backlinks VERIFIED;
   UI CRUD for the other 8 domains is ASSUMED/absent.
10. **Deployment relevance:** solid; document the projects-only CRUD limitation.

## Station 07 — Live Ops
1. **Purpose:** live monitoring + operations — telemetry, an operations queue,
   routing contracts, compliance scheduling, and the OCR intake framework.
2. **Business use:** check node health, enqueue/run operations, complete
   compliance items, and submit documents for OCR.
3. **Controls:** `PROBE_ALL` / `PROBE`, `+ DISPATCH`, `RUN_PENDING`, route
   `DISPATCH`, compliance `DONE`, `UPLOAD_FILE` / `+ SAMPLE_DOC`.
4. **What they do:**
   - **PROBE_ALL / PROBE** — real `fetch` health checks; status reflects true
     reachability (VERIFIED).
   - **+ DISPATCH / RUN_PENDING** — enqueue and advance operations
     (VERIFIED, persisted, RBAC `ops.dispatch`).
   - **DONE (compliance)** — marks a compliance item complete (VERIFIED, audited).
   - **UPLOAD_FILE / + SAMPLE_DOC** — submit to OCR. **With no OCR provider
     installed, jobs park at AWAITING_PROVIDER** — nothing is extracted (VERIFIED).
5. **Example workflow:** PROBE_ALL → see which nodes are online → + DISPATCH a
   sample op → RUN_PENDING → watch it move to COMPLETED.
6. **Common mistakes:** uploading a document for OCR and expecting extracted text
   — without a provider it only parks. A node reading offline is usually a true
   negative (the external service is down).
7. **Recovery:** re-PROBE after a service recovers; parked OCR jobs resume when a
   provider is bound (engineering step).
8. **Related stations:** 04 Vault (where OCR output would land), 12 Health.
9. **Verified vs assumed:** telemetry/queue/routing/compliance VERIFIED; OCR
   extraction ASSUMED/absent (framework only).
10. **Deployment relevance:** add a real OCR provider before promising extraction.

## Station 08 — Client Center
1. **Purpose:** the commercial workspace — clients, proposals, contracts, health,
   and per-client reports.
2. **Business use:** **this is your money station** — onboard a client, attach a
   proposal, convert to a contract, and read health/revenue.
3. **Controls:** `+ CLIENT`, `+ PROPOSAL`, `+ CONTRACT`, client list rows
   (select), `GEN_REPORT`, `PREV` / `NEXT`.
4. **What they do:**
   - **+ CLIENT / + PROPOSAL / + CONTRACT** — open a form and create the record;
     persists and is audited (VERIFIED, RBAC-gated).
   - **select a client row** — loads its workspace (projects, documents,
     proposals, contracts, lifecycle stage, health) (VERIFIED).
   - **GEN_REPORT** — produces a text report for the selected client (VERIFIED).
   - **PREV / NEXT** — 25 clients per page (VERIFIED).
5. **Example workflow:** + CLIENT (name/segment/status) → select it → + PROPOSAL
   (link to client, amount) → + CONTRACT (link client/proposal, value) →
   GEN_REPORT. Each step persists and logs an audit entry.
6. **Common mistakes:** creating a proposal/contract without selecting/linking the
   right client; not noticing health is computed (don't hand-edit it).
7. **Recovery:** mis-created records can be archived/removed via Registry Grid
   (proposals/contracts appear there) — but deletion is permanent.
8. **Related stations:** 06 Registry (same records), 09 Dashboard (rolled-up $).
9. **Verified vs assumed:** full commercial CRUD + reports + reload-persistence
   VERIFIED.
10. **Deployment relevance:** the core deployable value; ready pending hosting/auth.

## Station 09 — Executive Dashboard
1. **Purpose:** computed executive metrics, the DEMO/LIVE switch, and text reports.
2. **Business use:** the real numbers (pipeline, expected, projected) and the safe
   way to demo without touching real data.
3. **Controls:** `TOGGLE DEMO/LIVE`, `EXECUTIVE`, `PIPELINE`, `COMPLIANCE`,
   `HEALTH` report buttons.
4. **What they do:**
   - **TOGGLE DEMO/LIVE** — enters/exits the demo sandbox; in **DEMO**, changes
     are **not saved** (persistence suspended); exiting restores LIVE (VERIFIED,
     audited).
   - **report buttons** — generate the corresponding text report from live state
     (VERIFIED).
5. **Example workflow:** before a demo → TOGGLE to DEMO → create throwaway records
   freely → TOGGLE back to LIVE → confirm nothing demo persisted.
6. **Common mistakes:** doing real work while in DEMO (it won't save); forgetting
   to return to LIVE.
7. **Recovery:** if unsure, reload the page — you boot in LIVE with your saved data.
8. **Related stations:** 08 Client Center (source data), 12 Health.
9. **Verified vs assumed:** metrics, reports, demo isolation VERIFIED.
10. **Deployment relevance:** keep DEMO for sales demos; metrics are real.

## Station 10 — Operator Workspace
1. **Purpose:** a derived daily view — today's tasks, upcoming compliance/renewals,
   expiring proposals, open pipeline, recent activity.
2. **Business use:** your morning checklist, computed from live data.
3. **Controls:** none (read-only).
4. **What it does:** displays derived lists; no actions (VERIFIED read-only).
5. **Example workflow:** open each morning → scan upcoming renewals/expirations →
   act in Client Center.
6. **Common mistakes:** looking for buttons — there are none here by design.
7. **Recovery:** n/a.
8. **Related stations:** 08 Client Center (act), 11 Timeline (history).
9. **Verified vs assumed:** read-only derivation VERIFIED.
10. **Deployment relevance:** strong operator-facing view; no blockers.

## Station 11 — Activity Timeline
1. **Purpose:** chronological feed of platform activity.
2. **Business use:** "what happened and when" — a quick operational history.
3. **Controls:** read-only feed (type filter).
4. **What it does:** lists recent activity events (VERIFIED read-only).
5. **Example workflow:** after a busy session → open Timeline → confirm your
   creates/updates are recorded.
6. **Common mistakes:** confusing the Timeline (activity feed, capped) with the
   full **audit-of-record** (uncapped, queryable via console/Access).
7. **Recovery:** n/a.
8. **Related stations:** 13 Access (audit), 12 Health.
9. **Verified vs assumed:** read-only feed VERIFIED.
10. **Deployment relevance:** fine; the durable record is the central audit.

## Station 12 — System Health
1. **Purpose:** 8 subsystem checks → GREEN / YELLOW / RED + overall.
2. **Business use:** one screen to confirm the whole platform is sound.
3. **Controls:** `REFRESH`.
4. **What it does:** recomputes the 8 bands — relationship integrity, vault chain,
   boot gate, smoke test, maintenance, routing, telemetry, persistence (VERIFIED).
   The **Vault Chain** band turns **YELLOW** on weak hash or after a corrupt
   restore (VERIFIED).
5. **Example workflow:** start of day → open System Health → REFRESH → expect all
   GREEN (telemetry may show degraded if an external node is down — true negative).
6. **Common mistakes:** alarm at a YELLOW telemetry band when an external service
   is simply offline.
7. **Recovery:** investigate any RED via the named subsystem; YELLOW vault →
   relaunch on localhost/HTTPS.
8. **Related stations:** 01 Architect (audit), 04 Vault, 07 Live Ops.
9. **Verified vs assumed:** all 8 checks VERIFIED.
10. **Deployment relevance:** your go/no-go screen; keep it green.

## Station 13 — Access Control
1. **Purpose:** identity, session, role, lock/unlock, and the permission matrix.
2. **Business use:** see who you are operating as and what you may do; lock the
   console when stepping away.
3. **Controls:** `LOG IN`, `LOCK`, `UNLOCK`, `LOG OUT`, operator/role fields, and
   the live permission matrix (ALLOW/DENY per action).
4. **What they do:**
   - **LOG IN** — sets the operator + role and a **persisted session** (survives
     reload); audited (VERIFIED).
   - **LOCK** — instantly drops the active role to READ_ONLY while remembering who
     you were (memory-only; a reload returns to your saved session) (VERIFIED).
   - **UNLOCK** — restores your prior role (VERIFIED).
   - **LOG OUT** — clears the session, drops to READ_ONLY guest (fail-closed),
     audited (VERIFIED).
5. **Example workflow:** stepping away → LOCK (writes now denied) → return →
   UNLOCK (role restored).
6. **Common mistakes:** expecting a password — **there is none yet**;
   ADMINISTRATOR is the default. LOG OUT leaves you in READ_ONLY until you LOG IN.
7. **Recovery:** if you're stuck in READ_ONLY and can't write, LOG IN as
   ADMINISTRATOR (or reload — you boot as ADMINISTRATOR when no session is saved).
8. **Related stations:** all (RBAC gates writes platform-wide).
9. **Verified vs assumed:** session/lock/unlock/logout + RBAC enforcement VERIFIED;
   passphrase/default-deny ASSUMED/absent (deferred).
10. **Deployment relevance:** **add real auth before any multi-user/pilot use.**

---

## Verified Workflows (operational detail)
For each: start → end, data created/modified, audit entries, vault interactions,
RBAC. All VERIFIED in the Workflow Audit.

### Client onboarding
- **Start:** Client Center, LIVE mode, ADMINISTRATOR. **End:** a persisted client.
- **Data created:** one `clients` record (`CLT-…`). **Modified:** none.
- **Audit:** `clients / create` (with before/after). **Vault:** none.
- **RBAC:** `client.create` (ADMIN/MANAGER/OPERATOR; READ_ONLY denied).

### Proposal
- **Start:** an existing client selected. **End:** a proposal linked to the client.
- **Created:** one `proposals` record (`PRO-…`); forecast recomputes.
- **Audit:** `proposals / create`. **Vault:** none. **RBAC:** `proposal.create`.

### Contract
- **Start:** client (and optional proposal). **End:** a contract; monitoring updates.
- **Created:** one `contracts` record (`CON-…`).
- **Audit:** `contracts / create`. **Vault:** none. **RBAC:** `contract.create`
  (ADMIN/MANAGER).

### Project
- **Start:** Registry Grid → Projects. **End:** a persisted project.
- **Created:** one `projects` record (`PRJ-…`).
- **Audit:** `projects / create`. **RBAC:** project write (ADMIN/MANAGER/OPERATOR).

### Vault ingest
- **Start:** Vault. **End:** a sealed document + new chain entry.
- **Created:** one document (path+hash+links) + one audit-chain entry.
- **Audit:** `document.created` (central, via the H1 bridge). **Vault:** the write.
- **RBAC:** `vault.ingest`.

### Evidence attach
- **Start:** an existing document. **End:** evidence sealed into the chain.
- **Created:** one evidence record + one chain entry.
- **Audit:** `document.evidence_attached`. **RBAC:** `vault.attachEvidence`.

### OCR
- **Start:** Live Ops upload. **End:** *with a provider* a stored document; *without*
  a parked job (AWAITING_PROVIDER).
- **Created:** an OCR job; *if completed* a vault document.
- **Audit:** `document.ocr_stored` (only if it seals). **RBAC:** `vault.ingest`.

### Session
- **Start:** Access. **End:** a persisted (or cleared) session.
- **Created/Modified:** the session key (login writes it, logout clears it).
- **Audit:** `login` / `logout` / `system.auth`. **RBAC:** n/a (sets identity).

### RBAC (denial)
- **Start:** any write as an unauthorized role. **End:** the write is blocked.
- **Created:** nothing. **Audit:** `permission_denied` (or `document.*_denied`).
- **RBAC:** the gate itself.

### Audit
- **Start:** any audited action. **End:** an appended, queryable event.
- **Created:** one append-only audit event (survives reload).
- **Vault:** vault writes also seal their own chain entry (two records, by design).

---

## Roles & RBAC quick reference
| Role | Can create clients/proposals/projects | Delete/contracts | Evidence | OCR provider | Reset vault | Reports |
|---|---|---|---|---|---|---|
| ADMINISTRATOR | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| MANAGER | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| OPERATOR | ✅ | ❌ (delete/contract) | ✅ | ❌ | ❌ | ✅ |
| READ_ONLY | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (read/report) |
- Boot default = **ADMINISTRATOR** (no password). LOCK = temporary READ_ONLY.
- Denials are **structured + audited**; they never silently fail.

---

## Recovery & Console operations (advanced)
These are **console-only** (open the browser dev console). They are listed so you
know they exist; treat them as engineering-assisted until a UI is added.
- **Reset the Vault to clean seeds (destructive):**
  `await SYSOS.vault.reset({ confirm: 'RESET_VAULT' })` — requires ADMINISTRATOR;
  writes a recovery snapshot first; aborts if the snapshot fails.
- **Read recovery/quarantine artifacts:** storage keys
  `sysos.vault.recovery.<ts>` (reset) and `sysos.vault.quarantine.<ts>` (corrupt
  restore) hold the prior state. (Restoring *from* them is an engineering step.)
- **Export the audit trail:** `SYSOS.audit.export()` / `SYSOS.audit.reportText()`.
- **Check vault health mode:** `SYSOS.vault.hashMode()` →
  `{algo, strong, secureContext}`.
- **Manual integrity:** `SYSOS.relations.integrity()` ·
  **smoke:** `SYSOS.smoketest.run()` · **maintenance:** `await SYSOS.maintenance.run()`.

---

## Real vs Demo map (do not confuse these)
| Surface | Real or demo |
|---|---|
| Client Center, Registry (projects), Vault ingest, Live Ops telemetry/queue/compliance, Dashboard metrics/reports, Operator Workspace, Timeline, System Health, Access/RBAC, Audit | **REAL (verified)** |
| CEO Console buttons | **DEMO** (scripted output) |
| COO Console buttons | **DEMO** (scripted output) |
| Legacy Shield "OPTIMIZE ALLOCATION MATRIX" | **COSMETIC** (no engine) |
| OCR extraction (no provider) | **FRAMEWORK ONLY** (parks) |
| Architect top metric cards | **STATIC** config anchors |

---

## What this manual does not cover (because it does not exist yet)
Cloud sync / multi-device · multi-user accounts · passwords / default-deny login ·
server-side backups · production OCR · hosted/HTTPS deployment. See the v3.6
Deployment Gap Analysis for the path to Pilot/Production.
