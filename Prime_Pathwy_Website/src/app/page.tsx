import Nav from '@/components/Nav'
import HeroSection from '@/components/HeroSection'
import SystemSection from '@/components/SystemSection'
import LifecycleSection from '@/components/LifecycleSection'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <SystemSection />
        <LifecycleSection />
      </main>
    </>
  )
}
