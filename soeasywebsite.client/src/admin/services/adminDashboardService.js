import axios from "axios";

const adminDashboardService = {
  getDashboardStats: async () => {
    const response = await axios.get("/api/admin/dashboard/stats");
    return response.data;
  },
};

export default adminDashboardService;
