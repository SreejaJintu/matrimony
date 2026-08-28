import { NavLink } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminSidebar = () => {
  const { logout } = useAdminAuth();

  return (
    <aside className="admin-sidebar">

      <div className="admin-brand">
        <div className="admin-logo">S</div>

        <div>
          <h2>Soesy</h2>
          <span>Admin Panel</span>
        </div>
      </div>

      <nav className="admin-nav">

        <NavLink to="/admin/dashboard">
          <span>⌂</span>
          Dashboard
        </NavLink>

        <NavLink to="/admin/profiles">
          <span>♙</span>
          Profiles
        </NavLink>

        <NavLink to="/admin/subscriptions">
          <span>◆</span>
          Memberships
        </NavLink>
       <NavLink to="/admin/plans">
          <span>◆</span>
          Add Plans 
        </NavLink>
        <NavLink to="/admin/reports">
          <span>!</span>
          Reports
        </NavLink>

        <NavLink to="/admin/leads">
          <span>☏</span>
          Leads
        </NavLink>

        <NavLink to="/admin/executives">
          <span>♟</span>
          Executives
        </NavLink>

        <NavLink to="/admin/settings">
          <span>⚙</span>
          Settings
        </NavLink>

      </nav>

      <div className="admin-sidebar-bottom">

        <button
          type="button"
          onClick={logout}
          className="admin-logout"
        >
          <span>↪</span>
          Logout
        </button>

      </div>

    </aside>
  );
};

export default AdminSidebar;