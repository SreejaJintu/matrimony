import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, MapPin, ShieldCheck, Trash2 } from 'lucide-react'
import { Header } from '../components/Layout/Header'
import { AccountSidebar } from '../components/Layout/AccountSidebar'
import { api, session } from '../services/api'
import { AuthContext } from '../contexts/AuthContext'
import './MatchesPage.css'
import './ShortlistedPage.css'

export function ShortlistedPage() {
  const { user, isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [removingId, setRemovingId] = useState(null)

  const pick = (item, keys, fallback = '') => {
    for (const key of keys) {
      const value = item?.[key]
      if (value !== undefined && value !== null && value !== '') return value
    }
    return fallback
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      setItems([])
      return
    }

    let mounted = true

    async function load() {
      setLoading(true)
      setError('')
      try {
        const response = await api.shortlistGet()
        const data = response?.data ?? response?.Data ?? []
        if (mounted) setItems(Array.isArray(data) ? data : [])
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Unable to load shortlisted profiles.')
          setItems([])
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [isAuthenticated])

  const handleRemove = async (profile) => {
    const targetUserId = profile?.userId ?? profile?.UserId
    if (!targetUserId) return

    setRemovingId(targetUserId)
    try {
      await api.shortlistRemove(targetUserId)
      setItems((prev) => prev.filter((item) => (item.userId ?? item.UserId) !== targetUserId))
    } catch (err) {
      alert(err.message || 'Unable to remove shortlist.')
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="account-page-shell">
      <Header />
      <div className="account-layout">
        {isAuthenticated && (
          <AccountSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isMember={Boolean(user?.subscription && user.subscription !== 'Free')}
          />
        )}

        <main className="shortlisted-page">
          <section className="shortlisted-hero">
            <div>
              <p className="shortlisted-eyebrow">Saved profiles</p>
              <h1>Shortlisted Profiles</h1>
              <p>Profiles you saved for later review.</p>
            </div>
            <button type="button" className="shortlisted-back-btn" onClick={() => navigate('/matches')}>
              Back to Search
            </button>
          </section>

          {!isAuthenticated ? (
            <div className="shortlisted-empty">
              <h3>Please log in to view shortlisted profiles</h3>
              <button type="button" onClick={() => navigate('/login')}>Go to Login</button>
            </div>
          ) : loading ? (
            <div className="shortlisted-grid">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="shortlisted-card skeleton">
                  <div className="shortlisted-image" />
                  <div className="shortlisted-body">
                    <div className="line short" />
                    <div className="line" />
                    <div className="line medium" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="shortlisted-empty">
              <h3>Unable to load shortlist</h3>
              <p>{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="shortlisted-empty">
              <Heart size={28} />
              <h3>No shortlisted profiles yet</h3>
              <p>Use the heart button on a profile to save it here.</p>
              <button type="button" onClick={() => navigate('/matches')}>Discover Matches</button>
            </div>
          ) : (
            <div className="shortlisted-grid">
              {items.map((profile) => (
                <article key={profile.shortlistId ?? profile.userId ?? profile.UserId} className="match-card shortlisted-card">
                  <div className="match-card-image shortlisted-image-wrap">
                    <img
                      src={pick(profile, ['imageUrl', 'ImageUrl', 'photoUrl', 'PhotoUrl']) || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80'}
                      alt={pick(profile, ['fullName', 'FullName', 'name', 'Name'], 'Shortlisted profile')}
                    />
                    <div className="match-card-badges">
                      {Boolean(pick(profile, ['isVerified', 'IsVerified', 'verified', 'Verified'])) && (
                        <span className="verified-badge shortlisted-verified">
                          <ShieldCheck size={13} />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="match-card-body shortlisted-body">
                    <div className="match-name-row">
                      <h3>{pick(profile, ['fullName', 'FullName', 'name', 'Name'], 'Unnamed profile')}</h3>
                    </div>
                    <p className="match-basic-line">
                      {pick(profile, ['profileCode', 'ProfileCode'], `SM${String(profile.userId ?? profile.UserId ?? 0).padStart(6, '0')}`)}
                    </p>
                    <p className="match-detail shortlisted-meta">
                      <MapPin size={14} />
                      {[pick(profile, ['district', 'District']), pick(profile, ['state', 'State'])].filter(Boolean).join(', ') || 'Location not shared'}
                    </p>
                    <p className="match-detail match-profession">
                      {pick(profile, ['profession', 'Profession'], 'Profession not shared')}
                    </p>
                  </div>
                  <div className="match-card-actions shortlisted-actions">
                    <button
                      type="button"
                      className="view-profile-button"
                      onClick={() => navigate(`/profile-detail/${profile.userId ?? profile.UserId}`)}
                    >
                      View Profile
                    </button>
                    <button
                      type="button"
                      className="shortlist-button active danger-toggle"
                      onClick={() => handleRemove(profile)}
                      disabled={removingId === (profile.userId ?? profile.UserId)}
                    >
                      <Trash2 size={14} />
                      {removingId === (profile.userId ?? profile.UserId) ? 'Removing...' : 'Remove Shortlist'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
