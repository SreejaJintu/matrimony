import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, PhoneCall, CheckCircle } from 'lucide-react'
import { api, session } from '../../services/api'

export function MembershipLeadModal({ isOpen, onClose, directForm = false }) {
  const [showForm, setShowForm] = useState(directForm)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    email: '',
  })

  useEffect(() => {
    if (isOpen) {
      setShowForm(directForm)
      setSubmitted(false)
      setFormData({
        name: session.getFullName() || '',
        mobileNumber: '',
        email: '',
      })
    }
  }, [isOpen, directForm])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        userId: session.getUserId() || null,
        name: formData.name,
        mobileNumber: formData.mobileNumber,
        email: formData.email || null,
        preferredPlan: '₹2,000 Membership',
      }

      await api.submitLead(payload)
      setSubmitted(true)
    } catch (err) {
      alert(err.message || 'Failed to submit details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setShowForm(false)
    setSubmitted(false)
    onClose()
  }

  return createPortal(
    <div
      className="lead-modal-overlay"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Membership Request Modal"
    >
      <div className="lead-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="lead-modal-close"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {!showForm ? (
          /* Initial Info View */
          <div>
            <div className="lead-modal-icon-badge">
              <span>🔒</span>
            </div>

            <h3 className="lead-modal-title">View Full Profile</h3>
            <p className="lead-modal-subtitle">
              Become a Soesy member to view full profile details and connect with verified members.
            </p>

            <div className="lead-modal-highlight-box">
              <strong style={{ fontSize: '18px', color: '#800020' }}>₹2,000</strong> Membership · Access up to 20 profiles
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="lead-modal-submit-btn"
            >
              Become a Member
            </button>

            <button
              onClick={handleClose}
              className="lead-modal-secondary-btn"
            >
              Continue Browsing
            </button>
          </div>
        ) : submitted ? (
          /* Success View */
          <div className="lead-modal-success">
            <CheckCircle className="lead-modal-success-icon" />
            <h3 className="lead-modal-title">Request Received!</h3>
            <p className="lead-modal-subtitle">
              Our executive will call you shortly to assist with your membership activation.
            </p>
            <button
              onClick={handleClose}
              className="lead-modal-submit-btn"
            >
              Done
            </button>
          </div>
        ) : (
          /* Contact Form View */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#800020' }}>
              <PhoneCall size={20} />
              <h3 className="lead-modal-title" style={{ margin: 0 }}>Request Executive Call</h3>
            </div>

            <p className="lead-modal-subtitle" style={{ textAlign: 'left', marginBottom: '16px' }}>
              Please provide your contact details. Our relationship manager will reach out to activate your membership and assist you.
            </p>

            <form onSubmit={handleSubmit} className="lead-modal-form">
              <div className="lead-modal-form-group">
                <label className="lead-modal-label">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="lead-modal-input"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="lead-modal-form-group">
                <label className="lead-modal-label">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  className="lead-modal-input"
                  placeholder="Enter 10-digit mobile number"
                />
              </div>

              <div className="lead-modal-form-group">
                <label className="lead-modal-label">Email (Optional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="lead-modal-input"
                  placeholder="name@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="lead-modal-submit-btn"
              >
                {loading ? 'Submitting...' : 'Submit Call Request'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
