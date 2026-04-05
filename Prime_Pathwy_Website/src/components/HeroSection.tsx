import Image from 'next/image'

export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      // pt-14 matches Nav h-14 — keeps hero content below fixed nav
      className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center pt-14 px-6 text-center"
    >
      {/* Medallion Logo — primary brand mark */}
      <Image
        src="/logo.png"
        alt="Prime Pathwy — Official Seal"
        width={200}
        height={200}
        className="rounded-full mb-8"
        priority
      />

      {/* Eyebrow */}
      <p
        className="font-mono text-xs tracking-[0.3em] uppercase mb-6"
        style={{ color: 'rgba(201,168,76,0.4)' }}
      >
        PRIME PATHWY PROPERTY TURNOVER
      </p>

      {/* Headline */}
      <h1
        id="hero-heading"
        className="font-serif italic text-3xl md:text-5xl text-text-primary leading-tight mb-6 max-w-3xl"
      >
        Your Last Turnover Vendor Left No Record.{' '}
        <span className="block">We Leave No Doubt.</span>
      </h1>

      {/* Subheadline */}
      <p className="font-mono text-sm text-text-muted max-w-xl mb-10">
        Every order is timestamped, photographed, verified, and archived.
        This is not a cleaning service. This is a system.
      </p>

      {/* CTA — anchors to #order (OrderSection, built in Tasks 13–15) */}
      <a
        href="#order"
        className="font-mono text-xs text-gold border border-gold px-8 py-3 tracking-[0.2em] uppercase hover:bg-gold hover:text-[#0A0A0A] transition-colors duration-200"
      >
        [ PLACE YOUR ORDER &rarr; ]
      </a>
    </section>
  )
}
