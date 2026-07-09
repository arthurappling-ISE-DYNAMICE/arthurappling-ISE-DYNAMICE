/**
 * SYS_OS — Shared Utilities
 * DOM helpers, non-blocking HUD notifications (alert() replacement, Audit F-17),
 * hashing primitives, and timing helpers.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;

    const utils = {
        /** Create an element. Text is always assigned via textContent — never markup. */
        el(tag, className, text) {
            const node = document.createElement(tag);
            if (className) node.className = className;
            if (text !== undefined && text !== null) node.textContent = text;
            return node;
        },

        debounce(fn, wait) {
            let t = null;
            return function (...args) {
                clearTimeout(t);
                t = setTimeout(() => fn.apply(this, args), wait);
            };
        },

        /**
         * Non-blocking HUD toast. Replaces every alert() in v2.6: no main-thread
         * block, no automation hang, screen-reader announced via the stack's
         * aria-live region.
         */
        notify(title, lines) {
            const stack = document.getElementById('toast-stack');
            if (!stack) return null;
            const toast = utils.el('div',
                'pointer-events-auto bg-black/90 border border-gold-500/30 rounded-lg p-4 ' +
                'shadow-[0_0_20px_rgba(0,0,0,0.6)] backdrop-blur-md transition-opacity duration-500');
            toast.appendChild(utils.el('div',
                'text-[10px] font-cyber font-bold text-gold-400 tracking-widest uppercase', title));
            (lines || []).forEach(function (line) {
                toast.appendChild(utils.el('div', 'text-[11px] font-mono text-slate-400 mt-1 leading-relaxed', line));
            });
            stack.appendChild(toast);
            setTimeout(function () {
                toast.classList.add('opacity-0');
                setTimeout(function () { toast.remove(); }, 500);
            }, SYSOS.CONFIG.TIMINGS.TOAST_MS);
            return toast;
        },

        /**
         * SHA-256 via WebCrypto when a secure context is available.
         * Falls back to FNV-1a (clearly labeled via `algo`) so the audit chain
         * still functions on file:// or other non-secure contexts.
         */
        async hash(text) {
            if (window.crypto && crypto.subtle && window.isSecureContext) {
                const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
                return {
                    algo: 'sha256',
                    hex: Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
                };
            }
            return { algo: 'fnv1a', hex: utils.fnv1a(text) };
        },

        fnv1a(str) {
            let h = 0x811c9dc5;
            for (let i = 0; i < str.length; i++) {
                h ^= str.charCodeAt(i);
                h = Math.imul(h, 0x01000193) >>> 0;
            }
            return h.toString(16).padStart(8, '0');
        },

        /** Crypto-grade hex token (replaces Math.random ids — Audit F-08). */
        hexToken(chars) {
            const bytes = new Uint8Array(Math.ceil(chars / 2));
            (window.crypto || {}).getRandomValues
                ? crypto.getRandomValues(bytes)
                : bytes.forEach((_, i) => { bytes[i] = Math.floor(Math.random() * 256); });
            return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, chars).toUpperCase();
        },

        /** Local-date stamp YYYYMMDD (fixes UTC rollover — Audit F-09). */
        dateStamp(date) {
            const d = date || new Date();
            return String(d.getFullYear()) +
                String(d.getMonth() + 1).padStart(2, '0') +
                String(d.getDate()).padStart(2, '0');
        }
    };

    SYSOS.utils = utils;
})();
