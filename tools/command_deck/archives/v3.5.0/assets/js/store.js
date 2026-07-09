/**
 * SYS_OS v2.8 — Operational Data Layer
 *
 * Three primitives that turn the deck into a system of record:
 *
 *  SYSOS.DataStore   Persistent, schema-validated entity collection with full
 *                    CRUD, archive semantics, filtering, search, and mutation
 *                    events ('sysos:data').
 *  SYSOS.activity    Persistent, capped activity ledger ('sysos:activity').
 *  SYSOS.relations   Cross-entity link resolution + referential integrity
 *                    scanning across all registries AND the vault.
 *
 * Persistence: all registry domains share localStorage["sysos.registry.v1"]
 * (key reserved since v2.7). Writes are write-through on every mutation.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;

    // v2.9.5: 'clients' added. v2.9.7: proposals/contracts/compliance promoted to
    // first-class link domains so the relationship + integrity engine resolves
    // every commercial relationship symmetrically. 'documents' is the vault domain.
    const LINK_DOMAINS = ['projects', 'workflows', 'agents', 'documents', 'clients', 'proposals', 'contracts', 'compliance'];

    // ---------------------------------------------------------------- store

    function DataStore(domain, options) {
        this.domain = domain;
        this.label = options.label;
        this.idPrefix = options.idPrefix || domain.slice(0, 3).toUpperCase();
        this.required = options.required || ['name'];
        this.defaults = options.defaults || {};
        this.entries = new Map();
    }

    DataStore.prototype.genId = function () {
        return this.idPrefix + '-' + SYSOS.utils.dateStamp() + '-' + SYSOS.utils.hexToken(4);
    };

    DataStore.prototype.normalizeLinks = function (links) {
        const out = {};
        LINK_DOMAINS.forEach(function (d) {
            out[d] = (links && Array.isArray(links[d])) ? links[d].slice() : [];
        });
        return out;
    };

    DataStore.prototype.validate = function (data) {
        const missing = this.required.filter(function (f) {
            return data[f] === undefined || data[f] === null || data[f] === '';
        });
        if (missing.length) {
            throw new Error('[SYS_OS:' + this.domain + '] missing required: ' + missing.join(', '));
        }
    };

    DataStore.prototype.create = function (data, opts) {
        opts = opts || {};
        SYSOS._enforce(this.domain, 'create');   // v3.2 RBAC
        const merged = Object.assign({}, this.defaults, data);
        this.validate(merged);
        const now = new Date().toISOString();
        const entry = Object.assign(merged, {
            id: data.id || this.genId(),
            domain: this.domain,
            createdAt: data.createdAt || now,
            updatedAt: now,
            archived: !!data.archived,
            links: this.normalizeLinks(data.links)
        });
        this.entries.set(entry.id, entry);
        if (!opts.silent) {
            persistDomain(this.domain);   // v3.2 normalized — only this collection
            SYSOS.activity.log(this.domain.toUpperCase(), 'Created ' + entry.id + ' — ' + entry.name);
            emit(this.domain, 'create', entry.id);
        }
        return entry;
    };

    DataStore.prototype.update = function (id, patch) {
        SYSOS._enforce(this.domain, 'update');   // v3.2 RBAC
        const entry = this.entries.get(id);
        if (!entry) throw new Error('[SYS_OS:' + this.domain + '] unknown id: ' + id);
        if (patch.links) patch.links = this.normalizeLinks(
            Object.assign({}, entry.links, patch.links));
        Object.assign(entry, patch, { id: entry.id, domain: this.domain, updatedAt: new Date().toISOString() });
        persistDomain(this.domain);
        SYSOS.activity.log(this.domain.toUpperCase(), 'Updated ' + entry.id + ' — ' + entry.name);
        emit(this.domain, 'update', id);
        return entry;
    };

    DataStore.prototype.archive = function (id) {
        SYSOS._enforce(this.domain, 'archive');   // v3.2 RBAC
        const entry = this.entries.get(id);
        if (!entry) return null;
        entry.prevStatus = entry.status;
        entry.status = 'ARCHIVED';
        entry.archived = true;
        entry.updatedAt = new Date().toISOString();
        persistDomain(this.domain);
        SYSOS.activity.log(this.domain.toUpperCase(), 'Archived ' + entry.id + ' — ' + entry.name);
        emit(this.domain, 'archive', id);
        return entry;
    };

    DataStore.prototype.remove = function (id) {
        SYSOS._enforce(this.domain, 'remove');   // v3.2 RBAC
        const entry = this.entries.get(id);
        if (!entry) return false;
        this.entries.delete(id);
        persistDomain(this.domain);
        SYSOS.activity.log(this.domain.toUpperCase(), 'Deleted ' + id + ' — ' + entry.name);
        emit(this.domain, 'delete', id);
        return true;
    };

    DataStore.prototype.get = function (id) { return this.entries.get(id) || null; };

    /** list(filter): filter may be a fn, or { status, includeArchived, query } */
    DataStore.prototype.list = function (filter) {
        let all = Array.from(this.entries.values());
        if (typeof filter === 'function') return all.filter(filter);
        filter = filter || {};
        if (!filter.includeArchived && filter.status !== 'ARCHIVED') {
            all = all.filter(function (e) { return !e.archived; });
        }
        if (filter.status) all = all.filter(function (e) { return e.status === filter.status; });
        if (filter.query) {
            const q = String(filter.query).toLowerCase();
            all = all.filter(function (e) {
                return JSON.stringify(e).toLowerCase().indexOf(q) !== -1;
            });
        }
        return all;
    };

    DataStore.prototype.search = function (query) { return this.list({ query: query, includeArchived: true }); };

    DataStore.prototype.statuses = function () {
        const set = new Set();
        this.entries.forEach(function (e) { set.add(e.status); });
        return Array.from(set).sort();
    };

    DataStore.prototype.stats = function () {
        const byStatus = {};
        this.entries.forEach(function (e) {
            byStatus[e.status] = (byStatus[e.status] || 0) + 1;
        });
        return { domain: this.domain, total: this.entries.size, byStatus: byStatus };
    };

    DataStore.prototype.toJSON = function () { return Array.from(this.entries.values()); };

    DataStore.prototype.load = function (rows) {
        const self = this;
        this.entries = new Map();
        (rows || []).forEach(function (r) {
            r.links = self.normalizeLinks(r.links);
            self.entries.set(r.id, r);
        });
    };

    SYSOS.DataStore = DataStore;

    // ----------------------------------------------------- events & persist

    function emit(domain, action, id) {
        if (SYSOS.relations) SYSOS.relations.invalidateIndex();   // v3.3 — links changed
        // v3.2: during a batch, suppress per-record events (and the UI re-renders
        // they trigger). One coalesced event fires at commit. This — not storage —
        // was the dominant bulk cost.
        if (batch.active) { batch.emitted = true; return; }
        document.dispatchEvent(new CustomEvent('sysos:data', { detail: { domain: domain, action: action, id: id } }));
    }

    // v3.2: NORMALIZED PERSISTENCE — each domain persists to its own key, so a
    // single-record write re-serializes only that collection, not all 9. Plus a
    // batch mode that defers all flushes to one commit (kills the bulk O(n²)).
    const MANIFEST_KEY = 'sysos.reg.manifest';
    function regKey(domain) { return 'sysos.reg.' + domain; }
    const batch = { active: false, dirty: null, snapshot: null };

    function writeManifest() {
        SYSOS.storage.set(MANIFEST_KEY, JSON.stringify({
            v: 2, seedVersion: SYSOS.CONFIG.STORE.SEED_VERSION,
            domains: Object.keys(SYSOS.stores.all), savedAt: new Date().toISOString()
        }));
    }
    function writeDomain(domain) {
        SYSOS.storage.set(regKey(domain), JSON.stringify({ v: 2, rows: SYSOS.stores.all[domain].toJSON() }));
    }

    /** Persist ONE domain (the per-mutation hot path). Batch-aware + demo-aware. */
    function persistDomain(domain) {
        if (!SYSOS.stores || SYSOS.stores._suspendPersist) return;
        if (batch.active) { batch.dirty.add(domain); return; }   // defer to commit
        try { writeDomain(domain); writeManifest(); }
        catch (e) { console.warn('[SYS_OS:store] persist domain failed', e); }
    }

    /** Persist every domain (full save — used by seed and full restores). */
    function persistAll() {
        if (!SYSOS.stores || SYSOS.stores._suspendPersist) return;
        if (batch.active) { Object.keys(SYSOS.stores.all).forEach(function (d) { batch.dirty.add(d); }); return; }
        try {
            Object.keys(SYSOS.stores.all).forEach(writeDomain);
            writeManifest();
        } catch (e) { console.warn('[SYS_OS:store] persistence unavailable', e); }
    }

    // v3.2: RBAC enforcement at the write path. Unmapped domains stay unrestricted;
    // denials throw + are audited as permission_denied.
    const PERM_DOMAIN = { clients: 'client', proposals: 'proposal', contracts: 'contract' };
    const PERM_OP = { create: 'create', update: 'update', archive: 'update', remove: 'delete' };
    function enforce(domain, method) {
        if (!SYSOS.auth) return;
        const pd = PERM_DOMAIN[domain]; if (!pd) return;
        const op = PERM_OP[method]; if (!op) return;
        const perm = pd + '.' + op;
        if (!SYSOS.auth.can(perm)) {
            if (SYSOS.audit) SYSOS.audit.record({ action: 'permission_denied', domain: domain, target: perm,
                source: 'rbac', reason: 'role ' + SYSOS.auth.current.role + ' lacks ' + perm,
                notes: SYSOS.auth.current.name + ' denied ' + perm });
            throw new Error('permission denied: ' + perm);
        }
    }
    SYSOS._enforce = enforce;   // exposed for the DataStore methods below

    // ------------------------------------------------------------- activity

    SYSOS.activity = {
        entries: [],

        _dirty: false,
        log(type, message) {
            this.entries.push({ ts: new Date().toISOString(), type: type, message: message });
            const cap = SYSOS.CONFIG.STORE.ACTIVITY_CAP;
            if (this.entries.length > cap) this.entries = this.entries.slice(-cap);
            // v3.2: defer writes during demo (isolation) and batch (single flush at commit).
            if (SYSOS.stores && SYSOS.stores._suspendPersist) { /* demo: no write */ }
            else if (batch.active) { this._dirty = true; }
            else this._flush();
            if (!batch.active) document.dispatchEvent(new CustomEvent('sysos:activity'));
        },
        _flush() {
            try { SYSOS.storage.set(SYSOS.CONFIG.STORE.ACTIVITY_KEY, JSON.stringify({ v: 1, entries: this.entries })); this._dirty = false; }
            catch (e) { /* in-memory only */ }
        },
        flush() { if (this._dirty) this._flush(); },

        recent(n) { return this.entries.slice(-(n || 8)).reverse(); },

        restore() {
            try {
                const raw = SYSOS.storage.get(SYSOS.CONFIG.STORE.ACTIVITY_KEY);
                if (raw) this.entries = (JSON.parse(raw).entries || []);
            } catch (e) { this.entries = []; }
        }
    };

    // ------------------------------------------------------------ relations

    SYSOS.relations = {
        /** The authoritative link-domain list (read-only for consumers). */
        domains: LINK_DOMAINS,

        // ---------- v3.3 backlink index (O(1) reverse lookups) ----------
        _idx: null,

        /** Build the reverse-link index in one pass: targetId -> [referrers]. */
        buildIndex() {
            const idx = new Map();
            function add(targetId, ref) {
                if (!idx.has(targetId)) idx.set(targetId, []);
                idx.get(targetId).push(ref);
            }
            Object.keys(SYSOS.stores.all).forEach(function (domain) {
                SYSOS.stores.all[domain].entries.forEach(function (e) {
                    LINK_DOMAINS.forEach(function (d) {
                        ((e.links && e.links[d]) || []).forEach(function (lid) {
                            add(lid, { id: e.id, name: e.name, domain: domain });
                        });
                    });
                });
            });
            if (SYSOS.vault) SYSOS.vault.documents.forEach(function (doc) {
                LINK_DOMAINS.forEach(function (d) {
                    ((doc.links && doc.links[d]) || []).forEach(function (lid) {
                        add(lid, { id: doc.id, name: doc.path, domain: 'documents' });
                    });
                });
            });
            this._idx = idx;
            return idx;
        },
        /** Lazily build + return the index. */
        index() { return this._idx || this.buildIndex(); },
        /** Drop the index — next access rebuilds. Called on any mutation. */
        invalidateIndex() { this._idx = null; },

        /** O(1) reverse lookup using the index (mirrors backlinks()). */
        backlinksFast(id) { return (this.index().get(id) || []).slice(); },

        /** Forward + reverse counts using the index for the reverse side. */
        linkStatsFast(domain, id) {
            const resolved = this.resolve(domain, id);
            let forward = 0;
            if (resolved) LINK_DOMAINS.forEach(function (d) { forward += (resolved.links[d] ? resolved.links[d].length : 0); });
            const reverse = this.backlinksFast(id).length;
            return { forward: forward, reverse: reverse, total: forward + reverse };
        },

        /**
         * Forward + reverse link counts for an entity, across ALL link domains
         * (projects/workflows/agents/vault/clients/proposals/contracts/compliance).
         * This is the measured basis for the D-1 linkedEntities metric.
         */
        linkStats(domain, id) {
            const resolved = this.resolve(domain, id);
            let forward = 0;
            if (resolved) {
                LINK_DOMAINS.forEach(function (d) {
                    forward += (resolved.links[d] ? resolved.links[d].length : 0);
                });
            }
            const reverse = this.backlinks(id).length;
            return { forward: forward, reverse: reverse, total: forward + reverse };
        },

        /** Resolve an id to {domain, entity} across registries + vault. */
        find(id) {
            if (SYSOS.vault && SYSOS.vault.documents.has(id)) {
                return { domain: 'documents', entity: SYSOS.vault.documents.get(id) };
            }
            const all = SYSOS.stores ? SYSOS.stores.all : {};
            const domains = Object.keys(all);
            for (let i = 0; i < domains.length; i++) {
                const hit = all[domains[i]].entries.get(id);
                if (hit) return { domain: domains[i], entity: hit };
            }
            return null;
        },

        /** Entity + every linked entity resolved to {id, name, domain, status, missing}. */
        resolve(domain, id) {
            const entity = domain === 'documents'
                ? (SYSOS.vault.documents.get(id) || null)
                : (SYSOS.stores.all[domain] ? SYSOS.stores.all[domain].get(id) : null);
            if (!entity) return null;
            const resolved = {};
            LINK_DOMAINS.forEach(function (d) {
                resolved[d] = ((entity.links && entity.links[d]) || []).map(function (lid) {
                    const hit = SYSOS.relations.find(lid);
                    return hit
                        ? { id: lid, domain: hit.domain, name: hit.entity.name || hit.entity.path, status: hit.entity.status, missing: false }
                        : { id: lid, domain: d, name: lid, status: 'MISSING', missing: true };
                });
            });
            return { entity: entity, links: resolved };
        },

        /** Reverse lookup: every entity (registries + vault docs) linking to id. */
        backlinks(id) {
            const out = [];
            Object.keys(SYSOS.stores.all).forEach(function (domain) {
                SYSOS.stores.all[domain].entries.forEach(function (e) {
                    LINK_DOMAINS.forEach(function (d) {
                        if (e.links && e.links[d] && e.links[d].indexOf(id) !== -1) {
                            out.push({ id: e.id, name: e.name, domain: domain });
                        }
                    });
                });
            });
            SYSOS.vault.documents.forEach(function (doc) {
                LINK_DOMAINS.forEach(function (d) {
                    if (doc.links && doc.links[d] && doc.links[d].indexOf(id) !== -1) {
                        out.push({ id: doc.id, name: doc.path, domain: 'documents' });
                    }
                });
            });
            return out;
        },

        /** Full referential-integrity scan. Returns measured counts, never assumptions. */
        integrity() {
            let checked = 0;
            const broken = [];
            function scan(ownerId, ownerDomain, links) {
                LINK_DOMAINS.forEach(function (d) {
                    ((links && links[d]) || []).forEach(function (lid) {
                        checked++;
                        if (!SYSOS.relations.find(lid)) {
                            broken.push({ from: ownerDomain + ':' + ownerId, field: d, missing: lid });
                        }
                    });
                });
            }
            Object.keys(SYSOS.stores.all).forEach(function (domain) {
                SYSOS.stores.all[domain].entries.forEach(function (e) { scan(e.id, domain, e.links); });
            });
            SYSOS.vault.documents.forEach(function (doc) { scan(doc.id, 'documents', doc.links); });
            return { checked: checked, broken: broken, valid: broken.length === 0 };
        }
    };

    // ----------------------------------------------------- store collection

    SYSOS.stores = {
        all: {},

        define(domain, options) {
            this.all[domain] = new DataStore(domain, options);
            return this.all[domain];
        },

        restore() {
            try {
                const self = this;
                // v3.2: prefer normalized per-domain keys via the manifest.
                const manifest = SYSOS.storage.getJSON(MANIFEST_KEY);
                if (manifest) {
                    if (manifest.seedVersion !== SYSOS.CONFIG.STORE.SEED_VERSION) return false;
                    Object.keys(this.all).forEach(function (d) {
                        const blob = SYSOS.storage.getJSON(regKey(d));
                        self.all[d].load(blob ? blob.rows : []);
                    });
                    return Object.keys(this.all).some(function (d) { return self.all[d].entries.size > 0; });
                }
                // Legacy fallback: the pre-v3.2 monolithic blob. Load + migrate forward.
                const raw = SYSOS.storage.get(SYSOS.CONFIG.STORE.STORAGE_KEY);
                if (!raw) return false;
                const data = JSON.parse(raw);
                if (data.seedVersion !== SYSOS.CONFIG.STORE.SEED_VERSION) return false;
                Object.keys(this.all).forEach(function (d) { self.all[d].load(data.domains[d]); });
                persistAll();   // re-persist in normalized format
                return Object.keys(this.all).some(function (d) { return self.all[d].entries.size > 0; });
            } catch (e) {
                console.warn('[SYS_OS:store] restore failed — reseeding', e);
                return false;
            }
        },

        persist: persistAll,
        persistDomain: persistDomain,

        // v3.2 Transaction Batching — defer all flushes to a single commit.
        beginBatch() {
            if (batch.active) return false;
            batch.active = true;
            batch.dirty = new Set();
            const snap = {};
            Object.keys(this.all).forEach(function (d) { snap[d] = SYSOS.stores.all[d].toJSON(); });
            batch.snapshot = snap;
            if (SYSOS.audit) SYSOS.audit.record({ action: 'batch_begin', domain: 'system', source: 'store', notes: 'batch opened' });
            return true;
        },
        commitBatch() {
            if (!batch.active) return false;
            batch.active = false;
            const dirty = Array.from(batch.dirty);
            try {
                dirty.forEach(writeDomain);
                if (dirty.length) writeManifest();
            } catch (e) { console.warn('[SYS_OS:store] batch commit failed', e); }
            if (SYSOS.activity && SYSOS.activity.flush) SYSOS.activity.flush();   // single activity flush
            if (SYSOS.audit && SYSOS.audit.flush) SYSOS.audit.flush();            // single audit flush
            const hadEvents = batch.emitted;
            batch.dirty = null; batch.snapshot = null; batch.emitted = false;
            if (SYSOS.audit) SYSOS.audit.record({ action: 'batch_commit', domain: 'system', source: 'store',
                notes: dirty.length + ' domains flushed' });
            // One coalesced refresh for all stations (instead of N per-record events).
            if (hadEvents) {
                document.dispatchEvent(new CustomEvent('sysos:data', { detail: { domain: 'batch', action: 'commit', id: null } }));
                document.dispatchEvent(new CustomEvent('sysos:activity'));
            }
            return { committed: true, domainsFlushed: dirty.length };
        },
        rollbackBatch() {
            if (!batch.active) return false;
            batch.active = false;
            const self = this;
            Object.keys(batch.snapshot).forEach(function (d) { self.all[d].load(batch.snapshot[d]); });
            batch.dirty = null; batch.snapshot = null;
            if (SYSOS.audit) SYSOS.audit.record({ action: 'batch_rollback', domain: 'system', source: 'store', notes: 'in-memory restored' });
            return { rolledBack: true };
        },
        inBatch() { return batch.active; },

        totals() {
            const out = {};
            const self = this;
            Object.keys(this.all).forEach(function (d) { out[d] = self.all[d].entries.size; });
            return out;
        }
    };
})();
