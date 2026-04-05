const cards = [
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
    <section id="system" className="bg-[#0A0A0A] py-20 px-6 md:px-16">
      <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#C9A84C] mb-4">
        Section 01 — The System
      </p>
      <h2 className="font-serif text-[28px] md:text-[36px] text-[#F0ECE0] mb-12 max-w-2xl">
        What You&apos;re Hiring Is a System, Not a Crew
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-[#0D0D0D] border border-[#1E1E1E] p-6 hover:border-[rgba(201,168,76,0.4)] hover:bg-[#111] transition-colors"
          >
            <p className="font-mono text-xs text-[#C9A84C] tracking-wide mb-3 uppercase">
              {card.label}
            </p>
            <p className="font-mono text-sm text-[#888] leading-relaxed">{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
