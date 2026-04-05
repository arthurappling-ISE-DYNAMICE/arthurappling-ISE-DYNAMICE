import Nav from '@/components/Nav'
import HeroSection from '@/components/HeroSection'
import SystemSection from '@/components/SystemSection'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <SystemSection />
      </main>
    </>
  )
}
