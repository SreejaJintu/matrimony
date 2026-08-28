import { Crown, X } from 'lucide-react'

export function ViewProfileModal({ isOpen, onClose, onBecomeMember }) {
  if (!isOpen) return null

  return (
    <div className="view-profile-modal-overlay" role="dialog" aria-modal="true" aria-label="View full profile">
      <div className="view-profile-modal">
        <button type="button" className="view-profile-modal-close" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div className="view-profile-modal-icon">🔒</div>
        <h3>View Full Profile</h3>
        <p>Become a member to unlock full profile details and connect with verified members.</p>

        <div className="view-profile-modal-offer">
          <strong>₹2,000</strong> Membership - Access up to 20 profiles
        </div>

        <button type="button" className="view-profile-modal-primary" onClick={onBecomeMember}>
          <Crown size={18} />
          Become a Member
        </button>

        <button type="button" className="view-profile-modal-secondary" onClick={onClose}>
          Continue Browsing
        </button>
      </div>
    </div>
  )
}
