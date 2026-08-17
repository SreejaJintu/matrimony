import { useEffect } from 'react'

export function ProfileDrawer({ profile, isOpen, onClose, onSendInterest }) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !profile) return null

  const interests = Array.isArray(profile.interests) ? profile.interests : []

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside className="profile-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="profile-drawer-header">
          <div>
            <p className="profile-drawer-label">Profile</p>
            <h2>{profile.name}, {profile.age}</h2>
            <p>{profile.location} · {profile.profession}</p>
          </div>
          <button type="button" className="drawer-close" onClick={onClose} aria-label="Close drawer">
            ✕
          </button>
        </div>

        <div className="profile-drawer-image">
          <img src={profile.image} alt={`${profile.name} portrait`} />
        </div>

        <div className="profile-drawer-content">
          <div className="profile-info-row">
            <span>Height</span>
            <strong>{profile.height || 'Not shared'}</strong>
          </div>
          <div className="profile-info-row">
            <span>Religion</span>
            <strong>{profile.religion || 'Not shared'}</strong>
          </div>
          <div className="profile-info-row">
            <span>Education</span>
            <strong>{profile.education || 'Not shared'}</strong>
          </div>
          <div className="profile-info-row">
            <span>Family Type</span>
            <strong>{profile.familyType || 'Not shared'}</strong>
          </div>

          <section className="drawer-section">
            <h3>About</h3>
            <p>{profile.about || 'A warm-hearted and value-driven person looking to connect.'}</p>
          </section>

          <section className="drawer-section">
            <h3>Interests</h3>
            <div className="interest-pill-row">
              {interests.length > 0 ? interests.map((interest) => (
                <span key={interest} className="interest-pill">
                  {interest}
                </span>
              )) : <span className="interest-pill">General conversation</span>}
            </div>
          </section>

          <section className="drawer-section">
            <h3>Partner Preferences</h3>
            <p>{profile.partnerPreferences || 'Compatible values, mutual understanding, and shared life goals.'}</p>
          </section>
        </div>

        <div className="profile-drawer-actions">
          <button type="button" className="button button-primary" onClick={onSendInterest}>
            Send Interest
          </button>
          <button type="button" className="button button-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </aside>
    </div>
  )
}
