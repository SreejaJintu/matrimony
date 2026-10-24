import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { Heart, ShieldCheck } from 'lucide-react'
import { getProfileImageUrl, handleProfileImageError } from '../../utils/profileImage'

export function FeaturedProfilesSection({ onViewProfile }) {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  useEffect(() => {
    let isMounted = true
    async function fetchProfiles() {
      try {
        setLoading(true)
        const response = await api.getFeaturedProfiles()
        if (isMounted) {
          // Response data is the list of matches
          const featuredProfiles = response?.data ?? response?.Data ?? []
          setProfiles(Array.isArray(featuredProfiles) ? featuredProfiles : [])
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

  useEffect(() => {
    setCurrentPage(1)
  }, [profiles])

  const pageCount = Math.ceil(profiles.length / pageSize)
  const pageProfiles = profiles.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <section id="profiles" className="featured-profiles section container">
      <div className="section-header section-header-row">
        <div>
          <p className="eyebrow">Featured Profiles</p>
          <h2>Handpicked for your journey</h2>
        </div>
        <Link className="text-link" to="/matches">
          View Matched Profiles
        </Link>
      </div>

      <div className="profile-carousel">
        {loading ? (
          <p>Loading profiles...</p>
        ) : profiles.length === 0 ? (
          <p>No featured profiles available.</p>
        ) : (
          pageProfiles.map((profile) => {
            const isVerified = Boolean(profile.isVerified || profile.verified || profile.verifiedProfile);
            const image = getProfileImageUrl(profile.imageUrl || profile.image)
            const locationText = [profile.district, profile.state].filter(Boolean).join(', ') || profile.location || 'N/A';
            
            return (
              <article className="featured-card" key={profile.userId || profile.slug}>
                <div className="featured-image">
                  <img
                    src={image}
                    alt={profile.fullName || profile.name}
                    onError={handleProfileImageError}
                  />
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
                    {profile.age ? `${profile.age} Years` : 'N/A'} {profile.height ? `• ${profile.height}` : ''}
                  </p>
                  <p className="featured-role">{profile.profession || profile.occupation || 'N/A'}</p>
                  <p className="featured-location">{locationText}</p>
                  <div className="featured-actions">
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={onViewProfile}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </article>
            )
          })
        )}
      </div>

      {!loading && pageCount > 1 && (
        <nav className="featured-pagination" aria-label="Featured profiles pages">
          <button
            type="button"
            className="featured-pagination-button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            Previous
          </button>
          <div className="featured-pagination-pages">
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={`featured-pagination-page${page === currentPage ? ' active' : ''}`}
                onClick={() => setCurrentPage(page)}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="featured-pagination-button"
            onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
            disabled={currentPage === pageCount}
            aria-label="Next page"
          >
            Next
          </button>
        </nav>
      )}
    </section>
  )
}
