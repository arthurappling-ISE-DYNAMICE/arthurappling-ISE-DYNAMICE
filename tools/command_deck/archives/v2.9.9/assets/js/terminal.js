/**
 * SYS_OS — Agent Terminal Engine
 *
 * One component renders every agent console from SYSOS.PROTOCOLS
 * (Audit F-04, F-05, F-10, F-19, F-20, F-27, F-33):
 *  - CEO/COO markup generated from a single template — zero duplication.
 *  - ALL user input rendered via textContent. The v2.6 innerHTML XSS is closed.
 *  - Rolling log cap (MAX_LOG_ENTRIES) — no unbounded DOM growth.
 *  - role="log" + aria-live so responses are announced.
 *  - <form> submission — Enter key works; EXECUTE is the submit button.
 *
 * Template strings below contain ONLY trusted, frozen config values.
 * Anything originating from the input field goes through el()/textContent.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;
    const el = function () { return SYSOS.utils.el.apply(null, arguments); };

    function shellHTML(p) {
        const presets = p.presets.map(function (preset, i) {
            return '<button type="button" data-preset-index="' + i + '" class="text-left text-[11px] font-mono bg-slate-950/40 border border-white/5 hover:border-gold-500/30 p-3 rounded-lg text-slate-400 hover:text-gold-400 transition-all duration-300">' +
                preset.label.replace('>', '&gt;') + '</button>';
        }).join('');

        return '' +
        '<div class="bg-black/40 border border-gold-500/10 rounded-xl p-6 backdrop-blur-md h-[650px] max-h-[80vh] flex flex-col justify-between">' +
            '<div class="border-b border-gold-500/10 pb-4 mb-4 flex justify-between items-center">' +
                '<div>' +
                    '<h2 class="text-xs font-cyber font-semibold tracking-widest text-gold-400">' + p.title + '</h2>' +
                    '<p class="text-[11px] text-slate-500 font-mono mt-1">' + p.subtitle + '</p>' +
                '</div>' +
                '<span class="text-[9px] font-mono text-gold-400 border border-gold-500/20 px-2 py-1 rounded bg-gold-500/5">' + p.badge + '</span>' +
            '</div>' +
            '<div id="' + p.id + '-terminal-chat" role="log" aria-live="polite" aria-label="' + p.title + ' transcript" class="flex-1 overflow-y-auto space-y-4 p-4 bg-black/60 border border-white/5 rounded-lg font-mono text-xs min-h-[350px]">' +
                '<div class="text-slate-600 text-[10px] tracking-widest border-b border-white/5 pb-2 text-center uppercase">' + p.banner + '</div>' +
            '</div>' +
            '<div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2" data-preset-rail>' + presets + '</div>' +
            '<form class="mt-4 flex space-x-2" data-terminal-form autocomplete="off">' +
                '<input type="text" id="' + p.id + '-custom-payload" aria-label="' + p.title + ' command input" placeholder="' + p.placeholder + '" class="flex-1 bg-black border border-white/10 rounded-lg px-4 py-3.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold-500/40">' +
                '<button type="submit" class="bg-transparent border border-gold-500 text-gold-400 font-mono text-xs px-6 rounded-lg uppercase font-bold tracking-wider hover:bg-gold-500 hover:text-black transition-all duration-300">EXECUTE</button>' +
            '</form>' +
        '</div>';
    }

    function Terminal(protocol) {
        this.p = protocol;
        this.log = null;
    }

    Terminal.prototype.mount = function (panel) {
        const self = this;
        panel.innerHTML = shellHTML(this.p); // trusted frozen config only
        this.log = panel.querySelector('#' + this.p.id + '-terminal-chat');

        this.post('core', this.p.boot);

        panel.querySelector('[data-preset-rail]').addEventListener('click', function (e) {
            const btn = e.target.closest('[data-preset-index]');
            if (btn) self.dispatch(self.p.presets[Number(btn.dataset.presetIndex)].payload, false);
        });

        panel.querySelector('[data-terminal-form]').addEventListener('submit', function (e) {
            e.preventDefault();
            const input = panel.querySelector('#' + self.p.id + '-custom-payload');
            const payload = input.value.trim();
            if (!payload) return;
            input.value = '';
            self.dispatch(payload, true);
        });
    };

    /** Append a transcript entry. Body text is ALWAYS textContent. */
    Terminal.prototype.post = function (role, text, opts) {
        opts = opts || {};
        const isArchitect = role === 'architect';
        const row = el('div', 'flex items-start space-x-2 mt-1 ' +
            (opts.loader ? 'text-slate-600 italic animate-pulse'
                : isArchitect ? 'text-slate-300 mt-2' : 'text-gold-400'));
        if (opts.loader) row.dataset.loader = '1';

        row.appendChild(el('span',
            isArchitect ? 'text-gold-500 font-bold' : 'text-slate-600',
            isArchitect ? '[ARCHITECT]:' : '[' + this.p.id.toUpperCase() + '_CORE]:'));
        row.appendChild(el('p', 'leading-relaxed', text));

        this.log.appendChild(row);
        this.trim();
        this.log.scrollTop = this.log.scrollHeight;
        return row;
    };

    /** Rolling cap — prune oldest entries, always keep the banner (first child). */
    Terminal.prototype.trim = function () {
        const max = SYSOS.CONFIG.TERMINAL.MAX_LOG_ENTRIES;
        while (this.log.children.length > max + 1) {
            this.log.removeChild(this.log.children[1]);
        }
    };

    Terminal.prototype.resolve = function (payload, isCustom) {
        if (isCustom) {
            return 'Custom command registered to runtime memory pool: "' + payload +
                '". Parsing configuration matrices via standard WAT orchestration modules.';
        }
        const hit = this.p.responses.find(function (r) { return payload.indexOf(r.match) !== -1; });
        return hit ? hit.reply : this.p.fallback;
    };

    Terminal.prototype.dispatch = function (payload, isCustom) {
        const self = this;
        const cfg = SYSOS.CONFIG.TERMINAL;
        this.post('architect', payload);

        const loader = isCustom ? null
            : this.post('core', 'Processing algorithmic sequence matrix...', { loader: true });

        setTimeout(function () {
            if (loader) loader.remove();
            self.post('core', self.resolve(payload, isCustom));
        }, isCustom ? cfg.CUSTOM_DELAY_MS : cfg.RESPONSE_DELAY_MS);
    };

    SYSOS.Terminal = Terminal;

    SYSOS.mountTerminals = function () {
        Object.keys(SYSOS.PROTOCOLS).forEach(function (id) {
            const panel = document.querySelector('[data-station-panel="' + id + '"]');
            if (panel) new Terminal(SYSOS.PROTOCOLS[id]).mount(panel);
        });
    };
})();
