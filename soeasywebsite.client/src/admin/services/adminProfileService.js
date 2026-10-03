import axios from "axios";

const adminProfileService = {
  getProfiles: async ({
    search = "",
    genderId = "",
    profileStatusId = "",
    page = 1,
    pageSize = 25,
  } = {}) => {
    const response = await axios.get("/api/admin/profiles", {
      params: {
        search: search || undefined,
        genderId: genderId || undefined,
        profileStatusId: profileStatusId || undefined,
        page,
        pageSize,
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

  getPhotos: async (userId) => {
    const response = await axios.get(`/api/admin/profiles/${userId}/photos`);
    return response.data;
  },

  deleteProfile: async (userId) => {
    const response = await axios.delete(`/api/admin/profiles/${userId}`);
    return response.data;
  },

  updateMobileNumber: async (userId, mobileNumber) => {
    const response = await axios.put(`/api/admin/profiles/${userId}/mobile`, {
      mobileNumber,
    });
    return response.data;
  },

  resetPassword: async (userId, newPassword) => {
    const token = localStorage.getItem("soesyAdminToken");
    const response = await axios.put(`/api/admin/profiles/${userId}/password`, { newPassword }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  },

  updateProfileStatus: async (userId, profileStatusId) => {
    const response = await axios.put(
      `/api/admin/profiles/${userId}/status`,
      { profileStatusId }
    );

    return response.data;
  },

  updateMaritalStatus: async (userId, isMarried) => {
    const response = await axios.put(
      `/api/admin/profiles/${userId}/marital-status`,
      { isMarried }
    );

    return response.data;
  },


  markAsMarried: async (userId) => {
  const response = await axios.put(
    `/api/admin/profiles/${userId}/married`
  );

  return response.data;
},

  updateProfile: async (payload) => {
    const response = await axios.put('/api/profile/profile', payload);
    return response.data;
  },
};


export default adminProfileService;
