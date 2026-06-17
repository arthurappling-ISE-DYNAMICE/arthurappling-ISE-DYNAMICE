/**
 * SYS_OS v2.9.8 — Smoke Test Framework
 *
 * SYSOS.smoketest.run() executes read-only assertions across every subsystem
 * and returns { results:[{name,status,detail}], summary:{pass,fail,error,total} }.
 * Each test => PASS | FAIL | ERROR (ERROR = the test itself threw).
 *
 * SYSOS.smoketest.failureDrills() (Phase 8) intentionally injects faults and
 * verifies the platform catches/reports them without crashing, then restores.
 * Both are non-persisting: any data created is removed before returning.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;

    function test(name, fn) {
        try {
            const r = fn();
            return { name: name, status: r ? 'PASS' : 'FAIL', detail: (r && r.detail) || (r === true ? 'ok' : 'assertion false') };
        } catch (e) {
            return { name: name, status: 'ERROR', detail: String(e.message || e) };
        }
    }

    const smoketest = {
        run() {
            const S = SYSOS;
            const results = [];
            const P = function (n, f) { results.push(test(n, f)); };

            P('Registry', function () { return S.stores.all.clients.entries.size >= 0 && Object.keys(S.stores.all).length >= 9; });
            P('Relationships', function () { return typeof S.relations.linkStats === 'function' && S.relations.domains.length === 8; });
            P('Clients', function () { return S.stores.all.clients.list({ includeArchived: true }).every(function (c) { return c.id && c.links; }); });
            P('Proposals', function () { return S.stores.all.proposals.list({ includeArchived: true }).every(function (p) { return p.clientId && typeof p.amount === 'number'; }); });
            P('Contracts', function () { return S.stores.all.contracts.list({ includeArchived: true }).every(function (k) { return k.clientId && typeof k.value === 'number'; }); });
            P('Compliance', function () { return S.compliance && typeof S.compliance.statusOf === 'function'; });
            P('Telemetry', function () { return S.telemetry.nodes.size === S.CONFIG.TELEMETRY.NODES.length; });
            P('Routing', function () { return S.routing.list().length === S.stores.all.agents.entries.size; });
            P('OCR', function () { return typeof S.ocr.upload === 'function' && typeof S.vault.registerOCRProvider === 'function'; });
            P('Commercial', function () { return typeof S.commercial.forecast === 'function' && typeof S.commercial.proposalAutomation === 'function'; });
            P('Money', function () { return S.money.toCents(75.10) === 7510 && S.money.toDollars(7510) === 75.10; });
            P('BootGate', function () { return S.bootcheck.validate().ok === true; });
            P('Persistence', function () {
                // v3.2: normalized per-domain keys (or the legacy blob for back-compat).
                return S.storage.keys().some(function (k) { return k.indexOf('sysos.reg') === 0; })
                    || !!S.storage.get(S.CONFIG.STORE.STORAGE_KEY);
            });
            P('HealthEngine', function () {
                const c = S.stores.all.clients.list()[0]; if (!c) return false;
                const h = S.commercial.health(c.id);
                return h && h.signals.length === 6 && h.score >= 0 && h.score <= 100 && Array.isArray(h.riskFlags);
            });
            P('RevenueEngine', function () {
                const f = S.commercial.forecast();
                return f.cents && f.projectedRevenue === S.money.toDollars(f.cents.projected);
            });
            P('LifecycleEngine', function () { return S.commercial.stages().length === 8 && typeof S.commercial.setStage === 'function'; });
            P('VaultChain', function () { return S.vault.auditChain.length > 0; });
            P('StationContract', function () {
                return ['init', 'mount', 'unmount', 'refresh', 'validate'].every(function (m) { return typeof S.clientStation[m] === 'function'; })
                    && ['mount', 'unmount', 'refresh', 'validate'].every(function (m) { return typeof S.commercialUI[m] === 'function'; });
            });

            const summary = { pass: 0, fail: 0, error: 0, total: results.length };
            results.forEach(function (r) {
                if (r.status === 'PASS') summary.pass++;
                else if (r.status === 'FAIL') summary.fail++;
                else summary.error++;
            });
            return { results: results, summary: summary };
        },

        /** Phase 8 — intentional fault injection + recovery verification. */
        failureDrills() {
            const S = SYSOS;
            const drills = [];
            const D = function (n, f) { drills.push(test(n, f)); };

            // 1. Missing module — boot gate must detect, not crash.
            D('Recovery: missing module detected', function () {
                const stash = S.commercial; delete S.commercial;
                const res = S.bootcheck.validate();
                S.commercial = stash;
                return res.ok === false && res.missing.some(function (m) { return m.indexOf('commercial') === 0; });
            });

            // 2. Missing function — boot gate must detect.
            D('Recovery: missing function detected', function () {
                const fn = S.commercial.forecast; delete S.commercial.forecast;
                const res = S.bootcheck.validate();
                S.commercial.forecast = fn;
                return res.ok === false;
            });

            // 3. Corrupt proposal create (missing required) — store must reject, not write.
            D('Recovery: corrupt proposal rejected', function () {
                const before = S.stores.all.proposals.entries.size;
                let threw = false;
                try { S.stores.all.proposals.create({ title: 'bad' }); } catch (e) { threw = true; }
                return threw && S.stores.all.proposals.entries.size === before;
            });

            // 4. Corrupt contract create — store must reject.
            D('Recovery: corrupt contract rejected', function () {
                const before = S.stores.all.contracts.entries.size;
                let threw = false;
                try { S.stores.all.contracts.create({ clientId: 'x' }); } catch (e) { threw = true; }
                return threw && S.stores.all.contracts.entries.size === before;
            });

            // 5. Broken relationship — integrity scan must flag, not crash.
            D('Recovery: broken link flagged', function () {
                const c = S.stores.all.clients.create({ name: 'DRILL', segment: 'TEST', status: 'PROSPECT',
                    links: { projects: ['NONEXISTENT_PROJECT'] } }, { silent: true });
                const integ = S.relations.integrity();
                const flagged = integ.broken.some(function (b) { return b.missing === 'NONEXISTENT_PROJECT'; });
                S.stores.all.clients.remove(c.id);
                const clean = S.relations.integrity();
                return flagged && clean.valid === true; // flagged while broken, clean after cleanup
            });

            // 6. Invalid lifecycle stage — setStage must reject.
            D('Recovery: invalid stage rejected', function () {
                const c = S.stores.all.clients.list()[0];
                let threw = false;
                try { S.commercial.setStage(c.id, 'NOT_A_STAGE'); } catch (e) { threw = true; }
                return threw;
            });

            const summary = { pass: 0, fail: 0, error: 0, total: drills.length };
            drills.forEach(function (d) { if (d.status === 'PASS') summary.pass++; else if (d.status === 'FAIL') summary.fail++; else summary.error++; });
            return { drills: drills, summary: summary };
        }
    };

    SYSOS.smoketest = smoketest;
})();
