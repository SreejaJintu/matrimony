import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, RefreshCw, Eye, Users } from 'lucide-react'
import { api } from '../../services/api'
import '../components/broker.css'

const unwrap = (response) => response?.data ?? response?.Data ?? response
const formatDate = (value) => value ? new Date(value).toLocaleDateString() : '—'

export default function BrokerCandidatesPage() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  const loadCandidates = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await api.getBrokerCandidates()
      setCandidates(unwrap(result) ?? [])
    } catch (err) {
      setError(err.message || 'Unable to load candidates.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    api.getBrokerCandidates()
      .then((result) => { if (active) setCandidates(unwrap(result) ?? []) })
      .catch((err) => { if (active) setError(err.message || 'Unable to load candidates.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const viewCandidate = async (userId) => {
    try {
      const result = await api.getBrokerCandidate(userId)
      setSelected(unwrap(result))
    } catch (err) {
      setError(err.message || 'Unable to load candidate details.')
    }
  }

  return (
    <section className="broker-page">
      <header className="broker-page-heading">
        <div><p className="broker-eyebrow">BROKER WORKSPACE</p><h1>My Candidates</h1><p>Profiles registered under your broker account.</p></div>
        <div className="broker-heading-actions">
          <button type="button" className="broker-button secondary" onClick={loadCandidates} disabled={loading}><RefreshCw size={16} />Refresh</button>
          <Link className="broker-button primary" to="/broker/candidates/add"><Plus size={17} />Register Candidate</Link>
        </div>
      </header>

      {error && <div className="broker-alert" role="alert">{error}</div>}

      <div className="broker-card">
        <div className="broker-card-heading"><div><h2>Candidate Profiles</h2><p>{candidates.length} {candidates.length === 1 ? 'candidate' : 'candidates'}</p></div></div>
        {loading ? <div className="broker-empty">Loading candidates...</div> : candidates.length === 0 ? (
          <div className="broker-empty"><Users size={30} /><strong>No candidates yet</strong><span>Add a candidate to start managing profiles.</span><Link className="broker-button primary" to="/broker/candidates/add"><Plus size={16} />Register Candidate</Link></div>
        ) : (
          <div className="broker-table-wrap"><table className="broker-table"><thead><tr><th>Profile Code</th><th>Name</th><th>Gender</th><th>Status</th><th>Profile completion</th><th>Created</th><th /></tr></thead>
            <tbody>{candidates.map((candidate) => <tr key={candidate.userId}>
              <td><strong>{candidate.profileCode}</strong></td><td>{candidate.fullName}</td><td>{candidate.gender || '—'}</td>
              <td><span className="broker-status">{candidate.profileStatus || '—'}</span></td>
              <td><span className={`broker-completion ${candidate.isProfileCompleted ? 'complete' : ''}`}>{candidate.isProfileCompleted ? 'Complete' : 'In progress'}</span></td>
              <td>{formatDate(candidate.createdAt)}</td><td><button className="broker-view-button" type="button" onClick={() => viewCandidate(candidate.userId)}><Eye size={16} />View</button></td>
            </tr>)}</tbody></table></div>
        )}
      </div>

      {selected && <div className="broker-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null) }}>
        <section className="broker-modal" role="dialog" aria-modal="true" aria-labelledby="candidate-detail-title">
          <header><div><p className="broker-eyebrow">CANDIDATE DETAILS</p><h2 id="candidate-detail-title">{selected.fullName}</h2></div><button type="button" onClick={() => setSelected(null)} aria-label="Close">×</button></header>
          <dl className="broker-detail-grid">
            <div><dt>Profile Code</dt><dd>{selected.profileCode}</dd></div><div><dt>Gender</dt><dd>{selected.gender || '—'}</dd></div>
            <div><dt>Mobile</dt><dd>{selected.mobileNumber || '—'}</dd></div><div><dt>Email</dt><dd>{selected.email || '—'}</dd></div>
            <div><dt>Status</dt><dd>{selected.profileStatus || '—'}</dd></div><div><dt>Profile Completion</dt><dd>{selected.isProfileCompleted ? 'Complete' : 'In progress'}</dd></div>
            <div><dt>Membership</dt><dd>{selected.isPremium ? 'Premium' : 'Free'}</dd></div><div><dt>Created</dt><dd>{formatDate(selected.createdAt)}</dd></div>
          </dl>
          <footer><button type="button" className="broker-button secondary" onClick={() => setSelected(null)}>Close</button></footer>
        </section>
      </div>}
    </section>
  )
}
