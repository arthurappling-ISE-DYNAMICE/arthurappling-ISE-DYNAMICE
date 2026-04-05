import Nav from '@/components/Nav'
import HeroSection from '@/components/HeroSection'
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
      <Nav />
      <main>
        <HeroSection />
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
