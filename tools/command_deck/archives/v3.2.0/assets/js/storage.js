/**
 * SYS_OS v3.0 — Storage Adapter Layer
 *
 * A single read/write/query seam between business logic and the physical
 * store. Today the backend is localStorage (identical keys + JSON to v2.9.9,
 * so 100% backward compatible). A SQLite (or remote) backend can be swapped in
 * via registerBackend() with NO change to any consuming module — that is the
 * whole point of this layer and the precondition for the SQLite migration
 * designed in docs/v3.0/SQLITE_MIGRATION_DESIGN.md.
 *
 * Backend contract (registerBackend(impl)):
 *   impl.name           string
 *   impl.getItem(key)   -> string | null
 *   impl.setItem(key,v) -> void   (v is a string)
 *   impl.removeItem(key)-> void
 *   impl.keys()         -> string[]   (all keys this backend holds)
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;
    const PREFIX = 'sysos';

    // Default backend — localStorage, defensively wrapped.
    const localBackend = {
        name: 'localStorage',
        getItem: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        setItem: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* quota/unavailable */ } },
        removeItem: function (k) { try { localStorage.removeItem(k); } catch (e) { /* no-op */ } },
        keys: function () {
            try { return Object.keys(localStorage); } catch (e) { return []; }
        }
    };

    let backend = localBackend;

    const storage = {
        get backendName() { return backend.name; },

        // ---- key/value abstraction ----
        get(key) { return backend.getItem(key); },
        set(key, value) { backend.setItem(key, value); return true; },
        remove(key) { backend.removeItem(key); },

        getJSON(key) {
            const raw = backend.getItem(key);
            if (!raw) return null;
            try { return JSON.parse(raw); } catch (e) { return null; }
        },
        setJSON(key, obj) { storage.set(key, JSON.stringify(obj)); return true; },

        // ---- query abstraction ----
        /** All SYS_OS keys (optionally filtered by prefix). */
        keys(prefix) {
            return backend.keys().filter(function (k) {
                return k.indexOf(PREFIX) === 0 && (!prefix || k.indexOf(prefix) === 0);
            });
        },
        /** Return [{key, value}] of parsed JSON for keys under a prefix. */
        query(prefix) {
            return storage.keys(prefix).map(function (k) { return { key: k, value: storage.getJSON(k) }; });
        },

        // ---- transactions ----
        /**
         * Atomic multi-op. If the backend supports transactions (SQLite), use it.
         * Otherwise emulate over localStorage: snapshot affected SYS_OS keys,
         * run fn, restore the snapshot on throw. Returns {committed, ...}.
         */
        transaction(fn) {
            if (typeof backend.transaction === 'function') return backend.transaction(fn);
            // localStorage emulation
            const snap = {};
            storage.keys().forEach(function (k) { snap[k] = backend.getItem(k); });
            try {
                const result = fn(storage);
                return { committed: true, result: result, backend: backend.name };
            } catch (e) {
                Object.keys(snap).forEach(function (k) { if (snap[k] === null) backend.removeItem(k); else backend.setItem(k, snap[k]); });
                // remove any keys created during the failed txn
                storage.keys().forEach(function (k) { if (!(k in snap)) backend.removeItem(k); });
                return { committed: false, error: String(e.message || e), backend: backend.name };
            }
        },

        // ---- backend management ----
        registerBackend(impl) {
            if (!impl || typeof impl.getItem !== 'function' || typeof impl.setItem !== 'function') {
                throw new Error('[SYS_OS:storage] invalid backend contract');
            }
            backend = impl;
            if (SYSOS.activity) SYSOS.activity.log('STORAGE', 'Backend switched -> ' + impl.name);
            return impl.name;
        },
        resetBackend() { backend = localBackend; return localBackend.name; },

        /** Snapshot of all SYS_OS state (migration/export primitive). */
        exportAll() {
            const out = {};
            storage.keys().forEach(function (k) { out[k] = storage.getJSON(k) || storage.get(k); });
            return { backend: backend.name, exportedAt: new Date().toISOString(), data: out };
        }
    };

    SYSOS.storage = storage;
})();
