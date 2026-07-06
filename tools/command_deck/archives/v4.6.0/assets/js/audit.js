/**
 * SYS_OS v3.1 — Audit History System
 *
 * Append-only, uncapped audit trail (the 50-cap activity ledger remains for the
 * recent-feed UI; this is the full record of truth). Each event captures
 * user, role, timestamp, action, domain, entity, before-state, after-state,
 * and source. Persisted through the storage adapter (own key, SQLite-backed
 * once that backend is active) so there is no 5MB-bound cap once on SQLite.
 *
 * Coverage: client / proposal / contract mutations are captured with real
 * before+after by wrapping their DataStore methods (additive, try/guarded —
 * a wrap failure can never break the underlying store op). Lifecycle,
 * compliance, and system actions record via explicit record() calls and the
 * event stream. Append-only: there is no delete API.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;
    const KEY = 'sysos.audit.v1';
    const AUDITED_DOMAINS = ['clients', 'proposals', 'contracts'];

    function clone(o) { try { return o == null ? null : JSON.parse(JSON.stringify(o)); } catch (e) { return null; } }

    const audit = {
        events: [],
        _wrapped: false,

        record(ev) {
            const actor = SYSOS.auth ? SYSOS.auth.current : { name: 'SYSTEM', role: 'SYSTEM' };
            const event = {
                id: 'EVT-' + SYSOS.utils.dateStamp() + '-' + SYSOS.utils.hexToken(6),
                ts: new Date().toISOString(),
                actor: ev.actor || actor.name,
                role: ev.role || actor.role,
                action: ev.action || 'unknown',
                domain: ev.domain || 'system',
                target: ev.target != null ? ev.target : null,
                before: ev.before !== undefined ? ev.before : null,
                after: ev.after !== undefined ? ev.after : null,
                source: ev.source || 'system',          // source module
                reason: ev.reason || '',                // v3.2 — denial/decision reason
                notes: ev.notes || '',
                metadata: ev.metadata || {}
            };
            this.events.push(event);   // append-only — never spliced/removed
            this.persist();
            document.dispatchEvent(new CustomEvent('sysos:audit', { detail: { id: event.id } }));
            return event;
        },

        // ---- queries (read) ----
        all() { return this.events.slice(); },
        query(filter) {
            filter = filter || {};
            return this.events.filter(function (e) {
                if (filter.domain && e.domain !== filter.domain) return false;
                if (filter.action && e.action !== filter.action) return false;
                if (filter.actor && e.actor !== filter.actor) return false;
                if (filter.target && e.target !== filter.target) return false;
                if (filter.since && e.ts < filter.since) return false;
                return true;
            }).sort(function (a, b) { return b.ts.localeCompare(a.ts); });
        },
        count() { return this.events.length; },
        stats() {
            const byDomain = {}, byAction = {};
            this.events.forEach(function (e) {
                byDomain[e.domain] = (byDomain[e.domain] || 0) + 1;
                byAction[e.action] = (byAction[e.action] || 0) + 1;
            });
            return { total: this.events.length, byDomain: byDomain, byAction: byAction };
        },

        // ---- export (backup) ----
        export() { return { v: 1, exportedAt: new Date().toISOString(), count: this.events.length, events: this.events.slice() }; },

        /** Human-readable audit report (most recent first, optional filter). */
        reportText(filter) {
            const rows = this.query(filter || {});
            const s = this.stats();
            const L = [];
            L.push('AUDIT REPORT — SYS_OS v' + SYSOS.CONFIG.VERSION);
            L.push('Generated ' + new Date().toISOString() + ' · ' + s.total + ' total events');
            L.push('By domain: ' + JSON.stringify(s.byDomain) + ' · by action: ' + JSON.stringify(s.byAction));
            L.push('');
            rows.slice(0, 40).forEach(function (e) {
                const change = (e.before || e.after)
                    ? ' [' + (e.before && e.before.status ? e.before.status : (e.before && e.before.stage) || '·') +
                      ' -> ' + (e.after && e.after.status ? e.after.status : (e.after && e.after.stage) || '·') + ']' : '';
                L.push('  ' + e.ts + ' · ' + e.actor + ' · ' + e.action + ' · ' + e.domain + ':' + e.target + change +
                    (e.notes ? ' — ' + e.notes : ''));
            });
            return L.join('\n');
        },

        // ---- persistence (through the adapter; demo-guarded; batch-aware) ----
        _dirty: false,
        persist() {
            if (SYSOS.stores && SYSOS.stores._suspendPersist) return;
            // v3.2: during a batch, defer to a single flush at commit.
            if (SYSOS.stores && SYSOS.stores.inBatch && SYSOS.stores.inBatch()) { this._dirty = true; return; }
            this._flush();
        },
        _flush() {
            try { SYSOS.storage.set(KEY, JSON.stringify({ v: 1, events: this.events })); this._dirty = false; }
            catch (e) { console.warn('[SYS_OS:audit] persistence unavailable', e); }
        },
        flush() { if (this._dirty) this._flush(); },
        restore() {
            try {
                const raw = SYSOS.storage.get(KEY);
                if (raw) this.events = JSON.parse(raw).events || [];
            } catch (e) { this.events = []; }
        },

        // ---- automatic capture (wrap commercial-domain stores) ----
        _wrapStores() {
            if (this._wrapped) return;
            AUDITED_DOMAINS.forEach(function (domain) {
                const store = SYSOS.stores.all[domain];
                if (!store) return;
                ['create', 'update', 'archive', 'remove'].forEach(function (method) {
                    const orig = store[method].bind(store);
                    store[method] = function () {
                        const args = Array.prototype.slice.call(arguments);
                        let before = null, targetId = null;
                        if (method !== 'create') { targetId = args[0]; before = clone(store.get(targetId)); }
                        const result = orig.apply(store, args);
                        try {
                            const id = (result && result.id) || targetId;
                            const after = (method === 'remove') ? null : clone(store.get(id));
                            audit.record({ action: method, domain: domain, target: id, before: before, after: after, source: 'store' });
                        } catch (e) { /* audit must never break the store op */ }
                        return result;
                    };
                });
            });
            this._wrapped = true;
        },

        // Wrap compliance actions (schedule/complete) — not a DataStore.
        _wrapCompliance() {
            if (!SYSOS.compliance || SYSOS.compliance._audited) return;
            ['schedule', 'complete'].forEach(function (method) {
                if (typeof SYSOS.compliance[method] !== 'function') return;
                const orig = SYSOS.compliance[method].bind(SYSOS.compliance);
                SYSOS.compliance[method] = function () {
                    const args = Array.prototype.slice.call(arguments);
                    const id = args[0];
                    const before = SYSOS.compliance.statusOf ? clone(SYSOS.compliance.statusOf(id)) : null;
                    const result = orig.apply(SYSOS.compliance, args);
                    try {
                        const after = SYSOS.compliance.statusOf ? clone(SYSOS.compliance.statusOf(id)) : null;
                        audit.record({ action: 'compliance.' + method, domain: 'compliance', target: id,
                            before: before, after: after, source: 'compliance' });
                    } catch (e) { /* never break the op */ }
                    return result;
                };
            });
            SYSOS.compliance._audited = true;
        },

        init() {
            this.restore();
            this._wrapStores();
            this._wrapCompliance();
            // Lifecycle transitions carry rich before/after already.
            document.addEventListener('sysos:commercial', function (e) {
                if (e.detail && e.detail.kind === 'stage') {
                    const c = SYSOS.stores.all.clients.get(e.detail.clientId);
                    if (c) audit.record({ action: 'lifecycle.transition', domain: 'clients', target: c.id,
                        before: null, after: { stage: c.stage }, source: 'lifecycle',
                        notes: 'stage -> ' + c.stage, metadata: { history: c.stageHistory.slice(-1)[0] } });
                }
            });
            // System configuration actions: demo toggle + storage backend switches.
            document.addEventListener('sysos:demo', function (e) {
                audit.record({ action: 'system.demo', domain: 'system', target: (e.detail && e.detail.mode) || '',
                    source: 'demo', notes: 'sandbox ' + ((e.detail && e.detail.mode) || '') });
            });
            document.addEventListener('sysos:auth', function (e) {
                audit.record({ action: 'system.auth', domain: 'system', target: SYSOS.auth.current.name,
                    after: { role: SYSOS.auth.current.role }, source: 'auth-ui', notes: (e.detail && e.detail.event) || '' });
            });
        }
    };

    SYSOS.audit = audit;
})();
