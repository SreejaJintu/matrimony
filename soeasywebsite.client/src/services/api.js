import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor automatically attaches the Auth token to every request
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('soeasy_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

async function request(path, options = {}) {
  try {
    const { method = 'GET', data, ...rest } = options
    const response = await apiClient.request({
      url: path,
      method: method.toLowerCase(),
      data,
      ...rest,
    })
    return response.data
  } catch (err) {
    console.error('API REQUEST ERROR:', err)
    const responseData = err?.response?.data
    const message =
      responseData?.message ||
      responseData?.Message ||
      err?.message ||
      'Request failed.'
    throw new Error(message)
  }
}

function normalizeProfilePayload(payload = {}) {
  return {
    ...payload,
  }
}

export const api = {
  // Auth
  register: (payload) => request('/api/auth/register', { method: 'POST', data: payload }),
  login: (payload) => request('/api/auth/login', { method: 'POST', data: payload }),

  // Masters
  getMasterHeight: () => request('/api/master/height'),
  getMasterReligion: () => request('/api/master/religion'),
  getMasterCommunity: (religionId) => request(`/api/master/community/${religionId}`),
  getMasterCountry: () => request('/api/master/country'),
  getMasterState: (countryId) => request(`/api/master/state/${countryId}`),
  getMasterDistrict: (stateId) => request(`/api/master/district/${stateId}`),
  getMasterDistricts: () => request('/api/master/districts'),
  getMasterEducation: () => request('/api/master/education'),
  getMasterMaritalStatus: () => request('/api/master/marital-status'),
  getMasterMotherTongue: () => request('/api/master/mother-tongue'),
  getMasterOccupation: () => request('/api/master/occupation'),
  getMasterIncome: () => request('/api/master/income'),
  getMasterFamilyType: () => request('/api/master/family-type'),
  getMasterFamilyStatus: () => request('/api/master/family-status'),
  getMasterFamilyValue: () => request('/api/master/family-value'),

  // User & Profile
  getAccountBasics: (userId) => request(`/api/account/${userId}`),
  saveAccountBasics: (payload) => request('/api/account/basics', { method: 'PUT', data: payload }),
  getProfile: (userId, viewerUserId) =>
    request(viewerUserId ? `/api/profile/${userId}?viewerUserId=${viewerUserId}` : `/api/profile/${userId}`),
  saveProfile: (payload) => {
    const normalized = normalizeProfilePayload(payload)
    const resolvedUserId = Number(normalized.userId ?? session.getUserId() ?? 0)

    return request('/api/profile/profile', {
      method: 'PUT',
      data: {
        ...normalized,
        userId: resolvedUserId,
      },
    })
  },
  saveFamily: (payload) => request('/api/profile/family', { method: 'PUT', data: payload }),
  savePreference: (payload) => request('/api/profile/preference', { method: 'PUT', data: payload }),
  savePhoto: (payload) => request('/api/profile/photo', { method: 'POST', data: payload }),
  searchMatches: (payload) => request('/api/match/search', { method: 'POST', data: payload }),
  shortlistGet: () => request('/api/shortlist'),
  shortlistAdd: (targetUserId) => request(`/api/shortlist/${targetUserId}`, { method: 'POST' }),
  shortlistRemove: (targetUserId) => request(`/api/shortlist/${targetUserId}`, { method: 'DELETE' }),
  shortlistCheck: (targetUserId) => request(`/api/shortlist/check/${targetUserId}`),
  
  // File Upload
  uploadPhoto: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    // Axios auto-sets multipart boundary headers and applies auth interceptor automatically
    const response = await apiClient.post('/api/profile/upload-photo', formData, {
      headers: { 'Content-Type': undefined },
    })
    return response.data
  },
// Add inside the api object in api.js
  submitLead: (payload) => request('/api/subscription/lead', { method: 'POST', data: payload }),
  // Subscription / Membership
  getSubscriptionStatus: (userId) => request(`/api/subscription/status/${userId}`),
  submitPayment: (payload) => request('/api/subscription/submit-payment', { method: 'POST', data: payload }),
  unlockProfile: (viewerUserId, targetUserId) =>
    request(`/api/subscription/unlock?viewerUserId=${viewerUserId}&targetUserId=${targetUserId}`, { method: 'POST' }),

  // Admin only
  approveSubscription: (subscriptionId, adminUserId = 1) =>
    request(`/api/subscription/approve/${subscriptionId}?adminUserId=${adminUserId}`, { method: 'PUT' }),
  markProfileMarried: (userId, adminUserId = 1) =>
    request(`/api/subscription/mark-married/${userId}?adminUserId=${adminUserId}`, { method: 'PUT' }),
}

export const session = {
  setAuth(data) {
    if (data.token) {
      sessionStorage.setItem('soeasy_token', data.token)
    }
    sessionStorage.setItem('soeasy_user_id', String(data.userId))
    sessionStorage.setItem('soeasy_full_name', data.fullName ?? '')
    sessionStorage.setItem('soeasy_gender_id', String(data.genderId ?? ''))
    sessionStorage.setItem('soeasy_subscription', data.subscription ?? 'Free')
  },
  setUser(data) {
    sessionStorage.setItem('soeasy_user_id', String(data.userId))
    sessionStorage.setItem('soeasy_full_name', data.fullName ?? '')
    if (data.genderId !== undefined) {
      sessionStorage.setItem('soeasy_gender_id', String(data.genderId))
    }
    if (data.subscription) {
      sessionStorage.setItem('soeasy_subscription', data.subscription)
    }
  },
  clearAuth() {
    sessionStorage.removeItem('soeasy_token')
    sessionStorage.removeItem('soeasy_user_id')
    sessionStorage.removeItem('soeasy_full_name')
    sessionStorage.removeItem('soeasy_gender_id')
    sessionStorage.removeItem('soeasy_subscription')
  },
  getUserId() {
    const value = sessionStorage.getItem('soeasy_user_id')
    return value ? Number(value) : null
  },
  getFullName() {
    return sessionStorage.getItem('soeasy_full_name') ?? ''
  },
  getGenderId() {
    const value = sessionStorage.getItem('soeasy_gender_id')
    return value ? Number(value) : null
  },
  getSubscription() {
    return sessionStorage.getItem('soeasy_subscription') ?? 'Free'
  },
  isAuthenticated() {
    return Boolean(sessionStorage.getItem('soeasy_token'))
  },
}
