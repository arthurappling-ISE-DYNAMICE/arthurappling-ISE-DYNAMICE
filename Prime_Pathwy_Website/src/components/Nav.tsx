// Prime_Pathwy_Website/src/components/Nav.tsx
import Image from 'next/image'

const navLinks = [
  { href: '#system',        label: 'System',        ariaLabel: 'Navigate to the Sovereign System overview section' },
  { href: '#lifecycle',     label: 'Lifecycle',     ariaLabel: 'Navigate to the 7-step execution lifecycle section' },
  { href: '#documentation', label: 'Documentation', ariaLabel: 'Navigate to the documentation and archive section' },
  { href: '#pricing',       label: 'Pricing',       ariaLabel: 'Navigate to the pricing and service tiers section' },
]

export default function Nav() {
  return (
    <nav aria-label="Primary navigation" className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0A0A0A] border-b border-gold flex items-center justify-between px-6">
      {/* Left: Seal + Wordmark */}
      <a href="#main-content" aria-label="Prime Pathwy — return to top of page" className="flex items-center gap-3 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold">
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

      {/* Right: Anchor links + CTA */}
      <div className="hidden md:flex items-center gap-6" role="list">
        {navLinks.map(({ href, label, ariaLabel }) => (
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
        <a
          href="#order"
          aria-label="Place an order for a Sovereign System installation"
          className="font-mono text-xs text-gold border border-gold px-4 py-2 tracking-widest uppercase hover:bg-gold hover:text-[#0A0A0A] transition-colors duration-200"
        >
          Place Order
        </a>
      </div>
    </nav>
  )
}
