import { useEffect } from 'react'
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom'

// User pages
import { HomePage } from '../pages/HomePage'
import { ProfilePage } from '../pages/ProfilePage'
import { ProfileDetail } from '../pages/ProfileDetail'
import { LoginPage } from '../pages/LoginPage'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage'
import { RegistrationPage } from '../pages/RegistrationPage'
import { AccountCompletionPage } from '../pages/AccountCompletionPage'
import { RegistrationAboutPage } from '../pages/regstnStepPages/RegistrationAboutPage'
import { RegistrationFamilyPage } from '../pages/regstnStepPages/RegistrationFamilyPage'
import { RegistrationPreferencesPage } from '../pages/regstnStepPages/RegistrationPreferencesPage'
import { RegistrationPhotosPage } from '../pages/regstnStepPages/RegistrationPhotosPage'
import { AccountCompletionStepperPage } from '../pages/AccountCompletionStepperPage'
import { ProfileEditPage } from '../pages/ProfileEditPage'
import { SubscriptionPage } from '../pages/SubscriptionPage'
import { MatchesPage } from '../pages/MatchesPage'
import { ShortlistedPage } from '../pages/ShortlistedPage'
import { MySharedProfilesPage } from '../pages/MySharedProfilesPage'

// Admin pages
import AdminLogin from '../admin/pages/AdminLogin'
import AdminLayout from '../admin/components/AdminLayout'
import AdminDashboard from '../admin/pages/AdminDashboard'
import AdminProfiles from "../admin/pages/AdminProfiles";
import AdminProfileDetail from "../admin/pages/AdminProfileDetail";
import AdminProfileEdit from "../admin/pages/AdminProfileEdit";
import AdminSubscriptionPage from '../admin/pages/AdminSubscriptionPage'
import AdminPlansPage from '../admin/pages/AdminPlansPage'
import LeadsManagementPage from '../admin/pages/LeadsManagementPage'
import AdminLocations from '../admin/pages/AdminLocations'
import AdminBrokers from '../admin/pages/AdminBrokers'
import AdminExecutives from '../admin/pages/AdminExecutives'
import AdminExecutiveFormPage from '../admin/pages/AdminExecutiveFormPage'
import AdminSettings from '../admin/pages/AdminSettings'
import AdminProtectedRoute from '../admin/components/AdminProtectedRoute'
import { BrokerProtectedRoute } from '../broker/components/BrokerProtectedRoute'
import { BrokerLayout } from '../broker/components/BrokerLayout'
import BrokerCandidatesPage from '../broker/pages/BrokerCandidatesPage'
import AddBrokerCandidatePage from '../broker/pages/AddBrokerCandidatePage'
import BrokerDashboardPage from '../broker/pages/BrokerDashboardPage'
import ExecutiveLogin from '../executive/pages/ExecutiveLogin'
import ExecutiveProtectedRoute from '../executive/components/ExecutiveProtectedRoute'
import ExecutiveLayout from '../executive/components/ExecutiveLayout'
import ExecutiveDashboard from '../executive/pages/ExecutiveDashboard'
import ExecutiveProfile from '../executive/pages/ExecutiveProfile'

const SITE_URL = 'https://viswaas.in'
const SITE_NAME = 'Viswaas Matrimony'
const SOCIAL_IMAGE = `${SITE_URL}/blackBgViswaas.png`

const PUBLIC_PAGE_METADATA = {
  '/': {
    title: 'Viswaas Matrimony | Find Your Life Partner',
    description: 'Explore matrimonial profiles and discover how Viswaas Matrimony helps you find a life partner with verified profiles, privacy-protected access, and assisted membership options.',
    indexable: true,
  },
  '/subscription': {
    title: 'Assisted Matrimony Membership | Viswaas Matrimony',
    description: 'Learn about Viswaas Matrimony’s executive-assisted membership, including access to verified profiles and support from a relationship manager.',
    indexable: true,
  },
}

const NON_INDEXABLE_PAGE_METADATA = [
  ['/forgot-password', 'Reset Password', 'Reset your Viswaas Matrimony account password.'],
  ['/register', 'Create an Account', 'Create an account with Viswaas Matrimony.'],
  ['/matches', 'Search Profiles', 'Search matrimonial profiles with Viswaas Matrimony.'],
  ['/profile', 'Member Profile', 'Manage your Viswaas Matrimony profile.'],
  ['/profile-detail', 'Member Profile Details', 'View matrimonial profile details.'],
  ['/shortlisted', 'Shortlisted Profiles', 'View your shortlisted matrimonial profiles.'],
  ['/shared-profiles', 'Shared Profiles', 'View profiles shared with your account.'],
  ['/account-completion', 'Complete Your Profile', 'Complete your Viswaas Matrimony profile.'],
  ['/admin', 'Admin', 'Viswaas Matrimony administration.'],
  ['/broker', 'Broker', 'Viswaas Matrimony broker portal.'],
  ['/executive', 'Executive', 'Viswaas Matrimony executive portal.'],
]

const LOGIN_PAGE_METADATA = {
  title: 'Viswaas Matrimony Login | Sign In to Your Account',
  description: 'Sign in to Viswaas Matrimony to continue your search for a life partner and manage your matrimonial profile.',
  indexable: true,
}

function getPageMetadata(pathname) {
  if (pathname === '/login') return LOGIN_PAGE_METADATA

  const publicMetadata = PUBLIC_PAGE_METADATA[pathname]
  if (publicMetadata) return publicMetadata

  const privatePage = NON_INDEXABLE_PAGE_METADATA.find(([prefix]) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
  if (privatePage) {
    return {
      title: `${privatePage[1]} | ${SITE_NAME}`,
      description: privatePage[2],
      indexable: false,
    }
  }

  if (pathname.startsWith('/register/')) {
    return {
      title: `Registration | ${SITE_NAME}`,
      description: 'Complete your Viswaas Matrimony registration.',
      indexable: false,
    }
  }

  return {
    title: `Page Not Found | ${SITE_NAME}`,
    description: 'The requested page could not be found.',
    indexable: false,
    notFound: true,
  }
}

function updateMetaTag(selector, attributes, content) {
  const matches = [...document.head.querySelectorAll(selector)]
  let element = matches.shift()

  if (content === null) {
    element?.remove()
    matches.forEach((duplicate) => duplicate.remove())
    return
  }

  if (!element) {
    element = document.createElement('meta')
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value))
    document.head.appendChild(element)
  }

  matches.forEach((duplicate) => duplicate.remove())
  element.setAttribute('content', content)
}

function PageMetadata() {
  const { pathname } = useLocation()

  useEffect(() => {
    const normalizedPath = pathname.replace(/\/+$/, '') || '/'
    const metadata = getPageMetadata(normalizedPath)
    const pageUrl = `${SITE_URL}${normalizedPath === '/' ? '/' : normalizedPath}`

    document.title = metadata.title
    updateMetaTag('meta[name="description"]', { name: 'description' }, metadata.description)
    updateMetaTag(
      'meta[name="robots"]',
      { name: 'robots' },
      metadata.indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow'
    )
    updateMetaTag('meta[property="og:type"]', { property: 'og:type' }, 'website')
    updateMetaTag('meta[property="og:site_name"]', { property: 'og:site_name' }, SITE_NAME)
    updateMetaTag('meta[property="og:title"]', { property: 'og:title' }, metadata.title)
    updateMetaTag('meta[property="og:description"]', { property: 'og:description' }, metadata.description)
    updateMetaTag(
      'meta[property="og:url"]',
      { property: 'og:url' },
      metadata.indexable ? pageUrl : null
    )
    updateMetaTag('meta[property="og:image"]', { property: 'og:image' }, SOCIAL_IMAGE)
    updateMetaTag('meta[property="og:image:alt"]', { property: 'og:image:alt' }, 'Viswaas Service brand logo')
    updateMetaTag('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image')
    updateMetaTag('meta[name="twitter:title"]', { name: 'twitter:title' }, metadata.title)
    updateMetaTag('meta[name="twitter:description"]', { name: 'twitter:description' }, metadata.description)
    updateMetaTag('meta[name="twitter:image"]', { name: 'twitter:image' }, SOCIAL_IMAGE)
    updateMetaTag('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt' }, 'Viswaas Service brand logo')

    const canonicalLinks = [...document.head.querySelectorAll('link[rel="canonical"]')]
    canonicalLinks.slice(1).forEach((link) => link.remove())
    if (metadata.indexable) {
      const canonical = canonicalLinks[0] ?? document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      canonical.setAttribute('href', pageUrl)
      if (!canonicalLinks.length) document.head.appendChild(canonical)
    } else {
      canonicalLinks.forEach((link) => link.remove())
    }

    const pageSchemaId = 'route-webpage-jsonld'
    let pageSchema = document.getElementById(pageSchemaId)
    if (metadata.indexable) {
      if (!pageSchema) {
        pageSchema = document.createElement('script')
        pageSchema.id = pageSchemaId
        pageSchema.type = 'application/ld+json'
        document.head.appendChild(pageSchema)
      }
      pageSchema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: metadata.title,
        description: metadata.description,
        url: pageUrl,
        isPartOf: { '@id': `${SITE_URL}/#website` },
      })
    } else {
      pageSchema?.remove()
    }
  }, [pathname])

  return null
}

function NotFoundPage() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>The page you requested could not be found.</p>
      <Link to="/">Return to the Viswaas Matrimony home page</Link>
    </main>
  )
}

export function AppRoutes() {
  const navigate = useNavigate()

  return (
    <>
    <PageMetadata />
    <Routes>

      {/* =========================
          USER ROUTES
      ========================= */}

      <Route path="/" element={<HomePage />} />

      <Route path="/matches" element={<MatchesPage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />

      <Route
        path="/register"
        element={
          <RegistrationPage
            onBackToSignIn={() => navigate('/login')}
          />
        }
      />

      <Route
        path="/account-completion"
        element={<AccountCompletionPage />}
      />

      <Route
        path="/register/about"
        element={<RegistrationAboutPage />}
      />

      <Route
        path="/register/family"
        element={<RegistrationFamilyPage />}
      />

      <Route
        path="/register/preferences"
        element={<RegistrationPreferencesPage />}
      />

      <Route
        path="/register/photos"
        element={<RegistrationPhotosPage />}
      />

      {/* Account Completion Flow */}

      <Route
        path="/account-completion/about"
        element={<AccountCompletionStepperPage />}
      />

      <Route
        path="/account-completion/family"
        element={<AccountCompletionStepperPage />}
      />

      <Route
        path="/account-completion/preferences"
        element={<AccountCompletionStepperPage />}
      />

      <Route
        path="/account-completion/photos"
        element={<AccountCompletionStepperPage />}
      />

      {/* Profile Edit */}

      <Route
        path="/profile/edit"
        element={<ProfileEditPage />}
      />

      <Route
        path="/profile/edit/basic"
        element={<ProfileEditPage />}
      />

      <Route
        path="/profile/edit/about"
        element={<ProfileEditPage />}
      />

      <Route
        path="/profile/edit/family"
        element={<ProfileEditPage />}
      />

      <Route
        path="/profile/edit/preferences"
        element={<ProfileEditPage />}
      />

      <Route
        path="/profile/edit/photos"
        element={<ProfileEditPage />}
      />

      <Route
        path="/profile"
        element={<ProfilePage />}
      />

      <Route
        path="/profile/:slug"
        element={<ProfilePage />}
      />

      <Route
        path="/profile-detail"
        element={<ProfileDetail />}
      />

      <Route
        path="/profile-detail/:userId"
        element={<ProfileDetail />}
      />

      <Route
        path="/subscription"
        element={<SubscriptionPage />}
      />

      <Route
        path="/shortlisted"
        element={<ShortlistedPage />}
      />

      <Route path="/shared-profiles" element={<MySharedProfilesPage />} />
      <Route path="/shared-profiles/:shareId" element={<MySharedProfilesPage />} />

      <Route element={<BrokerProtectedRoute />}>
        <Route path="/broker" element={<BrokerLayout />}>
          <Route index element={<Navigate to="/broker/dashboard" replace />} />
          <Route path="dashboard" element={<BrokerDashboardPage />} />
          <Route path="candidates" element={<BrokerCandidatesPage />} />
          <Route path="candidates/add" element={<AddBrokerCandidatePage />} />
        </Route>
      </Route>


      {/* =========================
          ADMIN ROUTES
      ========================= */}

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/executive/login" element={<ExecutiveLogin />} />

      <Route element={<ExecutiveProtectedRoute />}>
        <Route path="/executive" element={<ExecutiveLayout />}>
          <Route index element={<Navigate to="/executive/dashboard" replace />} />
          <Route path="dashboard" element={<ExecutiveDashboard />} />
          <Route path="leads" element={<LeadsManagementPage />} />
          <Route path="profile" element={<ExecutiveProfile />} />
        </Route>
      </Route>

      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />

          <Route path="dashboard" element={<AdminDashboard />} />

          <Route path="profiles" element={<AdminProfiles />} />

          <Route path="profiles/:userId" element={<AdminProfileDetail />} />
          
          <Route path="profiles/:userId/edit" element={<AdminProfileEdit />} />

          <Route path="subscriptions" element={<AdminSubscriptionPage />} />

          <Route path="plans" element={<AdminPlansPage />} />

          <Route path="locations" element={<AdminLocations />} />

          <Route path="leads" element={<LeadsManagementPage />} />

          <Route path="brokers" element={<AdminBrokers />} />

          <Route path="executives" element={<AdminExecutives />} />

          <Route path="executives/add" element={<AdminExecutiveFormPage />} />

          <Route path="executives/:executiveId" element={<AdminExecutiveFormPage />} />

          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>


      {/* =========================
          FALLBACK
      ========================= */}

      <Route
        path="*"
        element={<NotFoundPage />}
      />

    </Routes>
    </>
  )
}
