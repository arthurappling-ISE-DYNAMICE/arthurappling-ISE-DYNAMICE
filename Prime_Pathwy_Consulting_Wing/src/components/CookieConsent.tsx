'use client'

import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem('pp_cookie_consent')) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  function accept() {
    try { localStorage.setItem('pp_cookie_consent', 'accepted') } catch { /* noop */ }
    setVisible(false)
  }

  function decline() {
    try { localStorage.setItem('pp_cookie_consent', 'declined') } catch { /* noop */ }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Cookie consent notice"
      className="fixed bottom-0 left-0 right-0 z-[150] bg-[#0D0D0D] border-t border-gold px-6 py-5"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        <div className="flex-1">
          <p className="font-mono text-xs text-white/90 leading-relaxed">
            <span className="text-gold font-bold">PRIME PATHWY — COOKIE NOTICE (CCPA).</span>{' '}
            This site uses essential cookies to process your order and maintain session
            security. We do not sell your personal information. California residents have
            the right to know, delete, and opt out under the{' '}
            <span className="text-gold">California Consumer Privacy Act (CCPA)</span>.{' '}
            For requests, contact{' '}
            <a
              href="mailto:info@primepathwy.com"
              className="text-gold underline underline-offset-2 hover:text-white transition-colors"
              aria-label="Send a CCPA data request to Prime Pathwy"
            >
              info@primepathwy.com
            </a>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={accept}
            aria-label="Accept cookies and close this notice"
            className="font-mono text-xs tracking-[0.15em] uppercase bg-gold text-[#0A0A0A] px-5 py-2 hover:bg-white transition-colors"
          >
            Accept
          </button>
          <button
            onClick={decline}
            aria-label="Decline non-essential cookies and close this notice"
            className="font-mono text-xs tracking-[0.15em] uppercase border border-[#333] text-white/60 px-5 py-2 hover:border-gold hover:text-white transition-colors"
          >
            Decline
          </button>
        </div>

      </div>
    </div>
  )
}
