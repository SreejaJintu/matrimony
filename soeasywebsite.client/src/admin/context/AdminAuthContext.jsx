import { createContext, useContext, useState } from "react";
import adminAuthService from "../services/adminAuthService";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
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

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        login,
        logout,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  return useContext(AdminAuthContext);
};