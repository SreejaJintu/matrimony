import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Clock3, BadgeCheck, UserPlus, ArrowRight } from 'lucide-react'
import { api } from '../../services/api'
import '../components/broker.css'

const unwrap = (response) => response?.data ?? response?.Data ?? []

export default function BrokerDashboardPage() {
  const [summary, setSummary] = useState({ total: 0, pending: 0, approved: 0 })
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    api.getBrokerCandidates()
      .then((response) => {
        if (!active) return
        const candidates = unwrap(response) ?? []
        setSummary({
          total: candidates.length,
          pending: candidates.filter((candidate) => String(candidate.profileStatus || '').toLowerCase() === 'pending').length,
          approved: candidates.filter((candidate) => String(candidate.profileStatus || '').toLowerCase() === 'approved').length,
        })
      })
      .catch((requestError) => { if (active) setError(requestError.message || 'Unable to load candidate summary.') })
    return () => { active = false }
  }, [])

  return (
    <section className="broker-page">
      <header className="broker-dashboard-welcome">
        <div><p className="broker-eyebrow">BROKER WORKSPACE</p><h1>Broker Dashboard</h1><p>Manage your candidate profiles and keep track of their progress.</p></div>
        <Link className="broker-button primary broker-register-button" to="/broker/candidates/add"><UserPlus size={17} />Register Candidate</Link>
      </header>
      {error && <div className="broker-alert" role="alert">{error}</div>}
      <div className="broker-summary-grid">
        <article className="broker-summary-card"><span className="broker-summary-icon"><Users size={19} /></span><div><small>My Candidates</small><strong>{summary.total}</strong></div><Link to="/broker/candidates" aria-label="View my candidates"><ArrowRight size={17} /></Link></article>
        <article className="broker-summary-card"><span className="broker-summary-icon pending"><Clock3 size={19} /></span><div><small>Pending Candidates</small><strong>{summary.pending}</strong></div></article>
        <article className="broker-summary-card"><span className="broker-summary-icon approved"><BadgeCheck size={19} /></span><div><small>Approved Candidates</small><strong>{summary.approved}</strong></div></article>
      </div>
      <div className="broker-dashboard-shortcut"><div><h2>Need to add a profile?</h2><p>Register a candidate and complete their profile details.</p></div><Link className="broker-button primary" to="/broker/candidates/add">+ Register Candidate</Link></div>
    </section>
  )
}
