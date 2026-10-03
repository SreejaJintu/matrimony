import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'

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

export function AppRoutes() {
  const navigate = useNavigate()

  return (
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
        element={<Navigate to="/" replace />}
      />

    </Routes>
  )
}
