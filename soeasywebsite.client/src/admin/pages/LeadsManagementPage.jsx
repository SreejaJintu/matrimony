import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { PhoneCall, Search, RefreshCw, X } from 'lucide-react'
import '../styles/LeadsManagementPage.css'

export default function LeadsManagementPage() {
  const location = useLocation()
  const isExecutive = location.pathname.startsWith('/executive/')
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [loadError, setLoadError] = useState('')
  const [selectedLead, setSelectedLead] = useState(null)
  const [editForm, setEditForm] = useState({ status: 'New', notes: '', followUpDate: '' })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')

  const openEditor = (lead) => {
    const date = lead.followUpDate ? new Date(lead.followUpDate) : null
    const localDate = date && !Number.isNaN(date.getTime())
      ? new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
      : ''
    setSelectedLead(lead)
    setEditForm({ status: lead.status || 'New', notes: lead.notes || '', followUpDate: localDate })
    setSaveError('')
    setSaveSuccess('')
  }

  const saveLead = async (event) => {
    event.preventDefault()
    if (!selectedLead || saving) return
    setSaveError('')
    setSaving(true)
    try {
      const token = localStorage.getItem('soesyExecutiveToken') || localStorage.getItem('soesyAdminToken')
      const response = await fetch(`/api/lead/${selectedLead.leadId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status: editForm.status,
          notes: editForm.notes.trim() || null,
          followUpDate: editForm.followUpDate ? new Date(editForm.followUpDate).toISOString() : null,
        }),
      })
      const responseText = await response.text()
      let result = null
      try { result = responseText ? JSON.parse(responseText) : null } catch { /* handled below */ }
      if (!response.ok) {
        const message = response.status === 401 ? 'Your session has expired. Sign in again.'
          : response.status === 403 ? 'You are not allowed to update this lead.'
            : response.status === 404 ? 'This lead could not be found.'
              : response.status === 400 ? (result?.message || result?.Message || 'Check the status and lead details.')
                : 'The lead could not be updated. Please try again.'
        throw new Error(message)
      }
      setLeads((current) => current.map((lead) => lead.leadId === selectedLead.leadId
        ? { ...lead, status: editForm.status, notes: editForm.notes.trim() || null, followUpDate: editForm.followUpDate ? new Date(editForm.followUpDate).toISOString() : null }
        : lead))
      setSelectedLead(null)
      setSaveSuccess('Lead updated successfully.')
      window.setTimeout(() => setSaveSuccess(''), 3500)
    } catch (err) {
      setSaveError(err.message || 'The lead could not be updated. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const fetchLeads = async () => {
    setLoading(true)
    setLoadError('')
    try {
      const token = localStorage.getItem('soesyExecutiveToken') || localStorage.getItem('soesyAdminToken')
      const res = await fetch('/api/lead/all', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const responseText = await res.text()
      let data = null
      try {
        data = responseText ? JSON.parse(responseText) : null
      } catch {
        throw new Error(`Leads API returned an invalid response (HTTP ${res.status}).`)
      }
      if (!res.ok) {
        throw new Error(data?.message || data?.Message || `Unable to load leads (HTTP ${res.status}).`)
      }
      const ok = data?.success ?? data?.Success
      const rows = data?.data ?? data?.Data ?? []
      if (ok) {
        setLeads(Array.isArray(rows) ? rows : [])
      } else {
        throw new Error(data?.message || data?.Message || 'Unable to load leads.')
      }
    } catch (err) {
      console.error('Failed to load leads:', err)
      setLeads([])
      setLoadError(err.message || 'Failed to load leads.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      (lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(lead.mobileNumber || '').includes(searchTerm) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1>Leads</h1>
          <p>All lead records from the database table.</p>
        </div>
        <button className="admin-refresh-btn" onClick={fetchLeads} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>
      {saveSuccess && <div className="lead-save-success" role="status">{saveSuccess}</div>}

      {/* Search */}
      <div className="admin-toolbar">
        <div className="admin-search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Requested On</th>
              <th>Name</th>
              <th>Contact Details</th>
              <th>Plan Interested</th>
              {isExecutive && <><th>Status</th><th>Action</th></>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={isExecutive ? 6 : 4} className="table-status-cell">Loading leads...</td>
              </tr>
            ) : loadError ? (
              <tr>
                <td colSpan={isExecutive ? 6 : 4} className="table-status-cell">{loadError}</td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={isExecutive ? 6 : 4} className="table-status-cell">No leads found.</td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.leadId}>
                  <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td>
                    <strong>{lead.name}</strong>
                    {lead.userId && <span className="user-id-tag">User #{lead.userId}</span>}
                  </td>
                  <td>
                    <div className="contact-info">
                      <a href={`tel:${lead.mobileNumber}`} className="phone-link">
                        <PhoneCall size={13} /> {lead.mobileNumber}
                      </a>
                      {lead.email && <span className="email-subtext">{lead.email}</span>}
                    </div>
                  </td>
                  <td><span className="plan-tag">{lead.preferredPlan}</span></td>
                  {isExecutive && <>
                    <td><span className={`lead-status-badge ${String(lead.status || 'New').toLowerCase().replaceAll(' ', '-')}`}>{lead.status || 'New'}</span></td>
                    <td><button type="button" className="admin-action-btn" onClick={() => openEditor(lead)}>Update</button></td>
                  </>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isExecutive && selectedLead && (
        <div className="admin-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && !saving && setSelectedLead(null)}>
          <section className="lead-edit-modal" role="dialog" aria-modal="true" aria-labelledby="lead-edit-title">
            <div className="lead-edit-modal-header"><div><h2 id="lead-edit-title">Update Lead</h2><p>Record the latest conversation outcome.</p></div><button type="button" className="lead-modal-close" aria-label="Close" disabled={saving} onClick={() => setSelectedLead(null)}><X size={20} /></button></div>
            <div className="lead-readonly-details">
              <div><span>Name</span><strong>{selectedLead.name || '—'}</strong></div>
              <div><span>Phone</span><strong>{selectedLead.mobileNumber || '—'}</strong></div>
              <div><span>Email</span><strong>{selectedLead.email || '—'}</strong></div>
              <div><span>Preferred Plan</span><strong>{selectedLead.preferredPlan || '—'}</strong></div>
            </div>
            <form onSubmit={saveLead} className="lead-edit-form">
              <label>Status<select required value={editForm.status} onChange={(event) => setEditForm((value) => ({ ...value, status: event.target.value }))}>
                {['New', 'Called', 'Follow Up', 'Paid', 'Cancelled'].map((status) => <option key={status} value={status}>{status}</option>)}
              </select></label>
              <label>Conversation Notes<textarea rows="4" maxLength="1000" placeholder="Enter conversation notes..." value={editForm.notes} onChange={(event) => setEditForm((value) => ({ ...value, notes: event.target.value }))} /></label>
              <label>Follow-up Date<input type="datetime-local" value={editForm.followUpDate} onChange={(event) => setEditForm((value) => ({ ...value, followUpDate: event.target.value }))} /></label>
              {saveError && <div className="lead-edit-error" role="alert">{saveError}</div>}
              <div className="lead-edit-actions"><button type="button" className="lead-cancel-btn" disabled={saving} onClick={() => setSelectedLead(null)}>Cancel</button><button type="submit" className="lead-save-btn" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button></div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
