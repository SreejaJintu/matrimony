import { Link, useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <header className="admin-header">

      <div>
        <h1>Dashboard</h1>
      </div>

      <div className="admin-header-user">

        <Link
          to="/"
          className="admin-header-website"
          aria-label="Visit website"
          title="Visit Website"
        >
          <ExternalLink size={15} aria-hidden="true" />
          <span>Visit Website</span>
        </Link>

        <div className="admin-user-avatar">
          {admin?.fullName?.charAt(0)?.toUpperCase() || "A"}
        </div>

        <div className="admin-user-info">
          <strong>{admin?.isSuperAdmin ? "Super Admin" : admin?.fullName || "Admin"}</strong>
          {!admin?.isSuperAdmin && <span>Admin</span>}
        </div>

        <button
          type="button"
          className="admin-header-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </header>
  );
};

export default AdminHeader;
