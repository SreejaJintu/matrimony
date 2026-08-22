import { useState, useEffect } from 'react';
import { GraduationCap, MapPin, Heart } from 'lucide-react';

const resolveOptionLabel = (item) =>
  item?.name ??
  item?.Name ??
  item?.title ??
  item?.Title ??
  item?.text ??
  item?.Text ??
  item?.label ??
  item?.Label ??
  item?.religionName ??
  item?.ReligionName ??
  item?.value ??
  item?.Value ??
  '';

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

  const handleAgeChange = (field, value) => {
    const nextValue = value === '' ? '' : Number(value);

    setFormData((prev) => {
      const currentMin = Number(prev.ageRangeMin || 20);
      const currentMax = Number(prev.ageRangeMax || 60);

      if (field === 'ageRangeMin') {
        const minValue = Number.isNaN(nextValue) ? '' : Math.max(20, Math.min(nextValue, (currentMax || 60) - 1));
        return { ...prev, ageRangeMin: minValue };
      }

      const maxValue = Number.isNaN(nextValue) ? '' : Math.min(60, Math.max(nextValue, (currentMin || 20) + 1));
      return { ...prev, ageRangeMax: maxValue };
    });
  };

  const handleReligionSelect = (value) => {
    const religionId = value === '' ? '' : Number(value);
    handleChange('preferredReligionId', religionId);
    handleChange('preferredCommunityId', '');
    onReligionChange?.(religionId);
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
            <span>{formData.ageRangeMin || 20} - {formData.ageRangeMax || 60} years</span>
          </div>
          <div className="reg-range-row reg-age-fields">
            <div className="reg-input-wrap">
              <input
                type="number"
                min="20"
                max="60"
                step="1"
                value={formData.ageRangeMin ?? ''}
                onChange={(e) => handleAgeChange('ageRangeMin', e.target.value)}
                className="reg-input"
                placeholder="Min age"
              />
            </div>
            <div className="reg-input-wrap">
              <input
                type="number"
                min="20"
                max="60"
                step="1"
                value={formData.ageRangeMax ?? ''}
                onChange={(e) => handleAgeChange('ageRangeMax', e.target.value)}
                className="reg-input"
                placeholder="Max age"
              />
            </div>
          </div>
        </div>)}

      <div className="reg-grid">
        {field('Religion',
          <div className="reg-input-wrap">
            <select
              value={formData.preferredReligionId || ''}
              onChange={(e) => handleReligionSelect(e.target.value)}
              className="reg-input reg-select"
              disabled={!isLoaded}
            >
              <option value="">Select religion</option>
              {masterData.religions?.map((r, i) => (
                <option key={`religion-${r.id ?? i}-${i}`} value={r.id ?? r.Id ?? ''}>
                  {resolveOptionLabel(r)}
                </option>
              ))}
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
              {masterData.communities?.map((c, i) => (
                <option key={`community-${c.id ?? i}-${i}`} value={c.id ?? c.Id ?? ''}>
                  {resolveOptionLabel(c)}
                </option>
              ))}
            </select>
          </div>)}
      </div>

      {field('Education Level',
        <div className="reg-input-wrap">
          <GraduationCap size={18} className="reg-input-icon" />
          <select value={formData.educationPreferenceId || ''} onChange={(e) => handleChange('educationPreferenceId', Number(e.target.value) || '')} className="reg-input reg-select" disabled={!isLoaded}>
            <option value="">Select education level</option>
            {masterData.educations?.map((ed, i) => (
              <option key={`pref-education-${ed.id ?? i}-${i}`} value={ed.id ?? ed.Id ?? ''}>
                {resolveOptionLabel(ed)}
              </option>
            ))}
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
              {masterData.maritalStatuses?.map((m, i) => (
                <option key={`pref-marital-${m.id ?? i}-${i}`} value={m.id ?? m.Id ?? ''}>
                  {resolveOptionLabel(m)}
                </option>
              ))}
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
            {masterData.countries?.map((c, i) => (
              <option key={`loc-country-${c.id ?? i}-${i}`} value={resolveOptionLabel(c)}>
                {resolveOptionLabel(c)}
              </option>
            ))}
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
