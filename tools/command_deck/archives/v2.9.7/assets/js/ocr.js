/**
 * SYS_OS v2.9 — OCR Framework (framework only — no providers shipped)
 *
 * End-to-end document pipeline that rides the EXISTING vault hooks:
 *   UPLOAD -> QUEUED -> PROCESSING -> EXTRACTED -> STORED(+linked)
 *
 * - Upload accepts a File (or a synthetic descriptor for testing).
 * - PROCESSING delegates to a provider registered via the v2.7 vault hook
 *   SYSOS.vault.registerOCRProvider(). With no provider, jobs park at
 *   AWAITING_PROVIDER — exactly the contract the audit verified. v3.0 drops a
 *   Tesseract/remote provider in with zero framework changes.
 * - STORED ingests the document through the real vault pipeline (hash + audit
 *   chain + relationship links), so OCR output is a first-class vault citizen.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;

    function cfg() { return SYSOS.CONFIG.OCR; }

    const ocr = {
        jobs: new Map(),

        // ---------- intake ----------

        /** descriptor: { name, sizeKB, type, dataText?, links? } or a File. */
        upload(input) {
            const file = (typeof File !== 'undefined' && input instanceof File) ? input : null;
            const name = file ? file.name : (input.name || 'document');
            const sizeKB = file ? Math.ceil(file.size / 1024) : (input.sizeKB || 0);
            if (sizeKB > cfg().MAX_FILE_KB) {
                throw new Error('file exceeds ' + cfg().MAX_FILE_KB + 'KB limit');
            }
            const job = {
                id: 'OCR-' + SYSOS.utils.dateStamp() + '-' + SYSOS.utils.hexToken(4),
                name: name,
                sizeKB: sizeKB,
                type: file ? file.type : (input.type || ''),
                status: 'UPLOAD',
                text: null,
                docId: null,
                error: null,
                links: input.links || { projects: [], workflows: [], agents: [] },
                _payloadText: (input && input.dataText) || (name + '::' + sizeKB),
                createdAt: new Date().toISOString(),
                history: [{ ts: new Date().toISOString(), to: 'UPLOAD' }]
            };
            this.jobs.set(job.id, job);
            this.advance(job, 'QUEUED');
            this.persist();
            SYSOS.activity.log('OCR', 'Uploaded ' + job.id + ' — ' + job.name + ' (' + job.sizeKB + 'KB)');
            this.emit();
            return job;
        },

        advance(job, to, patch) {
            job.status = to;
            Object.assign(job, patch || {});
            job.history.push({ ts: new Date().toISOString(), to: to });
        },

        // ---------- processing (provider-delegated) ----------

        async process(jobId) {
            const job = this.jobs.get(jobId);
            if (!job) return null;
            const provider = SYSOS.vault.ocrProvider;
            if (!provider || typeof provider.extract !== 'function') {
                this.advance(job, 'AWAITING_PROVIDER');
                this.persist();
                SYSOS.activity.log('OCR', job.id + ' parked — no OCR provider registered');
                this.emit();
                return job;
            }
            this.advance(job, 'PROCESSING');
            this.emit();
            try {
                const text = await provider.extract(job);
                this.advance(job, 'EXTRACTED', { text: text });
                await this.store(job);
            } catch (e) {
                this.advance(job, 'FAILED', { error: String(e.message || e) });
                SYSOS.activity.log('OCR', job.id + ' processing failed — ' + (e.message || e));
            }
            this.persist();
            this.emit();
            return job;
        },

        /** Store extracted output as a real vault document (hash + chain + links). */
        async store(job) {
            const doc = await SYSOS.vault.ingest({
                path: '/ocr/' + job.name,
                source: 'ocr',
                content: job.text || job._payloadText,
                links: job.links
            });
            this.advance(job, 'STORED', { docId: doc.id });
            SYSOS.activity.log('OCR', job.id + ' stored to vault as ' + doc.id);
            return doc;
        },

        // ---------- provider plumbing (delegates to the vault hook) ----------

        registerProvider(provider) {
            const result = SYSOS.vault.registerOCRProvider(provider);
            SYSOS.activity.log('OCR', 'Provider registered: ' + (provider.name || 'unnamed'));
            // Promote any parked jobs.
            const self = this;
            this.jobs.forEach(function (j) {
                if (j.status === 'AWAITING_PROVIDER') { j.status = 'QUEUED'; self.advance(j, 'QUEUED'); }
            });
            this.persist();
            this.emit();
            return result;
        },

        hasProvider() { return !!(SYSOS.vault.ocrProvider && SYSOS.vault.ocrProvider.extract); },

        // ---------- queries ----------

        get(id) { return this.jobs.get(id) || null; },
        list() {
            return Array.from(this.jobs.values())
                .sort(function (a, b) { return b.createdAt.localeCompare(a.createdAt); });
        },
        stats() {
            const s = { total: this.jobs.size, awaitingProvider: 0, stored: 0, failed: 0 };
            this.jobs.forEach(function (j) {
                if (j.status === 'AWAITING_PROVIDER') s.awaitingProvider++;
                else if (j.status === 'STORED') s.stored++;
                else if (j.status === 'FAILED') s.failed++;
            });
            return s;
        },

        // ---------- persistence ----------

        persist() {
            try {
                localStorage.setItem(cfg().STORAGE_KEY, JSON.stringify({
                    v: 1, jobs: Array.from(this.jobs.values())
                }));
            } catch (e) { console.warn('[SYS_OS:ocr] persistence unavailable', e); }
        },

        restore() {
            try {
                const raw = localStorage.getItem(cfg().STORAGE_KEY);
                if (!raw) return false;
                this.jobs = new Map(JSON.parse(raw).jobs.map(function (j) { return [j.id, j]; }));
                return this.jobs.size > 0;
            } catch (e) { return false; }
        },

        emit() { document.dispatchEvent(new CustomEvent('sysos:ocr')); },

        init() { this.restore(); }
    };

    SYSOS.ocr = ocr;
})();
