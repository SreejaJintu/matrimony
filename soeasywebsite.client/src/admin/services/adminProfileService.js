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

  getProfileById: async (userId) => {
    const response = await axios.get(
      `/api/admin/profiles/${userId}`
    );

    return response.data;
  },

  updateProfileStatus: async (userId, profileStatusId) => {
    const response = await axios.put(
      `/api/admin/profiles/${userId}/status`,
      { profileStatusId }
    );

    return response.data;
  },


  markAsMarried: async (userId) => {
  const response = await axios.put(
    `/api/admin/profiles/${userId}/married`
  );

  return response.data;
},
};


export default adminProfileService;