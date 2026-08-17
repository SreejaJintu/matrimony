import { ShieldCheck, BadgeCheck, Users, Headphones } from 'lucide-react'

const trustItems = [
  { icon: ShieldCheck, title: '100% Privacy', copy: 'Your data is safe with us' },
  { icon: BadgeCheck, title: 'Verified Profiles', copy: 'Manually verified for authenticity' },
  { icon: Users, title: 'Trusted by Thousands', copy: 'Families trust Soesy Matrimony' },
  { icon: Headphones, title: '24/7 Support', copy: "We're here to help you" },
]

export function TrustSection() {
  return (
    <section className="trust-strip">
      <div className="container trust-grid">
        {trustItems.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.title} className="trust-item">
              <div className="trust-icon">
                <Icon size={18} />
              </div>
              <div>
                <strong>{item.title}</strong>
                <p>{item.copy}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
