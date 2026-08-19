import axios from 'axios'

const API_BASE_URL = '/api/admin/subscriptions'

export const activateSubscription = async (data) => {
  const response = await axios.post(
    `${API_BASE_URL}/activate`,
    data
  )

  return response.data
}