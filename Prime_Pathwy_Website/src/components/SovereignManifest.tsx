// Prime_Pathwy_Website/src/components/SovereignManifest.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

// ── 4 Pillars of the Sovereign System ──────────────────────────────────────
const pillars = [
  {
    num: '01',
    name: 'Custom Digital Presence',
    tag: 'Professional Website & Domain Ownership',
    icon: '◈',
    body: 'Your brand. Your domain. Your infrastructure. Not a Wix template or a rented landing page that disappears the moment you stop paying. A professional digital presence engineered to institutional standards — and owned by you, outright, in perpetuity.',
  },
  {
    num: '02',
    name: 'The Black Box',
    tag: 'GitHub — 100% Ownership of Your Business Code & Logic',
    icon: '⬡',
    body: 'Every workflow, every automation, every script — version-controlled and archived in your private GitHub repository. When the engagement closes, you hold the keys. No vendor lock-in. No hostage software. No dependency on us to operate your own system.',
  },
  {
    num: '03',
    name: 'Operational SOP Library',
    tag: 'Audit-Ready Documentation for Your Specific Industry',
    icon: '◎',
    body: 'We document your operation from the ground up. Step-by-step SOPs, role definitions, decision trees, and checklists — formatted for audit readiness and written for your specific industry vertical. Your operation runs the same whether you are in the room or not.',
  },
  {
    num: '04',
    name: 'Automation Engine',
    tag: 'Lead-to-Invoice Systems That Run While You Sleep',
    icon: '⚙',
    body: 'End-to-end automation from first contact to final payment. Lead capture, intake routing, contract generation, and invoice delivery — all triggered without a human hand touching them. Your operation earns while you are off the clock.',
  },
]

export default function SovereignManifest() {
  const [manifestOpen, setManifestOpen] = useState(false)
  const [consultationRequested, setConsultationRequested] = useState(false)
  const manifestRef = useRef<HTMLDivElement>(null)

  // Scroll manifest into view when it opens
  useEffect(() => {
    if (manifestOpen && manifestRef.current) {
      manifestRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [manifestOpen])

  function handleInstallClick() {
    setManifestOpen((prev) => !prev)
    setConsultationRequested(false)
  }

  function handleConsultationRequest() {
    setConsultationRequested(true)
  }

  return (
    <section
      id="consulting-inquiry"
      aria-labelledby="manifest-section-heading"
      className="bg-[#0A0A0A] border-t border-[#1E1E1E]"
    >
      {/* ── Service Menu ─────────────────────────────────────────────────── */}
      <div className="px-6 md:px-16 py-16 max-w-6xl mx-auto">
        <p
          className="font-mono text-[10px] tracking-[0.4em] uppercase mb-6"
          style={{ color: 'rgba(201,168,76,0.45)' }}
          aria-hidden="true"
        >
          Section 04 — Select Your Engagement
        </p>
        <h2
          id="manifest-section-heading"
          className="font-serif italic text-2xl md:text-4xl text-gold mb-4 max-w-2xl"
        >
          Every Operation Has a Starting Point.
        </h2>
        <p className="font-mono text-sm text-white/50 max-w-xl mb-12 leading-relaxed">
          Choose the engagement that matches where your operation is right now.
        </p>

        {/* 3 service buttons */}
        <div
          role="group"
          aria-label="Consulting service selection"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          {/* ── Sovereign System Install — triggers manifest ── */}
          <motion.button
            onClick={handleInstallClick}
            aria-expanded={manifestOpen}
            aria-controls="sovereign-manifest-detail"
            className="font-mono text-xs tracking-[0.2em] uppercase px-5 py-5 text-left border"
            style={
              manifestOpen
                ? {
                    color: '#0A0A0A',
                    background: '#C9A84C',
                    borderColor: '#C9A84C',
                    boxShadow: '0 0 18px rgba(201,168,76,0.5)',
                  }
                : {
                    color: '#C9A84C',
                    background: 'rgba(201,168,76,0.06)',
                    borderColor: 'rgba(201,168,76,0.35)',
                  }
            }
            whileHover={{
              y: -5,
              boxShadow: manifestOpen
                ? '0 0 30px rgba(201,168,76,0.8), 0 0 60px rgba(201,168,76,0.35), 0 10px 24px rgba(0,0,0,0.5)'
                : '0 0 24px rgba(201,168,76,0.55), 0 0 50px rgba(201,168,76,0.2), 0 10px 24px rgba(0,0,0,0.5)',
              borderColor: 'rgba(201,168,76,0.9)',
            }}
            whileTap={{ scale: 0.97, y: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
          >
            <span className="block text-[9px] tracking-[0.3em] mb-2 opacity-60">
              SVC — 01
            </span>
            Sovereign System Install
            <span
              className="block text-[9px] tracking-[0.2em] mt-2 opacity-70"
              aria-hidden="true"
            >
              {manifestOpen ? '▲ COLLAPSE MANIFEST' : '▼ VIEW MANIFEST'}
            </span>
          </motion.button>

          {/* ── Operational Autopsy ── */}
          <a
            href="mailto:contact@primepathwy.com?subject=Operational%20Autopsy%20Inquiry"
            aria-label="Operational Autopsy — failure analysis and root cause diagnosis"
            className="font-mono text-xs tracking-[0.2em] uppercase text-gold border border-gold/30 px-5 py-5 text-left hover:bg-gold/10 hover:border-gold/60 transition-colors duration-200"
          >
            <span className="block text-[9px] tracking-[0.3em] mb-2 opacity-50">
              SVC — 02
            </span>
            Operational Autopsy
            <span className="block text-[9px] tracking-[0.2em] mt-2 opacity-50">
              FAILURE ANALYSIS
            </span>
          </a>

          {/* ── Consulting Inquiry ── */}
          <a
            href="mailto:contact@primepathwy.com?subject=Consulting%20Inquiry"
            aria-label="Consulting Inquiry — submit your operational profile for review"
            className="font-mono text-xs tracking-[0.2em] uppercase text-gold border border-gold/30 px-5 py-5 text-left hover:bg-gold/10 hover:border-gold/60 transition-colors duration-200"
          >
            <span className="block text-[9px] tracking-[0.3em] mb-2 opacity-50">
              SVC — 03
            </span>
            Consulting Inquiry
            <span className="block text-[9px] tracking-[0.2em] mt-2 opacity-50">
              DIRECT ENGAGEMENT
            </span>
          </a>
        </div>
      </div>

      {/* ── Sovereign Manifest — expands on SSI click ──────────────────── */}
      <div
        id="sovereign-manifest-detail"
        ref={manifestRef}
        role="region"
        aria-label="Sovereign System Install — full manifest"
        aria-hidden={!manifestOpen}
        className="overflow-hidden transition-all duration-500"
        style={{ maxHeight: manifestOpen ? '9999px' : '0' }}
      >
        <div className="bg-[#0D0D0D] border-t border-gold/20">

          {/* ── Old School → New System framing ────────────────────────── */}
          <div className="px-6 md:px-16 pt-16 pb-12 max-w-6xl mx-auto border-b border-[#1A1A1A]">
            <p
              className="font-mono text-[9px] tracking-[0.45em] uppercase mb-6"
              style={{ color: 'rgba(201,168,76,0.4)' }}
              aria-hidden="true"
            >
              The Sovereign Manifest — Full System Build-Out
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="font-serif italic text-3xl md:text-4xl text-gold mb-6 leading-snug">
                  We Take Your Old School Operation<br />
                  and Engineer It Into This.
                </h3>
                <p className="font-mono text-sm text-white/55 leading-relaxed mb-4">
                  You built this operation on instinct, handshakes, and institutional memory
                  locked inside your head. That knowledge is real. The problem is it only runs
                  when you are in the room.
                </p>
                <p className="font-mono text-sm text-white/55 leading-relaxed">
                  We do not tear down what you built. We engineer it. Every process running
                  in your head becomes a documented SOP. Every deal you close on trust becomes
                  a system that closes without you.{' '}
                  <span className="text-gold/70">
                    Old School wisdom. Sovereign infrastructure.
                  </span>
                </p>
              </div>
              <div
                className="border border-gold/20 p-8"
                style={{ background: 'rgba(201,168,76,0.03)' }}
              >
                <p
                  className="font-mono text-[9px] tracking-[0.35em] uppercase text-gold/40 mb-5"
                  aria-hidden="true"
                >
                  What You Have Now
                </p>
                {[
                  'Processes that live in your head',
                  'Deals closed on personal relationships',
                  'Revenue tied to your physical presence',
                  'No documentation — no handoff',
                  'Every mistake happens twice',
                ].map((item) => (
                  <p
                    key={item}
                    className="font-mono text-xs text-white/30 mb-2 flex items-start gap-3"
                  >
                    <span className="text-white/20 mt-px" aria-hidden="true">✗</span>
                    {item}
                  </p>
                ))}
                <div className="border-t border-[#1E1E1E] my-6" aria-hidden="true" />
                <p
                  className="font-mono text-[9px] tracking-[0.35em] uppercase text-gold/60 mb-5"
                  aria-hidden="true"
                >
                  What You Have After
                </p>
                {[
                  'Documented SOPs — operation runs without you',
                  'Systems that close deals on your behalf',
                  'Revenue that runs while you sleep',
                  'Full audit trail — 24 months minimum',
                  'Every mistake has a fix protocol',
                ].map((item) => (
                  <p
                    key={item}
                    className="font-mono text-xs text-gold/70 mb-2 flex items-start gap-3"
                  >
                    <span className="text-gold/40 mt-px" aria-hidden="true">✓</span>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* ── 4 Pillars ──────────────────────────────────────────────── */}
          <div className="px-6 md:px-16 py-16 max-w-6xl mx-auto">
            <p
              className="font-mono text-[9px] tracking-[0.45em] uppercase mb-12"
              style={{ color: 'rgba(201,168,76,0.4)' }}
              aria-hidden="true"
            >
              The 4 Pillars of the Sovereign System
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pillars.map((pillar) => (
                <div
                  key={pillar.num}
                  className="border border-[#1E1E1E] p-8 hover:border-gold/30 transition-colors duration-300"
                  style={{ background: '#0A0A0A' }}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p
                        className="font-mono text-[9px] tracking-[0.35em] uppercase mb-2"
                        style={{ color: 'rgba(201,168,76,0.45)' }}
                        aria-hidden="true"
                      >
                        Pillar {pillar.num}
                      </p>
                      <h4 className="font-serif italic text-xl md:text-2xl text-gold leading-tight">
                        {pillar.name}
                      </h4>
                    </div>
                    <span
                      className="text-gold/20 text-3xl ml-4 mt-1 flex-shrink-0"
                      aria-hidden="true"
                    >
                      {pillar.icon}
                    </span>
                  </div>

                  {/* Tag */}
                  <p
                    className="font-mono text-[9px] tracking-[0.25em] uppercase text-gold/50 mb-4 border-l-2 border-gold/30 pl-3"
                  >
                    {pillar.tag}
                  </p>

                  {/* Body */}
                  <p className="font-mono text-sm text-white/55 leading-relaxed">
                    {pillar.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Consultation Request ────────────────────────────────────── */}
          <div
            className="border-t border-[#1A1A1A] px-6 md:px-16 py-16"
            style={{ background: '#080808' }}
          >
            <div className="max-w-2xl mx-auto text-center">

              {consultationRequested ? (
                /* ── Confirmation State ── */
                <div
                  role="status"
                  aria-live="polite"
                  className="border border-gold/30 p-10"
                  style={{ background: 'rgba(201,168,76,0.04)' }}
                >
                  <p
                    className="font-mono text-[9px] tracking-[0.45em] uppercase text-gold/50 mb-6"
                    aria-hidden="true"
                  >
                    Request Received
                  </p>
                  <p className="font-serif italic text-2xl md:text-3xl text-gold mb-6 leading-snug">
                    Consultation Request Submitted.
                  </p>
                  <p className="font-mono text-sm text-white/60 leading-relaxed mb-4">
                    My team will review your diagnostic and get back to you within 72 hours.
                  </p>
                  <p className="font-mono text-xs text-white/30 leading-relaxed">
                    No intake calls. No discovery calls. A direct response from the Architect.
                  </p>
                  <div
                    className="mt-8 w-12 mx-auto border-t border-gold/30"
                    aria-hidden="true"
                    style={{ boxShadow: '0 0 8px rgba(201,168,76,0.3)' }}
                  />
                </div>
              ) : (
                /* ── Request State ── */
                <>
                  <p
                    className="font-mono text-[9px] tracking-[0.45em] uppercase mb-6"
                    style={{ color: 'rgba(201,168,76,0.4)' }}
                    aria-hidden="true"
                  >
                    Investment — $5,000
                  </p>
                  <h3 className="font-serif italic text-2xl md:text-3xl text-gold mb-4">
                    Ready to Operate at the Sovereign Level?
                  </h3>
                  <p className="font-mono text-sm text-white/50 leading-relaxed mb-10">
                    This is not a sales call. This is a diagnostic. We review your current
                    operation, identify every system gap, and return a documented build plan.
                    The $5,000 investment applies in full toward your Sovereign System Install.
                  </p>
                  <button
                    onClick={handleConsultationRequest}
                    aria-label="Request Sovereign Diagnostic for five thousand dollars"
                    className="font-mono text-sm tracking-[0.2em] uppercase text-[#0A0A0A] bg-gold px-10 py-5 font-bold w-full md:w-auto transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                    style={{
                      boxShadow:
                        '0 0 20px rgba(201,168,76,0.6), 0 0 50px rgba(201,168,76,0.25), 0 0 80px rgba(201,168,76,0.1), inset 0 1px 0 rgba(255,255,255,0.15)',
                    }}
                  >
                    [ Request Sovereign Diagnostic — $5,000 ]
                  </button>
                  <p className="font-mono text-[9px] text-white/20 mt-6 tracking-[0.15em]">
                    Response within 72 hours · No intake call required
                  </p>
                </>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
