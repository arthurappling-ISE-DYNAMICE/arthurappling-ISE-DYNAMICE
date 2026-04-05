'use client'

import Image from 'next/image'
import { useState } from 'react'
import LegalModal from './LegalModal'

type ModalKey = 'mission' | 'privacy' | 'terms' | 'accessibility' | null

export default function Footer() {
  const [open, setOpen] = useState<ModalKey>(null)

  return (
    <>
      <footer className="bg-bg-base border-t border-gold py-10 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">

          {/* Main three-column row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-8">

            {/* Column 1: Brand */}
            <div>
              <Image
                src="/logo.png"
                alt="Prime Pathwy official seal"
                width={40}
                height={40}
                className="rounded-full mb-4"
              />
              <p className="font-serif text-gold text-sm mb-4">PRIME PATHWY</p>
              <p className="font-mono text-xs text-gold">
                © 2026 PRIME PATHWY CONSULTING AA
              </p>
              <p className="font-mono text-xs text-gold mt-1">
                A SOVEREIGN EMPIRE INSTALLATION
              </p>
            </div>

            {/* Column 2: System Declaration — now high-contrast */}
            <div>
              <p className="font-mono text-xs text-white/90 leading-relaxed italic">
                This operating structure ensures alignment, defensibility, audit
                readiness, and scalability.
              </p>
            </div>

            {/* Column 3: Contact */}
            <div className="md:text-right">
              <p className="font-mono text-xs text-white/60 mb-2">Contact</p>
              <p className="font-mono text-xs text-gold">info@primepathwy.com</p>
            </div>

          </div>

          {/* Divider */}
          <div className="border-t border-[#1E1E1E] mb-6" />

          {/* Link row */}
          <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
            {([
              { key: 'mission',       label: 'Sovereign Mission',      ariaLabel: 'Read the Prime Pathwy Sovereign Mission statement' },
              { key: 'privacy',       label: 'Privacy Policy',         ariaLabel: 'Read the Prime Pathwy Privacy Policy' },
              { key: 'terms',         label: 'Terms of Service',       ariaLabel: 'Read the Prime Pathwy Terms of Service' },
              { key: 'accessibility', label: 'Accessibility Statement', ariaLabel: 'Read the Prime Pathwy Accessibility Statement' },
            ] as { key: ModalKey; label: string; ariaLabel: string }[]).map(({ key, label, ariaLabel }) => (
              <button
                key={key}
                onClick={() => setOpen(key)}
                aria-label={ariaLabel}
                className="font-mono text-xs tracking-[0.15em] uppercase text-white/60 hover:text-gold transition-colors duration-200"
              >
                {label}
              </button>
            ))}
          </div>

        </div>
      </footer>

      {/* ── Modals ── */}
      {open === 'mission' && (
        <LegalModal title="Sovereign Mission" onClose={() => setOpen(null)}>
          <p className="text-gold font-serif text-base italic not-italic" style={{ fontFamily: 'Georgia, serif', fontSize: '15px' }}>
            Transform &ldquo;Messy Operations&rdquo; into &ldquo;Sovereign Systems.&rdquo;
          </p>
          <p>
            Prime Pathwy exists to eliminate the chaos that property managers, landlords, and
            real estate operators tolerate as normal. Every unrecorded job is a liability.
            Every undocumented turnover is an assumption. We end both.
          </p>
          <p>
            Our mission is to transform disorganized property turnovers into Sovereign Systems
            through the 15-Step Ahead consulting model, prioritizing $5,000+ installations and
            100% audit-readiness. We do this through institutional-grade systems: scope locked
            before work begins, verification gates before high-value jobs, and a permanent
            photographic record delivered with every order.
          </p>
          <p>
            This is not a cleaning service. This is infrastructure.
          </p>
          <div className="border-t border-[#1E1E1E] pt-4 mt-4">
            <p className="text-gold/70">Architect</p>
            <p>Arthur F. Appling Sr. — Lead Technical Architect, Prime Pathwy Consulting AA</p>
          </div>
          <div className="border-t border-[#1E1E1E] pt-4 mt-4">
            <p className="text-gold/70 mb-2">The WAT Framework</p>
            <p><span className="text-gold">W</span> — Workflows. Every operation is documented before it runs.</p>
            <p><span className="text-gold">A</span> — Agents. Every team member operates from a defined prompt.</p>
            <p><span className="text-gold">T</span> — Tools. Every script, form, and invoice is versioned and archived.</p>
          </div>
        </LegalModal>
      )}

      {open === 'privacy' && (
        <LegalModal title="Privacy Policy" onClose={() => setOpen(null)}>
          <p className="text-gold/70">Effective Date: January 1, 2026</p>
          <p>
            Prime Pathwy Consulting AA (&ldquo;Prime Pathwy,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) collects only the
            information necessary to process your service order and fulfill our verification
            and scheduling obligations.
          </p>
          <p className="text-gold/70 mt-4">Information We Collect</p>
          <p>Name, property address, contact information, and payment data submitted through
          the order form. Payment data is processed by Stripe and never stored on our servers.</p>
          <p className="text-gold/70 mt-4">How We Use It</p>
          <p>To schedule and perform your property turnover, issue receipts, and maintain job
          archive records. We do not sell, rent, or share your information with third parties
          outside of service delivery.</p>
          <p className="text-gold/70 mt-4">Data Retention</p>
          <p>Job records including photographs and order confirmations are retained for a
          minimum of 24 months for audit and dispute resolution purposes.</p>
          <p className="text-gold/70 mt-4">Contact</p>
          <p>info@primepathwy.com</p>
        </LegalModal>
      )}

      {open === 'accessibility' && (
        <LegalModal title="Accessibility Statement" onClose={() => setOpen(null)}>
          <p className="text-gold/70">Effective Date: January 1, 2026</p>
          <p>
            Prime Pathwy Consulting AA is committed to ensuring digital accessibility for
            people with disabilities. We continually improve the user experience for everyone
            and apply relevant accessibility standards.
          </p>
          <p className="text-gold/70 mt-4">Conformance Status</p>
          <p>
            This site targets conformance with the{' '}
            <span className="text-gold">Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</span>.
            We use semantic HTML5 landmarks, descriptive alt text on all images, ARIA labels
            on interactive elements, keyboard navigation support, and sufficient color contrast
            throughout.
          </p>
          <p className="text-gold/70 mt-4">Features</p>
          <p>— Skip to main content link for keyboard users</p>
          <p>— All images carry descriptive alt text</p>
          <p>— Interactive elements include ARIA labels and focus indicators</p>
          <p>— Page uses semantic landmarks: header, nav, main, section, footer</p>
          <p>— CCPA-compliant cookie consent with keyboard-accessible controls</p>
          <p>— Modals trap focus and close on Escape key</p>
          <p className="text-gold/70 mt-4">Known Limitations</p>
          <p>
            Some third-party components (Stripe Payment Elements) are provided by an external
            vendor. We work to ensure these meet accessibility standards but cannot fully
            control their implementation.
          </p>
          <p className="text-gold/70 mt-4">Feedback &amp; Contact</p>
          <p>
            We welcome feedback on the accessibility of this site. If you experience barriers,
            please contact us at{' '}
            <a
              href="mailto:info@primepathwy.com"
              className="text-gold underline underline-offset-2"
              aria-label="Send accessibility feedback to Prime Pathwy"
            >
              info@primepathwy.com
            </a>
            . We aim to respond within 2 business days.
          </p>
          <p className="text-gold/70 mt-4">Formal Complaints</p>
          <p>
            If you are not satisfied with our response, you may contact the{' '}
            <span className="text-gold">California Department of Rehabilitation</span> or file
            a complaint with the U.S. Department of Justice.
          </p>
        </LegalModal>
      )}

      {open === 'terms' && (
        <LegalModal title="Terms of Service" onClose={() => setOpen(null)}>
          <p className="text-gold/70">Effective Date: January 1, 2026</p>
          <p>
            By placing an order with Prime Pathwy Consulting AA you agree to the following terms.
            All work is performed under a locked scope. No scope changes are accepted after
            payment is submitted without a written amendment.
          </p>
          <p className="text-gold/70 mt-4">Payment</p>
          <p>A non-refundable deposit is required to initiate scheduling. Final payment is
          due upon job completion. All prices are labor-only unless otherwise stated.
          Disposal and extreme-condition surcharges are billed separately.</p>
          <p className="text-gold/70 mt-4">Verification Gate</p>
          <p>Orders of $1,000 or more require identity and authority verification at least
          1 business day before the scheduled service date. Jobs that cannot be verified
          will be rescheduled without penalty.</p>
          <p className="text-gold/70 mt-4">Cancellation</p>
          <p>Cancellations made more than 48 hours before scheduled service: deposit
          applied to rescheduled job. Cancellations under 48 hours: deposit forfeited.</p>
          <p className="text-gold/70 mt-4">Limitation of Liability</p>
          <p>Prime Pathwy&apos;s liability is limited to the value of the order placed.
          We are not liable for pre-existing property conditions documented in our
          pre-job photographic record.</p>
          <p className="text-gold/70 mt-4">Governing Law</p>
          <p>These terms are governed by the laws of the State of California, USA.</p>
        </LegalModal>
      )}
    </>
  )
}
