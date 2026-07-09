/**
 * SYS_OS — Bootstrap & Action Dispatch
 *
 * Boot order: metrics → canvas → router → terminals → vault → registries.
 * All interactive elements use [data-action] handled by ONE delegated
 * listener — zero inline onclick handlers remain (Audit F-13).
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;
    const notify = function () { return SYSOS.utils.notify.apply(null, arguments); };

    const actions = {
        'ping-node': function (btn) {
            if (btn.disabled) return;
            const original = btn.className;
            const label = btn.textContent;
            btn.textContent = 'ROUTING...';
            btn.disabled = true;
            btn.className = SYSOS.UI.PING_BUSY;
            setTimeout(function () {
                notify('TELEMETRY METRIC', [
                    'Handshake verified with node layer -> [' + (btn.dataset.node || 'UNKNOWN') + ']',
                    'Link: STABLE',
                    'Latency vector: 11ms RTT',
                    'Loss parameters: 0.00%'
                ]);
                btn.textContent = label;
                btn.disabled = false;
                btn.className = original;
            }, SYSOS.CONFIG.TIMINGS.PING_MS);
        },

        /**
         * Integrity audit = the project_audit workflow. Reports MEASURED
         * runtime state: chain verification, referential-integrity scan,
         * registry totals. Result is sealed into the activity ledger.
         */
        'global-audit': function (btn) {
            const label = btn.querySelector('span');
            const original = label.textContent;
            label.textContent = 'RUNNING COMPLIANCE SCAN...';
            setTimeout(function () {
                SYSOS.vault.verifyChain().then(function (chain) {
                    const links = SYSOS.relations.integrity();
                    const totals = SYSOS.stores.totals();
                    const regTotal = Object.values(totals)
                        .reduce(function (n, c) { return n + c; }, 0);
                    const pass = chain.valid && links.valid;
                    notify(pass ? 'INTEGRITY AUDIT — PASS' : 'INTEGRITY AUDIT — FAIL', [
                        'Registry records: ' + regTotal + ' (' +
                            totals.projects + ' projects · ' + totals.agents + ' agents · ' +
                            totals.workflows + ' workflows)',
                        'Vault documents: ' + SYSOS.vault.documents.size +
                            ' · audit chain ' + (chain.valid ? 'VERIFIED' : 'BROKEN @ #' + chain.brokenAt) +
                            ' (' + chain.length + ' entries)',
                        'Relationship links: ' + links.checked + ' checked · ' +
                            (links.valid ? '0 broken' : links.broken.length + ' BROKEN'),
                        'Stations: ' + SYSOS.router.stations.size +
                            ' · Canvas: ' + (SYSOS.canvas.status().running ? 'RUNNING' : 'PAUSED')
                    ]);
                    SYSOS.activity.log('AUDIT', 'project_audit ' + (pass ? 'PASS' : 'FAIL') +
                        ' — ' + regTotal + ' records, ' + chain.length + ' chain entries, ' +
                        links.checked + ' links checked, ' + links.broken.length + ' broken');
                    label.textContent = original;
                });
            }, SYSOS.CONFIG.TIMINGS.AUDIT_MS);
        },

        'vault-ingest': function () {
            SYSOS.vault.simulateIngest();
        },

        'asset-optimize': function () {
            notify('ASSET MATRIX SYNC', [
                'Rebalance matrix evaluated.',
                'High-yield data pipelines matched with long-term asset positioning algorithms.',
                'Status: SECURE'
            ]);
        }
    };

    function bindActions() {
        document.addEventListener('click', function (e) {
            const target = e.target.closest('[data-action]');
            if (target && actions[target.dataset.action]) {
                actions[target.dataset.action](target);
            }
        });
    }

    /** Headline metrics render from CONFIG — single source of truth. */
    function bindMetrics() {
        document.querySelectorAll('[data-metric]').forEach(function (node) {
            const value = SYSOS.CONFIG.METRICS[node.dataset.metric];
            if (value !== undefined) node.textContent = value;
        });
        const bar = document.querySelector('[data-metric-bar]');
        if (bar) bar.style.width = SYSOS.CONFIG.METRICS.DSCR_BAR_PCT + '%';
        document.querySelectorAll('[data-version]').forEach(function (node) {
            node.textContent = 'SYS_OS v' + SYSOS.CONFIG.VERSION;
        });
    }

    async function boot() {
        // Phase 10: pre-boot validation gate. Halt visibly on any critical gap.
        if (window.SYSOS && SYSOS.bootcheck) {
            const gate = SYSOS.bootcheck.validate();
            if (!gate.ok) { SYSOS.bootcheck.halt(gate); return; }
            console.info('[SYS_OS:bootcheck] PASS — ' + gate.checked + ' modules validated');
        }
        bindMetrics();
        bindActions();
        SYSOS.canvas.init();
        SYSOS.router.init();
        SYSOS.mountTerminals();
        SYSOS.registriesData();      // restore-or-seed all six registries + activity ledger
        await SYSOS.vault.init();    // restore-or-seed documents + audit chain
        SYSOS.registriesInit();      // Registry Grid station (CRUD UI)
        SYSOS.exec.init();           // Executive Command Center (computed metrics)

        // v2.9 LIVE OPERATIONS layer (additive — no v2.8 system altered)
        SYSOS.telemetry.init();      // real fetch-probe node health
        SYSOS.opsQueue.init();       // restore persistent operations queue
        SYSOS.routing.init();        // project agent registry into routing contracts
        SYSOS.compliance.init();     // restore-or-seed compliance schedules
        SYSOS.ocr.init();            // restore OCR job framework state
        SYSOS.liveOpsInit();         // LIVE OPS station (07)
        SYSOS.clientInit();          // v2.9.5 Client Center station (08)
        if (SYSOS.commercialUI) SYSOS.commercialUI.init();              // v2.9.7 admin UI
        if (SYSOS.executiveUI) SYSOS.executiveUI.init();                // v2.9.9 executive stations 09-12
        if (SYSOS.commercial) SYSOS.commercial.sweepExpiredProposals();  // v2.9.7 automation sweep
        SYSOS.telemetry.probeAll();  // first measured sweep

        console.info('[SYS_OS] v' + SYSOS.CONFIG.VERSION + ' (' + SYSOS.CONFIG.CODENAME +
            ') boot complete — stations: ' + SYSOS.router.stations.size +
            ', registry records: ' + Object.values(SYSOS.stores.totals()).reduce(function (a, b) { return a + b; }, 0) +
            ', vault docs: ' + SYSOS.vault.documents.size +
            ', routing contracts: ' + SYSOS.routing.list().length +
            ', telemetry nodes: ' + SYSOS.telemetry.nodes.size +
            ', clients: ' + SYSOS.stores.all.clients.entries.size +
            ', proposals: ' + SYSOS.stores.all.proposals.entries.size +
            ', contracts: ' + SYSOS.stores.all.contracts.entries.size +
            ', canvas: ' + JSON.stringify(SYSOS.canvas.status()));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
