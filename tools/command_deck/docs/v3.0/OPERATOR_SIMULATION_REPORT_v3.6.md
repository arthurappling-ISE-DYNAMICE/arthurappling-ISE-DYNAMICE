# SYS_OS v3.6 — Operator Simulation Report (Phase 6)

Simulation of an operator running SYS_OS using **only** the Operator Manual and
Day One Operator Guide, against the real platform behavior measured in Phases
1–5. Purpose: expose confusing areas, missing instructions, ambiguous workflows,
and training gaps. No engineering shortcuts assumed for the operator path.

## What worked cleanly (manual + guide were sufficient)
- **Orientation & launch:** localhost rationale, version badge check, real-vs-demo
  map — clear and correct.
- **The money path (client → proposal → contract → report):** every step in the
  Day One Guide matched real behavior; records persisted and survived reload
  exactly as documented.
- **Vault ingest, System Health, Access lock/unlock, Demo/Live toggle:** behaved
  as documented; no surprises.
- **RBAC expectations:** the manual's role table matched live enforcement exactly.

## Confusing / ambiguous areas (found during simulation)
1. **No UI to EDIT or DELETE commercial records.** *(Material gap.)* An operator
   can **create** clients/proposals/contracts (Client Center) and **view** them,
   but there is **no button to edit or delete** them — Registry Grid's EDIT/
   ARCHIVE/DELETE render for the **Projects domain only**; Client Center has
   create + select + report, no edit/delete. In validation, edit/delete were only
   possible via the API/console. **An unassisted operator cannot correct or remove
   a client/proposal/contract from the UI.** This is the single biggest operator
   limitation and is **not** stated in the manual.
2. **Client-delete dangling links (F1).** Deleting an entity that a Vault document
   links to leaves a dangling reference that System Health/integrity flags. Correct
   behavior, but **undocumented** — an operator would not understand the warning.
3. **Recovery is console-only.** The manual documents reset/quarantine/snapshot,
   but restoring **from** a snapshot has no operator UI — effectively engineering-
   assisted. The guide is honest about this, but it is a real self-service gap.
4. **OCR "does nothing" without a provider.** Documented, but easy to miss; an
   operator may submit a document and assume failure.

## Missing instructions
- A clear statement that **commercial records are create/view-only in the UI**
  (edit/delete require engineering today).
- The **dangling-reference caveat** when deleting linked entities.
- A short "**how to read System Health colors**" (esp. YELLOW telemetry = external
  service down; YELLOW vault = weak hash / recovery occurred).

## Missing training
- Interpreting Vault **WARNING/DEGRADED** and the **recovery artifacts**.
- The **console operations** (reset, audit export, restore-from-snapshot) — these
  are real capabilities with no UI; an operator needs a runbook or an engineer.

## Ambiguous workflows
- "Where do I fix a typo in a client name?" → no UI answer (API only).
- "How do I remove a test proposal?" → no UI answer (API only).

## Assessment
The documentation is **accurate and sufficient for the create/view/report/
monitor workflows** — an operator can run the **commercial intake and reporting
core unassisted**. It is **insufficient for correction/removal and recovery**,
because those capabilities **do not exist in the UI** (not a doc defect alone — a
platform limitation that the docs must state plainly).

## Recommended documentation updates (no code changes)
- Add a "**What the UI can and cannot do**" box: create/view/report = UI;
  edit/delete/recover = API/console (engineering-assisted) today.
- Add the **dangling-reference caveat** to the client/contract delete sections.
- Add a **System Health color guide**.
*(These are doc edits only and are out of this sprint's write scope — logged as
the next documentation task.)*
