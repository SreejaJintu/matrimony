import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes'
import { AuthProvider } from './contexts/AuthContext.jsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
