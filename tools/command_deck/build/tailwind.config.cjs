/**
 * SYS_OS v3.1 — Tailwind CLI build config (offline compile).
 * Scans index.html AND assets/js/*.js because utility classes live in JS
 * string literals (DOM-built UI). Theme mirrors the runtime tailwind.config.js.
 */
module.exports = {
  content: [
    './index.html',
    './assets/js/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
        cyber: ['Orbitron', 'sans-serif']
      },
      colors: {
        gold: {
          50: '#FFFDF0', 100: '#FFF9D4', 400: '#F3C64F',
          500: '#D4AF37', 600: '#AA8822', 900: '#5C4103', 950: '#1F1604'
        }
      }
    }
  }
};
