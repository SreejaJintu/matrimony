import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { AdminAuthProvider } from './admin/context/AdminAuthContext.jsx'

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AdminAuthProvider>
    </AuthProvider>
  )
}

export default App