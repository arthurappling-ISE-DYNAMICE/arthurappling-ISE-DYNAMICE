// Prime_Pathwy_Website/src/components/Nav.tsx
'use client'

import Image from 'next/image'

const turnoverLinks = [
  { href: '#system',        label: 'System',        ariaLabel: 'Navigate to the Sovereign System overview section' },
  { href: '#lifecycle',     label: 'Lifecycle',     ariaLabel: 'Navigate to the 7-step execution lifecycle section' },
  { href: '#documentation', label: 'Documentation', ariaLabel: 'Navigate to the documentation and archive section' },
  { href: '#pricing',       label: 'Pricing',       ariaLabel: 'Navigate to the pricing and service tiers section' },
]

const consultingLinks = [
  { href: '#consulting-state',   label: 'Services',  ariaLabel: 'Navigate to consulting services' },
  { href: '#consulting-inquiry', label: 'Inquiry',   ariaLabel: 'Navigate to consulting inquiry' },
]

interface NavProps {
  consultingActive?: boolean
  onConsultingToggle?: () => void
}

export default function Nav({ consultingActive = false, onConsultingToggle }: NavProps) {
  const links = consultingActive ? consultingLinks : turnoverLinks

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0A0A0A] border-b border-gold flex items-center justify-between px-6"
    >
      {/* Left: Seal + Wordmark */}
      <a
        href="#main-content"
        aria-label="Prime Pathwy — return to top of page"
        className="flex items-center gap-3 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
      >
        <Image
          src="/logo.png"
          alt="Prime Pathwy official seal"
          width={36}
          height={36}
          className="rounded-full"
        />
        <span className="font-serif text-gold text-lg tracking-wide">
          PRIME PATHWY
        </span>
      </a>

      {/* Right: Anchor links + State Toggle */}
      <div className="hidden md:flex items-center gap-6" role="list">
        {links.map(({ href, label, ariaLabel }) => (
          <a
            key={href}
            href={href}
            aria-label={ariaLabel}
            role="listitem"
            className="font-mono text-xs text-white hover:text-gold tracking-widest uppercase transition-colors duration-200"
          >
            {label}
          </a>
        ))}

        {/* Consulting Toggle Button */}
        <button
          onClick={onConsultingToggle}
          aria-pressed={consultingActive}
          aria-label={
            consultingActive
              ? 'Switch back to Property Turnover view'
              : 'Switch to Consulting Division view'
          }
          className="font-mono text-xs tracking-widest uppercase transition-all duration-200 px-4 py-2"
          style={
            consultingActive
              ? {
                  color: '#0A0A0A',
                  background: '#C9A84C',
                  border: '1px solid #C9A84C',
                  boxShadow:
                    '0 0 14px rgba(201,168,76,0.6), 0 0 30px rgba(201,168,76,0.25)',
                }
              : {
                  color: '#C9A84C',
                  background: 'rgba(201,168,76,0.08)',
                  border: '1px solid rgba(201,168,76,0.5)',
                  boxShadow: '0 0 8px rgba(201,168,76,0.2)',
                }
          }
        >
          {consultingActive ? '← Turnover' : '⬡ Consulting'}
        </button>
      </div>
    </nav>
  )
}
