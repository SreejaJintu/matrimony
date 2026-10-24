import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import toast from 'react-hot-toast'
import { BasicDetailsStep } from '../components/forms/BasicDetailsStep'
import { RegistrationShell } from '../components/forms/RegistrationShell'
import { api, session } from '../services/api'
import { getRegistrationDraft, saveRegistrationDraft } from '../services/registrationDraft'
import { assertApiSuccess, getFriendlyErrorMessage } from '../services/apiErrors'

const STEPS = [{ id: 'basic', label: 'Basic Details', icon: User }]

const initialForm = {
  profileFor: 'Myself',
  fullName: '',
  gender: '',
  countryCode: '+91',
  mobileNumber: '',
  email: '',
  password: '',
}

const pickFirstValue = (source, keys) => {
  if (!source) return ''
  for (const key of keys) {
    const value = source[key]
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return value
    }
  }
  return ''
}

export function AccountCompletionPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(() => ({ ...initialForm, ...(getRegistrationDraft() ?? {}) }))
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const userId = session.getUserId()
    if (!userId) return

    let active = true

    Promise.all([api.getAccountBasics(userId), api.getProfile(userId)])
      .then(([accountRes, profileRes]) => {
        if (!active) return

        const account = accountRes?.data ?? accountRes?.Data ?? accountRes
        const profile = profileRes?.data ?? profileRes?.Data ?? profileRes
        if (!account && !profile) return

        const hydrated = {
          ...initialForm,
          ...getRegistrationDraft(),
          fullName: account?.fullName || profile?.fullName || '',
          gender: account?.genderId === 2 ? 'Female' : account?.genderId === 3 ? 'Other' : account?.genderId === 1 ? 'Male' : profile?.genderId === 2 ? 'Female' : profile?.genderId === 3 ? 'Other' : profile?.genderId === 1 ? 'Male' : '',
          mobileNumber: pickFirstValue(account, ['mobileNumber', 'mobileNo', 'phoneNumber', 'phone', 'contactNumber', 'mobile']) || '',
          email: pickFirstValue(account, ['email', 'emailId', 'emailAddress', 'mail', 'userEmail']) || '',
        }

        setFormData(hydrated)
        saveRegistrationDraft(hydrated, 'basic')
      })
      .catch((err) => {
        console.error(err)
        toast.error('Unable to load account details.')
      })

    return () => {
      active = false
    }
  }, [])

  const handleSubmit = async (data) => {
    const merged = { ...formData, ...data }
    setFormData(merged)

    try {
      setIsSubmitting(true)
      const userId = session.getUserId()
      if (!userId) throw new Error('User session not found.')

      const response = await api.saveAccountBasics({
        userId,
        fullName: merged.fullName,
        mobileNumber: merged.mobileNumber,
        email: merged.email,
        genderId: merged.gender === 'Female' ? 2 : merged.gender === 'Other' ? 3 : 1,
      })
      assertApiSuccess(response, 'Unable to save account details. Please try again.')

      saveRegistrationDraft(merged, 'basic')
      navigate('/account-completion/about', { replace: true })
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Unable to save account details. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <RegistrationShell
      currentStep="basic"
      title="Complete Your Account"
      subtitle="Finish the pending account basics before continuing your profile."
      steps={STEPS}
      onStepChange={() => {}}
      mode="create"
    >
      <BasicDetailsStep
        initialData={formData}
        onSubmit={handleSubmit}
        onSaveLater={() => navigate('/login')}
        showPasswordField={false}
        isSubmitting={isSubmitting}
      />
    </RegistrationShell>
  )
}
