import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prime Pathwy Property Turnover — Sovereign System',
  description:
    'Documented. Defensible. Done. Institutional-grade property turnover services. ' +
    'Scope locked before work begins. Every job archived.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
