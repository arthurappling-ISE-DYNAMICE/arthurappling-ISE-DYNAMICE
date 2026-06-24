/**
 * SYS_OS v4.0 — Remote Backend Adapter (Supabase KV) + Pilot Backend station.
 *
 * Durable, per-user key/value storage for `sysos.*` blobs over Supabase. The
 * backend stores opaque strings; vault/audit chains stay client-side.
 *
 * FOUNDATION SCOPE (honest): the existing storage backend contract is SYNCHRONOUS
 * (getItem -> string). Supabase is ASYNC. This module provides the async
 * primitives + explicit operator sync + health, and a guarded register(). It does
 * NOT auto-replace the live synchronous localStorage backend and NEVER
 * auto-overwrites local data — LOCAL mode is preserved exactly as v3.9. Live
 * backend swap is deferred to a future async-storage release.
 *
 * Safe no-op when the Supabase SDK/config is absent (the shipped default).
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;
    const el = function () { return SYSOS.utils.el.apply(null, arguments); };
    const PREFIX = 'sysos';

    function cfg() {
        const base = (SYSOS.CONFIG && SYSOS.CONFIG.BACKEND) || {};
        const rt = (window.__SYSOS_RUNTIME__ && window.__SYSOS_RUNTIME__.BACKEND) || {};
        return Object.assign({}, base, rt);
    }
    function table() { return cfg().KV_TABLE || 'sysos_kv_state'; }
    function R() { return SYSOS.authRemote; }
    function audit(action, meta) {
        try { if (SYSOS.audit && SYSOS.audit.record) SYSOS.audit.record(
            Object.assign({ action: action, domain: 'remote_backend', target: 'supabase', source: 'remote_backend' }, meta || {})); }
        catch (e) { /* never break */ }
    }

    const remote = {
        isConfigured: function () { return !!(R() && R().isConfigured()); },
        isAuthenticated: async function () {
            if (!this.isConfigured()) return false;
            try { return !!(await R().getSession()); } catch (e) { return false; }
        },

        /** Reachability + RLS sanity (a SELECT under the current user). */
        healthCheck: async function () {
            if (!R() || !R().sdkAvailable()) return { ok: false, status: 'SDK_MISSING', detail: 'Supabase SDK not loaded' };
            if (!this.isConfigured()) return { ok: false, status: 'CONFIG_REQUIRED', detail: 'Supabase URL/anon key + REMOTE_ENABLED required' };
            const cl = R().client(); if (!cl) return { ok: false, status: 'CONFIG_REQUIRED', detail: 'client unavailable' };
            if (!(await this.isAuthenticated())) return { ok: false, status: 'UNAUTHENTICATED', detail: 'sign in to verify RLS-scoped access' };
            try {
                const { error } = await cl.from(table()).select('storage_key', { count: 'exact', head: true });
                if (error) { audit('remote_backend.health_failed', { reason: error.message }); return { ok: false, status: 'FAIL', detail: error.message }; }
                audit('remote_backend.health_ok', {});
                return { ok: true, status: 'PASS', detail: 'reachable; RLS-scoped query ok' };
            } catch (e) { return { ok: false, status: 'FAIL', detail: String(e.message || e) }; }
        },

        // ---- async KV primitives (per-user via RLS) ----
        async _uid() { const u = await R().getUser(); return u ? u.id : null; },
        listKeys: async function () {
            const cl = R() && R().client(); if (!cl || !(await this.isAuthenticated())) return [];
            try {
                const { data, error } = await cl.from(table()).select('storage_key');
                if (error) return [];
                return (data || []).map(function (r) { return r.storage_key; }).filter(function (k) { return k.indexOf(PREFIX) === 0; });
            } catch (e) { return []; }
        },
        getItem: async function (key) {
            const cl = R() && R().client(); if (!cl || !(await this.isAuthenticated())) return null;
            try {
                const { data, error } = await cl.from(table()).select('storage_value').eq('storage_key', key).maybeSingle();
                if (error || !data) return null;
                return data.storage_value;
            } catch (e) { return null; }
        },
        setItem: async function (key, value) {
            const cl = R() && R().client(); const uid = await this._uid();
            if (!cl || !uid) return { ok: false, reason: 'not_authenticated' };
            try {
                const { error } = await cl.from(table()).upsert({ user_id: uid, storage_key: key, storage_value: String(value) }, { onConflict: 'user_id,storage_key' });
                if (error) return { ok: false, reason: error.message };
                return { ok: true };
            } catch (e) { return { ok: false, reason: String(e.message || e) }; }
        },
        removeItem: async function (key) {
            const cl = R() && R().client(); if (!cl || !(await this.isAuthenticated())) return { ok: false, reason: 'not_authenticated' };
            try { const { error } = await cl.from(table()).delete().eq('storage_key', key); return { ok: !error, reason: error && error.message }; }
            catch (e) { return { ok: false, reason: String(e.message || e) }; }
        },
        clearNamespace: async function (prefix) {
            prefix = prefix || PREFIX;
            const keys = (await this.listKeys()).filter(function (k) { return k.indexOf(prefix) === 0; });
            for (let i = 0; i < keys.length; i++) await this.removeItem(keys[i]);
            return { ok: true, removed: keys.length };
        },

        // ---- explicit, operator-triggered sync (NEVER automatic) ----
        /** Pull remote state DOWN to local (operator action; export a backup first). Deferred. */
        syncToLocal: async function () {
            if (!this.isConfigured()) return { ok: false, reason: 'config_required', note: 'remote→local pull requires configured+authenticated Supabase; export a v3.8 backup first' };
            if (!(await this.isAuthenticated())) return { ok: false, reason: 'not_authenticated' };
            return { ok: false, reason: 'deferred', note: 'operator-triggered sync deferred to a future async-storage release; LOCAL preserved' };
        },
        /** Push local state UP to remote (operator action). Deferred. */
        syncFromLocal: async function () {
            if (!this.isConfigured()) return { ok: false, reason: 'config_required', note: 'local→remote push requires configured+authenticated Supabase' };
            if (!(await this.isAuthenticated())) return { ok: false, reason: 'not_authenticated' };
            return { ok: false, reason: 'deferred', note: 'operator-triggered sync deferred to a future async-storage release' };
        },

        /**
         * Install a cache-backed synchronous backend over the storage seam.
         * DEFERRED in the foundation: requires an async preload + the async-storage
         * path. Returns a structured status; never silently swaps the live store.
         */
        register: async function () {
            if (!this.isConfigured()) return { ok: false, reason: 'config_required' };
            if (!(await this.isAuthenticated())) return { ok: false, reason: 'not_authenticated' };
            return { ok: false, reason: 'deferred', note: 'live backend swap requires the async-storage path (future release). Use explicit sync; LOCAL preserved.' };
        },

        // ---- station 16 // PILOT BACKEND ----
        init: function () {
            SYSOS.router.register({ id: 'pilot-backend', label: '16 // PILOT BACKEND', render: function (p) { ui.mount(p); } });
            audit('remote_backend.detected', { result: this.isConfigured() ? 'configured' : 'not_configured' });
            document.addEventListener('click', async function (e) {
                const b = e.target.closest('[data-pb-action]');
                if (!b || !ui.panel || !ui.panel.contains(b)) return;
                if (b.dataset.pbAction === 'health') { ui.health = await remote.healthCheck(); ui.refresh(); SYSOS.utils.notify('REMOTE HEALTH', [ui.health.status + ' — ' + ui.health.detail]); }
                else if (b.dataset.pbAction === 'signin') {
                    const em = ui.panel.querySelector('#pb-email').value, pw = ui.panel.querySelector('#pb-pass').value;
                    const res = await R().signIn(em, pw); SYSOS.utils.notify(res.ok ? 'SIGNED IN' : 'SIGN-IN UNAVAILABLE', [res.ok ? (res.user && res.user.email) : (res.reason || '')]); ui.refresh();
                }
                else if (b.dataset.pbAction === 'signout') { const res = await R().signOut(); SYSOS.utils.notify('SIGN OUT', [res.ok ? 'signed out' : (res.reason || '')]); ui.refresh(); }
                else if (b.dataset.pbAction === 'validate') { ui.health = await remote.healthCheck(); ui.refresh(); }
            });
        }
    };

    const ui = {
        panel: null, health: null,
        mount: function (panel) { this.panel = panel; panel.textContent = ''; panel.appendChild(this.shell()); this.refresh(); },
        shell: function () {
            const root = el('div', 'space-y-6 max-w-4xl');
            const head = el('div', 'border-b border-gold-500/10 pb-3');
            head.appendChild(el('h2', 'text-xs font-cyber font-semibold tracking-widest text-gold-400', 'Pilot Backend (Supabase)'));
            head.appendChild(el('p', 'text-[11px] font-mono text-slate-500 mt-0.5', 'Foundation only · local-first preserved · opt-in remote · NOT full production'));
            root.appendChild(head);
            root.appendChild(el('div', 'bg-white/[0.02] border border-white/10 rounded-lg p-4')).id = 'pb-status';
            // sign-in (safe: no-op if not configured)
            const auth = el('div', 'bg-white/[0.02] border border-white/10 rounded-lg p-4 space-y-2');
            auth.appendChild(el('div', 'text-[10px] font-mono text-slate-500 uppercase tracking-widest', 'Remote Session'));
            const row = el('div', 'flex flex-col md:flex-row gap-2');
            const em = el('input', 'flex-1 bg-black border border-white/10 rounded px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold-500/40'); em.type = 'email'; em.id = 'pb-email'; em.placeholder = 'email'; em.setAttribute('aria-label', 'email');
            const pw = el('input', 'flex-1 bg-black border border-white/10 rounded px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold-500/40'); pw.type = 'password'; pw.id = 'pb-pass'; pw.placeholder = 'password'; pw.setAttribute('aria-label', 'password');
            const inBtn = el('button', 'bg-transparent border border-gold-500/40 text-gold-400 font-mono text-xs px-4 py-2 rounded uppercase font-bold tracking-wider hover:bg-gold-500 hover:text-black transition-colors', 'SIGN IN'); inBtn.type = 'button'; inBtn.dataset.pbAction = 'signin';
            const outBtn = el('button', 'bg-transparent border border-white/15 text-slate-400 font-mono text-xs px-4 py-2 rounded uppercase tracking-wider hover:text-slate-200 transition-colors', 'SIGN OUT'); outBtn.type = 'button'; outBtn.dataset.pbAction = 'signout';
            row.appendChild(em); row.appendChild(pw); row.appendChild(inBtn); row.appendChild(outBtn);
            auth.appendChild(row);
            const hBtn = el('button', 'bg-transparent border border-gold-500/40 text-gold-400 font-mono text-xs px-4 py-2 rounded uppercase font-bold tracking-wider hover:bg-gold-500 hover:text-black transition-colors', 'CHECK REMOTE HEALTH'); hBtn.type = 'button'; hBtn.dataset.pbAction = 'health';
            auth.appendChild(hBtn);
            root.appendChild(auth);
            const note = el('div', 'text-[10px] font-mono text-amber-400/90 border border-amber-500/20 rounded p-3 bg-amber-950/10');
            note.textContent = 'PILOT FOUNDATION — not full production. Local mode is preserved and remains the default. Never put a Supabase service-role key in the frontend. Always export a v3.8 backup before any future sync. PRODUCTION stays BLOCKED until auth + persistence + hosting + monitoring are real.';
            root.appendChild(note);
            return root;
        },
        refresh: async function () {
            if (!this.panel) return;
            const box = this.panel.querySelector('#pb-status'); if (!box) return;
            const c = cfg();
            const status = R() ? await R().getAuthStatus() : { status: 'SDK_MISSING', configured: false, authenticated: false, detail: 'auth module missing' };
            box.textContent = '';
            box.appendChild(el('div', 'text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2', 'Backend Status'));
            const grid = el('div', 'grid grid-cols-1 md:grid-cols-2 gap-1 text-[11px] font-mono');
            const cell = function (k, v, tone) { const d = el('div', 'flex justify-between gap-2 border-b border-white/[0.04] py-0.5'); d.appendChild(el('span', 'text-slate-600', k)); d.appendChild(el('span', (tone || 'text-slate-200') + ' shrink-0', v)); return d; };
            const mode = c.REMOTE_ENABLED ? 'REMOTE_SUPABASE' : 'LOCAL';
            grid.appendChild(cell('Backend mode', mode, mode === 'LOCAL' ? 'text-emerald-400' : 'text-amber-400'));
            grid.appendChild(cell('Live store', SYSOS.storage.backendName, 'text-emerald-400'));
            grid.appendChild(cell('Supabase config', status.status, status.configured ? (status.authenticated ? 'text-emerald-400' : 'text-amber-400') : 'text-slate-400'));
            grid.appendChild(cell('Authenticated', status.authenticated ? 'YES' : 'no', status.authenticated ? 'text-emerald-400' : 'text-slate-400'));
            grid.appendChild(cell('Remote health', this.health ? this.health.status : '(not checked)', this.health ? (this.health.ok ? 'text-emerald-400' : 'text-amber-400') : 'text-slate-500'));
            grid.appendChild(cell('Persistence', c.REMOTE_ENABLED && status.authenticated ? 'remote available' : 'local only', 'text-slate-300'));
            grid.appendChild(cell('User isolation', status.authenticated ? 'RLS (authenticated user)' : 'RLS schema + auth required', status.authenticated ? 'text-emerald-400' : 'text-slate-400'));
            box.appendChild(grid);
            box.appendChild(el('div', 'text-[11px] font-mono text-slate-500 mt-2', status.detail || ''));
        }
    };

    SYSOS.remoteBackend = remote;
})();
