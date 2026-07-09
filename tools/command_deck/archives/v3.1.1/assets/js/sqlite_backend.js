/**
 * SYS_OS v3.1 — SQLite Backend
 *
 * Implements the storage-adapter backend contract over a relational KV model
 * (`kv(key TEXT PRIMARY KEY, value TEXT, updated_at TEXT)`) — exactly the
 * Phase-A "KV-parity" schema from docs/v3.0/SQLITE_MIGRATION_DESIGN.md.
 *
 * Engine transparency: this is the browser-resident realization. The physical
 * store is a serialized `kv` table persisted as a single DB blob (the .db-file
 * stand-in). In a Node/Bun/Electron host, swap the three table primitives
 * (_select/_upsert/_delete) for sql.js / better-sqlite3 calls against the same
 * schema — the contract, keys, and values are identical, so nothing above this
 * module changes. The DB blob is itself stored through a raw store so the
 * SQLite backend can hold the SAME keys the localStorage backend used (full
 * parity + instant rollback).
 *
 * Public API: connect, initialize, get, set, remove, query, export, import
 * + the adapter contract: name, getItem, setItem, removeItem, keys.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;

    const DB_FILE_KEY = 'sysos.sqlite.db';   // serialized table lives here (raw localStorage)

    function rawGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
    function rawSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* quota */ } }

    function SqliteBackend() {
        this.name = 'sqlite(kv)';
        this.connected = false;
        this.table = [];          // [{ key, value, updated_at }]
        this._index = new Map();  // key -> row (PRIMARY KEY index)
    }

    // ---- lifecycle ----
    SqliteBackend.prototype.connect = function () {
        const raw = rawGet(DB_FILE_KEY);
        if (raw) {
            try { this.table = JSON.parse(raw).rows || []; } catch (e) { this.table = []; }
        }
        this._reindex();
        this.connected = true;
        return true;
    };

    SqliteBackend.prototype.initialize = function () {
        // CREATE TABLE IF NOT EXISTS kv(...) — KV table is implicit; ensure connected.
        if (!this.connected) this.connect();
        return { schema: 'kv(key PRIMARY KEY, value, updated_at)', rows: this.table.length };
    };

    SqliteBackend.prototype._reindex = function () {
        this._index = new Map();
        const self = this;
        this.table.forEach(function (r) { self._index.set(r.key, r); });
    };

    SqliteBackend.prototype._flush = function () {
        rawSet(DB_FILE_KEY, JSON.stringify({ schema: 'kv', rows: this.table, savedAt: new Date().toISOString() }));
    };

    // ---- table primitives (the host-swap seam) ----
    SqliteBackend.prototype._select = function (key) { return this._index.get(key) || null; };
    SqliteBackend.prototype._upsert = function (key, value) {
        let row = this._index.get(key);
        if (row) { row.value = value; row.updated_at = new Date().toISOString(); }
        else { row = { key: key, value: value, updated_at: new Date().toISOString() }; this.table.push(row); this._index.set(key, row); }
        this._flush();
    };
    SqliteBackend.prototype._delete = function (key) {
        if (!this._index.has(key)) return;
        this.table = this.table.filter(function (r) { return r.key !== key; });
        this._index.delete(key);
        this._flush();
    };

    // ---- storage-adapter contract ----
    SqliteBackend.prototype.getItem = function (key) { const r = this._select(key); return r ? r.value : null; };
    SqliteBackend.prototype.setItem = function (key, value) { this._upsert(key, String(value)); };
    SqliteBackend.prototype.removeItem = function (key) { this._delete(key); };
    SqliteBackend.prototype.keys = function () { return this.table.map(function (r) { return r.key; }); };

    // ---- SQL-shaped query (read path) ----
    /**
     * Minimal SELECT support over the kv table:
     *   query("SELECT * FROM kv WHERE key LIKE 'sysos.registry%'")
     *   query({ likePrefix: 'sysos.' })
     * Returns row objects {key, value, updated_at}.
     */
    SqliteBackend.prototype.query = function (q) {
        if (typeof q === 'object' && q && q.likePrefix) {
            return this.table.filter(function (r) { return r.key.indexOf(q.likePrefix) === 0; });
        }
        if (typeof q === 'string') {
            const m = q.match(/where\s+key\s+like\s+'([^%']*)%?'/i);
            if (m) { const p = m[1]; return this.table.filter(function (r) { return r.key.indexOf(p) === 0; }); }
            if (/select\s+\*\s+from\s+kv/i.test(q)) return this.table.slice();
        }
        return [];
    };

    // ---- backup / migration ----
    SqliteBackend.prototype.export = function () {
        return { engine: this.name, exportedAt: new Date().toISOString(), schema: 'kv', rows: this.table.slice() };
    };
    SqliteBackend.prototype.import = function (dump) {
        if (!dump || !Array.isArray(dump.rows)) throw new Error('[sqlite] invalid dump');
        this.table = dump.rows.map(function (r) { return { key: r.key, value: r.value, updated_at: r.updated_at || new Date().toISOString() }; });
        this._reindex();
        this._flush();
        return this.table.length;
    };

    // ---- transactions (atomic multi-op; rollback on throw) ----
    /**
     * Run fn(backend) atomically. Flush is deferred until commit; any throw
     * rolls the kv table back to its pre-transaction snapshot. Real
     * BEGIN/COMMIT/ROLLBACK semantics over the kv store.
     */
    SqliteBackend.prototype.transaction = function (fn) {
        const snapshot = JSON.stringify(this.table);
        const realFlush = this._flush;
        let dirty = false;
        this._flush = function () { dirty = true; };   // defer
        try {
            // Pass the storage ADAPTER (set/get/remove), not the raw backend,
            // so transaction bodies use the same API everywhere.
            const result = fn(SYSOS.storage);
            this._flush = realFlush;
            if (dirty) this._flush();
            return { committed: true, result: result, rows: this.table.length };
        } catch (e) {
            this.table = JSON.parse(snapshot);          // ROLLBACK
            this._reindex();
            this._flush = realFlush;
            this._flush();
            return { committed: false, error: String(e.message || e), rows: this.table.length };
        }
    };

    SqliteBackend.prototype.stats = function () {
        return { engine: this.name, connected: this.connected, rows: this.table.length, dbFileKey: DB_FILE_KEY };
    };

    SYSOS.SqliteBackend = SqliteBackend;

    /**
     * One-call migration: copy all current adapter keys into a fresh SQLite
     * backend, register it, and return a measured result. Non-destructive —
     * the localStorage source keys are left intact for rollback.
     */
    const ACTIVE_FLAG = 'sysos.active_backend';

    SYSOS.sqlite = {
        instance: null,
        migrateAndActivate() {
            const snapshot = SYSOS.storage.exportAll();        // from whatever backend is current
            const db = new SqliteBackend();
            db.connect();
            db.initialize();
            // import the live snapshot blobs verbatim (KV parity)
            Object.keys(snapshot.data).forEach(function (k) {
                const v = snapshot.data[k];
                db.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
            });
            SYSOS.storage.registerBackend(db);
            SYSOS.sqlite.instance = db;
            rawSet(ACTIVE_FLAG, 'sqlite');                     // persist choice across restart
            return { migratedKeys: Object.keys(snapshot.data).length, backend: SYSOS.storage.backendName, rows: db.stats().rows };
        },
        /** Boot hook: if SQLite was the active backend last session, re-activate
         *  it (connect to the existing DB blob) BEFORE any store.restore(). */
        activateFromFlag() {
            if (rawGet(ACTIVE_FLAG) !== 'sqlite') return false;
            const db = new SqliteBackend();
            db.connect();
            db.initialize();
            SYSOS.storage.registerBackend(db);
            SYSOS.sqlite.instance = db;
            return true;
        },
        rollbackToLocal() {
            SYSOS.storage.resetBackend();
            try { localStorage.removeItem(ACTIVE_FLAG); } catch (e) { /* no-op */ }
            return SYSOS.storage.backendName;
        },

        /**
         * Migration Engine (Phase 3): measure every store before, migrate the
         * full snapshot into SQLite, restore all stores from the new backend,
         * measure after, and assert parity. Returns a measured before/after
         * report — no data loss is tolerated.
         */
        migrate() {
            function snapshot() {
                const reg = {};
                Object.keys(SYSOS.stores.all).forEach(function (d) { reg[d] = SYSOS.stores.all[d].entries.size; });
                return {
                    registry: reg,
                    registryTotal: Object.values(reg).reduce(function (a, b) { return a + b; }, 0),
                    vaultDocs: SYSOS.vault.documents.size,
                    activity: SYSOS.activity.entries.length,
                    compliance: SYSOS.compliance ? SYSOS.compliance.schedules.size : 0,
                    ocr: SYSOS.ocr ? SYSOS.ocr.jobs.size : 0,
                    operations: SYSOS.opsQueue ? SYSOS.opsQueue.ops.size : 0,
                    integrity: SYSOS.relations.integrity().checked,
                    integrityValid: SYSOS.relations.integrity().valid
                };
            }
            const before = snapshot();
            const result = SYSOS.sqlite.migrateAndActivate();   // copies ALL keys verbatim
            // Re-hydrate every in-memory store from the new (SQLite) backend.
            SYSOS.stores.restore();
            if (SYSOS.vault && SYSOS.vault.restore) SYSOS.vault.restore();
            if (SYSOS.compliance && SYSOS.compliance.restore) SYSOS.compliance.restore();
            if (SYSOS.ocr && SYSOS.ocr.restore) SYSOS.ocr.restore();
            if (SYSOS.opsQueue && SYSOS.opsQueue.restore) SYSOS.opsQueue.restore();
            if (SYSOS.audit && SYSOS.audit.restore) SYSOS.audit.restore();
            const after = snapshot();
            // Data parity: everything except the activity ledger must match exactly.
            // The activity ledger is append-only and legitimately grows by the
            // migration's own log entry, so it is asserted monotonic, not equal.
            function dataOnly(s) { const c = Object.assign({}, s); delete c.activity; return c; }
            const dataParity = JSON.stringify(dataOnly(before)) === JSON.stringify(dataOnly(after));
            const activityMonotonic = after.activity >= before.activity;
            const parity = dataParity && activityMonotonic;
            if (SYSOS.audit) SYSOS.audit.record({ action: 'storage.migrate', domain: 'system', target: 'sqlite(kv)',
                before: before, after: after, source: 'migration-engine', notes: parity ? 'parity OK' : 'PARITY MISMATCH' });
            return { backend: SYSOS.storage.backendName, migratedKeys: result.migratedKeys,
                before: before, after: after, dataParity: dataParity, activityMonotonic: activityMonotonic, parity: parity };
        }
    };
})();
