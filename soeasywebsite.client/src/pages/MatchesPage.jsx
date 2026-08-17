import { useContext, useEffect, useMemo, useState } from 'react'
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
} from 'lucide-react'
import { Header } from '../components/Layout/Header'
import { AccountSidebar } from '../components/Layout/AccountSidebar'
import { ProfileDrawer } from '../components/drawers/ProfileDrawer'
import { api } from '../services/api'
import { AuthContext } from '../contexts/AuthContext'
import './MatchesPage.css'

const lookingForOptions = ['Bride', 'Groom']
const religionOptions = ['Any', 'Hindu', 'Christian', 'Muslim', 'Sikh']
const locationOptions = ['Any', 'Kerala', 'Bengaluru', 'Mumbai', 'Delhi']
const communityOptions = ['All Communities', 'Nair', 'Kayastha', 'Khan', 'Professional', 'Creative', 'Academic']
const professionOptions = ['Any', 'Medicine', 'Engineering', 'Education', 'Business']
const educationOptions = ['Any', 'Graduate', 'Postgraduate', 'Doctorate', 'Professional', 'Diploma']

export function MatchesPage() {
  const { user } = useContext(AuthContext)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [sortOption, setSortOption] = useState('recent')

  const [lookingFor, setLookingFor] = useState('Bride')
  const [ageFrom, setAgeFrom] = useState('24')
  const [ageTo, setAgeTo] = useState('35')
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

  /*
   * IMPORTANT:
   * Connect this to the existing membership API/AuthContext field in your project.
   * Do not use this frontend flag as the backend authorization mechanism.
   */
  const isPaidMember = user?.isPremium === true

  const profilesUsed = Number(user?.profilesUsed ?? user?.profileAccessUsed ?? 0)
  const profileLimit = 20

  useEffect(() => {
    const queryLookingFor = searchParams.get('lookingFor')
    const queryAgeFrom = searchParams.get('ageFrom')
    const queryAgeTo = searchParams.get('ageTo')
    const queryReligion = searchParams.get('religion')
    const queryCommunity = searchParams.get('community')
    const queryLocation = searchParams.get('location')
    const queryEducation = searchParams.get('education')
    const queryProfession = searchParams.get('profession')

    if (queryLookingFor) setLookingFor(queryLookingFor)
    if (queryAgeFrom) setAgeFrom(queryAgeFrom)
    if (queryAgeTo) setAgeTo(queryAgeTo)
    if (queryReligion) setReligion(queryReligion)
    if (queryCommunity) setCommunity(queryCommunity)
    if (queryLocation) setLocation(queryLocation)
    if (queryEducation) setEducation(queryEducation)
    if (queryProfession) setProfession(queryProfession)
  }, [searchParams])

  useEffect(() => {
    if (!searchParams.get('lookingFor') && user?.genderId) {
      setLookingFor(user.genderId === 1 ? 'Bride' : 'Groom')
    }
  }, [user?.genderId, searchParams])

  useEffect(() => {
    async function loadMatches() {
      setIsLoading(true)
      setError('')

      try {
        const targetGenderId = user?.userId
          ? lookingFor === 'Bride'
            ? 2
            : lookingFor === 'Groom'
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
  }, [user?.userId, user?.genderId, lookingFor])

  const profiles = useMemo(
    () =>
      matches.map((match) => ({
        slug: `match-${match.userId}`,
        name: match.fullName || '',
        age: match.age || 0,
        location: match.location || '',
        image: match.imageUrl || '',
        profession: match.profession || '',
        height: match.height || '-',
        community: match.community || '',
        role: match.profession || '',
        religion: match.religion || 'Not shared',
        education: match.education || 'Not shared',
        familyType: match.familyType || 'Not shared',
        isVerified: Boolean(match.isVerified || match.verified || match.verifiedProfile),
        isPremium: Boolean(match.isPremium || match.premium || match.subscription === 'Premium'),
        isOnline: Boolean(match.isOnline || match.online),
        about: match.about || '',
        interests: Array.isArray(match.interests) ? match.interests : [],
        partnerPreferences: match.partnerPreferences || '',
        raw: match,
      })),
    [matches]
  )

  const filteredProfiles = useMemo(() => {
    return profiles
      .filter((profile) => {
        const ageMatch =
          Number(profile.age) >= Number(ageFrom || 0) &&
          Number(profile.age) <= Number(ageTo || 100)

        const communityMatch =
          community === 'All Communities' || profile.community === community

        const professionMatch =
          profession === 'Any' ||
          !profession ||
          profile.role.toLowerCase().includes(profession.toLowerCase())

        const religionMatch =
          religion === 'Any' ||
          profile.religion.toLowerCase().includes(religion.toLowerCase())

        const locationMatch =
          location === 'Any' ||
          profile.location.toLowerCase().includes(location.toLowerCase())

        const educationMatch =
          education === 'Any' ||
          profile.education.toLowerCase().includes(education.toLowerCase())

        return ageMatch && communityMatch && professionMatch && religionMatch && locationMatch && educationMatch
      })
      .sort((a, b) => {
        if (sortOption === 'ageAsc') return Number(a.age) - Number(b.age)
        if (sortOption === 'ageDesc') return Number(b.age) - Number(a.age)
        return 0
      })
  }, [profiles, ageFrom, ageTo, community, profession, religion, location, education, sortOption])

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
  }

  const clearFilters = () => {
    setLookingFor(user?.genderId === 1 ? 'Bride' : 'Groom')
    setAgeFrom('24')
    setAgeTo('35')
    setReligion('Any')
    setCommunity('All Communities')
    setLocation('Any')
    setEducation('Any')
    setProfession('Any')
    navigate('/matches')
  }

  const handleViewProfile = (profile) => {
    setInterestStatus('')

    if (isPaidMember) {
      setSelectedProfile(profile)
      setDrawerOpen(true)
      return
    }

    setLockedProfile(profile)
  }

  return (
    <div className="account-page-shell">
      <Header />

      <div className="account-layout">
        <AccountSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isMember={isPaidMember}
          profilesUsed={profilesUsed}
          profileLimit={profileLimit}
        />

        <main id="matches" className="matches-page">
          <button
            type="button"
            className="mobile-sidebar-trigger"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={19} />
            <span>Menu</span>
          </button>

          <section className="matches-page-heading">
            <div>
              <span className="matches-eyebrow">GSEVEN MATRIMONY</span>
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
                      <img src={profile.image} alt={profile.name} />

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
                        className="favorite-button"
                        aria-label={`Shortlist ${profile.name}`}
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
                        {profile.age} Years{profile.height !== '-' ? `, ${profile.height}` : ''}
                      </p>

                      <p className="match-detail">
                        <MapPin size={14} />
                        {profile.location || 'Location not shared'}
                      </p>

                      <p className="match-detail">
                        {profile.religion}
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
                      >
                        View Profile
                      </button>

                      <button type="button" className="shortlist-button">
                        <Heart size={15} />
                        Shortlist
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

      {lockedProfile && (
        <div className="membership-modal-backdrop" onClick={() => setLockedProfile(null)}>
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
              onClick={() => setLockedProfile(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="membership-modal-icon">
              <LockKeyhole size={24} />
            </div>

            <h2 id="membership-modal-title">View Full Profile</h2>

            <p>
              Become a Soesy member to view full profile details and connect with
              verified members.
            </p>

            <div className="membership-plan-preview">
              <strong>₹2,000</strong>
              <span>Membership · Access up to 20 profiles</span>
            </div>

            <button
              type="button"
              className="membership-modal-button"
              onClick={() => navigate('/membership')}
            >
              Become a Member
            </button>

            <button
              type="button"
              className="membership-modal-secondary"
              onClick={() => setLockedProfile(null)}
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}

      {interestStatus && (
        <div className="matches-toast" role="status">
          {interestStatus}
        </div>
      )}
    </div>
  )
}
