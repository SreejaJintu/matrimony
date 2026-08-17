import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

const apiClient = axios.create({ baseURL: API_BASE, headers: { 'Content-Type': 'application/json' } })

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('soeasy_token')
  if (token) config.headers = { ...(config.headers ?? {}), Authorization: `Bearer ${token}` }
  return config
})

async function request(path, options = {}) {
  try {
    const { method = 'GET', body, ...rest } = options
    const data = body ? JSON.parse(body) : undefined
    const response = await apiClient.request({ url: path, method: method.toLowerCase(), data, ...rest })
    return response.data
  } catch (err) {
    console.error('API REQUEST ERROR:', err)
    const data = err?.response?.data
    const message = data?.message || data?.Message || err?.message || 'Request failed.'
    throw new Error(message)
  }
}

export const api = {
  register: (payload) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getMasterHeight: () => request('/api/master/height'),
  getMasterReligion: () => request('/api/master/religion'),
  getMasterCommunity: (religionId) => request(`/api/master/community/${religionId}`),
  getMasterCountry: () => request('/api/master/country'),
  getMasterState: (countryId) => request(`/api/master/state/${countryId}`),
  getMasterDistrict: (stateId) => request(`/api/master/district/${stateId}`),
  getMasterEducation: () => request('/api/master/education'),
  getMasterMaritalStatus: () => request('/api/master/marital-status'),
  getMasterMotherTongue: () => request('/api/master/mother-tongue'),
  getMasterOccupation: () => request('/api/master/occupation'),
  getMasterIncome: () => request('/api/master/income'),
  getMasterFamilyType: () => request('/api/master/family-type'),
  getMasterFamilyStatus: () => request('/api/master/family-status'),
  getMasterFamilyValue: () => request('/api/master/family-value'),
  getAccountBasics: (userId) => request(`/api/account/${userId}`),
  saveAccountBasics: (payload) => request('/api/account/basics', { method: 'PUT', body: JSON.stringify(payload) }),
  getProfile: (userId, viewerUserId) => request(viewerUserId ? `/api/profile/${userId}?viewerUserId=${viewerUserId}` : `/api/profile/${userId}`),
  saveProfile: (payload) => request('/api/profile/profile', { method: 'PUT', body: JSON.stringify(payload) }),
  saveFamily: (payload) => request('/api/profile/family', { method: 'PUT', body: JSON.stringify(payload) }),
  savePreference: (payload) => request('/api/profile/preference', { method: 'PUT', body: JSON.stringify(payload) }),
  savePhoto: (payload) => request('/api/profile/photo', { method: 'POST', body: JSON.stringify(payload) }),
  searchMatches: (payload) => request('/api/match/search', { method: 'POST', body: JSON.stringify(payload) }),
  uploadPhoto: async (file) => {
    const token = sessionStorage.getItem('soeasy_token')
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post('/api/profile/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    return response.data
  },

  // Subscription / Membership
  getSubscriptionStatus: (userId) => request(`/api/subscription/status/${userId}`),
  submitPayment: (payload) => request('/api/subscription/submit-payment', { method: 'POST', body: JSON.stringify(payload) }),
  unlockProfile: (viewerUserId, targetUserId) => request(`/api/subscription/unlock?viewerUserId=${viewerUserId}&targetUserId=${targetUserId}`, { method: 'POST' }),

  // Admin only
  approveSubscription: (subscriptionId, adminUserId = 1) => request(`/api/subscription/approve/${subscriptionId}?adminUserId=${adminUserId}`, { method: 'PUT' }),
  markProfileMarried: (userId, adminUserId = 1) => request(`/api/subscription/mark-married/${userId}?adminUserId=${adminUserId}`, { method: 'PUT' }),
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
