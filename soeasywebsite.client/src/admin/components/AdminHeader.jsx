import { useAdminAuth } from "../context/AdminAuthContext";

const AdminHeader = () => {
  const { admin } = useAdminAuth();

  return (
    <header className="admin-header">

      <div>
        <h1>Dashboard</h1>
      </div>

      <div className="admin-header-user">

        <div className="admin-user-avatar">
          {admin?.fullName?.charAt(0)?.toUpperCase() || "A"}
        </div>

        <div className="admin-user-info">
          <strong>{admin?.fullName || "Admin"}</strong>
          <span>
            {admin?.isSuperAdmin ? "Super Admin" : "Admin"}
          </span>
        </div>

      </div>

    </header>
  );
};

export default AdminHeader;