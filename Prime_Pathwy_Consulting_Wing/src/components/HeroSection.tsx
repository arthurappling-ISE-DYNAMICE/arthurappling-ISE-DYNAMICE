import Image from 'next/image'

export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-screen h-screen overflow-hidden"
    >
      {/* Full-bleed truck image */}
      <Image
        src="/images/turnovers/truck.png"
        alt="Black Denali Executive Fleet Vehicle with Prime Pathwy Gold Medallion door logo"
        fill
        className="object-cover object-center"
        priority
      />

      {/*
        Dual-layer overlay — Sovereign Hybrid treatment:
        Layer 1: radial gradient darkens corners while leaving the truck
                 center near-untouched (0.05 black = studio key-light feel).
        Layer 2: linear ramp from bottom creates a clean text-legibility
                 zone without flattening the image midtones.
      */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 110% 80% at 50% 35%, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.82) 100%)',
            'linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.48) 35%, rgba(0,0,0,0.15) 60%, transparent 80%)',
          ].join(', '),
        }}
        aria-hidden="true"
      />

      {/* Content — pushed to bottom two-thirds so medallion on truck is clear */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-6 text-center"
        style={{ paddingTop: '65%' }}
      >

        {/* Eyebrow */}
        <p
          className="font-mono text-xs tracking-[0.3em] uppercase mb-6"
          style={{ color: 'rgba(201,168,76,0.7)' }}
          aria-hidden="true"
        >
          PRIME PATHWY PROPERTY TURNOVER
        </p>

        {/* Headline — serif italic brand voice, -0.02em Linear tracking */}
        <h1
          id="hero-heading"
          className="font-serif italic text-2xl md:text-3xl text-white leading-tight mb-4 max-w-3xl"
          style={{ letterSpacing: 'var(--hero-h1-tracking)' }}
        >
          Your Last Turnover Vendor Left{' '}
          <span style={{ color: '#C9A84C' }}>No Record.</span>{' '}
          <span className="block">
            We Leave <span style={{ color: '#C9A84C' }}>No Doubt.</span>
          </span>
        </h1>

        {/* Subheadline */}
        <p className="font-mono text-sm text-white/80 max-w-xl mb-10">
          Every order is timestamped, photographed, verified, and archived.
          This is not a cleaning service. This is a system.
        </p>

        {/* CTA — smooth scrolls to #pricing */}
        <a
          href="#pricing"
          aria-label="Place an order for a Sovereign System installation — view pricing"
          className="font-mono text-xs text-gold border border-gold px-8 py-3 tracking-[0.2em] uppercase hover:bg-gold hover:text-[#0A0A0A] transition-colors duration-200"
        >
          [ PLACE YOUR ORDER &rarr; ]
        </a>

      </div>
    </section>
  )
}
