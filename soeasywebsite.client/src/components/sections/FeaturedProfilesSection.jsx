import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { Heart, ShieldCheck } from 'lucide-react'

export function FeaturedProfilesSection() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function fetchProfiles() {
      try {
        setLoading(true)
        const response = await api.searchMatches({})
        if (isMounted) {
          // Response data is the list of matches
          setProfiles(response.data ?? [])
          setLoading(false)
        }
      } catch (error) {
        console.error("Failed to fetch featured profiles:", error)
        if (isMounted) setLoading(false)
      }
    }
    fetchProfiles()
    
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section id="profiles" className="featured-profiles section container">
      <div className="section-header section-header-row">
        <div>
          <p className="eyebrow">Featured Profiles</p>
          <h2>Handpicked for your journey</h2>
        </div>
        <Link className="text-link" to="/matches">
          View All Profiles
        </Link>
      </div>

      <div className="profile-carousel">
        {loading ? (
          <p>Loading profiles...</p>
        ) : profiles.length === 0 ? (
          <p>No featured profiles available.</p>
        ) : (
          profiles.slice(0, 5).map((profile) => {
            const isVerified = Boolean(profile.isVerified || profile.verified || profile.verifiedProfile);
            const image = profile.imageUrl || profile.image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80';
            
            return (
              <article className="featured-card" key={profile.userId || profile.slug}>
                <div className="featured-image">
                  <img src={image} alt={profile.fullName || profile.name} />
                  <div className="featured-image-overlay" />
                  {isVerified && (
                    <div className="featured-badge">
                      <ShieldCheck size={14} /> Verified
                    </div>
                  )}
                  <button type="button" className="favorite-button" aria-label="Add to favorites">
                    <Heart size={18} />
                  </button>
                </div>
                <div className="featured-body">
                  <h3>{profile.fullName || profile.name}</h3>
                  <p className="featured-meta">
                    {profile.age || 'N/A'} Years • {profile.height || 'N/A'}
                  </p>
                  <p className="featured-role">{profile.profession || profile.occupation || 'N/A'}</p>
                  <p className="featured-location">{profile.location || profile.district || profile.state || 'N/A'}</p>
                  <div className="featured-actions">
                    <Link className="button button-primary" to={`/profile-detail/${profile.userId}`}>
                      View Profile
                    </Link>
                  </div>
                </div>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}
