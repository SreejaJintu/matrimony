import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import adminDashboardService from "../services/adminDashboardService";
import "../styles/adminDashboard.css";

const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hr${diffInHours > 1 ? "s" : ""} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProfiles: 0,
    maleProfiles: 0,
    femaleProfiles: 0,
    activeMembers: 0,
    pendingPayments: 0,
    pendingReports: 0,
    totalLeads: 0,
    recentActivities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await adminDashboardService.getDashboardStats();
      if (result.success && result.data) {
        setStats(result.data);
      } else {
        setError(result.message || "Failed to load dashboard statistics.");
      }
    } catch (err) {
      console.error("ADMIN DASHBOARD ERROR:", err);
      setError(err.response?.data?.message || "Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardStats();
  }, []);

  return (
    <div className="admin-dashboard">

      <div className="dashboard-welcome">
        <h2>Welcome back 👋</h2>
        <p>
          Here's what's happening with your matrimony bureau today.
        </p>
      </div>

      {loading ? (
        <div className="profile-loading" style={{ padding: "40px", textAlign: "center", color: "#666" }}>
          Loading dashboard statistics...
        </div>
      ) : error ? (
        <div className="profile-error" style={{ padding: "16px", background: "#fee", color: "#c00", borderRadius: "8px", marginBottom: "20px" }}>
          {error}
        </div>
      ) : (
        <>
          <div className="dashboard-stats">
            <StatCard
              title="Total Profiles"
              value={stats.totalProfiles.toLocaleString()}
              subtitle="Registered profiles"
              icon="👥"
            />

            <StatCard
              title="Male Profiles"
              value={stats.maleProfiles.toLocaleString()}
              subtitle="Registered grooms"
              icon="♂"
            />

            <StatCard
              title="Female Profiles"
              value={stats.femaleProfiles.toLocaleString()}
              subtitle="Registered brides"
              icon="♀"
            />

            <StatCard
              title="Active Members"
              value={stats.activeMembers.toLocaleString()}
              subtitle="Paid / Active memberships"
              icon="◆"
            />

            <StatCard
              title="Pending Payments"
              value={stats.pendingPayments.toLocaleString()}
              subtitle="Need verification"
              icon="₹"
            />

            <StatCard
              title="Pending Reports"
              value={stats.pendingReports.toLocaleString()}
              subtitle="Need review"
              icon="!"
            />
          </div>

          <div className="dashboard-grid">
            <section className="dashboard-panel">
              <div className="panel-header">
                <h3>Recent Activity</h3>
                <button type="button" onClick={() => navigate("/admin/profiles")}>
                  View All
                </button>
              </div>

              <div className="activity-list">
                {stats.recentActivities && stats.recentActivities.length > 0 ? (
                  stats.recentActivities.map((act) => (
                    <div key={act.id} className="activity-item">
                      <div className="activity-icon">
                        {act.icon || "+"}
                      </div>

                      <div>
                        <strong>{act.title}</strong>
                        <span>{act.description}</span>
                      </div>

                      <small>{formatRelativeTime(act.timestamp)}</small>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#888", padding: "12px 0" }}>No recent activity found.</p>
                )}
              </div>
            </section>

            <section className="dashboard-panel">
              <div className="panel-header">
                <h3>Quick Actions</h3>
              </div>

              <div className="quick-actions">
                <button type="button" onClick={() => navigate("/admin/subscriptions")}>
                  Review Payments
                </button>

                <button type="button" onClick={() => navigate("/admin/profiles")}>
                  Manage Profiles
                </button>

                <button type="button" onClick={() => navigate("/admin/leads")}>
                  View Leads
                </button>

                <button type="button" onClick={() => navigate("/admin/plans")}>
                  Manage Plans
                </button>
              </div>
            </section>
          </div>
        </>
      )}

    </div>
  );
};

export default AdminDashboard;