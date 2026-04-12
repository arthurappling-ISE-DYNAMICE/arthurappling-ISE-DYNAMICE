'use client'

import { useState } from 'react'

interface LifecycleStep {
  num: string
  label: string
  note: string
}

const steps: LifecycleStep[] = [
  { num: '01', label: 'Select Services',    note: 'Property type + unit size' },
  { num: '02', label: 'Review Pricing',     note: 'Labor shown; disposal billed separately' },
  { num: '03', label: 'Accept Agreements',  note: 'Click-wrap — scope, payment, verification' },
  { num: '04', label: 'Submit Payment',     note: 'Captured and timestamped' },
  { num: '05', label: 'Verification Gate',  note: 'Identity + authority verified before scheduling ($1,000+)' },
  { num: '06', label: 'Work Performed',     note: 'Before/during/after photos taken' },
  { num: '07', label: 'Completion & Archive', note: 'Photos delivered, records archived' },
]

export default function LifecycleSection() {
  const [activeStep, setActiveStep] = useState('05')

  const active = steps.find((s) => s.num === activeStep) ?? steps[4]

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

        {/* Step selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 mb-8">
          {steps.map((step) => {
            const isActive = step.num === activeStep
            return (
              <button
                key={step.num}
                onClick={() => setActiveStep(step.num)}
                aria-pressed={isActive}
                className={[
                  'text-left p-6 transition-colors duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold',
                  isActive
                    ? 'bg-bg-elevated border border-gold ring-1 ring-[rgba(201,168,76,0.15)]'
                    : 'bg-bg-base border border-border-subtle hover:border-[#333]',
                ].join(' ')}
              >
                <div className={`font-mono text-xl mb-3 tracking-tight ${isActive ? 'text-gold' : 'text-text-muted'}`}>
                  {step.num}
                </div>
                <h3 className={`font-mono text-xs uppercase tracking-wide ${isActive ? 'text-gold' : 'text-text-primary'}`}>
                  {step.label}
                </h3>
              </button>
            )
          })}
        </div>

        {/* Detail panel */}
        <div className="border border-gold bg-bg-elevated px-8 py-6 flex items-start gap-6">
          <span className="font-mono text-3xl text-gold tracking-tight shrink-0">{active.num}</span>
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-gold mb-2">
              {active.label}
            </h3>
            <p className="font-mono text-sm text-text-primary leading-relaxed">{active.note}</p>
          </div>
        </div>

      </div>
    </section>
  )
}
