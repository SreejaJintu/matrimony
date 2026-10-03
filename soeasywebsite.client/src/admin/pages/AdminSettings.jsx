import { useEffect, useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";
import adminAuthService from "../services/adminAuthService";
import "../styles/adminSettings.css";

const AdminSettings = () => {
  const { admin, updateAdmin } = useAdminAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [userName, setUserName] = useState(admin?.userName || "");
  const [email, setEmail] = useState(admin?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [admins, setAdmins] = useState([]);
  const [targetAdminId, setTargetAdminId] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [confirmResetPassword, setConfirmResetPassword] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  useEffect(() => {
    if (!admin?.isSuperAdmin) return;
    adminAuthService.getAdmins()
      .then((result) => setAdmins(result?.data || []))
      .catch((requestError) => setResetError(requestError.response?.data?.message || "Unable to load Admin accounts."));
  }, [admin?.isSuperAdmin]);

  const handleCredentialUpdate = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!currentPassword) return setError("Enter your current password to confirm these changes.");
    if (!userName.trim()) return setError("Username is required.");
    if (newPassword && newPassword.length < 8) return setError("New password must be at least 8 characters.");
    if (newPassword !== confirmPassword) return setError("New password and confirmation do not match.");

    setSaving(true);
    try {
      const result = await adminAuthService.updateCredentials({
        currentPassword,
        userName: userName.trim(),
        email: email.trim() || null,
        newPassword: newPassword || null,
      });
      updateAdmin({ userName: userName.trim(), email: email.trim() || null });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage(result?.message || "Admin credentials updated.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update credentials.");
    } finally {
      setSaving(false);
    }
  };

  const handleAdminReset = async (event) => {
    event.preventDefault();
    setResetError("");
    setResetMessage("");
    if (!targetAdminId) return setResetError("Select an Admin account.");
    if (Number(targetAdminId) === admin?.adminId) return setResetError("Choose another Admin. Use the form above to change your own password.");
    if (resetPassword.length < 8) return setResetError("Temporary password must be at least 8 characters.");
    if (resetPassword !== confirmResetPassword) return setResetError("Passwords do not match.");

    setResetting(true);
    try {
      const result = await adminAuthService.resetAdminPassword(targetAdminId, resetPassword);
      setResetPassword("");
      setConfirmResetPassword("");
      setResetMessage(result?.message || "Admin password reset successfully.");
    } catch (requestError) {
      setResetError(requestError.response?.data?.message || "Unable to reset that Admin password.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <section className="admin-settings-page">
      <header className="admin-settings-heading">
        <h2>Admin Settings</h2>
        <p>Manage your Admin sign-in credentials and password recovery.</p>
      </header>

      <section className="admin-settings-card">
        <div className="admin-settings-card-heading">
          <KeyRound size={20} aria-hidden="true" />
          <div><h3>Your credentials</h3><p>Confirm your current password before changing your username, email, or password.</p></div>
        </div>
        <form className="admin-settings-form" onSubmit={handleCredentialUpdate}>
          <label>Current password<input type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required /></label>
          <label>Username<input value={userName} onChange={(event) => setUserName(event.target.value)} maxLength={100} required /></label>
          <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={200} /></label>
          <label>New password <small>(leave blank to keep current)</small><input type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={8} /></label>
          <label>Confirm new password<input type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label>
          {error && <p className="admin-settings-error" role="alert">{error}</p>}
          {message && <p className="admin-settings-success" role="status">{message}</p>}
          <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save credentials"}</button>
        </form>
      </section>

      {admin?.isSuperAdmin && (
        <section className="admin-settings-card">
          <div className="admin-settings-card-heading">
            <ShieldCheck size={20} aria-hidden="true" />
            <div><h3>Forgotten Admin password</h3><p>As Super Admin, set a temporary password for another active Admin. No OTP is used.</p></div>
          </div>
          <form className="admin-settings-form" onSubmit={handleAdminReset}>
            <label>Admin account<select value={targetAdminId} onChange={(event) => setTargetAdminId(event.target.value)} required>
              <option value="">Choose an Admin</option>
              {admins.filter((item) => item.adminId !== admin?.adminId).map((item) => (
                <option key={item.adminId} value={item.adminId}>{item.fullName} ({item.userName})</option>
              ))}
            </select></label>
            <label>Temporary password<input type="password" autoComplete="new-password" value={resetPassword} onChange={(event) => setResetPassword(event.target.value)} minLength={8} required /></label>
            <label>Confirm temporary password<input type="password" autoComplete="new-password" value={confirmResetPassword} onChange={(event) => setConfirmResetPassword(event.target.value)} required /></label>
            {resetError && <p className="admin-settings-error" role="alert">{resetError}</p>}
            {resetMessage && <p className="admin-settings-success" role="status">{resetMessage}</p>}
            {admins.filter((item) => item.adminId !== admin?.adminId).length === 0 && <p className="admin-settings-note">A different active Super Admin must reset your password if you forget it.</p>}
            <button type="submit" disabled={resetting || admins.filter((item) => item.adminId !== admin?.adminId).length === 0}>{resetting ? "Resetting..." : "Reset Admin password"}</button>
          </form>
        </section>
      )}
    </section>
  );
};

export default AdminSettings;
