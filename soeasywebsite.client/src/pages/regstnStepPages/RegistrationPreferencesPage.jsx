import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Target } from 'lucide-react'
import { PartnerPreferencesStep } from '../../components/forms/PartnerPreferencesStep'
import { RegistrationShell } from '../../components/forms/RegistrationShell'
import { api, session } from '../../services/api'
import {
  getNextRegistrationStep,
  getPreviousRegistrationStep,
  getRegistrationDraft,
  saveRegistrationDraft,
} from '../../services/registrationDraft'

const STEPS = [
  { id: 'basic', label: 'Basic Details', icon: Target },
  { id: 'about', label: 'About You', icon: Target },
  { id: 'family', label: 'Family Details', icon: Target },
  { id: 'preferences', label: 'Partner Preferences', icon: Target },
  { id: 'photos', label: 'Upload Photos', icon: Target },
]

const SUPPORTED_FIELDS = [
  'ageRangeMin',
  'ageRangeMax',
  'preferredReligionId',
  'preferredCommunityId',
  'educationPreferenceId',
  'preferredProfession',
  'preferredMaritalStatusId',
  'locationPreference',
]

const sanitizePreferenceDraft = (draft = {}) => {
  const cleaned = {}
  for (const key of SUPPORTED_FIELDS) {
    if (draft[key] !== undefined && draft[key] !== null) {
      cleaned[key] = draft[key]
    }
  }
  return cleaned
}

const resolveLookingForGender = (gender) => {
  if (gender === 2 || String(gender || '').toLowerCase() === 'female') return 'Groom'
  if (gender === 1 || String(gender || '').toLowerCase() === 'male') return 'Bride'
  return 'Partner'
}

const buildPreferencePayload = (draft, userId) => {
  const ageFrom = Number(draft.ageRangeMin || 21)
  const ageTo = Number(draft.ageRangeMax || 30)

  const preferredProfession = draft.preferredProfession || null
  const preferredLocation = draft.locationPreference || null
  const lookingForGender = draft.lookingForGender || null

  return {
    userId,
    ageFrom,
    ageTo,
    heightFromId: null,
    heightToId: null,
    maritalStatusId: draft.preferredMaritalStatusId !== undefined && draft.preferredMaritalStatusId !== null && draft.preferredMaritalStatusId !== '' ? Number(draft.preferredMaritalStatusId) : null,
    religionId: draft.preferredReligionId !== undefined && draft.preferredReligionId !== null && draft.preferredReligionId !== '' ? Number(draft.preferredReligionId) : null,
    communityId: draft.preferredCommunityId !== undefined && draft.preferredCommunityId !== null && draft.preferredCommunityId !== '' ? Number(draft.preferredCommunityId) : null,
    motherTongueId: null,
    educationId: draft.educationPreferenceId !== undefined && draft.educationPreferenceId !== null && draft.educationPreferenceId !== '' ? Number(draft.educationPreferenceId) : null,
    occupationId: draft.preferredOccupationId !== undefined && draft.preferredOccupationId !== null && draft.preferredOccupationId !== '' ? Number(draft.preferredOccupationId) : null,
    incomeId: null,
    countryId: null,
    stateId: null,
    districtId: null,
    preferredDescription: [
      preferredProfession ? `Profession: ${preferredProfession}` : null,
      preferredLocation ? `Location: ${preferredLocation}` : null,
      lookingForGender ? `Looking for: ${lookingForGender}` : null,
    ].filter(Boolean).join(' | ') || null,
  }
}

export function RegistrationPreferencesPage() {
  const navigate = useNavigate()
  const registrationDraft = getRegistrationDraft() ?? {}
  const [formData, setFormData] = useState(() => ({
    ...sanitizePreferenceDraft(getRegistrationDraft()),
    gender: registrationDraft.gender ?? session.getGenderId(),
  }))
  const [masterData, setMasterData] = useState({ religions: [], educations: [], maritalStatuses: [], communities: [], districts: [] })
  const resolvedLookingForGender = resolveLookingForGender(formData.gender ?? registrationDraft?.gender ?? session.getGenderId())

  useEffect(() => {
    const loadMasters = async () => {
      try {
        const [religions, educations, maritalStatuses] = await Promise.all([
          api.getMasterReligion(),
          api.getMasterEducation(),
          api.getMasterMaritalStatus(),
        ])

        const religionList = religions?.data ?? religions ?? []
        setMasterData({
          religions: religionList,
          educations: educations?.data ?? educations ?? [],
          maritalStatuses: maritalStatuses?.data ?? maritalStatuses ?? [],
          communities: [],
          districts: [],
        })

        // If religion already selected (e.g. from draft), load communities
        const savedReligionId = getRegistrationDraft()?.preferredReligionId
        if (savedReligionId) {
          const communities = await api.getMasterCommunity(savedReligionId)
          setMasterData(prev => ({ ...prev, communities: communities?.data ?? communities ?? [] }))
        }

        const districts = await api.getMasterDistricts()
        setMasterData(prev => ({ ...prev, districts: districts?.data ?? districts ?? [] }))
      } catch (error) {
        console.error('Failed to load preference master data:', error)
        setMasterData({ religions: [], educations: [], maritalStatuses: [], communities: [], districts: [] })
      }
    }

    loadMasters()
  }, [])

  const handleReligionChange = async (religionId) => {
    setFormData(prev => ({ ...prev, preferredReligionId: religionId, preferredCommunityId: '' }))
    setMasterData(prev => ({ ...prev, communities: [] }))
    if (!religionId) return
    try {
      const communities = await api.getMasterCommunity(religionId)
      setMasterData(prev => ({ ...prev, communities: communities?.data ?? communities ?? [] }))
    } catch (e) {
      console.error('Failed to load communities:', e)
    }
  }

  useEffect(() => {
    saveRegistrationDraft({ ...getRegistrationDraft(), ...formData }, 'preferences')
  }, [formData])

  const handleBack = () => navigate(`/register/${getPreviousRegistrationStep('preferences') ?? 'family'}`, { replace: true })

  const handleSubmit = async (data) => {
    const merged = {
      ...getRegistrationDraft(),
      ...sanitizePreferenceDraft({ ...formData, ...data }),
      gender: formData.gender ?? registrationDraft?.gender ?? session.getGenderId(),
      lookingForGender: resolvedLookingForGender,
    }
    setFormData(merged)
    saveRegistrationDraft(merged, 'preferences')

    try {
      const userId = session.getUserId()
      if (!userId) {
        throw new Error('User session not found. Please complete registration again.')
      }

      await api.savePreference(buildPreferencePayload(merged, userId))

      const next = getNextRegistrationStep('preferences')
      navigate(`/register/${next ?? 'photos'}`, { replace: true })
    } catch (error) {
      console.error('Preference save failed:', error)
      alert(error?.message || 'Unable to save preferences. Please try again.')
    }
  }

  return (
    <RegistrationShell
      currentStep="preferences"
      title="Partner Preferences"
      subtitle="Set the kind of connection you want to attract."
      steps={STEPS}
      onStepChange={(step) => navigate(step === 'basic' ? '/register' : `/register/${step}`, { replace: true })}
    >
      <PartnerPreferencesStep
        initialData={formData}
        onSubmit={handleSubmit}
        onBack={handleBack}
        masterData={masterData}
        onReligionChange={handleReligionChange}
        userGender={formData.gender ?? registrationDraft?.gender ?? session.getGenderId()}
        lookingForGender={resolvedLookingForGender}
      />
    </RegistrationShell>
  )
}
