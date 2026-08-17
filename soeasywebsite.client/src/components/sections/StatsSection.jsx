import { stats } from '../../services/homepageService'

export function StatsSection() {
  return (
    <section className="stats-band">
      <div className="stats-grid">
        {stats.map(([value, label]) => (
          <div key={label} className="stat">
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
