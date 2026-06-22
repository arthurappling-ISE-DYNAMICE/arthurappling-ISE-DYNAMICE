/**
 * SYS_OS v2.9.5 — Client Layer (Commercial Readiness)
 *
 * A derived layer over the v2.9.5 Client Registry (DataStore domain 'clients').
 * Adds nothing to the persistence surface beyond the registry store — clients
 * persist in sysos.registry.v1 like every other domain. This module provides:
 *
 *   workspace(clientId)  Resolved client workspace: projects + documents +
 *                        compliance + computed metrics (the Client Workspace Model).
 *   metrics(clientId)    Per-client dashboard metrics (counts + pipeline value).
 *   dashboard()          Portfolio roll-up across all clients.
 *   report(clientId)     Structured client report object (the Reporting Layer).
 *   reportText(clientId) Plain-text rendering of report() for export/preview.
 *
 * Relationships are resolved through SYSOS.relations (clients is now a first-
 * class LINK_DOMAIN), so Client<->Project and Client<->Vault are bidirectional:
 * a client's forward links list its assets; relations.backlinks(clientId)
 * lists everything pointing back at the client.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;
    const el = function () { return SYSOS.utils.el.apply(null, arguments); };

    function store() { return SYSOS.stores.all.clients; }

    const client = {
        // ---------- workspace model ----------

        /** Resolve a client into its full operational workspace. */
        workspace(clientId) {
            const c = store() ? store().get(clientId) : null;
            if (!c) return null;
            const resolved = SYSOS.relations.resolve('clients', clientId);
            const projectLinks = resolved.links.projects.filter(function (p) { return !p.missing; });
            const docLinks = resolved.links.documents.filter(function (d) { return !d.missing; });

            // Pull full project records + derive compliance obligations through them.
            const projects = projectLinks.map(function (p) {
                return SYSOS.stores.all.projects.get(p.id);
            }).filter(Boolean);

            const documents = docLinks.map(function (d) {
                return SYSOS.vault.documents.get(d.id);
            }).filter(Boolean);

            // Compliance records linked to this client's projects.
            const projectIds = projects.map(function (p) { return p.id; });
            const compliance = SYSOS.stores.all.compliance.list({ includeArchived: true })
                .filter(function (rec) {
                    return (rec.links.projects || []).some(function (pid) {
                        return projectIds.indexOf(pid) !== -1;
                    });
                });

            return {
                client: c,
                projects: projects,
                documents: documents,
                compliance: compliance,
                backlinks: SYSOS.relations.backlinks(clientId),
                metrics: this.metrics(clientId),
                // v2.9.6 commercial integration (guarded — engine loads after client.js)
                stage: c.stage || null,
                stageHistory: c.stageHistory || [],
                proposals: SYSOS.commercial ? SYSOS.commercial.proposalsFor(clientId) : [],
                contracts: SYSOS.commercial ? SYSOS.commercial.contractsFor(clientId) : [],
                forecast: SYSOS.commercial ? SYSOS.commercial.forecast(clientId) : null,
                health: SYSOS.commercial ? SYSOS.commercial.health(clientId) : null
            };
        },

        // ---------- dashboard metrics ----------

        metrics(clientId) {
            const c = store().get(clientId);
            if (!c) return null;
            const resolved = SYSOS.relations.resolve('clients', clientId);
            const projects = resolved.links.projects.map(function (p) {
                return p.missing ? null : SYSOS.stores.all.projects.get(p.id);
            }).filter(Boolean);
            const activeProjects = projects.filter(function (p) { return p.status === 'ACTIVE'; }).length;
            const documents = resolved.links.documents.filter(function (d) { return !d.missing; }).length;
            // D-1 (v2.9.6 fix, v2.9.7 hardened): linkedEntities measures forward +
            // reverse across ALL link domains — projects, vault, clients, proposals,
            // contracts, compliance — via the centralized relations.linkStats.
            const ls = SYSOS.relations.linkStatsFast('clients', clientId);   // v3.3 indexed
            const forwardLinks = ls.forward;
            const reverseLinks = ls.reverse;
            return {
                clientId: clientId,
                name: c.name,
                segment: c.segment,
                tier: c.tier,
                status: c.status,
                pipelineValue: c.value || 0,
                totalProjects: projects.length,
                activeProjects: activeProjects,
                documents: documents,
                forwardLinks: forwardLinks,
                reverseLinks: reverseLinks,
                linkedEntities: ls.total
            };
        },

        /** Portfolio roll-up across the whole client registry. */
        dashboard() {
            const self = this;
            const clients = store() ? store().list({ includeArchived: true }) : [];
            const rows = clients.map(function (c) { return self.metrics(c.id); });
            return {
                totalClients: clients.length,
                active: clients.filter(function (c) { return c.status === 'ACTIVE'; }).length,
                prospects: clients.filter(function (c) { return c.status === 'PROSPECT'; }).length,
                house: clients.filter(function (c) { return c.segment === 'HOUSE'; }).length,
                pipelineValue: rows.reduce(function (n, m) { return n + (m.pipelineValue || 0); }, 0),
                clients: rows
            };
        },

        // ---------- reporting layer ----------

        report(clientId) {
            const ws = this.workspace(clientId);
            if (!ws) return null;
            return {
                generatedAt: new Date().toISOString(),
                platform: 'SYS_OS v' + SYSOS.CONFIG.VERSION,
                client: {
                    id: ws.client.id, name: ws.client.name, segment: ws.client.segment,
                    tier: ws.client.tier, status: ws.client.status,
                    contact: ws.client.contact, email: ws.client.email, value: ws.client.value
                },
                metrics: ws.metrics,
                projects: ws.projects.map(function (p) {
                    return { id: p.id, name: p.name, status: p.status, priority: p.priority, category: p.category };
                }),
                documents: ws.documents.map(function (d) {
                    return { id: d.id, path: d.path, classification: d.classification, hash: d.hashAlgo + ':' + String(d.hash).slice(0, 9) };
                }),
                compliance: ws.compliance.map(function (rec) {
                    return { id: rec.id, name: rec.name, status: rec.status };
                }),
                // v2.9.6 commercial report sections
                lifecycle: { stage: ws.stage, history: ws.stageHistory },
                proposals: ws.proposals.map(function (p) {
                    return { id: p.id, title: p.title, amount: p.amount, status: p.status, expectedCloseDate: p.expectedCloseDate };
                }),
                contracts: ws.contracts.map(function (k) {
                    return { id: k.id, title: k.title, status: k.status, value: k.value, proposalId: k.proposalId, expirationDate: k.expirationDate };
                }),
                revenue: ws.forecast,
                health: ws.health
            };
        },

        reportText(clientId) {
            const r = this.report(clientId);
            if (!r) return '';
            const lines = [];
            lines.push('CLIENT REPORT — ' + r.client.name);
            lines.push(r.platform + ' · generated ' + r.generatedAt);
            lines.push('Segment: ' + r.client.segment + ' · Tier: ' + r.client.tier + ' · Status: ' + r.client.status);
            lines.push('Contact: ' + (r.client.contact || '—') + ' · Pipeline value: $' + (r.client.value || 0).toLocaleString());
            lines.push('');
            lines.push('METRICS: ' + r.metrics.totalProjects + ' projects (' + r.metrics.activeProjects +
                ' active) · ' + r.metrics.documents + ' documents · ' + r.metrics.linkedEntities + ' linked entities');
            lines.push('');
            lines.push('PROJECTS (' + r.projects.length + '):');
            r.projects.forEach(function (p) { lines.push('  - ' + p.name + ' [' + p.status + '/' + p.priority + '] ' + p.category); });
            lines.push('');
            lines.push('DOCUMENTS (' + r.documents.length + '):');
            r.documents.forEach(function (d) { lines.push('  - ' + d.path + ' [' + d.classification + '] ' + d.hash); });
            lines.push('');
            lines.push('COMPLIANCE (' + r.compliance.length + '):');
            r.compliance.forEach(function (cmp) { lines.push('  - ' + cmp.name + ' [' + cmp.status + ']'); });
            // v2.9.6 commercial sections
            if (r.lifecycle) {
                lines.push('');
                lines.push('LIFECYCLE: ' + (r.lifecycle.stage || '—') + ' (' + r.lifecycle.history.length + ' transitions)');
            }
            if (r.proposals) {
                lines.push('');
                lines.push('PROPOSAL SUMMARY (' + r.proposals.length + '):');
                r.proposals.forEach(function (p) { lines.push('  - ' + p.title + ' $' + (p.amount || 0).toLocaleString() + ' [' + p.status + ']'); });
            }
            if (r.contracts) {
                lines.push('');
                lines.push('CONTRACT SUMMARY (' + r.contracts.length + '):');
                r.contracts.forEach(function (k) { lines.push('  - ' + k.title + ' $' + (k.value || 0).toLocaleString() + ' [' + k.status + ']'); });
            }
            if (r.revenue) {
                lines.push('');
                lines.push('REVENUE SUMMARY: pipeline $' + r.revenue.pipelineValue.toLocaleString() +
                    ' · expected $' + r.revenue.expectedRevenue.toLocaleString() +
                    ' · closed $' + r.revenue.closedRevenue.toLocaleString() +
                    ' · projected $' + r.revenue.projectedRevenue.toLocaleString());
            }
            if (r.health) {
                lines.push('');
                lines.push('HEALTH SUMMARY: ' + r.health.status + ' (' + r.health.score + '/100)');
                r.health.signals.forEach(function (s) { lines.push('  - ' + s.name + ': ' + s.points + '/' + s.max + ' (' + s.reason + ')'); });
            }
            return lines.join('\n');
        }
    };

    SYSOS.client = client;

    // -------------------------------------------------------------- station 08

    const TONE = {
        ACTIVE: 'text-emerald-400', PROSPECT: 'text-gold-400', ARCHIVED: 'text-slate-500',
        INTERNAL: 'text-emerald-400', ELITE: 'text-gold-400', STANDARD: 'text-slate-400', HOUSE: 'text-emerald-400',
        GREEN: 'text-emerald-400', YELLOW: 'text-amber-400', RED: 'text-red-400'   // v2.9.6 health
    };
    function badge(text, tone) {
        return el('span', 'px-2 py-0.5 rounded text-[10px] font-bold border border-white/10 tracking-wider ' +
            (TONE[tone] || 'text-slate-400'), text);
    }

    let selectedClient = null;
    // v2.9.8: data-level filter state (replaces DOM show/hide filtering).
    let listFilter = { text: '', stage: '' };
    // v3.3: client list pagination
    let clientPage = 0;
    const CLIENT_PAGE_SIZE = 25;

    function filteredClients() {
        return SYSOS.stores.all.clients.list({ includeArchived: true }).filter(function (c) {
            const hay = (c.name + ' ' + c.segment + ' ' + c.id + ' ' + (c.tier || '')).toLowerCase();
            const okText = !listFilter.text || hay.indexOf(listFilter.text.toLowerCase()) !== -1;
            const okStage = !listFilter.stage || c.stage === listFilter.stage;
            return okText && okStage;
        });
    }

    function stationHTML() {
        return '' +
        '<div class="bg-black/40 border border-gold-500/10 rounded-xl p-6 backdrop-blur-md">' +
            '<div class="flex items-center justify-between border-b border-gold-500/10 pb-4 mb-6">' +
                '<div><h2 class="text-xs font-cyber font-semibold tracking-widest text-gold-400">Client Command Center</h2>' +
                '<p class="text-[11px] text-slate-500 font-mono mt-1">Multi-client workspaces · project & vault relationships · reporting layer</p></div>' +
                '<span id="client-portfolio-badge" class="text-[9px] font-mono text-gold-400 border border-gold-500/20 px-2 py-1 rounded bg-gold-500/5"></span>' +
            '</div>' +
            '<div id="client-dash" class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-center"></div>' +
            '<div class="mb-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Executive Commercial Dashboard — computed from live records</div>' +
            '<div id="commercial-dash" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-center"></div>' +
            '<div id="commercial-breakdown" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"></div>' +
            '<div id="commercial-admin"></div>' +  // v2.9.7 admin UI injection anchor
            '<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">' +
                '<div><h3 class="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Client Registry</h3>' +
                    '<div id="client-list" class="space-y-2"></div></div>' +
                '<div><h3 class="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Workspace</h3>' +
                    '<div id="client-workspace" class="bg-slate-950/40 border border-white/5 rounded-lg p-4 text-[11px] font-mono text-slate-500">Select a client to load its workspace.</div></div>' +
            '</div>' +
        '</div>';
    }

    function statCard(label, value, tone) {
        const card = el('div', 'bg-slate-950/60 border border-white/5 rounded-lg p-3');
        card.appendChild(el('div', 'text-[9px] font-mono text-slate-500 tracking-widest uppercase', label));
        card.appendChild(el('div', 'text-2xl font-mono font-bold mt-1 ' + (tone || 'text-slate-200'), String(value)));
        return card;
    }

    function renderDash() {
        const d = SYSOS.client.dashboard();
        const wrap = document.getElementById('client-dash');
        if (!wrap) return;
        wrap.textContent = '';
        wrap.appendChild(statCard('Total Clients', d.totalClients, 'text-slate-200'));
        wrap.appendChild(statCard('Active', d.active, 'text-emerald-400'));
        wrap.appendChild(statCard('Prospects', d.prospects, 'text-gold-400'));
        wrap.appendChild(statCard('House', d.house, 'text-emerald-400'));
        wrap.appendChild(statCard('Pipeline', '$' + d.pipelineValue.toLocaleString(), 'text-gold-400'));
        const badgeEl = document.getElementById('client-portfolio-badge');
        if (badgeEl) badgeEl.textContent = d.totalClients + ' CLIENTS // $' + d.pipelineValue.toLocaleString() + ' PIPELINE';
    }

    function renderCommercialDash() {
        if (!SYSOS.commercial) return;
        const p = SYSOS.commercial.portfolio();
        const wrap = document.getElementById('commercial-dash');
        if (wrap) {
            wrap.textContent = '';
            wrap.appendChild(statCard('Active Contracts', p.activeContracts, 'text-emerald-400'));
            wrap.appendChild(statCard('Expected Rev', '$' + p.expectedRevenue.toLocaleString(), 'text-gold-400'));
            wrap.appendChild(statCard('Closed Rev', '$' + p.closedRevenue.toLocaleString(), 'text-emerald-400'));
            wrap.appendChild(statCard('Projected Rev', '$' + p.projectedRevenue.toLocaleString(), 'text-gold-400'));
        }
        const bd = document.getElementById('commercial-breakdown');
        if (bd) {
            bd.textContent = '';
            const stageBox = el('div', 'bg-slate-950/40 border border-white/5 rounded-lg p-3');
            stageBox.appendChild(el('div', 'text-[9px] font-mono text-slate-500 tracking-widest uppercase mb-1', 'Clients By Stage'));
            stageBox.appendChild(el('div', 'text-[11px] font-mono text-slate-300',
                Object.entries(p.clientsByStage).filter(function (e) { return e[1] > 0; })
                    .map(function (e) { return e[0] + ':' + e[1]; }).join(' · ') || 'none'));
            const healthBox = el('div', 'bg-slate-950/40 border border-white/5 rounded-lg p-3');
            healthBox.appendChild(el('div', 'text-[9px] font-mono text-slate-500 tracking-widest uppercase mb-1', 'Health Distribution'));
            const hd = p.healthDistribution;
            const hrow = el('div', 'text-[11px] font-mono');
            hrow.appendChild(el('span', 'text-emerald-400', 'GREEN ' + hd.GREEN));
            hrow.appendChild(el('span', 'text-slate-600', '  ·  '));
            hrow.appendChild(el('span', 'text-amber-400', 'YELLOW ' + hd.YELLOW));
            hrow.appendChild(el('span', 'text-slate-600', '  ·  '));
            hrow.appendChild(el('span', 'text-red-400', 'RED ' + hd.RED));
            healthBox.appendChild(hrow);
            bd.appendChild(stageBox); bd.appendChild(healthBox);
        }
    }

    // ---- v3.7: commercial record CRUD controls (client / proposal / contract) ----
    function crudBtn(action, recMode, id, label, danger) {
        const b = el('button', 'text-[9px] font-mono border px-2 py-0.5 rounded tracking-widest transition-all duration-300 ' +
            (danger ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-gold-500/30 text-gold-400 hover:bg-gold-500 hover:text-black'), label);
        b.type = 'button';
        b.dataset.commercialAction = action; b.dataset.recMode = recMode; b.dataset.id = id;
        return b;
    }

    // Relationship-safety probe (F1): would hard-deleting this record orphan a reference?
    function linkRisk(id) {
        const back = (SYSOS.relations.backlinks(id) || []);
        let vaultRefs = 0;
        try {
            SYSOS.vault.documents.forEach(function (doc) {
                const L = doc.links || {};
                ['clients', 'proposals', 'contracts'].forEach(function (d) {
                    if ((L[d] || []).indexOf(id) !== -1) vaultRefs++;
                });
            });
        } catch (e) { /* vault optional */ }
        const total = back.length + vaultRefs;
        const parts = [];
        if (back.length) parts.push(back.length + ' backlink(s)');
        if (vaultRefs) parts.push(vaultRefs + ' vault link(s)');
        return { hasRisk: total > 0, count: total, summary: parts.join(', ') || 'none' };
    }

    function handleCommercialAction(btn) {
        const action = btn.dataset.commercialAction;
        const recMode = btn.dataset.recMode;            // 'client' | 'proposal' | 'contract'
        const id = btn.dataset.id;
        const store = SYSOS.stores.all[recMode + 's'];
        if (action === 'edit') {
            if (SYSOS.commercialUI) SYSOS.commercialUI.edit(recMode, id);
            return;
        }
        if (action === 'archive') {
            try { store.archive(id); SYSOS.utils.notify(recMode.toUpperCase() + ' ARCHIVED', [id + ' — record retained (links preserved), hidden from active reporting.']); }
            catch (e) { SYSOS.utils.notify('ARCHIVE DENIED', [e.message]); }
            return;
        }
        if (action === 'unarchive') {
            try {
                const cur = store.get(id);
                store.update(id, { status: (cur && cur.prevStatus) || 'ACTIVE', archived: false });
                SYSOS.utils.notify(recMode.toUpperCase() + ' RESTORED', [id + ' — returned to active.']);
            } catch (e) { SYSOS.utils.notify('RESTORE DENIED', [e.message]); }
            return;
        }
        if (action === 'delete') {
            // F1 safety: never hard-delete a record that something references.
            const risk = linkRisk(id);
            if (risk.hasRisk) {
                SYSOS.utils.notify('DELETE BLOCKED — LINKED RECORD', [
                    id + ' is referenced by ' + risk.count + ' record(s): ' + risk.summary + '.',
                    'Hard delete would orphan those links. Use ARCHIVE instead (record retained).']);
                if (SYSOS.audit) SYSOS.audit.record({ action: recMode + '.delete_blocked', domain: recMode + 's',
                    target: id, source: 'commercial-ui', reason: 'linked_records', notes: risk.summary });
                return;
            }
            // two-step confirm (no window.confirm)
            if (btn.dataset.confirm !== '1') {
                btn.dataset.confirm = '1'; const orig = btn.textContent; btn.textContent = 'CONFIRM?';
                setTimeout(function () { btn.dataset.confirm = ''; btn.textContent = orig; }, 3000);
                return;
            }
            try {
                store.remove(id);
                if (selectedClient === id) selectedClient = null;
                SYSOS.utils.notify(recMode.toUpperCase() + ' DELETED', [id + ' permanently removed (no linked records).']);
                const integ = SYSOS.relations.integrity();
                if (!integ.valid) SYSOS.utils.notify('INTEGRITY WARNING', [integ.broken.length + ' broken link(s) after delete — investigate.']);
            } catch (e) { SYSOS.utils.notify('DELETE DENIED', [e.message]); }
            return;
        }
    }

    function renderList() {
        const wrap = document.getElementById('client-list');
        if (!wrap) return;
        wrap.textContent = '';
        // v3.3: filter (full dataset) + sort, THEN paginate — only one page of
        // DOM rows exists at a time, regardless of dataset size.
        const all = filteredClients().sort(function (a, b) { return a.name.localeCompare(b.name); });
        if (!all.length) {
            wrap.appendChild(el('div', 'text-[11px] font-mono text-slate-600 p-3', 'No clients match the current filter.'));
            return;
        }
        const pages = Math.ceil(all.length / CLIENT_PAGE_SIZE);
        if (clientPage >= pages) clientPage = pages - 1;
        if (clientPage < 0) clientPage = 0;
        const start = clientPage * CLIENT_PAGE_SIZE;
        const pageRows = all.slice(start, start + CLIENT_PAGE_SIZE);
        pageRows.forEach(function (c) {
            // v3.7: row is a div (not a button) so it can host record-action controls.
            const row = el('div', 'w-full text-left flex items-center justify-between p-3 bg-slate-950/40 border rounded-lg transition-all duration-300 cursor-pointer ' +
                (c.id === selectedClient ? 'border-gold-500/40' : 'border-white/5 hover:border-gold-500/20'));
            row.dataset.clientSelect = c.id; row.setAttribute('role', 'button'); row.tabIndex = 0;
            const left = el('div');
            left.appendChild(el('div', 'text-xs font-mono text-slate-300', c.name));
            left.appendChild(el('div', 'text-[10px] font-mono text-slate-600', c.segment + ' · ' + c.tier + ' · $' + (c.value || 0).toLocaleString()));
            const right = el('div', 'flex items-center gap-1.5');
            right.appendChild(badge(c.status, c.status));
            right.appendChild(crudBtn('edit', 'client', c.id, 'EDIT'));
            right.appendChild(crudBtn(c.archived ? 'unarchive' : 'archive', 'client', c.id, c.archived ? 'UNARCH' : 'ARCH'));
            right.appendChild(crudBtn('delete', 'client', c.id, 'DEL', true));
            row.appendChild(left); row.appendChild(right);
            wrap.appendChild(row);
        });
        // pagination controls
        if (pages > 1) {
            const bar = el('div', 'flex items-center justify-between mt-2 px-1');
            const prev = el('button', 'text-[10px] font-mono border border-white/15 text-slate-400 px-2 py-1 rounded hover:text-slate-200 disabled:opacity-30', 'PREV');
            prev.type = 'button'; prev.dataset.clientPage = 'prev'; prev.disabled = clientPage === 0;
            const info = el('div', 'text-[10px] font-mono text-slate-500',
                (start + 1) + '–' + Math.min(start + CLIENT_PAGE_SIZE, all.length) + ' of ' + all.length + ' · pg ' + (clientPage + 1) + '/' + pages);
            const next = el('button', 'text-[10px] font-mono border border-white/15 text-slate-400 px-2 py-1 rounded hover:text-slate-200 disabled:opacity-30', 'NEXT');
            next.type = 'button'; next.dataset.clientPage = 'next'; next.disabled = clientPage >= pages - 1;
            bar.appendChild(prev); bar.appendChild(info); bar.appendChild(next);
            wrap.appendChild(bar);
        }
    }

    function renderWorkspace() {
        const box = document.getElementById('client-workspace');
        if (!box) return;
        if (!selectedClient) { box.textContent = 'Select a client to load its workspace.'; return; }
        const ws = SYSOS.client.workspace(selectedClient);
        box.textContent = '';

        const head = el('div', 'flex items-center justify-between border-b border-white/5 pb-2 mb-3');
        head.appendChild(el('div', 'text-[10px] font-cyber font-bold text-gold-400 tracking-widest uppercase', ws.client.name));
        const rep = el('button', 'text-[9px] font-mono border border-gold-500/30 text-gold-400 px-2 py-0.5 rounded tracking-widest hover:bg-gold-500 hover:text-black transition-all duration-300', 'GEN_REPORT');
        rep.type = 'button'; rep.dataset.clientReport = selectedClient;
        head.appendChild(rep);
        box.appendChild(head);

        const m = ws.metrics;
        box.appendChild(el('div', 'text-slate-400 mb-2',
            m.totalProjects + ' projects (' + m.activeProjects + ' active) · ' + m.documents +
            ' documents · $' + m.pipelineValue.toLocaleString() + ' pipeline · ' + m.linkedEntities + ' linked entities'));

        function group(title, items, fmt, recMode) {
            box.appendChild(el('div', 'text-slate-600 uppercase tracking-wider mt-2', title + ' (' + items.length + ')'));
            if (!items.length) { box.appendChild(el('div', 'text-slate-700', '  none')); return; }
            items.forEach(function (it) {
                if (recMode) {   // v3.7: proposals/contracts get inline edit/archive/delete
                    const rowEl = el('div', 'flex items-center justify-between gap-2');
                    rowEl.appendChild(el('div', 'text-slate-400 truncate', '  ' + fmt(it)));
                    const rail = el('div', 'flex items-center gap-1 shrink-0');
                    rail.appendChild(crudBtn('edit', recMode, it.id, 'EDIT'));
                    rail.appendChild(crudBtn(it.archived ? 'unarchive' : 'archive', recMode, it.id, it.archived ? 'UNARCH' : 'ARCH'));
                    rail.appendChild(crudBtn('delete', recMode, it.id, 'DEL', true));
                    rowEl.appendChild(rail);
                    box.appendChild(rowEl);
                } else {
                    box.appendChild(el('div', 'text-slate-400', '  ' + fmt(it)));
                }
            });
        }
        // v2.9.6 commercial header: lifecycle stage + health
        if (ws.stage || ws.health) {
            const cr = el('div', 'flex items-center gap-2 mb-2 flex-wrap');
            if (ws.stage) cr.appendChild(badge('STAGE: ' + ws.stage, 'PROSPECT'));
            if (ws.health) cr.appendChild(badge('HEALTH: ' + ws.health.status + ' ' + ws.health.score + '/100', ws.health.status));
            if (ws.forecast) cr.appendChild(el('span', 'text-[11px] font-mono text-gold-400/80',
                'projected $' + ws.forecast.projectedRevenue.toLocaleString()));
            box.appendChild(cr);
        }

        group('Projects', ws.projects, function (p) { return p.name + ' [' + p.status + ']'; });
        group('Documents', ws.documents, function (d) { return d.path + ' [' + d.classification + ']'; });
        group('Compliance', ws.compliance, function (c) { return c.name + ' [' + c.status + ']'; });
        group('Proposals', ws.proposals, function (p) { return p.title + ' $' + (p.amount||0).toLocaleString() + ' [' + p.status + ']'; }, 'proposal');
        group('Contracts', ws.contracts, function (k) { return k.title + ' $' + (k.value||0).toLocaleString() + ' [' + k.status + ']'; }, 'contract');
    }

    function refreshAll() { renderDash(); renderCommercialDash(); renderList(); renderWorkspace(); }

    /**
     * v2.9.8 Station Mounting Contract — every station exposes
     * init/mount/unmount/refresh/validate. `panel` is passed to mount(); all
     * DOM access is scoped to it (no shared-anchor global lookups).
     */
    let stationPanel = null;
    SYSOS.clientStation = {
        id: 'clients',
        init() {
            const panel = SYSOS.router.register({
                id: 'clients',
                label: '08 // CLIENT CENTER',
                render: function (p) { SYSOS.clientStation.mount(p); }
            });
            document.addEventListener('sysos:data', function (e) {
                if (!e.detail || ['clients', 'projects', 'proposals', 'contracts'].indexOf(e.detail.domain) !== -1) SYSOS.clientStation.refresh();
            });
            document.addEventListener('sysos:commercial', function () { SYSOS.clientStation.refresh(); });
            return panel;
        },
        mount(panel) {
            stationPanel = panel;
            panel.innerHTML = stationHTML();   // static trusted shell
            panel.addEventListener('click', function (e) {
                // v3.7: record actions (edit/archive/delete) take priority over row-select.
                const cact = e.target.closest('[data-commercial-action]');
                if (cact) { handleCommercialAction(cact); return; }
                const pg = e.target.closest('[data-client-page]');
                if (pg) { clientPage += (pg.dataset.clientPage === 'next' ? 1 : -1); renderList(); return; }
                const sel = e.target.closest('[data-client-select]');
                if (sel) { selectedClient = sel.dataset.clientSelect; refreshAll(); return; }
                const rep = e.target.closest('[data-client-report]');
                if (rep) {
                    const text = SYSOS.client.reportText(rep.dataset.clientReport);
                    SYSOS.utils.notify('CLIENT REPORT GENERATED', text.split('\n').slice(0, 6));
                    SYSOS.activity.log('CLIENT', 'Report generated — ' + rep.dataset.clientReport);
                    console.info('\n' + text);
                }
            });
            if (SYSOS.commercialUI) SYSOS.commercialUI.mount(panel);   // contract handoff, panel-scoped
            refreshAll();
        },
        unmount() {
            if (SYSOS.commercialUI) SYSOS.commercialUI.unmount();
            if (stationPanel) stationPanel.innerHTML = '';
            stationPanel = null;
        },
        refresh() { if (stationPanel) refreshAll(); },
        /** Data-level filter entry point (replaces DOM show/hide). Resets to page 1. */
        setListFilter(patch) { listFilter = Object.assign({}, listFilter, patch || {}); clientPage = 0; renderList(); },
        getPanel() { return stationPanel; },
        validate() {
            return { ok: !!stationPanel && !!stationPanel.querySelector('#client-list'),
                station: 'clients', mounted: !!stationPanel };
        }
    };

    // Back-compat shim — main.js still calls SYSOS.clientInit().
    SYSOS.clientInit = function () { return SYSOS.clientStation.init(); };
})();
