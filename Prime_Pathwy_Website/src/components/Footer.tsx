import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-bg-base border-t border-gold py-10 px-6 md:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Column 1: Brand */}
        <div>
          <Image
            src="/logo.png"
            alt="Prime Pathwy Seal"
            width={40}
            height={40}
            className="rounded-full mb-4"
          />
          <p className="font-serif text-gold text-sm mb-4">PRIME PATHWY</p>
          <p className="font-mono text-xs text-text-muted">
            © 2026 Prime Pathwy. All rights reserved.
          </p>
        </div>

        {/* Column 2: System Declaration */}
        <div>
          <p
            className="font-mono text-xs leading-relaxed italic"
            style={{ color: 'rgba(201,168,76,0.25)' }}
          >
            This operating structure ensures alignment, defensibility, audit
            readiness, and scalability.
          </p>
        </div>

        {/* Column 3: Contact */}
        <div className="md:text-right">
          <p className="font-mono text-xs text-text-muted mb-2">Contact</p>
          <p className="font-mono text-xs text-gold">info@primepathwy.com</p>
        </div>
      </div>
    </footer>
  )
}
