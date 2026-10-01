import { useEffect, useState } from "react";
import { ArrowLeft, Pencil, Power, Save, X } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import adminExecutiveService from "../services/adminExecutiveService";
import "../styles/adminBrokers.css";
import "../styles/adminExecutives.css";

const createEmptyForm = () => ({
  fullName: "",
  userName: "",
  email: "",
  mobileNumber: "",
  password: "",
  confirmPassword: "",
  isActive: true,
});

const responseMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.Message || error?.message || fallback;

const responseData = (response) => response?.data ?? response?.Data;

const InfoItem = ({ label, value }) => (
  <div className="executive-detail-item">
    <span>{label}</span>
    <strong>{value || "-"}</strong>
  </div>
);

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
};

const AdminExecutiveFormPage = () => {
  const { executiveId } = useParams();
  const isCreate = !executiveId;
  const navigate = useNavigate();
  const location = useLocation();
  const [executive, setExecutive] = useState(null);
  const [form, setForm] = useState(createEmptyForm);
  const [loading, setLoading] = useState(!isCreate);
  const [saving, setSaving] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(isCreate || Boolean(location.state?.edit));
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isCreate) return undefined;

    let isCurrent = true;
    const loadExecutive = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await adminExecutiveService.getExecutiveById(executiveId);
        if (result?.success === false || result?.Success === false) {
          throw new Error(result.message || result.Message || "Unable to load Executive.");
        }
        const data = responseData(result);
        if (!data) throw new Error("Executive not found.");
        if (isCurrent) {
          setExecutive(data);
          setForm({
            ...createEmptyForm(),
            fullName: data.fullName ?? data.FullName ?? "",
            userName: data.userName ?? data.UserName ?? "",
            email: data.email ?? data.Email ?? "",
            mobileNumber: data.mobileNumber ?? data.MobileNumber ?? "",
            isActive: data.isActive ?? data.IsActive ?? false,
          });
        }
      } catch (loadError) {
        if (isCurrent) setError(responseMessage(loadError, "Unable to load Executive."));
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    loadExecutive();
    return () => { isCurrent = false; };
  }, [executiveId, isCreate]);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (isCreate && form.password !== form.confirmPassword) {
      setError("Password and Confirm Password must match.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        userName: form.userName.trim(),
        email: form.email.trim() || null,
        mobileNumber: form.mobileNumber.trim() || null,
      };
      const result = isCreate
        ? await adminExecutiveService.createExecutive({
          ...payload,
          password: form.password,
          confirmPassword: form.confirmPassword,
          isActive: form.isActive,
        })
        : await adminExecutiveService.updateExecutive(executiveId, payload);

      if (result?.success === false || result?.Success === false) {
        throw new Error(result.message || result.Message || `Unable to ${isCreate ? "create" : "update"} Executive.`);
      }

      if (isCreate) {
        const createdExecutive = responseData(result);
        const createdId = createdExecutive?.executiveId ?? createdExecutive?.ExecutiveId;
        if (createdId) {
          navigate(`/admin/executives/${createdId}`, { replace: true });
        } else {
          navigate("/admin/executives", { replace: true, state: { message: result.message || result.Message || "Executive created successfully." } });
        }
        return;
      }

      setExecutive((current) => ({ ...current, ...payload }));
      setIsEditing(false);
      setMessage(result.message || result.Message || "Executive updated successfully.");
    } catch (saveError) {
      setError(responseMessage(saveError, `Unable to ${isCreate ? "create" : "update"} Executive.`));
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async () => {
    if (!executive) return;
    const nextStatus = !(executive.isActive ?? executive.IsActive);
    const action = nextStatus ? "activate" : "deactivate";
    if (!window.confirm(`Are you sure you want to ${action} ${executive.fullName ?? executive.FullName}?`)) return;

    setStatusSaving(true);
    setError("");
    setMessage("");
    try {
      const result = await adminExecutiveService.updateExecutiveStatus(executiveId, nextStatus);
      if (result?.success === false || result?.Success === false) {
        throw new Error(result.message || result.Message || `Unable to ${action} Executive.`);
      }
      setExecutive((current) => ({ ...current, isActive: nextStatus }));
      setForm((current) => ({ ...current, isActive: nextStatus }));
      setMessage(`Executive ${nextStatus ? "activated" : "deactivated"} successfully.`);
    } catch (statusError) {
      setError(responseMessage(statusError, `Unable to ${action} Executive.`));
    } finally {
      setStatusSaving(false);
    }
  };

  if (loading) {
    return <div className="brokers-state" role="status">Loading Executive...</div>;
  }

  if (!isCreate && !executive && error) {
    return (
      <div className="admin-executive-form-page">
        <div className="brokers-notice brokers-notice-error" role="alert">{error}</div>
        <button type="button" className="brokers-secondary-button" onClick={() => navigate("/admin/executives")}>
          <ArrowLeft size={16} aria-hidden="true" /> Back to Executives
        </button>
      </div>
    );
  }

  const fullName = executive?.fullName ?? executive?.FullName;
  const userName = executive?.userName ?? executive?.UserName;
  const email = executive?.email ?? executive?.Email;
  const mobileNumber = executive?.mobileNumber ?? executive?.MobileNumber;
  const isActive = executive?.isActive ?? executive?.IsActive;

  return (
    <div className="admin-executive-form-page">
      <header className="admin-brokers-header">
        <div>
          <h1>{isCreate ? "Add Executive" : "Executive Details"}</h1>
          <p>{isCreate ? "Create an Executive account." : "View and manage Executive account details."}</p>
        </div>
        <button type="button" className="brokers-secondary-button" onClick={() => navigate("/admin/executives")}>
          <ArrowLeft size={16} aria-hidden="true" /> Back to Executives
        </button>
      </header>

      {message && <div className="brokers-notice brokers-notice-success" role="status">{message}</div>}
      {error && <div className="brokers-notice brokers-notice-error" role="alert">{error}</div>}

      {isCreate || isEditing ? (
        <section className="executive-form-panel">
          <form onSubmit={handleSubmit}>
            <div className="brokers-form-grid">
              <label className="brokers-field">
                <span>Full Name <b>*</b></span>
                <input name="fullName" value={form.fullName} onChange={handleChange} maxLength={200} autoComplete="name" required />
              </label>
              <label className="brokers-field">
                <span>Username <b>*</b></span>
                <input name="userName" value={form.userName} onChange={handleChange} maxLength={100} autoComplete="username" required />
              </label>
              <label className="brokers-field">
                <span>Email</span>
                <input name="email" type="email" value={form.email} onChange={handleChange} maxLength={200} autoComplete="email" />
              </label>
              <label className="brokers-field">
                <span>Mobile Number</span>
                <input name="mobileNumber" type="tel" value={form.mobileNumber} onChange={handleChange} maxLength={20} pattern="[0-9+() -]{7,20}" autoComplete="tel" />
              </label>
              {isCreate && (
                <>
                  <label className="brokers-field">
                    <span>Password <b>*</b></span>
                    <input name="password" type="password" value={form.password} onChange={handleChange} minLength={8} maxLength={100} autoComplete="new-password" required />
                  </label>
                  <label className="brokers-field">
                    <span>Confirm Password <b>*</b></span>
                    <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} minLength={8} maxLength={100} autoComplete="new-password" required />
                  </label>
                  <label className="executive-active-field">
                    <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                    Active
                  </label>
                </>
              )}
            </div>

            <footer className="brokers-form-actions">
              {!isCreate && (
                <button type="button" className="brokers-secondary-button" onClick={() => setIsEditing(false)} disabled={saving}>
                  <X size={15} aria-hidden="true" /> Cancel
                </button>
              )}
              <button type="submit" className="brokers-primary-button" disabled={saving}>
                <Save size={15} aria-hidden="true" />
                {saving ? "Saving..." : isCreate ? "Create Executive" : "Save Changes"}
              </button>
            </footer>
          </form>
        </section>
      ) : executive && (
        <section className="executive-form-panel">
          <div className="executive-details-heading">
            <div>
              <h2>{fullName}</h2>
              <p>@{userName}</p>
            </div>
            <span className={`broker-status ${isActive ? "is-good" : "is-off"}`}>
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="executive-details-grid">
            <InfoItem label="Full Name" value={fullName} />
            <InfoItem label="Username" value={userName} />
            <InfoItem label="Email" value={email} />
            <InfoItem label="Mobile Number" value={mobileNumber} />
            <InfoItem label="Created Date" value={formatDate(executive.createdAt ?? executive.CreatedAt)} />
            <InfoItem label="Last Login" value={formatDate(executive.lastLogin ?? executive.LastLogin)} />
          </div>

          <footer className="brokers-form-actions executive-details-actions">
            <button type="button" className="brokers-secondary-button" onClick={handleStatusChange} disabled={statusSaving}>
              <Power size={15} aria-hidden="true" />
              {statusSaving ? "Updating..." : isActive ? "Deactivate" : "Activate"}
            </button>
            <button type="button" className="brokers-primary-button" onClick={() => setIsEditing(true)}>
              <Pencil size={15} aria-hidden="true" /> Edit Executive
            </button>
          </footer>
        </section>
      )}
    </div>
  );
};

export default AdminExecutiveFormPage;