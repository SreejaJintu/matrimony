import axios from "axios";

const API_BASE_URL = "/api/admin/auth";

const adminAuthService = {
  login: async (userName, password) => {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      userName,
      password,
    });

    return response.data;
  },

  updateCredentials: async (credentials) => {
    const token = localStorage.getItem("soesyAdminToken");
    const response = await axios.put(`${API_BASE_URL}/credentials`, credentials, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  },

  getAdmins: async () => {
    const token = localStorage.getItem("soesyAdminToken");
    const response = await axios.get(`${API_BASE_URL}/admins`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  },

  resetAdminPassword: async (adminId, newPassword) => {
    const token = localStorage.getItem("soesyAdminToken");
    const response = await axios.put(`${API_BASE_URL}/admins/${adminId}/password`, { newPassword }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  },
};

export default adminAuthService;
