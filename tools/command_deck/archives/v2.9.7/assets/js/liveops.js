/**
 * SYS_OS v2.9 — LIVE OPERATIONS Station (07)
 *
 * Single station that surfaces the five live-ops subsystems. Registered at
 * runtime through SYSOS.router.register() — the station-expansion contract,
 * not a UI redesign. All dynamic text via textContent; the static shell is the
 * only innerHTML. Re-renders on the subsystem events.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;
    const el = function () { return SYSOS.utils.el.apply(null, arguments); };

    const TONE = {
        ONLINE: 'text-emerald-400', DEGRADED: 'text-amber-400', OFFLINE: 'text-red-400',
        CHECKING: 'text-slate-400', UNKNOWN: 'text-slate-500',
        PENDING: 'text-slate-400', RUNNING: 'text-amber-400', COMPLETED: 'text-emerald-400',
        FAILED: 'text-red-400', AWAITING_PROVIDER: 'text-amber-400', STORED: 'text-emerald-400',
        ESCALATED: 'text-red-400', DUE_SOON: 'text-amber-400', CLEAR: 'text-slate-400',
        COMPLETED_C: 'text-emerald-400', UNSCHEDULED: 'text-slate-500'
    };

    function badge(text, tone) {
        return el('span', 'px-2 py-0.5 rounded text-[10px] font-bold border border-white/10 tracking-wider ' +
            (TONE[tone] || 'text-slate-400'), text);
    }

    function opBtn(action, id, label, danger) {
        const b = el('button', 'text-[9px] font-mono border px-2 py-0.5 rounded tracking-widest transition-all duration-300 ' +
            (danger ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                    : 'border-gold-500/30 text-gold-400 hover:bg-gold-500 hover:text-black'), label);
        b.type = 'button'; b.dataset.opsAction = action; if (id) b.dataset.id = id;
        return b;
    }

    function sectionShell() {
        return '' +
        '<div class="space-y-6">' +
            // Telemetry
            '<div class="bg-black/40 border border-gold-500/10 rounded-xl p-6 backdrop-blur-md">' +
                '<div class="flex items-center justify-between border-b border-gold-500/10 pb-4 mb-4">' +
                    '<div><h2 class="text-xs font-cyber font-semibold tracking-widest text-gold-400">Real Telemetry Layer</h2>' +
                    '<p class="text-[11px] text-slate-500 font-mono mt-1">Measured fetch-probe node health — RTT observed, not scripted</p></div>' +
                    '<div class="flex gap-2"><span id="tel-summary" class="text-[9px] font-mono text-gold-400 border border-gold-500/20 px-2 py-1 rounded bg-gold-500/5"></span>' +
                    '<button type="button" data-ops-action="probe-all" class="text-[10px] font-mono border border-gold-500/40 text-gold-400 px-3 py-1 rounded tracking-widest hover:bg-gold-500 hover:text-black transition-all duration-300">PROBE_ALL</button></div>' +
                '</div>' +
                '<div id="tel-nodes" class="space-y-2"></div>' +
            '</div>' +
            // Operations Queue
            '<div class="bg-black/40 border border-gold-500/10 rounded-xl p-6 backdrop-blur-md">' +
                '<div class="flex items-center justify-between border-b border-gold-500/10 pb-4 mb-4">' +
                    '<div><h2 class="text-xs font-cyber font-semibold tracking-widest text-gold-400">Operations Queue</h2>' +
                    '<p class="text-[11px] text-slate-500 font-mono mt-1">PENDING -> RUNNING -> COMPLETED / FAILED · retry-capable · audit-logged</p></div>' +
                    '<div class="flex gap-2">' +
                    '<button type="button" data-ops-action="dispatch-sample" class="text-[10px] font-mono border border-gold-500/40 text-gold-400 px-3 py-1 rounded tracking-widest hover:bg-gold-500 hover:text-black transition-all duration-300">+ DISPATCH</button>' +
                    '<button type="button" data-ops-action="run-pending" class="text-[10px] font-mono border border-gold-500/40 text-gold-400 px-3 py-1 rounded tracking-widest hover:bg-gold-500 hover:text-black transition-all duration-300">RUN_PENDING</button></div>' +
                '</div>' +
                '<div id="ops-stats" class="grid grid-cols-4 gap-3 mb-4 text-center"></div>' +
                '<div class="overflow-x-auto rounded-lg border border-white/5 bg-black/40"><table class="w-full text-left font-mono text-xs">' +
                    '<thead class="bg-slate-950 text-slate-500 uppercase text-[9px] tracking-widest border-b border-white/5"><tr>' +
                    '<th class="p-3">Op ID</th><th class="p-3">Title</th><th class="p-3">Executor</th><th class="p-3">Attempts</th><th class="p-3">Status</th><th class="p-3">Actions</th></tr></thead>' +
                    '<tbody id="ops-table" class="divide-y divide-white/[0.03] text-slate-300"></tbody>' +
                '</table></div>' +
            '</div>' +
            // Agent Routing + Compliance side by side
            '<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">' +
                '<div class="bg-black/40 border border-gold-500/10 rounded-xl p-6 backdrop-blur-md">' +
                    '<div class="border-b border-gold-500/10 pb-4 mb-4"><h2 class="text-xs font-cyber font-semibold tracking-widest text-gold-400">Agent Routing Layer</h2>' +
                    '<p class="text-[11px] text-slate-500 font-mono mt-1">Registry contracts -> executable dispatch (registry preserved as truth)</p></div>' +
                    '<div id="routing-list" class="space-y-2"></div>' +
                '</div>' +
                '<div class="bg-black/40 border border-gold-500/10 rounded-xl p-6 backdrop-blur-md">' +
                    '<div class="border-b border-gold-500/10 pb-4 mb-4"><h2 class="text-xs font-cyber font-semibold tracking-widest text-gold-400">Compliance Scheduler</h2>' +
                    '<p class="text-[11px] text-slate-500 font-mono mt-1">Due dates · reminders · escalation · audit-logged</p></div>' +
                    '<div id="compliance-list" class="space-y-2"></div>' +
                '</div>' +
            '</div>' +
            // OCR
            '<div class="bg-black/40 border border-gold-500/10 rounded-xl p-6 backdrop-blur-md">' +
                '<div class="flex items-center justify-between border-b border-gold-500/10 pb-4 mb-4">' +
                    '<div><h2 class="text-xs font-cyber font-semibold tracking-widest text-gold-400">OCR Framework</h2>' +
                    '<p class="text-[11px] text-slate-500 font-mono mt-1">Upload -> Process -> Extract -> Store -> Vault link · provider slot open (none shipped)</p></div>' +
                    '<div class="flex items-center gap-2">' +
                    '<input type="file" id="ocr-file" class="hidden">' +
                    '<button type="button" data-ops-action="ocr-pick" class="text-[10px] font-mono border border-gold-500/40 text-gold-400 px-3 py-1 rounded tracking-widest hover:bg-gold-500 hover:text-black transition-all duration-300">UPLOAD_FILE</button>' +
                    '<button type="button" data-ops-action="ocr-sample" class="text-[10px] font-mono border border-gold-500/40 text-gold-400 px-3 py-1 rounded tracking-widest hover:bg-gold-500 hover:text-black transition-all duration-300">+ SAMPLE_DOC</button></div>' +
                '</div>' +
                '<div id="ocr-status" class="text-[11px] font-mono text-slate-500 mb-3"></div>' +
                '<div id="ocr-jobs" class="space-y-2"></div>' +
            '</div>' +
        '</div>';
    }

    function renderTelemetry() {
        const wrap = document.getElementById('tel-nodes');
        if (!wrap) return;
        wrap.textContent = '';
        SYSOS.telemetry.snapshot().forEach(function (n) {
            const row = el('div', 'flex items-center justify-between p-3 bg-slate-950/40 border border-white/5 rounded-lg');
            const left = el('div', 'flex items-center gap-3');
            left.appendChild(el('span', 'w-1.5 h-1.5 rounded-full ' +
                (n.status === 'ONLINE' ? 'bg-emerald-400' : n.status === 'DEGRADED' ? 'bg-amber-400'
                    : n.status === 'OFFLINE' ? 'bg-red-400' : 'bg-slate-600')));
            left.appendChild(el('span', 'text-xs font-mono text-slate-300', n.label));
            left.appendChild(el('span', 'text-[10px] font-mono text-slate-600', 'PORT :' + n.port));
            const right = el('div', 'flex items-center gap-3');
            right.appendChild(el('span', 'text-[11px] font-mono ' + (TONE[n.status] || 'text-slate-400'),
                n.rttMs !== null ? n.rttMs + 'ms' : (n.error || '—')));
            right.appendChild(badge(n.status, n.status));
            right.appendChild(opBtn('probe-one', n.id, 'PROBE'));
            row.appendChild(left); row.appendChild(right);
            wrap.appendChild(row);
        });
        const s = SYSOS.telemetry.summary();
        const sum = document.getElementById('tel-summary');
        if (sum) sum.textContent = s.online + ' UP · ' + s.degraded + ' DEGRADED · ' + s.offline + ' DOWN';
    }

    function statCard(label, value, tone) {
        const card = el('div', 'bg-slate-950/60 border border-white/5 rounded-lg p-2');
        card.appendChild(el('div', 'text-[9px] font-mono text-slate-500 tracking-widest uppercase', label));
        card.appendChild(el('div', 'text-xl font-mono font-bold mt-0.5 ' + (tone || 'text-slate-200'), String(value)));
        return card;
    }

    function renderOps() {
        const stats = SYSOS.opsQueue.stats();
        const sw = document.getElementById('ops-stats');
        if (sw) {
            sw.textContent = '';
            sw.appendChild(statCard('Pending', stats.PENDING, 'text-slate-300'));
            sw.appendChild(statCard('Running', stats.RUNNING, 'text-amber-400'));
            sw.appendChild(statCard('Completed', stats.COMPLETED, 'text-emerald-400'));
            sw.appendChild(statCard('Failed', stats.FAILED, 'text-red-400'));
        }
        const body = document.getElementById('ops-table');
        if (!body) return;
        body.textContent = '';
        SYSOS.opsQueue.list().slice(0, 12).forEach(function (op) {
            const tr = el('tr', 'hover:bg-white/[0.02] transition-colors');
            tr.appendChild(el('td', 'p-3 font-bold text-slate-400', op.id));
            tr.appendChild(el('td', 'p-3 text-slate-300', op.title));
            tr.appendChild(el('td', 'p-3 text-slate-500', op.executor || '—'));
            tr.appendChild(el('td', 'p-3 text-slate-500', op.attempts + '/' + (op.maxRetries + 1)));
            const st = el('td', 'p-3'); st.appendChild(badge(op.status, op.status)); tr.appendChild(st);
            const act = el('td', 'p-3'); const rail = el('div', 'flex gap-1.5');
            if (op.status === 'PENDING') rail.appendChild(opBtn('run-one', op.id, 'RUN'));
            if (op.status === 'FAILED') rail.appendChild(opBtn('retry-one', op.id, 'RETRY'));
            rail.appendChild(opBtn('remove-one', op.id, 'DEL', true));
            act.appendChild(rail); tr.appendChild(act);
            body.appendChild(tr);
        });
    }

    function renderRouting() {
        const wrap = document.getElementById('routing-list');
        if (!wrap) return;
        wrap.textContent = '';
        SYSOS.routing.list().forEach(function (c) {
            const row = el('div', 'flex items-center justify-between p-2.5 bg-slate-950/40 border border-white/5 rounded-lg');
            const left = el('div');
            left.appendChild(el('div', 'text-xs font-mono text-slate-300', c.name));
            left.appendChild(el('div', 'text-[10px] font-mono text-slate-600', c.executorKey + ' · ' + c.role));
            const right = el('div', 'flex items-center gap-2');
            right.appendChild(badge(c.executable ? 'EXECUTABLE' : 'PROVISIONED', c.executable ? 'COMPLETED' : 'DUE_SOON'));
            right.appendChild(opBtn('route-dispatch', c.agentId, 'DISPATCH'));
            row.appendChild(left); row.appendChild(right);
            wrap.appendChild(row);
        });
    }

    function renderCompliance() {
        const wrap = document.getElementById('compliance-list');
        if (!wrap) return;
        wrap.textContent = '';
        SYSOS.compliance.list().forEach(function (r) {
            const row = el('div', 'flex items-center justify-between p-2.5 bg-slate-950/40 border border-white/5 rounded-lg');
            const left = el('div');
            left.appendChild(el('div', 'text-xs font-mono text-slate-300', r.name));
            left.appendChild(el('div', 'text-[10px] font-mono text-slate-600',
                r.dueDate ? 'due ' + r.dueDate.slice(0, 10) + (r.daysLeft !== null ? ' · ' + r.daysLeft + 'd' : '') : 'no due date'));
            const right = el('div', 'flex items-center gap-2');
            right.appendChild(badge(r.state, r.state));
            if (r.state === 'ESCALATED' || r.state === 'DUE_SOON') right.appendChild(opBtn('comp-complete', r.id, 'DONE'));
            row.appendChild(left); row.appendChild(right);
            wrap.appendChild(row);
        });
    }

    function renderOCR() {
        const status = document.getElementById('ocr-status');
        if (status) {
            const s = SYSOS.ocr.stats();
            status.textContent = 'Provider: ' + (SYSOS.ocr.hasProvider() ? 'REGISTERED' : 'NONE (framework only)') +
                ' · jobs: ' + s.total + ' · awaiting provider: ' + s.awaitingProvider + ' · stored: ' + s.stored;
        }
        const wrap = document.getElementById('ocr-jobs');
        if (!wrap) return;
        wrap.textContent = '';
        SYSOS.ocr.list().slice(0, 8).forEach(function (j) {
            const row = el('div', 'flex items-center justify-between p-2.5 bg-slate-950/40 border border-white/5 rounded-lg');
            const left = el('div');
            left.appendChild(el('div', 'text-xs font-mono text-slate-300', j.name));
            left.appendChild(el('div', 'text-[10px] font-mono text-slate-600',
                j.id + ' · ' + j.sizeKB + 'KB' + (j.docId ? ' -> ' + j.docId : '')));
            const right = el('div', 'flex items-center gap-2');
            right.appendChild(badge(j.status, j.status));
            if (j.status === 'QUEUED' || j.status === 'AWAITING_PROVIDER') right.appendChild(opBtn('ocr-process', j.id, 'PROCESS'));
            row.appendChild(left); right && row.appendChild(right);
            wrap.appendChild(row);
        });
    }

    function refreshAll() {
        renderTelemetry(); renderOps(); renderRouting(); renderCompliance(); renderOCR();
    }

    const SAMPLE_OPS = [
        { agent: 'research_agent', title: 'Pull HVIP voucher program status' },
        { agent: 'compliance_agent', title: 'Verify UEI registration state' },
        { agent: 'coo_agent', title: 'Audit turnover crew readiness' },
        { agent: 'vault_agent', title: 'Reconcile vault audit chain' }
    ];

    function handle(action, id) {
        const Q = SYSOS.opsQueue;
        if (action === 'probe-all') SYSOS.telemetry.probeAll();
        else if (action === 'probe-one') SYSOS.telemetry.probe(id);
        else if (action === 'dispatch-sample') {
            const pick = SAMPLE_OPS[Math.floor(Math.random() * SAMPLE_OPS.length)];
            SYSOS.routing.dispatch(pick.agent, pick.title, { requestedAt: new Date().toISOString() });
        }
        else if (action === 'run-pending') Q.runPending();
        else if (action === 'run-one') Q.run(id);
        else if (action === 'retry-one') Q.retry(id);
        else if (action === 'remove-one') Q.remove(id);
        else if (action === 'route-dispatch') SYSOS.routing.dispatch(id, 'Manual dispatch to ' + id, {});
        else if (action === 'comp-complete') SYSOS.compliance.complete(id);
        else if (action === 'ocr-sample') {
            SYSOS.ocr.upload({ name: 'receipt_' + SYSOS.utils.hexToken(4).toLowerCase() + '.pdf', sizeKB: 240,
                type: 'application/pdf', links: { projects: ['compliance_library'] } });
        }
        else if (action === 'ocr-pick') document.getElementById('ocr-file').click();
        else if (action === 'ocr-process') SYSOS.ocr.process(id);
    }

    SYSOS.liveOpsInit = function () {
        const panel = SYSOS.router.register({
            id: 'liveops',
            label: '07 // LIVE OPS',
            render: function (p) { p.innerHTML = sectionShell(); }   // static trusted shell
        });

        panel.addEventListener('click', function (e) {
            const btn = e.target.closest('[data-ops-action]');
            if (btn) handle(btn.dataset.opsAction, btn.dataset.id);
        });
        panel.querySelector('#ocr-file').addEventListener('change', function (e) {
            const f = e.target.files && e.target.files[0];
            if (f) { try { SYSOS.ocr.upload(f); } catch (err) { SYSOS.utils.notify('OCR UPLOAD REJECTED', [err.message]); } }
            e.target.value = '';
        });

        ['sysos:telemetry', 'sysos:ops', 'sysos:compliance', 'sysos:ocr', 'sysos:data']
            .forEach(function (evt) { document.addEventListener(evt, refreshAll); });

        refreshAll();
    };
})();
