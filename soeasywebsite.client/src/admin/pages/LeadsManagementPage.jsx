import { useState, useEffect } from 'react'
import { PhoneCall, Search, RefreshCw } from 'lucide-react'
import '../styles/LeadsManagementPage.css'

export default function LeadsManagementPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/lead/all')
      const data = await res.json()
      const ok = data?.success ?? data?.Success
      const rows = data?.data ?? data?.Data ?? []
      if (ok) {
        setLeads(Array.isArray(rows) ? rows : [])
      } else {
        setLeads([])
      }
    } catch (err) {
      console.error('Failed to load leads:', err)
      setLeads([])
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
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="table-status-cell">Loading leads...</td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="4" className="table-status-cell">No leads found.</td>
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
