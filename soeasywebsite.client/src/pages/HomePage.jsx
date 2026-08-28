import { useState } from 'react'
import { Footer } from '../components/Layout/Footer'
import { Header } from '../components/Layout/Header'
import { HeroSection } from '../components/sections/HeroSection'
import { QuickSearchSection } from '../components/sections/QuickSearchSection'
import { FeaturedProfilesSection } from '../components/sections/FeaturedProfilesSection'
import { HowItWorksSection } from '../components/sections/HowItWorksSection'
import { SuccessStoriesSection } from '../components/sections/SuccessStoriesSection'
import { TrustSection } from '../components/sections/TrustSection'
import { ViewProfileModal } from '../components/forms/ViewProfileModal'

export function HomePage() {
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false)

  return (
    <div className="home-wrapper">
      <Header />
      <HeroSection />
      <QuickSearchSection />
      <FeaturedProfilesSection onViewProfile={() => setIsMembershipModalOpen(true)} />
      <HowItWorksSection />
      <SuccessStoriesSection />
      <TrustSection />
      <Footer />
      <ViewProfileModal
        isOpen={isMembershipModalOpen}
        onClose={() => setIsMembershipModalOpen(false)}
        onBecomeMember={() => {
          setIsMembershipModalOpen(false)
          window.location.assign('/subscription')
        }}
      />
    </div>
  )
}
