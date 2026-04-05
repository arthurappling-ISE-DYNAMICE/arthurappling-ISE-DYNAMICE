interface Pillar {
  label: string
  description: string
}

const pillars: Pillar[] = [
  {
    label: 'Before Photos',
    description: 'Comprehensive room-by-room photos before any work begins.',
  },
  {
    label: 'Milestone Photos',
    description: 'After cleanout, kitchen/bath, floors, and final sweep.',
  },
  {
    label: 'Completion Archive',
    description: 'Full photo set delivered. Records stored 18–24 months minimum.',
  },
]

export default function DocumentationSection() {
  return (
    <section
      id="documentation"
      aria-labelledby="documentation-heading"
      className="bg-bg-base py-20 px-6 md:px-16"
    >
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-gold mb-8">
          SECTION 03 — DOCUMENTATION STANDARD
        </p>

        <h2 id="documentation-heading" className="sr-only">Documentation Standard</h2>
        <blockquote className="max-w-3xl mx-auto text-center mb-16">
          <p className="font-serif text-[28px] md:text-[36px] italic text-text-primary mb-4">
            "If it is not documented, it did not occur."
          </p>
          <p
            className="font-mono text-xs tracking-wide"
            style={{ color: 'rgba(201,168,76,0.6)' }}
          >
            — Prime Pathwy Operating Standard, Section 5
          </p>
        </blockquote>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {pillars.map((pillar) => (
            <div
              key={pillar.label}
              className="bg-bg-surface border border-border-subtle p-6 hover:border-[rgba(201,168,76,0.4)] hover:bg-bg-elevated transition-colors"
            >
              <h3 className="font-mono text-xs text-gold tracking-wide mb-3 uppercase">
                {pillar.label}
              </h3>
              <p className="font-mono text-sm text-text-secondary leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
