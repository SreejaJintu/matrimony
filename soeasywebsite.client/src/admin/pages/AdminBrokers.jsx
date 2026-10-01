import { useEffect, useState } from "react";
import { Pencil, Trash2, Users } from "lucide-react";
import adminBrokerService from "../services/adminBrokerService";
import "../styles/adminBrokers.css";

const responseMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.Message || error?.message || fallback;

const AdminBrokers = () => {
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [registerOpen, setRegisterOpen] = useState(false);
  const [editingBroker, setEditingBroker] = useState(null);
  const [editForm, setEditForm] = useState({ brokerName: "", companyName: "", contactNumber: "", email: "" });
  const [editSaving, setEditSaving] = useState(false);
  const [actionBrokerId, setActionBrokerId] = useState(null);
  const [approvalBrokerId, setApprovalBrokerId] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    genderId: "",
    mobileNumber: "",
    accountEmail: "",
    password: "",
    brokerName: "",
    companyName: "",
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [candidateBroker, setCandidateBroker] = useState(null);
  const [brokerCandidates, setBrokerCandidates] = useState([]);
  const [candidateLoading, setCandidateLoading] = useState(false);

  const loadBrokers = async () => {
    try {
      setLoading(true);
      setLoadError("");
      const result = await adminBrokerService.getBrokers();
      setBrokers(result?.data ?? []);
    } catch (error) {
      setBrokers([]);
      setLoadError(responseMessage(error, "Unable to load Brokers."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadInitialBrokers = async () => {
      try {
        const result = await adminBrokerService.getBrokers();
        if (active) setBrokers(result?.data ?? []);
      } catch (error) {
        if (active) {
          setBrokers([]);
          setLoadError(responseMessage(error, "Unable to load Brokers."));
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadInitialBrokers();
    return () => {
      active = false;
    };
  }, []);

  const openRegistration = () => {
    setForm({
      fullName: "",
      genderId: "",
      mobileNumber: "",
      accountEmail: "",
      password: "",
      brokerName: "",
      companyName: "",
    });
    setFormError("");
    setRegisterOpen(true);
  };

  const closeRegistration = () => {
    if (saving) return;
    setRegisterOpen(false);
    setFormError("");
  };

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => {
      if (name === "fullName" && (!current.brokerName || current.brokerName === current.fullName)) {
        return { ...current, fullName: value, brokerName: value };
      }
      return { ...current, [name]: value };
    });
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setFormError("");
      const result = await adminBrokerService.registerBroker({
        fullName: form.fullName.trim(),
        genderId: Number(form.genderId),
        mobileNumber: form.mobileNumber.trim(),
        accountEmail: form.accountEmail.trim(),
        password: form.password,
        brokerName: form.brokerName.trim(),
        companyName: form.companyName.trim(),
      });

      setRegisterOpen(false);
      setSuccessMessage(result?.message || "Broker registered successfully.");
      await loadBrokers();
    } catch (error) {
      setFormError(responseMessage(error, "Unable to register this Broker."));
    } finally {
      setSaving(false);
    }
  };

  const openEditBroker = (broker) => {
    setEditingBroker(broker);
    setEditForm({
      brokerName: broker.brokerName || "",
      companyName: broker.companyName || "",
      contactNumber: broker.contactNumber || "",
      email: broker.email || "",
    });
    setFormError("");
  };

  const closeEditBroker = () => {
    if (editSaving) return;
    setEditingBroker(null);
    setFormError("");
  };

  const handleEditBroker = async (event) => {
    event.preventDefault();
    if (!editingBroker) return;

    try {
      setEditSaving(true);
      setFormError("");
      const result = await adminBrokerService.updateBroker(editingBroker.brokerId, {
        brokerName: editForm.brokerName.trim(),
        companyName: editForm.companyName.trim(),
        contactNumber: editForm.contactNumber.trim(),
        email: editForm.email.trim(),
      });
      if (result?.success === false || result?.Success === false) {
        throw new Error(result.message || result.Message || "Unable to update Broker.");
      }

      setEditingBroker(null);
      setSuccessMessage(result?.message || result?.Message || "Broker updated successfully.");
      await loadBrokers();
    } catch (error) {
      setFormError(responseMessage(error, "Unable to update this Broker."));
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteBroker = async (broker) => {
    if (!window.confirm(`Deactivate ${broker.brokerName}? The broker record will be retained.`)) return;

    setActionBrokerId(broker.brokerId);
    setLoadError("");
    try {
      await adminBrokerService.deleteBroker(broker.brokerId);
      setSuccessMessage(`${broker.brokerName} was deactivated.`);
      await loadBrokers();
    } catch (error) {
      setLoadError(responseMessage(error, "Unable to deactivate this Broker."));
    } finally {
      setActionBrokerId(null);
    }
  };

  const handleApprovalChange = async (broker) => {
    const nextApproval = !broker.isApproved;
    setApprovalBrokerId(broker.brokerId);
    setLoadError("");
    try {
      const result = await adminBrokerService.updateApproval(broker.brokerId, nextApproval);
      if (result?.success === false || result?.Success === false) {
        throw new Error(result.message || result.Message || "Unable to update broker approval.");
      }
      setBrokers((current) => current.map((item) =>
        item.brokerId === broker.brokerId
          ? { ...item, isApproved: nextApproval }
          : item
      ));
      setSuccessMessage(nextApproval ? `${broker.brokerName} approved.` : `${broker.brokerName}'s approval revoked.`);
    } catch (error) {
      setLoadError(responseMessage(error, "Unable to update broker approval."));
    } finally {
      setApprovalBrokerId(null);
    }
  };

  const updateEditForm = (event) => {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  };

  const openBrokerCandidates = async (broker) => {
    setCandidateBroker(broker);
    setCandidateLoading(true);
    setBrokerCandidates([]);
    try {
      const result = await adminBrokerService.getBrokerCandidates(broker.brokerId);
      setBrokerCandidates(result?.data ?? result?.Data ?? []);
    } catch (error) {
      setLoadError(responseMessage(error, "Unable to load broker candidates."));
      setCandidateBroker(null);
    } finally {
      setCandidateLoading(false);
    }
  };

  return (
    <div className="admin-brokers-page">
      <header className="admin-brokers-header">
        <div>
          <h1>Broker Management</h1>
          <p>Create a new Broker login and register it as approved and active.</p>
        </div>
        <button type="button" className="brokers-primary-button" onClick={openRegistration}>
          <span aria-hidden="true">+</span> Register Broker
        </button>
      </header>

      {successMessage && (
        <div className="brokers-notice brokers-notice-success" role="status">
          <span>{successMessage}</span>
          <button type="button" aria-label="Dismiss message" onClick={() => setSuccessMessage("")}>×</button>
        </div>
      )}
      {loadError && <div className="brokers-notice brokers-notice-error" role="alert">{loadError}</div>}

      <section className="brokers-list-section" aria-labelledby="broker-list-title">
        <div className="brokers-section-heading">
          <div>
            <h2 id="broker-list-title">Registered Brokers</h2>
            <p>{brokers.length} {brokers.length === 1 ? "Broker" : "Brokers"}</p>
          </div>
          <button type="button" className="brokers-secondary-button" onClick={loadBrokers} disabled={loading}>
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="brokers-state">Loading Brokers...</div>
        ) : brokers.length === 0 ? (
          <div className="brokers-state">
            <strong>No Brokers registered yet</strong>
            <span>Register a new Broker account to get started.</span>
          </div>
        ) : (
          <div className="brokers-table-wrap">
            <table className="brokers-table">
              <thead>
                <tr>
                  <th>Broker</th>
                  <th>Company</th>
                  <th>Linked User</th>
                  <th>Candidates</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Approval</th>
                  <th>Active</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {brokers.map((broker) => (
                  <tr key={broker.brokerId}>
                    <td><strong>{broker.brokerName}</strong></td>
                    <td>{broker.companyName}</td>
                    <td>
                      <strong>{broker.userFullName}</strong>
                      <small>{broker.profileCode}</small>
                    </td>
                    <td><button type="button" className="brokers-candidate-count" onClick={() => openBrokerCandidates(broker)}>{broker.candidateCount ?? 0} <Users size={14} /> View</button></td>
                    <td>{broker.contactNumber || broker.userMobileNumber || "-"}</td>
                    <td>{broker.email || broker.userEmail || "-"}</td>
                    <td>
                      <div className="broker-approval-control">
                        <button
                          type="button"
                          className="broker-approval-toggle"
                          role="switch"
                          aria-checked={Boolean(broker.isApproved)}
                          aria-label={`${broker.isApproved ? "Revoke approval for" : "Approve"} ${broker.brokerName}`}
                          title={broker.isApproved ? "Click to revoke approval" : "Click to approve broker"}
                          onClick={() => handleApprovalChange(broker)}
                          disabled={!broker.isActive || approvalBrokerId === broker.brokerId}
                        />
                        <span className={`broker-status ${broker.isApproved ? "is-good" : "is-pending"}`}>
                          {broker.isApproved ? "Approved" : "Pending"}
                        </span>
                      </div>
                    </td>
                    <td>{broker.createdAt ? new Date(broker.createdAt).toLocaleDateString() : "-"}</td>
                    <td>
                      <div className="brokers-row-actions">
                        <button
                          type="button"
                          className="brokers-icon-action"
                          onClick={() => openEditBroker(broker)}
                          aria-label={`Edit ${broker.brokerName}`}
                          title="Edit Broker"
                        >
                          <Pencil size={15} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="brokers-icon-action is-delete"
                          onClick={() => handleDeleteBroker(broker)}
                          disabled={!broker.isActive || actionBrokerId === broker.brokerId}
                          aria-label={`Deactivate ${broker.brokerName}`}
                          title={broker.isActive ? "Delete Broker" : "Broker is inactive"}
                        >
                          <Trash2 size={15} aria-hidden="true" />
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

      {candidateBroker && (
        <div className="brokers-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCandidateBroker(null); }}>
          <section className="brokers-modal brokers-candidates-modal" role="dialog" aria-modal="true" aria-labelledby="broker-candidates-title">
            <header className="brokers-modal-header">
              <div><h2 id="broker-candidates-title">{candidateBroker.brokerName} Candidates</h2><p>{candidateBroker.companyName || "Broker registered candidates"}</p></div>
              <button type="button" className="brokers-close-button" aria-label="Close" onClick={() => setCandidateBroker(null)}>×</button>
            </header>
            {candidateLoading ? <div className="brokers-state">Loading candidates...</div> : brokerCandidates.length === 0 ? <div className="brokers-state">No candidates registered by this broker.</div> : (
              <div className="brokers-candidates-table-wrap"><table className="brokers-table"><thead><tr><th>Profile Code</th><th>Name</th><th>Gender</th><th>Mobile</th><th>Status</th><th>Created</th></tr></thead><tbody>
                {brokerCandidates.map((candidate) => <tr key={candidate.userId}><td>{candidate.profileCode}</td><td>{candidate.fullName}</td><td>{candidate.genderName || "-"}</td><td>{candidate.mobileNumber || "-"}</td><td>{candidate.statusName || "-"}</td><td>{candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : "-"}</td></tr>)}
              </tbody></table></div>
            )}
          </section>
        </div>
      )}

      {registerOpen && (
        <div className="brokers-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeRegistration();
        }}>
          <section className="brokers-modal" role="dialog" aria-modal="true" aria-labelledby="register-broker-title">
            <header className="brokers-modal-header">
              <div>
                <h2 id="register-broker-title">Register Broker</h2>
                <p>Create the login account and Broker profile together.</p>
              </div>
              <button type="button" className="brokers-close-button" aria-label="Close" onClick={closeRegistration} disabled={saving}>×</button>
            </header>

            <form onSubmit={handleRegister}>
              <div className="brokers-form-grid">
                <label className="brokers-field">
                  <span>Full Name <b>*</b></span>
                  <input name="fullName" value={form.fullName} onChange={updateForm} maxLength={150} autoComplete="name" required />
                </label>
                <label className="brokers-field">
                  <span>Gender <b>*</b></span>
                  <select name="genderId" value={form.genderId} onChange={updateForm} required>
                    <option value="">Select gender</option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                    <option value="3">Other</option>
                  </select>
                </label>
                <label className="brokers-field">
                  <span>Mobile Number <b>*</b></span>
                  <input name="mobileNumber" type="tel" value={form.mobileNumber} onChange={updateForm} maxLength={15} pattern="[0-9+() -]{7,15}" autoComplete="tel" required />
                </label>
                <label className="brokers-field">
                  <span>Email <b>*</b></span>
                  <input name="accountEmail" type="email" value={form.accountEmail} onChange={updateForm} maxLength={150} autoComplete="email" required />
                </label>
                <label className="brokers-field">
                  <span>Initial Password <b>*</b></span>
                  <input name="password" type="password" value={form.password} onChange={updateForm} minLength={8} maxLength={100} autoComplete="new-password" required />
                </label>
                <label className="brokers-field">
                  <span>Broker Name <b>*</b></span>
                  <input name="brokerName" value={form.brokerName} onChange={updateForm} maxLength={150} required />
                </label>
                <label className="brokers-field">
                  <span>Company Name <b>*</b></span>
                  <input name="companyName" value={form.companyName} onChange={updateForm} maxLength={150} required />
                </label>
              </div>

              {formError && <div className="brokers-notice brokers-notice-error" role="alert">{formError}</div>}

              <footer className="brokers-form-actions">
                <button type="button" className="brokers-secondary-button" onClick={closeRegistration} disabled={saving}>Cancel</button>
                <button type="submit" className="brokers-primary-button" disabled={saving}>
                  {saving ? "Registering..." : "Register Broker"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {editingBroker && (
        <div className="brokers-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeEditBroker();
        }}>
          <section className="brokers-modal" role="dialog" aria-modal="true" aria-labelledby="edit-broker-title">
            <header className="brokers-modal-header">
              <div>
                <h2 id="edit-broker-title">Edit Broker</h2>
                <p>Update the broker listing details.</p>
              </div>
              <button type="button" className="brokers-close-button" aria-label="Close" onClick={closeEditBroker} disabled={editSaving}>×</button>
            </header>

            <form onSubmit={handleEditBroker}>
              <div className="brokers-form-grid">
                <label className="brokers-field">
                  <span>Broker Name <b>*</b></span>
                  <input name="brokerName" value={editForm.brokerName} onChange={updateEditForm} maxLength={150} required />
                </label>
                <label className="brokers-field">
                  <span>Company Name <b>*</b></span>
                  <input name="companyName" value={editForm.companyName} onChange={updateEditForm} maxLength={150} required />
                </label>
                <label className="brokers-field">
                  <span>Contact Number <b>*</b></span>
                  <input name="contactNumber" type="tel" value={editForm.contactNumber} onChange={updateEditForm} maxLength={15} pattern="[0-9+() -]{7,15}" required />
                </label>
                <label className="brokers-field">
                  <span>Email <b>*</b></span>
                  <input name="email" type="email" value={editForm.email} onChange={updateEditForm} maxLength={150} required />
                </label>
              </div>

              {formError && <div className="brokers-notice brokers-notice-error" role="alert">{formError}</div>}

              <footer className="brokers-form-actions">
                <button type="button" className="brokers-secondary-button" onClick={closeEditBroker} disabled={editSaving}>Cancel</button>
                <button type="submit" className="brokers-primary-button" disabled={editSaving}>
                  {editSaving ? "Saving..." : "Save Changes"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminBrokers;
