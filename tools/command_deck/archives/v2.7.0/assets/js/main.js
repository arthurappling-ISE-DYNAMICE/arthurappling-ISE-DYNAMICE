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

        /** Integrity audit now reports REAL runtime state, not canned copy. */
        'global-audit': function (btn) {
            const label = btn.querySelector('span');
            const original = label.textContent;
            label.textContent = 'RUNNING COMPLIANCE SCAN...';
            setTimeout(function () {
                SYSOS.vault.verifyChain().then(function (chain) {
                    const regTotal = Object.values(SYSOS.registries)
                        .reduce(function (n, r) { return n + r.entries.size; }, 0);
                    const canvas = SYSOS.canvas.status();
                    notify(chain.valid ? 'INTEGRITY AUDIT — PASS' : 'INTEGRITY AUDIT — FAIL', [
                        'Stations registered: ' + SYSOS.router.stations.size,
                        'Vault documents: ' + SYSOS.vault.documents.size +
                            ' · audit chain ' + (chain.valid ? 'VERIFIED' : 'BROKEN @ #' + chain.brokenAt) +
                            ' (' + chain.length + ' entries)',
                        'Registry entries: ' + regTotal + ' across 6 domains',
                        'Canvas engine: ' + (canvas.running
                            ? 'RUNNING @ ' + canvas.targetFps + 'fps'
                            : 'PAUSED (' + (canvas.pausedBy || 'reduced-motion') + ')')
                    ]);
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
        bindMetrics();
        bindActions();
        SYSOS.canvas.init();
        SYSOS.router.init();
        SYSOS.mountTerminals();
        await SYSOS.vault.init();
        SYSOS.registriesInit();
        console.info('[SYS_OS] v' + SYSOS.CONFIG.VERSION + ' (' + SYSOS.CONFIG.CODENAME +
            ') boot complete — stations: ' + SYSOS.router.stations.size +
            ', vault docs: ' + SYSOS.vault.documents.size +
            ', canvas: ' + JSON.stringify(SYSOS.canvas.status()));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
