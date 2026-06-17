/**
 * SYS_OS — Sovereign Registry Framework
 *
 * Converts the deck into an operational platform: six domain registries
 * (agents, workflows, SOPs, projects, intelligence, compliance) built on one
 * generic Registry class, surfaced through a dynamically registered station —
 * which itself exercises the router's station-expansion contract.
 *
 * Seed data references real GeminiEcosystem assets; registries accept live
 * registrations at runtime via SYSOS.registries.<domain>.register(entry).
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;

    function Registry(domain, label) {
        this.domain = domain;
        this.label = label;
        this.entries = new Map();
    }

    Registry.prototype.register = function (entry) {
        if (!entry || !entry.id || !entry.name) {
            throw new Error('[SYS_OS:registry] entry requires id and name');
        }
        const record = Object.assign({
            ref: '',
            status: 'REGISTERED',
            registeredAt: new Date().toISOString()
        }, entry, { domain: this.domain });
        this.entries.set(record.id, record);
        return record;
    };

    Registry.prototype.get = function (id) { return this.entries.get(id) || null; };

    Registry.prototype.list = function (filter) {
        const all = Array.from(this.entries.values());
        return typeof filter === 'function' ? all.filter(filter) : all;
    };

    Registry.prototype.setStatus = function (id, status) {
        const record = this.entries.get(id);
        if (record) record.status = status;
        return record || null;
    };

    Registry.prototype.stats = function () {
        const byStatus = {};
        this.entries.forEach(function (e) {
            byStatus[e.status] = (byStatus[e.status] || 0) + 1;
        });
        return { domain: this.domain, total: this.entries.size, byStatus: byStatus };
    };

    SYSOS.Registry = Registry;

    // ---------- domain registries + seed data ----------

    const registries = {
        agents: new Registry('agents', 'Agent Registry'),
        workflows: new Registry('workflows', 'Workflow Registry'),
        sops: new Registry('sops', 'SOP Registry'),
        projects: new Registry('projects', 'Project Registry'),
        intelligence: new Registry('intelligence', 'Intelligence Registry'),
        compliance: new Registry('compliance', 'Compliance Registry')
    };

    function seed() {
        registries.agents.register({ id: 'research_agent', name: 'Research Agent', ref: 'agents/research_agent.md', status: 'ACTIVE' });
        registries.agents.register({ id: 'bid_architect', name: 'Bid Architect', ref: 'agents/bid_architect.md', status: 'ACTIVE' });
        registries.agents.register({ id: 'ceo_core', name: 'CEO Strategic Core', ref: 'SYS_OS terminal protocol (config.js)', status: 'OPERATIONAL' });
        registries.agents.register({ id: 'coo_core', name: 'COO Operational Core', ref: 'SYS_OS terminal protocol (config.js)', status: 'OPERATIONAL' });

        registries.workflows.register({ id: 'contract_intelligence_v4', name: 'Contract Intelligence Engine v4', ref: 'workflows/contract_intelligence_v4.md', status: 'ACTIVE' });
        registries.workflows.register({ id: 'master_handoff_protocol', name: 'Master Handoff Protocol', ref: 'workflows/master_handoff_protocol.md', status: 'ACTIVE' });
        registries.workflows.register({ id: 'sovereign_audit', name: 'Nightly Sovereign Audit', ref: '.github/workflows/sovereign_audit.yml', status: 'SCHEDULED' });

        registries.sops.register({ id: 'strategic_intel_framework', name: 'Strategic Intelligence Framework', ref: 'workflows/ (commit 45bc7b93)', status: 'ACTIVE' });
        registries.sops.register({ id: 'sovereign_install_wat', name: 'Sovereign System Installation (WAT)', ref: 'commit 3bb87b20', status: 'ACTIVE' });
        registries.sops.register({ id: 'turnover_standard', name: 'Turnover Standard SOP', ref: '/workflows/turnover_standard_SOP.md', status: 'ACTIVE' });

        registries.projects.register({ id: 'command_deck', name: 'SYS_OS Command Deck', ref: 'tools/command_deck/', status: 'OPERATIONAL' });
        registries.projects.register({ id: 'turnover_system', name: 'Prime Pathwy Turnover System', ref: 'Prime_Pathwy_Turnover_System/', status: 'DEPLOY_READY' });
        registries.projects.register({ id: 'health_console', name: 'ISE Health Console v3.0', ref: 'ISE_Health_Console/', status: 'OPERATIONAL' });
        registries.projects.register({ id: 'hyperframes', name: 'Hyperframes Video Engine', ref: 'tools/hyperframes/', status: 'OPERATIONAL' });
        registries.projects.register({ id: 'betting_board', name: 'Betting Analytics Board', ref: 'tools/betting_engine/ · PORT :3132', status: 'OPERATIONAL' });
        registries.projects.register({ id: 'consulting_wing', name: 'Consulting Wing — Sovereign Promo', ref: 'tools/consulting_wing/', status: 'ACTIVE' });

        registries.intelligence.register({ id: 'dscr_anchor', name: 'DSCR Leverage Anchor 7.42×', ref: 'Primary loan qualification anchor', status: 'VERIFIED' });
        registries.intelligence.register({ id: 'hvip_voucher', name: 'HVIP Class 4–5 Voucher $130K', ref: 'Carl Moyer 415.749.4994', status: 'MONITORING' });
        registries.intelligence.register({ id: 'rpdc_anchor', name: 'USPS RPDC Geographic Anchor', ref: '2501 Rydin Rd, Richmond CA 94850 · 27mi', status: 'MONITORING' });

        registries.compliance.register({ id: 'uei_registration', name: 'UEI Registration (supersedes DUNS for fleet)', ref: 'SAM.gov', status: 'REQUIRED' });
        registries.compliance.register({ id: 'sbdc_pitch', name: 'SBDC Pitch — 2026-04-24', ref: 'Small Business Development Center', status: 'COMPLETED' });
        registries.compliance.register({ id: 'data_vault_hygiene', name: 'SQLite vault excluded from source control', ref: 'commit 54f7c257 (.gitignore data/)', status: 'ENFORCED' });
    }

    // ---------- Registry Grid station ----------

    const STATUS_STYLES = {
        emerald: 'bg-emerald-950/30 text-emerald-400 border-emerald-500/20',
        gold: 'bg-gold-950/40 text-gold-400 border-gold-500/30',
        slate: 'bg-slate-950/60 text-slate-400 border-slate-500/20'
    };

    function statusTone(status) {
        if (/^(ACTIVE|OPERATIONAL|VERIFIED|ENFORCED)$/.test(status)) return 'emerald';
        if (/^(COMPLETED|ARCHIVED|PLANNED)$/.test(status)) return 'slate';
        return 'gold'; // MONITORING, REQUIRED, PENDING, SCHEDULED, DEPLOY_READY, REGISTERED
    }

    let selectedDomain = 'agents';

    function stationHTML() {
        return '' +
        '<div class="bg-black/40 border border-gold-500/10 rounded-xl p-6 backdrop-blur-md">' +
            '<div class="flex items-center justify-between border-b border-gold-500/10 pb-4 mb-6">' +
                '<div>' +
                    '<h2 class="text-xs font-cyber font-semibold tracking-widest text-gold-400">Sovereign Registry Grid</h2>' +
                    '<p class="text-[11px] text-slate-500 font-mono mt-1">Operational registries: agents · workflows · SOPs · projects · intelligence · compliance</p>' +
                '</div>' +
                '<span id="registry-total-badge" class="text-[9px] font-mono text-gold-400 border border-gold-500/20 px-2 py-1 rounded bg-gold-500/5"></span>' +
            '</div>' +
            '<div id="registry-cards" class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6"></div>' +
            '<div class="overflow-x-auto rounded-lg border border-white/5 bg-black/40">' +
                '<table class="w-full text-left font-mono text-xs">' +
                    '<thead class="bg-slate-950 text-slate-500 uppercase text-[9px] tracking-widest border-b border-white/5">' +
                        '<tr><th class="p-4">Registry ID</th><th class="p-4">Designation</th><th class="p-4">Reference</th><th class="p-4">Status</th></tr>' +
                    '</thead>' +
                    '<tbody id="registry-entry-table" class="divide-y divide-white/[0.03] text-slate-300"></tbody>' +
                '</table>' +
            '</div>' +
        '</div>';
    }

    function renderCards() {
        const el = SYSOS.utils.el;
        const wrap = document.getElementById('registry-cards');
        wrap.textContent = '';
        Object.keys(registries).forEach(function (domain) {
            const reg = registries[domain];
            const active = domain === selectedDomain;
            const card = el('button',
                'text-left bg-slate-950/60 border rounded-lg p-4 transition-all duration-300 ' +
                (active ? 'border-gold-500/40' : 'border-white/5 hover:border-gold-500/20'));
            card.type = 'button';
            card.dataset.registry = domain;
            card.appendChild(el('div',
                'text-[9px] font-mono tracking-widest uppercase ' + (active ? 'text-gold-400' : 'text-slate-500'),
                reg.label));
            card.appendChild(el('div',
                'text-2xl font-mono font-bold mt-1 ' + (active ? 'text-gold-400' : 'text-slate-200'),
                String(reg.entries.size)));
            card.appendChild(el('div', 'text-[9px] font-mono text-slate-600 mt-1 tracking-wider',
                Object.entries(reg.stats().byStatus)
                    .map(function (p) { return p[1] + ' ' + p[0]; }).join(' · ')));
            wrap.appendChild(card);
        });

        const total = Object.values(registries)
            .reduce(function (n, r) { return n + r.entries.size; }, 0);
        document.getElementById('registry-total-badge').textContent =
            total + ' ENTRIES // 6 DOMAINS';
    }

    function renderTable() {
        const el = SYSOS.utils.el;
        const body = document.getElementById('registry-entry-table');
        body.textContent = '';
        registries[selectedDomain].list().forEach(function (entry) {
            const tr = el('tr', 'hover:bg-white/[0.02] transition-colors');
            tr.appendChild(el('td', 'p-4 font-bold text-slate-400', entry.id));
            tr.appendChild(el('td', 'p-4 text-slate-300', entry.name));
            tr.appendChild(el('td', 'p-4 text-slate-500', entry.ref));
            const td = el('td', 'p-4');
            td.appendChild(el('span',
                'px-2 py-0.5 rounded text-[10px] font-bold border tracking-wider ' +
                STATUS_STYLES[statusTone(entry.status)], entry.status));
            tr.appendChild(td);
            body.appendChild(tr);
        });
    }

    SYSOS.registries = registries;

    SYSOS.registriesInit = function () {
        seed();
        const panel = SYSOS.router.register({
            id: 'registries',
            label: '06 // REGISTRY GRID',
            render: function (panelEl) { panelEl.innerHTML = stationHTML(); } // trusted static template
        });
        panel.addEventListener('click', function (e) {
            const card = e.target.closest('[data-registry]');
            if (card) {
                selectedDomain = card.dataset.registry;
                renderCards();
                renderTable();
            }
        });
        renderCards();
        renderTable();
    };
})();
