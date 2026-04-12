// ─── PRODUCTION GOLD MASTER — v1.0 — 2026-04-05 ────────────────────────────
// DO NOT MODIFY WITHOUT ARCHITECT APPROVAL — Arthur F. Appling Sr.
// ─────────────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next'
import './globals.css'
import SkipLink from '@/components/SkipLink'
import CookieConsent from '@/components/CookieConsent'

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
    <html lang="en">
      <body className="antialiased">
        <SkipLink />
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
