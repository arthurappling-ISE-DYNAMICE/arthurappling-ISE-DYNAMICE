/**
 * SYS_OS v3.0 — Operator Identity & Authorization Architecture
 *
 * Architecture-first (no login UI per Phase 5). Defines the role model, a
 * permissions matrix, the current operator identity, and action attribution.
 * Other modules MAY consult auth.can() before privileged actions and
 * auth.attribute() for audit metadata; nothing is forced, so existing behavior
 * is unchanged (additive). v3.1 can add a login surface on top with no engine
 * changes.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;

    const ROLES = ['ADMINISTRATOR', 'MANAGER', 'OPERATOR', 'READ_ONLY'];

    // Permission -> minimum capable roles. ADMINISTRATOR implicitly holds all.
    const MATRIX = Object.freeze({
        'client.create':       ['ADMINISTRATOR', 'MANAGER', 'OPERATOR'],
        'client.update':       ['ADMINISTRATOR', 'MANAGER', 'OPERATOR'],
        'client.delete':       ['ADMINISTRATOR', 'MANAGER'],
        'proposal.create':     ['ADMINISTRATOR', 'MANAGER', 'OPERATOR'],
        'proposal.update':     ['ADMINISTRATOR', 'MANAGER', 'OPERATOR'],
        'contract.create':     ['ADMINISTRATOR', 'MANAGER'],
        'contract.update':     ['ADMINISTRATOR', 'MANAGER'],
        'lifecycle.transition':['ADMINISTRATOR', 'MANAGER', 'OPERATOR'],
        'vault.ingest':        ['ADMINISTRATOR', 'MANAGER', 'OPERATOR'],
        'compliance.manage':   ['ADMINISTRATOR', 'MANAGER'],
        'ops.dispatch':        ['ADMINISTRATOR', 'MANAGER', 'OPERATOR'],
        'report.generate':     ['ADMINISTRATOR', 'MANAGER', 'OPERATOR', 'READ_ONLY'],
        'demo.toggle':         ['ADMINISTRATOR', 'MANAGER', 'OPERATOR', 'READ_ONLY'],
        'system.audit':        ['ADMINISTRATOR', 'MANAGER', 'OPERATOR', 'READ_ONLY'],
        'system.configure':    ['ADMINISTRATOR'],
        'storage.migrate':     ['ADMINISTRATOR']
    });

    const auth = {
        ROLES: ROLES,
        MATRIX: MATRIX,

        // Default operator = the architect identity (administrator).
        current: { name: (SYSOS.CONFIG.IDENTITY && SYSOS.CONFIG.IDENTITY.NAME) || 'OPERATOR', role: 'ADMINISTRATOR' },

        setOperator(name, role) {
            if (ROLES.indexOf(role) === -1) throw new Error('unknown role: ' + role);
            auth.current = { name: name, role: role };
            if (SYSOS.activity) SYSOS.activity.log('AUTH', 'Operator set -> ' + name + ' (' + role + ')');
            return auth.current;
        },

        /** Does the current operator hold this permission? */
        can(permission) {
            if (auth.current.role === 'ADMINISTRATOR') return true;
            const allowed = MATRIX[permission];
            return !!allowed && allowed.indexOf(auth.current.role) !== -1;
        },

        /** Permissions available to a role (defaults to current). */
        permissionsFor(role) {
            role = role || auth.current.role;
            return Object.keys(MATRIX).filter(function (p) {
                return role === 'ADMINISTRATOR' || MATRIX[p].indexOf(role) !== -1;
            });
        },

        /** Audit attribution block for an action (actor/role/source/ts). */
        attribute(action, source) {
            return {
                actor: auth.current.name,
                role: auth.current.role,
                action: action || null,
                source: source || 'system',
                ts: new Date().toISOString()
            };
        },

        /** Current actor name — used by lifecycle/audit attribution. */
        actor() { return auth.current.name; },

        /** v3.3: enforce a permission — throws + audits on denial. Used by
         *  vault/compliance/ocr/ops write paths (DataStore uses its own _enforce). */
        enforce(permission, ctx) {
            if (auth.can(permission)) return true;
            if (SYSOS.audit) SYSOS.audit.record({
                action: 'permission_denied', domain: (ctx && ctx.domain) || 'system', target: permission,
                source: 'rbac', reason: auth.current.role + ' lacks ' + permission,
                notes: auth.current.name + ' denied ' + permission
            });
            throw new Error('permission denied: ' + permission);
        }
    };

    SYSOS.auth = auth;
})();
