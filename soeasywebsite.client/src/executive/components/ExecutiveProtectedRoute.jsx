import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useExecutiveAuth } from "../context/ExecutiveAuthContext";

export default function ExecutiveProtectedRoute() {
  const { isAuthenticated } = useExecutiveAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/executive/login" replace state={{ from: location }} />;
  return <Outlet />;
}
