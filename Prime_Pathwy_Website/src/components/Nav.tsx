// Prime_Pathwy_Website/src/components/Nav.tsx
import Image from 'next/image'

export default function Nav() {
  return (
    <nav aria-label="Primary navigation" className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0A0A0A] border-b border-gold flex items-center justify-between px-6">
      {/* Left: Seal + Wordmark */}
      <div className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Prime Pathwy Seal"
          width={36}
          height={36}
          className="rounded-full"
        />
        <span className="font-serif text-gold text-lg tracking-wide">
          PRIME PATHWY
        </span>
      </div>

      {/* Right: Anchor links + CTA */}
      <div className="hidden md:flex items-center gap-6">
        {[
          { href: '#system',        label: 'System' },
          { href: '#lifecycle',     label: 'Lifecycle' },
          { href: '#documentation', label: 'Documentation' },
          { href: '#pricing',       label: 'Pricing' },
        ].map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="font-mono text-xs text-[#888888] hover:text-gold tracking-widest uppercase transition-colors duration-200"
          >
            {label}
          </a>
        ))}
        <a
          href="#order"
          className="font-mono text-xs text-gold border border-gold px-4 py-2 tracking-widest uppercase hover:bg-gold hover:text-[#0A0A0A] transition-colors duration-200"
        >
          Place Order
        </a>
      </div>
    </nav>
  )
}
