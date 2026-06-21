/**
 * SYS_OS v2.9.9 — Executive Command Engine
 *
 * Pure derivation layer over the existing subsystems. No data of its own,
 * no persistence of its own (the activity ledger it reads is already
 * persistent). Provides:
 *   metrics()           Phase 2 — aggregate executive metrics
 *   systemHealth()      Phase 3 — per-subsystem GREEN/YELLOW/RED (async)
 *   operatorWorkspace() Phase 5 — actionable operational view
 *   timeline(filter)    Phase 4 — unified chronological activity view
 *   reports.*           Phase 6 — text report generation
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;

    const executive = {

        // ---------- Phase 2: executive overview metrics ----------

        metrics() {
            const S = SYSOS;
            // v3.4: memoized — returns cached composed metrics while no
            // health-affecting data (or ops) has changed since last build.
            if (S.healthCache) { const m = S.healthCache.getMetrics(); if (m) return m; }
            const f = S.commercial.forecast();
            const health = S.commercial.healthDistribution();
            const ops = S.opsQueue.stats();
            const result = {
                clients:        { value: S.stores.all.clients.entries.size,    source: 'stores.all.clients' },
                projects:       { value: S.stores.all.projects.entries.size,   source: 'stores.all.projects' },
                documents:      { value: S.vault.documents.size,               source: 'vault.documents' },
                complianceItems:{ value: S.stores.all.compliance.entries.size, source: 'stores.all.compliance' },
                proposals:      { value: S.stores.all.proposals.entries.size,  source: 'stores.all.proposals' },
                contracts:      { value: S.stores.all.contracts.entries.size,  source: 'stores.all.contracts' },
                pipelineValue:  { value: f.pipelineValue,    source: 'commercial.forecast().pipelineValue (cents)' },
                expectedRevenue:{ value: f.expectedRevenue,  source: 'commercial.forecast().expectedRevenue (cents)' },
                projectedRevenue:{ value: f.projectedRevenue, source: 'commercial.forecast().projectedRevenue (cents)' },
                healthDistribution: { value: health, source: 'commercial.healthDistribution()' },
                openOperations: { value: ops.PENDING + ops.RUNNING, source: 'opsQueue.stats() PENDING+RUNNING' },
                systemStatus:   { value: executive.quickStatus(), source: 'relations.integrity + bootcheck' }
            };
            if (S.healthCache) S.healthCache.setMetrics(result);
            return result;
        },

        /** Synchronous coarse status for the metric card (full detail in systemHealth). */
        quickStatus() {
            const integ = SYSOS.relations.integrity();
            const gate = SYSOS.bootcheck.validate();
            return (integ.valid && gate.ok) ? 'OPERATIONAL' : 'ATTENTION';
        },

        // ---------- Phase 3: system health center ----------

        async systemHealth() {
            const S = SYSOS;
            const integ = S.relations.integrity();
            const chain = await S.vault.verifyChain();
            const gate = S.bootcheck.validate();
            const smoke = S.smoketest.run();
            const maint = await S.maintenance.run();
            const tel = S.telemetry.summary();
            const routingOk = S.routing.list().length === S.stores.all.agents.entries.size;
            const persistKeys = Object.keys(localStorage).filter(function (k) { return k.indexOf('sysos') === 0; }).length;

            function band(ok, warn) { return ok ? 'GREEN' : (warn ? 'YELLOW' : 'RED'); }

            const checks = [
                { name: 'Relationship Integrity', status: band(integ.valid), detail: integ.checked + ' links / ' + integ.broken.length + ' broken' },
                { name: 'Vault Chain', status: band(chain.valid && S.vault.hashMode().strong && !(S.vault.restoreStatus().action === 'quarantined_reseeded' || S.vault.restoreStatus().action === 'degraded'), chain.valid && S.vault.restoreStatus().action !== 'degraded'), detail: chain.length + ' entries · ' + (chain.valid ? 'verified' : 'broken @ ' + chain.brokenAt) + (S.vault.hashMode().strong ? '' : ' · FALLBACK HASH (' + S.vault.hashMode().algo + ')') + (S.vault.restoreStatus().action === 'quarantined_reseeded' ? ' · CORRUPT-RESTORE QUARANTINED' : '') + (S.vault.restoreStatus().action === 'degraded' ? ' · QUARANTINE FAILED' : '') },
                { name: 'Boot Gate', status: band(gate.ok), detail: gate.checked + ' modules / ' + gate.missing.length + ' missing' },
                { name: 'Smoke Test', status: band(smoke.summary.fail === 0 && smoke.summary.error === 0, smoke.summary.error === 0), detail: smoke.summary.pass + '/' + smoke.summary.total + ' pass' },
                { name: 'Maintenance', status: band(maint.summary.healthy), detail: maint.summary.passed + '/' + maint.summary.checks + ' checks' },
                { name: 'Routing', status: band(routingOk), detail: S.routing.list().length + ' contracts' },
                { name: 'Telemetry', status: band(tel.offline === 0, tel.online > 0), detail: tel.online + ' up · ' + tel.degraded + ' degraded · ' + tel.offline + ' down' },
                { name: 'Persistence', status: band(persistKeys > 0), detail: persistKeys + ' stores' }
            ];
            const reds = checks.filter(function (c) { return c.status === 'RED'; }).length;
            const yellows = checks.filter(function (c) { return c.status === 'YELLOW'; }).length;
            return {
                overall: reds ? 'RED' : (yellows ? 'YELLOW' : 'GREEN'),
                checks: checks,
                counts: { green: checks.length - reds - yellows, yellow: yellows, red: reds }
            };
        },

        // ---------- Phase 4: unified activity timeline ----------

        /** filter: { type } optional. Reads the already-persistent activity ledger. */
        timeline(filter) {
            filter = filter || {};
            let entries = SYSOS.activity.entries.slice();
            if (filter.type) entries = entries.filter(function (e) { return e.type === filter.type; });
            return entries.sort(function (a, b) { return b.ts.localeCompare(a.ts); });
        },

        timelineTypes() {
            const set = {};
            SYSOS.activity.entries.forEach(function (e) { set[e.type] = (set[e.type] || 0) + 1; });
            return set;
        },

        // ---------- Phase 5: operator workspace ----------

        operatorWorkspace() {
            const S = SYSOS;
            const reminders = S.compliance.reminders();
            const cm = S.commercial.contractMonitoring();
            const pa = S.commercial.proposalAutomation();
            const f = S.commercial.forecast();
            // "Today's tasks" = anything escalated/expiring within 3 days.
            const tasks = [];
            reminders.forEach(function (r) { if (r.state === 'ESCALATED') tasks.push({ kind: 'COMPLIANCE', label: r.name, due: r.daysLeft + 'd' }); });
            pa.upcomingExpirations.forEach(function (p) { if (p.daysRemaining <= 3) tasks.push({ kind: 'PROPOSAL', label: p.title, due: p.daysRemaining + 'd' }); });
            cm.upcomingRenewal.forEach(function (k) { if (k.daysRemaining <= 3) tasks.push({ kind: 'RENEWAL', label: k.title, due: k.daysRemaining + 'd' }); });
            const recentClient = executive.timeline().filter(function (e) {
                return ['CLIENT', 'LIFECYCLE', 'PROPOSAL', 'CONTRACT', 'PROJECTS'].indexOf(e.type) !== -1;
            }).slice(0, 6);
            return {
                todaysTasks:        { count: tasks.length, items: tasks, source: 'compliance.reminders + proposal/contract automation (<=3d)' },
                upcomingCompliance: { count: reminders.length, items: reminders, source: 'compliance.reminders()' },
                upcomingRenewals:   { count: cm.upcomingRenewal.length, items: cm.upcomingRenewal, source: 'commercial.contractMonitoring().upcomingRenewal' },
                expiringProposals:  { count: pa.upcomingExpirations.length, items: pa.upcomingExpirations, source: 'commercial.proposalAutomation().upcomingExpirations' },
                openPipeline:       { count: pa.openProposals, value: f.proposalValue, source: 'proposalAutomation().openProposals + forecast().proposalValue' },
                recentClientActivity: { count: recentClient.length, items: recentClient, source: 'activity ledger (client-domain events)' }
            };
        },

        // ---------- Phase 6: report generation ----------

        reports: {
            executive() {
                const m = SYSOS.executive.metrics();
                const L = [];
                L.push('EXECUTIVE SUMMARY — SYS_OS v' + SYSOS.CONFIG.VERSION);
                L.push('Generated ' + new Date().toISOString());
                L.push('System status: ' + m.systemStatus.value);
                L.push('');
                L.push('PORTFOLIO');
                L.push('  Clients: ' + m.clients.value + ' · Projects: ' + m.projects.value + ' · Documents: ' + m.documents.value);
                L.push('  Proposals: ' + m.proposals.value + ' · Contracts: ' + m.contracts.value + ' · Compliance: ' + m.complianceItems.value);
                L.push('');
                L.push('REVENUE');
                L.push('  Pipeline: ' + SYSOS.money.formatDollars(m.pipelineValue.value));
                L.push('  Expected: ' + SYSOS.money.formatDollars(m.expectedRevenue.value));
                L.push('  Projected: ' + SYSOS.money.formatDollars(m.projectedRevenue.value));
                L.push('');
                const h = m.healthDistribution.value;
                L.push('CLIENT HEALTH: GREEN ' + h.GREEN + ' · YELLOW ' + h.YELLOW + ' · RED ' + h.RED);
                L.push('OPEN OPERATIONS: ' + m.openOperations.value);
                return L.join('\n');
            },
            client(clientId) { return SYSOS.client.reportText(clientId); },
            pipeline() {
                const L = [];
                L.push('PIPELINE SUMMARY — SYS_OS v' + SYSOS.CONFIG.VERSION);
                L.push('Generated ' + new Date().toISOString());
                const pa = SYSOS.commercial.proposalAutomation();
                const cm = SYSOS.commercial.contractMonitoring();
                L.push('');
                L.push('PROPOSALS: open ' + pa.openProposals + ' · accepted ' + pa.acceptedProposals +
                    ' · rejected ' + pa.rejectedProposals + ' · expired ' + pa.expiredProposals);
                L.push('  Total value: ' + SYSOS.money.formatDollars(pa.totalProposalValue) + ' · acceptance rate ' + pa.acceptanceRate + '%');
                L.push('  Expiring soon: ' + pa.upcomingExpirations.length);
                L.push('');
                L.push('CONTRACTS: active ' + cm.activeContracts + ' · expired ' + cm.expiredContracts + ' · renewing ' + cm.renewingContracts);
                L.push('  Contract value: ' + SYSOS.money.formatDollars(cm.contractValue));
                L.push('');
                L.push('REVENUE BY STAGE:');
                const byStage = SYSOS.commercial.revenueByLifecycleStage();
                Object.keys(byStage).forEach(function (s) {
                    if (byStage[s].clients > 0) L.push('  ' + s + ': ' + byStage[s].clients + ' client(s), projected ' + SYSOS.money.formatDollars(byStage[s].projected));
                });
                return L.join('\n');
            },
            compliance() {
                const L = [];
                L.push('COMPLIANCE SUMMARY — SYS_OS v' + SYSOS.CONFIG.VERSION);
                L.push('Generated ' + new Date().toISOString());
                L.push('');
                SYSOS.compliance.list().forEach(function (r) {
                    L.push('  [' + r.state + '] ' + r.name + (r.dueDate ? ' — due ' + r.dueDate.slice(0, 10) + ' (' + r.daysLeft + 'd)' : ''));
                });
                const s = SYSOS.compliance.summary();
                L.push('');
                L.push('Scheduled: ' + s.scheduled + ' · escalated: ' + s.escalated + ' · due soon: ' + s.dueSoon);
                return L.join('\n');
            },
            async systemHealth() {
                const h = await SYSOS.executive.systemHealth();
                const L = [];
                L.push('SYSTEM HEALTH SUMMARY — SYS_OS v' + SYSOS.CONFIG.VERSION);
                L.push('Generated ' + new Date().toISOString());
                L.push('Overall: ' + h.overall + ' (G' + h.counts.green + ' Y' + h.counts.yellow + ' R' + h.counts.red + ')');
                L.push('');
                h.checks.forEach(function (c) { L.push('  [' + c.status + '] ' + c.name + ' — ' + c.detail); });
                return L.join('\n');
            }
        }
    };

    SYSOS.executive = executive;
})();
