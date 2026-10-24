import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera } from 'lucide-react'
import toast from 'react-hot-toast'
import { UploadPhotosStep } from '../../components/forms/UploadPhotosStep'
import { RegistrationShell } from '../../components/forms/RegistrationShell'
import { api, session } from '../../services/api'
import { assertApiSuccess, getFriendlyErrorMessage } from '../../services/apiErrors'
import {
  clearRegistrationDraft,
  getPreviousRegistrationStep,
  getRegistrationDraft,
  saveRegistrationDraft,
} from '../../services/registrationDraft'

const STEPS = [
  { id: 'basic', label: 'Basic Details', icon: Camera },
  { id: 'about', label: 'About You', icon: Camera },
  { id: 'family', label: 'Family Details', icon: Camera },
  { id: 'preferences', label: 'Partner Preferences', icon: Camera },
  { id: 'photos', label: 'Upload Photos', icon: Camera },
]

export function RegistrationPhotosPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(() => ({
    ...(getRegistrationDraft() ?? {}),
    gender: getRegistrationDraft()?.gender,
  }))
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    saveRegistrationDraft({ ...getRegistrationDraft(), ...formData }, 'photos')
  }, [formData])

  const handleBack = () => navigate(`/register/${getPreviousRegistrationStep('photos') ?? 'preferences'}`, { replace: true })

  const handleSubmit = async (data) => {
    if (isSubmitting) return
    const merged = { ...formData, ...data }
    setFormData(merged)
    saveRegistrationDraft({ ...getRegistrationDraft(), ...merged }, 'photos')

    try {
      setIsSubmitting(true)
      const userId = session.getUserId()
      if (!userId) {
        throw new Error('User session not found. Please log in again.')
      }

      const photoList = Array.isArray(merged.photos) ? merged.photos : []
      if (!photoList.length) {
        throw new Error('Please upload at least one photo.')
      }

      const responses = await Promise.all(
        photoList.map((photo, index) =>
          api.savePhoto({
            userId,
            photoUrl: photo.url,
            isProfilePhoto: index === (merged.profilePhotoIndex ?? 0),
            displayOrder: index + 1,
            isApproved: true,
            isActive: true,
          }),
        ),
      )
      responses.forEach((response) => assertApiSuccess(response, 'Unable to save photos. Please try again.'))

      clearRegistrationDraft()
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Photo save failed:', error)
      toast.error(getFriendlyErrorMessage(error, 'Unable to save photos. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <RegistrationShell
      currentStep="photos"
      title="Upload Photos"
      subtitle="Add a few photos to help your profile stand out."
      steps={STEPS}
      onStepChange={(step) => navigate(step === 'basic' ? '/register' : `/register/${step}`, { replace: true })}
    >
      <UploadPhotosStep initialData={formData} onSubmit={handleSubmit} onBack={handleBack} isSubmitting={isSubmitting} />
    </RegistrationShell>
  )
}
