import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { RegistrationShell } from '../components/forms/RegistrationShell'
import { AboutYouStep } from '../components/forms/AboutYouStep'
import { FamilyDetailsStep } from '../components/forms/FamilyDetailsStep'
import { PartnerPreferencesStep } from '../components/forms/PartnerPreferencesStep'
import { UploadPhotosStep } from '../components/forms/UploadPhotosStep'
import { api, session } from '../services/api'
import { getRegistrationDraft, saveRegistrationDraft, clearRegistrationDraft } from '../services/registrationDraft'
import { Heart, Users, Target, Camera } from 'lucide-react'

const COMPLETION_STEPS = [
  { id: 'about', label: 'About You', icon: Heart },
  { id: 'family', label: 'Family Details', icon: Users },
  { id: 'preferences', label: 'Partner Preferences', icon: Target },
  { id: 'photos', label: 'Upload Photos', icon: Camera },
]

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

export function AccountCompletionStepperPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState(() => getRegistrationDraft() ?? {})
  const [currentStep, setCurrentStep] = useState('about')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [masterData, setMasterData] = useState({})
  const [communityOptions, setCommunityOptions] = useState([])

  const userId = session.getUserId()

  useEffect(() => {
    if (!userId) {
      navigate('/login', { replace: true })
      return
    }

    const pathParts = location.pathname.split('/')
    const stepFromUrl = pathParts[pathParts.length - 1]
    if (COMPLETION_STEPS.some(s => s.id === stepFromUrl)) {
      setCurrentStep(stepFromUrl)
    }

    async function loadMasterData() {
      try {
        const [
          heightsRes, religionsRes, countriesRes, educationsRes,
          maritalStatusesRes, motherTonguesRes, occupationsRes,
          familyTypesRes, familyStatusesRes, familyValuesRes, incomesRes
        ] = await Promise.allSettled([
          api.getMasterHeight(), api.getMasterReligion(), api.getMasterCountry(),
          api.getMasterEducation(), api.getMasterMaritalStatus(), api.getMasterMotherTongue(),
          api.getMasterOccupation(), api.getMasterFamilyType(), api.getMasterFamilyStatus(),
          api.getMasterFamilyValue(), api.getMasterIncome(),
        ]);

        const extractData = (res) => res.status === 'fulfilled' ? (res.value?.data ?? res.value?.Data ?? []) : [];

        setMasterData({
          heights: extractData(heightsRes),
          religions: extractData(religionsRes),
          countries: extractData(countriesRes),
          educations: extractData(educationsRes),
          maritalStatuses: extractData(maritalStatusesRes),
          motherTongues: extractData(motherTonguesRes),
          occupations: extractData(occupationsRes),
          familyTypes: extractData(familyTypesRes),
          familyStatuses: extractData(familyStatusesRes),
          familyValues: extractData(familyValuesRes),
          incomes: extractData(incomesRes),
        });
      } catch (err) {
        console.error("Error loading master data:", err);
        setError("Failed to load necessary data. Please try again.");
      }
    }

    async function loadProfileData() {
      try {
        const response = await api.getProfile(userId);
        const profile = response?.data ?? response?.Data ?? response;
        if (profile) {
          const hydratedDraft = {
            ...getRegistrationDraft(), // Keep existing draft data
            // Overwrite with fresh data from profile where available
            fullName: profile.fullName || '',
            gender: profile.genderId === 2 ? 'Female' : 'Male',
            dob: profile.dateOfBirth ? String(profile.dateOfBirth).slice(0, 10) : '',
            mobileNumber: pickFirstValue(profile, ['mobileNumber', 'mobileNo']) || '',
            email: pickFirstValue(profile, ['email', 'emailId']) || '',
            heightId: profile.heightId || '',
            maritalStatusId: profile.maritalStatusId || '',
            occupationId: profile.occupationId || '',
            educationId: profile.educationId || '',
            annualIncomeId: profile.incomeId || '',
            city: profile.city || '',
            religionId: profile.religionId || '',
            motherTongueId: profile.motherTongueId || '',
            communityId: profile.communityId || '',
            countryId: profile.countryId || '',
            aboutMe: profile.aboutMe || '',
            fatherName: profile.fatherName || '',
            motherName: profile.motherName || '',
            familyTypeId: profile.familyTypeId || '',
            photos: profile.photos || [],
          };
          setFormData(hydratedDraft);
          saveRegistrationDraft(hydratedDraft, currentStep);
          if (profile.religionId) {
            fetchCommunityOptions(profile.religionId);
          }
        }
      } catch (err) {
        console.error("Error fetching profile details:", err);
        setError("Failed to load your profile details.");
      }
    }

    loadMasterData();
    loadProfileData();
  }, [userId, location.pathname, navigate])

  const fetchCommunityOptions = useCallback(async (religionId) => {
    if (!religionId) {
      setCommunityOptions([]);
      return;
    }
    try {
      const res = await api.getMasterCommunity(religionId);
      setCommunityOptions(res?.data ?? res?.Data ?? []);
    } catch (err) {
      console.error("Error fetching communities:", err);
      setCommunityOptions([]);
    }
  }, []);

  const handleStepChange = (stepId) => {
    setCurrentStep(stepId);
    navigate(`/account-completion/${stepId}`);
  }

  const handleSaveAndContinue = async (data) => {
    const mergedData = { ...formData, ...data };
    setFormData(mergedData);
    saveRegistrationDraft(mergedData, currentStep);

    setIsSubmitting(true);
    setError('');

    try {
      let apiCall;
      const currentIndex = COMPLETION_STEPS.findIndex(s => s.id === currentStep);
      const nextStep = COMPLETION_STEPS[currentIndex + 1];

      const sanitizePayload = (payload) => {
        const sanitized = { ...payload };
        for (const key in sanitized) {
          if (key.endsWith('Id') && sanitized[key] === '') {
            sanitized[key] = null;
          }
        }
        return sanitized;
      };

      switch (currentStep) {
        case 'about':
          // Explicitly map dob to dateOfBirth to match backend expectation
          const aboutPayload = { ...data, dateOfBirth: data.dob };
          delete aboutPayload.dob; // Clean up the old key
          apiCall = api.saveProfile(sanitizePayload({ userId, ...aboutPayload }));
          break;
        case 'family':
          apiCall = api.saveFamily(sanitizePayload({ userId, ...data }));
          break;
        case 'preferences':
          apiCall = api.savePreference(sanitizePayload({ userId, ...data }));
          break;
        case 'photos':
          // Photo uploads are handled inside the component, this is just for metadata
          apiCall = Promise.resolve({ success: true });
          break;
        default:
          throw new Error('Invalid completion step');
      }

      const result = await apiCall;
      if (!result?.success) {
        throw new Error(result?.message || 'Failed to save details.');
      }

      if (nextStep) {
        navigate(`/account-completion/${nextStep.id}`);
      } else {
        clearRegistrationDraft();
        navigate('/profile', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Unable to save details.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleBack = () => {
    const currentIndex = COMPLETION_STEPS.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      navigate(`/account-completion/${COMPLETION_STEPS[currentIndex - 1].id}`);
    } else {
      // Go back to the basic details page
      navigate('/account-completion');
    }
  }

  const getStepComponent = () => {
    const commonProps = {
      initialData: formData,
      onSubmit: handleSaveAndContinue,
      onBack: handleBack,
      masterData: { ...masterData, communities: communityOptions },
      isSubmitting,
      mode: 'create', // Use 'create' mode UI for this flow
    };

    switch (currentStep) {
      case 'about':
        return <AboutYouStep {...commonProps} onReligionChange={fetchCommunityOptions} />;
      case 'family':
        return <FamilyDetailsStep {...commonProps} />;
      case 'preferences':
        return <PartnerPreferencesStep {...commonProps} onReligionChange={fetchCommunityOptions} />;
      case 'photos':
        return <UploadPhotosStep {...commonProps} />;
      default:
        return <div>Loading step...</div>;
    }
  }

  return (
    <RegistrationShell
      currentStep={currentStep}
      title="Complete Your Profile"
      subtitle="Fill in the remaining details to get better matches."
      steps={COMPLETION_STEPS}
      error={error}
      onStepChange={handleStepChange}
      mode="create"
    >
      {getStepComponent()}
    </RegistrationShell>
  )
}