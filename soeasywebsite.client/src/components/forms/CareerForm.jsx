import React, { useState } from 'react';

export const CareerForm = ({ initialData, onSubmit, onBack }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            Career & Credentials
          </h1>
          <p className="registration-subtitle">
            Highlight your professional background to help us match you with like-minded peers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          {/* Occupation */}
          <div>
            <label className="registration-label">
              Current Occupation / Designation
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => handleChange('occupation', e.target.value)}
                placeholder="e.g. Senior Software Engineer / Consultant"
                className="registration-input"
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="registration-label">
              Company or Industry
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="e.g. McKinsey & Co / Healthcare Tech"
                className="registration-input"
              />
            </div>
          </div>

          {/* Education */}
          <div>
            <label className="registration-label">
              Highest Qualification
            </label>
            <div className="relative">
              <select
                value={formData.education}
                onChange={(e) => handleChange('education', e.target.value)}
                className="registration-input registration-select"
              >
                <option value="">Select qualification</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Doctorate / PhD">Doctorate / PhD</option>
                <option value="Professional Degree (MD, JD, CA)">Professional Degree (MD, JD, CA)</option>
              </select>
            </div>
          </div>

          {/* Annual Income & City */}
          <div className="registration-grid">
            <div>
                <label className="registration-label">
                  Annual Income Range
                </label>
              <div className="relative">
                <select
                  value={formData.annualIncome}
                  onChange={(e) => handleChange('annualIncome', e.target.value)}
                  className="registration-input registration-select"
                >
                  <option value="">Select income</option>
                  <option value="10-20 Lakhs / $50k-$80k">10-20 Lakhs / $50k-$80k</option>
                  <option value="20-35 Lakhs / $80k-$120k">20-35 Lakhs / $80k-$120k</option>
                  <option value="35-50 Lakhs / $120k-$180k">35-50 Lakhs / $120k-$180k</option>
                  <option value="50+ Lakhs / $180k+">50+ Lakhs / $180k+</option>
                </select>
              </div>
            </div>

            <div>
                <label className="registration-label">
                  Current City
                </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="e.g. Mumbai, New York"
                  className="registration-input"
                />
              </div>
            </div>
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
              Continue to Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
