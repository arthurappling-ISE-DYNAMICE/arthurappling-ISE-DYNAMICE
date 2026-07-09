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

    // v2.9.5: 'clients' added so the relationship + integrity engine resolves
    // Client<->Project and Client<->Vault links with no per-call special-casing.
    const LINK_DOMAINS = ['projects', 'workflows', 'agents', 'documents', 'clients'];

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
            persistAll();
            SYSOS.activity.log(this.domain.toUpperCase(), 'Created ' + entry.id + ' — ' + entry.name);
            emit(this.domain, 'create', entry.id);
        }
        return entry;
    };

    DataStore.prototype.update = function (id, patch) {
        const entry = this.entries.get(id);
        if (!entry) throw new Error('[SYS_OS:' + this.domain + '] unknown id: ' + id);
        if (patch.links) patch.links = this.normalizeLinks(
            Object.assign({}, entry.links, patch.links));
        Object.assign(entry, patch, { id: entry.id, domain: this.domain, updatedAt: new Date().toISOString() });
        persistAll();
        SYSOS.activity.log(this.domain.toUpperCase(), 'Updated ' + entry.id + ' — ' + entry.name);
        emit(this.domain, 'update', id);
        return entry;
    };

    DataStore.prototype.archive = function (id) {
        const entry = this.entries.get(id);
        if (!entry) return null;
        entry.prevStatus = entry.status;
        entry.status = 'ARCHIVED';
        entry.archived = true;
        entry.updatedAt = new Date().toISOString();
        persistAll();
        SYSOS.activity.log(this.domain.toUpperCase(), 'Archived ' + entry.id + ' — ' + entry.name);
        emit(this.domain, 'archive', id);
        return entry;
    };

    DataStore.prototype.remove = function (id) {
        const entry = this.entries.get(id);
        if (!entry) return false;
        this.entries.delete(id);
        persistAll();
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
        document.dispatchEvent(new CustomEvent('sysos:data', { detail: { domain: domain, action: action, id: id } }));
    }

    function persistAll() {
        if (!SYSOS.stores) return;
        try {
            const domains = {};
            Object.keys(SYSOS.stores.all).forEach(function (d) {
                domains[d] = SYSOS.stores.all[d].toJSON();
            });
            localStorage.setItem(SYSOS.CONFIG.STORE.STORAGE_KEY, JSON.stringify({
                v: 1,
                seedVersion: SYSOS.CONFIG.STORE.SEED_VERSION,
                savedAt: new Date().toISOString(),
                domains: domains
            }));
        } catch (e) {
            console.warn('[SYS_OS:store] persistence unavailable', e);
        }
    }

    // ------------------------------------------------------------- activity

    SYSOS.activity = {
        entries: [],

        log(type, message) {
            this.entries.push({ ts: new Date().toISOString(), type: type, message: message });
            const cap = SYSOS.CONFIG.STORE.ACTIVITY_CAP;
            if (this.entries.length > cap) this.entries = this.entries.slice(-cap);
            try {
                localStorage.setItem(SYSOS.CONFIG.STORE.ACTIVITY_KEY,
                    JSON.stringify({ v: 1, entries: this.entries }));
            } catch (e) { /* in-memory only */ }
            document.dispatchEvent(new CustomEvent('sysos:activity'));
        },

        recent(n) { return this.entries.slice(-(n || 8)).reverse(); },

        restore() {
            try {
                const raw = localStorage.getItem(SYSOS.CONFIG.STORE.ACTIVITY_KEY);
                if (raw) this.entries = (JSON.parse(raw).entries || []);
            } catch (e) { this.entries = []; }
        }
    };

    // ------------------------------------------------------------ relations

    SYSOS.relations = {
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
                const raw = localStorage.getItem(SYSOS.CONFIG.STORE.STORAGE_KEY);
                if (!raw) return false;
                const data = JSON.parse(raw);
                if (data.seedVersion !== SYSOS.CONFIG.STORE.SEED_VERSION) return false; // reseed on schema change
                const self = this;
                Object.keys(this.all).forEach(function (d) {
                    self.all[d].load(data.domains[d]);
                });
                return Object.keys(this.all).some(function (d) {
                    return self.all[d].entries.size > 0;
                });
            } catch (e) {
                console.warn('[SYS_OS:store] restore failed — reseeding', e);
                return false;
            }
        },

        persist: persistAll,

        totals() {
            const out = {};
            const self = this;
            Object.keys(this.all).forEach(function (d) { out[d] = self.all[d].entries.size; });
            return out;
        }
    };
})();
