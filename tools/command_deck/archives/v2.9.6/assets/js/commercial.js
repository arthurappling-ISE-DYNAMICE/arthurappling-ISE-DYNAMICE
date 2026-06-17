/**
 * SYS_OS v2.9.6 — Commercial Pipeline Engine
 *
 * Additive layer over the v2.9.5 client architecture. Provides:
 *   - Client lifecycle engine (LEAD..ARCHIVED) with timestamped history
 *   - Proposal + Contract convenience CRUD (domains defined in registry.js)
 *   - Revenue forecast engine (all derived, zero hardcoded values)
 *   - Client health engine (deterministic, explainable scoring)
 *   - Portfolio rollups for the commercial dashboard
 *
 * Proposals and contracts are real DataStore domains, so they inherit CRUD,
 * persistence, search, and (via links.clients) the relationship + integrity
 * engine with no special-casing. clientId/proposalId are stored as plain
 * fields per the required schema AND mirrored into links for resolution.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;
    const DAY = 86400000;

    function C() { return SYSOS.CONFIG.COMMERCIAL; }
    function clients() { return SYSOS.stores.all.clients; }
    function proposals() { return SYSOS.stores.all.proposals; }
    function contracts() { return SYSOS.stores.all.contracts; }

    const commercial = {

        // ---------- Phase 2: client lifecycle engine ----------

        stages() { return C().CLIENT_LIFECYCLE.slice(); },

        /** Transition a client to a new lifecycle stage; records timestamped history. */
        setStage(clientId, stage) {
            const c = clients().get(clientId);
            if (!c) throw new Error('unknown client: ' + clientId);
            if (C().CLIENT_LIFECYCLE.indexOf(stage) === -1) throw new Error('invalid stage: ' + stage);
            const from = c.stage || null;
            const history = (c.stageHistory || []).slice();
            history.push({ from: from, to: stage, ts: new Date().toISOString() });
            clients().update(clientId, { stage: stage, stageHistory: history });
            SYSOS.activity.log('LIFECYCLE', clientId + ' ' + (from || 'INIT') + ' -> ' + stage);
            document.dispatchEvent(new CustomEvent('sysos:commercial', { detail: { kind: 'stage', clientId: clientId } }));
            return clients().get(clientId);
        },

        stageHistory(clientId) {
            const c = clients().get(clientId);
            return c ? (c.stageHistory || []) : [];
        },

        clientsByStage() {
            const out = {};
            C().CLIENT_LIFECYCLE.forEach(function (s) { out[s] = 0; });
            clients().list({ includeArchived: true }).forEach(function (c) {
                const s = c.stage || 'LEAD';
                out[s] = (out[s] || 0) + 1;
            });
            return out;
        },

        // ---------- Phase 3/4: proposal + contract helpers ----------

        createProposal(spec) {
            const links = Object.assign({ clients: spec.clientId ? [spec.clientId] : [] }, spec.links || {});
            return proposals().create(Object.assign({}, spec, { links: links }));
        },

        createContract(spec) {
            const links = Object.assign({ clients: spec.clientId ? [spec.clientId] : [] }, spec.links || {});
            return contracts().create(Object.assign({}, spec, { links: links }));
        },

        proposalsFor(clientId) {
            return proposals() ? proposals().list({ includeArchived: true })
                .filter(function (p) { return p.clientId === clientId; }) : [];
        },

        contractsFor(clientId) {
            return contracts() ? contracts().list({ includeArchived: true })
                .filter(function (k) { return k.clientId === clientId; }) : [];
        },

        // ---------- Phase 5: revenue forecast engine ----------

        OPEN_PROPOSAL: function (p) { return ['DECLINED', 'EXPIRED'].indexOf(p.status) === -1; },
        CLOSED_CONTRACT: function (k) { return ['SIGNED', 'ACTIVE'].indexOf(k.status) !== -1; },

        /** All figures derived from live records. clientId optional => portfolio. */
        forecast(clientId) {
            const cl = clients().list({ includeArchived: true });
            const clist = clientId ? cl.filter(function (c) { return c.id === clientId; }) : cl;
            const ids = clist.map(function (c) { return c.id; });
            const props = (proposals() ? proposals().list({ includeArchived: true }) : [])
                .filter(function (p) { return ids.indexOf(p.clientId) !== -1; });
            const cons = (contracts() ? contracts().list({ includeArchived: true }) : [])
                .filter(function (k) { return ids.indexOf(k.clientId) !== -1; });
            const W = C().PROPOSAL_WEIGHTS;

            const pipelineValue = clist.reduce(function (n, c) { return n + (c.value || 0); }, 0);
            const proposalValue = props.filter(commercial.OPEN_PROPOSAL)
                .reduce(function (n, p) { return n + (p.amount || 0); }, 0);
            const contractValue = cons.reduce(function (n, k) { return n + (k.value || 0); }, 0);
            const closedRevenue = cons.filter(commercial.CLOSED_CONTRACT)
                .reduce(function (n, k) { return n + (k.value || 0); }, 0);
            const expectedRevenue = props.reduce(function (n, p) {
                return n + (p.amount || 0) * (W[p.status] || 0);
            }, 0);
            const projectedRevenue = closedRevenue + expectedRevenue;

            return {
                scope: clientId || 'PORTFOLIO',
                pipelineValue: pipelineValue,
                proposalValue: proposalValue,
                contractValue: contractValue,
                closedRevenue: closedRevenue,
                expectedRevenue: Math.round(expectedRevenue),
                projectedRevenue: Math.round(projectedRevenue),
                counts: { proposals: props.length, contracts: cons.length }
            };
        },

        // ---------- Phase 6: client health engine ----------

        /** Deterministic, explainable 0-100 score with per-signal breakdown. */
        health(clientId) {
            const c = clients().get(clientId);
            if (!c) return null;
            const signals = [];
            const MAX = 20;

            // 1. Recent activity — activity ledger mentions this client within window.
            const cutoff = Date.now() - C().HEALTH.ACTIVITY_STALE_DAYS * DAY;
            const recent = SYSOS.activity.entries.some(function (e) {
                return new Date(e.ts).getTime() >= cutoff &&
                    (e.message.indexOf(clientId) !== -1 || e.message.indexOf(c.name) !== -1);
            });
            signals.push({ name: 'Recent activity', points: recent ? MAX : 0, max: MAX,
                reason: recent ? 'activity within ' + C().HEALTH.ACTIVITY_STALE_DAYS + 'd' : 'no recent activity' });

            // 2. Proposal activity — at least one open proposal.
            const openProps = commercial.proposalsFor(clientId).filter(commercial.OPEN_PROPOSAL);
            signals.push({ name: 'Proposal activity', points: openProps.length ? MAX : 0, max: MAX,
                reason: openProps.length + ' open proposal(s)' });

            // 3. Contract status — at least one SIGNED/ACTIVE contract.
            const liveCons = commercial.contractsFor(clientId).filter(commercial.CLOSED_CONTRACT);
            signals.push({ name: 'Contract status', points: liveCons.length ? MAX : 0, max: MAX,
                reason: liveCons.length + ' active/signed contract(s)' });

            // 4. Project activity — at least one ACTIVE linked project.
            const resolved = SYSOS.relations.resolve('clients', clientId);
            const activeProjects = resolved.links.projects.filter(function (p) {
                if (p.missing) return false;
                const proj = SYSOS.stores.all.projects.get(p.id);
                return proj && proj.status === 'ACTIVE';
            }).length;
            signals.push({ name: 'Project activity', points: activeProjects ? MAX : 0, max: MAX,
                reason: activeProjects + ' active project(s)' });

            // 5. Compliance status — no ESCALATED obligation on linked projects.
            const projIds = resolved.links.projects.filter(function (p) { return !p.missing; })
                .map(function (p) { return p.id; });
            let escalated = 0;
            if (SYSOS.compliance) {
                SYSOS.stores.all.compliance.list({ includeArchived: true }).forEach(function (rec) {
                    const onClient = (rec.links.projects || []).some(function (pid) { return projIds.indexOf(pid) !== -1; });
                    if (onClient && SYSOS.compliance.statusOf(rec.id).state === 'ESCALATED') escalated++;
                });
            }
            signals.push({ name: 'Compliance status', points: escalated === 0 ? MAX : 0, max: MAX,
                reason: escalated === 0 ? 'no escalated obligations' : escalated + ' escalated' });

            const score = signals.reduce(function (n, s) { return n + s.points; }, 0);
            const status = score >= C().HEALTH.GREEN_MIN ? 'GREEN'
                : score >= C().HEALTH.YELLOW_MIN ? 'YELLOW' : 'RED';
            return { clientId: clientId, score: score, status: status, signals: signals };
        },

        healthDistribution() {
            const out = { GREEN: 0, YELLOW: 0, RED: 0 };
            clients().list({ includeArchived: true }).forEach(function (c) {
                const h = commercial.health(c.id);
                if (h) out[h.status]++;
            });
            return out;
        },

        // ---------- Phase 7: commercial dashboard rollup ----------

        portfolio() {
            const f = commercial.forecast();
            const liveContracts = (contracts() ? contracts().list({ includeArchived: true }) : [])
                .filter(commercial.CLOSED_CONTRACT).length;
            return {
                totalClients: clients().entries.size,
                pipelineValue: f.pipelineValue,
                activeContracts: liveContracts,
                expectedRevenue: f.expectedRevenue,
                closedRevenue: f.closedRevenue,
                projectedRevenue: f.projectedRevenue,
                clientsByStage: commercial.clientsByStage(),
                healthDistribution: commercial.healthDistribution()
            };
        }
    };

    SYSOS.commercial = commercial;
})();
