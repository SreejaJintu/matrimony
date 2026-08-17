import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SignInModal } from '../components/modals/SignInModal'
import { RegistrationPage } from './RegistrationPage'

export function SignInPage() {
  const [showRegistration, setShowRegistration] = useState(false)
  const navigate = useNavigate()

  const goHome = () => {
    navigate('/')
  }

  if (showRegistration) {
    return <RegistrationPage onBackToSignIn={() => setShowRegistration(false)} />
  }

  return (
    <SignInModal
      isOpen={true}
      onClose={goHome}
      onSuccess={goHome}
      onCreateAccount={() => setShowRegistration(true)}
    />
  )
}
