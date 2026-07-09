# SYS_OS Operator Manual — v3.7 Addendum

Supplements `SYS_OS_OPERATOR_MANUAL_v3.6.md`. **Resolves the v3.6 finding that
commercial records were create/view-only.** As of v3.7 you can **edit, archive,
and (safely) delete** clients, proposals, and contracts entirely from the UI — no
console required.

## New: managing records in Client Center (Station 08)
Each record now has action buttons:

| Button | What it does |
|---|---|
| **EDIT** | Opens the record's form prefilled. Change fields → **COMMIT** to save. |
| **ARCH** | Archives the record (kept for history, hidden from active reporting, links preserved). Reversible. |
| **UNARCH** | Restores an archived record to its previous status. |
| **DEL** | Hard-deletes — but only if nothing references the record (see below). Two-click confirm. |

- **Clients:** the buttons are on each row in the **Client Registry** list.
- **Proposals & Contracts:** select the client first, then use the buttons next to
  each item in the **Workspace**.

## The most important rule: ARCHIVE vs DELETE
- **Prefer ARCHIVE.** It keeps the record and its links, and you can UNARCH later.
- **DELETE is protected.** If a record is referenced by anything (a proposal/
  contract linked to it, or a Vault document), SYS_OS **blocks the delete** and
  tells you to archive instead. This is on purpose — it prevents the broken-link
  problem entirely. You will see: *"DELETE BLOCKED — LINKED RECORD … Use ARCHIVE
  instead."*
- You can only hard-delete a record that **nothing** points to, and only after a
  two-click confirm (the button shows **CONFIRM?** after the first click).

## Updates to the v3.6 manual (corrections)
- **§"What the UI can and cannot do":** commercial records are now **fully
  manageable in the UI** (create / view / **edit** / **archive** / **delete**).
  Edit/delete are no longer console-only.
- **Dangling-reference caveat (old F1):** you no longer need to worry about this —
  the UI **blocks** any delete that would create a dangling link.

## What still requires care
- Archived records still appear in the list **badged ARCHIVED** (so history stays
  visible). Use the badge to tell active from archived.
- Hard delete is **permanent**. Archive if unsure.
- Roles still apply: READ_ONLY cannot edit/archive/delete; OPERATOR can edit/
  archive clients & proposals but not hard-delete; contract changes need MANAGER+.

## Unchanged
Everything else in the v3.6 manual still applies (stations, Vault, Access/RBAC,
Demo/Live, recovery-is-console-only for the Vault, real-vs-demo map).
