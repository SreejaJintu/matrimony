import { Sparkles, Search, MessageSquare, HeartHandshake } from 'lucide-react'

const steps = [
  {
    title: 'Create Profile',
    copy: 'Sign up and create your profile in a few simple steps.',
    icon: Sparkles,
  },
  {
    title: 'Search & Connect',
    copy: 'Search profiles that match your preferences and connect.',
    icon: Search,
  },
  {
    title: 'Send Interest',
    copy: 'Express interest and start a meaningful conversation.',
    icon: MessageSquare,
  },
  {
    title: 'Find Your Match',
    copy: 'Build trust, understand each other and find your perfect match.',
    icon: HeartHandshake,
  },
]

export function HowItWorksSection() {
  return (
    <section className="how-it-works section container">
      <div className="section-header">
       
        <h2>How Soesy Matrimony Works?</h2>
      </div>
      <div className="works-grid">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <article key={step.title} className="works-card">
              <div className="works-icon-wrap">
                <div className="works-icon-ring">
                  <Icon size={28} />
                </div>
              </div>
              <h3><span className="step-number">{index + 1}.</span> {step.title}</h3>
              <p>{step.copy}</p>
              {index < steps.length - 1 && (
                <div className="works-connector" aria-hidden />
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
