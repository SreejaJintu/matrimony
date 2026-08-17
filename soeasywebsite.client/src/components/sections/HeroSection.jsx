import bannerMobile from '../../assets/banner1.jpg'
import bannerTablet from '../../assets/banner2.jpg'
import bannerDesktop from '../../assets/new_banner.jpeg'
import { Link } from 'react-router-dom'
import { ShieldCheck, Lock, Users } from 'lucide-react'

export function HeroSection() {
  return (
    <section id="hero" className="hero-viewport hero-premium">
      <div className="hero-image-layer">
        <picture>
          <source media="(max-width: 768px)" srcSet={bannerMobile} />
          <source media="(max-width: 1024px)" srcSet={bannerTablet} />
          <img className="hero-bg" src={bannerDesktop} alt="Soesy Matrimony hero" />
        </picture>
        <div className="hero-overlay" />
      </div>

      <div className="hero-content container">
        <header className="hero-topline">
          <span className="hero-trust-pill">Trusted by Thousands of Families</span>
        </header>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-eyebrow">Trusted by Thousands of Families</p>
            <h1>Find Your <span>Perfect Life Partner</span></h1>
            <p className="hero-lede">
              Where meaningful connections begin and beautiful stories last forever.
            </p>

            <div className="hero-benefits">
              <div>
                <ShieldCheck className="hero-benefit-icon" />
                <div>
                  <strong>100% Verified</strong>
                  <span>Profiles</span>
                </div>
              </div>
              <div>
                <Lock className="hero-benefit-icon" />
                <div>
                  <strong>Privacy</strong>
                  <span>Protected</span>
                </div>
              </div>
              <div>
                <Users className="hero-benefit-icon" />
                <div>
                  <strong>Trusted by</strong>
                  <span>Thousands</span>
                </div>
              </div>
            </div>

            <div className="hero-actions" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}
