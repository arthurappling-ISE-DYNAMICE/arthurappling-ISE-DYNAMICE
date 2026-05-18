// Prime_Pathwy_Consulting_Wing/src/components/SiteStateManager.tsx
'use client'

import { useState } from 'react'
import Nav from '@/components/Nav'
import HeroSection from '@/components/HeroSection'
import GallerySection from '@/components/GallerySection'
import SystemSection from '@/components/SystemSection'
import LifecycleSection from '@/components/LifecycleSection'
import DocumentationSection from '@/components/DocumentationSection'
import PricingSection from '@/components/PricingSection'
import AgreementSection from '@/components/AgreementSection'
import OrderSection from '@/components/OrderSection'
import HeadshotPlaceholder from '@/components/HeadshotPlaceholder'
import Footer from '@/components/Footer'
import ConsultingSection from '@/components/ConsultingSection'

export default function SiteStateManager() {
  const [consultingActive, setConsultingActive] = useState(false)

  function handleToggle() {
    setConsultingActive((prev) => !prev)
    // Scroll to top on state switch for clean UX
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <header>
        <Nav
          consultingActive={consultingActive}
          onConsultingToggle={handleToggle}
        />
      </header>

      <main id="main-content" tabIndex={-1}>
        {consultingActive ? (
          <ConsultingSection />
        ) : (
          <>
            <HeroSection />
            <GallerySection />
            <SystemSection />
            <LifecycleSection />
            <DocumentationSection />
            <PricingSection />
            <AgreementSection />
            <OrderSection />
            <HeadshotPlaceholder />
          </>
        )}
      </main>

      <Footer />
    </>
  )
}
