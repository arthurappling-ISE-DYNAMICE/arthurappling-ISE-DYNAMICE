/**
 * SYS_OS v2.9.8 — Money Safety Layer
 *
 * All revenue arithmetic runs in integer cents to eliminate IEEE-754 drift
 * (e.g. 0.1 + 0.2 !== 0.3). Stored record values remain whole-dollar numbers
 * for backward compatibility; this layer converts to cents, does integer math,
 * and converts back only at the boundary. Probability-weighted math rounds to
 * the nearest cent deterministically.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;

    const money = {
        /** Dollars (Number) -> integer cents. Rounds half-up at the cent. */
        toCents(dollars) {
            if (dollars === null || dollars === undefined || dollars === '') return 0;
            return Math.round(Number(dollars) * 100);
        },

        /** Integer cents -> dollars (Number, exact to 2dp). */
        toDollars(cents) {
            return Math.round(cents) / 100;
        },

        /** Sum a list of dollar amounts safely (in cents), return dollars. */
        sumDollars(amounts) {
            const cents = (amounts || []).reduce(function (n, a) { return n + money.toCents(a); }, 0);
            return money.toDollars(cents);
        },

        /** Add two cent values. */
        addCents(a, b) { return Math.round(a) + Math.round(b); },

        /** cents * rate -> rounded integer cents (rate is a 0..1 float). */
        weightCents(cents, rate) {
            return Math.round(Math.round(cents) * Number(rate));
        },

        /** Format integer cents as a $ display string. */
        format(cents) {
            const d = money.toDollars(cents);
            return '$' + d.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        },

        /** Format a dollar Number for display (boundary helper). */
        formatDollars(dollars) {
            return money.format(money.toCents(dollars));
        }
    };

    SYSOS.money = money;
})();
