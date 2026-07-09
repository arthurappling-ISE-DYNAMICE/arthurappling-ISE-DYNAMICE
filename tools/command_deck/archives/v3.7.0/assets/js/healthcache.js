/**
 * SYS_OS v3.4 — Health Memoization Cache (change-token model)
 *
 * Removes the last measured O(n) ceiling: per-client health results are cached
 * and only recomputed when that client's data changes. Distribution and
 * executive metrics are cached against a version counter that bumps on any
 * health-affecting mutation. Cache hits are O(1); after a single client change
 * only that client recomputes (the rest are cache hits).
 *
 * Invalidation is driven by the existing DataStore mutation events — no new
 * mutation plumbing. Tokens:
 *   globalToken    bumped on broad/unmappable changes (projects, compliance,
 *                  vault, deletes that can't map to a client, batch, demo).
 *   clientToken[id] bumped when that client or its proposals/contracts change.
 *   _version       bumped on ANY invalidation; gates distribution + metrics.
 *
 * Correctness contract: health(id) must equal commercial._computeHealth(id).
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;

    const cache = {
        globalToken: 0,
        clientToken: new Map(),
        health: new Map(),          // clientId -> { token, result }
        distribution: null, distVersion: -1,
        metrics: null, metricsVersion: -1,
        _version: 0,

        clientTok(id) { return this.globalToken + ':' + (this.clientToken.get(id) || 0); },

        bumpClient(id) {
            this.clientToken.set(id, (this.clientToken.get(id) || 0) + 1);
            this._version++; this.distribution = null; this.metrics = null;
        },
        bumpGlobal() {
            this.globalToken++; this.health.clear();
            this._version++; this.distribution = null; this.metrics = null;
        },

        getHealth(id) { const e = this.health.get(id); return (e && e.token === this.clientTok(id)) ? e.result : null; },
        setHealth(id, result) { this.health.set(id, { token: this.clientTok(id), result: result }); },

        getDist() { return (this.distribution && this.distVersion === this._version) ? this.distribution : null; },
        setDist(d) { this.distribution = d; this.distVersion = this._version; },

        getMetrics() { return (this.metrics && this.metricsVersion === this._version) ? this.metrics : null; },
        setMetrics(m) { this.metrics = m; this.metricsVersion = this._version; },

        stats() {
            return { globalToken: this.globalToken, cachedClients: this.health.size,
                version: this._version, distCached: !!this.distribution, metricsCached: !!this.metrics };
        },
        reset() { this.globalToken = 0; this.clientToken.clear(); this.health.clear();
            this.distribution = null; this.metrics = null; this._version = 0; }
    };

    SYSOS.healthCache = cache;

    // ---- invalidation wiring (existing events; no new plumbing) ----
    document.addEventListener('sysos:data', function (e) {
        const d = e.detail;
        if (!d) { cache.bumpGlobal(); return; }
        if (d.domain === 'clients' && d.id) { cache.bumpClient(d.id); return; }
        if ((d.domain === 'proposals' || d.domain === 'contracts') && d.id) {
            const rec = SYSOS.stores.all[d.domain] && SYSOS.stores.all[d.domain].get(d.id);
            if (rec && rec.clientId) cache.bumpClient(rec.clientId);
            else cache.bumpGlobal();   // deleted / unmappable -> full
            return;
        }
        cache.bumpGlobal();            // projects / compliance / batch / demo / etc.
    });
    document.addEventListener('sysos:vault:ingested', function () { cache.bumpGlobal(); });
    document.addEventListener('sysos:commercial', function (e) {
        if (e.detail && e.detail.kind === 'stage' && e.detail.clientId) cache.bumpClient(e.detail.clientId);
    });
    // Open-operations is part of executive.metrics; refresh metrics on ops change.
    document.addEventListener('sysos:ops', function () { cache.metrics = null; });
})();
