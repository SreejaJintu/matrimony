import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import "../styles/adminLayout.css";

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className={`admin-layout${sidebarCollapsed ? " is-sidebar-collapsed" : ""}${mobileNavOpen ? " is-mobile-nav-open" : ""}`}>
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
        mobileNavOpen={mobileNavOpen}
        onMobileNavToggle={() => setMobileNavOpen((open) => !open)}
        onMobileNavClose={() => setMobileNavOpen(false)}
      />

      <div className="admin-main">
        <AdminHeader />

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
