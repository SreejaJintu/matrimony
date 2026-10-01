import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Heart, Users, Target, Camera } from 'lucide-react'
import { BasicDetailsStep } from '../../components/forms/BasicDetailsStep'
import { AboutYouStep } from '../../components/forms/AboutYouStep'
import { FamilyDetailsStep } from '../../components/forms/FamilyDetailsStep'
import { PartnerPreferencesStep } from '../../components/forms/PartnerPreferencesStep'
import { UploadPhotosStep } from '../../components/forms/UploadPhotosStep'
import { api } from '../../services/api'
import '../components/broker.css'

const steps = [
  { id: 'basic', label: 'Basic Details', icon: User },
  { id: 'about', label: 'About', icon: Heart },
  { id: 'family', label: 'Family', icon: Users },
  { id: 'preferences', label: 'Preferences', icon: Target },
  { id: 'photos', label: 'Photos', icon: Camera },
]

const initialData = {
  fullName: '', gender: '', mobileNumber: '', email: '', password: '', countryCode: '+91',
  dob: '', weight: '', city: '', heightId: '', maritalStatusId: '', occupationId: '',
  occupation: '', educationId: '', fatherName: '', fatherOccupationId: '', motherName: '',
  motherOccupationId: '', familyTypeId: '', familyStatusId: '', familyValueId: '',
  nativePlace: '', brothers: 0, marriedBrothers: 0, sisters: 0, marriedSisters: 0,
  aboutFamily: '', ageRangeMin: '', ageRangeMax: '', preferredReligionId: '',
  preferredCommunityId: '', educationPreferenceId: '', preferredProfession: '',
  preferredMaritalStatusId: '', preferredDistrictId: '', photos: [], profilePhotoIndex: 0,
}

const unwrap = (response) => response?.data ?? response?.Data ?? []
const numberOrNull = (value) => value === '' || value === null || value === undefined ? null : Number(value)

export default function AddBrokerCandidatePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState('basic')
  const [form, setForm] = useState(initialData)
  const [masterData, setMasterData] = useState({})
  const [communities, setCommunities] = useState([])
  const [districts, setDistricts] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    Promise.allSettled([
      api.getMasterHeight(), api.getMasterReligion(), api.getMasterEducation(), api.getMasterMaritalStatus(),
      api.getMasterOccupation(), api.getMasterFamilyType(), api.getMasterFamilyStatus(), api.getMasterFamilyValue(),
      api.getMasterIncome(), api.getMasterMotherTongue(), api.getMasterCountry(), api.getMasterDistricts(),
    ]).then((results) => {
      if (!active) return
      const values = results.map((result) => result.status === 'fulfilled' ? unwrap(result.value) : [])
      setMasterData({ heights: values[0], religions: values[1], educations: values[2], maritalStatuses: values[3], occupations: values[4], familyTypes: values[5], familyStatuses: values[6], familyValues: values[7], incomes: values[8], motherTongues: values[9], countries: values[10] })
      setDistricts(values[11])
    })
    return () => { active = false }
  }, [])

  const stepIndex = steps.findIndex((item) => item.id === step)
  const selectedGender = useMemo(() => form.gender === 'Female' ? 'Female' : form.gender === 'Male' ? 'Male' : 'Other', [form.gender])

  const loadCommunities = async (religionId) => {
    if (!religionId) { setCommunities([]); return }
    try { setCommunities(unwrap(await api.getMasterCommunity(religionId))) } catch { setCommunities([]) }
  }

  const loadDistricts = async (stateId) => {
    if (!stateId) { setDistricts([]); return }
    try { setDistricts(unwrap(await api.getMasterDistricts())) } catch { setDistricts([]) }
  }

  const createCandidate = async (data) => {
    const { photos = [], profilePhotoIndex = 0, ...values } = data
    const candidatePhotos = photos.filter((photo) => photo.url && !photo.uploading).map((photo, index) => ({
      photoUrl: photo.url,
      isProfilePhoto: index === profilePhotoIndex,
      displayOrder: index + 1,
    }))
    const payload = {
      fullName: values.fullName.trim(), mobileNumber: values.mobileNumber.trim(), email: values.email.trim(),
      password: values.password, genderId: values.gender === 'Female' ? 2 : values.gender === 'Other' ? 3 : 1,
      profile: {
        dateOfBirth: values.dob || null, heightId: numberOrNull(values.heightId), weight: numberOrNull(values.weight),
        maritalStatusId: numberOrNull(values.maritalStatusId), motherTongueId: numberOrNull(values.motherTongueId),
        religionId: numberOrNull(values.religionId), communityId: numberOrNull(values.communityId),
        educationId: numberOrNull(values.educationId), occupationId: numberOrNull(values.occupationId),
        companyName: values.company || null, designation: values.occupation || null,
        incomeId: numberOrNull(values.annualIncomeId), countryId: numberOrNull(values.countryId),
        stateId: numberOrNull(values.stateId), districtId: numberOrNull(values.districtId),
        address: values.city || null, pincode: values.pincode || null, aboutMe: values.aboutMe || null,
      },
      family: {
        fatherName: values.fatherName || null, fatherOccupationId: numberOrNull(values.fatherOccupationId),
        motherName: values.motherName || null, motherOccupationId: numberOrNull(values.motherOccupationId),
        familyTypeId: numberOrNull(values.familyTypeId), familyStatusId: numberOrNull(values.familyStatusId),
        familyValueId: numberOrNull(values.familyValueId), nativePlace: values.nativePlace || null,
        brothers: Number(values.brothers || 0), marriedBrothers: Number(values.marriedBrothers || 0),
        sisters: Number(values.sisters || 0), marriedSisters: Number(values.marriedSisters || 0), aboutFamily: values.aboutFamily || null,
      },
      preference: {
        ageFrom: numberOrNull(values.ageRangeMin), ageTo: numberOrNull(values.ageRangeMax),
        maritalStatusId: numberOrNull(values.preferredMaritalStatusId), religionId: numberOrNull(values.preferredReligionId),
        communityId: numberOrNull(values.preferredCommunityId), educationId: numberOrNull(values.educationPreferenceId),
        occupationId: null, districtId: numberOrNull(values.preferredDistrictId),
        preferredDescription: values.preferredProfession || values.locationPreference || null,
      },
      photos: candidatePhotos,
    }
    setSaving(true)
    setError('')
    try {
      const response = await api.createBrokerCandidate(payload)
      if (response?.success !== true) throw new Error(response?.message || 'Unable to create candidate.')
      navigate('/broker/candidates', { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to create candidate.')
      setSaving(false)
    }
  }

  const submitStep = (data) => {
    const merged = { ...form, ...data }
    setForm(merged)
    if (step === 'photos') { createCandidate(merged); return }
    setStep(steps[stepIndex + 1].id)
    setError('')
  }

  const stepProps = { initialData: form, onSubmit: submitStep, onBack: () => setStep(steps[Math.max(stepIndex - 1, 0)].id), isSubmitting: saving, mode: 'create' }
  let formContent
  if (step === 'basic') formContent = <BasicDetailsStep {...stepProps} onSaveLater={() => navigate('/broker/candidates')} />
  if (step === 'about') formContent = <AboutYouStep {...stepProps} masterData={masterData} />
  if (step === 'family') formContent = <FamilyDetailsStep {...stepProps} masterData={masterData} />
  if (step === 'preferences') formContent = <PartnerPreferencesStep {...stepProps} masterData={{ ...masterData, communities, districts }} userGender={selectedGender} onReligionChange={loadCommunities} onDistrictChange={loadDistricts} />
  if (step === 'photos') formContent = <UploadPhotosStep {...stepProps} />

  return (
    <section className="broker-page">
      <header className="broker-page-heading"><div><p className="broker-eyebrow">BROKER WORKSPACE</p><h1>Register Candidate</h1><p>Create a member profile under your broker account.</p></div><Link to="/broker/candidates" className="broker-button secondary">Back to candidates</Link></header>
      <div className="broker-card broker-form-card">
        <div className="broker-stepper" aria-label="Candidate registration steps">{steps.map((item, index) => { const Icon = item.icon; return <button type="button" key={item.id} className={`broker-step ${item.id === step ? 'active' : index < stepIndex ? 'done' : ''}`} onClick={() => index <= stepIndex && setStep(item.id)} disabled={index > stepIndex}><span><Icon size={16} /></span><small>{item.label}</small></button> })}</div>
        {error && <div className="broker-alert" role="alert">{error}</div>}
        <div className="broker-form-body">{formContent}</div>
      </div>
    </section>
  )
}
