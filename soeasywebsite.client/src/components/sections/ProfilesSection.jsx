import { Link } from 'react-router-dom'
import { profiles } from '../../services/homepageService'

export function ProfilesSection() {
  return (
    <section id="profiles" className="section container">
      <div className="section-header section-header-row">
        <div>
          <h2 className="section-title">Refined Matches</h2>
        </div>
        <a className="text-link" href="#footer">
          View Member Catalog
        </a>
      </div>

      <div className="profile-grid">
        {profiles.map((profile) => (
          <article className="profile-card" key={profile.name}>
            <div className="profile-image-wrap">
              <img src={profile.image} alt={`${profile.name} portrait`} />
            </div>

            <div className="profile-body">
              <div className="profile-meta">
                <h3>
                  {profile.name}, {profile.age}
                </h3>
                <p>
                  {profile.role} • {profile.location}
                </p>
              </div>

              <div className="profile-actions">
                <Link className="button button-card" to={`/profile/${profile.slug}`}>
                  View Full Portfolio
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
