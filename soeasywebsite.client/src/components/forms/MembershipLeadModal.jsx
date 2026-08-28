import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, PhoneCall, CheckCircle } from 'lucide-react'
import { api, session } from '../../services/api'

export function MembershipLeadModal({ isOpen, onClose }) {
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: session.getFullName() || '',
    mobileNumber: '',
    email: '',
  })

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
      className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      style={{ zIndex: 99999 }}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {!showForm ? (
          /* Initial View */
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-700">
              <span className="text-2xl">🔒</span>
            </div>

            <h3 className="text-2xl font-serif font-bold text-gray-900">View Full Profile</h3>
            <p className="mt-2 text-sm text-gray-600">
              Become a Soesy member to view full profile details and connect with verified members.
            </p>

            <div className="my-5 rounded-xl bg-amber-50/60 p-4 font-medium text-amber-900">
              <span className="text-xl font-bold text-red-900">₹2,000</span> Membership · Access up to 20 profiles
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="w-full rounded-xl bg-red-900 py-3 font-semibold text-white transition hover:bg-red-950"
            >
              Become a Member
            </button>

            <button
              onClick={handleClose}
              className="mt-3 w-full rounded-xl border border-gray-200 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
            >
              Continue Browsing
            </button>
          </div>
        ) : submitted ? (
          /* Success View */
          <div className="py-6 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
            <h3 className="mt-3 text-xl font-bold text-gray-900">Request Received!</h3>
            <p className="mt-2 text-sm text-gray-600">
              Our executive will call you shortly to assist with your membership activation.
            </p>
            <button
              onClick={handleClose}
              className="mt-6 w-full rounded-xl bg-red-900 py-2.5 font-semibold text-white hover:bg-red-950"
            >
              Done
            </button>
          </div>
        ) : (
          /* Contact Form View */
          <div>
            <div className="mb-4 flex items-center gap-2 text-red-900">
              <PhoneCall className="h-5 w-5" />
              <h3 className="text-xl font-bold">Request Executive Call</h3>
            </div>

            <p className="mb-4 text-xs text-gray-500">
              Please provide your contact details. Our team will reach out to activate your membership.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-red-900 focus:outline-none"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-red-900 focus:outline-none"
                  placeholder="Enter mobile number"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Email (Optional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-red-900 focus:outline-none"
                  placeholder="name@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-xl bg-red-900 py-3 font-semibold text-white hover:bg-red-950 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Details'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
