import { Footer } from '../components/Layout/Footer'
import { Header } from '../components/Layout/Header'
import { HeroSection } from '../components/sections/HeroSection'
import { QuickSearchSection } from '../components/sections/QuickSearchSection'
import { FeaturedProfilesSection } from '../components/sections/FeaturedProfilesSection'
import { HowItWorksSection } from '../components/sections/HowItWorksSection'
import { SuccessStoriesSection } from '../components/sections/SuccessStoriesSection'
import { TrustSection } from '../components/sections/TrustSection'

export function HomePage() {
  return (
    <div className="home-wrapper">
      <Header />
      <HeroSection />
      <QuickSearchSection />
      <FeaturedProfilesSection />
      <HowItWorksSection />
      <SuccessStoriesSection />
      <TrustSection />
      <Footer />
    </div>
  )
}
