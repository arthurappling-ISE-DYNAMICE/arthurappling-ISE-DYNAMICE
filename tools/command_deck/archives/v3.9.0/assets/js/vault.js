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

        // v3.5 H2: current hash mode, detected once at init via the real hash path
        // (utils.hash). 'sha256' = cryptographic (secure context); 'fnv1a' =
        // non-cryptographic fallback (non-secure context). null until init probes.
        hashAlgo: null,

        // v3.5 H4: last boot-restore outcome (set by _bootRestore).
        //   action: 'restored' | 'seeded' | 'quarantined_reseeded' | 'degraded'
        _restoreStatus: { action: null, reason: null, quarantineKey: null, reseeded: false, chainValid: null },
        // Restore-audit events emitted during boot are queued (vault.init runs
        // before audit.init) and flushed by flushRestoreAudit() after audit init.
        _pendingRestoreAudit: [],

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
            if (SYSOS.auth) SYSOS.auth.enforce('vault.ingest', { domain: 'documents' });   // v3.3 RBAC
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
            // v3.5 H1: bridge the successful write into the central audit. The OCR
            // store path reaches here with source 'ocr' — record it as ocr_stored.
            this.recordVaultAudit(doc.source === 'ocr' ? 'document.ocr_stored' : 'document.created', doc,
                { notes: 'ingested ' + doc.id + ' [' + doc.classification + '] ' + doc.path });
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

        /**
         * v3.5 H2 — current cryptographic hash mode of the vault. Does NOT touch
         * the chain or rehash anything; reports the algo detected at init() (the
         * real utils.hash path). `strong` is true only for SHA-256.
         */
        hashMode() {
            const algo = this.hashAlgo || 'unknown';
            return { algo: algo, strong: algo === 'sha256', secureContext: !!window.isSecureContext };
        },

        /**
         * v3.5 H1 — Vault → Central Audit bridge.
         * Records a SUCCESSFUL vault write into the central audit-of-record
         * (SYSOS.audit) so document activity is queryable/exportable alongside
         * client/proposal/contract events. The vault's own hash chain remains the
         * tamper-evident record and is unchanged. Defensive by contract: no-ops if
         * audit is unavailable and NEVER throws into the caller — a bridge failure
         * must not break a vault write. actor/role are captured by audit.record
         * from SYSOS.auth.current (same as every other central audit event).
         */
        recordVaultAudit(action, doc, meta) {
            try {
                if (!SYSOS.audit || typeof SYSOS.audit.record !== 'function') return null;
                meta = meta || {};
                const links = (doc && doc.links) || {};
                const chainHash = meta.chainHash != null
                    ? meta.chainHash
                    : (this.auditChain.length ? this.auditChain[this.auditChain.length - 1].entryHash : null);
                return SYSOS.audit.record({
                    action: action,
                    domain: 'documents',
                    target: (doc && doc.id) || meta.docId || null,
                    after: doc ? { classification: doc.classification, status: doc.status, hash: doc.hash } : null,
                    source: 'vault',
                    notes: meta.notes || (doc ? (doc.classification + ' · ' + doc.path) : ''),
                    metadata: {
                        chainHash: chainHash,
                        classification: doc ? doc.classification : (meta.classification || null),
                        hashAlgo: doc ? doc.hashAlgo : null,
                        docSource: doc ? doc.source : (meta.source || null),
                        links: {
                            projects: links.projects || [],
                            clients: links.clients || [],
                            workflows: links.workflows || [],
                            proposals: links.proposals || [],
                            contracts: links.contracts || []
                        }
                    }
                });
            } catch (e) {
                console.warn('[SYS_OS:vault] audit bridge failed (non-fatal)', e);
                return null;
            }
        },

        // ---------- evidence ----------

        async attachEvidence(docId, record) {
            // v3.5 H5: RBAC — structured denial (no throw), audited, before any mutation.
            if (!SYSOS.auth || !SYSOS.auth.can('vault.attachEvidence')) {
                const actor = (SYSOS.auth && SYSOS.auth.current) ? SYSOS.auth.current : { name: 'SYSTEM', role: 'SYSTEM' };
                try {
                    if (SYSOS.audit && SYSOS.audit.record) SYSOS.audit.record({ action: 'document.evidence_denied',
                        domain: 'documents', target: docId || null, source: 'vault', reason: 'permission_denied',
                        notes: actor.name + ' (' + actor.role + ') lacks vault.attachEvidence' });
                } catch (e) { /* audit must never block a safe denial */ }
                return { ok: false, reason: 'permission_denied', action: 'attachEvidence', target: docId || null,
                    actor: actor.name, role: actor.role, mutated: false };
            }
            if (!this.documents.has(docId)) throw new Error('Unknown document: ' + docId);
            if (!this.evidence.has(docId)) this.evidence.set(docId, []);
            const sealed = Object.assign({ ts: new Date().toISOString() }, record);
            this.evidence.get(docId).push(sealed);
            const h = await SYSOS.utils.hash(JSON.stringify(sealed));
            await this.appendAudit('EVIDENCE', docId, h.hex);
            this.persist();
            // v3.5 H1: bridge the evidence attachment into the central audit.
            this.recordVaultAudit('document.evidence_attached', this.documents.get(docId),
                { notes: 'evidence attached to ' + docId + ' (' + this.evidence.get(docId).length + ' record(s))' });
            return sealed;
        },

        // ---------- OCR hooks ----------

        registerOCRProvider(provider) {
            // v3.5 H5: RBAC — structured denial (no throw), audited, before any mutation.
            if (!SYSOS.auth || !SYSOS.auth.can('vault.ocrProvider')) {
                const actor = (SYSOS.auth && SYSOS.auth.current) ? SYSOS.auth.current : { name: 'SYSTEM', role: 'SYSTEM' };
                try {
                    if (SYSOS.audit && SYSOS.audit.record) SYSOS.audit.record({ action: 'document.ocr_provider_denied',
                        domain: 'documents', target: (provider && provider.name) || null, source: 'vault', reason: 'permission_denied',
                        notes: actor.name + ' (' + actor.role + ') lacks vault.ocrProvider' });
                } catch (e) { /* audit must never block a safe denial */ }
                return { ok: false, reason: 'permission_denied', action: 'registerOCRProvider',
                    actor: actor.name, role: actor.role, mutated: false };
            }
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
            if (SYSOS.stores && SYSOS.stores._suspendPersist) return;  // v3.0 demo sandbox
            try {
                SYSOS.storage.set(SYSOS.CONFIG.VAULT.STORAGE_KEY, JSON.stringify({
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
                const raw = SYSOS.storage.get(SYSOS.CONFIG.VAULT.STORAGE_KEY);
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

        // ---------- v3.5 H4: corrupt-restore quarantine (boot path only) ----------

        /** Last boot-restore outcome. */
        restoreStatus() { return Object.assign({}, this._restoreStatus); },

        /**
         * Read + validate the persisted vault WITHOUT mutating state. Returns a
         * structured result with a DISTINCT reason per failure mode:
         *   missing_storage | parse_error | invalid_shape | missing_documents |
         *   missing_audit_chain   (chain_invalid is detected later, after load).
         * On a corruption reason the raw (and parsed, if available) payload is
         * returned so it can be quarantined before any reseed.
         */
        _loadPersisted() {
            const raw = SYSOS.storage.get(SYSOS.CONFIG.VAULT.STORAGE_KEY);
            if (!raw) return { ok: false, reason: 'missing_storage' };
            let data;
            try { data = JSON.parse(raw); }
            catch (e) { return { ok: false, reason: 'parse_error', raw: raw, error: String(e.message || e) }; }
            if (!data || typeof data !== 'object' || Array.isArray(data)) return { ok: false, reason: 'invalid_shape', raw: raw, data: data };
            if (!Array.isArray(data.docs)) return { ok: false, reason: 'missing_documents', raw: raw, data: data };
            if (!Array.isArray(data.chain)) return { ok: false, reason: 'missing_audit_chain', raw: raw, data: data };
            return { ok: true, raw: raw, data: data };
        },

        /**
         * Write the corrupt payload to a quarantine key BEFORE any reseed.
         * Read-back verified. Never overwrites the original vault key.
         */
        _quarantine(res) {
            const S = SYSOS;
            const key = 'sysos.vault.quarantine.' + Date.now();
            const actor = (S.auth && S.auth.current) ? S.auth.current : { name: 'SYSTEM', role: 'SYSTEM' };
            try {
                S.storage.setJSON(key, {
                    v: 1, kind: 'vault-quarantine', createdAt: new Date().toISOString(),
                    reason: res.reason, originalKey: SYSOS.CONFIG.VAULT.STORAGE_KEY,
                    raw: res.raw != null ? res.raw : null,
                    parsed: res.data != null ? res.data : null,
                    parseError: res.error || null,
                    hashMode: this.hashAlgo, operator: actor.name, role: actor.role,
                    platform: 'SYS_OS v' + S.CONFIG.VERSION
                });
                const rb = S.storage.getJSON(key);
                const ok = !!(rb && rb.reason === res.reason && (rb.raw != null || rb.parsed != null));
                return { ok: ok, key: ok ? key : null };
            } catch (e) {
                return { ok: false, key: null, error: String(e.message || e) };
            }
        },

        _setRestoreStatus(action, reason, quarantineKey, reseeded, chainValid) {
            this._restoreStatus = { action: action, reason: reason, quarantineKey: quarantineKey || null,
                reseeded: !!reseeded, chainValid: chainValid };
            return this._restoreStatus;
        },

        /** Queue (early boot) or emit (post audit-init) a restore-audit event. */
        _recordRestoreAudit(action, meta) {
            const S = SYSOS;
            if (S.audit && S.audit._wrapped && typeof S.audit.record === 'function') this._emitRestoreAudit(action, meta);
            else this._pendingRestoreAudit.push({ action: action, meta: meta || {} });
        },
        _emitRestoreAudit(action, meta) {
            try {
                const S = SYSOS;
                if (!S.audit || typeof S.audit.record !== 'function') return null;
                meta = meta || {};
                return S.audit.record({ action: action, domain: 'documents', target: 'vault', source: 'vault',
                    reason: meta.reason || '',
                    notes: meta.notes || ('vault restore — ' + (meta.reason || action)),
                    metadata: Object.assign({ hashMode: this.hashAlgo }, meta) });
            } catch (e) { console.warn('[SYS_OS:vault] restore audit failed (non-fatal)', e); return null; }
        },
        /** Flush queued boot restore-audit events (called from main.js after audit.init). */
        flushRestoreAudit() {
            const self = this;
            const q = this._pendingRestoreAudit.slice();
            this._pendingRestoreAudit = [];
            q.forEach(function (ev) { self._emitRestoreAudit(ev.action, ev.meta); });
            return q.length;
        },

        /**
         * Boot-only restore orchestration (replaces the bare restore-or-seed).
         * Valid → load + verify chain. Missing → clean seed (no quarantine).
         * Corrupt → quarantine the raw payload, and ONLY THEN reseed; if the
         * quarantine write fails, abort (do not overwrite, do not reseed) and
         * surface a degraded status. restore() itself is unchanged (demo/sqlite).
         */
        async _bootRestore() {
            const res = this._loadPersisted();

            if (res.reason === 'missing_storage') {
                await this.seedAll();
                this._setRestoreStatus('seeded', 'missing_storage', null, true, (await this.verifyChain()).valid);
                return this._restoreStatus;
            }

            if (res.ok) {
                this.restore();                          // load into memory (sync, unchanged)
                const chain = await this.verifyChain();
                if (chain.valid) {
                    this._setRestoreStatus('restored', 'ok', null, false, true);
                    return this._restoreStatus;
                }
                res.reason = 'chain_invalid';            // valid shape but tampered chain
            }

            // ---- corruption path: quarantine BEFORE reseed ----
            const q = this._quarantine(res);
            if (!q.ok) {
                this._setRestoreStatus('degraded', 'quarantine_failed', null, false, false);
                this._recordRestoreAudit('document.vault_restore_failed',
                    { reason: 'quarantine_failed', notes: 'corrupt state (' + res.reason + ') but quarantine FAILED — refusing to reseed/overwrite' });
                console.error('[SYS_OS:vault] corrupt vault state (' + res.reason + ') but quarantine write FAILED — original key NOT overwritten, no reseed. Vault DEGRADED.');
                return this._restoreStatus;
            }

            this._recordRestoreAudit('document.vault_restore_quarantined',
                { reason: res.reason, quarantineKey: q.key, notes: 'corrupt vault state quarantined: ' + res.reason });

            // clear any partially-loaded state, then reseed clean baseline
            this.documents = new Map(); this.index = new Map(); this.auditChain = [];
            this.evidence = new Map(); this.ocrQueue = [];
            await this.seedAll();
            const chain = await this.verifyChain();
            this._setRestoreStatus('quarantined_reseeded', res.reason, q.key, true, chain.valid);
            this._recordRestoreAudit('document.vault_restore_reseeded',
                { reason: res.reason, quarantineKey: q.key, documentCount: this.documents.size, chainValid: chain.valid,
                  notes: 'reseeded clean baseline after quarantine (' + res.reason + ')' });
            console.warn('[SYS_OS:vault] corrupt state (' + res.reason + ') quarantined to ' + q.key + ' — reseeded ' + this.documents.size + ' docs.');
            return this._restoreStatus;
        },

        /**
         * v3.5 H3 — Controlled, guarded vault reset (replaces the unguarded wipe).
         * Sequence: authorize (RBAC) → validate confirmation → write recovery
         * snapshot (abort if it fails) → audit intent → destructive reset →
         * reseed → verify chain → audit completion → structured result.
         *
         * API/console-only (no UI trigger). Requires admin + an explicit token:
         *   await SYSOS.vault.reset({ confirm: 'RESET_VAULT' })
         *
         * Central audit (key sysos.audit.v1) is a SEPARATE storage key from the
         * vault key, so reset deletion does NOT remove audit history — the
         * completion event survives. All audit emits are guarded (never throw
         * into the caller, never block a safe denial).
         */
        async reset(opts) {
            opts = opts || {};
            const S = SYSOS;
            // v3.9: production guard — unsafe reset is blocked in PRODUCTION profile
            // (additive precheck; does not alter the v3.8 guarded-reset path below).
            if (S.environment && S.environment.blocks('reset')) {
                if (S.audit) S.audit.record({ action: 'environment.reset_blocked', domain: 'environment',
                    target: 'vault', source: 'vault', reason: 'reset blocked in ' + S.environment.getCurrentProfile() + ' profile' });
                return { ok: false, reason: 'production_guard_blocked', mutated: false,
                    notes: 'vault reset is disabled in ' + S.environment.getCurrentProfile() + ' profile' };
            }
            const priorCount = this.documents.size;
            const mode = this.hashMode();
            const actor = (S.auth && S.auth.current) ? S.auth.current : { name: 'SYSTEM', role: 'SYSTEM' };

            const audit = function (action, extra) {
                try {
                    if (!S.audit || typeof S.audit.record !== 'function') return null;
                    return S.audit.record(Object.assign({ action: action, domain: 'documents', target: 'vault', source: 'vault' }, extra || {}));
                } catch (e) { console.warn('[SYS_OS:vault] reset audit failed (non-fatal)', e); return null; }
            };

            // 0 — record intent (before any check)
            audit('document.vault_reset_requested', { notes: 'reset requested by ' + actor.name + ' (' + actor.role + ')',
                metadata: { priorDocumentCount: priorCount, hashMode: mode.algo } });

            // 1 — RBAC (admin-only). Denial mutates nothing.
            if (!S.auth || !S.auth.can('vault.reset')) {
                audit('document.vault_reset_denied', { reason: actor.role + ' lacks vault.reset',
                    notes: 'denied — insufficient permission', metadata: { priorDocumentCount: priorCount } });
                return { ok: false, reason: 'permission_denied', detail: actor.role + ' lacks vault.reset', mutated: false };
            }

            // 2 — explicit confirmation token. Missing/incorrect → safe reject.
            if (opts.confirm !== 'RESET_VAULT') {
                const why = opts.confirm == null ? 'missing_confirmation' : 'invalid_confirmation';
                audit('document.vault_reset_denied', { reason: why,
                    notes: 'denied — confirmation token ' + (opts.confirm == null ? 'missing' : 'invalid'),
                    metadata: { priorDocumentCount: priorCount } });
                return { ok: false, reason: why, detail: "reset requires { confirm: 'RESET_VAULT' }", mutated: false };
            }

            // 3 — recovery snapshot BEFORE any destruction. Failure aborts.
            const snapshotKey = 'sysos.vault.recovery.' + Date.now();
            const snapshotTs = new Date().toISOString();
            let snapshotOk = false;
            try {
                S.storage.setJSON(snapshotKey, {
                    v: 1, kind: 'vault-recovery', createdAt: snapshotTs,
                    platform: 'SYS_OS v' + S.CONFIG.VERSION, hashMode: mode.algo,
                    documentCount: priorCount, state: this.exportState()
                });
                const rb = S.storage.getJSON(snapshotKey);   // verify readback
                snapshotOk = !!(rb && rb.documentCount === priorCount && rb.state && Array.isArray(rb.state.documents));
            } catch (e) { snapshotOk = false; }

            if (!snapshotOk) {
                audit('document.vault_reset_failed', { reason: 'snapshot_unavailable',
                    notes: 'reset ABORTED — recovery snapshot could not be written; vault unchanged',
                    metadata: { priorDocumentCount: priorCount, snapshotKey: snapshotKey } });
                return { ok: false, reason: 'snapshot_failed', detail: 'recovery snapshot unavailable — reset aborted', mutated: false };
            }
            audit('document.vault_reset_snapshot_created', { notes: 'recovery snapshot written: ' + snapshotKey,
                metadata: { snapshotKey: snapshotKey, snapshotTimestamp: snapshotTs, priorDocumentCount: priorCount, hashMode: mode.algo } });

            // 4 — destructive reset + reseed (only now). Deletion via the adapter.
            try {
                this.documents = new Map();
                this.index = new Map();
                this.auditChain = [];
                this.evidence = new Map();
                this.ocrQueue = [];
                S.storage.remove(SYSOS.CONFIG.VAULT.STORAGE_KEY);
                await this.seedAll();
                const chain = await this.verifyChain();
                ui.renderAll();
                audit('document.vault_reset_completed', {
                    notes: 'vault reset complete — reseeded ' + this.documents.size + ' docs; chain ' + (chain.valid ? 'valid' : 'INVALID'),
                    metadata: { priorDocumentCount: priorCount, newDocumentCount: this.documents.size,
                        snapshotKey: snapshotKey, snapshotTimestamp: snapshotTs, hashMode: this.hashMode().algo, chainValid: chain.valid } });
                return { ok: true, reason: 'reset_complete', mutated: true,
                    priorDocumentCount: priorCount, newDocumentCount: this.documents.size,
                    snapshotKey: snapshotKey, snapshotTimestamp: snapshotTs, chainValid: chain.valid };
            } catch (e) {
                audit('document.vault_reset_failed', { reason: String(e.message || e),
                    notes: 'reset FAILED during reseed — recovery snapshot ' + snapshotKey + ' available',
                    metadata: { snapshotKey: snapshotKey, priorDocumentCount: priorCount } });
                return { ok: false, reason: 'reset_error', detail: String(e.message || e), mutated: true, snapshotKey: snapshotKey };
            }
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
            // v3.5 H2: detect the current hash mode via the real hash path (no
            // rehash of existing docs). Surfaces a boot warning in fallback mode.
            try {
                const probe = await SYSOS.utils.hash('sysos.vault.hashmode.probe');
                this.hashAlgo = probe.algo;
            } catch (e) { this.hashAlgo = 'unknown'; }
            if (this.hashAlgo !== 'sha256') {
                console.warn('[SYS_OS:vault] HASH MODE = ' + this.hashAlgo +
                    ' (non-cryptographic fallback) — secure context unavailable. Vault chain integrity is NOT tamper-resistant. Serve over https or localhost.');
            }
            await this._bootRestore();   // v3.5 H4: validate + quarantine-on-corruption (replaces bare restore-or-seed)
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
                // v3.5 H2: hash mode factors into the surfaced state — a valid chain
                // built on the non-crypto fallback must NOT read as fully healthy.
                const mode = vault.hashMode();
                // v3.5 H4: a corrupt-restore recovery must not read as a clean boot.
                const rs = vault.restoreStatus();
                const recovered = rs.action === 'quarantined_reseeded';
                const degradedRestore = rs.action === 'degraded';
                if (state) {
                    let label, cls;
                    if (!result.valid || degradedRestore) { label = 'DEGRADED'; cls = 'text-red-400'; }
                    else if (!mode.strong || recovered) { label = 'WARNING'; cls = 'text-amber-400'; }
                    else { label = 'HEALTHY'; cls = 'text-emerald-400'; }
                    state.textContent = label;
                    state.className = 'text-2xl font-mono mt-1 font-bold tracking-wide ' + cls;
                }
                if (meta) {
                    meta.textContent = 'CHAIN: ' + result.length + ' ENTRIES · ' +
                        (result.valid ? 'VERIFIED' : 'BROKEN @ #' + result.brokenAt) +
                        (mode.strong ? '' : ' · FALLBACK HASH (' + mode.algo + ') — NON-SECURE CONTEXT') +
                        (recovered ? ' · RESTORED FROM CORRUPT STATE — QUARANTINE CREATED (' + rs.reason + ')' : '') +
                        (degradedRestore ? ' · CORRUPT STATE — QUARANTINE FAILED, DEGRADED' : '');
                }
            });
        }
    };

    vault.ui = ui;
    SYSOS.vault = vault;
})();
