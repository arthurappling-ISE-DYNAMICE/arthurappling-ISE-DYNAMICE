/**
 * SYS_OS v2.9 — Operations Queue
 *
 * Durable work queue with an explicit state machine:
 *   PENDING -> RUNNING -> COMPLETED
 *                      -> FAILED -> (retry) -> PENDING
 *
 * Every operation carries an executor key resolved through SYSOS.routing
 * (agent routing layer). Persisted to localStorage; every transition is
 * sealed into the activity ledger. Capped, event-emitting ('sysos:ops').
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;

    function cfg() { return SYSOS.CONFIG.OPSQUEUE; }

    const queue = {
        ops: new Map(),

        // ---------- lifecycle ----------

        enqueue(spec) {
            const id = 'OP-' + SYSOS.utils.dateStamp() + '-' + SYSOS.utils.hexToken(4);
            const op = {
                id: id,
                title: spec.title || 'Untitled operation',
                executor: spec.executor || null,     // routing contract key
                agentId: spec.agentId || null,
                payload: spec.payload || {},
                status: 'PENDING',
                attempts: 0,
                maxRetries: spec.maxRetries != null ? spec.maxRetries : cfg().MAX_RETRIES,
                result: null,
                error: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                history: [{ ts: new Date().toISOString(), to: 'PENDING' }]
            };
            this.ops.set(id, op);
            this.cap();
            this.persist();
            SYSOS.activity.log('OPS', 'Enqueued ' + id + ' — ' + op.title);
            this.emit('enqueue', id);
            return op;
        },

        transition(id, to, patch) {
            const op = this.ops.get(id);
            if (!op) return null;
            op.status = to;
            op.updatedAt = new Date().toISOString();
            Object.assign(op, patch || {});
            op.history.push({ ts: op.updatedAt, to: to });
            this.persist();
            this.emit('transition', id);
            return op;
        },

        /**
         * Run a single PENDING/FAILED op through its routed executor.
         * The executor is resolved from SYSOS.routing; absence is a real
         * FAILED outcome (not a crash).
         */
        async run(id) {
            const op = this.ops.get(id);
            if (!op || (op.status !== 'PENDING' && op.status !== 'FAILED')) return op;
            op.attempts++;
            this.transition(id, 'RUNNING');
            SYSOS.activity.log('OPS', 'Running ' + id + ' (attempt ' + op.attempts + ')');

            try {
                const exec = SYSOS.routing ? SYSOS.routing.resolve(op.executor) : null;
                if (!exec) throw new Error('no executor bound: ' + op.executor);
                const result = await exec.invoke(op);
                this.transition(id, 'COMPLETED', { result: result, error: null });
                SYSOS.activity.log('OPS', 'Completed ' + id);
            } catch (e) {
                this.transition(id, 'FAILED', { error: String(e.message || e) });
                SYSOS.activity.log('OPS', 'Failed ' + id + ' — ' + (e.message || e));
            }
            return this.ops.get(id);
        },

        retry(id) {
            const op = this.ops.get(id);
            if (!op || op.status !== 'FAILED') return op;
            if (op.attempts > op.maxRetries) {
                SYSOS.activity.log('OPS', 'Retry refused ' + id + ' — max retries exceeded');
                return op;
            }
            this.transition(id, 'PENDING', { error: null });
            SYSOS.activity.log('OPS', 'Re-queued ' + id + ' for retry');
            return op;
        },

        async runPending() {
            const pending = this.list('PENDING');
            for (let i = 0; i < pending.length; i++) {
                await this.run(pending[i].id);
            }
            return this.stats();
        },

        remove(id) {
            const ok = this.ops.delete(id);
            if (ok) { this.persist(); this.emit('remove', id); }
            return ok;
        },

        // ---------- queries ----------

        get(id) { return this.ops.get(id) || null; },

        list(status) {
            const all = Array.from(this.ops.values())
                .sort(function (a, b) { return b.createdAt.localeCompare(a.createdAt); });
            return status ? all.filter(function (o) { return o.status === status; }) : all;
        },

        stats() {
            const s = { PENDING: 0, RUNNING: 0, COMPLETED: 0, FAILED: 0, total: this.ops.size };
            this.ops.forEach(function (o) { s[o.status] = (s[o.status] || 0) + 1; });
            return s;
        },

        // ---------- persistence ----------

        cap() {
            const max = cfg().CAP;
            if (this.ops.size <= max) return;
            // Drop oldest COMPLETED first, then oldest of anything.
            const sorted = Array.from(this.ops.values())
                .sort(function (a, b) { return a.createdAt.localeCompare(b.createdAt); });
            let over = this.ops.size - max;
            for (let i = 0; i < sorted.length && over > 0; i++) {
                if (sorted[i].status === 'COMPLETED') { this.ops.delete(sorted[i].id); over--; }
            }
            for (let i = 0; i < sorted.length && over > 0; i++) {
                if (this.ops.has(sorted[i].id)) { this.ops.delete(sorted[i].id); over--; }
            }
        },

        persist() {
            try {
                localStorage.setItem(cfg().STORAGE_KEY, JSON.stringify({
                    v: 1, ops: Array.from(this.ops.values())
                }));
            } catch (e) { console.warn('[SYS_OS:ops] persistence unavailable', e); }
        },

        restore() {
            try {
                const raw = localStorage.getItem(cfg().STORAGE_KEY);
                if (!raw) return false;
                this.ops = new Map(JSON.parse(raw).ops.map(function (o) { return [o.id, o]; }));
                // Any op caught mid-flight during a crash returns to PENDING.
                this.ops.forEach(function (o) { if (o.status === 'RUNNING') o.status = 'PENDING'; });
                return this.ops.size > 0;
            } catch (e) { return false; }
        },

        emit(action, id) {
            document.dispatchEvent(new CustomEvent('sysos:ops', { detail: { action: action, id: id } }));
        },

        init() { this.restore(); }
    };

    SYSOS.opsQueue = queue;
})();
