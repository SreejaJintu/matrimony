import { useState } from "react"
import { api } from "../../services/api"
import "../styles/adminSubscription.css"

export default function AdminPlansPage() {
  const [formData, setFormData] = useState({
    planName: "",
    amount: "",
    validityDays: "",
    profileViewLimit: "",
    profileViewCredits: "",
    canViewContact: true,
    canChat: true,
    unlimitedInterest: true,
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const validate = () => {
    if (!formData.planName.trim()) return "Plan Name is required."
    if (formData.amount === "" || Number(formData.amount) < 0) return "Please enter a valid amount."
    if (!formData.validityDays || Number(formData.validityDays) <= 0) return "Please enter valid duration in days."
    if (formData.profileViewLimit === "" || Number(formData.profileViewLimit) < 0) return "Please enter valid profile view limit."
    return ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setError("")

    const validationErr = validate()
    if (validationErr) {
      setError(validationErr)
      return
    }

    setLoading(true)

    try {
      const payload = {
        planName: formData.planName.trim(),
        amount: Number(formData.amount),
        validityDays: Number(formData.validityDays),
        canViewContact: formData.canViewContact,
        canChat: formData.canChat,
        unlimitedInterest: formData.unlimitedInterest,
        isActive: true,
        profileViewCredits: Number(formData.profileViewCredits || formData.profileViewLimit),
        profileViewLimit: Number(formData.profileViewLimit),
      }

      // Endpoint matching AdminPlanController.cs (/api/admin/plans)
      const res = await api.request?.('/api/admin/plans', {
        method: 'POST',
        data: payload,
      }) ?? await fetch('/api/admin/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then(r => r.json())

      if (res.success || res.data) {
        setMessage(res.message || "Membership plan created successfully!")
        setFormData({
          planName: "",
          amount: "",
          validityDays: "",
          profileViewLimit: "",
          profileViewCredits: "",
          canViewContact: true,
          canChat: true,
          unlimitedInterest: true,
        })
      } else {
        setError(res.message || "Failed to create plan.")
      }
    } catch (err) {
      console.error("ADD PLAN ERROR:", err)
      setError(err?.message || "Failed to add membership plan.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-subscription-page">
      <div className="admin-page-header">
        <h1>Add Membership Plan</h1>
        <p>Create and configure new membership packages for subscribers.</p>
      </div>

      <div className="sub-form-card">
        <h2 className="sub-form-title">Plan Details</h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Plan Name */}
          <div className="sub-form-group">
            <label className="sub-label">
              Plan Name <span className="sub-required">*</span>
            </label>
            <input
              type="text"
              name="planName"
              className="sub-input"
              placeholder="e.g. Standard, Premium, Gold"
              value={formData.planName}
              onChange={handleChange}
            />
          </div>

          {/* Amount & Validity Days */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="sub-form-group">
              <label className="sub-label">
                Price (&#8377;) <span className="sub-required">*</span>
              </label>
              <input
                type="number"
                name="amount"
                className="sub-input"
                placeholder="0 for Free plan"
                min="0"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>

            <div className="sub-form-group">
              <label className="sub-label">
                Validity (Days) <span className="sub-required">*</span>
              </label>
              <input
                type="number"
                name="validityDays"
                className="sub-input"
                placeholder="e.g. 30, 90, 180"
                min="1"
                value={formData.validityDays}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Profile View Limits */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="sub-form-group">
              <label className="sub-label">
                Profile View Limit <span className="sub-required">*</span>
              </label>
              <input
                type="number"
                name="profileViewLimit"
                className="sub-input"
                placeholder="e.g. 20"
                min="0"
                value={formData.profileViewLimit}
                onChange={handleChange}
              />
            </div>

            <div className="sub-form-group">
              <label className="sub-label">Profile View Credits</label>
              <input
                type="number"
                name="profileViewCredits"
                className="sub-input"
                placeholder="e.g. 20"
                min="0"
                value={formData.profileViewCredits}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Features / Flags */}
          <div className="sub-form-group" style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
              <input
                type="checkbox"
                name="canViewContact"
                checked={formData.canViewContact}
                onChange={handleChange}
              />
              Can View Contact
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
              <input
                type="checkbox"
                name="canChat"
                checked={formData.canChat}
                onChange={handleChange}
              />
              Can Chat
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
              <input
                type="checkbox"
                name="unlimitedInterest"
                checked={formData.unlimitedInterest}
                onChange={handleChange}
              />
              Unlimited Interest
            </label>
          </div>

          {/* Feedback */}
          {error && <div className="sub-error">{error}</div>}
          {message && <div className="sub-success">{message}</div>}

          <button type="submit" className="sub-submit-btn" disabled={loading}>
            {loading ? "Saving Plan..." : "Create Plan"}
          </button>
        </form>
      </div>
    </div>
  )
}
