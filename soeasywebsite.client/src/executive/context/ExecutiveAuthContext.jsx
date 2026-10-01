import { createContext, useContext, useEffect, useState } from "react";
import executiveAuthService from "../services/executiveAuthService";

const ExecutiveAuthContext = createContext(null);

const tokenExpiry = (token) => {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(payload)).exp ?? 0;
  } catch {
    return 0;
  }
};

const isValidToken = (token) => Boolean(token) && tokenExpiry(token) * 1000 > Date.now();

export const ExecutiveAuthProvider = ({ children }) => {
  const [executive, setExecutive] = useState(() => {
    const token = localStorage.getItem("soesyExecutiveToken");
    if (!isValidToken(token)) {
      localStorage.removeItem("soesyExecutive");
      localStorage.removeItem("soesyExecutiveToken");
      return null;
    }
    try {
      return JSON.parse(localStorage.getItem("soesyExecutive")) ?? null;
    } catch {
      localStorage.removeItem("soesyExecutive");
      localStorage.removeItem("soesyExecutiveToken");
      return null;
    }
  });

  const logout = () => {
    localStorage.removeItem("soesyExecutive");
    localStorage.removeItem("soesyExecutiveToken");
    setExecutive(null);
  };

  const login = async (userName, password) => {
    const result = await executiveAuthService.login(userName, password);
    if (!result.success || !result.data?.token) throw new Error(result.message || "Executive login failed.");
    localStorage.setItem("soesyExecutive", JSON.stringify(result.data));
    localStorage.setItem("soesyExecutiveToken", result.data.token);
    setExecutive(result.data);
    return result.data;
  };

  const token = localStorage.getItem("soesyExecutiveToken");
  const isAuthenticated = isValidToken(token) && Boolean(executive);

  useEffect(() => {
    if (!isAuthenticated) {
      if (token) logout();
      return undefined;
    }
    const timeoutId = window.setTimeout(logout, tokenExpiry(token) * 1000 - Date.now());
    return () => window.clearTimeout(timeoutId);
  }, [token, isAuthenticated]);

  return <ExecutiveAuthContext.Provider value={{ executive, login, logout, isAuthenticated }}>{children}</ExecutiveAuthContext.Provider>;
};

export const useExecutiveAuth = () => useContext(ExecutiveAuthContext);
