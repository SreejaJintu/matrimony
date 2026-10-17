import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { RegistrationShell } from '../../components/forms/RegistrationShell'
import { BasicDetailsStep } from '../../components/forms/BasicDetailsStep'
import { AboutYouStep } from '../../components/forms/AboutYouStep'
import { FamilyDetailsStep } from '../../components/forms/FamilyDetailsStep'
import { PartnerPreferencesStep } from '../../components/forms/PartnerPreferencesStep'
import { UploadPhotosStep } from '../../components/forms/UploadPhotosStep'
import { api } from '../../services/api'
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

export default function AdminProfileEdit() {
  const navigate = useNavigate()
  const location = useLocation()
  const { userId } = useParams()
  const [formData, setFormData] = useState({})
  const [currentStep, setCurrentStep] = useState('basic')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [masterData, setMasterData] = useState({})
  const [communityOptions, setCommunityOptions] = useState([])
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

  useEffect(() => {
    if (!userId) {
      navigate('/admin/profiles', { replace: true })
      return
    }

    // Attempt to set step from url hash or query if needed, default to basic
    const hash = location.hash.replace('#', '')
    if (COMPLETION_STEPS.some(s => s.id === hash)) {
      setCurrentStep(hash)
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
          api.getMasterFamilyValue(), api.getMasterIncome(),
          api.getMasterBirthStar(),
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
        setError("Failed to load necessary data.");
      }
    }

    async function loadProfileData() {
      try {
        setLoadingProfile(true)
        const [profileResult, accountResult] = await Promise.allSettled([
          api.getProfile(userId, userId),
          api.getAccountBasics(userId),
        ]);
        if (profileResult.status === 'rejected') {
          throw profileResult.reason;
        }

        const response = profileResult.value;
        const accountResponse = accountResult.status === 'fulfilled' ? accountResult.value : null;
        if (accountResult.status === 'rejected') {
          console.error("Error fetching account contact details:", accountResult.reason);
          setError("Unable to load phone and email details.");
        }
        const profile = response?.data ?? response?.Data ?? response;
        const account = accountResponse?.data ?? accountResponse?.Data ?? accountResponse;
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
            preferredProfession: profile.preferredOccupation || '',
            preferredMaritalStatusId: profile.preferredMaritalStatusId || '',
            locationPreference: profile.preferredLocation || profile.locationPreference || '',
            preferredDescription: profile.preferredDescription || '',
            photos: profile.photos || [],
            profilePhotoIndex: Number.isInteger(profile.profilePhotoIndex) ? profile.profilePhotoIndex : 
               Math.max((profile.photos || []).findIndex(p => p.isProfilePhoto || p.IsProfilePhoto || p.isPrimary), 0),
          };
          setFormData(hydratedDraft);
          if (profile.religionId) {
            fetchCommunityOptions(profile.religionId);
          }
        }
      } catch (err) {
        console.error("Error fetching profile details:", err);
        setError("Failed to load user profile details.");
      } finally {
        setLoadingProfile(false)
      }
    }

    loadMasterData();
    loadProfileData();
  }, [userId, location.hash, navigate, fetchCommunityOptions])

  const handleStepChange = (stepId) => {
    setCurrentStep(stepId);
    navigate(`/admin/profiles/${userId}/edit#${stepId}`);
  }

  const handleSaveAndContinue = async (data) => {
    const mergedData = { ...formData, ...data };
    setFormData(mergedData);

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
          apiCall = api.savePreference(sanitizePayload({ userId, ...mergedData }));
          break;
        case 'photos':
          apiCall = (async () => {
            const newPhotos = (mergedData.photos || []).filter((photo) => photo.isNew);
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

      if (nextStep) {
        handleStepChange(nextStep.id);
      } else {
        navigate(`/admin/profiles/${userId}`, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Unable to save details.');
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const handleFinalSave = async (data) => {
      // Just save and return to profile
      await handleSaveAndContinue(data);
      navigate(`/admin/profiles/${userId}`, { replace: true });
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
        return <PartnerPreferencesStep {...commonProps} onReligionChange={fetchCommunityOptions} />;
      case 'photos':
        return <UploadPhotosStep {...commonProps} onSubmit={() => navigate(`/admin/profiles/${userId}`)} />;
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
          error={error}
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
