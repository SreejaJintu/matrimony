import { useExecutiveAuth } from "../context/ExecutiveAuthContext";
import { useNavigate } from "react-router-dom";

export default function ExecutiveDashboard() {
  const { executive } = useExecutiveAuth();
  const navigate = useNavigate();
  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div><h1>Dashboard</h1><p>Welcome, {executive?.fullName || "Executive"}</p></div>
      </div>
      <div className="admin-stat-card" role="button" tabIndex={0} onClick={() => navigate("/executive/leads")} onKeyDown={(event) => event.key === "Enter" && navigate("/executive/leads")}>
        <h2>Leads</h2><p>View and update client conversations.</p>
        <button type="button" onClick={() => navigate("/executive/leads")}>View Leads</button>
      </div>
    </div>
  );
}
