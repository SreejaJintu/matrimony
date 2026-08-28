import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { AboutYouStep } from '../../components/forms/AboutYouStep'
import { RegistrationShell } from '../../components/forms/RegistrationShell'
import { api, session } from '../../services/api'
import {
  getNextRegistrationStep,
  getPreviousRegistrationStep,
  getRegistrationDraft,
  saveRegistrationDraft,
} from '../../services/registrationDraft'

const EMPTY_MASTER_DATA = { heights: [], educations: [], maritalStatuses: [] }

const STEPS = [
  { id: 'basic', label: 'Basic Details', icon: Heart },
  { id: 'about', label: 'About You', icon: Heart },
  { id: 'family', label: 'Family Details', icon: Heart },
  { id: 'preferences', label: 'Partner Preferences', icon: Heart },
  { id: 'photos', label: 'Upload Photos', icon: Heart },
]

const SUPPORTED_FIELDS = ['heightId', 'weight', 'maritalStatusId', 'occupation', 'occupationId', 'company', 'educationId', 'city', 'dob', 'religionId', 'motherTongueId', 'communityId', 'countryId', 'stateId', 'districtId']

const sanitizeAboutDraft = (draft = {}) => {
  const cleaned = {}
  for (const key of SUPPORTED_FIELDS) {
    if (draft[key] !== undefined && draft[key] !== null) {
      cleaned[key] = draft[key]
    }
  }
  return cleaned
}

const buildProfilePayload = (draft, userId) => {
  const payload = {
    userId,
    dateOfBirth: draft.dob ? new Date(`${draft.dob}T00:00:00`).toISOString() : null,
    heightId: draft.heightId !== undefined && draft.heightId !== null && draft.heightId !== '' ? Number(draft.heightId) : null,
    weight: draft.weight !== '' && draft.weight !== undefined && draft.weight !== null ? Number(draft.weight) : null,
    maritalStatusId: draft.maritalStatusId !== undefined && draft.maritalStatusId !== null && draft.maritalStatusId !== '' ? Number(draft.maritalStatusId) : null,
    motherTongueId: draft.motherTongueId !== undefined && draft.motherTongueId !== null && draft.motherTongueId !== '' ? Number(draft.motherTongueId) : null,
    religionId: draft.religionId !== undefined && draft.religionId !== null && draft.religionId !== '' ? Number(draft.religionId) : null,
    communityId: draft.communityId !== undefined && draft.communityId !== null && draft.communityId !== '' ? Number(draft.communityId) : null,
    educationId: draft.educationId !== undefined && draft.educationId !== null && draft.educationId !== '' ? Number(draft.educationId) : null,
    occupationId: draft.occupationId !== undefined && draft.occupationId !== null && draft.occupationId !== '' ? Number(draft.occupationId) : null,
    companyName: draft.company || null,
    designation: draft.occupation || null,
    incomeId: draft.incomeId !== undefined && draft.incomeId !== null && draft.incomeId !== '' ? Number(draft.incomeId) : null,
    countryId: draft.countryId !== undefined && draft.countryId !== null && draft.countryId !== '' ? Number(draft.countryId) : null,
    stateId: draft.stateId !== undefined && draft.stateId !== null && draft.stateId !== '' ? Number(draft.stateId) : null,
    districtId: draft.districtId !== undefined && draft.districtId !== null && draft.districtId !== '' ? Number(draft.districtId) : null,
    address: draft.city || null,
    pincode: draft.pincode || null,
    aboutMe: draft.aboutMe || null,
  }

  return payload
}

export function RegistrationAboutPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(() => ({
    ...sanitizeAboutDraft(getRegistrationDraft()),
    gender: getRegistrationDraft()?.gender,
  }))
  const [masterData, setMasterData] = useState(EMPTY_MASTER_DATA)

  useEffect(() => {
    const loadMasters = async () => {
      try {
        console.log('Loading master data...')
        const [heights, educations, maritalStatuses, occupations] = await Promise.all([
          api.getMasterHeight(),
          api.getMasterEducation(),
          api.getMasterMaritalStatus(),
          api.getMasterOccupation(),
        ])

        console.log('Heights response:', heights)
        console.log('Educations response:', educations)
        console.log('Marital Statuses response:', maritalStatuses)
        console.log('Occupations response:', occupations)

        const masterDataObj = {
          heights: heights?.data ?? heights ?? [],
          educations: educations?.data ?? educations ?? [],
          maritalStatuses: maritalStatuses?.data ?? maritalStatuses ?? [],
          occupations: occupations?.data ?? occupations ?? [],
        }

        console.log('Master data object:', masterDataObj)
        setMasterData(masterDataObj)
      } catch (error) {
        console.error('Failed to load master data:', error)
        setMasterData(EMPTY_MASTER_DATA)
      }
    }

    loadMasters()
  }, [])

  useEffect(() => {
    saveRegistrationDraft({ ...getRegistrationDraft(), ...formData }, 'about')
  }, [formData])

  const handleBack = () => {
    const previous = getPreviousRegistrationStep('about')
    navigate(previous ? `/register/${previous}` : '/register', { replace: true })
  }

  const handleSubmit = async (data) => {
    const merged = {
      ...getRegistrationDraft(),
      ...sanitizeAboutDraft({ ...formData, ...data }),
      gender: getRegistrationDraft()?.gender ?? formData.gender,
    }
    setFormData(merged)
    saveRegistrationDraft(merged, 'about')

    try {
      const userId = session.getUserId()
      if (!userId) {
        throw new Error('User session not found. Please complete registration again.')
      }

      const payload = buildProfilePayload(merged, userId)
      console.log('[RegistrationAboutPage] saveProfile payload:', payload)
      await api.saveProfile(payload)

      const next = getNextRegistrationStep('about')
      navigate(next ? `/register/${next}` : '/register', { replace: true })
    } catch (error) {
      console.error('Profile save failed:', error)
      alert(error?.message || 'Unable to save About details. Please try again.')
    }
  }

  return (
    <RegistrationShell
      currentStep="about"
      title="Tell Us About You"
      subtitle="Add a little more detail so we can present you well."
      steps={STEPS}
      onStepChange={(step) => navigate(step === 'basic' ? '/register' : `/register/${step}`, { replace: true })}
    >
      <AboutYouStep initialData={formData} onSubmit={handleSubmit} onBack={handleBack} masterData={masterData} />
    </RegistrationShell>
  )
}
