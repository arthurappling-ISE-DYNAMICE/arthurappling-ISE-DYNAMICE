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

        /**
         * Transition a client to a new lifecycle stage; records full timestamped
         * history. opts: { user, source, notes }. The ONLY sanctioned write path
         * for client.stage (v2.9.8) — UI and API both route through here.
         */
        setStage(clientId, stage, opts) {
            opts = opts || {};
            const c = clients().get(clientId);
            if (!c) throw new Error('unknown client: ' + clientId);
            if (C().CLIENT_LIFECYCLE.indexOf(stage) === -1) throw new Error('invalid stage: ' + stage);
            const from = c.stage || null;
            if (from === stage) return c; // no-op transition, no history noise
            const history = (c.stageHistory || []).slice();
            history.push({
                from: from, to: stage, ts: new Date().toISOString(),
                user: opts.user || SYSOS.CONFIG.IDENTITY.NAME,
                source: opts.source || 'api',
                notes: opts.notes || ''
            });
            clients().update(clientId, { stage: stage, stageHistory: history });
            SYSOS.activity.log('LIFECYCLE', clientId + ' ' + (from || 'INIT') + ' -> ' + stage +
                ' (' + (opts.source || 'api') + ')');
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

            // v2.9.8: all arithmetic in integer cents via the money layer.
            const M = SYSOS.money;
            const weightOf = function (p) {
                return (p.probability !== null && p.probability !== undefined)
                    ? p.probability : (W[p.status] || 0);
            };
            const pipelineCents = clist.reduce(function (n, c) { return n + M.toCents(c.value || 0); }, 0);
            const proposalCents = props.filter(commercial.OPEN_PROPOSAL)
                .reduce(function (n, p) { return n + M.toCents(p.amount || 0); }, 0);
            const contractCents = cons.reduce(function (n, k) { return n + M.toCents(k.value || 0); }, 0);
            const closedCents = cons.filter(commercial.CLOSED_CONTRACT)
                .reduce(function (n, k) { return n + M.toCents(k.value || 0); }, 0);
            const expectedCents = props.reduce(function (n, p) {
                return n + M.weightCents(M.toCents(p.amount || 0), weightOf(p));
            }, 0);
            const projectedCents = M.addCents(closedCents, expectedCents);

            return {
                scope: clientId || 'PORTFOLIO',
                pipelineValue: M.toDollars(pipelineCents),
                proposalValue: M.toDollars(proposalCents),
                contractValue: M.toDollars(contractCents),
                closedRevenue: M.toDollars(closedCents),
                expectedRevenue: M.toDollars(expectedCents),
                projectedRevenue: M.toDollars(projectedCents),
                // Cents exposed for downstream safe aggregation / verification.
                cents: { pipeline: pipelineCents, proposal: proposalCents, contract: contractCents,
                    closed: closedCents, expected: expectedCents, projected: projectedCents },
                counts: { proposals: props.length, contracts: cons.length }
            };
        },

        // ---------- Phase 7: revenue operations (all derived from records) ----------

        revenueByClient() {
            const out = [];
            clients().list({ includeArchived: true }).forEach(function (c) {
                const f = commercial.forecast(c.id);
                out.push({ clientId: c.id, name: c.name,
                    pipeline: f.pipelineValue, expected: f.expectedRevenue,
                    closed: f.closedRevenue, projected: f.projectedRevenue });
            });
            return out.sort(function (a, b) { return b.projected - a.projected; });
        },

        revenueByProposalStatus() {
            const out = {};
            C().PROPOSAL_STATUSES.forEach(function (s) { out[s] = { count: 0, value: 0 }; });
            (proposals() ? proposals().list({ includeArchived: true }) : []).forEach(function (p) {
                if (!out[p.status]) out[p.status] = { count: 0, value: 0 };
                out[p.status].count++; out[p.status].value += (p.amount || 0);
            });
            return out;
        },

        revenueByLifecycleStage() {
            const out = {};
            C().CLIENT_LIFECYCLE.forEach(function (s) { out[s] = { clients: 0, projected: 0 }; });
            clients().list({ includeArchived: true }).forEach(function (c) {
                const stage = c.stage || 'LEAD';
                if (!out[stage]) out[stage] = { clients: 0, projected: 0 };
                out[stage].clients++;
                out[stage].projected += commercial.forecast(c.id).projectedRevenue;
            });
            return out;
        },

        // ---------- Phase 4: proposal automation ----------

        daysUntil(dateStr) {
            if (!dateStr) return null;
            return Math.floor((new Date(dateStr).getTime() - Date.now()) / DAY);
        },

        /** Threshold bucket a positive days-remaining value falls into (or null). */
        warningThreshold(days) {
            if (days === null || days < 0) return null;
            const t = C().EXPIRY_THRESHOLDS;
            for (var i = t.length - 1; i >= 0; i--) { if (days <= t[i]) return t[i]; }
            return null;
        },

        proposalAutomation() {
            const list = proposals() ? proposals().list({ includeArchived: true }) : [];
            const open = list.filter(commercial.OPEN_PROPOSAL);
            const upcoming = [];
            const expired = [];
            open.forEach(function (p) {
                const d = commercial.daysUntil(p.expirationDate);
                if (d === null) return;
                if (d < 0) expired.push({ id: p.id, title: p.title, clientId: p.clientId, daysOverdue: -d });
                else {
                    const th = commercial.warningThreshold(d);
                    if (th !== null) upcoming.push({ id: p.id, title: p.title, clientId: p.clientId,
                        daysRemaining: d, threshold: th });
                }
            });
            upcoming.sort(function (a, b) { return a.daysRemaining - b.daysRemaining; });
            const accepted = list.filter(function (p) { return p.status === 'ACCEPTED'; });
            const rejected = list.filter(function (p) { return p.status === 'REJECTED'; });
            const expiredStatus = list.filter(function (p) { return p.status === 'EXPIRED'; });
            const decided = accepted.length + rejected.length;
            return {
                openProposals: open.length,
                acceptedProposals: accepted.length,
                rejectedProposals: rejected.length,
                expiredProposals: expiredStatus.length,
                totalProposalValue: list.reduce(function (n, p) { return n + (p.amount || 0); }, 0),
                acceptanceRate: decided ? Math.round(accepted.length / decided * 100) : 0,
                upcomingExpirations: upcoming,
                expiredQueue: expired
            };
        },

        /** Auto-transition open proposals past expiration to EXPIRED. Returns count changed. */
        sweepExpiredProposals() {
            if (!proposals()) return 0;
            var changed = 0;
            proposals().list({ includeArchived: true }).forEach(function (p) {
                if (commercial.OPEN_PROPOSAL(p)) {
                    var d = commercial.daysUntil(p.expirationDate);
                    if (d !== null && d < 0) {
                        proposals().update(p.id, { status: 'EXPIRED' });
                        SYSOS.activity.log('PROPOSAL', p.id + ' auto-expired (' + (-d) + 'd overdue)');
                        changed++;
                    }
                }
            });
            return changed;
        },

        // ---------- Phase 6: contract monitoring ----------

        contractMonitoring() {
            const list = contracts() ? contracts().list({ includeArchived: true }) : [];
            const alive = C().CONTRACT_ALIVE;
            const upcomingExpiration = [];
            const upcomingRenewal = [];
            list.forEach(function (k) {
                if (alive.indexOf(k.status) === -1) return;
                const de = commercial.daysUntil(k.expirationDate);
                if (de !== null && de >= 0 && commercial.warningThreshold(de) !== null) {
                    upcomingExpiration.push({ id: k.id, title: k.title, clientId: k.clientId,
                        daysRemaining: de, threshold: commercial.warningThreshold(de) });
                }
                const dr = commercial.daysUntil(k.renewalDate);
                if (dr !== null && dr >= 0 && commercial.warningThreshold(dr) !== null) {
                    upcomingRenewal.push({ id: k.id, title: k.title, clientId: k.clientId,
                        daysRemaining: dr, threshold: commercial.warningThreshold(dr) });
                }
            });
            upcomingExpiration.sort(function (a, b) { return a.daysRemaining - b.daysRemaining; });
            upcomingRenewal.sort(function (a, b) { return a.daysRemaining - b.daysRemaining; });
            return {
                activeContracts: list.filter(commercial.CLOSED_CONTRACT).length,
                expiredContracts: list.filter(function (k) { return k.status === 'EXPIRED'; }).length,
                renewingContracts: upcomingRenewal.length,
                contractValue: list.reduce(function (n, k) { return n + (k.value || 0); }, 0),
                upcomingExpiration: upcomingExpiration,
                upcomingRenewal: upcomingRenewal
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

            // 6. Document activity (v2.9.7) — at least one linked vault document.
            const docs = resolved.links.documents.filter(function (d) { return !d.missing; }).length;
            signals.push({ name: 'Document activity', points: docs ? MAX : 0, max: MAX,
                reason: docs + ' linked document(s)' });

            // Normalize to 0-100 across all factors; risk flags from any zeroed factor.
            const rawMax = signals.length * MAX;
            const raw = signals.reduce(function (n, s) { return n + s.points; }, 0);
            const score = Math.round(raw / rawMax * 100);
            const status = score >= C().HEALTH.GREEN_MIN ? 'GREEN'
                : score >= C().HEALTH.YELLOW_MIN ? 'YELLOW' : 'RED';
            const riskFlags = signals.filter(function (s) { return s.points === 0; })
                .map(function (s) { return s.name + ': ' + s.reason; });
            return { clientId: clientId, score: score, status: status, signals: signals, riskFlags: riskFlags };
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
            const pa = commercial.proposalAutomation();
            const cm = commercial.contractMonitoring();
            return {
                totalClients: clients().entries.size,
                pipelineValue: f.pipelineValue,
                proposalValue: f.proposalValue,
                contractValue: cm.contractValue,
                activeContracts: cm.activeContracts,
                expectedRevenue: f.expectedRevenue,
                closedRevenue: f.closedRevenue,
                projectedRevenue: f.projectedRevenue,
                openProposals: pa.openProposals,
                acceptanceRate: pa.acceptanceRate,
                upcomingProposalExpirations: pa.upcomingExpirations.length,
                renewingContracts: cm.renewingContracts,
                clientsByStage: commercial.clientsByStage(),
                healthDistribution: commercial.healthDistribution()
            };
        }
    };

    SYSOS.commercial = commercial;
})();
