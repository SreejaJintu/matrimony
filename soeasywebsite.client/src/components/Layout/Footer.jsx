import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer id="footer" className="footer footer-rich">
      <div className="container footer-grid-rich">
        <div className="footer-branding">
          <p className="eyebrow footer-eyebrow">Soesy Matrimony</p>
          <p className="footer-description">
            Helping you find your perfect life partner with trust and confidence.
          </p>
        </div>

        <div>
          <p className="eyebrow">Company</p>
          <ul>
            <li>
              <Link to="/">About Us</Link>
            </li>
            <li>
              <Link to="/admin/login">Admin</Link>
            </li>
            <li>
              <Link to="/">Blog</Link>
            </li>
            <li>
              <Link to="/">Contact Us</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Help</p>
          <ul>
            <li>
              <Link to="/">How It Works</Link>
            </li>
            <li>
              <Link to="/subscription">Premium Membership</Link>
            </li>
            <li>
              <Link to="/">FAQ</Link>
            </li>
            <li>
              <Link to="/">Support</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">For Members</p>
          <ul>
            <li>
              <Link to="/matches">Search Profiles</Link>
            </li>
            <li>
              <Link to="/matches">My Matches</Link>
            </li>
            <li>
              <Link to="/profile">My Interests</Link>
            </li>
            <li>
              <Link to="/profile">Profile Management</Link>
            </li>
          </ul>
        </div>

    
      </div>
      <div className="footer-bottom">
        <span>© 2026 Soesy Matrimony. All Rights Reserved.</span>
        <div className="footer-bottom-links">
          <Link to="/">Terms & Conditions</Link>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  )
}
