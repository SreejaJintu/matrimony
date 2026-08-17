import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users } from 'lucide-react'
import { FamilyDetailsStep } from '../../components/forms/FamilyDetailsStep'
import { RegistrationShell } from '../../components/forms/RegistrationShell'
import { api, session } from '../../services/api'
import {
  getNextRegistrationStep,
  getPreviousRegistrationStep,
  getRegistrationDraft,
  saveRegistrationDraft,
} from '../../services/registrationDraft'

const EMPTY_MASTER_DATA = { familyTypes: [], familyStatuses: [], occupations: [] }

const STEPS = [
  { id: 'basic', label: 'Basic Details', icon: Users },
  { id: 'about', label: 'About You', icon: Users },
  { id: 'family', label: 'Family Details', icon: Users },
  { id: 'preferences', label: 'Partner Preferences', icon: Users },
  { id: 'photos', label: 'Upload Photos', icon: Users },
]

const SUPPORTED_FIELDS = [
  'fatherName',
  'fatherOccupationId',
  'motherName',
  'motherOccupationId',
  'familyTypeId',
  'familyStatusId',
  'brothers',
  'sisters',
  'aboutFamily',
]

const sanitizeFamilyDraft = (draft = {}) => {
  const cleaned = {}
  for (const key of SUPPORTED_FIELDS) {
    if (draft[key] !== undefined && draft[key] !== null) {
      cleaned[key] = draft[key]
    }
  }
  return cleaned
}

const buildFamilyPayload = (draft, userId) => ({
  userId,
  fatherName: draft.fatherName || null,
  fatherOccupationId: draft.fatherOccupationId !== undefined && draft.fatherOccupationId !== null && draft.fatherOccupationId !== '' ? Number(draft.fatherOccupationId) : null,
  motherName: draft.motherName || null,
  motherOccupationId: draft.motherOccupationId !== undefined && draft.motherOccupationId !== null && draft.motherOccupationId !== '' ? Number(draft.motherOccupationId) : null,
  familyTypeId: draft.familyTypeId !== undefined && draft.familyTypeId !== null && draft.familyTypeId !== '' ? Number(draft.familyTypeId) : null,
  familyStatusId: draft.familyStatusId !== undefined && draft.familyStatusId !== null && draft.familyStatusId !== '' ? Number(draft.familyStatusId) : null,
  brothers: Number(draft.brothers || 0),
  marriedBrothers: 0,
  sisters: Number(draft.sisters || 0),
  marriedSisters: 0,
  aboutFamily: draft.aboutFamily || null,
})

export function RegistrationFamilyPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(() => sanitizeFamilyDraft(getRegistrationDraft()))
  const [masterData, setMasterData] = useState(EMPTY_MASTER_DATA)

  useEffect(() => {
    const loadMasters = async () => {
      try {
        const [familyTypes, familyStatuses, occupations] = await Promise.all([
          api.getMasterFamilyType(),
          api.getMasterFamilyStatus(),
          api.getMasterOccupation(),
        ])

        setMasterData({
          familyTypes: familyTypes?.data ?? familyTypes ?? [],
          familyStatuses: familyStatuses?.data ?? familyStatuses ?? [],
          occupations: occupations?.data ?? occupations ?? [],
        })
      } catch (error) {
        console.error('Failed to load family master data:', error)
        setMasterData(EMPTY_MASTER_DATA)
      }
    }

    loadMasters()
  }, [])

  useEffect(() => {
    saveRegistrationDraft(formData, 'family')
  }, [formData])

  const handleBack = () => navigate(`/register/${getPreviousRegistrationStep('family') ?? 'about'}`, { replace: true })

  const handleSubmit = async (data) => {
    const merged = sanitizeFamilyDraft({ ...formData, ...data })
    setFormData(merged)
    saveRegistrationDraft(merged, 'family')

    try {
      const userId = session.getUserId()
      if (!userId) {
        throw new Error('User session not found. Please complete registration again.')
      }

      await api.saveFamily(buildFamilyPayload(merged, userId))

      const next = getNextRegistrationStep('family')
      navigate(`/register/${next ?? 'preferences'}`, { replace: true })
    } catch (error) {
      console.error('Family save failed:', error)
      alert(error?.message || 'Unable to save family details. Please try again.')
    }
  }

  return (
    <RegistrationShell
      currentStep="family"
      title="Family Details"
      subtitle="Share the family context that matters to you."
      steps={STEPS}
      onStepChange={(step) => navigate(step === 'basic' ? '/register' : `/register/${step}`, { replace: true })}
    >
      <FamilyDetailsStep initialData={formData} onSubmit={handleSubmit} onBack={handleBack} masterData={masterData} />
    </RegistrationShell>
  )
}
