import { useState, useEffect, useRef, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

export function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useContext(AuthContext)
  const location = useLocation()
  const fullName = user?.fullName ?? ''
  const navigate = useNavigate()
  const headerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsMobileNavOpen(false)
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="topbar rich-topbar" ref={headerRef}>
      <div className="container topbar-inner">
        <Link className="brand" to="/" aria-label="Soesy Matrimony home">
          <span>
            <strong>Soesy Matrimony</strong>
            <small>Trusted Matrimony</small>
          </span>
        </Link>

        <button
          type="button"
          className={`nav-toggle ${isMobileNavOpen ? 'open' : ''}`}
          onClick={() => setIsMobileNavOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={isMobileNavOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav ${isMobileNavOpen ? 'nav-open' : ''}`} aria-label="Primary">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/matches" className={location.pathname === '/matches' ? 'active' : ''}>Search</Link>
          <Link to="/subscription" className={location.pathname === '/subscription' ? 'active' : ''}>Premium</Link>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Success Stories</Link>
          <Link to="/#footer">Contact</Link>
          {!isAuthenticated && (
            <div className="nav-buttons-mobile">
              <button type="button" className="button button-outline" onClick={() => navigate('/login')}>
                Login
              </button>
              <button type="button" className="button button-gold" onClick={() => navigate('/register')}>
                Register Free
              </button>
            </div>
          )}
        </nav>

        <div className="nav-actions" aria-label="Utility actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <button
                type="button"
                className="user-menu-button"
                onClick={() => setIsUserMenuOpen((open) => !open)}
                aria-haspopup="true"
                aria-expanded={isUserMenuOpen}
              >
                {fullName || 'My Profile'} ▼
              </button>
              {isUserMenuOpen && (
                <div className="user-menu-dropdown">
                  <button type="button" className="user-menu-item" onClick={() => { setIsUserMenuOpen(false); navigate('/profile'); }}>
                    My Profile
                  </button>
                  <button type="button" className="user-menu-item" onClick={() => { setIsUserMenuOpen(false); navigate('/subscription'); }}>
                    Subscription
                  </button>
                  <button type="button" className="user-menu-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button type="button" className="button button-outline" onClick={() => navigate('/login')}>Login</button>
              <button type="button" className="button button-gold" onClick={() => navigate('/register')}>Register Free</button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
