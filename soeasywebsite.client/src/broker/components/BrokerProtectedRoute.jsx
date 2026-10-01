import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

export function BrokerProtectedRoute() {
  const { isAuthenticated, user } = useContext(AuthContext)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return user?.isBroker === true ? <Outlet /> : <Navigate to="/matches" replace />
}
