import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight, CreditCard, Package, UsersRound } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminSidebar = ({ collapsed, onToggle }) => {
  const { logout } = useAdminAuth();

  return (
    <aside className="admin-sidebar" aria-label="Admin sidebar">

      <div className="admin-brand">
        <img className="admin-brand-image" src="/maroon_favicon.svg" alt="Viswaas" />
        <button
          type="button"
          className="admin-sidebar-toggle"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={19} /> : <ChevronLeft size={19} />}
        </button>
      </div>

      <nav className="admin-nav">

        <NavLink to="/admin/dashboard" aria-label="Dashboard" title="Dashboard">
          <span className="admin-nav-icon" aria-hidden="true">⌂</span>
          <span className="admin-nav-label">Dashboard</span>
        </NavLink>

        <NavLink to="/admin/profiles" aria-label="Profiles" title="Profiles">
          <span className="admin-nav-icon" aria-hidden="true">♙</span>
          <span className="admin-nav-label">Profiles</span>
        </NavLink>

        <NavLink to="/admin/brokers" aria-label="Broker Management" title="Broker Management">
          <span className="admin-nav-icon" aria-hidden="true">♧</span>
          <span className="admin-nav-label">Broker Management</span>
        </NavLink>

        <NavLink to="/admin/executives" aria-label="Executives" title="Executives">
          <UsersRound className="admin-nav-icon" size={20} aria-hidden="true" />
          <span className="admin-nav-label">Executives</span>
        </NavLink>

        <NavLink to="/admin/subscriptions" aria-label="Memberships" title="Memberships">
          <CreditCard className="admin-nav-icon" size={17} aria-hidden="true" />
          <span className="admin-nav-label">Memberships</span>
        </NavLink>
       <NavLink to="/admin/plans" aria-label="Add Plans" title="Add Plans">
          <Package className="admin-nav-icon" size={17} aria-hidden="true" />
          <span className="admin-nav-label">Add Plans</span>
        </NavLink>
        <NavLink to="/admin/locations" aria-label="Locations" title="Locations">
         <span className="admin-nav-icon" aria-hidden="true">⌖</span>
         <span className="admin-nav-label">Locations</span>
        </NavLink>

        <NavLink to="/admin/leads" aria-label="Leads" title="Leads">
          <span className="admin-nav-icon" aria-hidden="true">☏</span>
          <span className="admin-nav-label">Leads</span>
        </NavLink>

       
        <NavLink to="/admin/settings" aria-label="Settings" title="Settings">
          <span className="admin-nav-icon" aria-hidden="true">⚙</span>
          <span className="admin-nav-label">Settings</span>
        </NavLink>

      </nav>

      <div className="admin-sidebar-bottom">

        <button
          type="button"
          onClick={logout}
          className="admin-logout"
          aria-label="Logout"
          title="Logout"
        >
          <span className="admin-nav-icon" aria-hidden="true">↪</span>
          <span className="admin-nav-label">Logout</span>
        </button>

      </div>

    </aside>
  );
};

export default AdminSidebar;