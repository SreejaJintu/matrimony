import axios from "axios";

const adminProfileShareService = {
  send: async (paidUserId, profileUserIds) => {
    const token = localStorage.getItem("soesyAdminToken");
    const response = await axios.post("/api/admin/profile-shares", {
      paidUserId,
      profileUserIds,
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  },
};

export default adminProfileShareService;
