// Prime_Pathwy_Website/src/components/ConsultingSection.tsx
import Image from 'next/image'

export default function ConsultingSection() {
  return (
    <div id="consulting-state" aria-label="Consulting Wing">

      {/* ── SECTION 1 — HERO: The Problem ──────────────────────────────── */}
      <section
        aria-labelledby="consulting-hero-heading"
        className="relative w-full overflow-hidden"
        style={{ minHeight: '100vh' }}
      >
        <Image
          src="/images/consulting/paperwork.png"
          alt="Frustrated operator overwhelmed by paperwork and disorganized processes"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Deep matte overlay */}
        <div className="absolute inset-0 bg-[#0A0A0A]/70" aria-hidden="true" />

        {/* Content — centered vertically */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p
            className="font-mono text-xs tracking-[0.35em] uppercase mb-6"
            style={{ color: 'rgba(201,168,76,0.55)' }}
            aria-hidden="true"
          >
            Prime Pathwy — Consulting Division
          </p>
          <h1
            id="consulting-hero-heading"
            className="font-serif italic text-4xl md:text-6xl text-gold leading-tight mb-6 max-w-4xl"
          >
            Drowning in Paperwork?
          </h1>
          <p className="font-mono text-sm md:text-base text-white/70 max-w-xl leading-relaxed mb-10">
            Disorganized operations don&apos;t fail loudly.<br />
            They quietly drain your time, money, and leverage.
          </p>
          <div
            className="w-16 border-t border-gold mb-0"
            aria-hidden="true"
            style={{ boxShadow: '0 0 8px rgba(201,168,76,0.4)' }}
          />
        </div>

        {/* Scroll cue */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] uppercase text-gold/40"
          aria-hidden="true"
        >
          ↓ THE SYSTEM
        </div>
      </section>

      {/* ── SECTION 2 — BRIDGE: The Transformation ─────────────────────── */}
      <section
        aria-labelledby="consulting-bridge-heading"
        className="relative w-full overflow-hidden"
        style={{ minHeight: '80vh' }}
      >
        <Image
          src="/images/consulting/future-system.png"
          alt="Futuristic sovereign business system architecture at dusk — the operational transformation"
          fill
          className="object-cover object-center"
        />
        {/* Gradient overlay — heavier at bottom for caption legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(10,10,10,0.45) 0%, rgba(10,10,10,0.25) 40%, rgba(10,10,10,0.85) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Caption — bottom-left, institutional style */}
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-12">
          <p
            className="font-mono text-[10px] tracking-[0.4em] uppercase mb-3"
            style={{ color: 'rgba(201,168,76,0.5)' }}
            aria-hidden="true"
          >
            The Architecture
          </p>
          <h2
            id="consulting-bridge-heading"
            className="font-serif italic text-3xl md:text-5xl text-gold"
            style={{ textShadow: '0 0 40px rgba(201,168,76,0.2)' }}
          >
            The Sovereign Core.
          </h2>
          <p className="font-mono text-sm text-white/60 mt-4 max-w-lg leading-relaxed">
            Not software. Not a spreadsheet. A living operational framework —
            documented, enforced, and defensible.
          </p>
        </div>
      </section>

      {/* ── SECTION 3 — FINAL STATE: The Result + Service Menu ─────────── */}
      <section
        aria-labelledby="consulting-result-heading"
        className="relative w-full overflow-hidden"
        style={{ minHeight: '100vh' }}
      >
        <Image
          src="/images/consulting/luxury-office.png"
          alt="Businessman in a luxurious office — the result of a sovereign operational system"
          fill
          className="object-cover object-center"
        />
        {/* Bottom-weighted overlay so buttons are readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.92) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Content — bottom-aligned */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-16 pb-16">

          <p
            className="font-mono text-[10px] tracking-[0.4em] uppercase mb-4"
            style={{ color: 'rgba(201,168,76,0.5)' }}
            aria-hidden="true"
          >
            The Final State
          </p>
          <h2
            id="consulting-result-heading"
            className="font-serif italic text-3xl md:text-5xl text-gold mb-4 max-w-2xl"
          >
            This Is What Sovereign Looks Like.
          </h2>
          <p className="font-mono text-sm text-white/60 max-w-xl mb-12 leading-relaxed">
            Your operation — documented, automated, and running without you in the room.
          </p>

          {/* Service Menu */}
          <div
            role="group"
            aria-label="Consulting service menu"
            className="flex flex-col gap-4 max-w-3xl"
          >
            {/* Tier buttons row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <a
                href="#consulting-inquiry"
                aria-label="Sovereign System Install — full operational build-out"
                className="font-mono text-xs tracking-[0.2em] uppercase text-gold border border-gold/40 px-5 py-4 text-center hover:bg-gold/10 hover:border-gold transition-colors duration-200"
              >
                Sovereign System Install
              </a>
              <a
                href="#consulting-inquiry"
                aria-label="Operational Autopsy — failure analysis and root cause diagnosis"
                className="font-mono text-xs tracking-[0.2em] uppercase text-gold border border-gold/40 px-5 py-4 text-center hover:bg-gold/10 hover:border-gold transition-colors duration-200"
              >
                Operational Autopsy
              </a>
              <a
                href="#consulting-inquiry"
                aria-label="Consulting Inquiry — submit your operational profile"
                className="font-mono text-xs tracking-[0.2em] uppercase text-gold border border-gold/40 px-5 py-4 text-center hover:bg-gold/10 hover:border-gold transition-colors duration-200"
              >
                Consulting Inquiry
              </a>
            </div>

            {/* Primary CTA — glowing */}
            <a
              href="#consulting-inquiry"
              aria-label="Request a Sovereign Diagnostic for five thousand dollars — primary consulting engagement"
              className="font-mono text-sm tracking-[0.2em] uppercase text-[#0A0A0A] bg-gold px-8 py-5 text-center font-bold transition-all duration-200 hover:brightness-110"
              style={{
                boxShadow:
                  '0 0 18px rgba(201,168,76,0.55), 0 0 40px rgba(201,168,76,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              [ Request Sovereign Diagnostic — $5,000 ]
            </a>
          </div>

        </div>
      </section>

      {/* ── Inquiry anchor target ───────────────────────────────────────── */}
      <div id="consulting-inquiry" aria-hidden="true" />

    </div>
  )
}
