import axios from "axios";

const adminProfileService = {
  getProfiles: async ({
    search = "",
    genderId = "",
    profileStatusId = "",
  } = {}) => {
    const response = await axios.get("/api/admin/profiles", {
      params: {
        search: search || undefined,
        genderId: genderId || undefined,
        profileStatusId: profileStatusId || undefined,
      },
    });

    return response.data;
  },
};

export default adminProfileService;