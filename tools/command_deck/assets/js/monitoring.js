/**
 * SYS_OS v4.2 — Client-Side Monitoring Sink (PILOT_HOSTING_MONITORING)
 *
 * Captures runtime errors, unhandled promise rejections, and guard / vault /
 * integrity failures, routing each into the existing central audit trail and
 * the recent-activity ledger. LOCAL-first: nothing leaves the browser — this
 * is observation, not external alerting.
 *
 * Design rules (RULE ZERO safe):
 *   - Additive. Does not alter v4.1 behaviour or LOCAL mode.
 *   - Defensive. Every sink call is guarded; monitoring can NEVER crash the
 *     platform, and works even if audit/activity are unavailable.
 *   - NOT boot-gated (like backup/environment/remoteBackend): a monitoring
 *     outage must never halt the OS, so it is absent from bootcheck MANIFEST.
 *   - Listeners install at PARSE time so boot-phase faults are still captured;
 *     init() wires the health probe + active flag once audit/activity exist.
 *
 * Event types (also recorded as audit actions):
 *   monitoring.runtime_error · monitoring.unhandled_rejection ·
 *   monitoring.guard_failure · monitoring.vault_failure ·
 *   monitoring.integrity_failure · monitoring.health_checked
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;

    function cfg() {
        return (SYSOS.CONFIG && SYSOS.CONFIG.MONITORING) ||
            { EVENT_CAP: 50, ROUTE_TO_AUDIT: true, ROUTE_TO_ACTIVITY: true };
    }

    const TYPES = Object.freeze({
        RUNTIME_ERROR: 'monitoring.runtime_error',
        UNHANDLED_REJECTION: 'monitoring.unhandled_rejection',
        GUARD_FAILURE: 'monitoring.guard_failure',
        VAULT_FAILURE: 'monitoring.vault_failure',
        INTEGRITY_FAILURE: 'monitoring.integrity_failure',
        HEALTH_CHECKED: 'monitoring.health_checked'
    });

    function emptyCounts() {
        return { runtime_error: 0, unhandled_rejection: 0, guard_failure: 0,
            vault_failure: 0, integrity_failure: 0, health_checked: 0 };
    }
    function emptyLast() {
        return { runtimeError: null, unhandledRejection: null, guardFailure: null,
            vaultFailure: null, integrityFailure: null, healthCheck: null };
    }

    const monitoring = {
        TYPES: TYPES,
        active: false,
        _installed: false,
        _inCapture: false,           // reentrancy guard (audit/activity may throw)
        events: [],                  // rolling ring buffer (capped by EVENT_CAP)
        counts: emptyCounts(),
        last: emptyLast(),

        /**
         * Core sink. Never throws. Routes to audit (append-only trail) and the
         * recent-activity feed, both guarded so an outage in either is harmless.
         */
        capture: function (type, detail, metadata) {
            if (this._inCapture) return null;
            this._inCapture = true;
            let ev = null;
            try {
                const short = String(type).replace('monitoring.', '');
                ev = {
                    ts: new Date().toISOString(),
                    type: type,
                    detail: String(detail == null ? '' : detail).slice(0, 500),
                    metadata: metadata || {}
                };
                if (this.counts[short] !== undefined) this.counts[short]++;
                if (type === TYPES.RUNTIME_ERROR) this.last.runtimeError = ev;
                else if (type === TYPES.UNHANDLED_REJECTION) this.last.unhandledRejection = ev;
                else if (type === TYPES.GUARD_FAILURE) this.last.guardFailure = ev;
                else if (type === TYPES.VAULT_FAILURE) this.last.vaultFailure = ev;
                else if (type === TYPES.INTEGRITY_FAILURE) this.last.integrityFailure = ev;
                else if (type === TYPES.HEALTH_CHECKED) this.last.healthCheck = ev;
                this.events.push(ev);
                const cap = cfg().EVENT_CAP || 50;
                if (this.events.length > cap) this.events = this.events.slice(-cap);
                if (cfg().ROUTE_TO_AUDIT) {
                    try {
                        if (SYSOS.audit && SYSOS.audit.record) SYSOS.audit.record({
                            action: type, domain: 'monitoring', target: short, source: 'monitoring',
                            notes: ev.detail, metadata: ev.metadata });
                    } catch (e) { /* audit unavailable — never break */ }
                }
                if (cfg().ROUTE_TO_ACTIVITY) {
                    try {
                        if (SYSOS.activity && SYSOS.activity.log) SYSOS.activity.log(
                            'MONITORING', short.toUpperCase() + (ev.detail ? ' — ' + ev.detail : ''));
                    } catch (e) { /* activity unavailable — never break */ }
                }
                try { document.dispatchEvent(new CustomEvent('sysos:monitoring', { detail: { type: type } })); } catch (e) {}
            } catch (e) {
                /* monitoring must never break the platform */
            } finally {
                this._inCapture = false;
            }
            return ev;
        },

        // ---- explicit, guarded hooks for other modules (safely hookable) ----
        captureGuardFailure: function (detail, metadata) { return this.capture(TYPES.GUARD_FAILURE, detail, metadata); },
        captureVaultFailure: function (detail, metadata) { return this.capture(TYPES.VAULT_FAILURE, detail, metadata); },
        captureIntegrityFailure: function (detail, metadata) { return this.capture(TYPES.INTEGRITY_FAILURE, detail, metadata); },
        healthCheck: function () {
            return this.capture(TYPES.HEALTH_CHECKED, 'monitoring health probe',
                { active: this.active, installed: this._installed, counts: Object.assign({}, this.counts) });
        },

        // ---- global listeners (install once, at parse time) ----
        _onError: function (e) {
            const msg = (e && (e.message || (e.error && e.error.message))) || 'unknown error';
            const where = e && e.filename ? (e.filename + ':' + (e.lineno || 0) + ':' + (e.colno || 0)) : '';
            monitoring.capture(TYPES.RUNTIME_ERROR, msg + (where ? ' @ ' + where : ''),
                { filename: e && e.filename, lineno: e && e.lineno, colno: e && e.colno });
        },
        _onRejection: function (e) {
            let reason = e && e.reason;
            if (reason && reason.message) reason = reason.message; else reason = String(reason);
            monitoring.capture(TYPES.UNHANDLED_REJECTION, reason, {});
        },
        install: function () {
            if (this._installed) return false;
            try {
                window.addEventListener('error', this._onError, true);
                window.addEventListener('unhandledrejection', this._onRejection, true);
                this._installed = true;
            } catch (e) { this._installed = false; }
            return this._installed;
        },

        // ---- test helpers: forced faults honestly exercise the capture path ----
        forceRuntimeError: function (msg) {
            msg = msg || 'FORCED_TEST_RUNTIME_ERROR';
            try {
                window.dispatchEvent(new ErrorEvent('error', {
                    message: msg, error: new Error(msg), filename: 'monitoring.selftest', lineno: 0, colno: 0 }));
            } catch (e) { this._onError({ message: msg }); }
            return this.last.runtimeError;
        },
        forceUnhandledRejection: function (msg) {
            msg = msg || 'FORCED_TEST_REJECTION';
            try {
                window.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', {
                    promise: Promise.resolve(), reason: new Error(msg) }));
            } catch (e) { this._onRejection({ reason: msg }); }
            return this.last.unhandledRejection;
        },
        /** End-to-end self-test: forces each fault, verifies capture, returns booleans. */
        selfTest: function () {
            const before = Object.assign({}, this.counts);
            this.forceRuntimeError('SELFTEST_RUNTIME');
            this.forceUnhandledRejection('SELFTEST_REJECTION');
            this.captureGuardFailure('SELFTEST_GUARD');
            this.captureVaultFailure('SELFTEST_VAULT');
            this.captureIntegrityFailure('SELFTEST_INTEGRITY');
            this.healthCheck();
            return {
                runtimeError: this.counts.runtime_error > before.runtime_error,
                unhandledRejection: this.counts.unhandled_rejection > before.unhandled_rejection,
                guardFailure: this.counts.guard_failure > before.guard_failure,
                vaultFailure: this.counts.vault_failure > before.vault_failure,
                integrityFailure: this.counts.integrity_failure > before.integrity_failure,
                healthChecked: this.counts.health_checked > before.health_checked
            };
        },

        // ---- status (consumed by the Environment station + production guard) ----
        isActive: function () { return this.active; },
        getStatus: function () {
            return {
                active: this.active,
                captureInstalled: this._installed,
                guardHookInstalled: this._installed,  // guard/vault/integrity route through the same sink
                local: true,
                externalAlerting: false,              // honest: LOCAL-only, no external alerting yet
                counts: Object.assign({}, this.counts),
                last: {
                    runtimeError: this.last.runtimeError ? this.last.runtimeError.detail : null,
                    unhandledRejection: this.last.unhandledRejection ? this.last.unhandledRejection.detail : null,
                    guardFailure: this.last.guardFailure ? this.last.guardFailure.detail : null,
                    vaultFailure: this.last.vaultFailure ? this.last.vaultFailure.detail : null,
                    integrityFailure: this.last.integrityFailure ? this.last.integrityFailure.detail : null
                },
                totalEvents: this.events.length
            };
        },
        recent: function (n) { return this.events.slice(-(n || 10)).reverse(); },
        /** Reset counters/last/events — used to clear intentionally-forced test faults. */
        reset: function () {
            this.counts = emptyCounts();
            this.last = emptyLast();
            this.events = [];
            return true;
        },

        // ---- UI: render the status surface into a container (Environment station) ----
        renderStatusInto: function (container) {
            if (!container) return;
            const el = SYSOS.utils && SYSOS.utils.el;
            const st = this.getStatus();
            container.textContent = '';
            if (!el) { container.textContent = 'monitoring active=' + st.active; return; }
            container.appendChild(el('div', 'text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2', 'Runtime Monitoring'));
            const head = el('div', 'flex items-center gap-3 flex-wrap text-[11px] font-mono');
            head.appendChild(el('span', (st.active ? 'text-emerald-400' : 'text-red-400') + ' font-bold',
                st.active ? 'MONITORING ACTIVE' : 'MONITORING INACTIVE'));
            head.appendChild(el('span', 'text-slate-500',
                'capture ' + (st.captureInstalled ? 'ON' : 'OFF') + ' · ' + st.totalEvents + ' events'));
            container.appendChild(head);
            const rows = [
                ['Runtime errors', st.counts.runtime_error, st.last.runtimeError],
                ['Unhandled rejections', st.counts.unhandled_rejection, st.last.unhandledRejection],
                ['Guard failures', st.counts.guard_failure, st.last.guardFailure],
                ['Vault failures', st.counts.vault_failure, st.last.vaultFailure],
                ['Integrity failures', st.counts.integrity_failure, st.last.integrityFailure]
            ];
            const grid = el('div', 'mt-2 space-y-0.5');
            rows.forEach(function (r) {
                const tone = r[1] > 0 ? 'text-amber-400' : 'text-emerald-400';
                const row = el('div', 'flex items-start justify-between gap-2 text-[11px] font-mono border-b border-white/[0.04] py-0.5');
                row.appendChild(el('span', 'text-slate-400', r[0]));
                row.appendChild(el('span', tone + ' shrink-0', String(r[1]) + (r[2] ? ' · last: ' + r[2] : '')));
                grid.appendChild(row);
            });
            container.appendChild(grid);
            container.appendChild(el('div', 'text-[10px] font-mono text-amber-400/90 mt-2',
                'LOCAL-ONLY monitoring — events routed to audit + activity; no external alerting. ' +
                'PRODUCTION monitoring (hosted alerting) not configured.'));
        },

        init: function () {
            this.install();
            this.active = this._installed;
            this.healthCheck();   // emits monitoring.health_checked (records boot into audit/activity)
            try { document.dispatchEvent(new CustomEvent('sysos:monitoring', { detail: { type: 'init' } })); } catch (e) {}
            return this.active;
        }
    };

    SYSOS.monitoring = monitoring;

    // Install global listeners IMMEDIATELY (parse time) so any boot-phase fault
    // is captured even before main.js calls monitoring.init().
    monitoring.install();
})();
