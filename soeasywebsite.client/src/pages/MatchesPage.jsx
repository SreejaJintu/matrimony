import { useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Heart,
  ShieldCheck,
  MapPin,
  SlidersHorizontal,
  LockKeyhole,
  Menu,
  X,
  ChevronDown,
  PhoneCall,
  CheckCircle,
} from 'lucide-react'
import { Header } from '../components/Layout/Header'
import { AccountSidebar } from '../components/Layout/AccountSidebar'
import { ProfileDrawer } from '../components/drawers/ProfileDrawer'
import { api, session } from '../services/api'
import { AuthContext } from '../contexts/AuthContext'
import './MatchesPage.css'

const lookingForOptions = ['Bride', 'Groom']
const religionOptions = ['Any', 'Hindu', 'Christian', 'Muslim', 'Sikh']
const locationOptions = ['Any', 'Kerala', 'Bengaluru', 'Mumbai', 'Delhi']
const communityOptions = ['All Communities', 'Nair', 'Kayastha', 'Khan', 'Professional', 'Creative', 'Academic']
const professionOptions = ['Any', 'Medicine', 'Engineering', 'Education', 'Business']
const educationOptions = ['Any', 'Graduate', 'Postgraduate', 'Doctorate', 'Professional', 'Diploma']

export function MatchesPage() {
  const { user, isAuthenticated } = useContext(AuthContext)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [sortOption, setSortOption] = useState('recent')

  const [lookingFor, setLookingFor] = useState('Bride')
  const [ageFrom, setAgeFrom] = useState('')
  const [ageTo, setAgeTo] = useState('')
  const [religion, setReligion] = useState('Any')
  const [community, setCommunity] = useState('All Communities')
  const [location, setLocation] = useState('Any')
  const [education, setEducation] = useState('Any')
  const [profession, setProfession] = useState('Any')

  const [selectedProfile, setSelectedProfile] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [interestStatus, setInterestStatus] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [lockedProfile, setLockedProfile] = useState(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [loginPromptOpen, setLoginPromptOpen] = useState(false)
  const [shortlistStatusByUserId, setShortlistStatusByUserId] = useState({})
  const [shortlistLoadingByUserId, setShortlistLoadingByUserId] = useState({})

  // ── Lead Capture Modal Local State ──────────────────────────
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const [leadSubmitting, setLeadSubmitting] = useState(false)
  const [leadFormData, setLeadFormData] = useState({
    name: '',
    mobileNumber: '',
    email: '',
  })

  // Autofill name from session when user state loads
  useEffect(() => {
    if (user) {
      setLeadFormData((prev) => ({
        ...prev,
        name: user.fullName || session.getFullName() || '',
        email: user.email || '',
      }))
    }
  }, [user])

  // ── Live subscription status ───────────────────────────────
  const [subscriptionStatus, setSubscriptionStatus] = useState(null)
  const [unlockingUserId, setUnlockingUserId] = useState(null)

  const isPaidMember = Boolean(
    subscriptionStatus?.isApproved &&
    (subscriptionStatus?.hasFullAccess || subscriptionStatus?.remainingCredits > 0)
  )
  const remainingCredits = subscriptionStatus?.remainingCredits ?? 0
  const profileLimit = subscriptionStatus?.profileViewLimit ?? 20
  const profilesUsed = subscriptionStatus?.profileViewsUsed ?? 0

  useEffect(() => {
    setLookingFor(searchParams.get('lookingFor') || (user?.genderId === 1 ? 'Bride' : 'Groom'))
    setAgeFrom(searchParams.get('ageFrom') || '')
    setAgeTo(searchParams.get('ageTo') || '')
    setReligion(searchParams.get('religion') || 'Any')
    setCommunity(searchParams.get('community') || 'All Communities')
    setLocation(searchParams.get('location') || 'Any')
    setEducation(searchParams.get('education') || 'Any')
    setProfession(searchParams.get('profession') || 'Any')
  }, [searchParams, user?.genderId])

  useEffect(() => {
    async function loadMatches() {
      setIsLoading(true)
      setError('')

      try {
        const activeLookingFor = searchParams.get('lookingFor') || (user?.genderId === 1 ? 'Bride' : 'Groom')
        const targetGenderId = user?.userId
          ? activeLookingFor === 'Bride'
            ? 2
            : activeLookingFor === 'Groom'
              ? 1
              : null
          : null

        const response = await api.searchMatches({
          userId: user?.userId,
          genderId: targetGenderId,
        })

        setMatches(response.data ?? [])
      } catch (err) {
        console.error(err)
        setError('Unable to load matches. Please try again.')
        setMatches([])
      } finally {
        setIsLoading(false)
      }
    }

    loadMatches()
  }, [user?.userId, user?.genderId, searchParams])

  // ── Fetch live subscription status ─────────────────────────
  useEffect(() => {
    if (!user?.userId) return

    api.getSubscriptionStatus(user.userId)
      .then((response) => {
        if (response?.success && response?.data) {
          setSubscriptionStatus(response.data)
        } else {
          setSubscriptionStatus(null)
        }
      })
      .catch(() => {
        setSubscriptionStatus(null)
      })
  }, [user?.userId])

  const profiles = useMemo(
    () =>
      matches.map((match) => {
        const locationText = [match.district, match.state].filter(Boolean).join(', ') || match.location || '';
        return {
          slug: `match-${match.userId}`,
          name: match.fullName || '',
          age: match.age || 0,
          location: locationText,
          image: match.imageUrl || '/images/default-profile.png',
          profession: match.profession || '',
          height: match.height || '-',
          community: match.community || '',
          role: match.profession || '',
          religion: match.religion || '',
          education: match.education || '',
          familyType: match.familyType || '',
          isVerified: Boolean(match.isVerified || match.verified || match.verifiedProfile),
          isPremium: Boolean(match.isPremium || match.premium || match.subscription === 'Premium'),
          isOnline: Boolean(match.isOnline || match.online),
          about: match.about || '',
          interests: Array.isArray(match.interests) ? match.interests : [],
          partnerPreferences: match.partnerPreferences || '',
          raw: match,
        };
      }),
    [matches]
  )

  const filteredProfiles = useMemo(() => {
    const activeAgeFrom = searchParams.get('ageFrom') || ''
    const activeAgeTo = searchParams.get('ageTo') || ''
    const activeReligion = searchParams.get('religion') || 'Any'
    const activeCommunity = searchParams.get('community') || 'All Communities'
    const activeLocation = searchParams.get('location') || 'Any'

    return profiles
      .filter((profile) => {
        const profileAge = Number(profile.age || 0);
        const minAge = activeAgeFrom ? Number(activeAgeFrom) : null;
        const maxAge = activeAgeTo ? Number(activeAgeTo) : null;

        const ageMatch =
          (!minAge || profileAge === 0 || profileAge >= minAge) &&
          (!maxAge || profileAge === 0 || profileAge <= maxAge);

        const communityMatch =
          activeCommunity === 'All Communities' ||
          !activeCommunity ||
          activeCommunity === 'Any' ||
          (profile.community && profile.community.toLowerCase().includes(activeCommunity.toLowerCase()));

        const religionMatch =
          activeReligion === 'Any' ||
          !activeReligion ||
          profile.religion.toLowerCase().includes(activeReligion.toLowerCase());

        const locationMatch =
          activeLocation === 'Any' ||
          !activeLocation ||
          profile.location.toLowerCase().includes(activeLocation.toLowerCase());

        return ageMatch && communityMatch && religionMatch && locationMatch;
      })
      .sort((a, b) => {
        if (sortOption === 'ageAsc') return Number(a.age) - Number(b.age)
        if (sortOption === 'ageDesc') return Number(b.age) - Number(a.age)
        return 0
      })
  }, [profiles, searchParams, sortOption])

  useEffect(() => {
    if (!isAuthenticated || filteredProfiles.length === 0) {
      setShortlistStatusByUserId({})
      setShortlistLoadingByUserId({})
      return
    }

    let isMounted = true
    const visibleIds = filteredProfiles
      .map((profile) => profile.raw?.userId)
      .filter(Boolean)

    async function loadShortlistStatuses() {
      try {
        setShortlistLoadingByUserId(
          Object.fromEntries(visibleIds.map((id) => [String(id), true]))
        )

        const entries = await Promise.all(
          visibleIds
            .map(async (targetUserId) => {
              try {
                const response = await api.shortlistCheck(targetUserId)
                const isShortlisted = Boolean(response?.data?.isShortlisted ?? response?.data?.IsShortlisted)
                return [String(targetUserId), isShortlisted]
              } catch {
                return [String(targetUserId), false]
              }
            })
        )

        if (isMounted) {
          setShortlistStatusByUserId(Object.fromEntries(entries))
          setShortlistLoadingByUserId({})
        }
      } catch {
        if (isMounted) {
          setShortlistStatusByUserId({})
          setShortlistLoadingByUserId({})
        }
      }
    }

    loadShortlistStatuses()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, filteredProfiles])

  const handleSearch = (event) => {
    event.preventDefault()

    const params = new URLSearchParams()

    if (lookingFor) params.set('lookingFor', lookingFor)
    if (ageFrom) params.set('ageFrom', ageFrom)
    if (ageTo) params.set('ageTo', ageTo)
    if (religion && religion !== 'Any') params.set('religion', religion)
    if (community && community !== 'All Communities') params.set('community', community)
    if (location && location !== 'Any') params.set('location', location)
    if (education && education !== 'Any') params.set('education', education)
    if (profession && profession !== 'Any') params.set('profession', profession)

    navigate(`/matches?${params.toString()}`)
    setFiltersOpen(false)
  }

  const clearFilters = () => {
    setLookingFor(user?.genderId === 1 ? 'Bride' : 'Groom')
    setAgeFrom('')
    setAgeTo('')
    setReligion('Any')
    setCommunity('All Communities')
    setLocation('Any')
    setEducation('Any')
    setProfession('Any')
    navigate('/matches')
  }

  const handleViewProfile = useCallback(async (profile) => {
    setInterestStatus('')

    const targetUserId = profile.raw?.userId
    const viewerUserId = user?.userId
    const isFemaleViewer = user?.genderId === 2

    if (!targetUserId || !viewerUserId) {
      setLockedProfile(profile)
      return
    }

    // Female members can view profiles without credit deduction.
    if (isFemaleViewer) {
      navigate(`/profile-detail/${targetUserId}`)
      return
    }

    if (!subscriptionStatus?.isApproved || (!subscriptionStatus.hasFullAccess && remainingCredits <= 0)) {
      setLockedProfile(profile)
      return
    }

    setUnlockingUserId(targetUserId)
    try {
      const response = await api.unlockProfile(viewerUserId, targetUserId)

      if (response?.success && response?.data) {
        const unlockData = response.data

        if (unlockData.creditDeducted) {
          setSubscriptionStatus((prev) =>
            prev
              ? { ...prev, remainingCredits: Math.max(0, (prev.remainingCredits ?? 0) - 1) }
              : prev
          )
        }

        navigate(`/profile-detail/${targetUserId}`)
      } else {
        setLockedProfile(profile)
      }
    } catch {
      setLockedProfile(profile)
    } finally {
      setUnlockingUserId(null)
    }
  }, [user?.userId, subscriptionStatus, remainingCredits, navigate])

  const handleShortlistProfile = useCallback(async (profile) => {
    const targetUserId = profile.raw?.userId

    if (!targetUserId) {
      return
    }

    if (!isAuthenticated) {
      setLoginPromptOpen(true)
      return
    }

    // A logged-in user must be a subscribed member to shortlist profiles
    if (!isPaidMember) {
      setLockedProfile(profile)
      return
    }

    if (shortlistStatusByUserId[String(targetUserId)]) {
      try {
        setShortlistLoadingByUserId((prev) => ({ ...prev, [String(targetUserId)]: true }))
        await api.shortlistRemove(targetUserId)
        setShortlistStatusByUserId((prev) => ({ ...prev, [String(targetUserId)]: false }))
        setInterestStatus(`Removed ${profile.name || 'member'} from shortlist.`)
      } catch (error) {
        console.error('Failed to remove shortlist:', error)
        const message = String(error?.message || '').includes('401')
          ? 'Your session has expired. Please log in again to manage shortlist.'
          : error.message || 'Unable to remove from shortlist.'
        setInterestStatus(message)
      } finally {
        setShortlistLoadingByUserId((prev) => ({ ...prev, [String(targetUserId)]: false }))
      }
      return
    }

    try {
      setShortlistLoadingByUserId((prev) => ({ ...prev, [String(targetUserId)]: true }))
      await api.shortlistAdd(targetUserId)
      setInterestStatus(`Shortlisted ${profile.name || 'member'}.`)
      setShortlistStatusByUserId((prev) => ({ ...prev, [String(targetUserId)]: true }))
    } catch (error) {
      console.error('Failed to shortlist profile:', error)
      const message = String(error?.message || '').includes('401')
        ? 'Your session has expired. Please log in again to shortlist profiles.'
        : error.message || 'Unable to shortlist this profile.'
      setInterestStatus(message)
    } finally {
      setShortlistLoadingByUserId((prev) => ({ ...prev, [String(targetUserId)]: false }))
    }
  }, [isAuthenticated, isPaidMember, shortlistStatusByUserId])

  const closeLeadModal = () => {
    setLockedProfile(null)
    setShowLeadForm(false)
    setLeadSubmitted(false)
  }

  const handleLeadSubmit = async (e) => {
    e.preventDefault()
    setLeadSubmitting(true)

    try {
      const payload = {
        userId: user?.userId || session.getUserId() || null,
        name: leadFormData.name,
        mobileNumber: leadFormData.mobileNumber,
        email: leadFormData.email || null,
        preferredPlan: '₹2,000 Membership',
      }

      await api.submitLead(payload)
      setLeadSubmitted(true)
    } catch (err) {
      alert(err.message || 'Failed to submit lead request. Please try again.')
    } finally {
      setLeadSubmitting(false)
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
            isMember={isPaidMember}
            profilesUsed={profilesUsed}
            profileLimit={profileLimit}
          />
        )}

        <main id="matches" className="matches-page">
          {isAuthenticated && (
            <button
              type="button"
              className="mobile-sidebar-trigger"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={19} />
              <span>Menu</span>
            </button>
          )}

          <section className="matches-page-heading">
            <div>
              <h1>Discover Matches</h1>
              <p>Find meaningful connections based on your preferences.</p>
            </div>

            <button
              type="button"
              className="filter-toggle-button"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
              aria-controls="matches-filter-panel"
            >
              <SlidersHorizontal size={16} />
              {filtersOpen ? 'Hide Filters' : 'Filter'}
            </button>
          </section>

          <div className="matches-header-tools">
            <button type="button" className="clear-filters-button" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>

          <section
            id="matches-filter-panel"
            className={`matches-filter-panel ${filtersOpen ? 'open' : ''}`}
          >
            <form onSubmit={handleSearch}>
              <div className="matches-filter-row">
                <label>
                  <span>Looking For</span>
                  <select value={lookingFor} onChange={(e) => setLookingFor(e.target.value)}>
                    {lookingForOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="age-filter">
                  <span>Age</span>
                  <div className="age-inputs">
                    <input
                      type="number"
                      min="18"
                      max="60"
                      value={ageFrom}
                      onChange={(e) => setAgeFrom(e.target.value)}
                    />
                    <b>to</b>
                    <input
                      type="number"
                      min="18"
                      max="60"
                      value={ageTo}
                      onChange={(e) => setAgeTo(e.target.value)}
                    />
                  </div>
                </label>

                <label>
                  <span>Religion</span>
                  <select value={religion} onChange={(e) => setReligion(e.target.value)}>
                    {religionOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Community</span>
                  <select value={community} onChange={(e) => setCommunity(e.target.value)}>
                    {communityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Location</span>
                  <select value={location} onChange={(e) => setLocation(e.target.value)}>
                    {locationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <button type="submit" className="matches-search-button">
                  Search
                </button>
              </div>
            </form>
          </section>

          <div className="matches-toolbar">
            <div>
              <strong>{filteredProfiles.length.toLocaleString()}</strong> profiles matching your preferences
            </div>

            <label className="sort-control">
              <span>Sort by</span>
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="recent">Recently Joined</option>
                <option value="ageAsc">Age: Low to High</option>
                <option value="ageDesc">Age: High to Low</option>
              </select>
              <ChevronDown size={15} />
            </label>
          </div>

          <section className="matches-results">
            {isLoading ? (
              <div className="matches-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="match-card match-card-skeleton">
                    <div className="skeleton-image" />
                    <div className="skeleton-content">
                      <div className="skeleton-line short" />
                      <div className="skeleton-line medium" />
                      <div className="skeleton-line" />
                      <div className="skeleton-actions">
                        <div />
                        <div />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="matches-status-card">
                <h3>Unable to load profiles</h3>
                <p>Please try again.</p>
                <button type="button" onClick={() => window.location.reload()}>
                  Retry
                </button>
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="matches-status-card">
                <h3>No matches found</h3>
                <p>Try adjusting your search filters to discover more profiles.</p>
                <button type="button" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="matches-grid">
                {filteredProfiles.map((profile) => (
                  <article key={profile.slug} className="match-card">
                    <div className="match-card-image">
                      <img
                        src={profile.image}
                        alt={profile.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/default-profile.png';
                        }}
                      />

                      <div className="match-card-badges">
                        {profile.isVerified && (
                          <span className="verified-badge">
                            <ShieldCheck size={13} />
                            Verified
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        className={`favorite-button ${shortlistStatusByUserId[String(profile.raw?.userId)] ? 'active' : ''} ${shortlistLoadingByUserId[String(profile.raw?.userId)] ? 'loading' : ''}`}
                        aria-label={`Shortlist ${profile.name}`}
                        onClick={() => handleShortlistProfile(profile)}
                        disabled={Boolean(shortlistLoadingByUserId[String(profile.raw?.userId)])}
                      >
                        <Heart size={18} />
                      </button>
                    </div>

                    <div className="match-card-body">
                      <div className="match-name-row">
                        <h3>{profile.name}</h3>
                        {profile.isOnline && <span className="online-dot" title="Online" />}
                      </div>

                      <p className="match-basic-line">
                        {profile.age > 0 ? `${profile.age} Years` : 'Age not shared'}{profile.height && profile.height !== '-' ? `, ${profile.height}` : ''}
                      </p>

                      <p className="match-detail">
                        <MapPin size={14} />
                        {profile.location || 'Location not shared'}
                      </p>

                      <p className="match-detail">
                        {profile.religion || 'Religion not shared'}
                        {profile.community ? `, ${profile.community}` : ''}
                      </p>

                      <p className="match-detail match-profession">
                        {profile.profession || 'Profession not shared'}
                      </p>

                      {!isPaidMember ? (
                        <div className="profile-lock-message">
                          <div className="lock-icon">
                            <LockKeyhole size={16} />
                          </div>
                          <div>
                            <strong>Profile details are protected</strong>
                            <span>Become a member to view full profile details.</span>
                          </div>
                        </div>
                      ) : (
                        <div className="profile-access-message">
                          <ShieldCheck size={16} />
                          <span>Member access available</span>
                        </div>
                      )}
                    </div>

                    <div className="match-card-actions">
                      <button
                        type="button"
                        className="view-profile-button"
                        onClick={() => handleViewProfile(profile)}
                        disabled={unlockingUserId === profile.raw?.userId}
                      >
                        {unlockingUserId === profile.raw?.userId
                          ? 'Opening…'
                          : 'View Profile'}
                      </button>

                      <button
                        type="button"
                        className={`shortlist-button ${shortlistStatusByUserId[String(profile.raw?.userId)] ? 'active' : ''} ${shortlistLoadingByUserId[String(profile.raw?.userId)] ? 'loading' : ''}`}
                        onClick={() => handleShortlistProfile(profile)}
                        disabled={Boolean(shortlistLoadingByUserId[String(profile.raw?.userId)])}
                      >
                        <Heart size={15} />
                        {shortlistStatusByUserId[String(profile.raw?.userId)] ? 'Remove Shortlist' : 'Add to Shortlist'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <div className="privacy-note">
            <ShieldCheck size={18} />
            <span>
              Profiles are shown with privacy in mind. Personal/contact details are protected for members.
            </span>
          </div>
        </main>
      </div>

      <ProfileDrawer
        profile={selectedProfile}
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setInterestStatus('')
        }}
        onSendInterest={() => {
          setInterestStatus(`Interest sent to ${selectedProfile?.name || 'member'}.`)
          setDrawerOpen(true)
        }}
      />

      {/* ── Updated Membership Lead Modal ───────────────────────── */}
      {lockedProfile && (
        <div className="membership-modal-backdrop" onClick={closeLeadModal}>
          <div
            className="membership-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="membership-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="membership-modal-close"
              onClick={closeLeadModal}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {!showLeadForm ? (
              /* Step 1: Initial Pitch */
              <>
                <div className="membership-modal-icon">
                  <LockKeyhole size={24} />
                </div>

                <h2 id="membership-modal-title">View Full Profile</h2>

                <p>
                  Become a Soesy member to view full profile details and connect with verified members.
                </p>

                <div className="membership-plan-preview">
                  <strong>₹2,000</strong>
                  <span>Membership · Access up to 20 profiles</span>
                </div>

                <button
                  type="button"
                  className="membership-modal-button"
                  onClick={() => setShowLeadForm(true)}
                >
                  Become a Member
                </button>

                <button
                  type="button"
                  className="membership-modal-secondary"
                  onClick={closeLeadModal}
                >
                  Continue Browsing
                </button>
              </>
            ) : leadSubmitted ? (
              /* Step 3: Success Confirmation */
              <div className="lead-success-view">
                <CheckCircle size={48} className="success-icon" style={{ color: '#16a34a', margin: '0 auto 12px' }} />
                <h2>Request Received!</h2>
                <p>
                  Our executive will call you shortly to assist with your membership activation.
                </p>
                <button
                  type="button"
                  className="membership-modal-button"
                  onClick={closeLeadModal}
                  style={{ marginTop: '16px' }}
                >
                  Done
                </button>
              </div>
            ) : (
              /* Step 2: Contact Form */
              <div className="lead-form-view">
                <div className="lead-form-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <PhoneCall size={20} style={{ color: '#7f1d1d' }} />
                  <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Request Executive Call</h2>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '16px' }}>
                  Please provide your contact details. Our team will reach out to activate your membership.
                </p>

                <form onSubmit={handleLeadSubmit} className="lead-form" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ textAlign: 'left' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Full Name</label>
                    <input
                      type="text"
                      required
                      value={leadFormData.name}
                      onChange={(e) => setLeadFormData({ ...leadFormData, name: e.target.value })}
                      placeholder="Enter your name"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    />
                  </div>

                  <div style={{ textAlign: 'left' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={leadFormData.mobileNumber}
                      onChange={(e) => setLeadFormData({ ...leadFormData, mobileNumber: e.target.value })}
                      placeholder="Enter mobile number"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    />
                  </div>

                  <div style={{ textAlign: 'left' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Email (Optional)</label>
                    <input
                      type="email"
                      value={leadFormData.email}
                      onChange={(e) => setLeadFormData({ ...leadFormData, email: e.target.value })}
                      placeholder="name@example.com"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={leadSubmitting}
                    className="membership-modal-button"
                    style={{ marginTop: '8px' }}
                  >
                    {leadSubmitting ? 'Submitting...' : 'Submit Details'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Login & Subscribe prompt for guests clicking shortlist ─── */}
      {loginPromptOpen && (
        <div className="membership-modal-backdrop" onClick={() => setLoginPromptOpen(false)}>
          <div
            className="membership-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-prompt-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="membership-modal-close"
              onClick={() => setLoginPromptOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="membership-modal-icon">
              <LockKeyhole size={24} />
            </div>

            <h2 id="login-prompt-title">Log in to Shortlist</h2>

            <p>
              Please log in to your account and subscribe to a plan to shortlist profiles and connect with verified members.
            </p>

            <div className="membership-plan-preview">
              <strong>₹2,000</strong>
              <span>Membership · Access up to 20 profiles</span>
            </div>

            <button
              type="button"
              className="membership-modal-button"
              onClick={() => {
                setLoginPromptOpen(false)
                navigate('/login')
              }}
            >
              Log In &amp; Subscribe
            </button>

            <button
              type="button"
              className="membership-modal-secondary"
              onClick={() => setLoginPromptOpen(false)}
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}

      {interestStatus && (
        <div className={`matches-toast ${interestStatus.toLowerCase().includes('shortlisted') ? 'success' : ''}`} role="status">
          {interestStatus}
        </div>
      )}
    </div>
  )
}
