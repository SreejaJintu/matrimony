import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { RegistrationShell } from '../../components/forms/RegistrationShell'
import { BasicDetailsStep } from '../../components/forms/BasicDetailsStep'
import { AboutYouStep } from '../../components/forms/AboutYouStep'
import { FamilyDetailsStep } from '../../components/forms/FamilyDetailsStep'
import { PartnerPreferencesStep } from '../../components/forms/PartnerPreferencesStep'
import { UploadPhotosStep } from '../../components/forms/UploadPhotosStep'
import { api } from '../../services/api'
import { getFriendlyErrorMessage } from '../../services/apiErrors'
import adminProfileService from '../services/adminProfileService'
import { User, Heart, Users, Target, Camera } from 'lucide-react'

// Full registration steps for admin edit
const COMPLETION_STEPS = [
  { id: 'basic', label: 'Basic Details', icon: User },
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

const toNullableNumber = (value, label) => {
  if (value === undefined || value === null || value === '') return null

  const number = Number(value)
  if (!Number.isFinite(number)) {
    throw new Error(`Please enter a valid ${label}.`)
  }

  return number
}

const buildAboutPayload = (data, userId) => {
  let dateOfBirth = null
  if (data.dob) {
    const parsedDate = new Date(`${data.dob}T00:00:00`)
    if (Number.isNaN(parsedDate.getTime())) {
      throw new Error('Please enter a valid date of birth.')
    }
    dateOfBirth = parsedDate.toISOString()
  }

  return {
    userId: Number(userId),
    dateOfBirth,
    heightId: toNullableNumber(data.heightId, 'height'),
    weight: toNullableNumber(data.weight, 'weight'),
    maritalStatusId: toNullableNumber(data.maritalStatusId, 'marital status'),
    birthStarId: toNullableNumber(data.birthStarId, 'birth star'),
    motherTongueId: toNullableNumber(data.motherTongueId, 'mother tongue'),
    religionId: toNullableNumber(data.religionId, 'religion'),
    communityId: toNullableNumber(data.communityId, 'community'),
    educationId: toNullableNumber(data.educationId, 'education'),
    occupationId: toNullableNumber(data.occupationId, 'occupation'),
    companyName: data.company || null,
    designation: data.occupation || null,
    incomeId: toNullableNumber(data.annualIncomeId ?? data.incomeId, 'income'),
    countryId: toNullableNumber(data.countryId, 'country'),
    stateId: toNullableNumber(data.stateId, 'state'),
    districtId: toNullableNumber(data.districtId, 'district'),
    address: data.city || null,
    pincode: data.pincode || null,
    aboutMe: data.aboutMe || null,
  }
}

const buildPreferencePayload = (data, userId) => {
  const descriptionParts = [data.preferredProfession, data.locationPreference]
    .map((value) => typeof value === 'string' ? value.trim() : '')
    .filter(Boolean)

  return {
    userId: Number(userId),
    ageFrom: toNullableNumber(data.ageRangeMin, 'minimum preferred age'),
    ageTo: toNullableNumber(data.ageRangeMax, 'maximum preferred age'),
    heightFromId: toNullableNumber(data.preferredHeightFromId, 'minimum preferred height'),
    heightToId: toNullableNumber(data.preferredHeightToId, 'maximum preferred height'),
    maritalStatusId: toNullableNumber(data.preferredMaritalStatusId, 'preferred marital status'),
    religionId: toNullableNumber(data.preferredReligionId, 'preferred religion'),
    communityId: toNullableNumber(data.preferredCommunityId, 'preferred community'),
    motherTongueId: toNullableNumber(data.preferredMotherTongueId, 'preferred mother tongue'),
    educationId: toNullableNumber(data.educationPreferenceId, 'preferred education'),
    occupationId: toNullableNumber(data.preferredOccupationId, 'preferred occupation'),
    incomeId: toNullableNumber(data.preferredIncomeId, 'preferred income'),
    countryId: toNullableNumber(data.preferredCountryId, 'preferred country'),
    stateId: toNullableNumber(data.preferredStateId, 'preferred state'),
    districtId: toNullableNumber(data.preferredDistrictId, 'preferred district'),
    preferredDescription: descriptionParts.length
      ? descriptionParts.join(' | ')
      : data.preferredDescription || null,
  }
}

const getPhotoId = (photo) => photo?.photoId ?? photo?.PhotoId ?? photo?.id ?? null

export default function AdminProfileEdit() {
  const navigate = useNavigate()
  const location = useLocation()
  const { userId } = useParams()
  const [formData, setFormData] = useState({})
  const [currentStep, setCurrentStep] = useState(() => {
    const initialStep = location.hash.replace('#', '')
    return COMPLETION_STEPS.some((step) => step.id === initialStep) ? initialStep : 'basic'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [masterData, setMasterData] = useState({})
  const [communityOptions, setCommunityOptions] = useState([])
  const [preferredCommunityOptions, setPreferredCommunityOptions] = useState([])
  const [districtOptions, setDistrictOptions] = useState([])
  const [locationOptions, setLocationOptions] = useState([])
  const [loadingProfile, setLoadingProfile] = useState(true)
  
  const resolvedLookingForGender = (() => {
    const genderId = formData.gender === 'Female' ? 2 : formData.gender === 'Other' ? 3 : 1
    if (genderId === 2) return 'Groom'
    if (genderId === 1) return 'Bride'
    return 'Partner'
  })()

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

  const fetchPreferredCommunityOptions = useCallback(async (religionId) => {
    if (!religionId) {
      setPreferredCommunityOptions([])
      return
    }
    try {
      const res = await api.getMasterCommunity(religionId)
      setPreferredCommunityOptions(res?.data ?? res?.Data ?? [])
    } catch (err) {
      console.error('Error fetching preferred communities:', err)
      setPreferredCommunityOptions([])
    }
  }, [])

  const fetchLocationOptions = useCallback(async (districtId) => {
    if (!districtId) {
      setLocationOptions([])
      return
    }
    try {
      const res = await api.getMasterLocations(districtId)
      setLocationOptions(res?.data ?? res?.Data ?? [])
    } catch (err) {
      console.error('Error fetching preferred locations:', err)
      setLocationOptions([])
    }
  }, [])

  useEffect(() => {
    if (!userId) {
      navigate('/admin/profiles', { replace: true })
      return
    }

    async function loadMasterData() {
      try {
        const [
          heightsRes, religionsRes, countriesRes, educationsRes,
          maritalStatusesRes, motherTonguesRes, occupationsRes,
          familyTypesRes, familyStatusesRes, familyValuesRes, incomesRes, birthStarsRes, districtsRes
        ] = await Promise.allSettled([
          api.getMasterHeight(), api.getMasterReligion(), api.getMasterCountry(),
          api.getMasterEducation(), api.getMasterMaritalStatus(), api.getMasterMotherTongue(),
          api.getMasterOccupation(), api.getMasterFamilyType(), api.getMasterFamilyStatus(),
          api.getMasterFamilyValue(), api.getMasterIncome(),
          api.getMasterBirthStar(), api.getMasterDistricts(),
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
        setDistrictOptions(extractData(districtsRes))
      } catch (err) {
        console.error("Error loading master data:", err);
        toast.error('Failed to load necessary data.')
      }
    }

    async function loadProfileData() {
      try {
        setLoadingProfile(true)
        const [profileResult, accountResult, photosResult] = await Promise.allSettled([
          api.getProfile(userId, userId),
          api.getAccountBasics(userId),
          adminProfileService.getPhotos(userId),
        ]);
        if (profileResult.status === 'rejected') {
          throw profileResult.reason;
        }

        const response = profileResult.value;
        const accountResponse = accountResult.status === 'fulfilled' ? accountResult.value : null;
        const photosResponse = photosResult.status === 'fulfilled' ? photosResult.value : null;
        const loadWarnings = [];
        if (accountResult.status === 'rejected') {
          console.error("Error fetching account contact details:", accountResult.reason);
          loadWarnings.push("Unable to load phone and email details.");
        }
        if (photosResult.status === 'rejected') {
          console.error("Error fetching profile photos:", photosResult.reason);
          loadWarnings.push("Unable to load profile photos.");
        }
        if (loadWarnings.length) toast.error(loadWarnings.join(' '))
        const profile = response?.data ?? response?.Data ?? response;
        const account = accountResponse?.data ?? accountResponse?.Data ?? accountResponse;
        const photos = photosResponse?.data ?? photosResponse?.Data ?? [];
        if (profile) {
          const hydratedDraft = {
            fullName: profile.fullName || '',
            gender: profile.genderId === 2 ? 'Female' : profile.genderId === 3 ? 'Other' : 'Male',
            dob: profile.dateOfBirth ? String(profile.dateOfBirth).slice(0, 10) : '',
            mobileNumber: pickFirstValue(account, ['mobileNumber', 'mobileNo', 'phoneNumber', 'phone', 'contactNumber']) ||
              pickFirstValue(profile, ['mobileNumber', 'mobileNo', 'phoneNumber', 'phone', 'contactNumber']) || '',
            email: pickFirstValue(account, ['email', 'emailId', 'emailAddress', 'mail', 'userEmail']) ||
              pickFirstValue(profile, ['email', 'emailId', 'emailAddress', 'mail', 'userEmail']) || '',
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
            birthStarId: profile.birthStarId || '',
            motherTongueId: profile.motherTongueId || '',
            communityId: profile.communityId || '',
            countryId: profile.countryId || '',
            stateId: profile.stateId || '',
            districtId: profile.districtId || '',
            pincode: profile.pincode || '',
            aboutMe: profile.aboutMe || '',
            fatherName: profile.fatherName || '',
            fatherOccupationId: profile.fatherOccupationId || '',
            motherName: profile.motherName || '',
            motherOccupationId: profile.motherOccupationId || '',
            familyTypeId: profile.familyTypeId || '',
            familyStatusId: profile.familyStatusId || '',
            familyValueId: profile.familyValueId || '',
            nativePlace: profile.nativePlace || '',
            brothers: profile.brothers ?? '',
            sisters: profile.sisters ?? '',
            marriedBrothers: profile.marriedBrothers ?? '',
            marriedSisters: profile.marriedSisters ?? '',
            aboutFamily: profile.familyAbout || '',
            lookingForGender: profile.lookingForGender || (profile.genderId === 2 ? 'Male' : 'Female'),
            ageRangeMin: profile.ageFrom || 26,
            ageRangeMax: profile.ageTo || 32,
            preferredReligionId: profile.preferredReligionId || '',
            preferredCommunityId: profile.preferredCommunityId || '',
            educationPreferenceId: profile.preferredEducationId || profile.educationPreferenceId || '',
            preferredProfession: profile.preferredDescription || profile.preferredOccupation || '',
            preferredMaritalStatusId: profile.preferredMaritalStatusId || '',
            preferredDistrictId: profile.preferredDistrictId || '',
            preferredHeightFromId: profile.preferredHeightFromId || '',
            preferredHeightToId: profile.preferredHeightToId || '',
            preferredMotherTongueId: profile.preferredMotherTongueId || '',
            preferredOccupationId: profile.preferredOccupationId || '',
            preferredIncomeId: profile.preferredIncomeId || '',
            preferredCountryId: profile.preferredCountryId || '',
            preferredStateId: profile.preferredStateId || '',
            locationPreference: profile.preferredLocation || profile.locationPreference || '',
            preferredDescription: profile.preferredDescription || '',
            photos,
            profilePhotoIndex: Number.isInteger(profile.profilePhotoIndex)
              ? profile.profilePhotoIndex
              : Math.max(photos.findIndex((photo) =>
                photo.isProfilePhoto || photo.IsProfilePhoto || photo.isPrimary
              ), 0),
          };
          setFormData(hydratedDraft);
          if (profile.religionId) {
            fetchCommunityOptions(profile.religionId);
          }
          if (profile.preferredReligionId) fetchPreferredCommunityOptions(profile.preferredReligionId)
          if (profile.preferredDistrictId) fetchLocationOptions(profile.preferredDistrictId)
        }
      } catch (err) {
        console.error("Error fetching profile details:", err);
        toast.error('Failed to load user profile details.')
      } finally {
        setLoadingProfile(false)
      }
    }

    loadMasterData();
    loadProfileData();
  }, [userId, location.hash, navigate, fetchCommunityOptions, fetchPreferredCommunityOptions, fetchLocationOptions])

  const handleStepChange = (stepId) => {
    setCurrentStep(stepId);
    navigate(`/admin/profiles/${userId}/edit#${stepId}`);
  }

  const handleSaveAndContinue = async (data) => {
    const mergedData = { ...formData, ...data };
    setFormData(mergedData);

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
        case 'basic':
          // Update basic details
          apiCall = api.saveAccountBasics({
            userId,
            fullName: mergedData.fullName,
            mobileNumber: mergedData.mobileNumber,
            email: mergedData.email,
            genderId: mergedData.gender === 'Female' ? 2 : mergedData.gender === 'Other' ? 3 : 1,
          });
          break;
        case 'about':
          apiCall = api.saveProfile(buildAboutPayload(mergedData, userId));
          break;
        case 'family':
          apiCall = api.saveFamily(sanitizePayload({ userId, ...mergedData }));
          break;
        case 'preferences':
          apiCall = api.savePreference(buildPreferencePayload(mergedData, userId));
          break;
        case 'photos':
          apiCall = (async () => {
            const newPhotos = (mergedData.photos || []).filter((photo) => photo.isNew);
            const submittedExistingIds = new Set(
              (mergedData.photos || [])
                .filter((photo) => !photo.isNew)
                .map(getPhotoId)
                .filter((photoId) => photoId !== null)
                .map(String)
            )
            const removedExistingPhotos = (formData.photos || []).filter((photo) => {
              const photoId = getPhotoId(photo)
              return photoId !== null && !submittedExistingIds.has(String(photoId))
            })

            for (const [index, photo] of newPhotos.entries()) {
              const photoIndex = mergedData.photos.indexOf(photo);
              const response = await api.savePhoto({
                userId,
                photoUrl: photo.url,
                isProfilePhoto: photoIndex === (mergedData.profilePhotoIndex ?? 0),
                displayOrder: photoIndex + 1,
                isApproved: true, // admin edits are auto-approved
                isActive: true,
              });
              if (response?.success === false || response?.Success === false) {
                throw new Error(response.message || response.Message || `Unable to save photo ${index + 1}.`);
              }
            }

            for (const photo of removedExistingPhotos) {
              const response = await adminProfileService.deletePhoto(userId, getPhotoId(photo))
              if (response?.success === false || response?.Success === false) {
                throw new Error(response.message || response.Message || 'Unable to remove a profile photo.')
              }
            }

            const selectedPhoto = mergedData.photos?.[mergedData.profilePhotoIndex ?? 0]
            if (selectedPhoto && !selectedPhoto.isNew) {
              const selectedPhotoId = getPhotoId(selectedPhoto)
              const previousPrimary = (formData.photos || []).find((photo) =>
                photo.isProfilePhoto || photo.IsProfilePhoto || photo.isPrimary
              )
              if (selectedPhotoId && String(selectedPhotoId) !== String(getPhotoId(previousPrimary))) {
                const response = await adminProfileService.setProfilePhoto(userId, selectedPhotoId)
                if (response?.success === false || response?.Success === false) {
                  throw new Error(response.message || response.Message || 'Unable to update the profile photo.')
                }
              }
            }
            return { success: true };
          })();
          break;
        default:
          throw new Error('Invalid completion step');
      }

      const result = await apiCall;
      if (!result?.success) {
        throw new Error(result?.message || 'Failed to save details.');
      }

      toast.success(nextStep ? `${COMPLETION_STEPS[currentIndex].label} saved.` : 'Profile updated successfully.')
      if (nextStep) {
        handleStepChange(nextStep.id);
      } else {
        navigate(`/admin/profiles/${userId}`, { replace: true });
      }
      return true
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Unable to save profile details. Please try again.'))
      return false
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const handleFinalSave = async (data) => {
      // Just save and return to profile
      const saved = await handleSaveAndContinue(data)
      if (saved) navigate(`/admin/profiles/${userId}`, { replace: true });
  }

  const handleBack = () => {
    const currentIndex = COMPLETION_STEPS.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      handleStepChange(COMPLETION_STEPS[currentIndex - 1].id);
    } else {
      navigate(`/admin/profiles/${userId}`);
    }
  }

  const getStepComponent = () => {
    const commonProps = {
      initialData: formData,
      onSubmit: handleSaveAndContinue,
      onBack: handleBack,
      onSaveLater: handleFinalSave,
      masterData: { ...masterData, communities: communityOptions },
      isSubmitting,
      mode: 'edit',
      userGender: formData.gender,
      lookingForGender: resolvedLookingForGender,
      showPasswordField: false,
    };

    switch (currentStep) {
      case 'basic':
        return <BasicDetailsStep {...commonProps} onSubmit={(data) => handleSaveAndContinue(data)} />;
      case 'about':
        return <AboutYouStep {...commonProps} onReligionChange={fetchCommunityOptions} />;
      case 'family':
        return <FamilyDetailsStep {...commonProps} />;
      case 'preferences':
        return <PartnerPreferencesStep
          {...commonProps}
          masterData={{ ...commonProps.masterData, communities: preferredCommunityOptions, districts: districtOptions, locations: locationOptions }}
          onReligionChange={fetchPreferredCommunityOptions}
          onDistrictChange={fetchLocationOptions}
        />;
      case 'photos':
        return <UploadPhotosStep {...commonProps} />;
      default:
        return <div>Loading step...</div>;
    }
  }

  if (loadingProfile) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading user profile...</div>
  }

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
        <RegistrationShell
          currentStep={currentStep}
          title={`Edit Profile: ${formData.fullName || ''}`}
          subtitle="Modify member details using the registration flow."
          eyebrow="ADMIN EDIT MODE"
          steps={COMPLETION_STEPS}
          onStepChange={handleStepChange}
          mode="admin-edit"
          hideHeader={true}
          hideTrustStrip={true}
        >
          {getStepComponent()}
        </RegistrationShell>
    </div>
  )
}
