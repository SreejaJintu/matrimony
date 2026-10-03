import { NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import {
  Search,
  Heart,
  User,
  Crown,
  Settings,
  HelpCircle,
  LogOut,
  X,
  LayoutDashboard,
  UserPlus,
  Users,
  Inbox,
} from 'lucide-react'
import { AuthContext } from '../../contexts/AuthContext'
import './AccountSidebar.css'

const memberMenuItems = [
  { label: 'My Profile', to: '/profile', icon: User },
  { label: 'Discover Matches', to: '/matches', icon: Search },
  { label: 'Shortlisted', to: '/shortlisted', icon: Heart },
  { label: 'Shared Profiles', to: '/shared-profiles', icon: Inbox },
  { label: 'Edit Profile', to: '/profile/edit', icon: Settings },
  { label: 'Help & Support', to: '/help', icon: HelpCircle },
]

const brokerMenuItems = [
  { label: 'Broker Dashboard', to: '/broker/dashboard', icon: LayoutDashboard },
  { label: 'My Candidates', to: '/broker/candidates', icon: Users },
  { label: 'Add Candidate', to: '/broker/candidates/add', icon: UserPlus },
  { label: 'Discover Matches', to: '/matches', icon: Search },
  { label: 'My Profile', to: '/profile', icon: User },
  { label: 'Help & Support', to: '/help', icon: HelpCircle },
]

export function AccountSidebar({
  isOpen = true,
  onClose,
  isMember = false,
  profilesUsed = 0,
  profileLimit = 20,
}) {
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext)
  const isBroker = user?.isBroker === true
  const menuItems = isBroker ? brokerMenuItems : memberMenuItems

  const remaining = Math.max(profileLimit - profilesUsed, 0)

  const handleLogout = () => {
    // Keep logout behavior in one place when the existing auth context/service is available.
    // For now, navigate to the existing login route.
    onClose?.()
    if (isBroker) logout()
    navigate('/login')
  }

  const handleMembership = () => {
    onClose?.()
    navigate('/subscription')
  }

  return (
    <>
      <div
        className={`account-sidebar-backdrop ${isOpen ? 'show' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`account-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="account-sidebar-header">
         

          <button
            type="button"
            className="account-sidebar-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="account-sidebar-nav" aria-label={isBroker ? 'Broker navigation' : 'Member navigation'}>
          {menuItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={label}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `account-sidebar-link ${isActive ? 'active' : ''}`
              }
              end={to === '/broker/candidates'}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}

          <button
            type="button"
            className="account-sidebar-link account-sidebar-logout"
            onClick={handleLogout}
          >
            <LogOut size={19} strokeWidth={1.8} />
            <span>Logout</span>
          </button>
        </nav>

        {!isBroker && <div className="account-sidebar-membership">
          <div className="account-sidebar-membership-icon">
            <Crown size={18} />
          </div>

          {isMember ? (
            <>
              <h4>Membership Active</h4>
              <p>
                Profile access: <strong>{profilesUsed}</strong> / {profileLimit}
              </p>
              <div className="account-sidebar-progress">
                <span
                  style={{
                    width: `${Math.min((profilesUsed / profileLimit) * 100, 100)}%`,
                  }}
                />
              </div>
              <small>{remaining} profile access remaining</small>
            </>
          ) : (
            <>

              <h4>Become a Soesy Member</h4>
              <p>Get access to verified profiles and meaningful connections.</p>
              <div className="account-sidebar-plan">
                <strong>₹2,000</strong>
                <span>20 profile access</span>
              </div>
              <button
                type="button"
                className="account-sidebar-membership-btn"
                onClick={handleMembership}
              >
                Become a Member
              </button>
            </>
          )}
        </div>}
      </aside>

    </>
  )
}
