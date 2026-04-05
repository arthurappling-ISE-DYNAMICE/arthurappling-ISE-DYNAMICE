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
        <h2
          id="system-heading"
          className="font-serif text-[28px] md:text-[36px] text-text-primary mb-12 max-w-2xl"
        >
          What You&apos;re Hiring Is a System, Not a Crew
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-bg-surface border border-[#1E1E1E] p-6 hover:border-[rgba(201,168,76,0.4)] hover:bg-bg-elevated transition-colors"
            >
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
