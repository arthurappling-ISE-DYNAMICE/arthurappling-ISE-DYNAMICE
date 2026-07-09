/**
 * SYS_OS v2.9.8 — Administrative UI (station-contract edition)
 *
 * Operational forms for the commercial pipeline. v2.9.8 hardening:
 *  - Implements the station mounting contract (init/mount/unmount/refresh/validate).
 *  - All DOM access is scoped to the panel passed to mount() — no shared global
 *    anchor lookups (eliminates the v2.9.7 coupling).
 *  - Client stage changes route through commercial.setStage() so lifecycle
 *    history is always recorded (no direct stage writes).
 *  - Filtering is delegated to the data layer via clientStation.setListFilter().
 * All user input rendered via DOM APIs / value properties (no innerHTML).
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;
    const el = function () { return SYSOS.utils.el.apply(null, arguments); };
    function C() { return SYSOS.CONFIG.COMMERCIAL; }

    let panel = null;     // the clients station panel (scoped root)
    let mode = null;      // 'client' | 'proposal' | 'contract' | null
    let editId = null;

    function $(sel) { return panel ? panel.querySelector(sel) : null; }

    function clientOptions() {
        return SYSOS.stores.all.clients.list({ includeArchived: true })
            .map(function (c) { return { v: c.id, t: c.name }; });
    }
    function proposalOptions() {
        return [{ v: '', t: '(none)' }].concat(SYSOS.stores.all.proposals.list({ includeArchived: true })
            .map(function (p) { return { v: p.id, t: p.id + ' — ' + p.title }; }));
    }

    const FORMS = {
        client: [
            ['name', 'Name *', 'text'], ['segment', 'Segment *', 'text'],
            ['status', 'Status *', 'select', function () { return ['PROSPECT', 'ACTIVE', 'ARCHIVED'].map(function (s) { return { v: s, t: s }; }); }],
            ['tier', 'Tier', 'select', function () { return ['STANDARD', 'ELITE', 'INTERNAL'].map(function (s) { return { v: s, t: s }; }); }],
            ['stage', 'Lifecycle Stage', 'select', function () { return C().CLIENT_LIFECYCLE.map(function (s) { return { v: s, t: s }; }); }],
            ['contact', 'Contact', 'text'], ['email', 'Email', 'text'], ['value', 'Pipeline Value', 'number'],
            ['notes', 'Notes', 'textarea']
        ],
        proposal: [
            ['clientId', 'Client *', 'select', clientOptions], ['title', 'Title *', 'text'],
            ['amount', 'Amount *', 'number'],
            ['status', 'Status *', 'select', function () { return C().PROPOSAL_STATUSES.map(function (s) { return { v: s, t: s }; }); }],
            ['probability', 'Probability (0-1, blank=auto)', 'number'], ['owner', 'Owner', 'text'],
            ['expirationDate', 'Expiration Date', 'date'], ['description', 'Description', 'textarea'],
            ['notes', 'Notes', 'textarea']
        ],
        contract: [
            ['clientId', 'Client *', 'select', clientOptions], ['proposalId', 'Proposal', 'select', proposalOptions],
            ['title', 'Title *', 'text'],
            ['status', 'Status *', 'select', function () { return C().CONTRACT_STATUSES.map(function (s) { return { v: s, t: s }; }); }],
            ['value', 'Value *', 'number'], ['owner', 'Owner', 'text'],
            ['effectiveDate', 'Effective Date', 'date'], ['expirationDate', 'Expiration Date', 'date'],
            ['renewalDate', 'Renewal Date', 'date']
        ]
    };

    function field(spec, current) {
        const wrap = el('div', 'flex flex-col gap-1');
        const id = 'cf-' + spec[0];
        const lab = el('label', 'text-[9px] font-mono text-slate-500 uppercase tracking-widest', spec[1]);
        lab.setAttribute('for', id);
        wrap.appendChild(lab);
        let input;
        const base = 'bg-black border border-white/10 rounded px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold-500/40';
        if (spec[2] === 'select') {
            input = el('select', base);
            spec[3]().forEach(function (o) { const opt = el('option', null, o.t); opt.value = o.v; input.appendChild(opt); });
            if (current !== undefined && current !== null) input.value = String(current);
        } else if (spec[2] === 'textarea') {
            input = el('textarea', base); input.rows = 2; if (current) input.value = current;
        } else {
            input = el('input', base); input.type = spec[2];
            if (current !== undefined && current !== null && current !== '') input.value = current;
        }
        input.id = id; input.name = spec[0]; input.setAttribute('aria-label', spec[1]);
        wrap.appendChild(input);
        return wrap;
    }

    function renderForm() {
        const anchor = $('#commercial-admin');
        if (!anchor) return;
        anchor.textContent = '';
        if (!mode) return;
        const card = el('div', 'bg-slate-950/40 border border-gold-500/20 rounded-lg p-4 mb-4');
        card.setAttribute('role', 'region'); card.setAttribute('aria-label', mode + ' form');
        const head = el('div', 'flex items-center justify-between border-b border-white/5 pb-2 mb-3');
        head.appendChild(el('div', 'text-[10px] font-cyber font-bold text-gold-400 tracking-widest uppercase',
            (editId ? 'EDIT ' : 'NEW ') + mode.toUpperCase()));
        const close = el('button', 'text-[9px] font-mono border border-white/10 text-slate-400 px-2 py-0.5 rounded tracking-widest hover:text-slate-200', 'CLOSE');
        close.type = 'button'; close.dataset.adminAction = 'close';
        head.appendChild(close); card.appendChild(head);

        const form = el('form', 'grid grid-cols-1 md:grid-cols-2 gap-3'); form.id = 'commercial-form';
        const current = editId ? SYSOS.stores.all[mode + 's'].get(editId) : {};
        FORMS[mode].forEach(function (spec) {
            const f = field(spec, current ? current[spec[0]] : undefined);
            if (spec[2] === 'textarea') f.className += ' md:col-span-2';
            form.appendChild(f);
        });
        const feedback = el('div', 'md:col-span-2 text-[11px] font-mono text-red-400');
        feedback.id = 'commercial-feedback'; feedback.setAttribute('role', 'status'); form.appendChild(feedback);
        const actions = el('div', 'md:col-span-2 flex gap-2 justify-end');
        const submit = el('button', 'bg-transparent border border-gold-500 text-gold-400 font-mono text-xs px-5 py-2 rounded-lg uppercase font-bold tracking-wider hover:bg-gold-500 hover:text-black transition-all duration-300', 'COMMIT');
        submit.type = 'submit'; actions.appendChild(submit); form.appendChild(actions);
        card.appendChild(form); anchor.appendChild(card);
        form.addEventListener('submit', onSubmit);
        const first = form.querySelector('input,select,textarea'); if (first) first.focus();
    }

    function collect(form) {
        const data = {};
        FORMS[mode].forEach(function (spec) {
            const node = form.elements[spec[0]];
            if (!node) return;
            let v = node.value;
            if (spec[2] === 'number') v = v === '' ? (spec[0] === 'probability' ? null : 0) : Number(v);
            data[spec[0]] = v;
        });
        return data;
    }

    function onSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const feedback = $('#commercial-feedback'); feedback.textContent = '';
        const data = collect(form);
        try {
            const storeName = mode + 's';
            if (mode === 'proposal' || mode === 'contract') {
                data.links = { clients: data.clientId ? [data.clientId] : [] };
                if (mode === 'contract' && data.proposalId) data.links.proposals = [data.proposalId];
            }
            let rec;
            if (mode === 'client') {
                // Stage is NOT written directly — routed through setStage for history.
                const stage = data.stage; delete data.stage;
                rec = editId ? SYSOS.stores.all.clients.update(editId, data) : SYSOS.stores.all.clients.create(data);
                if (stage && SYSOS.commercial) SYSOS.commercial.setStage(rec.id, stage, { source: 'admin-ui' });
            } else {
                rec = editId ? SYSOS.stores.all[storeName].update(editId, data) : SYSOS.stores.all[storeName].create(data);
            }
            SYSOS.utils.notify((editId ? 'UPDATED ' : 'CREATED ') + mode.toUpperCase(), [rec.id + ' — ' + (rec.title || rec.name)]);
            mode = null; editId = null; renderForm();
        } catch (err) {
            feedback.textContent = 'VALIDATION FAILED: ' + err.message;
        }
    }

    function buildToolbar() {
        const bar = el('div', 'flex flex-col md:flex-row gap-2 mb-4'); bar.id = 'commercial-toolbar';
        const search = el('input', 'flex-1 bg-black border border-white/10 rounded-lg px-4 py-2.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold-500/40');
        search.type = 'search'; search.id = 'commercial-search'; search.placeholder = 'Search clients (name, segment, id)...';
        search.setAttribute('aria-label', 'Search clients');
        const stageSel = el('select', 'bg-black border border-white/10 rounded-lg px-3 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-gold-500/40');
        stageSel.id = 'commercial-stage-filter'; stageSel.setAttribute('aria-label', 'Filter by lifecycle stage');
        const allOpt = el('option', null, 'ALL STAGES'); allOpt.value = ''; stageSel.appendChild(allOpt);
        C().CLIENT_LIFECYCLE.forEach(function (s) { const o = el('option', null, s); o.value = s; stageSel.appendChild(o); });
        bar.appendChild(search); bar.appendChild(stageSel);
        ['client', 'proposal', 'contract'].forEach(function (mm) {
            const b = el('button', 'bg-transparent border border-gold-500/40 text-gold-400 font-mono text-xs px-4 py-2.5 rounded-lg hover:bg-gold-500 hover:text-black font-bold transition-all duration-300 tracking-widest', '+ ' + mm.toUpperCase());
            b.type = 'button'; b.dataset.adminAction = 'new-' + mm; bar.appendChild(b);
        });
        // Data-level filter delegation (no DOM show/hide).
        search.addEventListener('input', function () { SYSOS.clientStation.setListFilter({ text: search.value }); });
        stageSel.addEventListener('change', function () { SYSOS.clientStation.setListFilter({ stage: stageSel.value }); });
        return bar;
    }

    function mountToolbar() {
        const anchor = $('#commercial-admin');
        if (!anchor || $('#commercial-toolbar')) return;
        anchor.parentNode.insertBefore(buildToolbar(), anchor);
        anchor.parentNode.addEventListener('click', function (e) {
            const btn = e.target.closest('[data-admin-action]');
            if (!btn) return;
            const a = btn.dataset.adminAction;
            if (a === 'close') { mode = null; editId = null; renderForm(); }
            else if (a.indexOf('new-') === 0) { mode = a.slice(4); editId = null; renderForm(); }
        });
    }

    // ---- Station Mounting Contract ----
    SYSOS.commercialUI = {
        id: 'commercial-admin',
        init() { /* lifecycle owned by clientStation.mount; nothing global to set up */ },
        mount(stationPanel) {
            panel = stationPanel;
            mountToolbar();
            renderForm();
        },
        unmount() { panel = null; mode = null; editId = null; },
        refresh() { if (panel) { mountToolbar(); renderForm(); } },
        validate() {
            return { ok: !!panel && !!$('#commercial-admin'), station: 'commercial-admin', mounted: !!panel };
        },
        editClient(id) { mode = 'client'; editId = id; renderForm(); }
    };
})();
