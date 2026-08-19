import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import "../styles/adminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(
        formData.userName,
        formData.password
      );

      navigate("/admin/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.message ||
        "Invalid admin username or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-login-header">
          <h1>Soesy</h1>
          <h2>Admin Panel</h2>
          <p>Sign in to manage your matrimony bureau</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="admin-form-group">
            <label>Username</label>

            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AdminLogin;