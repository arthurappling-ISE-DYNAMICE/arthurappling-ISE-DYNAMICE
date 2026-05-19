// HeadshotPlaceholder — Architect portrait · rectangular gold-border frame
import Image from 'next/image'

export default function HeadshotPlaceholder() {
  return (
    <section
      aria-labelledby="headshot-heading"
      className="bg-bg-base px-6"
      style={{ paddingTop: '96px', paddingBottom: '96px', borderTop: '1px solid #141414' }}
    >
      <div className="flex flex-col items-center text-center">

        {/* Gold-border portrait frame */}
        <div
          style={{
            border: '2px solid #C9A84C',
            boxShadow: '0 0 0 6px rgba(201,168,76,0.08), 0 0 40px rgba(201,168,76,0.14)',
            background: '#0D0D0D',
            width: 260,
            height: 320,
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 28,
          }}
        >
          <Image
            src="/images/architect_hero.jpg"
            alt="Arthur F. Appling Sr. — Lead Architect, AA Capital INC dba Prime Pathwy"
            fill
            className="object-cover object-top"
            priority
          />
        </div>

        {/* Formal label */}
        <h2
          id="headshot-heading"
          className="font-sans text-text-primary mb-2"
          style={{
            fontWeight: 'var(--display-weight)',
            letterSpacing: 'var(--display-tracking)',
            lineHeight: 'var(--display-leading)',
            fontSize: 20,
          }}
        >
          Arthur F. Appling Sr.
        </h2>

        <p
          className="font-mono uppercase"
          style={{ fontSize: 11, letterSpacing: '0.22em', color: 'rgba(201,168,76,0.65)' }}
        >
          Lead Architect · AA Capital INC dba Prime Pathwy
        </p>

      </div>
    </section>
  )
}
