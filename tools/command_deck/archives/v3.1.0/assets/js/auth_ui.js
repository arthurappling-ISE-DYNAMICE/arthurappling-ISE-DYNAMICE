/**
 * SYS_OS v3.1 — Authentication Surface (Phase 4)
 *
 * Login surface over the existing RBAC engine (auth.js). Station 13 // ACCESS:
 * login form (operator + role), operator identity, role display, permission
 * matrix display, session status, logout. Uses SYSOS.auth.MATRIX verbatim —
 * permissions are never weakened here; this is presentation + session state
 * only. Logout drops the session to READ_ONLY (guest), so privileged actions
 * fail closed.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;
    const el = function () { return SYSOS.utils.el.apply(null, arguments); };

    // Session lives here; auth.current stays the source of truth for role.
    const session = { active: false, since: null, operator: null };

    const auth_ui = {
        session: session,

        login(name, role) {
            SYSOS.auth.setOperator(name, role);   // enforces valid role
            session.active = true;
            session.since = new Date().toISOString();
            session.operator = name;
            if (SYSOS.audit) SYSOS.audit.record({ action: 'login', domain: 'system', target: name, after: { role: role }, source: 'auth-ui' });
            document.dispatchEvent(new CustomEvent('sysos:auth', { detail: { event: 'login', role: role } }));
            return SYSOS.auth.current;
        },

        logout() {
            const who = SYSOS.auth.current.name;
            SYSOS.auth.setOperator('(guest)', 'READ_ONLY');   // fail-closed
            session.active = false; session.since = null; session.operator = null;
            if (SYSOS.audit) SYSOS.audit.record({ action: 'logout', domain: 'system', target: who, source: 'auth-ui' });
            document.dispatchEvent(new CustomEvent('sysos:auth', { detail: { event: 'logout' } }));
            return SYSOS.auth.current;
        },

        // ---- station contract ----
        init() {
            const station = this;
            SYSOS.router.register({ id: 'access', label: '13 // ACCESS', render: function (p) { station.mount(p); } });
            ['sysos:auth', 'sysos:audit'].forEach(function (evt) { document.addEventListener(evt, function () { station.refresh(); }); });
        },
        _panel: null,
        mount(panel) { this._panel = panel; panel.textContent = ''; panel.appendChild(this._shell()); this.refresh(); },
        unmount() { if (this._panel) this._panel.textContent = ''; this._panel = null; },
        validate() { return { ok: !!this._panel, station: 'access', mounted: !!this._panel }; },

        _shell() {
            const root = el('div', 'space-y-6 max-w-3xl');
            // header
            const head = el('div', 'flex items-center justify-between border-b border-white/10 pb-3');
            const ht = el('div');
            ht.appendChild(el('h2', 'text-sm font-semibold text-slate-100 tracking-wide', 'Access Control'));
            ht.appendChild(el('p', 'text-[11px] font-mono text-slate-500 mt-0.5', 'Operator identity · RBAC session · permission matrix'));
            head.appendChild(ht);
            root.appendChild(head);

            // login form
            const form = el('form', 'bg-white/[0.02] border border-white/10 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-3');
            form.id = 'auth-login-form'; form.setAttribute('aria-label', 'Operator login');
            const nameWrap = el('div', 'flex flex-col gap-1 md:col-span-1');
            const nl = el('label', 'text-[9px] font-mono text-slate-500 uppercase tracking-widest', 'Operator'); nl.setAttribute('for', 'auth-name');
            const name = el('input', 'bg-black border border-white/10 rounded px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-gold-500/40');
            name.id = 'auth-name'; name.value = SYSOS.CONFIG.IDENTITY.NAME; name.setAttribute('aria-label', 'Operator name');
            nameWrap.appendChild(nl); nameWrap.appendChild(name);
            const roleWrap = el('div', 'flex flex-col gap-1');
            const rl = el('label', 'text-[9px] font-mono text-slate-500 uppercase tracking-widest', 'Role'); rl.setAttribute('for', 'auth-role');
            const role = el('select', 'bg-black border border-white/10 rounded px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-gold-500/40');
            role.id = 'auth-role'; role.setAttribute('aria-label', 'Role');
            SYSOS.auth.ROLES.forEach(function (r) { const o = el('option', null, r); o.value = r; role.appendChild(o); });
            roleWrap.appendChild(rl); roleWrap.appendChild(role);
            const actions = el('div', 'flex items-end gap-2');
            const loginBtn = el('button', 'bg-transparent border border-gold-500 text-gold-400 font-mono text-xs px-4 py-2 rounded uppercase font-bold tracking-wider hover:bg-gold-500 hover:text-black transition-colors', 'LOG IN');
            loginBtn.type = 'submit';
            const logoutBtn = el('button', 'bg-transparent border border-white/15 text-slate-400 font-mono text-xs px-4 py-2 rounded uppercase tracking-wider hover:text-slate-200 transition-colors', 'LOG OUT');
            logoutBtn.type = 'button'; logoutBtn.dataset.authAction = 'logout';
            actions.appendChild(loginBtn); actions.appendChild(logoutBtn);
            form.appendChild(nameWrap); form.appendChild(roleWrap); form.appendChild(actions);
            root.appendChild(form);

            // status + permissions
            root.appendChild(el('div', 'bg-white/[0.02] border border-white/10 rounded-lg p-4')).id = 'auth-status';
            root.appendChild(el('div', 'bg-white/[0.02] border border-white/10 rounded-lg p-4')).id = 'auth-perms';

            const self = this;
            form.addEventListener('submit', function (e) { e.preventDefault(); self.login(name.value.trim() || '(operator)', role.value); });
            return root;
        },

        refresh() {
            if (!this._panel) return;
            const cur = SYSOS.auth.current;
            const status = this._panel.querySelector('#auth-status');
            if (status) {
                status.textContent = '';
                status.appendChild(el('div', 'text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2', 'Session'));
                const grid = el('div', 'grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono');
                const pair = function (k, v, tone) { const d = el('div'); d.appendChild(el('div', 'text-slate-600', k)); d.appendChild(el('div', tone || 'text-slate-200', v)); return d; };
                grid.appendChild(pair('Operator', cur.name));
                grid.appendChild(pair('Role', cur.role, cur.role === 'ADMINISTRATOR' ? 'text-gold-400' : 'text-slate-200'));
                grid.appendChild(pair('Status', session.active ? 'AUTHENTICATED' : 'GUEST', session.active ? 'text-emerald-400' : 'text-amber-400'));
                grid.appendChild(pair('Since', session.since ? new Date(session.since).toLocaleTimeString() : '—'));
                status.appendChild(grid);
            }
            const perms = this._panel.querySelector('#auth-perms');
            if (perms) {
                perms.textContent = '';
                perms.appendChild(el('div', 'text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2', 'Permissions for ' + cur.role));
                const wrap = el('div', 'grid grid-cols-1 md:grid-cols-2 gap-1');
                Object.keys(SYSOS.auth.MATRIX).forEach(function (p) {
                    const ok = SYSOS.auth.can(p);
                    const row = el('div', 'flex items-center justify-between text-[11px] font-mono border-b border-white/[0.04] py-1');
                    row.appendChild(el('span', 'text-slate-400', p));
                    row.appendChild(el('span', ok ? 'text-emerald-400' : 'text-slate-600', ok ? 'ALLOW' : 'DENY'));
                    wrap.appendChild(row);
                });
                perms.appendChild(wrap);
            }
        }
    };

    // delegated logout
    document.addEventListener('click', function (e) {
        const b = e.target.closest('[data-auth-action="logout"]');
        if (b) auth_ui.logout();
    });

    SYSOS.authUI = auth_ui;
})();
