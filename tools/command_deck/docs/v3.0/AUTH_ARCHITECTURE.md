# SYS_OS v3.0 — Authentication & Authorization Architecture (Phase 5)

**Architecture-first.** `assets/js/auth.js` ships the role model, permissions
matrix, current-operator identity, and attribution. **No login UI** (per
directive). Verified live: matrix enforces correctly per role.

## Roles
`ADMINISTRATOR` · `MANAGER` · `OPERATOR` · `READ_ONLY` (`SYSOS.auth.ROLES`).
`ADMINISTRATOR` implicitly holds every permission.

## Permissions matrix (`SYSOS.auth.MATRIX`, measured)
| Permission | ADMIN | MANAGER | OPERATOR | READ_ONLY |
|---|:--:|:--:|:--:|:--:|
| client.create / update | ✓ | ✓ | ✓ | |
| client.delete | ✓ | ✓ | | |
| proposal.create / update | ✓ | ✓ | ✓ | |
| contract.create / update | ✓ | ✓ | | |
| lifecycle.transition | ✓ | ✓ | ✓ | |
| vault.ingest | ✓ | ✓ | ✓ | |
| compliance.manage | ✓ | ✓ | | |
| report.generate | ✓ | ✓ | ✓ | ✓ |
| demo.toggle / system.audit | ✓ | ✓ | ✓ | ✓ |
| system.configure / storage.migrate | ✓ | | | |

**Verified:** as OPERATOR — `client.create` true, `client.delete` false,
`system.configure` false. As ADMINISTRATOR — all true.

## API
- `auth.can(permission)` → boolean (admin short-circuits true).
- `auth.setOperator(name, role)` → sets identity, logs `AUTH` event.
- `auth.permissionsFor(role)` → permission list.
- `auth.attribute(action, source)` → `{actor, role, action, source, ts}` audit block.
- `auth.actor()` → current operator name.

## Action attribution
Privileged write paths can wrap with `if (!auth.can(perm)) throw` and stamp
mutations with `auth.attribute()`. Lifecycle already records `user`/`source`
on every transition; binding `auth.actor()` there is a one-line upgrade.
Today the engine is permissive (single sovereign operator = ADMINISTRATOR), so
behavior is unchanged — the enforcement layer is present and ready.

## Deferred (v3.1)
- Login surface + session (the architecture imposes no UI assumption).
- Per-operator audit identities (pairs with the audit-history layer).
- Credential storage (out of scope; would use the storage adapter).
