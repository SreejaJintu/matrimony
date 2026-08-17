import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { api, session } from '../services/api';
import { Header } from '../components/Layout/Header';
import { 
  Heart, 
  ShieldCheck, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  User, 
  Users, 
  ArrowLeft, 
  Bookmark, 
  Check, 
  Sparkles,
  Lock,
  Edit3,
  Crown
} from 'lucide-react';
import './ProfileDetail.css';

export function ProfileDetail() {
  const { userId: paramUserId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentLoggedUserId = session.getUserId();
  const userId = paramUserId || searchParams.get('userId') || currentLoggedUserId;

  const [loading, setLoading] = useState(() => Boolean(userId));
  const [profile, setProfile] = useState(null);
  
  // Master data state
  const [masterData, setMasterData] = useState({
    religion: [], community: [], education: [], occupation: [],
    maritalStatus: [], district: [], state: [], country: [],
    motherTongue: [], height: [], familyType: [], familyStatus: [],
    familyValue: [], income: []
  });

  const [actionState, setActionState] = useState({ sending: false, sent: false });
  const [shortlistState, setShortlistState] = useState({ sending: false, sent: false });

  // Resolve ID -> Name robustly
  const resolveName = (list, id) => {
    if (!list || !id) return null;
    const item = list.find(x => {
      const keys = Object.keys(x);
      const idKey = keys.find(k => k.toLowerCase().endsWith('id') || k.toLowerCase() === 'value') || 'id';
      return String(x[idKey]) === String(id);
    });
    if (item) {
      const keys = Object.keys(item);
      const nameKey = keys.find(k => k.toLowerCase().endsWith('name') && !k.toLowerCase().endsWith('username')) || keys.find(k => k.toLowerCase() === 'text' || k.toLowerCase() === 'label' || k.toLowerCase() === 'title');
      return nameKey ? item[nameKey] : Object.values(item)[1];
    }
    return null;
  };

  useEffect(() => {
    if (!userId) {
      return;
    }

    let isMounted = true;

    async function loadData() {
      try {
        const viewerId = session.getUserId();
        const pResponse = await api.getProfile(userId, viewerId);
        const pData = pResponse?.data ?? pResponse?.Data ?? (pResponse?.success ? pResponse : null);

        if (!isMounted) return;

        if (!pData) {
          setLoading(false);
          return;
        }

        // Fetch master data concurrently
        const [
          relRes, edRes, occRes, marRes,
          disRes, stateRes, countryRes,
          mtRes, htRes, ftRes, fsRes, fvRes, incRes
        ] = await Promise.all([
          api.getMasterReligion().catch(()=>({data:[]})),
          api.getMasterEducation().catch(()=>({data:[]})),
          api.getMasterOccupation().catch(()=>({data:[]})),
          api.getMasterMaritalStatus().catch(()=>({data:[]})),
          pData?.stateId ? api.getMasterDistrict(pData.stateId).catch(()=>({data:[]})) : Promise.resolve({data:[]}),
          pData?.countryId ? api.getMasterState(pData.countryId).catch(()=>({data:[]})) : Promise.resolve({data:[]}),
          api.getMasterCountry().catch(()=>({data:[]})),
          api.getMasterMotherTongue().catch(()=>({data:[]})),
          api.getMasterHeight().catch(()=>({data:[]})),
          api.getMasterFamilyType().catch(()=>({data:[]})),
          api.getMasterFamilyStatus().catch(()=>({data:[]})),
          api.getMasterFamilyValue ? api.getMasterFamilyValue().catch(()=>({data:[]})) : Promise.resolve({data:[]}),
          api.getMasterIncome ? api.getMasterIncome().catch(()=>({data:[]})) : Promise.resolve({data:[]}),
        ]);

        let commRes = { data: [] };
        if (pData?.religionId) {
          commRes = await api.getMasterCommunity(pData.religionId).catch(()=>({data:[]}));
        }

        if (isMounted) {
          setProfile(pData);
          setMasterData({
            religion: relRes?.data ?? relRes?.Data ?? [],
            education: edRes?.data ?? edRes?.Data ?? [],
            occupation: occRes?.data ?? occRes?.Data ?? [],
            maritalStatus: marRes?.data ?? marRes?.Data ?? [],
            district: disRes?.data ?? disRes?.Data ?? [],
            state: stateRes?.data ?? stateRes?.Data ?? [],
            country: countryRes?.data ?? countryRes?.Data ?? [],
            community: commRes?.data ?? commRes?.Data ?? [],
            motherTongue: mtRes?.data ?? mtRes?.Data ?? [],
            height: htRes?.data ?? htRes?.Data ?? [],
            familyType: ftRes?.data ?? ftRes?.Data ?? [],
            familyStatus: fsRes?.data ?? fsRes?.Data ?? [],
            familyValue: fvRes?.data ?? fvRes?.Data ?? [],
            income: incRes?.data ?? incRes?.Data ?? [],
          });
          setLoading(false);
        }

      } catch (error) {
        console.error("Error fetching profile details:", error);
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => { isMounted = false; };
  }, [userId]);

  if (loading) {
    return (
      <div className="pd-page">
        <Header />
        <div className="pd-loading-container">
          <div className="pd-spinner"></div>
          <p>Loading profile details...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="pd-page">
        <Header />
        <div className="pd-empty-container">
          <div className="pd-empty-card">
            <h2>{!userId ? 'Please log in to view profile' : 'Profile not found'}</h2>
            <p>{!userId ? 'Sign in to your account to view personal and matched profile details.' : 'The requested profile could not be retrieved.'}</p>
            <button onClick={() => navigate(!userId ? '/login' : '/matches')} className="pd-btn pd-btn-primary">
              {!userId ? 'Go to Login' : 'Back to Search'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Resolved values mapping
  const name = profile.fullName || profile.name || 'Not provided';
  const profileCode = profile.profileCode || (profile.userId ? `SM${String(profile.userId).padStart(6, '0')}` : null);
  
  const birthDate = profile.dateOfBirth ? new Date(profile.dateOfBirth) : null;
  const age = birthDate ? Math.max(0, new Date().getFullYear() - birthDate.getFullYear()) : null;
  const dobStr = birthDate ? birthDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : null;

  const religionStr = profile.religion || resolveName(masterData.religion, profile.religionId);
  const communityStr = profile.community || resolveName(masterData.community, profile.communityId);
  const educationStr = profile.education || resolveName(masterData.education, profile.educationId);
  const occupationStr = profile.occupation || resolveName(masterData.occupation, profile.occupationId);
  const maritalStatusStr = profile.maritalStatus || resolveName(masterData.maritalStatus, profile.maritalStatusId);
  const motherTongueStr = profile.motherTongue || resolveName(masterData.motherTongue, profile.motherTongueId);
  const districtStr = profile.district || resolveName(masterData.district, profile.districtId);
  const stateStr = profile.state || resolveName(masterData.state, profile.stateId);
  const countryStr = profile.country || resolveName(masterData.country, profile.countryId);
  const heightStr = profile.height || resolveName(masterData.height, profile.heightId);
  const incomeStr = profile.income || resolveName(masterData.income, profile.incomeId);
  
  const familyTypeStr = profile.familyType || resolveName(masterData.familyType, profile.familyTypeId);
  const familyStatusStr = profile.familyStatus || resolveName(masterData.familyStatus, profile.familyStatusId);
  const familyValueStr = profile.familyValue || resolveName(masterData.familyValue, profile.familyValueId);

  const locationArr = [districtStr, stateStr, countryStr].filter(Boolean);
  const locationStr = locationArr.length > 0 ? locationArr.join(', ') : 'Not provided';
  
  const religionCommArr = [religionStr, communityStr].filter(Boolean);
  const religionCommStr = religionCommArr.length > 0 ? religionCommArr.join(' • ') : null;

  const imageUrl = profile.imageUrl || profile.image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80';
  const isVerified = Boolean(profile.isVerified || profile.verified || profile.isProfileCompleted);

  const isOwnProfile = Boolean(currentLoggedUserId && String(userId) === String(currentLoggedUserId));
  const isLocked = Boolean(profile.isLocked || profile.canViewFullProfile === false) && !isOwnProfile;

  const handleSendInterest = () => {
    if (actionState.sending || actionState.sent) return;
    setActionState({ sending: true, sent: false });
    setTimeout(() => setActionState({ sending: false, sent: true }), 1000);
  };

  const handleShortlist = () => {
    if (shortlistState.sending || shortlistState.sent) return;
    setShortlistState({ sending: true, sent: false });
    setTimeout(() => setShortlistState({ sending: false, sent: true }), 800);
  };

  return (
    <div className="pd-page">
      <Header />
      
      <main className="pd-container">
        {/* Navigation Breadcrumb */}
        <div className="pd-back-nav">
          <button onClick={() => navigate(-1)} className="pd-back-btn" aria-label="Go back">
            <ArrowLeft size={16} />
            <span>Back to Search</span>
          </button>
          {profileCode && <span className="pd-breadcrumb-code">Profile ID: <strong>{profileCode}</strong></span>}
        </div>

        {/* Hero Card */}
        <div className="pd-hero-card">
          <div className="pd-hero-photo-col">
            <div className="pd-photo-wrapper">
              <img src={imageUrl} alt={name} className="pd-photo" />
              {isVerified && (
                <div className="pd-verified-badge" title="Verified Matrimony Profile">
                  <ShieldCheck size={15} />
                  <span>Verified</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="pd-hero-info-col">
            <div className="pd-hero-header">
              <h1 className="pd-name">{name}</h1>
              {profileCode && <span className="pd-id-tag">{profileCode}</span>}
            </div>

            <div className="pd-hero-subline">
              {age && <span>{age} Yrs</span>}
              {age && heightStr && <span className="pd-dot">•</span>}
              {heightStr && <span>{heightStr}</span>}
              {(age || heightStr) && maritalStatusStr && <span className="pd-dot">•</span>}
              {maritalStatusStr && <span>{maritalStatusStr}</span>}
            </div>

            <div className="pd-hero-badges-grid">
              <div className="pd-badge-item">
                <MapPin size={17} className="pd-badge-icon" />
                <div className="pd-badge-text">
                  <span className="pd-badge-label">Location</span>
                  <strong className="pd-badge-val">{locationStr}</strong>
                </div>
              </div>

              {religionCommStr && (
                <div className="pd-badge-item">
                  <Heart size={17} className="pd-badge-icon" />
                  <div className="pd-badge-text">
                    <span className="pd-badge-label">Religion / Community</span>
                    <strong className="pd-badge-val">{religionCommStr}</strong>
                  </div>
                </div>
              )}

              {educationStr && (
                <div className="pd-badge-item">
                  <GraduationCap size={17} className="pd-badge-icon" />
                  <div className="pd-badge-text">
                    <span className="pd-badge-label">Education</span>
                    <strong className="pd-badge-val">{educationStr}</strong>
                  </div>
                </div>
              )}

              {occupationStr && (
                <div className="pd-badge-item">
                  <Briefcase size={17} className="pd-badge-icon" />
                  <div className="pd-badge-text">
                    <span className="pd-badge-label">Profession</span>
                    <strong className="pd-badge-val">{occupationStr}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Action Buttons */}
        {!isOwnProfile && (
          <div className="pd-mobile-actions">
            <button 
              className={`pd-btn ${actionState.sent ? 'pd-btn-success' : 'pd-btn-primary'}`} 
              onClick={handleSendInterest}
              disabled={actionState.sending || actionState.sent}
            >
              <Heart size={16} />
              {actionState.sending ? 'Sending...' : actionState.sent ? 'Interest Sent' : 'Send Interest'}
            </button>
            <button 
              className={`pd-btn-outline ${shortlistState.sent ? 'pd-btn-outline-success' : ''}`}
              onClick={handleShortlist}
              disabled={shortlistState.sending || shortlistState.sent}
            >
              <Bookmark size={16} />
              {shortlistState.sending ? 'Saving...' : shortlistState.sent ? 'Shortlisted' : 'Shortlist'}
            </button>
          </div>
        )}

        {/* 2-Column Content Layout */}
        <div className="pd-content-layout">
          {/* Main Details Column */}
          <div className="pd-main-col">
            
            {/* Section 1: About Me */}
            <section className="pd-card pd-card-section" id="about">
              <div className="pd-card-heading">
                <div className="pd-heading-icon"><User size={20} /></div>
                <h2>About Me</h2>
              </div>
              <div className="pd-card-body">
                <p className="pd-about-text">
                  {profile.aboutMe || profile.about || 'A warm welcome! This member has not written a detailed bio yet.'}
                </p>
              </div>
            </section>

            {/* Section 2: Basic Information Preview */}
            <section className="pd-card pd-card-section" id="basic-info">
              <div className="pd-card-heading">
                <div className="pd-heading-icon"><Sparkles size={20} /></div>
                <h2>Basic Information</h2>
              </div>
              <div className="pd-card-body">
                <div className="pd-grid-2col">
                  {dobStr && !isLocked && <InfoRow label="Date of Birth" value={dobStr} />}
                  {age && <InfoRow label="Age" value={`${age} Years`} />}
                  {maritalStatusStr && <InfoRow label="Marital Status" value={maritalStatusStr} />}
                  {motherTongueStr && <InfoRow label="Mother Tongue" value={motherTongueStr} />}
                  {heightStr && <InfoRow label="Height" value={heightStr} />}
                  {profile.weight && !isLocked && <InfoRow label="Weight" value={`${profile.weight} kg`} />}
                  {religionStr && <InfoRow label="Religion" value={religionStr} />}
                  {communityStr && <InfoRow label="Community / Caste" value={communityStr} />}
                  {districtStr && <InfoRow label="District" value={districtStr} />}
                  {stateStr && <InfoRow label="State" value={stateStr} />}
                  {countryStr && <InfoRow label="Country" value={countryStr} />}
                </div>
              </div>
            </section>

            {/* If Member is Locked (Free / Unpaid user viewing other's profile): Show Unlock Section */}
            {isLocked ? (
              <div className="pd-lock-card">
                <div className="pd-lock-icon-wrap">
                  <Lock size={28} />
                </div>
                <h2>Become a Member to View Full Profile</h2>
                <p>Join Soesy  Matrimony to connect with verified profiles and view complete family details, career background, and partner preferences.</p>
                <div className="pd-lock-perks">
                  <div className="pd-perk-item"><Check size={16} /> <span>Unlock full access to 20 verified profiles</span></div>
                  <div className="pd-perk-item"><Check size={16} /> <span>View complete family and career details</span></div>
                  <div className="pd-perk-item"><Check size={16} /> <span>Direct contact & matrimonial assistance</span></div>
                </div>
                <button 
                  type="button" 
                  className="pd-btn pd-btn-gold-action"
                  onClick={() => navigate('/subscription')}
                >
                  <Crown size={18} />
                  <span>Become a Member</span>
                </button>
              </div>
            ) : (
              <>
                {/* Section 3: Education & Career */}
                {(educationStr || occupationStr || profile.companyName || profile.designation || incomeStr) && (
                  <section className="pd-card pd-card-section" id="education-career">
                    <div className="pd-card-heading">
                      <div className="pd-heading-icon"><GraduationCap size={20} /></div>
                      <h2>Education & Career</h2>
                    </div>
                    <div className="pd-card-body">
                      <div className="pd-grid-2col">
                        {educationStr && <InfoRow label="Highest Qualification" value={educationStr} />}
                        {occupationStr && <InfoRow label="Occupation" value={occupationStr} />}
                        {profile.designation && <InfoRow label="Designation" value={profile.designation} />}
                        {profile.companyName && <InfoRow label="Company Name" value={profile.companyName} />}
                        {incomeStr && <InfoRow label="Annual Income" value={incomeStr} />}
                      </div>
                    </div>
                  </section>
                )}

                {/* Section 4: Family Details */}
                <section className="pd-card pd-card-section" id="family-details">
                  <div className="pd-card-heading">
                    <div className="pd-heading-icon"><Users size={20} /></div>
                    <h2>Family Details</h2>
                  </div>
                  <div className="pd-card-body">
                    <div className="pd-grid-2col">
                      {profile.fatherName && <InfoRow label="Father's Name" value={profile.fatherName} />}
                      {profile.fatherOccupation && <InfoRow label="Father's Occupation" value={profile.fatherOccupation} />}
                      {profile.motherName && <InfoRow label="Mother's Name" value={profile.motherName} />}
                      {profile.motherOccupation && <InfoRow label="Mother's Occupation" value={profile.motherOccupation} />}
                      {familyTypeStr && <InfoRow label="Family Type" value={familyTypeStr} />}
                      {familyStatusStr && <InfoRow label="Family Status" value={familyStatusStr} />}
                      {familyValueStr && <InfoRow label="Family Values" value={familyValueStr} />}
                      {profile.nativePlace && <InfoRow label="Native Place" value={profile.nativePlace} />}
                      {profile.brothers !== undefined && profile.brothers !== null && (
                        <InfoRow 
                          label="Brothers" 
                          value={`${profile.brothers} brother(s)${profile.marriedBrothers ? ` (${profile.marriedBrothers} married)` : ''}`} 
                        />
                      )}
                      {profile.sisters !== undefined && profile.sisters !== null && (
                        <InfoRow 
                          label="Sisters" 
                          value={`${profile.sisters} sister(s)${profile.marriedSisters ? ` (${profile.marriedSisters} married)` : ''}`} 
                        />
                      )}
                    </div>
                    {profile.familyAbout && (
                      <div className="pd-family-note">
                        <span className="pd-label">About Family</span>
                        <p className="pd-value-text">{profile.familyAbout}</p>
                      </div>
                    )}
                    {(!profile.fatherName && !profile.motherName && !familyTypeStr && !profile.familyAbout && (profile.brothers === undefined || profile.brothers === null)) && (
                      <p className="pd-empty">Family details have not been updated yet.</p>
                    )}
                  </div>
                </section>

                {/* Section 5: Partner Preferences */}
                <section className="pd-card pd-card-section" id="preferences">
                  <div className="pd-card-heading">
                    <div className="pd-heading-icon"><Heart size={20} /></div>
                    <h2>Partner Preferences</h2>
                  </div>
                  <div className="pd-card-body">
                    <div className="pd-grid-2col">
                      {(profile.ageFrom || profile.ageTo) && (
                        <InfoRow label="Preferred Age" value={`${profile.ageFrom || 'Any'} - ${profile.ageTo || 'Any'} Years`} />
                      )}
                      {(profile.heightFrom || profile.heightTo) && (
                        <InfoRow label="Preferred Height" value={`${profile.heightFrom || 'Any'} - ${profile.heightTo || 'Any'}`} />
                      )}
                      {profile.preferredReligion && <InfoRow label="Preferred Religion" value={profile.preferredReligion} />}
                      {profile.preferredCommunity && <InfoRow label="Preferred Community" value={profile.preferredCommunity} />}
                      {profile.preferredEducation && <InfoRow label="Preferred Education" value={profile.preferredEducation} />}
                      {profile.preferredOccupation && <InfoRow label="Preferred Occupation" value={profile.preferredOccupation} />}
                      {profile.preferredIncome && <InfoRow label="Preferred Income" value={profile.preferredIncome} />}
                    </div>
                    {profile.preferredDescription && (
                      <div className="pd-family-note">
                        <span className="pd-label">Partner Expectations</span>
                        <p className="pd-value-text">{profile.preferredDescription}</p>
                      </div>
                    )}
                    {(!profile.ageFrom && !profile.ageTo && !profile.preferredReligion && !profile.preferredEducation && !profile.preferredDescription) && (
                      <p className="pd-empty">Partner preferences have not been specified.</p>
                    )}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Right Action Sidebar */}
          <aside className="pd-sidebar">
            <div className="pd-action-card">
              {isOwnProfile ? (
                <>
                  <div className="pd-action-badge">Personal Account</div>
                  <h3>Your Matrimony Profile</h3>
                  <p>This is how other members view your verified profile on Soesy Matrimony.</p>
                  <button 
                    className="pd-btn pd-btn-primary" 
                    onClick={() => navigate('/profile/edit')}
                  >
                    <Edit3 size={16} /> Edit My Profile
                  </button>
                  <button 
                    className="pd-btn-outline" 
                    onClick={() => navigate('/matches')}
                  >
                    Browse Matches
                  </button>
                </>
              ) : (
                <>
                  <div className="pd-action-badge">Connect & Express</div>
                  <h3>Interested in this Profile?</h3>
                  <p>Express your interest to start a connection and explore matrimony possibilities.</p>
                  
                  <button 
                    className={`pd-btn ${actionState.sent ? 'pd-btn-success' : 'pd-btn-primary'}`} 
                    onClick={handleSendInterest}
                    disabled={actionState.sending || actionState.sent}
                  >
                    {actionState.sent ? <Check size={16} /> : <Heart size={16} />}
                    <span>{actionState.sending ? 'Sending...' : actionState.sent ? 'Interest Sent' : 'Send Interest'}</span>
                  </button>
                  
                  <button 
                    className={`pd-btn-outline ${shortlistState.sent ? 'pd-btn-outline-success' : ''}`} 
                    onClick={handleShortlist}
                    disabled={shortlistState.sending || shortlistState.sent}
                  >
                    <Bookmark size={16} />
                    <span>{shortlistState.sending ? 'Saving...' : shortlistState.sent ? 'Shortlisted' : 'Shortlist Profile'}</span>
                  </button>

                  {isLocked && (
                    <div className="pd-sidebar-lock-note">
                      <Lock size={15} />
                      <span>Full family & contact details are protected for paid members.</span>
                      <button 
                        className="pd-btn-sidebar-upgrade"
                        onClick={() => navigate('/subscription')}
                      >
                        Become a Member →
                      </button>
                    </div>
                  )}

                  <div className="pd-safety-badge">
                    <ShieldCheck size={15} />
                    <span>100% Verified Contact & Privacy Assured</span>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ label, value }) {
  if (value === undefined || value === null || value === '' || value === '0') return null;
  return (
    <div className="pd-info-row">
      <span className="pd-info-label">{label}</span>
      <span className="pd-info-value">{value}</span>
    </div>
  );
}
