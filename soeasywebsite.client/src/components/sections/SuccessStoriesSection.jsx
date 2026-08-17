import successImage from '../../assets/succes.png'
import { Link } from 'react-router-dom'

export function SuccessStoriesSection() {
  return (
    <section className="success-stories section container">
      <div className="success-grid">
        <div className="success-copy">
          <p className="eyebrow">Success Stories</p>
          <h2>We found each other on Soesy Matrimony</h2>
          <p className="success-quote">
            “We found each other on Soesy Matrimony and today we are living our happy ever after. Thank you for being a part of our journey.”
          </p>
          <p className="success-author">Athul & Divya, Married on 12 Dec 2023</p>
        </div>
        <div className="success-card">
          <img src={successImage} alt="Happy couple" />
        </div>
      </div>
      <div className="register-cta-card">
        <div>
          <p className="eyebrow">Register Now</p>
          <h3>It's quick, easy and absolutely free!</h3>
          <ul>
            <li>Create your profile for FREE</li>
            <li>Browse verified profiles</li>
            <li>Express interest and start connecting</li>
            <li>Find your perfect life partner</li>
          </ul>
        </div>
        <Link className="button button-primary" to="/register">
          Register Free Now
        </Link>
      </div>
    </section>
  )
}
