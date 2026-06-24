/**
 * SYS_OS v2.8 — Executive Command Center
 *
 * Every value rendered here is COMPUTED from live platform state
 * (registries, vault, audit chain, activity ledger) at render time.
 * Nothing in this module is scripted copy. Re-renders on every
 * 'sysos:data', 'sysos:activity', and 'sysos:vault:ingested' event.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;
    const el = function () { return SYSOS.utils.el.apply(null, arguments); };

    function computeMetrics() {
        const s = SYSOS.stores.all;
        const projects = s.projects.list({ includeArchived: true });
        return [
            { label: 'Total Projects', value: projects.length },
            { label: 'Active Projects', value: projects.filter(function (p) { return p.status === 'ACTIVE'; }).length, tone: 'emerald' },
            { label: 'Archived Projects', value: projects.filter(function (p) { return p.archived; }).length, tone: 'slate' },
            { label: 'Registered Agents', value: s.agents.entries.size },
            { label: 'Active Workflows', value: s.workflows.list({ status: 'ACTIVE' }).length, tone: 'emerald' },
            { label: 'Vault Documents', value: SYSOS.vault.documents.size },
            { label: 'Compliance Records', value: s.compliance.entries.size, tone: 'gold' },
            { label: 'Audit Chain Entries', value: SYSOS.vault.auditChain.length, tone: 'gold' }
        ];
    }

    const TONE = {
        emerald: 'text-emerald-400',
        gold: 'text-gold-400',
        slate: 'text-slate-400',
        default: 'text-slate-200'
    };

    function renderMetrics() {
        const wrap = document.getElementById('exec-metrics');
        if (!wrap) return;
        wrap.textContent = '';
        computeMetrics().forEach(function (m) {
            const card = el('div', 'bg-slate-950/60 border border-white/5 rounded-lg p-3 text-center');
            card.appendChild(el('div', 'text-[9px] font-mono text-slate-500 tracking-widest uppercase', m.label));
            card.appendChild(el('div', 'text-2xl font-mono font-bold mt-1 ' + (TONE[m.tone] || TONE.default), String(m.value)));
            wrap.appendChild(card);
        });
    }

    function renderActivity() {
        const list = document.getElementById('exec-activity');
        if (!list) return;
        list.textContent = '';
        const recent = SYSOS.activity.recent(8);
        if (!recent.length) {
            list.appendChild(el('li', 'text-[11px] font-mono text-slate-600', 'No activity recorded yet.'));
            return;
        }
        recent.forEach(function (entry) {
            const li = el('li', 'flex items-start gap-2 text-[11px] font-mono leading-relaxed');
            const t = new Date(entry.ts);
            li.appendChild(el('span', 'text-slate-600 shrink-0',
                t.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' }) + ' ' +
                t.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })));
            li.appendChild(el('span', 'text-gold-500/80 shrink-0 tracking-wider', '[' + entry.type + ']'));
            li.appendChild(el('span', 'text-slate-400', entry.message));
            list.appendChild(li);
        });
    }

    function refresh() {
        renderMetrics();
        renderActivity();
    }

    SYSOS.exec = {
        init() {
            refresh();
            document.addEventListener('sysos:data', refresh);
            document.addEventListener('sysos:activity', refresh);
            document.addEventListener('sysos:vault:ingested', refresh);
        },
        refresh: refresh,
        snapshot: computeMetrics
    };
})();
