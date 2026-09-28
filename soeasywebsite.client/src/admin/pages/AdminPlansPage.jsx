import { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import {
  createMembershipPlan,
  deactivateMembershipPlan,
  getMembershipPlans,
  updateMembershipPlan,
} from "../services/adminSubscriptionService"
import "../styles/adminSubscription.css"

const createEmptyForm = () => ({
  planName: "",
  amount: "",
  validityDays: "",
  profileViewLimit: "",
  profileViewCredits: "",
  canViewContact: true,
  canChat: true,
  unlimitedInterest: true,
  isActive: true,
})

export default function AdminPlansPage() {
  const [formData, setFormData] = useState(createEmptyForm)

  const [loading, setLoading] = useState(false)
  const [editingPlanId, setEditingPlanId] = useState(null)
  const [planActionId, setPlanActionId] = useState(null)
  const [plans, setPlans] = useState([])
  const [plansLoading, setPlansLoading] = useState(true)
  const [plansError, setPlansError] = useState("")
  const [plansRefresh, setPlansRefresh] = useState(0)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    let isCurrent = true

    const loadPlans = async () => {
      setPlansLoading(true)
      setPlansError("")
      try {
        const result = await getMembershipPlans()
        const planList = result?.data ?? result?.Data ?? result ?? []
        if (isCurrent) setPlans(Array.isArray(planList) ? planList : [])
      } catch (loadError) {
        if (isCurrent) {
          setPlansError(loadError.message || "Unable to load membership plans.")
          setPlans([])
        }
      } finally {
        if (isCurrent) setPlansLoading(false)
      }
    }

    loadPlans()
    return () => { isCurrent = false }
  }, [plansRefresh])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const resetForm = () => {
    setFormData(createEmptyForm())
    setEditingPlanId(null)
    setError("")
    setMessage("")
  }

  const handleEditPlan = (plan) => {
    setEditingPlanId(plan.membershipPlanId ?? plan.MembershipPlanId ?? plan.id ?? plan.Id)
    setFormData({
      planName: plan.planName ?? plan.PlanName ?? "",
      amount: String(plan.amount ?? plan.Amount ?? 0),
      validityDays: String(plan.validityDays ?? plan.ValidityDays ?? ""),
      profileViewLimit: String(plan.profileViewLimit ?? plan.ProfileViewLimit ?? 0),
      profileViewCredits: String(plan.profileViewCredits ?? plan.ProfileViewCredits ?? 0),
      canViewContact: plan.canViewContact ?? plan.CanViewContact ?? false,
      canChat: plan.canChat ?? plan.CanChat ?? false,
      unlimitedInterest: plan.unlimitedInterest ?? plan.UnlimitedInterest ?? false,
      isActive: plan.isActive ?? plan.IsActive ?? false,
    })
    setError("")
    setMessage("")
  }

  const handleDeletePlan = async (plan) => {
    const planId = plan.membershipPlanId ?? plan.MembershipPlanId ?? plan.id ?? plan.Id
    const planName = plan.planName ?? plan.PlanName ?? "this plan"
    if (!window.confirm(`Deactivate ${planName}? Existing subscriptions will keep their plan history.`)) return

    setPlanActionId(planId)
    setPlansError("")
    setMessage("")
    try {
      await deactivateMembershipPlan(planId)
      setMessage(`${planName} was deactivated.`)
      setPlansRefresh((current) => current + 1)
    } catch (actionError) {
      setPlansError(actionError.response?.data?.message || actionError.message || "Unable to deactivate plan.")
    } finally {
      setPlanActionId(null)
    }
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
        isActive: formData.isActive,
        profileViewCredits: Number(formData.profileViewCredits || formData.profileViewLimit),
        profileViewLimit: Number(formData.profileViewLimit),
      }

      const res = editingPlanId
        ? await updateMembershipPlan(editingPlanId, payload)
        : await createMembershipPlan(payload)

      if (res.success ?? res.Success ?? res.data ?? res.Data) {
        const successMessage = res.message || res.Message || `Membership plan ${editingPlanId ? "updated" : "created"} successfully!`
        setFormData(createEmptyForm())
        setEditingPlanId(null)
        setError("")
        setMessage(successMessage)
        setPlansRefresh((current) => current + 1)
      } else {
        setError(res.message || res.Message || `Failed to ${editingPlanId ? "update" : "create"} plan.`)
      }
    } catch (err) {
      console.error("SAVE PLAN ERROR:", err)
      setError(err?.response?.data?.message || err?.message || "Failed to save membership plan.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-subscription-page">
      <div className="admin-page-header">
        <h1>{editingPlanId ? "Edit Membership Plan" : "Add Membership Plan"}</h1>
        <p>Configure membership packages and manage existing plans.</p>
      </div>

      <div className="sub-form-card">
        <h2 className="sub-form-title">{editingPlanId ? "Edit Plan Details" : "Plan Details"}</h2>

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
          <div className="sub-form-group sub-plan-flags">
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
            {editingPlanId && (
              <label className="sub-plan-active-toggle">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                Active Plan
              </label>
            )}
          </div>

          {/* Feedback */}
          {error && <div className="sub-error">{error}</div>}
          {message && <div className="sub-success">{message}</div>}

          <button type="submit" className="sub-submit-btn" disabled={loading}>
            {loading ? "Saving Plan..." : editingPlanId ? "Update Plan" : "Create Plan"}
          </button>
          {editingPlanId && (
            <button type="button" className="sub-cancel-edit-btn" onClick={resetForm} disabled={loading}>
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <section className="sub-plan-list-card" aria-labelledby="existing-plans-heading">
        <div className="sub-plan-list-header">
          <div>
            <h2 className="sub-form-title" id="existing-plans-heading">Existing Plans</h2>
            <p>{plans.length} membership {plans.length === 1 ? "plan" : "plans"}</p>
          </div>
        </div>

        {plansLoading ? (
          <div className="sub-plan-list-state">Loading plans...</div>
        ) : plansError ? (
          <div className="sub-error">{plansError}</div>
        ) : plans.length === 0 ? (
          <div className="sub-plan-list-state">No membership plans found.</div>
        ) : (
          <div className="sub-plan-table-wrap">
            <table className="sub-plan-table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Price</th>
                  <th>Validity</th>
                  <th>Profile Views</th>
                  <th>Features</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => {
                  const planId = plan.membershipPlanId ?? plan.MembershipPlanId ?? plan.id ?? plan.Id
                  const planName = plan.planName ?? plan.PlanName ?? "Unnamed plan"
                  const amount = plan.amount ?? plan.Amount ?? 0
                  const validityDays = plan.validityDays ?? plan.ValidityDays ?? 0
                  const profileViews = plan.profileViewCredits ?? plan.ProfileViewCredits ?? plan.profileViewLimit ?? plan.ProfileViewLimit ?? 0
                  const isActive = plan.isActive ?? plan.IsActive ?? false
                  const currentPlanId = plan.membershipPlanId ?? plan.MembershipPlanId ?? plan.id ?? plan.Id

                  return (
                    <tr key={planId ?? planName}>
                      <td><strong>{planName}</strong></td>
                      <td>{Number(amount) === 0 ? "Free" : `₹${Number(amount).toLocaleString("en-IN")}`}</td>
                      <td>{validityDays} days</td>
                      <td>{profileViews}</td>
                      <td className="sub-plan-features">
                        {[
                          (plan.canViewContact ?? plan.CanViewContact) && "Contact",
                          (plan.canChat ?? plan.CanChat) && "Chat",
                          (plan.unlimitedInterest ?? plan.UnlimitedInterest) && "Unlimited interest",
                        ].filter(Boolean).join(", ") || "—"}
                      </td>
                      <td>
                        <span className={`sub-plan-status ${isActive ? "is-active" : "is-inactive"}`}>
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="sub-plan-actions">
                          <button
                            type="button"
                            className="sub-plan-action-btn"
                            onClick={() => handleEditPlan(plan)}
                            aria-label={`Edit ${planName}`}
                            title="Edit plan"
                          >
                            <Pencil size={15} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className="sub-plan-action-btn is-delete"
                            onClick={() => handleDeletePlan(plan)}
                            disabled={!isActive || planActionId === currentPlanId}
                            aria-label={`Deactivate ${planName}`}
                            title={isActive ? "Deactivate plan" : "Plan is inactive"}
                          >
                            <Trash2 size={15} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
