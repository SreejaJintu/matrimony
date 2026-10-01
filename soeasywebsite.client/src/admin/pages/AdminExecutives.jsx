import { useEffect, useState } from "react";
import { Eye, Pencil, Plus, Power } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import adminExecutiveService from "../services/adminExecutiveService";
import "../styles/adminBrokers.css";
import "../styles/adminExecutives.css";

const responseMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.Message || error?.message || fallback;

const responseData = (response) => response?.data ?? response?.Data;

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
};

const AdminExecutives = () => {
  const navigate = useNavigate();
  const [executives, setExecutives] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [actionExecutiveId, setActionExecutiveId] = useState(null);

  useEffect(() => {
    let isCurrent = true;
    const timeoutId = window.setTimeout(async () => {
      try {
        setLoading(true);
        setLoadError("");
        const result = await adminExecutiveService.getExecutives({
          search: search.trim(),
          isActive: statusFilter,
        });
        if (result?.success === false || result?.Success === false) {
          throw new Error(result.message || result.Message || "Unable to load executives.");
        }
        if (isCurrent) {
          const items = responseData(result) ?? [];
          setExecutives(Array.isArray(items) ? items : []);
        }
      } catch (error) {
        if (isCurrent) {
          setExecutives([]);
          setLoadError(responseMessage(error, "Unable to load executives."));
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    }, 250);

    return () => {
      isCurrent = false;
      window.clearTimeout(timeoutId);
    };
  }, [search, statusFilter]);

  const handleStatusChange = async (executive) => {
    const nextStatus = !executive.isActive;
    const action = nextStatus ? "activate" : "deactivate";
    if (!window.confirm(`Are you sure you want to ${action} ${executive.fullName}?`)) return;

    setActionExecutiveId(executive.executiveId);
    setLoadError("");
    setSuccessMessage("");
    try {
      const result = await adminExecutiveService.updateExecutiveStatus(executive.executiveId, nextStatus);
      if (result?.success === false || result?.Success === false) {
        throw new Error(result.message || result.Message || `Unable to ${action} executive.`);
      }
      setExecutives((current) => current.map((item) =>
        item.executiveId === executive.executiveId ? { ...item, isActive: nextStatus } : item
      ));
      setSuccessMessage(`${executive.fullName} was ${nextStatus ? "activated" : "deactivated"}.`);
    } catch (error) {
      setLoadError(responseMessage(error, `Unable to ${action} executive.`));
    } finally {
      setActionExecutiveId(null);
    }
  };

  return (
    <div className="admin-executives-page admin-brokers-page">
      <header className="admin-brokers-header">
        <div>
          <h1>Executives</h1>
          <p>View and manage Executive accounts.</p>
        </div>
        <Link to="/admin/executives/add" className="brokers-primary-button">
          <Plus size={17} aria-hidden="true" />
          Add Executive
        </Link>
      </header>

      {successMessage && (
        <div className="brokers-notice brokers-notice-success" role="status">
          <span>{successMessage}</span>
          <button type="button" aria-label="Dismiss message" onClick={() => setSuccessMessage("")}>×</button>
        </div>
      )}
      {loadError && <div className="brokers-notice brokers-notice-error" role="alert">{loadError}</div>}

      <section className="brokers-list-section" aria-labelledby="executive-list-title">
        <div className="brokers-section-heading">
          <div>
            <h2 id="executive-list-title">Executive Accounts</h2>
            <p>{executives.length} {executives.length === 1 ? "Executive" : "Executives"}</p>
          </div>
        </div>

        <div className="executive-list-tools">
          <label className="brokers-field">
            <span>Search</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, username, email, or mobile"
              aria-label="Search executives"
            />
          </label>
          <label className="brokers-field">
            <span>Status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="">All statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </label>
        </div>

        {loading ? (
          <div className="brokers-state" role="status">Loading executives...</div>
        ) : loadError ? (
          <div className="brokers-state" role="alert">Unable to load executives.</div>
        ) : executives.length === 0 ? (
          <div className="brokers-state">
            <strong>No executives found</strong>
            <span>{search || statusFilter ? "Try changing the search or status filter." : "Add an Executive account to get started."}</span>
          </div>
        ) : (
          <div className="brokers-table-wrap">
            <table className="brokers-table executive-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {executives.map((executive) => (
                  <tr key={executive.executiveId}>
                    <td><strong>{executive.fullName}</strong></td>
                    <td>{executive.userName}</td>
                    <td>{executive.email || "-"}</td>
                    <td>{executive.mobileNumber || "-"}</td>
                    <td>
                      <span className={`broker-status ${executive.isActive ? "is-good" : "is-off"}`}>
                        {executive.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>{formatDate(executive.createdAt)}</td>
                    <td>
                      <div className="brokers-row-actions">
                        <button
                          type="button"
                          className="brokers-icon-action"
                          onClick={() => navigate(`/admin/executives/${executive.executiveId}`)}
                          aria-label={`View ${executive.fullName}`}
                          title="View Executive"
                        >
                          <Eye size={15} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="brokers-icon-action"
                          onClick={() => navigate(`/admin/executives/${executive.executiveId}`, { state: { edit: true } })}
                          aria-label={`Edit ${executive.fullName}`}
                          title="Edit Executive"
                        >
                          <Pencil size={15} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className={`brokers-icon-action ${executive.isActive ? "is-delete" : ""}`}
                          onClick={() => handleStatusChange(executive)}
                          disabled={actionExecutiveId === executive.executiveId}
                          aria-label={`${executive.isActive ? "Deactivate" : "Activate"} ${executive.fullName}`}
                          title={executive.isActive ? "Deactivate Executive" : "Activate Executive"}
                        >
                          <Power size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminExecutives;