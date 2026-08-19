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
};

export default adminAuthService;