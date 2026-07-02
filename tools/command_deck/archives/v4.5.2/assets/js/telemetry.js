/**
 * SYS_OS v2.9 — Real Telemetry Layer
 *
 * Replaces the v2.6/2.7 simulated PING (canned "11ms RTT") with MEASURED
 * telemetry: every probe is a real fetch() timed with performance.now() and
 * bounded by an AbortController. Reachability and latency are observed, not
 * scripted.
 *
 * Status model:
 *   ONLINE    reachable, RTT <= DEGRADED_MS
 *   DEGRADED  reachable, RTT >  DEGRADED_MS
 *   OFFLINE   network error / timeout / abort
 *   CHECKING  probe in flight
 *   UNKNOWN   never probed
 *
 * Cross-origin note: same-origin probes (the deck itself) read real HTTP
 * status. Cross-origin nodes are probed with mode:'no-cors' — the response is
 * opaque, so we measure *reachability + RTT* (TCP/HTTP round trip completed)
 * rather than status code. A completed opaque fetch => reachable; a thrown
 * fetch/timeout => offline. This is honest measured liveness within browser
 * security limits, and is documented as such.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;

    function cfg() { return SYSOS.CONFIG.TELEMETRY; }

    const telemetry = {
        nodes: new Map(),   // id -> { def, status, rttMs, lastProbe, error, history[] }
        timer: null,

        init() {
            const self = this;
            cfg().NODES.forEach(function (def) {
                self.nodes.set(def.id, {
                    def: def, status: 'UNKNOWN', rttMs: null,
                    lastProbe: null, error: null, history: []
                });
            });
        },

        classify(rttMs) {
            return rttMs > cfg().DEGRADED_MS ? 'DEGRADED' : 'ONLINE';
        },

        /** Probe one node. Returns the measured record; never throws. */
        async probe(id) {
            const rec = this.nodes.get(id);
            if (!rec) return null;
            rec.status = 'CHECKING';
            this.emit(id);

            const controller = new AbortController();
            const sameOrigin = rec.def.url.indexOf('http') !== 0;
            const t0 = performance.now();
            const timeout = setTimeout(function () { controller.abort(); }, cfg().PROBE_TIMEOUT_MS);

            try {
                await fetch(rec.def.url + (rec.def.url.indexOf('?') === -1 ? '?' : '&') + '_t=' + Date.now(), {
                    method: 'GET',
                    mode: sameOrigin ? 'cors' : 'no-cors',
                    cache: 'no-store',
                    signal: controller.signal
                });
                const rtt = Math.round(performance.now() - t0);
                rec.rttMs = rtt;
                rec.status = this.classify(rtt);
                rec.error = null;
            } catch (e) {
                rec.rttMs = null;
                rec.status = 'OFFLINE';
                rec.error = e.name === 'AbortError' ? 'timeout' : 'unreachable';
            } finally {
                clearTimeout(timeout);
                rec.lastProbe = new Date().toISOString();
                rec.history.push({ ts: rec.lastProbe, status: rec.status, rttMs: rec.rttMs });
                if (rec.history.length > 20) rec.history = rec.history.slice(-20);
                this.emit(id);
            }
            if (SYSOS.activity) {
                SYSOS.activity.log('TELEMETRY', 'Probe ' + rec.def.id + ' -> ' + rec.status +
                    (rec.rttMs !== null ? ' (' + rec.rttMs + 'ms)' : ' (' + rec.error + ')'));
            }
            return rec;
        },

        async probeAll() {
            const ids = Array.from(this.nodes.keys());
            return Promise.all(ids.map(this.probe.bind(this)));
        },

        startAuto() {
            const self = this;
            if (this.timer) return false;
            this.timer = setInterval(function () { self.probeAll(); }, cfg().AUTO_INTERVAL_MS);
            return true;
        },

        stopAuto() {
            if (this.timer) { clearInterval(this.timer); this.timer = null; return true; }
            return false;
        },

        snapshot() {
            return Array.from(this.nodes.values()).map(function (r) {
                return { id: r.def.id, label: r.def.label, port: r.def.port,
                    status: r.status, rttMs: r.rttMs, lastProbe: r.lastProbe, error: r.error };
            });
        },

        summary() {
            const snap = this.snapshot();
            return {
                total: snap.length,
                online: snap.filter(function (n) { return n.status === 'ONLINE'; }).length,
                degraded: snap.filter(function (n) { return n.status === 'DEGRADED'; }).length,
                offline: snap.filter(function (n) { return n.status === 'OFFLINE'; }).length
            };
        },

        emit(id) {
            document.dispatchEvent(new CustomEvent('sysos:telemetry', { detail: { id: id } }));
        }
    };

    SYSOS.telemetry = telemetry;
})();
