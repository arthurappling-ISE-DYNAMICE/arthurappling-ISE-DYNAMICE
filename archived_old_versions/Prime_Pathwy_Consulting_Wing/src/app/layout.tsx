// ─── PRODUCTION GOLD MASTER — v1.1 — 2026-04-13 ────────────────────────────
// DO NOT MODIFY WITHOUT ARCHITECT APPROVAL — Arthur F. Appling Sr.
// v1.1: Inter Variable loaded via next/font/google for display headings
// ─────────────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SkipLink from '@/components/SkipLink'
import CookieConsent from '@/components/CookieConsent'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Prime Pathwy Property Turnover — Sovereign System',
  description:
    'Documented. Defensible. Done. Institutional-grade property turnover services. ' +
    'Scope locked before work begins. Every job archived.',
  icons: {
    icon: '/favicon.png?v=3',
    shortcut: '/favicon.png?v=3',
    apple: '/favicon.png?v=3',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <SkipLink />
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
