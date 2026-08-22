import React, { useState } from 'react';

export const PreferencesForm = ({
  initialData,
  onSubmit,
  onBack,
}) => {
  const [formData, setFormData] = useState(initialData);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="registration-shell">
      <div className="registration-card">
        <div className="registration-header">
          <h1 className="registration-title">
            Partner Preferences
          </h1>
          <p className="registration-subtitle">
            Specify the qualities and values that matter most to you in a long-term partner.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          {/* Looking for gender */}
          <div>
            <label className="registration-label">
              Seeking
            </label>
            <div className="registration-choice-row">
              {['Female', 'Male', 'Everyone'].map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setFormData({ ...formData, lookingForGender: g })}
                  className={`registration-choice ${
                    formData.lookingForGender === g
                      ? 'is-active'
                      : ''
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Age range */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="registration-label">
                Preferred Age Range
              </label>
              <span className="registration-range">
                {formData.ageRangeMin || 20} - {formData.ageRangeMax || 60} years
              </span>
            </div>
            <div className="registration-range-row registration-age-fields">
              <input
                type="number"
                min="20"
                max="60"
                step="1"
                value={formData.ageRangeMin ?? ''}
                onChange={(e) =>
                  handleAgeChange('ageRangeMin', e.target.value)
                }
                className="registration-input"
                placeholder="Min age"
              />
              <input
                type="number"
                min="20"
                max="60"
                step="1"
                value={formData.ageRangeMax ?? ''}
                onChange={(e) =>
                  handleAgeChange('ageRangeMax', e.target.value)
                }
                className="registration-input"
                placeholder="Max age"
              />
            </div>
          </div>

          {/* Education preference */}
          <div>
            <label className="registration-label">
              Education Level
            </label>
            <select
              value={formData.educationPreference}
              onChange={(e) => setFormData({ ...formData, educationPreference: e.target.value })}
              className="registration-input registration-select"
            >
              <option value="Any Degree">Any Qualification</option>
              <option value="Bachelor's & Above">Bachelor's Degree & Above</option>
              <option value="Master's & Above">Master's Degree & Above</option>
              <option value="Doctorate Only">Doctorate / PhD Only</option>
            </select>
          </div>

          {/* Location preference */}
          <div>
            <label className="registration-label">
              Preferred Location
            </label>
            <input
              type="text"
              value={formData.locationPreference}
              onChange={(e) => setFormData({ ...formData, locationPreference: e.target.value })}
              placeholder="e.g. Same City, Metro Cities, Anywhere in India / USA"
              className="registration-input"
            />
          </div>

          <div className="registration-note">
            <span className="text-[#58081A] font-bold shrink-0 mt-0.5">•</span>
            <p className="text-xs text-stone-600 leading-relaxed">
              MatchIntegrity uses advanced multi-factor verification to ensure all member profiles are 100% authentic and intent-driven.
            </p>
          </div>

          <div className="registration-actions">
            <button
              type="button"
              onClick={onBack}
              className="registration-secondary"
            >
              Back
            </button>
            <button
              type="submit"
              className="registration-submit registration-submit-wide"
            >
              Complete Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
