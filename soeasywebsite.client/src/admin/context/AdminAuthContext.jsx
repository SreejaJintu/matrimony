import { createContext, useContext, useEffect, useState } from "react";
import adminAuthService from "../services/adminAuthService";

const AdminAuthContext = createContext(null);

const getTokenExpiry = (token) => {
  try {
    const payload = token.split(".")[1];
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(normalizedPayload)).exp ?? 0;
  } catch {
    return 0;
  }
};

const isValidAdminToken = (token) =>
  Boolean(token) && getTokenExpiry(token) * 1000 > Date.now();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const token = localStorage.getItem("soesyAdminToken");
    if (!isValidAdminToken(token)) {
      localStorage.removeItem("soesyAdmin");
      localStorage.removeItem("soesyAdminToken");
      return null;
    }

    const savedAdmin = localStorage.getItem("soesyAdmin");
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  const login = async (userName, password) => {
    const result = await adminAuthService.login(userName, password);

    if (!result.success) {
      throw new Error(result.message || "Admin login failed.");
    }

    const adminData = result.data;

    localStorage.setItem(
      "soesyAdmin",
      JSON.stringify(adminData)
    );

    localStorage.setItem(
      "soesyAdminToken",
      adminData.token
    );

    setAdmin(adminData);

    return adminData;
  };

  const logout = () => {
    localStorage.removeItem("soesyAdmin");
    localStorage.removeItem("soesyAdminToken");
    setAdmin(null);
  };

  const token = localStorage.getItem("soesyAdminToken");
  const isAuthenticated = isValidAdminToken(token);

  useEffect(() => {
    const handleExpiredSession = () => {
      localStorage.removeItem("soesyAdmin");
      localStorage.removeItem("soesyAdminToken");
      setAdmin(null);
    };

    window.addEventListener("admin-auth-expired", handleExpiredSession);
    return () => window.removeEventListener("admin-auth-expired", handleExpiredSession);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      if (token) logout();
      return undefined;
    }

    const expiryDelay = getTokenExpiry(token) * 1000 - Date.now();
    const timeoutId = window.setTimeout(logout, expiryDelay);
    return () => window.clearTimeout(timeoutId);
  }, [token, isAuthenticated]);

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  return useContext(AdminAuthContext);
};
