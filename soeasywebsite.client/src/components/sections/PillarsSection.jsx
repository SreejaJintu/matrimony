import { pillars } from '../../services/homepageService'

export function PillarsSection() {
  return (
    <section id="pillars" className="section container">
      <div className="section-header">
        <p className="eyebrow">The Three Pillars</p>
      </div>

      <div className="pillar-grid">
        {pillars.map((pillar) => (
          <article className="card pillar-card" key={pillar.title}>
            <div className="pillar-icon">✦</div>
            <h3>{pillar.title}</h3>
            <p>{pillar.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
