import axios from 'axios'

const API_BASE_URL = '/api/admin/subscriptions'
const PLANS_API_URL = '/api/admin/plans'

export const activateSubscription = async (data) => {
  const response = await axios.post(
    `${API_BASE_URL}/activate`,
    data
  )

  return response.data
}

export const getMembershipPlans = async () => {
  const response = await axios.get(PLANS_API_URL)
  return response.data
}

export const createMembershipPlan = async (data) => {
  const response = await axios.post(PLANS_API_URL, data)
  return response.data
}

export const updateMembershipPlan = async (planId, data) => {
  const response = await axios.put(`${PLANS_API_URL}/${planId}`, data)
  return response.data
}

export const deactivateMembershipPlan = async (planId) => {
  await axios.delete(`${PLANS_API_URL}/${planId}`)
}
