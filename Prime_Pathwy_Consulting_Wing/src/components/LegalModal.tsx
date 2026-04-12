// ─── PRODUCTION GOLD MASTER — v1.0 — 2026-04-05 ────────────────────────────
// DO NOT MODIFY WITHOUT ARCHITECT APPROVAL — Arthur F. Appling Sr.
// ─────────────────────────────────────────────────────────────────────────────
'use client'

import { useEffect } from 'react'

interface LegalModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

export default function LegalModal({ title, onClose, children }: LegalModalProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0D0D0D] border border-gold">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[#1E1E1E]">
          <h2
            id="modal-title"
            className="font-mono text-xs tracking-[0.3em] uppercase text-gold"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="font-mono text-xs text-white/50 hover:text-gold transition-colors"
          >
            [ CLOSE ✕ ]
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-8 font-mono text-xs text-white/90 leading-relaxed space-y-4">
          {children}
        </div>

        {/* Footer rule */}
        <div className="px-8 py-4 border-t border-[#1E1E1E]">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold" aria-hidden="true">
            PRIME PATHWY CONSULTING AA — A SOVEREIGN EMPIRE INSTALLATION
          </p>
        </div>

      </div>
    </div>
  )
}
