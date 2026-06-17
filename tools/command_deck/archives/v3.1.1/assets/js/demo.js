/**
 * SYS_OS v2.9.9 — Demonstration Mode
 *
 * Toggles the registry/commercial data layer between LIVE (actual persisted
 * records) and DEMO (seeded demonstration data, in-memory only). Isolation is
 * guaranteed by suspending registry persistence while in DEMO: no create/
 * update/delete reaches localStorage, and exiting reloads live data straight
 * from localStorage (which was never touched).
 *
 * Scope: registry domains (clients/proposals/contracts/projects/etc.) — the
 * commercial/executive concern. Vault/ops/compliance stores are not mutated by
 * demo views (read-only), so they need no swap.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;

    const REG = ['projects', 'workflows', 'agents', 'sops', 'intelligence', 'compliance', 'clients', 'proposals', 'contracts'];

    function buildDemoData() {
        const soon = function (d) { return new Date(Date.now() + d * 86400000).toISOString().slice(0, 10); };
        return {
            clients: [
                { id: 'demo_acme', name: 'DEMO — Acme Robotics', segment: 'MANUFACTURING', tier: 'ELITE', status: 'ACTIVE', stage: 'ACTIVE', value: 48000, contact: 'Jane Roe', links: { projects: ['demo_proj_a'] }, stageHistory: [] },
                { id: 'demo_globex', name: 'DEMO — Globex Logistics', segment: 'LOGISTICS', tier: 'STANDARD', status: 'PROSPECT', stage: 'NEGOTIATION', value: 22000, contact: 'John Doe', links: {}, stageHistory: [] },
                { id: 'demo_initech', name: 'DEMO — Initech Systems', segment: 'SOFTWARE', tier: 'ELITE', status: 'PROSPECT', stage: 'PROPOSAL', value: 65000, contact: 'Bill L.', links: {}, stageHistory: [] }
            ],
            proposals: [
                { id: 'DEMO-PRO-1', clientId: 'demo_acme', title: 'DEMO — Fleet automation rollout', amount: 48000, status: 'ACCEPTED', owner: 'Demo Operator', expirationDate: soon(30), links: { clients: ['demo_acme'] } },
                { id: 'DEMO-PRO-2', clientId: 'demo_globex', title: 'DEMO — Routing optimization', amount: 22000, status: 'SENT', owner: 'Demo Operator', expirationDate: soon(8), links: { clients: ['demo_globex'] } },
                { id: 'DEMO-PRO-3', clientId: 'demo_initech', title: 'DEMO — Platform integration', amount: 65000, status: 'REVIEW', owner: 'Demo Operator', expirationDate: soon(20), links: { clients: ['demo_initech'] } }
            ],
            contracts: [
                { id: 'DEMO-CON-1', clientId: 'demo_acme', proposalId: 'DEMO-PRO-1', title: 'DEMO — Acme MSA', status: 'ACTIVE', value: 48000, owner: 'Demo Operator', renewalDate: soon(5), links: { clients: ['demo_acme'], proposals: ['DEMO-PRO-1'] } }
            ],
            projects: [
                { id: 'demo_proj_a', name: 'DEMO — Acme Deployment', category: 'Deployment', status: 'ACTIVE', priority: 'P1', owner: 'Demo Operator', links: {} }
            ]
        };
    }

    const demo = {
        active: false,

        status() { return demo.active ? 'DEMO' : 'LIVE'; },

        enter() {
            if (demo.active) return demo.status();
            // Single global flag now guards EVERY store's persist() (registry,
            // activity, vault, compliance, ocr, opsqueue) — full sandbox.
            SYSOS.stores._suspendPersist = true;
            demo.active = true;
            const data = buildDemoData();
            REG.forEach(function (dom) { SYSOS.stores.all[dom].load(data[dom] || []); });
            // Isolate the activity timeline: stash live entries, seed a demo marker.
            demo._activityStash = SYSOS.activity.entries.slice();
            SYSOS.activity.entries = [{ ts: new Date().toISOString(), type: 'DEMO', message: 'Demonstration sandbox active — live data isolated' }];
            document.dispatchEvent(new CustomEvent('sysos:data', { detail: { domain: 'clients', action: 'demo', id: null } }));
            document.dispatchEvent(new CustomEvent('sysos:demo', { detail: { mode: 'DEMO' } }));
            return 'DEMO';
        },

        exit() {
            if (!demo.active) return demo.status();
            // Restore EVERY in-memory store from persistent storage (untouched
            // during demo), then re-enable persistence.
            SYSOS.stores.restore();
            if (SYSOS.vault && SYSOS.vault.restore) SYSOS.vault.restore();
            if (SYSOS.compliance && SYSOS.compliance.restore) SYSOS.compliance.restore();
            if (SYSOS.ocr && SYSOS.ocr.restore) SYSOS.ocr.restore();
            if (SYSOS.opsQueue && SYSOS.opsQueue.restore) SYSOS.opsQueue.restore();
            SYSOS.activity.entries = demo._activityStash || [];
            demo._activityStash = null;
            SYSOS.stores._suspendPersist = false;
            demo.active = false;
            document.dispatchEvent(new CustomEvent('sysos:data', { detail: { domain: 'clients', action: 'live', id: null } }));
            document.dispatchEvent(new CustomEvent('sysos:demo', { detail: { mode: 'LIVE' } }));
            return 'LIVE';
        },

        toggle() { return demo.active ? demo.exit() : demo.enter(); }
    };

    SYSOS.demo = demo;
})();
