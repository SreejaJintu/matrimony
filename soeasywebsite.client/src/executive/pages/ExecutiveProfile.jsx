import { useExecutiveAuth } from "../context/ExecutiveAuthContext";

export default function ExecutiveProfile() {
  const { executive } = useExecutiveAuth();
  return (
    <div className="admin-page-container">
      <div className="admin-page-header"><div><h1>My Profile</h1><p>Your Executive account details.</p></div></div>
      <div className="admin-table-wrapper">
        <table className="admin-table"><tbody>
          <tr><th>Full Name</th><td>{executive?.fullName || "—"}</td></tr>
          <tr><th>Username</th><td>{executive?.userName || "—"}</td></tr>
          <tr><th>Email</th><td>{executive?.email || "—"}</td></tr>
          <tr><th>Mobile</th><td>{executive?.mobileNumber || "—"}</td></tr>
          <tr><th>Status</th><td>{executive?.isActive ? "Active" : "Inactive"}</td></tr>
        </tbody></table>
      </div>
    </div>
  );
}
