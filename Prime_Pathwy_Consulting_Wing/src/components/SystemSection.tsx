interface SystemCard {
  label: string
  body: string
}

const cards: SystemCard[] = [
  {
    label: 'Scope Locked Before Work Begins',
    body: 'No verbal approvals. Scope is defined by the order record and cannot change without a written change order.',
  },
  {
    label: 'Every Job Documented',
    body: 'Before, during, and after photos. Receipts. Timestamps. Archived 18–24 months minimum.',
  },
  {
    label: 'Chargeback-Defensible by Design',
    body: 'Order record, agreement acceptance log, photo set, and payment receipt — all on file before work begins.',
  },
]

export default function SystemSection() {
  return (
    <section
      id="system"
      aria-labelledby="system-heading"
      className="bg-bg-base py-20 px-6 md:px-16"
    >
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-gold mb-4">
          SECTION 01 — THE SYSTEM
        </p>
        {/* Inter 800 / -0.04em — Linear institutional display heading */}
        <h2
          id="system-heading"
          className="font-sans text-[28px] md:text-[36px] text-text-primary mb-12 max-w-2xl"
          style={{
            fontWeight: 'var(--display-weight)',
            letterSpacing: 'var(--display-tracking)',
            lineHeight: 'var(--display-leading)',
          }}
        >
          What You&apos;re Hiring Is a System, Not a Crew
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="group relative p-6 overflow-hidden"
              style={{
                background: 'rgba(201,168,76,0.035)',
                border: '1px solid rgba(201,168,76,0.18)',
                borderRadius: '4px',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                transition: 'background 0.25s, border-color 0.25s, transform 0.2s, box-shadow 0.25s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.background = 'rgba(201,168,76,0.065)'
                el.style.borderColor = 'rgba(201,168,76,0.52)'
                el.style.transform = 'translateY(-2px)'
                el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,168,76,0.08)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.background = 'rgba(201,168,76,0.035)'
                el.style.borderColor = 'rgba(201,168,76,0.18)'
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = 'none'
              }}
            >
              {/* Top highlight line — depth plane */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.25), transparent)' }}
                aria-hidden="true"
              />
              <h3 className="font-mono text-xs text-gold tracking-wide mb-3 uppercase">
                {card.label}
              </h3>
              <p className="font-mono text-sm text-text-secondary leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
