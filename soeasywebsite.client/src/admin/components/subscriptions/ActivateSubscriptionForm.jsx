import { useState } from 'react'
import { activateSubscription } from '../../services/adminSubscriptionService'

export default function ActivateSubscriptionForm() {
  const [formData, setFormData] = useState({
    userId: '',
    membershipPlanId: '2',
    amountPaid: '999',
    paymentReference: '',
    startDate: new Date().toISOString().split('T')[0],
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setMessage('')
    setError('')

    try {
      const result = await activateSubscription({
        userId: Number(formData.userId),
        membershipPlanId: Number(formData.membershipPlanId),
        amountPaid: Number(formData.amountPaid),
        paymentReference: formData.paymentReference || null,
        startDate: formData.startDate,
      })

      if (result.success) {
        setMessage(
          result.message || 'Subscription activated successfully.'
        )
      } else {
        setError(
          result.message || 'Subscription activation failed.'
        )
      }
    } catch (err) {
      console.error('ADMIN SUBSCRIPTION ERROR:', err)

      setError(
        err.response?.data?.message ||
        'Unable to activate subscription.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-subscription-form">
      <h2>Activate Subscription</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>User ID</label>

          <input
            type="number"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            placeholder="Enter User ID"
            required
          />
        </div>

        <div>
          <label>Membership Plan</label>

          <select
            name="membershipPlanId"
            value={formData.membershipPlanId}
            onChange={handleChange}
          >
            <option value="1">Free</option>
            <option value="2">Standard</option>
            <option value="3">Premium</option>
          </select>
        </div>

        <div>
          <label>Amount Paid</label>

          <input
            type="number"
            name="amountPaid"
            value={formData.amountPaid}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Payment Reference / UTR</label>

          <input
            type="text"
            name="paymentReference"
            value={formData.paymentReference}
            onChange={handleChange}
            placeholder="Enter UTR / GPay reference"
          />
        </div>

        <div>
          <label>Start Date</label>

          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Activating...'
            : 'Activate Subscription'}
        </button>
      </form>
    </div>
  )
}