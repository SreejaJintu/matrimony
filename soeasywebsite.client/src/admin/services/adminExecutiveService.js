import axios from "axios";

const API_BASE_URL = "/api/admin/executives";

const requestConfig = () => {
  const token = localStorage.getItem("soesyAdminToken");
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
};

const request = async (operation) => {
  try {
    return await operation();
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("soesyAdmin");
      localStorage.removeItem("soesyAdminToken");
      window.dispatchEvent(new Event("admin-auth-expired"));
    }
    throw error;
  }
};

const adminExecutiveService = {
  getExecutives: async ({ search = "", isActive = "" } = {}) => {
    const response = await request(() => axios.get(API_BASE_URL, {
      ...requestConfig(),
      params: {
        search: search || undefined,
        isActive: isActive === "" ? undefined : isActive,
      },
    }));
    return response.data;
  },

  getExecutiveById: async (executiveId) => {
    const response = await request(() => axios.get(`${API_BASE_URL}/${executiveId}`, requestConfig()));
    return response.data;
  },

  createExecutive: async (payload) => {
    const response = await request(() => axios.post(API_BASE_URL, payload, requestConfig()));
    return response.data;
  },

  updateExecutive: async (executiveId, payload) => {
    const response = await request(() => axios.put(`${API_BASE_URL}/${executiveId}`, payload, requestConfig()));
    return response.data;
  },

  updateExecutiveStatus: async (executiveId, isActive) => {
    const response = await request(() => axios.put(
      `${API_BASE_URL}/${executiveId}/status`,
      { isActive },
      requestConfig()
    ));
    return response.data;
  },
};

export default adminExecutiveService;