/**
 * SYS_OS v2.9 — Agent Routing Layer
 *
 * Bridges the (preserved) v2.8 Agent Registry to executable behavior. Each
 * agent definition is projected into a ROUTING CONTRACT: a stable executor
 * key + an invoke() the Operations Queue can call. The registry is the source
 * of truth — routing reads it, never mutates its schema.
 *
 * v2.9 ships local, deterministic executors (the "actionable execution
 * contract" layer). v3.0 swaps invoke() bodies for live agent endpoints with
 * no change to the queue or registry — that is the whole point of the split.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;

    const contracts = new Map();   // executorKey -> { agentId, capability, invoke }

    /**
     * Default executor: records a routed dispatch as a measured, auditable
     * outcome. Deterministic and side-effect-safe — real work attaches here.
     */
    function defaultInvoke(agentId, capability) {
        return function (op) {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve({
                        routedTo: agentId,
                        capability: capability,
                        acceptedAt: new Date().toISOString(),
                        note: 'Routed via v2.9 local executor. Endpoint binding deferred to v3.0.',
                        echo: op.payload || {}
                    });
                }, SYSOS.CONFIG.OPSQUEUE.RUN_LATENCY_MS);
            });
        };
    }

    const routing = {
        /** Build a contract for every agent in the registry. */
        buildFromRegistry() {
            contracts.clear();
            const agents = SYSOS.stores.all.agents;
            if (!agents) return 0;
            agents.entries.forEach(function (agent) {
                const key = 'agent:' + agent.id;
                contracts.set(key, {
                    executorKey: key,
                    agentId: agent.id,
                    name: agent.name,
                    role: agent.role,
                    status: agent.status,                 // ACTIVE | PROVISIONED
                    executable: agent.status === 'ACTIVE', // PROVISIONED = defined, not yet live
                    workflows: (agent.links && agent.links.workflows) || [],
                    invoke: defaultInvoke(agent.id, agent.role)
                });
            });
            return contracts.size;
        },

        /** Override an executor (the v3.0 / OCR / live-endpoint attachment point). */
        bind(executorKey, invokeFn) {
            const c = contracts.get(executorKey);
            if (!c) return false;
            c.invoke = invokeFn;
            c.executable = true;
            c.bound = true;
            return true;
        },

        resolve(executorKey) { return contracts.get(executorKey) || null; },

        list() { return Array.from(contracts.values()); },

        /** Convenience: enqueue an operation routed to an agent. */
        dispatch(agentId, title, payload) {
            const key = 'agent:' + agentId;
            const contract = contracts.get(key);
            if (!contract) throw new Error('no routing contract for agent: ' + agentId);
            if (!contract.executable) {
                SYSOS.activity.log('ROUTING', 'Dispatch to PROVISIONED agent ' + agentId +
                    ' queued (not yet executable)');
            }
            return SYSOS.opsQueue.enqueue({
                title: title || ('Dispatch to ' + contract.name),
                executor: key,
                agentId: agentId,
                payload: payload || {}
            });
        },

        stats() {
            const all = this.list();
            return {
                contracts: all.length,
                executable: all.filter(function (c) { return c.executable; }).length,
                provisioned: all.filter(function (c) { return !c.executable; }).length
            };
        },

        init() {
            this.buildFromRegistry();
            // Rebuild when the agent registry changes (preserves registry as truth).
            document.addEventListener('sysos:data', function (e) {
                if (e.detail && e.detail.domain === 'agents') routing.buildFromRegistry();
            });
        }
    };

    SYSOS.routing = routing;
})();
