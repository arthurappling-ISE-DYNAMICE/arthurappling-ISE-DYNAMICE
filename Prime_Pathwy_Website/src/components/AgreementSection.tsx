interface AgreementTerm {
  bold: string
  rest: string
}

const agreementTerms: AgreementTerm[] = [
  {
    bold: 'Scope is locked to your order summary.',
    rest: ' Changes require a written change order approved before work continues.',
  },
  {
    bold: 'Payment is captured in full at booking.',
    rest: ' Because services involve irreversible labor, payments are non-refundable once scheduled or commenced.',
  },
  {
    bold: 'Projects of $1,000 or more require identity and authority verification',
    rest: ' before scheduling is confirmed.',
  },
  {
    bold: 'You confirm legal authority',
    rest: ' to approve services and authorize disposal of abandoned contents at the property address provided.',
  },
]

export default function AgreementSection() {
  return (
    <section
      id="agreement"
      aria-labelledby="agreement-heading"
      className="bg-bg-base py-20 px-6 md:px-16"
    >
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-gold mb-8">
          SECTION 05 — THE AGREEMENT
        </p>

        <h2
          id="agreement-heading"
          className="font-serif text-[28px] md:text-[36px] text-text-primary mb-12 max-w-3xl"
        >
          What You're Accepting When You Place an Order
        </h2>

        <div className="max-w-3xl space-y-6 mb-12">
          {agreementTerms.map((term, idx) => (
            <div key={idx} className="flex gap-4">
              <span className="font-mono text-gold text-sm flex-shrink-0">·</span>
              <p className="font-mono text-sm text-text-primary">
                <span className="text-text-primary">{term.bold}</span>
                <span className="text-text-secondary">{term.rest}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl border-t border-border-subtle pt-8">
          <p
            className="font-mono text-xs text-text-primary leading-relaxed"
            style={{ color: 'rgba(201,168,76,0.6)' }}
          >
            By completing checkout, you enter into a binding electronic agreement. The website order record is the system of record.
          </p>
        </div>
      </div>
    </section>
  )
}
