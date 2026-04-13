// HeadshotPlaceholder — circular gold-ring placeholder for Architect headshot.
// Swap the photo by replacing this component with a real <Image> when ready.
export default function HeadshotPlaceholder() {
  return (
    <section
      aria-labelledby="headshot-heading"
      className="bg-bg-base px-6"
      style={{ paddingTop: '96px', paddingBottom: '96px', borderTop: '1px solid #141414' }}
    >
      <div className="flex flex-col items-center text-center">

        {/* Gold ring — swap background + inner content for real photo */}
        <div
          role="img"
          aria-label="Headshot placeholder — professional photo coming soon"
          style={{
            width: 160,
            height: 160,
            borderRadius: '50%',
            border: '2px solid #C9A84C',
            boxShadow: '0 0 0 6px rgba(201,168,76,0.08), 0 0 32px rgba(201,168,76,0.18)',
            background: 'rgba(201,168,76,0.04)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            marginBottom: 24,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Inner top glow — studio highlight */}
          <div
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '50%',
              background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.08), transparent)',
            }}
            aria-hidden="true"
          />
          <span
            className="font-mono uppercase"
            style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(201,168,76,0.5)', position: 'relative' }}
          >
            Photo
          </span>
          <span
            className="font-mono"
            style={{ fontSize: 8, letterSpacing: '0.12em', color: 'rgba(201,168,76,0.3)', position: 'relative' }}
          >
            Swap in later
          </span>
        </div>

        {/* Name — Inter 800, -0.04em display tracking */}
        <h2
          id="headshot-heading"
          className="font-sans text-text-primary mb-2"
          style={{
            fontWeight: 'var(--display-weight)',
            letterSpacing: 'var(--display-tracking)',
            lineHeight: 'var(--display-leading)',
            fontSize: 22,
          }}
        >
          Arthur F. Appling Sr.
        </h2>

        <p
          className="font-mono uppercase"
          style={{ fontSize: 11, letterSpacing: '0.22em', color: 'rgba(201,168,76,0.55)' }}
        >
          Architect · AA Capital INC dba Prime Pathwy
        </p>

      </div>
    </section>
  )
}
