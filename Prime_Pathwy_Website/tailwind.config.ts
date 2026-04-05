import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  // darkMode: 'class' — this site is always dark. No OS-preference detection.
  // 'dark:' Tailwind variants are NOT used anywhere in this codebase.
  // The class strategy ensures dark: classes only apply if explicitly triggered,
  // preventing accidental light-mode bleed-through.
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-base': '#0A0A0A',
        'bg-surface': '#0D0D0D',
        'bg-elevated': '#111111',
        gold: '#C9A84C',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        mono: ['"Courier New"', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
