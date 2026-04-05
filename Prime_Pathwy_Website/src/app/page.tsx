import Nav from '@/components/Nav'
import HeroSection from '@/components/HeroSection'
import SystemSection from '@/components/SystemSection'
import LifecycleSection from '@/components/LifecycleSection'
import DocumentationSection from '@/components/DocumentationSection'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <SystemSection />
        <LifecycleSection />
        <DocumentationSection />
      </main>
    </>
  )
}
