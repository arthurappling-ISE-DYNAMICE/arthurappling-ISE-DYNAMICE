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

    // All live local sysos.* state (excludes transient pre-restore snapshots).
    function localState() {
        const out = {};
        SYSOS.storage.keys().forEach(function (k) {
            if (k.indexOf('sysos.backup.prerestore') === 0) return;
            out[k] = SYSOS.storage.get(k);
        });
        return out;
    }

    // Re-hydrate in-memory stores from local storage (after a pull / rollback).
    function rehydrate() {
        ['activity', 'stores', 'vault', 'audit', 'compliance', 'ocr', 'opsQueue'].forEach(function (mod) {
            try { if (SYSOS[mod] && typeof SYSOS[mod].restore === 'function') SYSOS[mod].restore(); } catch (e) { /* tolerant */ }
        });
        try { if (SYSOS.relations.invalidateIndex) SYSOS.relations.invalidateIndex(); } catch (e) {}
        try { document.dispatchEvent(new CustomEvent('sysos:data', { detail: { domain: 'clients' } })); } catch (e) {}
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

        // ---- explicit, operator-triggered sync (v4.1; NEVER automatic) ----
        async _gate(direction) {
            if (!this.isConfigured()) return { ok: false, reason: 'config_required', note: direction + ' requires configured Supabase (see pilot_backend/README.md)' };
            if (!(await this.isAuthenticated())) return { ok: false, reason: 'not_authenticated', note: 'sign in first' };
            return { ok: true };
        },
        /** Write a per-user backup-event row (best-effort; never blocks sync). */
        async _logBackupEvent(eventType, summary) {
            try {
                const cl = R() && R().client(); const uid = await this._uid();
                if (!cl || !uid) return;
                await cl.from('sysos_backup_events').insert({ user_id: uid, event_type: eventType, summary: summary || {} });
            } catch (e) { /* best-effort */ }
        },

        /** Conflict preview — NO mutation. Classifies local-only / remote-only / differing keys. */
        preview: async function () {
            const g = await this._gate('preview'); if (!g.ok) return g;
            const local = localState();
            const localKeys = Object.keys(local);
            const remoteKeys = await this.listKeys();
            const remoteSet = {}; remoteKeys.forEach(function (k) { remoteSet[k] = true; });
            const localSet = {}; localKeys.forEach(function (k) { localSet[k] = true; });
            const localOnly = localKeys.filter(function (k) { return !remoteSet[k]; });
            const remoteOnly = remoteKeys.filter(function (k) { return !localSet[k]; });
            const both = localKeys.filter(function (k) { return remoteSet[k]; });
            let differ = 0;
            for (let i = 0; i < both.length; i++) { const rv = await this.getItem(both[i]); if (rv !== local[both[i]]) differ++; }
            audit('remote.conflict_detected', { metadata: { localCount: localKeys.length, remoteCount: remoteKeys.length, localOnly: localOnly.length, remoteOnly: remoteOnly.length, differ: differ } });
            return { ok: true, localCount: localKeys.length, remoteCount: remoteKeys.length,
                localOnly: localOnly.length, remoteOnly: remoteOnly.length, both: both.length, differ: differ };
        },

        /** PUSH: upload all local sysos.* to remote. Backup-gated + confirmation phrase. */
        syncFromLocal: async function (opts) {
            opts = opts || {};
            const g = await this._gate('push'); if (!g.ok) return g;
            if (!opts.backupConfirmed) { audit('remote.sync_rejected', { reason: 'backup_required', metadata: { direction: 'push' } }); return { ok: false, reason: 'backup_required', note: 'export a v3.8 backup and confirm before pushing' }; }
            if (opts.confirm !== 'PUSH TO REMOTE') { audit('remote.sync_rejected', { reason: 'confirmation_required', metadata: { direction: 'push' } }); return { ok: false, reason: 'confirmation_required', note: "type 'PUSH TO REMOTE'" }; }
            const local = localState();
            const keys = Object.keys(local);
            audit('remote.sync_push_started', { metadata: { keys: keys.length } });
            let uploaded = 0, failed = 0; const errors = [];
            for (let i = 0; i < keys.length; i++) {
                const res = await this.setItem(keys[i], local[keys[i]]);
                if (res && res.ok) uploaded++; else { failed++; if (errors.length < 5) errors.push(keys[i] + ': ' + (res && res.reason)); }
            }
            const after = await this.listKeys();
            const afterSet = {}; after.forEach(function (k) { afterSet[k] = true; });
            const allPresent = keys.every(function (k) { return afterSet[k]; });
            if (failed > 0 || !allPresent) {
                audit('remote.sync_push_failed', { reason: failed + ' failed / allPresent=' + allPresent, metadata: { uploaded: uploaded, failed: failed } });
                return { ok: false, reason: 'partial_failure', uploaded: uploaded, failed: failed, errors: errors };
            }
            await this._logBackupEvent('sync_to_remote', { uploaded: uploaded });
            audit('remote.sync_push_completed', { metadata: { uploaded: uploaded, remoteCount: after.length } });
            return { ok: true, uploaded: uploaded, remoteCount: after.length, verified: true };
        },

        /** PULL: overwrite local with remote. Backup-gated + snapshot + confirm + verify + rollback. */
        syncToLocal: async function (opts) {
            opts = opts || {};
            const g = await this._gate('pull'); if (!g.ok) return g;
            if (!opts.backupConfirmed) { audit('remote.sync_rejected', { reason: 'backup_required', metadata: { direction: 'pull' } }); return { ok: false, reason: 'backup_required', note: 'export a v3.8 backup and confirm before pulling (pull OVERWRITES local)' }; }
            if (opts.confirm !== 'PULL FROM REMOTE') { audit('remote.sync_rejected', { reason: 'confirmation_required', metadata: { direction: 'pull' } }); return { ok: false, reason: 'confirmation_required', note: "type 'PULL FROM REMOTE'" }; }
            audit('remote.sync_pull_started', {});
            // pre-pull local snapshot (reuse the v3.8 prerestore key namespace)
            const snapKey = 'sysos.backup.prerestore.' + Date.now();
            const snapshot = {}; SYSOS.storage.keys().forEach(function (k) { snapshot[k] = SYSOS.storage.get(k); });
            try { SYSOS.storage.setJSON(snapKey, { createdAt: new Date().toISOString(), keys: snapshot }); } catch (e) { /* best-effort */ }
            try {
                const remoteKeys = await this.listKeys();
                if (!remoteKeys.length) throw new Error('remote is empty — nothing to pull');
                const incoming = {};
                for (let i = 0; i < remoteKeys.length; i++) { incoming[remoteKeys[i]] = await this.getItem(remoteKeys[i]); }
                // clear current sysos.* (except snapshots) then write remote
                SYSOS.storage.keys().forEach(function (k) { if (k === snapKey || k.indexOf('sysos.backup.prerestore') === 0) return; SYSOS.storage.remove(k); });
                Object.keys(incoming).forEach(function (k) { if (incoming[k] != null && k.indexOf('sysos.') === 0) SYSOS.storage.set(k, incoming[k]); });
                rehydrate();
                const chain = await SYSOS.vault.verifyChain();
                const integ = SYSOS.relations.integrity();
                if (!chain.valid) throw new Error('post-pull vault chain INVALID (brokenAt ' + chain.brokenAt + ')');
                await this._logBackupEvent('sync_from_remote', { pulled: remoteKeys.length });
                audit('remote.sync_pull_completed', { metadata: { pulled: remoteKeys.length, chainValid: chain.valid, integrityBroken: integ.broken.length } });
                return { ok: true, pulled: remoteKeys.length, snapshotKey: snapKey, reloadRecommended: true,
                    verification: { vaultChain: chain.valid, integrityValid: integ.valid, integrityBroken: integ.broken.length, auditEvents: SYSOS.audit.count ? SYSOS.audit.count() : null } };
            } catch (e) {
                // rollback to pre-pull snapshot
                try {
                    SYSOS.storage.keys().forEach(function (k) { if (k.indexOf('sysos.backup.prerestore') !== 0) SYSOS.storage.remove(k); });
                    Object.keys(snapshot).forEach(function (k) { SYSOS.storage.set(k, snapshot[k]); });
                    rehydrate();
                } catch (re) { /* best-effort */ }
                audit('remote.sync_pull_failed', { reason: String(e.message || e), notes: 'rolled back to pre-pull snapshot ' + snapKey });
                return { ok: false, reason: String(e.message || e), rolledBack: true, snapshotKey: snapKey };
            }
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
                else if (b.dataset.pbAction === 'preview') {
                    const r = await remote.preview(); ui.showPreview(r);
                    SYSOS.utils.notify('SYNC PREVIEW', [r.ok ? ('local ' + r.localCount + ' · remote ' + r.remoteCount + ' · differ ' + r.differ) : (r.reason || 'error')]);
                }
                else if (b.dataset.pbAction === 'push') {
                    const ack = ui.panel.querySelector('#pb-backup-ack').checked;
                    const phrase = ui.panel.querySelector('#pb-push-phrase').value.trim();
                    const r = await remote.syncFromLocal({ backupConfirmed: ack, confirm: phrase });
                    ui.showSyncResult('PUSH', r); SYSOS.utils.notify(r.ok ? 'PUSH COMPLETE' : 'PUSH NOT APPLIED', [r.ok ? (r.uploaded + ' keys uploaded') : (r.reason || 'error')]);
                }
                else if (b.dataset.pbAction === 'pull') {
                    const ack = ui.panel.querySelector('#pb-backup-ack').checked;
                    const phrase = ui.panel.querySelector('#pb-pull-phrase').value.trim();
                    const r = await remote.syncToLocal({ backupConfirmed: ack, confirm: phrase });
                    ui.showSyncResult('PULL', r); ui.refresh(); SYSOS.utils.notify(r.ok ? 'PULL COMPLETE' : 'PULL NOT APPLIED', [r.ok ? (r.pulled + ' keys pulled — reload to refresh UI') : (r.reason || 'error')]);
                }
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

            // v4.1: explicit sync (push/pull) — backup-gated + confirmation phrases.
            const sync = el('div', 'bg-white/[0.02] border border-white/10 rounded-lg p-4 space-y-2');
            sync.appendChild(el('div', 'text-[10px] font-mono text-slate-500 uppercase tracking-widest', 'Explicit Sync (operator-controlled)'));
            const preBtn = el('button', 'bg-transparent border border-gold-500/40 text-gold-400 font-mono text-xs px-4 py-2 rounded uppercase font-bold tracking-wider hover:bg-gold-500 hover:text-black transition-colors', 'PREVIEW CONFLICTS'); preBtn.type = 'button'; preBtn.dataset.pbAction = 'preview';
            sync.appendChild(preBtn);
            sync.appendChild(el('div', 'bg-black/40 border border-white/5 rounded p-2 text-[11px] font-mono text-slate-400')).id = 'pb-preview';
            // backup gate
            const bg = el('label', 'flex items-center gap-2 text-[11px] font-mono text-amber-400');
            const bgChk = el('input', ''); bgChk.type = 'checkbox'; bgChk.id = 'pb-backup-ack';
            bg.appendChild(bgChk); bg.appendChild(document.createTextNode('I have exported a v3.8 backup (required before any sync)'));
            sync.appendChild(bg);
            // push row
            const pushRow = el('div', 'flex flex-col md:flex-row gap-2');
            const pushPhrase = el('input', 'flex-1 bg-black border border-white/10 rounded px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold-500/40'); pushPhrase.type = 'text'; pushPhrase.id = 'pb-push-phrase'; pushPhrase.placeholder = "type: PUSH TO REMOTE"; pushPhrase.setAttribute('aria-label', 'push confirmation');
            const pushBtn = el('button', 'bg-transparent border border-emerald-500/50 text-emerald-400 font-mono text-xs px-4 py-2 rounded uppercase font-bold tracking-wider hover:bg-emerald-500/10 transition-colors', 'PUSH → REMOTE'); pushBtn.type = 'button'; pushBtn.dataset.pbAction = 'push';
            pushRow.appendChild(pushPhrase); pushRow.appendChild(pushBtn); sync.appendChild(pushRow);
            // pull row
            const pullRow = el('div', 'flex flex-col md:flex-row gap-2');
            const pullPhrase = el('input', 'flex-1 bg-black border border-white/10 rounded px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold-500/40'); pullPhrase.type = 'text'; pullPhrase.id = 'pb-pull-phrase'; pullPhrase.placeholder = "type: PULL FROM REMOTE (overwrites local)"; pullPhrase.setAttribute('aria-label', 'pull confirmation');
            const pullBtn = el('button', 'bg-transparent border border-red-500/50 text-red-400 font-mono text-xs px-4 py-2 rounded uppercase font-bold tracking-wider hover:bg-red-500/10 transition-colors', 'PULL ← REMOTE'); pullBtn.type = 'button'; pullBtn.dataset.pbAction = 'pull';
            pullRow.appendChild(pullPhrase); pullRow.appendChild(pullBtn); sync.appendChild(pullRow);
            sync.appendChild(el('div', 'text-[11px] font-mono text-slate-400 hidden')).id = 'pb-sync-result';
            root.appendChild(sync);

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
        },
        showPreview: function (r) {
            const box = this.panel && this.panel.querySelector('#pb-preview'); if (!box) return;
            box.textContent = '';
            if (!r.ok) { box.appendChild(el('div', 'text-amber-400', 'preview: ' + r.reason + (r.note ? ' — ' + r.note : ''))); return; }
            box.appendChild(el('div', 'text-slate-300', 'LOCAL ' + r.localCount + ' keys · REMOTE ' + r.remoteCount + ' keys'));
            box.appendChild(el('div', 'text-slate-400', 'local-only ' + r.localOnly + ' · remote-only ' + r.remoteOnly + ' · in both ' + r.both + ' · differing ' + r.differ));
            box.appendChild(el('div', r.remoteCount === 0 ? 'text-emerald-400' : 'text-amber-400', r.remoteCount === 0 ? 'remote is empty — safe initial push' : 'OVERWRITE IMPACT: push/pull will overwrite the target; no silent merge.'));
        },
        showSyncResult: function (dir, r) {
            const box = this.panel && this.panel.querySelector('#pb-sync-result'); if (!box) return;
            box.classList.remove('hidden'); box.textContent = '';
            if (r.ok) {
                box.appendChild(el('div', 'text-emerald-400 font-bold', dir + ' COMPLETE'));
                if (dir === 'PUSH') box.appendChild(el('div', 'text-slate-400', r.uploaded + ' uploaded · remote now ' + r.remoteCount + ' keys'));
                else { box.appendChild(el('div', 'text-slate-400', r.pulled + ' pulled · vault chain ' + (r.verification.vaultChain ? 'VALID' : 'INVALID') + ' · integrity ' + (r.verification.integrityValid ? 'ok' : r.verification.integrityBroken + ' broken'))); box.appendChild(el('div', 'text-gold-400', 'RELOAD to refresh the interface.')); }
            } else {
                box.appendChild(el('div', 'text-red-400 font-bold', dir + ' ' + (r.rolledBack ? 'FAILED — ROLLED BACK' : 'NOT APPLIED')));
                box.appendChild(el('div', 'text-slate-400', (r.reason || '') + (r.note ? ' — ' + r.note : '')));
            }
        }
    };

    SYSOS.remoteBackend = remote;
})();
