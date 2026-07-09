/**
 * SYS_OS v2.8 — Sovereign Registries (OPERATIONAL_TRUTH)
 *
 * Six persistent DataStore-backed registries seeded with REAL Prime Pathwy
 * records, plus the Registry Grid station: search, status filtering, a
 * relationship-resolving detail panel for every domain, and full CRUD
 * (create / edit / archive / delete) for the Project Registry.
 *
 * All user-typed values render via textContent. innerHTML receives only the
 * static station template.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;
    const el = function () { return SYSOS.utils.el.apply(null, arguments); };

    // ------------------------------------------------------------- domains

    function defineStores() {
        SYSOS.stores.define('projects', {
            label: 'Project Registry', idPrefix: 'PRJ',
            required: ['name', 'category', 'status', 'priority', 'owner'],
            defaults: { description: '', notes: '', owner: 'A. F. Appling Sr.' }
        });
        SYSOS.stores.define('agents', {
            label: 'Agent Registry', idPrefix: 'AGT',
            required: ['name', 'role', 'status'],
            defaults: { responsibilities: '', ref: '' }
        });
        SYSOS.stores.define('workflows', {
            label: 'Workflow Registry', idPrefix: 'WFL',
            required: ['name', 'type', 'status', 'trigger'],
            defaults: { steps: [], outputs: [] }
        });
        SYSOS.stores.define('sops', {
            label: 'SOP Registry', idPrefix: 'SOP',
            required: ['name', 'status'], defaults: { ref: '' }
        });
        SYSOS.stores.define('intelligence', {
            label: 'Intelligence Registry', idPrefix: 'INT',
            required: ['name', 'status'], defaults: { ref: '' }
        });
        SYSOS.stores.define('compliance', {
            label: 'Compliance Registry', idPrefix: 'CMP',
            required: ['name', 'status'], defaults: { ref: '' }
        });
        // v2.9.5 Client Registry — the commercial multi-tenant layer.
        SYSOS.stores.define('clients', {
            label: 'Client Registry', idPrefix: 'CLT',
            required: ['name', 'segment', 'status'],
            defaults: { contact: '', email: '', value: 0, notes: '', tier: 'STANDARD' }
        });
    }

    // ---------------------------------------------------------- seed data
    // Real Prime Pathwy operational records — not placeholders.

    function seed() {
        const s = SYSOS.stores.all;
        const quiet = { silent: true };

        // PROJECTS
        s.projects.create({ id: 'prime_pathwy_os', name: 'Prime Pathwy OS', category: 'Platform Infrastructure', status: 'ACTIVE', priority: 'P1',
            description: 'Sovereign command deck and operational platform (this system). Zero-build, CSP-fenced, hash-chained vault.',
            notes: 'v2.8 OPERATIONAL_TRUTH. Roadmap: docs/FUTURE_ROADMAP.md.',
            links: { workflows: ['create_project', 'document_intake', 'project_audit'], agents: ['architect_agent', 'vault_agent'], documents: ['DOC-2026-0412B'] } }, quiet);
        s.projects.create({ id: 'shopify_platform', name: 'Shopify Platform', category: 'E-Commerce', status: 'PLANNING', priority: 'P2',
            description: 'Shopify storefront build-out for Prime Pathwy product and service lines.',
            notes: 'Pending catalog definition and payment rails decision.' }, quiet);
        s.projects.create({ id: 'cert_of_rehabilitation', name: 'Certificate of Rehabilitation', category: 'Legal', status: 'ACTIVE', priority: 'P1',
            description: 'California Certificate of Rehabilitation petition — evidence assembly, filing preparation, and hearing readiness.',
            notes: 'Compliance Agent owns the evidence checklist; vault is the evidence store.',
            links: { workflows: ['compliance_review'], agents: ['compliance_agent'] } }, quiet);
        s.projects.create({ id: 'compliance_library', name: 'Compliance Library', category: 'Governance', status: 'ACTIVE', priority: 'P2',
            description: 'Central library of permits, filings, registrations, and recurring obligations for AA Capital INC dba Prime Pathwy.',
            notes: 'EIN 84-4788578 · DUNS 12-3035654 · UEI registration REQUIRED (tracked in compliance registry).',
            links: { workflows: ['compliance_review', 'create_sop'], agents: ['compliance_agent'] } }, quiet);
        s.projects.create({ id: 'ai_consulting_framework', name: 'AI Consulting Framework', category: 'Consulting', status: 'ACTIVE', priority: 'P1',
            description: 'High-ticket AI consulting delivery framework — Elite 10 Sovereign Deck, NEPQ communication protocol, $5,000+ pipeline.',
            links: { workflows: ['proposal_generation'], agents: ['ceo_agent', 'research_agent'], documents: ['DOC-2026-0518C'] } }, quiet);
        s.projects.create({ id: 'turnover_system', name: 'Prime Pathwy Turnover System', category: 'Field Operations', status: 'DEPLOY_READY', priority: 'P1',
            description: 'Property turnover system — SMTP wired, identity seal sealed; standalone SOP isolation per governance directive P2.',
            notes: 'Repo: Prime_Pathwy_Turnover_System/.',
            links: { workflows: ['create_sop'], agents: ['coo_agent', 'operations_agent'], documents: ['DOC-2026-0601A'] } }, quiet);
        s.projects.create({ id: 'fleet_capital_zev', name: 'Fleet Capital — ZEV Package', category: 'Capital Programs', status: 'ACTIVE', priority: 'P1',
            description: 'HVIP Class 4–5 voucher ($130,000) acquisition. Carl Moyer program contact 415.749.4994. UEI required (not DUNS).',
            notes: 'DSCR anchor 7.42×. Call script: fleet_capital_ZEV.md.',
            links: { agents: ['ceo_agent', 'research_agent'] } }, quiet);
        s.projects.create({ id: 'health_console', name: 'ISE Health Console', category: 'Personal Systems', status: 'OPERATIONAL', priority: 'P3',
            description: 'JARVIS_ENGINE_V3 health console — weight engine active, v3.0 operational.',
            notes: 'Repo: ISE_Health_Console/.' }, quiet);

        // AGENTS — the multi-agent coordination control layer
        s.agents.create({ id: 'architect_agent', name: 'Architect Agent', role: 'Lead Systems Architect', status: 'ACTIVE',
            responsibilities: 'System design, integrity audits, version control, deployment sealing, ground-truth verification.',
            ref: 'SYS_OS platform (this build)',
            links: { workflows: ['project_audit', 'create_project'], projects: ['prime_pathwy_os'] } }, quiet);
        s.agents.create({ id: 'ceo_agent', name: 'CEO Agent', role: 'Strategic Intelligence Officer', status: 'ACTIVE',
            responsibilities: 'NEPQ pipeline operation, capital stack strategy, proposal direction, high-ticket positioning.',
            ref: 'SYS_OS terminal protocol (config.js)',
            links: { workflows: ['proposal_generation'], projects: ['ai_consulting_framework', 'fleet_capital_zev'], documents: ['DOC-2026-0518C'] } }, quiet);
        s.agents.create({ id: 'coo_agent', name: 'COO Agent', role: 'Operational Optimization Officer', status: 'ACTIVE',
            responsibilities: 'Turnover pipeline execution, supply-chain nodes, ground-truth environment verification.',
            ref: 'SYS_OS terminal protocol (config.js)',
            links: { workflows: ['project_audit'], projects: ['turnover_system'], documents: ['DOC-2026-0601A'] } }, quiet);
        s.agents.create({ id: 'research_agent', name: 'Research Agent', role: 'Research & Intelligence', status: 'ACTIVE',
            responsibilities: 'Market scans, grant/voucher program monitoring, opportunity intelligence briefs.',
            ref: 'agents/research_agent.md',
            links: { workflows: ['document_intake'], projects: ['ai_consulting_framework', 'fleet_capital_zev'] } }, quiet);
        s.agents.create({ id: 'compliance_agent', name: 'Compliance Agent', role: 'Compliance Officer', status: 'PROVISIONED',
            responsibilities: 'Filings, permits, certificate tracking, obligation calendars, evidence checklists.',
            ref: 'Control layer reserved — activates with compliance_review automation',
            links: { workflows: ['compliance_review'], projects: ['compliance_library', 'cert_of_rehabilitation'] } }, quiet);
        s.agents.create({ id: 'vault_agent', name: 'Vault Agent', role: 'Knowledge Custodian', status: 'ACTIVE',
            responsibilities: 'Ingestion pipeline operation, audit-chain integrity, evidence sealing, OCR queue stewardship.',
            ref: 'assets/js/vault.js engine',
            links: { workflows: ['document_intake'], projects: ['prime_pathwy_os'] } }, quiet);
        s.agents.create({ id: 'operations_agent', name: 'Operations Agent', role: 'Operations Runner', status: 'PROVISIONED',
            responsibilities: 'Task execution, SOP application, field logistics, turnover crew coordination.',
            ref: 'Control layer reserved — activates with task queue (v2.9)',
            links: { workflows: ['create_project', 'create_sop'], projects: ['turnover_system'] } }, quiet);

        // WORKFLOWS
        s.workflows.create({ id: 'create_project', name: 'Create Project', type: 'PLATFORM', status: 'ACTIVE',
            trigger: 'Operator: Registry Grid > + NEW_PROJECT',
            steps: ['Validate schema (name/category/status/priority/owner)', 'Assign PRJ id + timestamps', 'Normalize relationship links', 'Seal activity-ledger entry'],
            outputs: ['Project record (persistent)', 'Activity entry'],
            links: { agents: ['architect_agent', 'operations_agent'], projects: ['prime_pathwy_os'] } }, quiet);
        s.workflows.create({ id: 'create_sop', name: 'Create SOP', type: 'DOCUMENTATION', status: 'ACTIVE',
            trigger: 'New repeatable process identified',
            steps: ['Draft procedure', 'Architect review', 'Vault ingestion (document_intake)', 'Register in SOP registry'],
            outputs: ['SOP document', 'Vault chain entry', 'SOP registry record'],
            links: { agents: ['operations_agent'], projects: ['compliance_library', 'turnover_system'] } }, quiet);
        s.workflows.create({ id: 'compliance_review', name: 'Compliance Review', type: 'GOVERNANCE', status: 'ACTIVE',
            trigger: 'New compliance document, or quarterly cycle',
            steps: ['Classify obligation', 'Verify against compliance registry', 'Flag gaps and deadlines', 'Seal review evidence into vault chain'],
            outputs: ['Review record', 'Evidence chain entry'],
            links: { agents: ['compliance_agent'], projects: ['compliance_library', 'cert_of_rehabilitation'] } }, quiet);
        s.workflows.create({ id: 'document_intake', name: 'Document Intake', type: 'VAULT', status: 'ACTIVE',
            trigger: 'Vault: + INGEST_SPEC_DOCUMENT (or future file drop)',
            steps: ['INTAKE', 'CLASSIFY', 'HASH', 'INDEX', 'SEAL'],
            outputs: ['Indexed document', 'Audit chain entry'],
            links: { agents: ['vault_agent'], projects: ['prime_pathwy_os'] } }, quiet);
        s.workflows.create({ id: 'proposal_generation', name: 'Proposal Generation', type: 'REVENUE', status: 'ACTIVE',
            trigger: 'Qualified NEPQ lead',
            steps: ['Discovery transcript intake', 'Pain-point mapping (NEPQ)', 'Sovereign deck assembly', 'Pricing + DSCR framing', 'Delivery and follow-up sequence'],
            outputs: ['Proposal package', 'Pipeline entry'],
            links: { agents: ['ceo_agent', 'research_agent'], projects: ['ai_consulting_framework'] } }, quiet);
        s.workflows.create({ id: 'project_audit', name: 'Project Audit', type: 'GOVERNANCE', status: 'ACTIVE',
            trigger: 'Architect Core: INITIALIZE INTEGRITY AUDIT',
            steps: ['Snapshot registry totals', 'Verify vault audit chain', 'Scan relationship integrity', 'Report measured state via HUD'],
            outputs: ['Audit report toast', 'Activity entry'],
            links: { agents: ['architect_agent', 'coo_agent'], projects: ['prime_pathwy_os'] } }, quiet);

        // SOPs
        s.sops.create({ id: 'strategic_intel_framework', name: 'Strategic Intelligence Framework', status: 'ACTIVE', ref: 'workflows/ (commit 45bc7b93)' }, quiet);
        s.sops.create({ id: 'sovereign_install_wat', name: 'Sovereign System Installation (WAT)', status: 'ACTIVE', ref: 'commit 3bb87b20' }, quiet);
        s.sops.create({ id: 'turnover_standard', name: 'Turnover Standard SOP', status: 'ACTIVE', ref: '/workflows/turnover_standard_SOP.md',
            links: { projects: ['turnover_system'], documents: ['DOC-2026-0601A'] } }, quiet);
        s.sops.create({ id: 'master_handoff_protocol', name: 'Master Handoff Protocol', status: 'ACTIVE', ref: 'workflows/master_handoff_protocol.md' }, quiet);

        // INTELLIGENCE
        s.intelligence.create({ id: 'dscr_anchor', name: 'DSCR Leverage Anchor 7.42×', status: 'VERIFIED', ref: 'Primary loan qualification anchor',
            links: { projects: ['fleet_capital_zev'] } }, quiet);
        s.intelligence.create({ id: 'hvip_voucher', name: 'HVIP Class 4–5 Voucher $130K', status: 'MONITORING', ref: 'Carl Moyer 415.749.4994',
            links: { projects: ['fleet_capital_zev'] } }, quiet);
        s.intelligence.create({ id: 'rpdc_anchor', name: 'USPS RPDC Geographic Anchor', status: 'MONITORING', ref: '2501 Rydin Rd, Richmond CA 94850 · 27mi from Vallejo',
            links: { projects: ['turnover_system'] } }, quiet);

        // COMPLIANCE
        s.compliance.create({ id: 'uei_registration', name: 'UEI Registration (supersedes DUNS for fleet programs)', status: 'REQUIRED', ref: 'SAM.gov',
            links: { projects: ['fleet_capital_zev', 'compliance_library'] } }, quiet);
        s.compliance.create({ id: 'sbdc_pitch', name: 'SBDC Pitch — 2026-04-24', status: 'COMPLETED', ref: 'Small Business Development Center' }, quiet);
        s.compliance.create({ id: 'data_vault_hygiene', name: 'SQLite vault excluded from source control', status: 'ENFORCED', ref: 'commit 54f7c257 (.gitignore data/)',
            links: { projects: ['prime_pathwy_os'] } }, quiet);
        s.compliance.create({ id: 'cert_rehab_petition', name: 'Certificate of Rehabilitation petition readiness', status: 'IN_PROGRESS', ref: 'CA Penal Code §4852.01 track',
            links: { projects: ['cert_of_rehabilitation'] } }, quiet);

        // CLIENTS (v2.9.5). House account is real; SAMPLE records are clearly
        // labeled scaffolding for the commercial pipeline — not signed clients.
        // Forward links here make each client resolve its projects + documents,
        // and make the client appear in backlinks() of those entities.
        s.clients.create({ id: 'house_account', name: 'AA Capital INC dba Prime Pathwy', segment: 'HOUSE', tier: 'INTERNAL',
            status: 'ACTIVE', contact: 'A. F. Appling Sr.', email: 'arthurappling@gmail.com', value: 0,
            notes: 'Internal house account — EIN 84-4788578. Owns the sovereign platform and field systems.',
            links: { projects: ['prime_pathwy_os', 'turnover_system', 'fleet_capital_zev', 'health_console'],
                documents: ['DOC-2026-0412B'] } }, quiet);
        s.clients.create({ id: 'sample_consulting_a', name: 'SAMPLE — Consulting Client A', segment: 'CONSULTING', tier: 'ELITE',
            status: 'PROSPECT', contact: 'TBD', email: '', value: 5000,
            notes: 'Scaffolding record for the AI consulting pipeline ($5K+ Elite 10 deck). Replace on first signed engagement.',
            links: { projects: ['ai_consulting_framework'], documents: ['DOC-2026-0518C'] } }, quiet);
        s.clients.create({ id: 'sample_ecom_b', name: 'SAMPLE — E-Commerce Client B', segment: 'E-COMMERCE', tier: 'STANDARD',
            status: 'PROSPECT', contact: 'TBD', email: '', value: 2500,
            notes: 'Scaffolding record tied to the Shopify platform build. Replace on first signed engagement.',
            links: { projects: ['shopify_platform'] } }, quiet);

        SYSOS.stores.persist();
    }

    // -------------------------------------------------------------- UI

    const STATUS_STYLES = {
        emerald: 'bg-emerald-950/30 text-emerald-400 border-emerald-500/20',
        gold: 'bg-gold-950/40 text-gold-400 border-gold-500/30',
        slate: 'bg-slate-950/60 text-slate-400 border-slate-500/20'
    };

    function statusTone(status) {
        if (/^(ACTIVE|OPERATIONAL|VERIFIED|ENFORCED)$/.test(status)) return 'emerald';
        if (/^(COMPLETED|ARCHIVED|PLANNED)$/.test(status)) return 'slate';
        return 'gold';
    }

    function badge(status) {
        return el('span', 'px-2 py-0.5 rounded text-[10px] font-bold border tracking-wider ' +
            STATUS_STYLES[statusTone(status)], status);
    }

    const REF_FIELD = {
        projects: function (e) { return e.category + ' · ' + e.priority; },
        agents: function (e) { return e.role; },
        workflows: function (e) { return e.type + ' · trigger: ' + e.trigger; },
        sops: function (e) { return e.ref; },
        intelligence: function (e) { return e.ref; },
        compliance: function (e) { return e.ref; },
        clients: function (e) { return e.segment + ' · ' + (e.contact || 'no contact'); }  // v2.9.5
    };

    let selectedDomain = 'projects';
    let panelRef = null;

    const PROJECT_STATUSES = ['ACTIVE', 'PLANNING', 'OPERATIONAL', 'DEPLOY_READY', 'ON_HOLD'];

    function stationHTML() {
        return '' +
        '<div class="bg-black/40 border border-gold-500/10 rounded-xl p-6 backdrop-blur-md">' +
            '<div class="flex items-center justify-between border-b border-gold-500/10 pb-4 mb-6">' +
                '<div>' +
                    '<h2 class="text-xs font-cyber font-semibold tracking-widest text-gold-400">Sovereign Registry Grid</h2>' +
                    '<p class="text-[11px] text-slate-500 font-mono mt-1">Operational system of record — projects · agents · workflows · SOPs · intelligence · compliance</p>' +
                '</div>' +
                '<span id="registry-total-badge" class="text-[9px] font-mono text-gold-400 border border-gold-500/20 px-2 py-1 rounded bg-gold-500/5"></span>' +
            '</div>' +
            '<div id="registry-cards" class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6"></div>' +
            '<div class="flex flex-col md:flex-row gap-2 mb-4">' +
                '<input type="search" id="registry-search" aria-label="Search the selected registry" placeholder="Query registry (id, name, notes, links)..." autocomplete="off" class="flex-1 bg-black border border-white/10 rounded-lg px-4 py-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold-500/40">' +
                '<select id="registry-status-filter" aria-label="Filter by status" class="bg-black border border-white/10 rounded-lg px-3 py-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-gold-500/40">' +
                    '<option value="">ALL STATUSES</option>' +
                '</select>' +
                '<button type="button" data-reg-action="new" id="registry-new-btn" class="bg-transparent border border-gold-500/40 text-gold-400 font-mono text-xs px-5 py-3 rounded-lg hover:bg-gold-500 hover:text-black font-bold transition-all duration-300 tracking-widest">+ NEW_PROJECT</button>' +
            '</div>' +
            '<form id="registry-form" class="hidden mb-4 bg-slate-950/40 border border-gold-500/20 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3" autocomplete="off">' +
                '<input name="name" required aria-label="Project name" placeholder="Project name *" class="bg-black border border-white/10 rounded px-3 py-2.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold-500/40">' +
                '<input name="category" required aria-label="Category" placeholder="Category *" class="bg-black border border-white/10 rounded px-3 py-2.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold-500/40">' +
                '<select name="status" aria-label="Status" class="bg-black border border-white/10 rounded px-3 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-gold-500/40">' +
                    PROJECT_STATUSES.map(function (st) { return '<option>' + st + '</option>'; }).join('') +
                '</select>' +
                '<div class="flex gap-2">' +
                    '<select name="priority" aria-label="Priority" class="flex-1 bg-black border border-white/10 rounded px-3 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-gold-500/40">' +
                        '<option>P1</option><option>P2</option><option>P3</option>' +
                    '</select>' +
                    '<input name="owner" required aria-label="Owner" value="A. F. Appling Sr." class="flex-1 bg-black border border-white/10 rounded px-3 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-gold-500/40">' +
                '</div>' +
                '<textarea name="description" rows="2" aria-label="Description" placeholder="Description" class="md:col-span-2 bg-black border border-white/10 rounded px-3 py-2.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold-500/40"></textarea>' +
                '<textarea name="notes" rows="2" aria-label="Notes" placeholder="Notes" class="md:col-span-2 bg-black border border-white/10 rounded px-3 py-2.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold-500/40"></textarea>' +
                '<div class="md:col-span-2 flex gap-2 justify-end">' +
                    '<button type="button" data-reg-action="cancel-form" class="bg-transparent border border-white/10 text-slate-400 font-mono text-xs px-5 py-2 rounded-lg hover:text-slate-200 transition-all duration-300 tracking-widest">CANCEL</button>' +
                    '<button type="submit" class="bg-transparent border border-gold-500 text-gold-400 font-mono text-xs px-5 py-2 rounded-lg uppercase font-bold tracking-wider hover:bg-gold-500 hover:text-black transition-all duration-300">COMMIT RECORD</button>' +
                '</div>' +
            '</form>' +
            '<div id="registry-detail" class="hidden mb-4 bg-slate-950/40 border border-white/10 rounded-lg p-4"></div>' +
            '<div class="overflow-x-auto rounded-lg border border-white/5 bg-black/40">' +
                '<table class="w-full text-left font-mono text-xs">' +
                    '<thead class="bg-slate-950 text-slate-500 uppercase text-[9px] tracking-widest border-b border-white/5">' +
                        '<tr><th class="p-4">Registry ID</th><th class="p-4">Designation</th><th class="p-4">Reference</th><th class="p-4">Status</th><th class="p-4">Actions</th></tr>' +
                    '</thead>' +
                    '<tbody id="registry-entry-table" class="divide-y divide-white/[0.03] text-slate-300"></tbody>' +
                '</table>' +
            '</div>' +
        '</div>';
    }

    function currentFilter() {
        return {
            query: (document.getElementById('registry-search') || {}).value || '',
            status: (document.getElementById('registry-status-filter') || {}).value || '',
            includeArchived: true
        };
    }

    function renderCards() {
        const wrap = document.getElementById('registry-cards');
        if (!wrap) return;
        wrap.textContent = '';
        Object.keys(SYSOS.stores.all).forEach(function (domain) {
            const store = SYSOS.stores.all[domain];
            const active = domain === selectedDomain;
            const card = el('button',
                'text-left bg-slate-950/60 border rounded-lg p-4 transition-all duration-300 ' +
                (active ? 'border-gold-500/40' : 'border-white/5 hover:border-gold-500/20'));
            card.type = 'button';
            card.dataset.registry = domain;
            card.appendChild(el('div',
                'text-[9px] font-mono tracking-widest uppercase ' + (active ? 'text-gold-400' : 'text-slate-500'),
                store.label));
            card.appendChild(el('div',
                'text-2xl font-mono font-bold mt-1 ' + (active ? 'text-gold-400' : 'text-slate-200'),
                String(store.entries.size)));
            card.appendChild(el('div', 'text-[9px] font-mono text-slate-600 mt-1 tracking-wider',
                Object.entries(store.stats().byStatus)
                    .map(function (p) { return p[1] + ' ' + p[0]; }).join(' · ')));
            wrap.appendChild(card);
        });
        const totals = SYSOS.stores.totals();
        const total = Object.values(totals).reduce(function (a, b) { return a + b; }, 0);
        document.getElementById('registry-total-badge').textContent = total + ' RECORDS // 6 DOMAINS';
    }

    function renderToolbar() {
        const newBtn = document.getElementById('registry-new-btn');
        if (newBtn) newBtn.classList.toggle('hidden', selectedDomain !== 'projects');
        const sel = document.getElementById('registry-status-filter');
        if (sel) {
            const current = sel.value;
            sel.textContent = '';
            sel.appendChild(el('option', null, 'ALL STATUSES')).value = '';
            SYSOS.stores.all[selectedDomain].statuses().forEach(function (st) {
                const opt = el('option', null, st);
                opt.value = st;
                sel.appendChild(opt);
            });
            sel.value = current && SYSOS.stores.all[selectedDomain].statuses().indexOf(current) !== -1 ? current : '';
        }
    }

    function actionBtn(action, id, label, danger) {
        const b = el('button', 'text-[9px] font-mono border px-2 py-0.5 rounded tracking-widest transition-all duration-300 ' +
            (danger ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                    : 'border-gold-500/30 text-gold-400 hover:bg-gold-500 hover:text-black'), label);
        b.type = 'button';
        b.dataset.regAction = action;
        b.dataset.id = id;
        return b;
    }

    function renderTable() {
        const body = document.getElementById('registry-entry-table');
        if (!body) return;
        body.textContent = '';
        const store = SYSOS.stores.all[selectedDomain];
        store.list(currentFilter()).forEach(function (entry) {
            const tr = el('tr', 'hover:bg-white/[0.02] transition-colors' + (entry.archived ? ' opacity-50' : ''));
            tr.appendChild(el('td', 'p-4 font-bold text-slate-400', entry.id));
            tr.appendChild(el('td', 'p-4 text-slate-300', entry.name));
            tr.appendChild(el('td', 'p-4 text-slate-500', REF_FIELD[selectedDomain](entry)));
            const tdStatus = el('td', 'p-4');
            tdStatus.appendChild(badge(entry.status));
            tr.appendChild(tdStatus);
            const tdActions = el('td', 'p-4');
            const rail = el('div', 'flex gap-1.5 flex-wrap');
            rail.appendChild(actionBtn('view', entry.id, 'VIEW'));
            if (selectedDomain === 'projects') {
                rail.appendChild(actionBtn('edit', entry.id, 'EDIT'));
                if (!entry.archived) rail.appendChild(actionBtn('archive', entry.id, 'ARCHIVE'));
                rail.appendChild(actionBtn('delete', entry.id, 'DELETE', true));
            }
            tdActions.appendChild(rail);
            tr.appendChild(tdActions);
            body.appendChild(tr);
        });
    }

    function renderDetail(id) {
        const box = document.getElementById('registry-detail');
        const resolved = SYSOS.relations.resolve(selectedDomain, id);
        if (!resolved) { box.classList.add('hidden'); return; }
        const e = resolved.entity;
        box.textContent = '';
        box.classList.remove('hidden');

        const head = el('div', 'flex items-center justify-between border-b border-white/5 pb-2 mb-3');
        head.appendChild(el('div', 'text-[10px] font-cyber font-bold text-gold-400 tracking-widest uppercase',
            e.name + '  ·  ' + e.id));
        const close = actionBtn('close-detail', id, 'CLOSE');
        head.appendChild(close);
        box.appendChild(head);

        const grid = el('div', 'grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-[11px] font-mono');
        const fields = [];
        Object.keys(e).forEach(function (k) {
            if (['id', 'name', 'domain', 'links', 'archived', 'prevStatus'].indexOf(k) !== -1) return;
            const v = e[k];
            if (v === '' || v === null || v === undefined) return;
            fields.push([k, Array.isArray(v) ? v.join(' -> ') : String(v)]);
        });
        fields.forEach(function (pair) {
            const row = el('div', 'flex gap-2');
            row.appendChild(el('span', 'text-slate-600 uppercase tracking-wider shrink-0', pair[0] + ':'));
            row.appendChild(el('span', 'text-slate-300', pair[1]));
            grid.appendChild(row);
        });
        box.appendChild(grid);

        const linkWrap = el('div', 'mt-3 pt-2 border-t border-white/5 text-[11px] font-mono');
        let anyLink = false;
        ['projects', 'workflows', 'agents', 'documents', 'clients'].forEach(function (d) {
            const items = resolved.links[d];
            if (!items.length) return;
            anyLink = true;
            const row = el('div', 'flex gap-2 flex-wrap items-center mt-1');
            row.appendChild(el('span', 'text-slate-600 uppercase tracking-wider', 'linked ' + d + ':'));
            items.forEach(function (it) {
                row.appendChild(el('span',
                    'border px-2 py-0.5 rounded ' + (it.missing
                        ? 'border-red-500/30 text-red-400'
                        : 'border-gold-500/20 text-gold-400/80'),
                    it.name + (it.missing ? ' [MISSING]' : '')));
            });
            linkWrap.appendChild(row);
        });
        const back = SYSOS.relations.backlinks(id);
        if (back.length) {
            anyLink = true;
            const row = el('div', 'flex gap-2 flex-wrap items-center mt-1');
            row.appendChild(el('span', 'text-slate-600 uppercase tracking-wider', 'referenced by:'));
            back.forEach(function (b) {
                row.appendChild(el('span', 'border border-white/10 px-2 py-0.5 rounded text-slate-400',
                    b.domain + ': ' + b.name));
            });
            linkWrap.appendChild(row);
        }
        if (anyLink) box.appendChild(linkWrap);
    }

    function openForm(editId) {
        const form = document.getElementById('registry-form');
        form.classList.remove('hidden');
        form.dataset.editingId = editId || '';
        if (editId) {
            const e = SYSOS.stores.all.projects.get(editId);
            if (e) {
                form.elements.name.value = e.name;
                form.elements.category.value = e.category;
                form.elements.status.value = PROJECT_STATUSES.indexOf(e.status) !== -1 ? e.status : 'ACTIVE';
                form.elements.priority.value = e.priority;
                form.elements.owner.value = e.owner;
                form.elements.description.value = e.description || '';
                form.elements.notes.value = e.notes || '';
            }
        } else {
            form.reset();
            form.elements.owner.value = 'A. F. Appling Sr.';
        }
        form.elements.name.focus();
    }

    function closeForm() {
        const form = document.getElementById('registry-form');
        form.classList.add('hidden');
        form.dataset.editingId = '';
        form.reset();
    }

    function refresh() {
        renderCards();
        renderToolbar();
        renderTable();
    }

    function handleAction(btn) {
        const action = btn.dataset.regAction;
        const id = btn.dataset.id;
        const projects = SYSOS.stores.all.projects;
        if (action === 'new') { openForm(null); }
        else if (action === 'cancel-form') { closeForm(); }
        else if (action === 'view') { renderDetail(id); }
        else if (action === 'close-detail') { document.getElementById('registry-detail').classList.add('hidden'); }
        else if (action === 'edit') { openForm(id); }
        else if (action === 'archive') {
            projects.archive(id);
            SYSOS.utils.notify('PROJECT ARCHIVED', [id + ' moved to ARCHIVED state. Record retained.']);
        }
        else if (action === 'delete') {
            // Two-step, non-blocking confirmation (no window.confirm)
            if (btn.dataset.confirm !== '1') {
                btn.dataset.confirm = '1';
                btn.textContent = 'CONFIRM?';
                setTimeout(function () {
                    btn.dataset.confirm = '';
                    btn.textContent = 'DELETE';
                }, 3000);
                return;
            }
            projects.remove(id);
            document.getElementById('registry-detail').classList.add('hidden');
            SYSOS.utils.notify('PROJECT DELETED', [id + ' permanently removed from the registry.']);
        }
    }

    SYSOS.registriesInit = function () {
        panelRef = SYSOS.router.register({
            id: 'registries',
            label: '06 // REGISTRY GRID',
            render: function (panel) { panel.innerHTML = stationHTML(); } // static trusted template
        });

        panelRef.addEventListener('click', function (e) {
            const card = e.target.closest('[data-registry]');
            if (card) {
                selectedDomain = card.dataset.registry;
                document.getElementById('registry-detail').classList.add('hidden');
                closeForm();
                refresh();
                return;
            }
            const btn = e.target.closest('[data-reg-action]');
            if (btn) handleAction(btn);
        });

        document.getElementById('registry-form').addEventListener('submit', function (e) {
            e.preventDefault();
            const form = e.target;
            const data = {
                name: form.elements.name.value.trim(),
                category: form.elements.category.value.trim(),
                status: form.elements.status.value,
                priority: form.elements.priority.value,
                owner: form.elements.owner.value.trim(),
                description: form.elements.description.value.trim(),
                notes: form.elements.notes.value.trim()
            };
            try {
                const editing = form.dataset.editingId;
                const record = editing
                    ? SYSOS.stores.all.projects.update(editing, data)
                    : SYSOS.stores.all.projects.create(data);
                closeForm();
                SYSOS.utils.notify(editing ? 'PROJECT UPDATED' : 'PROJECT COMMITTED',
                    [record.id + ' — ' + record.name, record.category + ' · ' + record.priority + ' · ' + record.status]);
            } catch (err) {
                SYSOS.utils.notify('VALIDATION FAILED', [err.message]);
            }
        });

        document.getElementById('registry-search').addEventListener('input',
            SYSOS.utils.debounce(renderTable, 150));
        document.getElementById('registry-status-filter').addEventListener('change', renderTable);

        document.addEventListener('sysos:data', refresh);

        refresh();
    };

    // Data bootstrap (called before UI by main.js)
    SYSOS.registriesData = function () {
        defineStores();
        SYSOS.activity.restore();
        if (!SYSOS.stores.restore()) {
            seed();
            SYSOS.activity.log('PLATFORM', 'Registries seeded — ' +
                Object.values(SYSOS.stores.totals()).reduce(function (a, b) { return a + b; }, 0) +
                ' records across 6 domains');
        }
        // Back-compat surface for v2.7 callers (global audit, console use)
        SYSOS.registries = SYSOS.stores.all;
    };
})();
