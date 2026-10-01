import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { AdminAuthProvider } from './admin/context/AdminAuthContext.jsx'
import { ExecutiveAuthProvider } from './executive/context/ExecutiveAuthContext.jsx'

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <ExecutiveAuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ExecutiveAuthProvider>
      </AdminAuthProvider>
    </AuthProvider>
  )
}

export default App
