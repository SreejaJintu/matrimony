import axios from "axios";

const API_BASE_URL = "/api/admin/brokers";

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

const adminBrokerService = {
  getBrokers: async () => {
    const response = await request(() => axios.get(API_BASE_URL, requestConfig()));
    return response.data;
  },

  registerBroker: async (payload) => {
    const response = await request(() => axios.post(API_BASE_URL, payload, requestConfig()));
    return response.data;
  },

  updateBroker: async (brokerId, payload) => {
    const response = await request(() => axios.put(`${API_BASE_URL}/${brokerId}`, payload, requestConfig()));
    return response.data;
  },

  deleteBroker: async (brokerId) => {
    await request(() => axios.delete(`${API_BASE_URL}/${brokerId}`, requestConfig()));
  },

  updateApproval: async (brokerId, isApproved) => {
    const response = await request(() => axios.put(
      `${API_BASE_URL}/${brokerId}/approval`,
      { isApproved },
      requestConfig()
    ));
    return response.data;
  },
};

export default adminBrokerService;