/**
 * SYS_OS v2.9.9 — Executive Command Center UI
 *
 * Four new stations registered via the router contract — no existing station
 * touched. Professional, restrained styling (clean cards, clear hierarchy,
 * subtle accents) per Phase 8. All values render from SYSOS.executive (derived
 * live state). Each station exposes the mounting contract.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;
    const el = function () { return SYSOS.utils.el.apply(null, arguments); };
    const M = function () { return SYSOS.money; };

    const DOT = { GREEN: 'bg-emerald-400', YELLOW: 'bg-amber-400', RED: 'bg-red-400' };
    const TXT = { GREEN: 'text-emerald-400', YELLOW: 'text-amber-400', RED: 'text-red-400' };

    function card(extra) { return el('div', 'bg-white/[0.02] border border-white/10 rounded-lg p-4 ' + (extra || '')); }
    function metricCard(label, value, sub) {
        const c = card();
        c.appendChild(el('div', 'text-[10px] font-mono text-slate-500 uppercase tracking-wider', label));
        c.appendChild(el('div', 'text-2xl font-mono font-semibold text-slate-100 mt-1.5', String(value)));
        if (sub) c.appendChild(el('div', 'text-[10px] font-mono text-slate-600 mt-1', sub));
        return c;
    }
    function sectionHead(title, note) {
        const h = el('div', 'flex items-center justify-between border-b border-white/10 pb-3 mb-4');
        const left = el('div');
        left.appendChild(el('h2', 'text-sm font-semibold text-slate-100 tracking-wide', title));
        if (note) left.appendChild(el('p', 'text-[11px] font-mono text-slate-500 mt-0.5', note));
        h.appendChild(left);
        return h;
    }
    function btn(label, action, id) {
        const b = el('button', 'text-[11px] font-mono border border-gold-500/30 text-gold-400 px-3 py-1.5 rounded hover:bg-gold-500 hover:text-black transition-colors tracking-wide', label);
        b.type = 'button'; b.dataset.execAction = action; if (id) b.dataset.id = id;
        b.setAttribute('aria-label', label);
        return b;
    }

    // ---------------- Station 09: Executive Dashboard ----------------
    function dashboardShell() {
        const root = el('div', 'space-y-6');
        const head = sectionHead('Executive Dashboard', 'All values derived from live system state');
        const right = el('div', 'flex items-center gap-2');
        const demoBadge = el('span', 'text-[10px] font-mono px-2 py-1 rounded border', '');
        demoBadge.id = 'exec-demo-badge';
        right.appendChild(demoBadge);
        right.appendChild(btn('TOGGLE DEMO/LIVE', 'demo-toggle'));
        head.appendChild(right);
        root.appendChild(head);
        root.appendChild(el('div', 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3', '')).id = 'exec-metric-grid';
        const reports = card('mt-2');
        reports.appendChild(el('div', 'text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2', 'Reports'));
        const rbar = el('div', 'flex flex-wrap gap-2');
        ['executive', 'pipeline', 'compliance', 'health'].forEach(function (k) {
            rbar.appendChild(btn(k.toUpperCase(), 'report-' + k));
        });
        reports.appendChild(rbar);
        const out = el('pre', 'mt-3 text-[11px] font-mono text-slate-300 whitespace-pre-wrap bg-black/40 border border-white/5 rounded p-3 max-h-72 overflow-auto');
        out.id = 'exec-report-out'; out.textContent = 'Select a report to generate from live data.';
        reports.appendChild(out);
        root.appendChild(reports);
        return root;
    }
    function renderDashboard(panel) {
        const grid = panel.querySelector('#exec-metric-grid');
        if (!grid) return;
        const m = SYSOS.executive.metrics();
        grid.textContent = '';
        grid.appendChild(metricCard('Clients', m.clients.value));
        grid.appendChild(metricCard('Projects', m.projects.value));
        grid.appendChild(metricCard('Documents', m.documents.value));
        grid.appendChild(metricCard('Compliance', m.complianceItems.value));
        grid.appendChild(metricCard('Proposals', m.proposals.value));
        grid.appendChild(metricCard('Contracts', m.contracts.value));
        grid.appendChild(metricCard('Pipeline', M().formatDollars(m.pipelineValue.value)));
        grid.appendChild(metricCard('Expected Rev', M().formatDollars(m.expectedRevenue.value)));
        grid.appendChild(metricCard('Projected Rev', M().formatDollars(m.projectedRevenue.value)));
        const h = m.healthDistribution.value;
        grid.appendChild(metricCard('Client Health', 'G' + h.GREEN + ' Y' + h.YELLOW + ' R' + h.RED));
        grid.appendChild(metricCard('Open Ops', m.openOperations.value));
        grid.appendChild(metricCard('System', m.systemStatus.value));
        const badge = panel.querySelector('#exec-demo-badge');
        if (badge) {
            const mode = SYSOS.demo.status();
            badge.textContent = 'MODE: ' + mode;
            badge.className = 'text-[10px] font-mono px-2 py-1 rounded border ' +
                (mode === 'DEMO' ? 'border-amber-500/40 text-amber-400' : 'border-emerald-500/30 text-emerald-400');
        }
    }

    // ---------------- Station 10: Operator Workspace ----------------
    function workspaceShell() {
        const root = el('div', 'space-y-6');
        root.appendChild(sectionHead('Operator Workspace', 'Actionable view — derived from compliance, pipeline, and activity'));
        root.appendChild(el('div', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', '')).id = 'op-grid';
        return root;
    }
    function listCard(title, count, items, fmt, source) {
        const c = card();
        const head = el('div', 'flex items-center justify-between mb-2');
        head.appendChild(el('div', 'text-[11px] font-semibold text-slate-200 tracking-wide', title));
        head.appendChild(el('div', 'text-lg font-mono text-gold-400', String(count)));
        c.appendChild(head);
        if (!items || !items.length) c.appendChild(el('div', 'text-[11px] font-mono text-slate-600', 'Nothing pending.'));
        else items.slice(0, 5).forEach(function (it) { c.appendChild(el('div', 'text-[11px] font-mono text-slate-400 truncate', '· ' + fmt(it))); });
        c.appendChild(el('div', 'text-[9px] font-mono text-slate-700 mt-2 pt-2 border-t border-white/5', source));
        return c;
    }
    function renderWorkspace(panel) {
        const grid = panel.querySelector('#op-grid');
        if (!grid) return;
        const w = SYSOS.executive.operatorWorkspace();
        grid.textContent = '';
        grid.appendChild(listCard("Today's Tasks", w.todaysTasks.count, w.todaysTasks.items, function (t) { return '[' + t.kind + '] ' + t.label + ' (' + t.due + ')'; }, w.todaysTasks.source));
        grid.appendChild(listCard('Upcoming Compliance', w.upcomingCompliance.count, w.upcomingCompliance.items, function (r) { return r.name + ' (' + r.daysLeft + 'd, ' + r.state + ')'; }, w.upcomingCompliance.source));
        grid.appendChild(listCard('Upcoming Renewals', w.upcomingRenewals.count, w.upcomingRenewals.items, function (k) { return k.title + ' (' + k.daysRemaining + 'd)'; }, w.upcomingRenewals.source));
        grid.appendChild(listCard('Expiring Proposals', w.expiringProposals.count, w.expiringProposals.items, function (p) { return p.title + ' (' + p.daysRemaining + 'd)'; }, w.expiringProposals.source));
        grid.appendChild(listCard('Open Pipeline', w.openPipeline.count, [{ v: w.openPipeline.value }], function (x) { return M().formatDollars(x.v) + ' across open proposals'; }, w.openPipeline.source));
        grid.appendChild(listCard('Recent Client Activity', w.recentClientActivity.count, w.recentClientActivity.items, function (e) { return '[' + e.type + '] ' + e.message; }, w.recentClientActivity.source));
    }

    // ---------------- Station 11: Activity Timeline ----------------
    let timelineFilter = '';
    function timelineShell() {
        const root = el('div', 'space-y-4');
        const head = sectionHead('Activity Timeline', 'Unified chronological event log (persistent)');
        const sel = el('select', 'bg-black border border-white/10 rounded px-3 py-1.5 text-[11px] font-mono text-slate-300 focus:outline-none focus:border-gold-500/40');
        sel.id = 'timeline-filter'; sel.setAttribute('aria-label', 'Filter timeline by type');
        head.appendChild(sel);
        root.appendChild(head);
        root.appendChild(card('p-0')).id = 'timeline-list-wrap';
        return root;
    }
    function renderTimeline(panel) {
        const sel = panel.querySelector('#timeline-filter');
        if (sel) {
            const cur = sel.value || timelineFilter;
            const types = SYSOS.executive.timelineTypes();
            sel.textContent = '';
            const all = el('option', null, 'ALL TYPES (' + SYSOS.activity.entries.length + ')'); all.value = ''; sel.appendChild(all);
            Object.keys(types).sort().forEach(function (t) { const o = el('option', null, t + ' (' + types[t] + ')'); o.value = t; sel.appendChild(o); });
            sel.value = cur;
        }
        const wrap = panel.querySelector('#timeline-list-wrap');
        if (!wrap) return;
        wrap.textContent = '';
        const rows = SYSOS.executive.timeline(timelineFilter ? { type: timelineFilter } : {});
        if (!rows.length) { wrap.appendChild(el('div', 'text-[11px] font-mono text-slate-600 p-4', 'No events.')); return; }
        rows.slice(0, 40).forEach(function (e) {
            const row = el('div', 'flex items-start gap-3 px-4 py-2 border-b border-white/[0.04] text-[11px] font-mono');
            const t = new Date(e.ts);
            row.appendChild(el('span', 'text-slate-600 shrink-0', t.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' }) + ' ' + t.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })));
            row.appendChild(el('span', 'text-gold-500/80 shrink-0 w-24 truncate', e.type));
            row.appendChild(el('span', 'text-slate-400', e.message));
            wrap.appendChild(row);
        });
    }

    // ---------------- Station 12: System Health ----------------
    function healthShell() {
        const root = el('div', 'space-y-4');
        const head = sectionHead('System Health Center', 'Per-subsystem status with GREEN / YELLOW / RED');
        head.appendChild(btn('REFRESH', 'health-refresh'));
        root.appendChild(head);
        root.appendChild(el('div', 'text-[11px] font-mono text-slate-400 mb-2', '')).id = 'health-overall';
        root.appendChild(el('div', 'grid grid-cols-1 md:grid-cols-2 gap-3', '')).id = 'health-grid';
        return root;
    }
    function renderHealth(panel) {
        SYSOS.executive.systemHealth().then(function (h) {
            const overall = panel.querySelector('#health-overall');
            if (overall) {
                overall.textContent = 'OVERALL: ' + h.overall + '  ·  GREEN ' + h.counts.green + ' / YELLOW ' + h.counts.yellow + ' / RED ' + h.counts.red;
                overall.className = 'text-[11px] font-mono mb-2 ' + (TXT[h.overall] || 'text-slate-400');
            }
            const grid = panel.querySelector('#health-grid');
            if (!grid) return;
            grid.textContent = '';
            h.checks.forEach(function (c) {
                const row = card('flex items-center justify-between');
                const left = el('div', 'flex items-center gap-3');
                left.appendChild(el('span', 'w-2 h-2 rounded-full ' + (DOT[c.status] || 'bg-slate-600')));
                const txt = el('div');
                txt.appendChild(el('div', 'text-[12px] text-slate-200', c.name));
                txt.appendChild(el('div', 'text-[10px] font-mono text-slate-500', c.detail));
                left.appendChild(txt);
                row.appendChild(left);
                row.appendChild(el('span', 'text-[10px] font-mono font-bold ' + (TXT[c.status] || 'text-slate-400'), c.status));
                grid.appendChild(row);
            });
        });
    }

    // ---------------- station factory + contract ----------------
    function makeStation(id, label, shellFn, renderFn) {
        let panelRef = null;
        const station = {
            id: id,
            init() {
                SYSOS.router.register({ id: id, label: label, render: function (p) { station.mount(p); } });
                ['sysos:data', 'sysos:activity', 'sysos:commercial', 'sysos:demo', 'sysos:ops', 'sysos:compliance']
                    .forEach(function (evt) { document.addEventListener(evt, function () { station.refresh(); }); });
            },
            mount(panel) { panelRef = panel; panel.textContent = ''; panel.appendChild(shellFn()); renderFn(panel); },
            unmount() { if (panelRef) panelRef.textContent = ''; panelRef = null; },
            refresh() { if (panelRef) renderFn(panelRef); },
            validate() { return { ok: !!panelRef, station: id, mounted: !!panelRef }; },
            getPanel() { return panelRef; }
        };
        return station;
    }

    const stations = {
        dashboard: makeStation('dashboard', '09 // DASHBOARD', dashboardShell, renderDashboard),
        operator: makeStation('operator', '10 // OPERATOR', workspaceShell, renderWorkspace),
        timeline: makeStation('timeline', '11 // TIMELINE', timelineShell, renderTimeline),
        health: makeStation('syshealth', '12 // SYSTEM HEALTH', healthShell, renderHealth)
    };

    SYSOS.executiveUI = {
        stations: stations,
        init() {
            Object.keys(stations).forEach(function (k) { stations[k].init(); });
            // Delegated actions for all executive stations.
            document.addEventListener('click', function (e) {
                const b = e.target.closest('[data-exec-action]');
                if (!b) return;
                const a = b.dataset.execAction;
                if (a === 'demo-toggle') {
                    const mode = SYSOS.demo.toggle();
                    SYSOS.utils.notify('MODE: ' + mode, [mode === 'DEMO' ? 'Demonstration data loaded (live data untouched).' : 'Live data restored from storage.']);
                } else if (a.indexOf('report-') === 0) {
                    const kind = a.slice(7);
                    const out = stations.dashboard.getPanel() && stations.dashboard.getPanel().querySelector('#exec-report-out');
                    if (!out) return;
                    const r = SYSOS.executive.reports[kind]();
                    if (r && typeof r.then === 'function') r.then(function (txt) { out.textContent = txt; });
                    else out.textContent = r;
                } else if (a === 'health-refresh') {
                    renderHealth(stations.health.getPanel());
                } else if (a === 'timeline-filter') { /* handled by change below */ }
            });
            document.addEventListener('change', function (e) {
                if (e.target.id === 'timeline-filter') { timelineFilter = e.target.value; stations.timeline.refresh(); }
            });
        },
        validate() {
            const out = {};
            Object.keys(stations).forEach(function (k) { out[k] = stations[k].validate(); });
            return out;
        }
    };
})();
