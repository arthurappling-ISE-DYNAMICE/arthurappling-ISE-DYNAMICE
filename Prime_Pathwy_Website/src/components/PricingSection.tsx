interface PriceRow {
  type: string
  range: string
}

interface PriceTableProps {
  title: string
  rows: PriceRow[]
}

function PriceTable({ title, rows }: PriceTableProps) {
  return (
    <div className="border border-border-subtle bg-bg-base">
      <div className="bg-bg-elevated border-b border-[#1A1A1A] px-6 py-4">
        <h3 className="font-mono text-sm text-gold tracking-wide uppercase">
          {title}
        </h3>
      </div>
      <div>
        {rows.map((row, idx) => (
          <div
            key={idx}
            className={`flex justify-between items-center px-6 py-4 ${
              idx < rows.length - 1 ? 'border-b border-[#1A1A1A]' : ''
            }`}
          >
            <span className="font-mono text-sm text-text-secondary">
              {row.type}
            </span>
            <span className="font-mono text-sm text-text-primary font-semibold">
              {row.range}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const apartmentRows: PriceRow[] = [
  { type: 'Studio / 1 Bedroom', range: '$1,200 – $1,600' },
  { type: '2 Bedroom', range: '$1,500 – $2,000' },
  { type: '3 Bedroom', range: '$1,800 – $2,400' },
]

const homesRows: PriceRow[] = [
  { type: '2 Bedroom', range: '$1,600 – $2,100' },
  { type: '3 Bedroom', range: '$1,900 – $2,600' },
  { type: '4 Bedroom', range: '$2,300 – $3,000' },
  { type: 'Each Additional Bedroom', range: '+$200' },
]

const footnotes = [
  'Disposal and landfill fees billed separately at cost with receipts.',
  'Standard timeline: 2–3 business days (estimate).',
  'Extreme conditions (biohazard, hoarding) require separate written quote.',
  'Licensed trade work is not included.',
]

export default function PricingSection() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="bg-bg-surface py-20 px-6 md:px-16"
    >
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-gold mb-8">
          SECTION 04 — PRICING & SCOPE
        </p>

        <h2
          id="pricing-heading"
          className="font-serif text-[28px] md:text-[36px] text-text-primary mb-12 max-w-3xl"
        >
          Labor Pricing — Clear, Fixed, Locked at Order
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <PriceTable
            title="APARTMENT UNITS — LABOR ONLY"
            rows={apartmentRows}
          />
          <PriceTable
            title="SINGLE-FAMILY HOMES — LABOR ONLY"
            rows={homesRows}
          />
        </div>

        <div className="max-w-3xl">
          <div className="space-y-2">
            {footnotes.map((footnote, idx) => (
              <p
                key={idx}
                className="font-mono text-xs text-text-muted leading-relaxed"
              >
                <span className="inline-block mr-2">·</span>
                {footnote}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
