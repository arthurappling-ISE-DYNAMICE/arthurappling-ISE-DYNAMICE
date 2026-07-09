/**
 * SYS_OS — Station Router
 *
 * Replaces v2.6 switchStation() (Audit F-06, F-07, F-13):
 *  - One delegated listener on the nav, zero inline handlers.
 *  - State classes toggled from SYSOS.UI tokens — never rebuilt as strings.
 *  - Active bar is a persistent `.active-bar` element toggled via `hidden`,
 *    not created/destroyed via a width-utility selector.
 *  - register() adds new stations (nav button + panel) at runtime —
 *    the platform's station-expansion contract.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;

    const NAV_BASE = 'w-full flex items-center justify-between p-3.5 rounded-lg border transition-all duration-300';

    const router = {
        stations: new Map(),
        current: null,

        init() {
            document.querySelectorAll('[data-station-panel]').forEach(function (panel) {
                const id = panel.dataset.stationPanel;
                router.stations.set(id, {
                    panel: panel,
                    button: document.querySelector('[data-station-target="' + id + '"]')
                });
            });

            const nav = document.getElementById('sidebar-nav');
            nav.addEventListener('click', function (e) {
                const btn = e.target.closest('[data-station-target]');
                if (btn) router.switch(btn.dataset.stationTarget);
            });

            router.current = 'architect';
        },

        switch(id) {
            const target = router.stations.get(id);
            if (!target) return false;

            // v3.3 LAZY RENDER — render heavy station content only on first activation.
            if (target.render && !target.rendered) {
                target.render(target.panel);
                target.rendered = true;
            }

            router.stations.forEach(function (station, key) {
                const active = key === id;
                station.panel.classList.toggle('hidden', !active);
                const btn = station.button;
                if (!btn) return;
                SYSOS.UI.NAV_ACTIVE.forEach(function (c) { btn.classList.toggle(c, active); });
                SYSOS.UI.NAV_INACTIVE.forEach(function (c) { btn.classList.toggle(c, !active); });
                if (active) btn.setAttribute('aria-current', 'page');
                else btn.removeAttribute('aria-current');
                const bar = btn.querySelector('.active-bar');
                if (bar) bar.classList.toggle('hidden', !active);
            });

            router.current = id;
            document.dispatchEvent(new CustomEvent('sysos:station', { detail: { id: id } }));
            return true;
        },

        /**
         * Register a new station at runtime.
         * def: { id, label, render(panelEl) }
         * Returns the created panel element.
         */
        register(def) {
            if (router.stations.has(def.id)) return router.stations.get(def.id).panel;

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.dataset.stationTarget = def.id;
            btn.className = NAV_BASE + ' ' + SYSOS.UI.NAV_INACTIVE.join(' ');

            const label = SYSOS.utils.el('span', 'text-xs font-mono tracking-wider uppercase', def.label);
            const bar = SYSOS.utils.el('div', 'active-bar hidden w-1 h-5 bg-gold-500 shadow-[0_0_10px_#D4AF37]');
            btn.appendChild(label);
            btn.appendChild(bar);
            document.getElementById('sidebar-nav').appendChild(btn);

            const panel = document.createElement('div');
            panel.id = 'station-' + def.id;
            panel.dataset.stationPanel = def.id;
            panel.className = 'hidden space-y-6 station-view';
            document.getElementById('main-viewport').appendChild(panel);

            // v3.3: defer render() until the station is first activated (lazy).
            // The shell registers at boot; heavy compute waits for the operator.
            router.stations.set(def.id, { panel: panel, button: btn, render: def.render, rendered: false });
            return panel;
        }
    };

    SYSOS.router = router;
})();
