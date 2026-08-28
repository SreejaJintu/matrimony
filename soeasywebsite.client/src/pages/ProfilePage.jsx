import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { profiles } from '../services/homepageService'
import { api, session } from '../services/api'
import { calculateProfileCompletion } from '../services/profileCompletion'
import { AccountSidebar } from '../components/Layout/AccountSidebar'
import {
  Menu,
  ShieldCheck,
  Camera,
  Eye,
  Clock3,
  BadgeCheck,
  MapPin,
  GraduationCap,
  Briefcase,
  Heart,
  Shield,
  Lock,
  ArrowRight,
} from 'lucide-react'
import './ProfilePage.css'

function getProfileFromSlug(slug) {
  return profiles.find((profile) => profile.slug === slug?.toLowerCase()) ?? null
}

function mapServerProfile(profile) {
  const birthDate = profile.dateOfBirth ? new Date(profile.dateOfBirth) : null
  const age = birthDate
    ? Math.max(0, new Date().getFullYear() - birthDate.getFullYear())
    : null

  const pickFirstValue = (...values) =>
    values.find((value) => value !== undefined && value !== null && String(value).trim() !== '') ?? ''

  const rawImage = pickFirstValue(
    profile.imageUrl,
    profile.ImageUrl,
    profile.image,
    profile.Image,
    profile.photoUrl,
    profile.PhotoUrl,
  )
  const image = String(rawImage).includes('localhost')
    ? rawImage.replace('http://localhost:5040', 'https://assetsmatrimony.kaliweb.in')
    : rawImage

  return {
    name: pickFirstValue(profile.fullName, profile.FullName),
    age: age ?? '',
    location:
      pickFirstValue(
        profile.address,
        profile.Address,
        profile.city,
        profile.City,
        profile.district,
        profile.District,
        profile.state,
        profile.State,
        profile.country,
        profile.Country,
      ) || 'India',
    height: pickFirstValue(profile.height, profile.Height) || '-',
    religion: pickFirstValue(profile.religion, profile.Religion) || '-',
    profession: pickFirstValue(profile.designation, profile.Designation, profile.occupation, profile.Occupation) || '-',
    education: pickFirstValue(profile.education, profile.Education) || '-',
    dob: profile.dateOfBirth || profile.DateOfBirth ? new Date(profile.dateOfBirth || profile.DateOfBirth).toLocaleDateString() : '-',
    maritalStatus: pickFirstValue(profile.maritalStatus, profile.MaritalStatus) || '-',
    motherTongue: pickFirstValue(profile.motherTongue, profile.MotherTongue) || '-',
    dietaryHabits: '-',
    fatherOccupation: pickFirstValue(profile.familyAbout, profile.FamilyAbout) || '-',
    motherOccupation: pickFirstValue(profile.familyAbout, profile.FamilyAbout) || '-',
    familyType: pickFirstValue(profile.familyType, profile.FamilyType) || '-',
    siblings: `${profile.brothers ?? profile.Brothers ?? 0} brothers, ${profile.sisters ?? profile.Sisters ?? 0} sisters`,
    company: pickFirstValue(profile.companyName, profile.CompanyName) || '-',
    income: pickFirstValue(profile.income, profile.Income) || '-',
    about: pickFirstValue(profile.aboutMe, profile.AboutMe) || '-',
    interests: ['Verified profile', 'Family-first', 'Open to connection'],
    partnerPreferences: pickFirstValue(profile.preferredDescription, profile.PreferredDescription) || '-',
    preferredAge: `${profile.ageFrom || profile.AgeFrom || '-'} - ${profile.ageTo || profile.AgeTo || '-'}`,
    preferredHeight: `${profile.heightFrom || profile.HeightFrom || '-'} - ${profile.heightTo || profile.HeightTo || '-'}`,
    preferredEducation: pickFirstValue(profile.preferredEducation, profile.PreferredEducation) || '-',
    preferredLocation:
      [profile.state, profile.State, profile.district, profile.District].filter(Boolean).join(', ') || '-',
    image: image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
  }
}

function InfoRow({ label, value }) {
  return (
    <div className="profile-info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function DetailCard({ title, children, accent = false }) {
  return (
    <article className={`profile-detail-card card ${accent ? 'profile-detail-accent' : ''}`}>
      <h2>{title}</h2>
      {children}
    </article>
  )
}

export function ProfilePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(() => getProfileFromSlug(slug))
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [photoLoaded, setPhotoLoaded] = useState(false)
  const editProfilePath = '/profile/edit' // New path for editing
  const [serverProfileData, setServerProfileData] = useState(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const userId = session.getUserId()
    if (!userId) return

    let active = true
    api
      .getProfile(userId, userId)
      .then((response) => {
        const payload = response?.data ?? response?.Data
        if (active && payload) {
          setProfile(mapServerProfile(payload))
          setServerProfileData(payload) // Store raw server data
          setPhotoLoaded(false)
        }
      })
      .catch(() => {})

    api
      .getSubscriptionStatus(userId)
      .then((response) => {
        const payload = response?.data ?? response?.Data
        if (active && payload) {
          setSubscriptionStatus(payload)
        }
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [slug])

  useEffect(() => {
    setPhotoLoaded(false)
  }, [profile?.image])

  if (!profile) return null

  const profileId = session.getUserId() ? `GS${String(session.getUserId()).padStart(6, '0')}` : 'GS000000'
  const profileLimit = subscriptionStatus?.profileViewLimit ?? 20
  const profilesUsed = subscriptionStatus?.profileViewsUsed ?? 0
  const remainingCredits = Math.max(profileLimit - profilesUsed, 0)
  const profileFacts = [
    { label: 'Profile ID', value: profileId },
  ]

  const {
    steps: completionSteps,
    percentage: completionPercentage,
    isComplete: isProfileComplete,
    firstIncompleteStep,
  } = calculateProfileCompletion(serverProfileData)
  
  // The "Complete Profile" button should lead to the dedicated stepper flow.
  // It starts with /account-completion for basic details, then proceeds to the rest.
  // If basic is done, it goes to the next incomplete step in the /register flow.
  const completeProfilePath =
    firstIncompleteStep === 'basic' ? '/account-completion' :
    firstIncompleteStep ? `/account-completion/${firstIncompleteStep}`
    : editProfilePath;


  return (
    <main className="page profile-page account-profile-page owner-profile-dashboard-page">
      <div className="account-layout">
        <AccountSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isMember={false}
          profilesUsed={0}
          profileLimit={20}
        />

        <section className="owner-profile-content">
          <button
            type="button"
            className="profile-mobile-menu"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
            Menu
          </button>

          <div className="owner-profile-heading">
            <div>
              <h1>Your Matrimony Profile</h1>
              <p>Keep your profile complete and up to date to get better matches.</p>
            </div>
          </div>

          <section className="profile-dashboard-grid">
            <div className="profile-left-column">
            <article className="profile-summary-card">
         

              <div className="profile-photo-shell">
                <div className="owner-profile-photo-wrap">
                  {profile.image ? (
                    <img
                      src={profile.image}
                      alt={`${profile.name} portrait`}
                      className={photoLoaded ? 'is-loaded' : 'is-loading'}
                      onLoad={() => setPhotoLoaded(true)}
                      onError={() => setPhotoLoaded(false)}
                    />
                  ) : (
                    <div className="owner-profile-photo-placeholder" aria-hidden="true" />
                  )}
                 
                </div>
              </div>

              <div className="profile-summary-body">
                <div className="profile-name-row">
                  <h2>{profile.name}</h2>
                  <BadgeCheck size={19} className="profile-verified-icon" />
                </div>

                <div className="profile-meta-row">
                  <span>{profile.age} Years</span>
                  <span>{profile.height}</span>
                  <span>{profile.location}</span>
                </div>

                <div className="profile-meta-row compact">
                  <span>{profile.profession}</span>
                  <span>{profile.religion}</span>
                  <span>{profile.familyType}</span>
                </div>

                <div className="profile-facts-row">
                  {profileFacts.map((item) => (
                    <div key={item.label} className="profile-fact">
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>

            </article>
            <DetailCard title="Credits Used">
              <div className="profile-credit-summary">
                <div className="profile-credit-stat">
                  <span>Used</span>
                  <strong>{profilesUsed}</strong>
                </div>
                <div className="profile-credit-stat">
                  <span>Limit</span>
                  <strong>{profileLimit}</strong>
                </div>
                <div className="profile-credit-stat">
                  <span>Remaining</span>
                  <strong>{remainingCredits}</strong>
                </div>
              </div>
              <p className="profile-credit-note">
                These are the profile views your current membership allows and how many you have used.
              </p>
            </DetailCard>
            </div>

            <div className="profile-center-column">
              <DetailCard title="Profile Completion">
                <div className="profile-completion-head">
                  <div
                    className="completion-track"
                    aria-label={`${completionPercentage}% profile completed`}
                  >
                    <span style={{ width: `${completionPercentage}%` }} />
                  </div>
                  <strong>{completionPercentage}% Completed</strong>
                </div>
                <p className="profile-completion-copy">
                  {isProfileComplete
                    ? 'Your profile is complete and ready to help you find better matches.'
                    : 'Add the remaining details to improve your profile visibility.'}
                </p>

                <div className="profile-completion-steps">
                  {completionSteps.map((step) => (
                    <div
                      key={step.id}
                      className={`profile-step ${step.done ? 'done' : ''}`}
                    >
                      <span>{step.done ? '✓' : '✎'}</span>
                      <small>{step.label}</small>
                    </div>
                  ))}
                </div>
                {!isProfileComplete && (
                  <Link to={completeProfilePath} className="profile-complete-button">
                    Complete Your Profile <ArrowRight size={14} />
                  </Link>
                )}
              </DetailCard>

              <DetailCard title="About Me">
                <p className="profile-about-copy">{profile.about}</p>
                <div className="profile-about-grid">
                  <InfoRow label="Education" value={profile.education} />
                  <InfoRow label="Location" value={profile.location} />
                  <InfoRow label="Profession" value={profile.profession} />
                  <InfoRow label="Religion" value={profile.religion} />
                  <InfoRow label="Annual Income" value={profile.income} />
                  <InfoRow label="Caste" value={profile.familyType} />
                </div>
                <button type="button" className="profile-view-more">
                  View More <ArrowRight size={14} />
                </button>
              </DetailCard>
            </div>

            <aside className="profile-right-rail">
              <DetailCard title="Contact & Personal Details" accent>
                <div className="profile-rail-lock">
                  <div className="profile-rail-lock-icon">
                    <Lock size={16} />
                  </div>
                  <p>Personal details are managed in your account completion flow.</p>
                </div>
                <div className="profile-basic-grid profile-rail-grid">
                  <InfoRow label="Marital Status" value={profile.maritalStatus} />
                  <InfoRow label="Mother Tongue" value={profile.motherTongue} />
                  <InfoRow label="Height" value={profile.height} />
                  <InfoRow label="DOB" value={profile.dob} />
                </div>
              </DetailCard>

              <DetailCard title="Profile Visibility">
                <div className="profile-visibility-row">
                  <Eye size={14} />
                  <div>
                    <strong>Visible to</strong>
                    <span>All Members</span>
                  </div>
                </div>
                <div className="profile-id-row">
                  <div>
                    <span>Profile ID</span>
                    <strong>{profileId}</strong>
                  </div>
                </div>
                <Link to="/membership" className="profile-rail-action">
                  View Membership
                </Link>
              </DetailCard>
            </aside>
          </section>

          <section className="profile-lower-grid">
            

           
          </section>

          <div className="profile-support-strip">
            <div>
              <ShieldCheck size={16} />
              <span>Your privacy is our priority</span>
              <small>We never share your personal information with anyone.</small>
            </div>
            <div>
              <Shield size={16} />
              <span>100% Secure</span>
              <small>Your data is protected.</small>
            </div>
            <div>
              <Clock3 size={16} />
              <span>Need Help?</span>
              <small>Contact our support team anytime.</small>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
