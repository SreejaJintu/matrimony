import ActivateSubscriptionForm from '../components/subscriptions/ActivateSubscriptionForm'

export default function AdminSubscriptionPage() {
  return (
    <div className="admin-subscription-page">
      <div className="admin-page-header">
        <h1>Subscription Management</h1>
        <p>
          Activate membership subscriptions after payment confirmation.
        </p>
      </div>

      <ActivateSubscriptionForm />
    </div>
  )
}