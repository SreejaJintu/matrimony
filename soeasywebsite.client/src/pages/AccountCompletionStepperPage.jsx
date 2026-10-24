import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { RegistrationShell } from '../components/forms/RegistrationShell'
import { AboutYouStep } from '../components/forms/AboutYouStep'
import { FamilyDetailsStep } from '../components/forms/FamilyDetailsStep'
import { PartnerPreferencesStep } from '../components/forms/PartnerPreferencesStep'
import { UploadPhotosStep } from '../components/forms/UploadPhotosStep'
import { api, session } from '../services/api'
import { assertApiSuccess, getFriendlyErrorMessage } from '../services/apiErrors'
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [masterData, setMasterData] = useState({})
  const [communityOptions, setCommunityOptions] = useState([])

  const fetchCommunityOptions = useCallback(async (religionId) => {
    if (!religionId) {
      setCommunityOptions([])
      return
    }
    try {
      const res = await api.getMasterCommunity(religionId)
      setCommunityOptions(res?.data ?? res?.Data ?? [])
    } catch (err) {
      console.error("Error fetching communities:", err)
      setCommunityOptions([])
    }
  }, [])

  const userId = session.getUserId()

  const handleRemoveSavedPhoto = async (photo) => {
    const photoId = Number(photo.photoId ?? photo.PhotoId ?? photo.id)
    if (!Number.isInteger(photoId) || photoId <= 0) {
      throw new Error('Could not identify the saved photo to remove.');
    }

    const response = await api.deleteMyPhoto(photoId);
    assertApiSuccess(response, 'Unable to remove this photo. Please try again.');
    setFormData((current) => {
      const wasPrimary = Boolean(photo.isProfilePhoto || photo.IsProfilePhoto || photo.isPrimary);
      const remainingPhotos = (current.photos || []).filter((item) =>
        String(item.photoId ?? item.PhotoId ?? item.id) !== String(photoId)
      );
      const photos = wasPrimary
        ? remainingPhotos.map((item, index) => ({ ...item, isProfilePhoto: index === 0, IsProfilePhoto: index === 0 }))
        : remainingPhotos;
      const updated = {
        ...current,
        photos,
        profilePhotoIndex: Math.max(photos.findIndex((item) => item.isProfilePhoto || item.IsProfilePhoto), 0),
      };
      saveRegistrationDraft(updated, currentStep);
      return updated;
    });
    return response;
  };
  const resolvedLookingForGender = (() => {
    const genderId = session.getGenderId()
    if (genderId === 2) return 'Groom'
    if (genderId === 1) return 'Bride'

    const gender = String(formData.gender ?? '').toLowerCase()
    if (gender === 'female') return 'Groom'
    if (gender === 'male') return 'Bride'
    return 'Partner'
  })()

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
          familyTypesRes, familyStatusesRes, familyValuesRes, incomesRes, birthStarsRes
        ] = await Promise.allSettled([
          api.getMasterHeight(), api.getMasterReligion(), api.getMasterCountry(),
          api.getMasterEducation(), api.getMasterMaritalStatus(), api.getMasterMotherTongue(),
          api.getMasterOccupation(), api.getMasterFamilyType(), api.getMasterFamilyStatus(),
          api.getMasterFamilyValue(), api.getMasterIncome(), api.getMasterBirthStar(),
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
          birthStars: extractData(birthStarsRes),
        });
      } catch (err) {
        console.error("Error loading master data:", err);
        toast.error('Failed to load necessary data. Please try again.')
      }
    }

    async function loadProfileData() {
      try {
        const [response, photosResponse] = await Promise.all([
          api.getProfile(userId, userId),
          api.getMyPhotos(),
        ]);
        const profile = response?.data ?? response?.Data ?? response;
        if (profile) {
          const savedPhotos = photosResponse?.data ?? photosResponse?.Data ?? [];
          const photos = savedPhotos.length
            ? savedPhotos
            : (profile.imageUrl || profile.ImageUrl)
              ? [{ photoUrl: profile.imageUrl || profile.ImageUrl, isProfilePhoto: true }]
              : [];
          const hydratedDraft = {
            ...getRegistrationDraft(), // Keep existing draft data
            // Overwrite with fresh data from profile where available
            fullName: profile.fullName || '',
            gender: profile.genderId === 2 ? 'Female' : 'Male',
            dob: profile.dateOfBirth ? String(profile.dateOfBirth).slice(0, 10) : '',
            mobileNumber: pickFirstValue(profile, ['mobileNumber', 'mobileNo']) || '',
            email: pickFirstValue(profile, ['email', 'emailId']) || '',
            heightId: profile.heightId || '',
            weight: profile.weight ?? '',
            maritalStatusId: profile.maritalStatusId || '',
            occupationId: profile.occupationId || '',
            occupation: profile.designation || profile.occupation || '',
            company: profile.companyName || '',
            educationId: profile.educationId || '',
            annualIncomeId: profile.incomeId || '',
            city: profile.city || profile.address || '',
            religionId: profile.religionId || '',
            motherTongueId: profile.motherTongueId || '',
            communityId: profile.communityId || '',
            birthStarId: profile.birthStarId || '',
            countryId: profile.countryId || '',
            stateId: profile.stateId || '',
            districtId: profile.districtId || '',
            pincode: profile.pincode || '',
            aboutMe: profile.aboutMe || '',
            fatherName: profile.fatherName || '',
            motherName: profile.motherName || '',
            familyTypeId: profile.familyTypeId || '',
            familyStatusId: profile.familyStatusId || '',
            familyValueId: profile.familyValueId || '',
            nativePlace: profile.nativePlace || '',
            brothers: profile.brothers ?? '',
            sisters: profile.sisters ?? '',
            marriedBrothers: profile.marriedBrothers ?? '',
            marriedSisters: profile.marriedSisters ?? '',
            aboutFamily: profile.familyAbout || '',
            photos,
            profilePhotoIndex: Math.max(photos.findIndex((photo) => photo.isProfilePhoto || photo.IsProfilePhoto), 0),
          };
          setFormData(hydratedDraft);
          saveRegistrationDraft(hydratedDraft, currentStep);
          if (profile.religionId) {
            fetchCommunityOptions(profile.religionId);
          }
        }
      } catch (err) {
        console.error("Error fetching profile details:", err);
        toast.error('Failed to load your profile details.')
      }
    }

    loadMasterData();
    loadProfileData();
  }, [userId, location.pathname, navigate, currentStep, fetchCommunityOptions])

  const handleStepChange = (stepId) => {
    setCurrentStep(stepId);
    navigate(`/account-completion/${stepId}`);
  }

  const handleSaveAndContinue = async (data) => {
    const mergedData = { ...formData, ...data };
    setFormData(mergedData);
    saveRegistrationDraft(mergedData, currentStep);

    setIsSubmitting(true);

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
        case 'about': {
          // Explicitly map dob to dateOfBirth to match backend expectation
          const aboutPayload = { ...data, dateOfBirth: data.dob };
          delete aboutPayload.dob; // Clean up the old key
          const profilePayload = sanitizePayload({ userId, ...aboutPayload });
          console.log('[AccountCompletionStepperPage] saveProfile payload:', profilePayload);
          apiCall = api.saveProfile(profilePayload);
          break;
        }
        case 'family':
          apiCall = api.saveFamily(sanitizePayload({ userId, ...data }));
          break;
        case 'preferences':
          apiCall = api.savePreference(sanitizePayload({ userId, ...data }));
          break;
        case 'photos': {
          apiCall = (async () => {
            const newPhotos = (mergedData.photos || []).filter((photo) => photo.isNew);
            for (const [index, photo] of newPhotos.entries()) {
              const photoIndex = mergedData.photos.indexOf(photo);
              const response = await api.savePhoto({
                userId,
                photoUrl: photo.url,
                isProfilePhoto: photoIndex === (mergedData.profilePhotoIndex ?? 0),
                displayOrder: photoIndex + 1,
                isApproved: true,
                isActive: true,
              });
              assertApiSuccess(response, `Unable to save photo ${index + 1}. Please try again.`);
            }
            return { success: true };
          })();
          break;
        }
        default:
          throw new Error('Invalid completion step');
      }

      const result = await apiCall;
      assertApiSuccess(result, 'Unable to save details. Please try again.');
      if (result?.success === false || result?.Success === false) {
        throw new Error(result?.message || result?.Message || 'Unable to save details. Please try again.');
      }

      if (nextStep) {
        navigate(`/account-completion/${nextStep.id}`);
      } else {
        clearRegistrationDraft();
        navigate('/profile', { replace: true });
      }
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Unable to save details. Please try again.'))
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
      userGender: formData.gender,
      lookingForGender: resolvedLookingForGender,
    };

    switch (currentStep) {
      case 'about':
        return <AboutYouStep {...commonProps} onReligionChange={fetchCommunityOptions} />;
      case 'family':
        return <FamilyDetailsStep {...commonProps} />;
      case 'preferences':
        return <PartnerPreferencesStep {...commonProps} onReligionChange={fetchCommunityOptions} />;
      case 'photos':
        return <UploadPhotosStep {...commonProps} onRemovePhoto={handleRemoveSavedPhoto} />;
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
      onStepChange={handleStepChange}
      mode="create"
    >
      {getStepComponent()}
    </RegistrationShell>
  )
}
