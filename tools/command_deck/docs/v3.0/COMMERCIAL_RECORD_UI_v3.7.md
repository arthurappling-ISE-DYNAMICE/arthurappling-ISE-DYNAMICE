# SYS_OS v3.7 — Commercial Record Management UI

Closes operator gap **F2** (no UI edit/delete for commercial records) and guards
**F1** (dangling links on delete). Additive UI layer over the existing DataStore,
audit, and RBAC paths. No redesign, no new record systems, no schema change.

## What changed
- **`commercial_ui.js`** — generalized the (already-built) edit form entry point:
  `edit(recordMode, id)` opens the existing form prefilled for **client /
  proposal / contract** (the edit/update logic already existed; it simply had no
  trigger). `editClient` retained as an alias.
- **`client.js`** — Client Center now renders per-record controls:
  - **Client rows:** `EDIT` · `ARCH`/`UNARCH` · `DEL`.
  - **Workspace proposals & contracts:** `EDIT` · `ARCH`/`UNARCH` · `DEL` per item.
  - A `handleCommercialAction` dispatcher and a `linkRisk()` relationship-safety
    gate. The client row changed from a `<button>` to a `<div role="button">` so
    it can host the action controls (selection behavior unchanged).

No other files changed. Boot gate unchanged (36). Pagination + lazy rendering
preserved.

## How to edit a record (operator)
1. Client Center (08). For a **client**, click **EDIT** on its row; for a
   **proposal/contract**, select the client, then click **EDIT** on the item in
   the Workspace.
2. The existing commercial form opens **prefilled** (titled "EDIT …").
3. Change fields → **COMMIT**. The record updates, persists, and is audited; the
   list/workspace/metrics refresh automatically.

## How to archive a record
- Click **ARCH**. The record moves to `ARCHIVED` (status + `archived=true`),
  **retains all its links**, and is hidden from active reporting. It remains
  visible (badged ARCHIVED) and is fully in the audit trail and Registry Grid.
- Click **UNARCH** to restore it to its previous status.
- **Archive is the safe, reversible choice** and is preferred whenever a record
  has relationships.

## When hard delete is blocked (F1 protection)
- **DEL** triggers a relationship check (`linkRisk`): it inspects **backlinks**
  (any record referencing this one) and **Vault document links**.
- **If anything references the record, hard delete is BLOCKED** with a clear
  message ("referenced by N record(s) … Use ARCHIVE instead") and an audit event
  `<domain>.delete_blocked`. **No mutation occurs — dangling links are impossible.**
- **If nothing references the record**, DEL requires a **two-step confirm**
  (click → `CONFIRM?` → click within 3s) and then hard-deletes. Integrity is
  re-checked immediately; any anomaly raises a warning.

## How linked records are protected
- Deleting a client that has proposals/contracts/Vault links → **blocked**
  (archive instead). Deleting a proposal a contract references → **blocked**.
- This makes the F1 scenario (orphaned Vault→client reference) **unreachable via
  the UI**: you cannot hard-delete a referenced record.

## RBAC (unchanged, enforced through the existing matrix)
| Action | Permission | ADMIN | MANAGER | OPERATOR | READ_ONLY |
|---|---|:--:|:--:|:--:|:--:|
| EDIT (update) | `<domain>.update` | ✅ | ✅ | ✅ (client/proposal) | ❌ |
| ARCH (→update) | `<domain>.update` | ✅ | ✅ | ✅ (client/proposal) | ❌ |
| DEL (remove) | `<domain>.delete` | ✅ | ✅ (client) | ❌ | ❌ |
Denied actions surface a clear notification and are audited (`permission_denied`).
Contracts use `contract.update`/`contract.delete` (ADMIN/MANAGER · ADMIN).

## Verified (Phase 6)
Edit prefilled + persisted + audited; archive/unarchive; two-step delete of an
unlinked record; **delete-blocked on linked client (audited)**; READ_ONLY denied;
all survived reload; smoke 18/18, drills 6/6, maintenance 10/10, integrity 88/0,
gate 36/0, vault chain valid, H1-H5 + demo + lock/unlock intact.

## Deferred (not in v3.7)
- Bulk actions; an explicit "show archived only" filter (archived already visible,
  badged); cascade-clean of links on delete (we **block** instead, by design);
  edit/delete UI inside the Registry Grid for these domains (Client Center is the
  management surface).
