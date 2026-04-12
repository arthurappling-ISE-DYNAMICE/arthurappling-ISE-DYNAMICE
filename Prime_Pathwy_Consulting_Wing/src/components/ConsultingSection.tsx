// Prime_Pathwy_Website/src/components/ConsultingSection.tsx
import Image from 'next/image'
import SovereignManifest from '@/components/SovereignManifest'

const screens = [
  {
    id: 'problem',
    img: '/images/consulting/paperwork.png',
    alt: 'Operator overwhelmed by disorganized paperwork — the operational problem',
    eyebrow: 'Prime Pathwy — Consulting Division',
    h1: 'Drowning in Paperwork?',
    body: "Disorganized operations don't fail loudly.\nThey quietly drain your time, money, and leverage.",
    priority: true,
    cta: null,
  },
  {
    id: 'architecture',
    img: '/images/consulting/future-system.png',
    alt: 'Futuristic sovereign business system architecture — the operational transformation',
    eyebrow: 'The Architecture',
    h1: 'The Sovereign Core.',
    body: 'Not software. Not a spreadsheet. A living operational framework — documented, enforced, and defensible.',
    priority: false,
    cta: null,
  },
  {
    id: 'result',
    img: '/images/consulting/luxury-office.png',
    alt: 'Businessman in a luxurious office — the result of a sovereign operational system',
    eyebrow: 'The Final State',
    h1: 'This Is What\nSovereign Looks Like.',
    body: 'Your operation — documented, automated, and running without you in the room.',
    priority: false,
    cta: { href: '#consulting-inquiry', label: '↓ Select Your Engagement' },
  },
]

export default function ConsultingSection() {
  return (
    <div id="consulting-state" aria-label="Consulting Wing">

      {/* ── Gallery of Power — full-screen scroll snap ──────────────────── */}
      <div
        style={{
          height: '100vh',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
        }}
      >
        {screens.map((screen) => (
          <section
            key={screen.id}
            aria-labelledby={`consulting-${screen.id}-heading`}
            style={{
              height: '100vh',
              scrollSnapAlign: 'start',
              position: 'relative',
              background: 'radial-gradient(ellipse at center, #0A0A0A 0%, #050505 100%)',
              flexShrink: 0,
            }}
          >
            {/* ── Image — padded gallery frame ──────────────────────────── */}
            <div
              className="absolute inset-[24px] md:inset-[80px] lg:inset-[200px]"
              style={{ position: 'absolute' }}
            >
              <Image
                src={screen.img}
                alt={screen.alt}
                fill
                className="object-cover object-center"
                priority={screen.priority}
              />
            </div>

            {/* ── Bottom gradient for text legibility ───────────────────── */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.5) 30%, rgba(5,5,5,0.1) 60%, transparent 100%)',
              }}
              aria-hidden="true"
            />

            {/* ── Text content ──────────────────────────────────────────── */}
            <div className="absolute inset-0 flex flex-col justify-end px-8 md:px-16 lg:px-24 pb-16 md:pb-20">
              <p
                className="font-mono text-[10px] tracking-[0.4em] uppercase mb-5"
                style={{ color: 'rgba(201,168,76,0.55)' }}
                aria-hidden="true"
              >
                {screen.eyebrow}
              </p>

              <h2
                id={`consulting-${screen.id}-heading`}
                className="font-serif italic font-black mb-5 max-w-3xl"
                style={{
                  fontSize: 'clamp(40px, 6vw, 72px)',
                  lineHeight: 1.05,
                  whiteSpace: 'pre-line',
                  background:
                    'linear-gradient(135deg, #F5D98A 0%, #E2C06A 20%, #C9A84C 40%, #F5D98A 60%, #C9A84C 80%, #E2C06A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.25))',
                }}
              >
                {screen.h1}
              </h2>

              <p
                className="font-mono text-sm md:text-base text-white max-w-xl"
                style={{ lineHeight: 2 }}
              >
                {screen.body}
              </p>

              {screen.cta && (
                <a
                  href={screen.cta.href}
                  aria-label="Select your consulting engagement"
                  className="inline-block mt-8 font-mono text-xs tracking-[0.3em] uppercase text-gold/60 hover:text-gold transition-colors duration-200"
                >
                  {screen.cta.label}
                </a>
              )}
            </div>

            {/* ── Screen indicator ──────────────────────────────────────── */}
            <div
              className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2"
              aria-hidden="true"
            >
              {screens.map((s, i) => (
                <div
                  key={s.id}
                  style={{
                    width: 2,
                    height: s.id === screen.id ? 24 : 8,
                    background:
                      s.id === screen.id
                        ? 'rgba(201,168,76,0.8)'
                        : 'rgba(201,168,76,0.2)',
                    borderRadius: 1,
                    transition: 'all 0.3s',
                  }}
                />
              ))}
            </div>

          </section>
        ))}
      </div>

      {/* ── Sovereign Manifest — service menu below gallery ─────────────── */}
      <SovereignManifest />

    </div>
  )
}
