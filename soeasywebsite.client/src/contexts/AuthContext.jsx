import { useCallback, useState } from 'react'
import { AuthContext } from './AuthContext'
import { api, session } from '../services/api'

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => session.isAuthenticated())
  const [user, setUser] = useState(() => {
    if (!session.isAuthenticated()) return null

    return {
      userId: session.getUserId(),
      fullName: session.getFullName(),
      genderId: session.getGenderId(),
      subscription: session.getSubscription(),
      isBroker: session.getIsBroker(),
      token: sessionStorage.getItem('soeasy_token'),
    }
  })

  const login = useCallback(async (userName, password) => {
    const response = await api.login({ userName, password })

    if (response?.success !== true) {
      throw new Error(response?.message || 'Invalid username or password.')
    }

    const payload = response.data

    if (payload?.requiresOtp === true) {
      return payload
    }

    if (!payload?.token) {
      throw new Error('Login succeeded, but authentication token was not received from the server.')
    }

    const authData = {
      userId: payload.userId,
      fullName: payload.fullName,
      genderId: payload.genderId,
      subscription: payload.subscription ?? 'Free',
      isBroker: payload.isBroker === true,
      token: payload.token,
    }

    session.setAuth(authData)

    const loggedInUser = {
      userId: authData.userId,
      fullName: authData.fullName,
      genderId: authData.genderId,
      subscription: authData.subscription,
      isBroker: authData.isBroker,
      token: authData.token,
    }

    setIsAuthenticated(true)
    setUser(loggedInUser)

    return loggedInUser
  }, [])

  const verifyLoginOtp = useCallback(async (userId, otp) => {
    const response = await api.verifyLoginOtp({ userId, otp })

    if (response?.success !== true) {
      throw new Error(response?.message || 'OTP verification failed.')
    }

    const payload = response.data
    if (!payload?.token) {
      throw new Error('OTP verification succeeded, but authentication token was not received from the server.')
    }

    const authData = {
      userId: payload.userId,
      fullName: payload.fullName,
      genderId: payload.genderId,
      subscription: payload.subscription ?? 'Free',
      isBroker: false,
      token: payload.token,
    }

    session.setAuth(authData)

    const loggedInUser = {
      userId: authData.userId,
      fullName: authData.fullName,
      genderId: authData.genderId,
      subscription: authData.subscription,
      isBroker: authData.isBroker,
      token: authData.token,
    }

    setIsAuthenticated(true)
    setUser(loggedInUser)

    return loggedInUser
  }, [])

  const logout = useCallback(() => {
    session.clearAuth()
    setIsAuthenticated(false)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, verifyLoginOtp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
