import { ShieldCheck, Lock, Users, Sparkles } from 'lucide-react'
import heroImage from '../../assets/heromatri.png'

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: '100% Verified Profiles',
    text: 'All profiles are verified manually for genuine connections.',
  },
  {
    icon: Lock,
    title: 'Privacy Protected',
    text: 'Your privacy is our priority. Your data is safe with us.',
  },
  {
    icon: Users,
    title: 'Trusted by Thousands',
    text: 'Join thousands of successful couples who found their perfect match.',
  },
  {
    icon: Sparkles,
    title: 'Advanced Matching',
    text: 'Our matching system helps you find compatible matches.',
  },
]

export const RegistrationBenefits = () => {
  return (
    <aside className="reg-benefits">
      <div className="reg-benefits-image">
        <img src={heroImage} alt="Wedding couple celebrating their matrimony" />
      </div>
      <div className="reg-benefits-card">
        <h3>Why Join GSeven Matrimony?</h3>
        <ul className="reg-benefits-list">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="reg-benefit-item">
              <span className="reg-benefit-icon">
                <Icon size={20} />
              </span>
              <div>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
