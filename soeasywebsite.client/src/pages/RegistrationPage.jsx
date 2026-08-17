import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import { BasicDetailsStep } from '../components/forms/BasicDetailsStep'
import { RegistrationShell } from '../components/forms/RegistrationShell'
import { getRegistrationDraft, saveRegistrationDraft } from '../services/registrationDraft'
import { api, session } from '../services/api'

const REGISTRATION_STEPS = [{ id: 'basic', label: 'Basic Details', icon: User }]

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

const initialForm = {
  profileFor: 'Myself',
  fullName: '',
  gender: '',
  dob: '',
  religion: '',
  motherTongue: '',
  community: '',
  country: '',
  countryCode: '+91',
  mobileNumber: '',
  email: '',
  password: '',
  height: '',
  weight: '',
  bodyType: '',
  maritalStatus: '',
  occupation: '',
  company: '',
  education: '',
  annualIncome: '',
  city: '',
  fatherName: '',
  fatherOccupation: '',
  motherName: '',
  motherOccupation: '',
  familyType: '',
  familyStatus: '',
  familyValue: '',
  nativePlace: '',
  brothers: 0,
  sisters: 0,
  aboutFamily: '',
  lookingForGender: 'Female',
  ageRangeMin: 26,
  ageRangeMax: 32,
  preferredReligion: 'Any Religion',
  preferredCommunity: '',
  educationPreference: 'Any Degree',
  preferredProfession: '',
  preferredMaritalStatus: 'Never Married',
  locationPreference: '',
  photos: [],
  profilePhotoIndex: 0,
}

export function RegistrationPage({ onBackToSignIn }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(() => ({ ...initialForm, ...(getRegistrationDraft() ?? {}) }))
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isHydrating, setIsHydrating] = useState(false)
  const isLoggedInProfileCompletion = session.isAuthenticated()

  useEffect(() => {
    const userId = session.getUserId()
    if (!userId) return

    const draft = getRegistrationDraft()
    if (draft?.fullName && draft?.mobileNumber && draft?.email) return

    let active = true
    setIsHydrating(true)

    api.getProfile(userId)
      .then((response) => {
        const profile = response?.data ?? response?.Data ?? response
        if (!active || !profile) return

        const hydratedDraft = {
          ...initialForm,
          ...draft,
          fullName: profile.fullName || draft?.fullName || '',
          gender: profile.genderId === 2 ? 'Female' : profile.genderId === 3 ? 'Other' : profile.genderId === 1 ? 'Male' : draft?.gender || '',
          dob: profile.dateOfBirth ? String(profile.dateOfBirth).slice(0, 10) : draft?.dob || '',
          mobileNumber:
            pickFirstValue(profile, ['mobileNumber', 'mobileNo', 'phoneNumber', 'phone', 'contactNumber', 'mobile']) ||
            draft?.mobileNumber ||
            '',
          email:
            pickFirstValue(profile, ['email', 'emailId', 'emailAddress', 'mail', 'userEmail']) ||
            draft?.email ||
            '',
          height: profile.height || draft?.height || '',
          maritalStatus: profile.maritalStatus || draft?.maritalStatus || '',
          occupation: profile.designation || profile.occupation || draft?.occupation || '',
          company: profile.companyName || draft?.company || '',
          education: profile.education || draft?.education || '',
          city: profile.district || profile.state || profile.country || draft?.city || '',
          fatherOccupation: profile.familyAbout || draft?.fatherOccupation || '',
          motherOccupation: profile.familyAbout || draft?.motherOccupation || '',
          brothers: profile.brothers ?? draft?.brothers ?? 0,
          sisters: profile.sisters ?? draft?.sisters ?? 0,
          aboutFamily: profile.familyAbout || draft?.aboutFamily || '',
          aboutMe: profile.aboutMe || draft?.aboutMe || '',
          religion: profile.religion || draft?.religion || '',
          motherTongue: profile.motherTongue || draft?.motherTongue || '',
          community: profile.community || draft?.community || '',
          country: profile.country || draft?.country || '',
        }

        setFormData(hydratedDraft)
        saveRegistrationDraft(hydratedDraft, 'basic')
      })
      .catch(() => {})
      .finally(() => {
        if (active) {
          setIsHydrating(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (isHydrating) return
    saveRegistrationDraft(formData, 'basic')
  }, [formData, isHydrating])

  const handleSaveLater = (draft = formData) => {
    saveRegistrationDraft(draft, 'basic')
    if (onBackToSignIn) {
      onBackToSignIn()
    } else {
      navigate('/')
    }
  }

  const handleFinalSubmit = async (data) => {
    const merged = { ...formData, ...data }
    setFormData(merged)

    if (isLoggedInProfileCompletion) {
      saveRegistrationDraft(merged, 'basic')
      navigate('/register/about', { replace: true })
      return
    }

    try {
      setError('')
      setIsSubmitting(true)
      const response = await api.register({
        fullName: merged.fullName,
        mobileNumber: merged.mobileNumber,
        email: merged.email,
        password: merged.password,
        genderId: merged.gender === 'Female' ? 2 : merged.gender === 'Other' ? 3 : 1,
      })

      const result = response?.data ?? response?.Data
      if (!result?.success) {
        throw new Error(result?.message || response?.message || 'Registration failed.')
      }

      if (result.userId) {
        session.setUser({
          userId: result.userId,
          fullName: merged.fullName,
        })
      }

      navigate('/register/about', { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to register.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <RegistrationShell
      currentStep="basic"
      title="Create Your Profile"
      subtitle="Join thousands of verified members who are looking for a meaningful relationship"
      steps={REGISTRATION_STEPS}
      error={error}
      onStepChange={() => {}}
      mode="create"
    >
      <BasicDetailsStep
        initialData={formData}
        onSubmit={handleFinalSubmit}
        onSaveLater={handleSaveLater}
        showPasswordField={!isLoggedInProfileCompletion}
      />
    </RegistrationShell>
  )
}
