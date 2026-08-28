import { useState, useEffect, useRef } from "react"
import { activateSubscription, getMembershipPlans } from "../../services/adminSubscriptionService"
import adminProfileService from "../../services/adminProfileService"
import "../../styles/adminSubscription.css"

export default function ActivateSubscriptionForm() {
  // User search
  const [searchQuery, setSearchQuery]     = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedUser, setSelectedUser]   = useState(null)
  const [showDropdown, setShowDropdown]   = useState(false)
  const debounceRef = useRef(null)
  const wrapperRef  = useRef(null)
  const [membershipPlans, setMembershipPlans] = useState([])
  const [plansLoading, setPlansLoading] = useState(false)

  // Plan
  const [selectedPlanId, setSelectedPlanId] = useState("")
  const selectedPlan = membershipPlans.find(
    (p) => Number(p.membershipPlanId ?? p.id) === Number(selectedPlanId)
  ) || null

  // Other fields
  const [paymentReference, setPaymentReference] = useState("")
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  )

  // UI state
  const [loading, setLoading]               = useState(false)
  const [message, setMessage]               = useState("")
  const [error, setError]                   = useState("")
  const [validationError, setValidationError] = useState("")

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setPlansLoading(true)
        const result = await getMembershipPlans()
        const plans = result?.data ?? result ?? []
        setMembershipPlans(Array.isArray(plans) ? plans : [])
      } catch (err) {
        console.error("Failed to load membership plans:", err)
        setMembershipPlans([])
      } finally {
        setPlansLoading(false)
      }
    }

    loadPlans()
  }, [])

  // Debounced user search (400 ms)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!searchQuery.trim() || selectedUser) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setSearchLoading(true)
        const result = await adminProfileService.getProfiles({
          search: searchQuery.trim(),
        })
        if (result.success) {
          setSearchResults(result.data || [])
          setShowDropdown(true)
        } else {
          setSearchResults([])
        }
      } catch {
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }, 400)

    return () => clearTimeout(debounceRef.current)
  }, [searchQuery, selectedUser])

  const handleSelectUser = (profile) => {
    setSelectedUser({
      userId:      profile.userId,
      fullName:    profile.fullName,
      profileCode: profile.profileCode,
    })
    setSearchQuery("")
    setShowDropdown(false)
    setSearchResults([])
    setValidationError("")
  }

  const handleClearUser = () => {
    setSelectedUser(null)
    setSearchQuery("")
  }

  const validate = () => {
    if (!selectedUser)   return "Please search and select a member."
    if (!selectedPlanId) return "Please select a membership plan."
    if (!startDate)      return "Please select a start date."
    if (selectedPlan && selectedPlan.amount > 0 && !paymentReference.trim()) {
      return "Payment Reference / UTR is required for paid plans."
    }
    return ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setError("")

    const vErr = validate()
    if (vErr) {
      setValidationError(vErr)
      return
    }
    setValidationError("")
    setLoading(true)

    try {
      const result = await activateSubscription({
        userId:           selectedUser.userId,
        membershipPlanId: Number(selectedPlanId),
        amountPaid:       selectedPlan ? selectedPlan.amount : 0,
        paymentReference: paymentReference.trim() || null,
        startDate,
      })

      if (result.success) {
        setMessage(result.message || "Subscription activated successfully.")
        setSelectedUser(null)
        setSelectedPlanId("")
        setPaymentReference("")
        setStartDate(new Date().toISOString().split("T")[0])
      } else {
        setError(result.message || "Subscription activation failed.")
      }
    } catch (err) {
      console.error("ADMIN SUBSCRIPTION ERROR:", err)
      setError(err.response?.data?.message || "Unable to activate subscription.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sub-form-card">
      <h2 className="sub-form-title">Activate Subscription</h2>

      <form onSubmit={handleSubmit} noValidate>

        {/* Member selector */}
        <div className="sub-form-group">
          <label className="sub-label">
            Member <span className="sub-required">*</span>
          </label>

          {selectedUser ? (
            <div className="sub-selected-user">
              <div className="sub-selected-user-info">
                <span className="sub-profile-code">{selectedUser.profileCode}</span>
                <strong className="sub-selected-name">{selectedUser.fullName}</strong>
                <span className="sub-user-id">User ID: {selectedUser.userId}</span>
              </div>
              <button
                type="button"
                className="sub-clear-user"
                onClick={handleClearUser}
                title="Change member"
              >
                &#x2715;
              </button>
            </div>
          ) : (
            <div className="sub-search-wrapper" ref={wrapperRef}>
              <input
                type="text"
                className="sub-input"
                placeholder="Search by name, profile code or user ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
              />

              {searchLoading && (
                <div className="sub-search-hint">Searching...</div>
              )}

              {showDropdown && searchResults.length > 0 && (
                <ul className="sub-search-dropdown">
                  {searchResults.map((p) => (
                    <li
                      key={p.userId}
                      className="sub-search-item"
                      onMouseDown={() => handleSelectUser(p)}
                    >
                      <span className="sub-profile-code">{p.profileCode}</span>
                      <span className="sub-search-name">{p.fullName}</span>
                      <span className="sub-user-id">User ID: {p.userId}</span>
                    </li>
                  ))}
                </ul>
              )}

              {showDropdown && !searchLoading && searchResults.length === 0 && (
                <div className="sub-search-empty">No profiles found.</div>
              )}
            </div>
          )}
        </div>

        {/* Membership Plan */}
        <div className="sub-form-group">
          <label className="sub-label">
            Membership Plan <span className="sub-required">*</span>
          </label>

          <select
            className="sub-select"
            value={selectedPlanId}
            disabled={plansLoading}
            onChange={(e) => {
              setSelectedPlanId(e.target.value)
              setValidationError("")
            }}
          >
            <option value="">{plansLoading ? "-- Loading plans --" : "-- Select a plan --"}</option>
            {membershipPlans.map((p) => {
              const planId = p.membershipPlanId ?? p.id
              return (
                <option key={planId} value={planId}>{p.planName ?? p.name}</option>
              )
            })}
          </select>

          {selectedPlan && (
            <div className="sub-plan-details">
              <div className="sub-plan-detail-item">
                <span>Plan</span>
                <strong>{selectedPlan.planName ?? selectedPlan.name}</strong>
              </div>
              <div className="sub-plan-detail-item">
                <span>Amount</span>
                <strong>&#8377;{Number(selectedPlan.amount).toLocaleString("en-IN")}</strong>
              </div>
              <div className="sub-plan-detail-item">
                <span>Validity</span>
                <strong>{selectedPlan.validityDays ?? selectedPlan.days} days</strong>
              </div>
              <div className="sub-plan-detail-item">
                <span>Profile Views</span>
                <strong>
                  {(selectedPlan.profileViewCredits ?? selectedPlan.profileViews) === 0
                    ? "Unlimited"
                    : (selectedPlan.profileViewCredits ?? selectedPlan.profileViews)}
                </strong>
              </div>
            </div>
          )}
        </div>

        {/* Amount Paid (read-only) */}
        <div className="sub-form-group">
          <label className="sub-label">Amount Paid</label>
          <input
            type="text"
            className="sub-input sub-input-readonly"
            value={
              selectedPlan !== null
                ? "Rs." + Number(selectedPlan.amount).toLocaleString("en-IN")
                : "--"
            }
            readOnly
            tabIndex={-1}
          />
          <p className="sub-hint">Automatically set from the selected plan.</p>
        </div>

        {/* Payment Reference */}
        <div className="sub-form-group">
          <label className="sub-label">
            Payment Reference / UTR
            {selectedPlan && selectedPlan.amount > 0 && (
              <span className="sub-required"> *</span>
            )}
          </label>
          <input
            type="text"
            className="sub-input"
            placeholder="Enter UTR / GPay / bank reference"
            value={paymentReference}
            onChange={(e) => setPaymentReference(e.target.value)}
          />
          {selectedPlan && selectedPlan.amount === 0 && (
            <p className="sub-hint">Not required for the Free plan.</p>
          )}
        </div>

        {/* Start Date */}
        <div className="sub-form-group">
          <label className="sub-label">
            Start Date <span className="sub-required">*</span>
          </label>
          <input
            type="date"
            className="sub-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* Feedback */}
        {validationError && (
          <div className="sub-error">{validationError}</div>
        )}
        {error && (
          <div className="sub-error">{error}</div>
        )}
        {message && (
          <div className="sub-success">{message}</div>
        )}

        <button
          type="submit"
          className="sub-submit-btn"
          disabled={loading}
        >
          {loading ? "Activating..." : "Activate Subscription"}
        </button>

      </form>
    </div>
  )
}
