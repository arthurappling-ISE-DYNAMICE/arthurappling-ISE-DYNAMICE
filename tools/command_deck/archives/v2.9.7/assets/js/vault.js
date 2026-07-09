/**
 * SYS_OS — Knowledge Vault Engine
 *
 * Replaces the v2.6 presentation-only vault (Audit F-35) with a real data layer:
 *  - Document classification (rule-based taxonomy, extensible)
 *  - Metadata indexing (inverted token index, prefix-matched)
 *  - Search preparation layer (tokenizer + search() API powering the UI filter)
 *  - 5-stage ingestion pipeline: INTAKE → CLASSIFY → HASH → INDEX → SEAL,
 *    with hook points at every stage (use(stage, fn))
 *  - Hash-chained audit ledger (each entry binds to the previous entry's hash;
 *    verifyChain() recomputes the full chain)
 *  - Evidence tracking (records attached to documents, sealed into the chain)
 *  - OCR integration hooks (registerOCRProvider; image/PDF docs auto-queue)
 *  - localStorage persistence with full index rebuild on restore
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;

    const OCR_PATTERN = /\.(png|jpe?g|pdf|tiff?|heic)$/i;

    // v2.8 operational document taxonomy (OPERATIONAL_TRUTH Phase 4).
    // First match wins — order is significant.
    const CLASSIFICATIONS = Object.freeze([
        Object.freeze({ code: 'INVOICE', label: 'Invoice', test: /invoice|billing/i }),
        Object.freeze({ code: 'RECEIPT', label: 'Receipt', test: /receipt|payment|expense/i }),
        Object.freeze({ code: 'CONTRACT', label: 'Contract', test: /contract|agreement|bid_|rfp|proposal/i }),
        Object.freeze({ code: 'COMPLIANCE', label: 'Compliance', test: /compliance|permit|license|filing|rehabilitation|evidence/i }),
        Object.freeze({ code: 'RESEARCH', label: 'Research', test: /research|intel|market|brief/i }),
        Object.freeze({ code: 'SOP', label: 'SOP', test: /workflows\/|sop|protocol|checklist/i }),
        Object.freeze({ code: 'PROJECT', label: 'Project Document', test: /projects\/|agents\/|tools\/|spec|framework|engine/i })
    ]);

    // Legacy v2.7 classification codes → v2.8 categories (restore-time migration)
    const LEGACY_CLASS_MAP = Object.freeze({
        AGENT: 'PROJECT', TOOL: 'PROJECT', INTEL: 'RESEARCH', EVIDENCE: 'COMPLIANCE'
    });

    /** Document relationship links — symmetric with store LINK_DOMAINS (v2.9.7). */
    function normalizeDocLinks(links) {
        function pick(k) { return (links && Array.isArray(links[k])) ? links[k].slice() : []; }
        return {
            projects: pick('projects'),
            workflows: pick('workflows'),
            agents: pick('agents'),
            clients: pick('clients'),       // v2.9.5
            proposals: pick('proposals'),   // v2.9.7
            contracts: pick('contracts'),   // v2.9.7
            compliance: pick('compliance'), // v2.9.7
            documents: []
        };
    }

    // v2.6 visual ledger rows, re-seeded through the real pipeline with their
    // original IDs and displayed hashes preserved.
    const SEEDS = [
        { id: 'DOC-2026-0601A', path: '/workflows/turnover_standard_SOP.md', ingestedAt: '2026-06-01T10:00:00.000Z', hashOverride: { algo: 'sha256', hex: 'f8e239a2c' },
            links: { projects: ['turnover_system'], workflows: ['create_sop'] } },
        { id: 'DOC-2026-0518C', path: '/agents/strategic_ceo_framework.md', ingestedAt: '2026-05-18T10:00:00.000Z', hashOverride: { algo: 'sha256', hex: '4a9c2d1e9' },
            links: { projects: ['ai_consulting_framework'], workflows: ['proposal_generation'] } },
        { id: 'DOC-2026-0412B', path: '/tools/sports_analytics_ladder.py', ingestedAt: '2026-04-12T10:00:00.000Z', hashOverride: { algo: 'sha256', hex: 'b73d9e4f1' },
            links: { projects: ['prime_pathwy_os'], workflows: ['document_intake'] } }
    ];

    const SAMPLE_DIRS = ['/workflows/', '/agents/', '/projects/', '/WorkOrders/', '/tools/'];
    const SAMPLE_STEMS = ['client_sop', 'turnover_checklist', 'bid_response', 'evidence_packet', 'intel_brief', 'engine_spec'];
    const SAMPLE_EXTS = ['.md', '.md', '.md', '.pdf']; // occasional PDF exercises the OCR queue

    const vault = {
        documents: new Map(),
        index: new Map(),       // token -> Set<docId>
        auditChain: [],
        evidence: new Map(),    // docId -> [records]
        ocrProvider: null,
        ocrQueue: [],
        hooks: { intake: [], classify: [], hash: [], index: [], seal: [] },

        // ---------- pipeline ----------

        use(stage, fn) {
            if (this.hooks[stage]) this.hooks[stage].push(fn);
            return this;
        },

        runHooks(stage, doc) {
            this.hooks[stage].forEach(function (fn) {
                try { fn(doc); } catch (e) { console.warn('[SYS_OS:vault] ' + stage + ' hook failed', e); }
            });
        },

        makeId() {
            return 'DOC-' + SYSOS.utils.dateStamp() + '-' + SYSOS.utils.hexToken(6);
        },

        classify(path) {
            const hit = CLASSIFICATIONS.find(function (c) { return c.test.test(path); });
            return hit ? hit.code : 'UNCLASSIFIED';
        },

        tokenize(text) {
            const min = SYSOS.CONFIG.VAULT.MIN_SEARCH_CHARS;
            return String(text).toLowerCase().split(/[^a-z0-9]+/)
                .filter(function (t) { return t.length >= min; });
        },

        indexDoc(doc) {
            const self = this;
            this.tokenize(doc.path + ' ' + doc.classification + ' ' + doc.id).forEach(function (t) {
                if (!self.index.has(t)) self.index.set(t, new Set());
                self.index.get(t).add(doc.id);
            });
        },

        async ingest(meta) {
            // STAGE 1 — INTAKE
            const doc = {
                id: meta.id || this.makeId(),
                path: meta.path,
                source: meta.source || 'manual',
                ingestedAt: meta.ingestedAt || new Date().toISOString(),
                classification: null,
                hash: null,
                hashAlgo: null,
                status: 'INTAKE',
                ocr: { required: OCR_PATTERN.test(meta.path), status: 'NOT_REQUIRED' },
                links: normalizeDocLinks(meta.links)
            };
            this.runHooks('intake', doc);

            // STAGE 2 — CLASSIFY
            doc.classification = this.classify(doc.path);
            doc.status = 'CLASSIFIED';
            this.runHooks('classify', doc);

            // STAGE 3 — HASH
            const h = meta.hashOverride ||
                await SYSOS.utils.hash(doc.path + '|' + doc.ingestedAt + '|' + (meta.content || ''));
            doc.hash = h.hex;
            doc.hashAlgo = h.algo;
            doc.status = 'HASHED';
            this.runHooks('hash', doc);

            // STAGE 4 — INDEX
            this.indexDoc(doc);
            if (doc.ocr.required) {
                doc.ocr.status = this.ocrProvider ? 'QUEUED' : 'AWAITING_PROVIDER';
                this.ocrQueue.push(doc.id);
            }
            doc.status = 'INDEXED';
            this.runHooks('index', doc);

            // STAGE 5 — SEAL (audit chain)
            await this.appendAudit('INGEST', doc.id, doc.hash);
            this.runHooks('seal', doc);

            this.documents.set(doc.id, doc);
            this.persist();
            if (SYSOS.activity) {
                SYSOS.activity.log('VAULT', 'Ingested ' + doc.id + ' [' + doc.classification + '] ' + doc.path);
            }
            document.dispatchEvent(new CustomEvent('sysos:vault:ingested', { detail: doc }));
            return doc;
        },

        // ---------- audit chain ----------

        async appendAudit(action, docId, payloadHash) {
            const prev = this.auditChain.length
                ? this.auditChain[this.auditChain.length - 1].entryHash
                : 'GENESIS';
            const entry = {
                seq: this.auditChain.length + 1,
                ts: new Date().toISOString(),
                action: action,
                docId: docId,
                payloadHash: payloadHash,
                prevHash: prev
            };
            const h = await SYSOS.utils.hash(JSON.stringify(
                [entry.seq, entry.ts, entry.action, entry.docId, entry.payloadHash, entry.prevHash]));
            entry.entryHash = h.hex;
            this.auditChain.push(entry);
            return entry;
        },

        async verifyChain() {
            let prev = 'GENESIS';
            for (let i = 0; i < this.auditChain.length; i++) {
                const e = this.auditChain[i];
                if (e.prevHash !== prev) {
                    return { valid: false, length: this.auditChain.length, brokenAt: e.seq };
                }
                const h = await SYSOS.utils.hash(JSON.stringify(
                    [e.seq, e.ts, e.action, e.docId, e.payloadHash, e.prevHash]));
                if (h.hex !== e.entryHash) {
                    return { valid: false, length: this.auditChain.length, brokenAt: e.seq };
                }
                prev = e.entryHash;
            }
            return { valid: true, length: this.auditChain.length, brokenAt: null };
        },

        // ---------- evidence ----------

        async attachEvidence(docId, record) {
            if (!this.documents.has(docId)) throw new Error('Unknown document: ' + docId);
            if (!this.evidence.has(docId)) this.evidence.set(docId, []);
            const sealed = Object.assign({ ts: new Date().toISOString() }, record);
            this.evidence.get(docId).push(sealed);
            const h = await SYSOS.utils.hash(JSON.stringify(sealed));
            await this.appendAudit('EVIDENCE', docId, h.hex);
            this.persist();
            return sealed;
        },

        // ---------- OCR hooks ----------

        registerOCRProvider(provider) {
            this.ocrProvider = provider;
            const self = this;
            let promoted = 0;
            this.ocrQueue.forEach(function (id) {
                const doc = self.documents.get(id);
                if (doc && doc.ocr.status === 'AWAITING_PROVIDER') {
                    doc.ocr.status = 'QUEUED';
                    promoted++;
                }
            });
            this.persist();
            return { queued: this.ocrQueue.length, promoted: promoted };
        },

        // ---------- search ----------

        search(query) {
            const self = this;
            const tokens = this.tokenize(query);
            if (!tokens.length) return Array.from(this.documents.values());
            let ids = null;
            for (let i = 0; i < tokens.length; i++) {
                const matched = new Set();
                this.index.forEach(function (set, key) {
                    if (key.indexOf(tokens[i]) === 0) set.forEach(function (id) { matched.add(id); });
                });
                ids = ids === null ? matched
                    : new Set(Array.from(ids).filter(function (x) { return matched.has(x); }));
                if (!ids.size) break;
            }
            return Array.from(ids || []).map(function (id) { return self.documents.get(id); })
                .filter(Boolean);
        },

        // ---------- persistence ----------

        totalRows() {
            return SYSOS.CONFIG.VAULT.LEGACY_BASELINE_ROWS + this.documents.size;
        },

        persist() {
            try {
                localStorage.setItem(SYSOS.CONFIG.VAULT.STORAGE_KEY, JSON.stringify({
                    v: 1,
                    docs: Array.from(this.documents.values()),
                    chain: this.auditChain,
                    evidence: Array.from(this.evidence.entries()),
                    ocrQueue: this.ocrQueue
                }));
            } catch (e) {
                console.warn('[SYS_OS:vault] persistence unavailable', e);
            }
        },

        restore() {
            try {
                const raw = localStorage.getItem(SYSOS.CONFIG.VAULT.STORAGE_KEY);
                if (!raw) return false;
                const data = JSON.parse(raw);
                const self = this;
                this.documents = new Map(data.docs.map(function (d) {
                    // v2.7 → v2.8 migration: category remap + relationship links
                    d.classification = LEGACY_CLASS_MAP[d.classification] || d.classification;
                    d.links = normalizeDocLinks(d.links);
                    return [d.id, d];
                }));
                this.auditChain = data.chain || [];
                this.evidence = new Map(data.evidence || []);
                this.ocrQueue = data.ocrQueue || [];
                this.index = new Map();
                this.documents.forEach(function (doc) { self.indexDoc(doc); });
                return this.documents.size > 0;
            } catch (e) {
                console.warn('[SYS_OS:vault] restore failed — reseeding', e);
                return false;
            }
        },

        async reset() {
            this.documents = new Map();
            this.index = new Map();
            this.auditChain = [];
            this.evidence = new Map();
            this.ocrQueue = [];
            try { localStorage.removeItem(SYSOS.CONFIG.VAULT.STORAGE_KEY); } catch (e) { /* no-op */ }
            await this.seedAll();
            ui.renderAll();
            return true;
        },

        exportState() {
            return {
                version: SYSOS.CONFIG.VERSION,
                exportedAt: new Date().toISOString(),
                documents: Array.from(this.documents.values()),
                auditChain: this.auditChain,
                evidence: Array.from(this.evidence.entries()),
                ocrQueue: this.ocrQueue
            };
        },

        async seedAll() {
            for (let i = 0; i < SEEDS.length; i++) {
                await this.ingest(Object.assign({ source: 'seed' }, SEEDS[i]));
            }
        },

        // ---------- ingestion simulator (operator-facing demo intake) ----------

        async simulateIngest() {
            const pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
            const stem = pick(SAMPLE_STEMS) + '_' + SYSOS.utils.hexToken(6).toLowerCase();
            const doc = await this.ingest({
                path: pick(SAMPLE_DIRS) + stem + pick(SAMPLE_EXTS),
                source: 'simulator',
                links: {
                    projects: [pick(['prime_pathwy_os', 'turnover_system', 'compliance_library', 'ai_consulting_framework'])],
                    workflows: ['document_intake']
                }
            });
            ui.prependRow(doc);
            ui.refreshMeta();
            SYSOS.utils.notify('VAULT INGESTION SEALED', [
                doc.id + ' -> ' + doc.path,
                'Classification: ' + doc.classification +
                    (doc.ocr.required ? ' · OCR: ' + doc.ocr.status : ''),
                'Audit chain entry #' + this.auditChain.length + ' (' + doc.hashAlgo + ')'
            ]);
            return doc;
        },

        async init() {
            if (!this.restore()) await this.seedAll();
            ui.init();
        }
    };

    // ---------- station UI binding ----------

    const ui = {
        init() {
            this.renderAll();
            this.refreshMeta();
            const search = document.getElementById('vault-search');
            if (search) {
                search.addEventListener('input', SYSOS.utils.debounce(function () {
                    const q = search.value.trim();
                    ui.renderAll(q.length >= SYSOS.CONFIG.VAULT.MIN_SEARCH_CHARS
                        ? vault.search(q) : null);
                }, 150));
            }
        },

        row(doc, fresh) {
            const el = SYSOS.utils.el;
            const tr = el('tr', 'hover:bg-white/[0.02] transition-colors' +
                (fresh ? ' bg-gold-500/[0.02] animate-pulse' : ''));
            tr.appendChild(el('td', 'p-4 font-bold ' + (fresh ? 'text-gold-400' : 'text-slate-400'), doc.id));
            tr.appendChild(el('td', 'p-4 text-slate-400', doc.path));
            tr.appendChild(el('td', 'p-4 text-gold-500/70',
                doc.hashAlgo + ':' + String(doc.hash).slice(0, SYSOS.CONFIG.VAULT.HASH_PREVIEW_CHARS) + '...'));
            const td = el('td', 'p-4');
            const badge = el('span', 'px-2 py-0.5 rounded text-[10px] font-bold border tracking-wider ' +
                (fresh ? 'bg-gold-950/40 text-gold-400 border-gold-500/30'
                       : 'bg-emerald-950/30 text-emerald-400 border-emerald-500/20'), 'INDEXED');
            td.appendChild(badge);
            tr.appendChild(td);
            if (fresh) {
                setTimeout(function () {
                    tr.classList.remove('animate-pulse', 'bg-gold-500/[0.02]'); // finite animation (Audit F-11)
                    tr.children[0].className = 'p-4 font-bold text-slate-400';
                    badge.className = 'px-2 py-0.5 rounded text-[10px] font-bold border tracking-wider bg-emerald-950/30 text-emerald-400 border-emerald-500/20';
                }, SYSOS.CONFIG.TIMINGS.INGEST_PULSE_MS);
            }
            return tr;
        },

        renderAll(docs) {
            const body = document.getElementById('vault-table-matrix');
            if (!body) return;
            const list = (docs || Array.from(vault.documents.values()))
                .slice()
                .sort(function (a, b) { return b.ingestedAt.localeCompare(a.ingestedAt); });
            body.textContent = '';
            list.forEach(function (doc) { body.appendChild(ui.row(doc, false)); });
        },

        prependRow(doc) {
            const body = document.getElementById('vault-table-matrix');
            if (body) body.insertBefore(this.row(doc, true), body.firstChild);
        },

        refreshMeta() {
            const counter = document.getElementById('vault-rows-counter');
            if (counter) counter.textContent = vault.totalRows();
            vault.verifyChain().then(function (result) {
                const state = document.getElementById('vault-chain-state');
                const meta = document.getElementById('vault-chain-meta');
                if (state) {
                    state.textContent = result.valid ? 'HEALTHY' : 'DEGRADED';
                    state.className = 'text-2xl font-mono mt-1 font-bold tracking-wide ' +
                        (result.valid ? 'text-emerald-400' : 'text-red-400');
                }
                if (meta) {
                    meta.textContent = 'CHAIN: ' + result.length + ' ENTRIES · ' +
                        (result.valid ? 'VERIFIED' : 'BROKEN @ #' + result.brokenAt);
                }
            });
        }
    };

    vault.ui = ui;
    SYSOS.vault = vault;
})();
