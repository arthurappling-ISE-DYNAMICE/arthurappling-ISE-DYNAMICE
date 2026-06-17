/**
 * SYS_OS v2.9.8 — Maintenance Automation
 *
 * SYSOS.maintenance.run() executes the standing validation sequence against
 * live state and returns a structured report (+ reportText()). Every value is
 * measured at call time. Async because the vault chain verify is async.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;

    const maintenance = {
        async run() {
            const S = SYSOS;
            const integ = S.relations.integrity();
            const chain = await S.vault.verifyChain();
            const gate = S.bootcheck.validate();
            const forecast = S.commercial.forecast();
            const health = S.commercial.healthDistribution();
            const pa = S.commercial.proposalAutomation();
            const cm = S.commercial.contractMonitoring();

            const checks = [
                { name: 'Registry integrity', ok: Object.keys(S.stores.all).length >= 9,
                    detail: Object.keys(S.stores.all).length + ' domains' },
                { name: 'Relationship integrity', ok: integ.valid,
                    detail: integ.checked + ' links / ' + integ.broken.length + ' broken' },
                { name: 'Persistence', ok: !!localStorage.getItem(S.CONFIG.STORE.STORAGE_KEY),
                    detail: Object.keys(localStorage).filter(function (k) { return k.indexOf('sysos') === 0; }).length + ' stores' },
                { name: 'Boot gate', ok: gate.ok, detail: gate.checked + ' modules / ' + gate.missing.length + ' missing' },
                { name: 'Client count', ok: true, detail: String(S.stores.all.clients.entries.size) },
                { name: 'Proposal count', ok: true, detail: String(S.stores.all.proposals.entries.size) },
                { name: 'Contract count', ok: true, detail: String(S.stores.all.contracts.entries.size) },
                { name: 'Revenue calculations', ok: forecast.projectedRevenue === S.money.toDollars(forecast.cents.projected),
                    detail: 'projected $' + forecast.projectedRevenue.toLocaleString() + ' (cents-verified)' },
                { name: 'Health calculations', ok: (health.GREEN + health.YELLOW + health.RED) === S.stores.all.clients.entries.size,
                    detail: 'G' + health.GREEN + ' Y' + health.YELLOW + ' R' + health.RED },
                { name: 'Vault chain', ok: chain.valid,
                    detail: chain.length + ' entries / ' + (chain.valid ? 'verified' : 'BROKEN @ ' + chain.brokenAt) }
            ];

            const summary = {
                checks: checks.length,
                passed: checks.filter(function (c) { return c.ok; }).length,
                failed: checks.filter(function (c) { return !c.ok; }).length,
                healthy: checks.every(function (c) { return c.ok; })
            };

            return {
                generatedAt: new Date().toISOString(),
                platform: 'SYS_OS v' + S.CONFIG.VERSION,
                checks: checks,
                summary: summary,
                automation: { upcomingProposalExpirations: pa.upcomingExpirations.length,
                    expiredQueue: pa.expiredQueue.length, renewingContracts: cm.renewingContracts }
            };
        },

        async reportText() {
            const r = await maintenance.run();
            const lines = [];
            lines.push('MAINTENANCE REPORT — ' + r.platform);
            lines.push('Generated ' + r.generatedAt);
            lines.push('Status: ' + (r.summary.healthy ? 'HEALTHY' : 'ATTENTION') +
                ' (' + r.summary.passed + '/' + r.summary.checks + ' checks passed)');
            lines.push('');
            r.checks.forEach(function (c) {
                lines.push('  [' + (c.ok ? 'PASS' : 'FAIL') + '] ' + c.name + ' — ' + c.detail);
            });
            lines.push('');
            lines.push('Automation: ' + r.automation.upcomingProposalExpirations + ' proposal(s) expiring, ' +
                r.automation.renewingContracts + ' contract(s) renewing');
            return lines.join('\n');
        }
    };

    SYSOS.maintenance = maintenance;
})();
