import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, UsersRound, UserRound, LogOut, ExternalLink } from "lucide-react";
import { useExecutiveAuth } from "../context/ExecutiveAuthContext";
import "../../admin/styles/adminLayout.css";

export default function ExecutiveLayout() {
  const { executive, logout } = useExecutiveAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/executive/login", { replace: true });
  };

  return (
    <div className="admin-layout executive-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img className="admin-brand-image" src="/maroon_favicon.svg" alt="Viswaas" />
        </div>
        <nav className="admin-nav" aria-label="Executive navigation">
          <NavLink to="/executive/dashboard"><LayoutDashboard size={17} />Dashboard</NavLink>
          <NavLink to="/executive/leads"><UsersRound size={17} />Leads</NavLink>
          <NavLink to="/executive/profile"><UserRound size={17} />My Profile</NavLink>
        </nav>
        <div className="admin-sidebar-bottom">
          <button type="button" onClick={handleLogout} className="admin-logout"><LogOut size={17} />Logout</button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div><h1>Executive Portal</h1></div>
          <div className="admin-header-user">
            <a href="/" className="admin-header-website"><ExternalLink size={15} /><span>Visit Website</span></a>
            <div className="admin-user-avatar">{executive?.fullName?.charAt(0)?.toUpperCase() || "E"}</div>
            <div className="admin-user-info"><strong>{executive?.fullName || "Executive"}</strong><span>Executive</span></div>
            <button type="button" className="admin-header-logout" onClick={handleLogout}>Logout</button>
          </div>
        </header>
        <main className="admin-content"><Outlet /></main>
      </div>
    </div>
  );
}
