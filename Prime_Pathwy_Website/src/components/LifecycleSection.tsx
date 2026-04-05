interface LifecycleStep {
  num: string
  label: string
  note: string
  highlight: boolean
}

const steps: LifecycleStep[] = [
  { num: '01', label: 'Select Services', note: 'Property type + unit size', highlight: false },
  { num: '02', label: 'Review Pricing', note: 'Labor shown; disposal billed separately', highlight: false },
  { num: '03', label: 'Accept Agreements', note: 'Click-wrap — scope, payment, verification', highlight: false },
  { num: '04', label: 'Submit Payment', note: 'Captured and timestamped', highlight: false },
  { num: '05', label: 'Verification Gate', note: 'Identity + authority verified before scheduling ($1,000+)', highlight: true },
  { num: '06', label: 'Work Performed', note: 'Before/during/after photos taken', highlight: false },
  { num: '07', label: 'Completion & Archive', note: 'Photos delivered, records archived', highlight: false },
]

export default function LifecycleSection() {
  return (
    <section
      id="lifecycle"
      aria-labelledby="lifecycle-heading"
      className="bg-bg-surface py-20 px-6 md:px-16"
    >
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-gold mb-4">
          SECTION 02 — EXECUTION LIFECYCLE
        </p>
        <h2
          id="lifecycle-heading"
          className="font-serif text-[28px] md:text-[36px] text-text-primary mb-12 max-w-2xl"
        >
          7 Steps. No Surprises.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className={
                step.highlight
                  ? 'bg-bg-elevated border border-gold ring-1 ring-[rgba(201,168,76,0.15)] p-6'
                  : 'bg-bg-base border border-[#1E1E1E] p-6'
              }
            >
              <div className={`font-mono text-xl mb-3 tracking-tight ${step.highlight ? 'text-gold' : 'text-[#2A2A2A]'}`}>
                {step.num}
              </div>
              <h3 className={`font-mono text-xs uppercase tracking-wide mb-2 ${step.highlight ? 'text-gold' : 'text-text-primary'}`}>
                {step.label}
              </h3>
              <p className="font-mono text-xs text-text-muted leading-relaxed">{step.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
