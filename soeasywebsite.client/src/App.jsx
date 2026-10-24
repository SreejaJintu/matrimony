import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { AdminAuthProvider } from './admin/context/AdminAuthContext.jsx'
import { ExecutiveAuthProvider } from './executive/context/ExecutiveAuthContext.jsx'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <ExecutiveAuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 6000,
              style: { borderRadius: '10px', fontSize: '14px', maxWidth: '420px' },
              error: {
                style: { background: '#fff8f7', border: '1px solid #efc5c2', color: '#842727' },
              },
            }}
          />
        </ExecutiveAuthProvider>
      </AdminAuthProvider>
    </AuthProvider>
  )
}

export default App
