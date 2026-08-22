import { useEffect, useState, useCallback } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { AccountSidebar } from '../components/Layout/AccountSidebar'
import { BasicDetailsStep } from '../components/forms/BasicDetailsStep'
import { AboutYouStep } from '../components/forms/AboutYouStep'
import { FamilyDetailsStep } from '../components/forms/FamilyDetailsStep'
import { PartnerPreferencesStep } from '../components/forms/PartnerPreferencesStep'
import { UploadPhotosStep } from '../components/forms/UploadPhotosStep'
import { api, session } from '../services/api'
import { calculateProfileCompletion, COMPLETION_CHECKS } from '../services/profileCompletion'
import {
  Menu,
  ArrowLeft,
  Edit,
  User,
  Heart,
  Users,
  Target,
  Camera,
  BadgeCheck,
  MapPin,
} from 'lucide-react'
import './ProfilePage.css' // Reusing styles for consistency
import './ProfileEditPage.css'

const initialForm = {
  profileFor: 'Myself',
  fullName: '',
  gender: '',
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

const resolveMasterLabel = (list, value) => {
  if (!list || value === undefined || value === null || value === '') return ''

  const match = list.find((item) => {
    const keys = Object.keys(item || {})
    const idKey = keys.find((k) => k.toLowerCase().endsWith('id') || k.toLowerCase() === 'value') || 'id'
    return String(item?.[idKey]) === String(value)
  })

  if (!match) return value

  const keys = Object.keys(match)
  const labelKey =
    keys.find((k) => k.toLowerCase().endsWith('name') && !k.toLowerCase().endsWith('username')) ||
    keys.find((k) => ['text', 'label', 'title', 'name'].includes(k.toLowerCase()))

  return labelKey ? match[labelKey] : value
}

export function ProfileEditPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialForm)
  const [editingSection, setEditingSection] = useState(null);
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [masterData, setMasterData] = useState({})
  const [communityOptions, setCommunityOptions] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { pathname } = useLocation();

  useEffect(() => {
    const pathSegments = pathname.split('/');
    const initialEditSection = pathSegments[pathSegments.length - 1];
    const validSections = ['basic', 'about', 'family', 'preferences', 'photos'];
    if (validSections.includes(initialEditSection)) {
      setEditingSection(initialEditSection);
    }
  }, [pathname]);


  const userId = session.getUserId()

  useEffect(() => {
    if (!userId) {
      navigate('/login', { replace: true })
      return
    }

    // Load master data
    async function loadMasterData() {
      try {
        const [
          heightsRes, religionsRes, countriesRes, educationsRes,
          maritalStatusesRes, motherTonguesRes, occupationsRes,
          familyTypesRes, familyStatusesRes, familyValuesRes, incomesRes
        ] = await Promise.allSettled([
          api.getMasterHeight().catch(() => ({ data: [] })),
          api.getMasterReligion().catch(() => ({ data: [] })),
          api.getMasterCountry().catch(() => ({ data: [] })),
          api.getMasterEducation().catch(() => ({ data: [] })),
          api.getMasterMaritalStatus().catch(() => ({ data: [] })),
          api.getMasterMotherTongue().catch(() => ({ data: [] })),
          api.getMasterOccupation().catch(() => ({ data: [] })),
          api.getMasterFamilyType().catch(() => ({ data: [] })),
          api.getMasterFamilyStatus().catch(() => ({ data: [] })),
          api.getMasterFamilyValue().catch(() => ({ data: [] })),
          api.getMasterIncome().catch(() => ({ data: [] })),
        ]);

        const extractData = (res) => res.status === 'fulfilled' ? (res.value?.data ?? res.value?.Data ?? []) : [];

        setMasterData(prev => ({
          ...prev,
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
        }));
      } catch (err) {
        console.error("Error loading master data:", err);
        setError("Failed to load necessary data. Please try again.");
      }
    }

    loadMasterData();

    // Load user profile data
    async function loadProfileData() {
      try {
        const response = await api.getProfile(userId);
        const profile = response?.data ?? response?.Data ?? response;
        if (profile) {
          const profileImageUrl =
            profile.imageUrl ||
            profile.image ||
            profile.profilePhotoUrl ||
            profile.photos?.find((photo) => photo?.isProfilePhoto || photo?.isPrimary || photo?.isProfile)?.url ||
            profile.photos?.[0]?.url ||
            ''

          const hydratedDraft = {
            ...initialForm,
            fullName: profile.fullName || '',
            gender: profile.genderId === 2 ? 'Female' : profile.genderId === 3 ? 'Other' : profile.genderId === 1 ? 'Male' : '',
            mobileNumber: pickFirstValue(profile, ['mobileNumber', 'mobileNo', 'phoneNumber', 'phone', 'contactNumber', 'mobile']) || '',
            email: pickFirstValue(profile, ['email', 'emailId', 'emailAddress', 'mail', 'userEmail']) || '',
            heightId: profile.heightId || '',
            weight: profile.weight || '',
            maritalStatusId: profile.maritalStatusId || '',
            occupationId: profile.occupationId || '',
            occupation: profile.designation || profile.occupation || '',
            educationId: profile.educationId || '',
            annualIncomeId: profile.incomeId || '',
            city: profile.city || profile.district || profile.state || profile.country || '',
            religionId: profile.religionId || '',
            motherTongueId: profile.motherTongueId || '',
            communityId: profile.communityId || '',
            countryId: profile.countryId || '',
            fatherName: profile.fatherName || '',
            fatherOccupationId: profile.fatherOccupationId || '',
            motherName: profile.motherName || '',
            motherOccupationId: profile.motherOccupationId || '',
            familyTypeId: profile.familyTypeId || '',
            familyStatusId: profile.familyStatusId || '',
            familyValueId: profile.familyValueId || '',
            nativePlace: profile.nativePlace || '',
            brothers: profile.brothers ?? 0,
            sisters: profile.sisters ?? 0,
            aboutFamily: profile.familyAbout || '',
            aboutMe: profile.aboutMe || '',
            profileImageUrl,
            lookingForGender: profile.lookingForGender || 'Female',
            ageRangeMin: profile.ageFrom || 26,
            ageRangeMax: profile.ageTo || 32,
            preferredReligionId: profile.preferredReligionId || '',
            preferredCommunityId: profile.preferredCommunityId || '',
            educationPreferenceId: profile.educationPreferenceId || '',
            preferredProfession: profile.preferredOccupation || '',
            preferredMaritalStatusId: profile.preferredMaritalStatusId || '',
            locationPreference: profile.preferredLocation || '',
            photos: profile.photos || [],
            profilePhotoIndex: profile.profilePhotoIndex || 0,
          };
          setFormData(hydratedDraft);
          if (profile.religionId) {
            fetchCommunityOptions(profile.religionId);
          }
        }
      } catch (err) {
        console.error("Error fetching profile details:", err);
        setError("Failed to load your profile details.");
      } finally {
        setLoading(false);
      }
    }

    loadProfileData();
  }, [userId, navigate])

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

  const handleSave = async (section, data) => {
    const mergedData = { ...formData, ...data }
    setFormData(mergedData)

    try {
      setIsSubmitting(true)
      setError('')

      const sanitizePayload = (payload) => {
        const sanitized = { ...payload };
        for (const key in sanitized) {
          if (key.endsWith('Id') && (sanitized[key] === '' || sanitized[key] === 0)) {
            sanitized[key] = null;
          }
        }
        return sanitized;
      };

      let apiCall;
      switch (section) {
        case 'basic':
          apiCall = api.saveAccountBasics({
            userId,
            fullName: mergedData.fullName,
            mobileNumber: mergedData.mobileNumber,
            email: mergedData.email,
            genderId: mergedData.gender === 'Female' ? 2 : mergedData.gender === 'Other' ? 3 : 1,
          });
          break;
        case 'about':
          const profilePayload = {
            userId,
            fullName: mergedData.fullName, // Basic details are part of profile
            genderId: mergedData.gender === 'Female' ? 2 : mergedData.gender === 'Other' ? 3 : 1,
            heightId: mergedData.heightId,
            weight: Number(mergedData.weight),
            maritalStatusId: mergedData.maritalStatusId,
            occupationId: mergedData.occupationId,
            occupation: mergedData.occupation,
            educationId: mergedData.educationId,
            incomeId: mergedData.annualIncomeId,
            city: mergedData.city,
            religionId: mergedData.religionId,
            motherTongueId: mergedData.motherTongueId,
            communityId: mergedData.communityId,
            countryId: mergedData.countryId,
            aboutMe: mergedData.aboutMe,
          };
          apiCall = api.saveProfile(sanitizePayload(profilePayload));
          break;
        case 'family':
          apiCall = api.saveFamily({
            userId,
            fatherName: mergedData.fatherName,
            fatherOccupationId: mergedData.fatherOccupationId,
            motherName: mergedData.motherName,
            motherOccupationId: mergedData.motherOccupationId,
            familyTypeId: mergedData.familyTypeId,
            familyStatusId: mergedData.familyStatusId,
            familyValueId: mergedData.familyValueId,
            nativePlace: mergedData.nativePlace,
            brothers: Number(mergedData.brothers),
            sisters: Number(mergedData.sisters),
            aboutFamily: mergedData.aboutFamily,
          });
          break;
        case 'preferences':
          apiCall = api.savePreference({
            userId,
            lookingForGender: mergedData.lookingForGender,
            ageFrom: Number(mergedData.ageRangeMin),
            ageTo: Number(mergedData.ageRangeMax),
            preferredReligionId: mergedData.preferredReligionId,
            preferredCommunityId: mergedData.preferredCommunityId,
            preferredEducationId: mergedData.educationPreferenceId,
            preferredOccupation: mergedData.preferredProfession,
            preferredMaritalStatusId: mergedData.preferredMaritalStatusId,
            locationPreference: mergedData.locationPreference,
            preferredDescription: mergedData.preferredDescription,
          });
          break;
        case 'photos':
          // Photos are uploaded individually, this step just finalizes
          // For now, assume photos are already handled by UploadPhotosStep's internal logic
          // or a separate API call for saving photo metadata if needed.
          apiCall = Promise.resolve({ success: true }); // Placeholder
          break;
        default:
          apiCall = Promise.resolve({ success: true });
      }

      const result = await apiCall;
      if (!result?.success) {
        throw new Error(result?.message || 'Failed to save details.');
      }

      setEditingSection(null); // Exit edit mode on successful save
    } catch (err) {
      setError(err.message || 'Unable to save details.');
    } finally {
      setIsSubmitting(false)
    }
  }

  const profileId = `GS${String(userId).padStart(6, '0')}`;
  const location = formData.city || 'Not provided';
  const { percentage: completionPercentage } = calculateProfileCompletion(formData);
  const profileImageSrc =
    formData.profileImageUrl ||
    formData.photos?.find((photo) => photo?.isProfilePhoto || photo?.isPrimary || photo?.isProfile)?.url ||
    formData.photos?.[0]?.url ||
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80'
  const heightLabel = resolveMasterLabel(masterData.heights, formData.heightId)
  const maritalStatusLabel = resolveMasterLabel(masterData.maritalStatuses, formData.maritalStatusId)
  const occupationLabel = resolveMasterLabel(masterData.occupations, formData.occupationId)
  const educationLabel = resolveMasterLabel(masterData.educations, formData.educationId)
  const incomeLabel = resolveMasterLabel(masterData.incomes, formData.annualIncomeId)
  const familyTypeLabel = resolveMasterLabel(masterData.familyTypes, formData.familyTypeId)
  const familyStatusLabel = resolveMasterLabel(masterData.familyStatuses, formData.familyStatusId)
  const familyValueLabel = resolveMasterLabel(masterData.familyValues, formData.familyValueId)
  const religionLabel = resolveMasterLabel(masterData.religions, formData.religionId)
  const motherTongueLabel = resolveMasterLabel(masterData.motherTongues, formData.motherTongueId)
  const communityLabel = resolveMasterLabel(masterData.communities, formData.communityId)
  const countryLabel = resolveMasterLabel(masterData.countries, formData.countryId)
  
  const renderSection = (id, title, icon, content, formComponent) => (
    <article className="profile-edit-card">
      <div className="profile-edit-card-header">
        <div className="profile-edit-card-title">
          {icon}
          <h2>{title}</h2>
        </div>
        {editingSection !== id && (
          <button className="profile-edit-action-btn" onClick={() => setEditingSection(id)}>
            <Edit size={14} /> Edit
          </button>
        )}
      </div>
      <div className="profile-edit-card-body">
        {editingSection === id ? formComponent : content}
      </div>
    </article>
  );

  const commonFormProps = {
    initialData: formData,
    masterData: { ...masterData, communities: communityOptions },
    mode: 'edit',
    isSubmitting,
  };

  return (
    <main className="page profile-page account-profile-page">
      <div className="account-layout">
        <AccountSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <section className="owner-profile-content">
          <button type="button" className="profile-mobile-menu" onClick={() => setSidebarOpen(true)}>
            <Menu size={18} /> Menu
          </button>

          <div className="owner-profile-heading">
            <div>
              <h1>Edit Profile</h1>
              <p>Update your personal information, family details and partner preferences.</p>
            </div>
            <Link to="/profile" className="profile-edit-button">
              <ArrowLeft size={16} /> Back to Profile
            </Link>
          </div>

          {error && <div className="reg-error-banner">{error}</div>}

          {loading ? (
            <div className="pd-loading-container"><div className="pd-spinner"></div><p>Loading your profile...</p></div>
          ) : (
            <div className="profile-edit-dashboard">
              <article className="profile-edit-summary-card">
                <div className="profile-photo-shell">
                  <div className="owner-profile-photo-wrap">
                    <img src={profileImageSrc} alt={`${formData.fullName} portrait`} />
                  </div>
                </div>
                <div className="profile-summary-body">
                  <div className="profile-name-row">
                    <h2>{formData.fullName}</h2>
                    <BadgeCheck size={19} className="profile-verified-icon" />
                  </div>
                <div className="profile-meta-row">
                    <span><MapPin size={13} /> {location}</span>
                  </div>
                  <div className="profile-meta-row compact">
                    <span>ID: {profileId}</span>
                  </div>
                </div>
                <div className="profile-edit-summary-footer">
                  <div className="profile-completion-head">
                    <div className="completion-track"><span style={{ width: `${completionPercentage}%` }} /></div>
                    <strong>{completionPercentage}% Completed</strong>
                  </div>
                  <Link to="/profile-detail" className="profile-view-button">View Profile</Link>
                </div>
              </article>

              {renderSection(
                'basic',
                'Personal Information',
                <User size={18} />,
                <div className="pd-grid-2col">
                  <InfoRow label="Full Name" value={formData.fullName} />
                  <InfoRow label="Gender" value={formData.gender} />
                  <InfoRow label="Mobile Number" value={formData.mobileNumber} />
                  <InfoRow label="Email" value={formData.email} />
                </div>,
                <BasicDetailsStep
                  {...commonFormProps}
                  showPasswordField={false}
                  onSubmit={(data) => handleSave('basic', data)}
                  onSaveLater={() => setEditingSection(null)}
                />
              )}

              {renderSection(
                'about',
                'About You',
                <Heart size={18} />,
                <>
                <p className="profile-about-copy">{formData.aboutMe || 'Not provided.'}</p>
                <div className="pd-grid-2col">
                    <InfoRow label="Height" value={heightLabel} />
                    <InfoRow label="Weight" value={formData.weight ? `${formData.weight} kg` : ''} />
                    <InfoRow label="Marital Status" value={maritalStatusLabel} />
                    <InfoRow label="Occupation" value={occupationLabel || formData.occupation} />
                    <InfoRow label="Highest Qualification" value={educationLabel} />
                    <InfoRow label="Annual Income" value={incomeLabel} />
                    <InfoRow label="Current City" value={formData.city} />
                </div>
              </>,
                <AboutYouStep
                  {...commonFormProps}
                  onBack={() => setEditingSection(null)}
                  onSubmit={(data) => handleSave('about', data)}
                  onReligionChange={fetchCommunityOptions}
                />
              )}

              {renderSection(
                'family',
                'Family Details',
                <Users size={18} />,
                <>
                <p className="profile-about-copy">{formData.aboutFamily || 'Not provided.'}</p>
                <div className="pd-grid-2col">
                    <InfoRow label="Father's Name" value={formData.fatherName} />
                    <InfoRow label="Father's Occupation" value={formData.fatherOccupation || ''} />
                    <InfoRow label="Mother's Name" value={formData.motherName} />
                    <InfoRow label="Mother's Occupation" value={formData.motherOccupation || ''} />
                    <InfoRow label="Family Type" value={familyTypeLabel} />
                    <InfoRow label="No. of Brothers" value={formData.brothers} />
                    <InfoRow label="No. of Sisters" value={formData.sisters} />
                </div>
              </>,
                <FamilyDetailsStep
                  {...commonFormProps}
                  onBack={() => setEditingSection(null)}
                  onSubmit={(data) => handleSave('family', data)}
                />
              )}

              {renderSection(
                'preferences',
                'Partner Preferences',
                <Target size={18} />,
                <div className="pd-grid-2col">
                    <InfoRow label="Seeking" value={formData.lookingForGender} />
                    <InfoRow label="Age Range" value={`${formData.ageRangeMin} - ${formData.ageRangeMax} yrs`} />
                    <InfoRow label="Preferred Religion" value={resolveMasterLabel(masterData.religions, formData.preferredReligionId)} />
                    <InfoRow label="Preferred Education" value={resolveMasterLabel(masterData.educations, formData.educationPreferenceId)} />
                    <InfoRow label="Preferred Location" value={formData.locationPreference} />
                </div>,
                <PartnerPreferencesStep
                  {...commonFormProps}
                  onBack={() => setEditingSection(null)}
                  onSubmit={(data) => handleSave('preferences', data)}
                  onReligionChange={fetchCommunityOptions}
                />
              )}

              {renderSection(
                'photos',
                'Manage Photos',
                <Camera size={18} />,
                <p>Manage your profile photos.</p>,
                <UploadPhotosStep
                  {...commonFormProps}
                  onBack={() => setEditingSection(null)}
                  onSubmit={(data) => handleSave('photos', data)}
                />
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function InfoRow({ label, value }) {
  if (value === undefined || value === null || String(value).trim() === '') return null;
  return (
    <div className="profile-edit-info-row">
      <span className="profile-edit-info-label">{label}</span>
      <span className="profile-edit-info-value">{value}</span>
    </div>
  );
}
