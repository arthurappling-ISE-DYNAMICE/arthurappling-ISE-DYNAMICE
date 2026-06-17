# SYS_OS v3.4.0 — RBAC Session Binding Plan (Phase 8)

Inspection + plan only. No login system built this release.

## 1. How RBAC currently works (verified from source)
- `auth.js` holds `current = { name, role }`, a frozen permission `MATRIX`
  (ADMINISTRATOR/MANAGER/OPERATOR/READ_ONLY), `can(permission)`, and
  `enforce(permission, ctx)` (throws + audits `permission_denied`).
- Enforcement points: DataStore writes (`store._enforce`, v3.2) and
  vault.ingest / compliance.schedule·complete / ocr.upload / opsQueue.enqueue
  (v3.3). Denials throw and record an audit event.
- `auth_ui.js` (station 13) provides a login form, session object
  `{ active, since, operator }`, and logout (drops to READ_ONLY, fail-closed).

## 2. Operator-bound or default-role?
**Default-role.** On boot `current` defaults to ADMINISTRATOR (the sovereign
operator). The login surface exists and sets `current` + session, but:
- There is no persisted session — a reload resets to the ADMINISTRATOR default.
- Writes are gated by the *current role*, but nothing forces a login before the
  app is usable; the default role is fully privileged.
- Verified behavior: logging in as READ_ONLY and attempting a vault/client
  write is denied + audited; but a reload returns to ADMINISTRATOR.

So enforcement is real and correct *for the active role*, but the active role
is not yet bound to an authenticated, persisted session.

## 3. What real session enforcement needs
1. **Persisted session** — store `{ operator, role, since }` (through the
   storage adapter) so a reload restores the authenticated identity, not the
   admin default.
2. **Boot gate on session** — if no valid session, boot into READ_ONLY (or a
   locked login state) instead of ADMINISTRATOR.
3. **Session expiry** — optional idle timeout → drop to READ_ONLY.
4. **Operator credential** — a local secret check (sovereign, no cloud). Even a
   local passphrase hash (WebCrypto, already available) gates role elevation.
5. **Audit identity** — every audit event already carries `actor/role`; bind
   these to the authenticated session rather than the default.

## 4. What should be built in v3.5
- Persisted session in the storage adapter + boot restoration.
- Default-deny boot (READ_ONLY until login).
- Local passphrase elevation (WebCrypto hash compare) for MANAGER/ADMIN.
- Lock/unlock control in station 13.

## 5. What should NOT be rushed
- Cloud auth / OAuth / external identity — out of the sovereign model; do not
  build.
- Multi-user account management — premature; single sovereign operator stands.
- Breaking the current permissive default before the persisted-session +
  passphrase path exists — that would lock the operator out or weaken nothing
  while adding friction. Sequence matters: build session persistence first,
  then flip the default to deny.

## Verdict
RBAC is **enforced and audited at every write path** today, but it is
**role-bound, not session-bound**. Session binding is a clean v3.5 addition on
the existing `auth`/`auth_ui` foundation — no redesign required.
