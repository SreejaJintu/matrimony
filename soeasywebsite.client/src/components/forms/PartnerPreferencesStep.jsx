import { useState, useEffect } from 'react';
import { GraduationCap, MapPin, Heart } from 'lucide-react';

export const PartnerPreferencesStep = ({ initialData, onSubmit, onBack, masterData = {}, onReligionChange, mode = 'create' }) => {
  const [formData, setFormData] = useState(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  useEffect(() => {
    setIsLoaded(Boolean(masterData.religions?.length || masterData.educations?.length || masterData.maritalStatuses?.length));
  }, [masterData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const field = (label, children) => (
    <div className="reg-field">
      <label className="reg-label">{label}</label>
      {children}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="reg-form" noValidate>
      {field('Seeking',
        <div className="reg-choice-row">
          {['Female', 'Male', 'Everyone'].map((g) => (
            <button type="button" key={g}
              onClick={() => handleChange('lookingForGender', g)}
              className={`reg-choice ${formData.lookingForGender === g ? 'is-active' : ''}`}>
              {g}
            </button>
          ))}
        </div>)}

      {field('Preferred Age Range',
        <div className="reg-range-block">
          <div className="reg-range-values">
            <span>{formData.ageRangeMin} - {formData.ageRangeMax} years</span>
          </div>
          <div className="reg-range-row">
            <input type="range" min="21" max="60" value={formData.ageRangeMin}
              onChange={(e) => handleChange('ageRangeMin', Math.min(Number(e.target.value), formData.ageRangeMax - 1))}
              className="reg-range-input" />
            <input type="range" min="22" max="65" value={formData.ageRangeMax}
              onChange={(e) => handleChange('ageRangeMax', Math.max(Number(e.target.value), formData.ageRangeMin + 1))}
              className="reg-range-input" />
          </div>
        </div>)}

      <div className="reg-grid">
        {field('Religion',
          <div className="reg-input-wrap">
            <select
              value={formData.preferredReligionId || ''}
              onChange={(e) => {
                const val = Number(e.target.value) || ''
                onReligionChange?.(val)
              }}
              className="reg-input reg-select"
              disabled={!isLoaded}
            >
              <option value="">Select religion</option>
              {masterData.religions?.map((r, i) => <option key={`religion-${r.id}-${i}`} value={r.id}>{r.name}</option>)}
            </select>
          </div>)}

        {field('Community',
          <div className="reg-input-wrap">
            <select
              value={formData.preferredCommunityId || ''}
              onChange={(e) => handleChange('preferredCommunityId', Number(e.target.value) || '')}
              className="reg-input reg-select"
              disabled={!formData.preferredReligionId || !masterData.communities?.length}
            >
              <option value="">
                {formData.preferredReligionId
                  ? masterData.communities?.length ? 'Select community' : 'Loading...'
                  : 'Select religion first'}
              </option>
              {masterData.communities?.map((c, i) => <option key={`community-${c.id}-${i}`} value={c.id}>{c.name}</option>)}
            </select>
          </div>)}
      </div>

      {field('Education Level',
        <div className="reg-input-wrap">
          <GraduationCap size={18} className="reg-input-icon" />
          <select value={formData.educationPreferenceId || ''} onChange={(e) => handleChange('educationPreferenceId', Number(e.target.value) || '')} className="reg-input reg-select" disabled={!isLoaded}>
            <option value="">Select education level</option>
            {masterData.educations?.map((ed, i) => <option key={`pref-education-${ed.id}-${i}`} value={ed.id}>{ed.name}</option>)}
          </select>
        </div>)}

      <div className="reg-grid">
        {field('Profession',
          <div className="reg-input-wrap">
            <input type="text" value={formData.preferredProfession} onChange={(e) => handleChange('preferredProfession', e.target.value)}
              placeholder="e.g. Doctor, Engineer" className="reg-input" />
          </div>)}

        {field('Marital Status',
          <div className="reg-input-wrap">
            <select value={formData.preferredMaritalStatusId || ''} onChange={(e) => handleChange('preferredMaritalStatusId', Number(e.target.value) || '')} className="reg-input reg-select" disabled={!isLoaded}>
              <option value="">Select marital status</option>
              {masterData.maritalStatuses?.map((m, i) => <option key={`pref-marital-${m.id}-${i}`} value={m.id}>{m.name}</option>)}
            </select>
          </div>)}
      </div>

      {field('Preferred Location',
        <div className="reg-input-wrap">
          <MapPin size={18} className="reg-input-icon" />
          <select
            value={formData.locationPreference || ''}
            onChange={(e) => handleChange('locationPreference', e.target.value)}
            className="reg-input reg-select"
            disabled={!isLoaded}
          >
            <option value="">Select preferred location</option>
            {masterData.countries?.map((c, i) => <option key={`loc-country-${c.id}-${i}`} value={c.name}>{c.name}</option>)}
          </select>
        </div>)}

      <div className="reg-note">
        <Heart size={16} className="reg-note-icon" />
        <p>GSeven Matrimony uses advanced multi-factor verification to ensure all member profiles are 100% authentic and intent-driven.</p>
      </div>

      <div className="reg-actions">
        <button type="button" className="reg-btn reg-btn-ghost" onClick={onBack}>{mode === 'edit' ? 'Cancel' : 'Previous'}</button>
        <button type="submit" className="reg-btn reg-btn-primary">{mode === 'edit' ? 'Save Changes' : 'Save & Continue'} <span aria-hidden="true">→</span></button>
      </div>
    </form>
  );
};