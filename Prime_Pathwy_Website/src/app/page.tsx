// ─── PRODUCTION GOLD MASTER — v1.0 — 2026-04-05 ────────────────────────────
// DO NOT MODIFY WITHOUT ARCHITECT APPROVAL — Arthur F. Appling Sr.
// ─────────────────────────────────────────────────────────────────────────────
import Nav from '@/components/Nav'
import HeroSection from '@/components/HeroSection'
import GallerySection from '@/components/GallerySection'
import SystemSection from '@/components/SystemSection'
import LifecycleSection from '@/components/LifecycleSection'
import DocumentationSection from '@/components/DocumentationSection'
import PricingSection from '@/components/PricingSection'
import AgreementSection from '@/components/AgreementSection'
import OrderSection from '@/components/OrderSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <header>
        <Nav />
      </header>
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <GallerySection />
        <SystemSection />
        <LifecycleSection />
        <DocumentationSection />
        <PricingSection />
        <AgreementSection />
        <OrderSection />
      </main>
      <Footer />
    </>
  )
}
