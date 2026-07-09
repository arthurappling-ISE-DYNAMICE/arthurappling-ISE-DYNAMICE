/**
 * SYS_OS v3.9 — Environment Profiles + Production Config Guard
 *
 * A HONEST deployment-discipline safety layer. SYS_OS understands which
 * environment it runs in (DEV/LOCAL/STAGING/PRODUCTION) and BLOCKS unsafe
 * production behavior before any real hosting/auth/backend exists. This is NOT
 * production security — it prevents footguns and states the truth: SYS_OS is
 * local-first only until backend auth, durable persistence, hosting, HTTPS,
 * backups, and monitoring are implemented.
 *
 * Additive: default profile is LOCAL, where behavior is identical to v3.8.
 * Guards only activate in PRODUCTION (and warn in STAGING).
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;
    const el = function () { return SYSOS.utils.el.apply(null, arguments); };
    const PROFILE_KEY = 'sysos.environment.profile';

    const PROFILES = Object.freeze({
        DEV: Object.freeze({ name: 'DEV', label: 'DEVELOPMENT', purpose: 'Engineering / testing.',
            risk: 'LOW', indicator: 'text-sky-400', blocked: [], guard: 'INACTIVE',
            allowed: ['demo', 'reset', 'backup', 'restore'], warnings: [] }),
        LOCAL: Object.freeze({ name: 'LOCAL', label: 'LOCAL SOVEREIGN', purpose: 'Single trusted operator, local-first (default).',
            risk: 'LOW', indicator: 'text-emerald-400', blocked: [], guard: 'INACTIVE',
            allowed: ['demo', 'reset', 'backup', 'restore'], warnings: [] }),
        STAGING: Object.freeze({ name: 'STAGING', label: 'STAGING', purpose: 'Pre-production rehearsal.',
            risk: 'MEDIUM', indicator: 'text-amber-400', blocked: [], guard: 'ADVISORY',
            allowed: ['demo', 'reset', 'backup', 'restore'],
            warnings: ['Not production-secure — local-first only.', 'Backend auth, server persistence, hosting, monitoring not present.'] }),
        PRODUCTION: Object.freeze({ name: 'PRODUCTION', label: 'PRODUCTION', purpose: 'Live client use (gated).',
            risk: 'CRITICAL', indicator: 'text-red-400', blocked: ['demo', 'reset', 'unlocked_boot'], guard: 'ACTIVE',
            allowed: ['backup'],
            warnings: ['SYS_OS is NOT production-secure.', 'Backend authentication missing.', 'Server persistence missing.',
                'Hosting not configured.', 'Monitoring missing.'] })
    });

    function detect() {
        try {
            const u = new URLSearchParams(location.search).get('profile');
            if (u && PROFILES[u.toUpperCase()]) return u.toUpperCase();
        } catch (e) { /* no URL */ }
        const stored = SYSOS.storage.get(PROFILE_KEY);
        if (stored && PROFILES[stored]) return stored;
        if (SYSOS.CONFIG && SYSOS.CONFIG.PROFILE && PROFILES[SYSOS.CONFIG.PROFILE]) return SYSOS.CONFIG.PROFILE;
        return 'LOCAL';
    }

    let _current = 'LOCAL';

    function auditEv(action, meta) {
        try {
            if (SYSOS.audit && SYSOS.audit.record) SYSOS.audit.record(
                Object.assign({ action: action, domain: 'environment', target: _current, source: 'environment' }, meta || {}));
        } catch (e) { /* never break */ }
    }

    function rules(name) { return PROFILES[name || _current] || PROFILES.LOCAL; }

    // ---------- production guard ----------
    async function runProductionGuard() {
        const S = SYSOS;
        const chain = await S.vault.verifyChain();
        const integ = S.relations.integrity();
        const secure = !!window.isSecureContext;
        const demoOn = S.demo && S.demo.active;
        // v4.0: backend-aware auth + persistence (honest — BLOCK until configured + authenticated).
        let authStatus = { configured: false, authenticated: false };
        try { if (S.authRemote && S.authRemote.getAuthStatus) authStatus = await S.authRemote.getAuthStatus(); } catch (e) { /* tolerant */ }
        const remoteReady = !!(S.remoteBackend && authStatus.configured && authStatus.authenticated);
        // v4.2: monitoring readiness (honest — PASS only when the LOCAL sink is active).
        const mon = (S.monitoring && S.monitoring.getStatus) ? S.monitoring.getStatus() : null;
        const monActive = !!(mon && mon.active);
        const monCapture = !!(mon && mon.captureInstalled);
        const monGuard = !!(mon && mon.guardHookInstalled);
        const checks = [
            { name: 'Authentication', status: authStatus.authenticated ? 'PASS' : (authStatus.configured ? 'WARN' : 'BLOCK'),
                detail: authStatus.authenticated ? 'remote auth session active' : (authStatus.configured ? 'remote auth configured — sign-in required' : 'no backend authentication — ADMINISTRATOR is the no-password default') },
            { name: 'Server persistence', status: remoteReady ? 'PASS' : 'BLOCK',
                detail: remoteReady ? 'remote backend configured + authenticated' : 'localStorage only — no durable server store' },
            { name: 'Hosting / HTTPS', status: secure ? 'WARN' : 'BLOCK', detail: secure ? 'secure context OK, but no hosting configured (GitHub Pages CONFIG_REQUIRED)' : 'not a secure context — vault hash would degrade' },
            { name: 'Monitoring', status: monActive ? 'PASS' : 'BLOCK', detail: monActive ? 'runtime monitoring active (LOCAL sink — no external alerting)' : 'monitoring layer inactive' },
            { name: 'Runtime error capture', status: monCapture ? 'PASS' : 'BLOCK', detail: monCapture ? 'window error + unhandledrejection hooked' : 'no runtime error capture' },
            { name: 'Guard failure capture', status: monGuard ? 'PASS' : 'BLOCK', detail: monGuard ? 'guard/vault/integrity failures routed to monitoring' : 'no guard failure capture' },
            { name: 'RLS isolation verified', status: 'BLOCK', detail: 'live Supabase RLS isolation not verified (CONFIG_REQUIRED)' },
            { name: 'Rollback path', status: 'PASS', detail: 'app + GitHub Pages host rollback documented (v4.2)' },
            { name: 'Backup readiness', status: (S.backup ? 'PASS' : 'BLOCK'), detail: S.backup ? 'export/restore present (v3.8)' : 'backup module missing' },
            { name: 'Audit chain', status: (S.audit ? 'PASS' : 'BLOCK'), detail: 'append-only central audit present' },
            { name: 'Vault chain', status: (chain.valid ? 'PASS' : 'BLOCK'), detail: chain.valid ? chain.length + ' entries verified' : 'vault chain INVALID' },
            { name: 'Integrity', status: (integ.valid ? 'PASS' : 'BLOCK'), detail: integ.checked + ' links / ' + integ.broken.length + ' broken' },
            { name: 'Demo mode OFF', status: (demoOn ? 'BLOCK' : 'PASS'), detail: demoOn ? 'demo sandbox is ACTIVE' : 'live mode' },
            { name: 'Reset protection', status: 'PASS', detail: 'guarded reset (admin + token + snapshot) present' },
            { name: 'Localhost config', status: 'WARN', detail: 'CSP/telemetry hardcode localhost origins' }
        ];
        const blocks = checks.filter(function (c) { return c.status === 'BLOCK'; });
        const warns = checks.filter(function (c) { return c.status === 'WARN'; });
        const productionReady = blocks.length === 0;
        const result = {
            profile: _current,
            riskLevel: rules().risk,
            productionReady: productionReady,
            status: productionReady ? 'PRODUCTION_GUARD_PASSED' : 'PRODUCTION_BLOCKED',
            checks: checks,
            blockedActions: rules('PRODUCTION').blocked.slice(),
            blockingChecks: blocks.map(function (c) { return c.name; }),
            warnings: rules().warnings.concat(warns.map(function (c) { return c.name + ': ' + c.detail; })),
            summary: blocks.length + ' blocking / ' + warns.length + ' warnings'
        };
        // v4.2: route guard/vault/integrity failures into the monitoring sink (guarded).
        try {
            if (S.monitoring) {
                if (!chain.valid) S.monitoring.captureVaultFailure('vault chain invalid', { brokenAt: chain.brokenAt });
                if (!integ.valid) S.monitoring.captureIntegrityFailure(integ.broken.length + ' broken links', { broken: integ.broken.length });
                if (blocks.length && _current === 'PRODUCTION') S.monitoring.captureGuardFailure(result.summary, { blocking: result.blockingChecks });
            }
        } catch (e) { /* monitoring must never break the guard */ }
        auditEv('environment.guard_checked', { result: result.status, reason: result.summary,
            metadata: { profile: _current, blocking: result.blockingChecks, warnings: warns.length } });
        if (!productionReady && _current === 'PRODUCTION') {
            auditEv('environment.production_blocked', { result: 'PRODUCTION_BLOCKED', reason: result.summary,
                metadata: { blocking: result.blockingChecks } });
        }
        if (warns.length || rules().warnings.length) {
            auditEv('environment.warning_issued', { result: 'WARN', reason: result.summary, metadata: { warnings: result.warnings.length } });
        }
        return result;
    }

    // ---------- public API ----------
    const environment = {
        PROFILES: PROFILES,
        getCurrentProfile: function () { return _current; },
        getProfileRules: function (name) { return rules(name); },
        isProduction: function () { return _current === 'PRODUCTION'; },
        isStaging: function () { return _current === 'STAGING'; },
        isLocal: function () { return _current === 'LOCAL'; },
        isDev: function () { return _current === 'DEV'; },
        runProductionGuard: runProductionGuard,
        getBlockedActions: function () { return rules().blocked.slice(); },
        getWarnings: function () { return rules().warnings.slice(); },

        /** Is this action blocked by the active profile? (consulted by demo/reset.) */
        blocks: function (action) { return rules().blocked.indexOf(action) !== -1; },

        /** Switch profile (ADMIN / system.configure). Persisted. */
        setProfile: function (name) {
            name = String(name || '').toUpperCase();
            if (!PROFILES[name]) return { ok: false, reason: 'unknown_profile' };
            if (SYSOS.auth && !SYSOS.auth.can('system.configure')) {
                auditEv('environment.override_rejected', { reason: 'permission_denied', metadata: { attempted: name } });
                return { ok: false, reason: 'permission_denied' };
            }
            _current = name;
            try { SYSOS.storage.set(PROFILE_KEY, name); } catch (e) {}
            auditEv('environment.profile_detected', { result: name, reason: 'operator set', metadata: { profile: name, risk: rules().risk } });
            document.dispatchEvent(new CustomEvent('sysos:environment', { detail: { profile: name } }));
            return { ok: true, profile: name, risk: rules().risk };
        },

        init: function () {
            _current = detect();
            auditEv('environment.profile_detected', { result: _current, reason: 'boot detection', metadata: { profile: _current, risk: rules().risk } });
            SYSOS.router.register({ id: 'environment', label: '15 // ENVIRONMENT', render: function (p) { ui.mount(p); } });
            document.addEventListener('sysos:demo', function () { if (_panel) ui.refresh(); });
            // v4.2: refresh ONLY the monitoring sub-panel on monitoring events.
            // (renderStatusInto reads status without running the guard — no capture→refresh loop.)
            document.addEventListener('sysos:monitoring', function () {
                if (!_panel) return;
                const m = _panel.querySelector('#env-monitoring');
                if (m && SYSOS.monitoring && SYSOS.monitoring.renderStatusInto) SYSOS.monitoring.renderStatusInto(m);
            });
            document.addEventListener('click', function (e) {
                const b = e.target.closest('[data-env-action]');
                if (!b || !_panel || !_panel.contains(b)) return;
                if (b.dataset.envAction === 'set-profile') {
                    const sel = _panel.querySelector('#env-profile-select');
                    const res = environment.setProfile(sel.value);
                    SYSOS.utils.notify(res.ok ? 'PROFILE SET' : 'PROFILE CHANGE DENIED', [res.ok ? (res.profile + ' (risk ' + res.risk + ')') : (res.reason || 'error')]);
                    ui.refresh();
                }
            });
        }
    };

    // ---------- Station UI (15 // ENVIRONMENT) ----------
    let _panel = null;
    const ui = {
        mount: function (panel) { _panel = panel; panel.textContent = ''; panel.appendChild(ui.shell()); ui.refresh(); },
        shell: function () {
            const root = el('div', 'space-y-6 max-w-4xl');
            const head = el('div', 'border-b border-gold-500/10 pb-3');
            head.appendChild(el('h2', 'text-xs font-cyber font-semibold tracking-widest text-gold-400', 'Environment / Production Guard'));
            head.appendChild(el('p', 'text-[11px] font-mono text-slate-500 mt-0.5', 'Deployment-discipline safety layer · honest production readiness · local-first only'));
            root.appendChild(head);
            root.appendChild(el('div', 'bg-white/[0.02] border border-white/10 rounded-lg p-4')).id = 'env-current';
            // profile selector
            const sel = el('div', 'bg-white/[0.02] border border-white/10 rounded-lg p-4 flex items-center gap-2');
            sel.appendChild(el('div', 'text-[10px] font-mono text-slate-500 uppercase tracking-widest', 'Profile'));
            const select = el('select', 'bg-black border border-white/10 rounded px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-gold-500/40');
            select.id = 'env-profile-select';
            ['DEV', 'LOCAL', 'STAGING', 'PRODUCTION'].forEach(function (p) { const o = el('option', null, p); o.value = p; select.appendChild(o); });
            const setBtn = el('button', 'bg-transparent border border-gold-500/40 text-gold-400 font-mono text-xs px-4 py-2 rounded uppercase font-bold tracking-wider hover:bg-gold-500 hover:text-black transition-colors', 'SET PROFILE');
            setBtn.type = 'button'; setBtn.dataset.envAction = 'set-profile';
            sel.appendChild(select); sel.appendChild(setBtn);
            root.appendChild(sel);
            root.appendChild(el('div', 'bg-white/[0.02] border border-white/10 rounded-lg p-4')).id = 'env-guard';
            root.appendChild(el('div', 'bg-white/[0.02] border border-white/10 rounded-lg p-4')).id = 'env-monitoring';
            const note = el('div', 'text-[10px] font-mono text-amber-400/90 border border-amber-500/20 rounded p-3 bg-amber-950/10');
            note.textContent = 'SYS_OS is not production-ready until backend authentication, durable persistence, hosting, HTTPS, backups, and monitoring are implemented. This guard prevents unsafe production behavior; it is not production security.';
            root.appendChild(note);
            return root;
        },
        refresh: async function () {
            if (!_panel) return;
            const r = environment.getProfileRules();
            const sel = _panel.querySelector('#env-profile-select'); if (sel) sel.value = environment.getCurrentProfile();
            const cur = _panel.querySelector('#env-current');
            if (cur) {
                cur.textContent = '';
                cur.appendChild(el('div', 'text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2', 'Current Environment'));
                const row = el('div', 'flex items-center gap-3 flex-wrap text-[11px] font-mono');
                row.appendChild(el('span', 'text-lg font-bold ' + r.indicator, r.name + ' · ' + r.label));
                row.appendChild(el('span', 'text-slate-500', 'risk ' + r.risk + ' · guard ' + r.guard));
                cur.appendChild(row);
                cur.appendChild(el('div', 'text-[11px] font-mono text-slate-400 mt-1', r.purpose));
                if (r.blocked.length) cur.appendChild(el('div', 'text-[11px] font-mono text-red-400 mt-1', 'Blocked in this profile: ' + r.blocked.join(', ')));
            }
            const g = _panel.querySelector('#env-guard');
            if (g) {
                g.textContent = '';
                g.appendChild(el('div', 'text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2', 'Production Guard'));
                const res = await environment.runProductionGuard();
                const statusTone = res.productionReady ? 'text-emerald-400' : 'text-red-400';
                g.appendChild(el('div', 'font-bold font-mono text-xs ' + statusTone, res.status + ' · ' + res.summary));
                const tbl = el('div', 'grid grid-cols-1 md:grid-cols-2 gap-1 mt-2');
                res.checks.forEach(function (c) {
                    const tone = c.status === 'PASS' ? 'text-emerald-400' : (c.status === 'WARN' ? 'text-amber-400' : 'text-red-400');
                    const rowEl = el('div', 'flex items-start justify-between gap-2 text-[11px] font-mono border-b border-white/[0.04] py-0.5');
                    rowEl.appendChild(el('span', 'text-slate-400', c.name));
                    rowEl.appendChild(el('span', tone + ' shrink-0', c.status));
                    g.appendChild(rowEl);
                });
                if (res.warnings.length) {
                    g.appendChild(el('div', 'text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-2 mb-1', 'Warnings'));
                    res.warnings.forEach(function (w) { g.appendChild(el('div', 'text-amber-400 text-[11px] font-mono', '  ! ' + w)); });
                }
            }
            // v4.2 monitoring status surface (rendered by the monitoring module).
            const m = _panel.querySelector('#env-monitoring');
            if (m && SYSOS.monitoring && SYSOS.monitoring.renderStatusInto) SYSOS.monitoring.renderStatusInto(m);
        }
    };

    SYSOS.environment = environment;
})();
