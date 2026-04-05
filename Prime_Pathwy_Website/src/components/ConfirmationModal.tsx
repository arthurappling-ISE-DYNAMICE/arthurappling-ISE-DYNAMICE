import Image from 'next/image'

export default function ConfirmationModal() {
  return (
    <div role="status" className="max-w-2xl mx-auto text-center py-12">
      {/* Medallion Logo */}
      <Image
        src="/logo.png"
        alt="Prime Pathwy — Order Confirmed"
        width={80}
        height={80}
        className="rounded-full mx-auto mb-6"
      />

      {/* Eyebrow */}
      <p className="font-mono text-xs tracking-[0.3em] uppercase text-gold mb-4">
        ORDER RECORDED
      </p>

      {/* Headline */}
      <h3 className="font-serif text-[24px] text-text-primary italic mb-8">
        Your order is in the system. We leave no doubt.
      </h3>

      {/* Status Box */}
      <div className="border border-border-subtle bg-bg-base p-6 text-left space-y-3 mb-8">
        <p className="font-mono text-xs text-text-secondary">
          · Your payment has been captured and timestamped.
        </p>
        <p className="font-mono text-xs text-text-secondary">
          · Verification will be initiated within{' '}
          <span className="text-text-primary">1 business day</span> before
          scheduling is confirmed.
        </p>
        <p className="font-mono text-xs text-text-secondary">
          · A confirmation receipt has been sent to your email by Stripe.
        </p>
        <p className="font-mono text-xs text-text-secondary">
          · Before, during, and after photos will be documented and archived
          for your records.
        </p>
      </div>

      {/* Closing Tagline */}
      <p
        className="font-mono text-xs tracking-[0.3em] uppercase"
        className="text-gold"
        aria-label="Prime Pathwy Operating Standard: If it is not documented, it did not occur."
      >
        Prime Pathwy Operating Standard · If it is not documented, it did not
        occur.
      </p>
    </div>
  )
}
