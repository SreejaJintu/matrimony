import { NavLink } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminSidebar = () => {
  const { logout } = useAdminAuth();

  return (
    <aside className="admin-sidebar">

      <div className="admin-brand">
        <img className="admin-brand-image" src="/maroon_favicon.svg" alt="Viswaas" />
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

        <NavLink to="/admin/brokers">
          <span>♧</span>
          Broker Management
        </NavLink>

        <NavLink to="/admin/subscriptions">
          <span>◆</span>
          Memberships
        </NavLink>
       <NavLink to="/admin/plans">
          <span>◆</span>
          Add Plans 
        </NavLink>
        <NavLink to="/admin/locations">
         <span>⌖</span>
           Locations
        </NavLink>

        <NavLink to="/admin/leads">
          <span>☏</span>
          Leads
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