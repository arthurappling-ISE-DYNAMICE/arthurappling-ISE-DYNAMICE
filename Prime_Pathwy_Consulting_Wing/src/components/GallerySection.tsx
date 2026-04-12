import Image from 'next/image'

const transformations = [
  {
    label: 'Living Room',
    before: {
      src: '/images/turnovers/living_before.png',
      alt: 'Living room before property turnover — original condition documented for audit record',
    },
    after: {
      src: '/images/turnovers/living_after.png',
      alt: 'Living room after property turnover — fully restored, photographed, and archived',
    },
  },
  {
    label: 'Bathroom',
    before: {
      src: '/images/turnovers/bathroom.png',
      alt: 'Bathroom before and after restoration proof — complete transformation documented for sovereign system archive',
    },
    after: null,
  },
]

export default function GallerySection() {
  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="bg-bg-surface py-24 px-6"
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <p
          className="font-mono text-xs tracking-[0.3em] uppercase mb-4"
          style={{ color: 'rgba(201,168,76,0.4)' }}
          aria-hidden="true"
        >
          DOCUMENTED RESULTS
        </p>
        <h2
          id="gallery-heading"
          className="font-serif text-[28px] md:text-[36px] text-text-primary italic mb-16 max-w-2xl"
        >
          Before &amp; After. Every Job. On Record.
        </h2>

        {/* Transformations */}
        {transformations.map(({ label, before, after }) => (
          <div key={label} className="mb-16">
            <p
              className="font-mono text-xs tracking-[0.2em] uppercase text-gold mb-6"
              aria-hidden="true"
            >
              {label}
            </p>

            {after ? (
              /* Side-by-side before / after */
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-1"
                role="group"
                aria-label={`${label} before and after transformation`}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <Image
                    src={before.src}
                    alt={before.alt}
                    fill
                    className="object-cover object-top"
                  />
                  <span
                    className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.2em] uppercase bg-[#0A0A0A]/80 text-white px-2 py-1"
                    aria-hidden="true"
                  >
                    BEFORE
                  </span>
                </div>
                <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <Image
                    src={after.src}
                    alt={after.alt}
                    fill
                    className="object-cover object-top"
                  />
                  <span
                    className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.2em] uppercase bg-[#0A0A0A]/80 text-gold px-2 py-1"
                    aria-hidden="true"
                  >
                    AFTER
                  </span>
                </div>
              </div>
            ) : (
              /* Single combined image (bathroom composite) */
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/7' }}>
                <Image
                  src={before.src}
                  alt={before.alt}
                  fill
                  className="object-cover object-top"
                />
                <span
                  className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.2em] uppercase bg-[#0A0A0A]/80 text-white px-2 py-1"
                  aria-hidden="true"
                >
                  BEFORE / AFTER
                </span>
              </div>
            )}

            {/* Divider */}
            <div className="mt-8 border-t border-[#1E1E1E]" role="separator" />
          </div>
        ))}

      </div>
    </section>
  )
}
