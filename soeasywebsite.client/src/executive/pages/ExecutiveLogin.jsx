import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useExecutiveAuth } from "../context/ExecutiveAuthContext";
import "../../admin/styles/adminLogin.css";

export default function ExecutiveLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useExecutiveAuth();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  if (isAuthenticated) return <Navigate to="/executive/dashboard" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(userName, password);
      navigate("/executive/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid Executive username or password.");
    } finally {
      setLoading(false);
    }
  };

  return <div className="admin-login-page"><div className="admin-login-card">
    <div className="admin-login-header"><img className="admin-login-logo" src="/maroon_favicon.svg" alt="Viswaas" /><h2>Executive Portal</h2><p>Sign in with your Executive account</p></div>
    <form onSubmit={handleSubmit}>
      <div className="admin-form-group"><label htmlFor="executive-username">Username</label><input id="executive-username" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Enter username" autoComplete="username" required /></div>
      <div className="admin-form-group"><label htmlFor="executive-password">Password</label><input id="executive-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" autoComplete="current-password" required /></div>
      {error && <div className="admin-login-error" role="alert">{error}</div>}
      <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
    </form>
  </div></div>;
}
