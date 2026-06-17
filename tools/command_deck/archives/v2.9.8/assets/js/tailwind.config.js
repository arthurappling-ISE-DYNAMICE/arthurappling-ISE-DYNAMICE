/**
 * SYS_OS — Tailwind theme extension (loaded immediately after the pinned CDN).
 * gold-50..950 fully defined — fixes the silent v2.6 bug where gold-950
 * utilities generated no CSS (Audit F-02).
 */
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'sans-serif'],
                mono: ['Share Tech Mono', 'monospace'],
                cyber: ['Orbitron', 'sans-serif']
            },
            colors: {
                gold: {
                    50: '#FFFDF0',
                    100: '#FFF9D4',
                    400: '#F3C64F',
                    500: '#D4AF37',
                    600: '#AA8822',
                    900: '#5C4103',
                    950: '#1F1604'
                }
            }
        }
    }
};
