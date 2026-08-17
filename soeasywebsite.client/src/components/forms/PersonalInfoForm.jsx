import React, { useState } from 'react';

export const PersonalInfoForm = ({
  initialData,
  onSubmit,
  onOpenSignIn,
  onOpenTerms,
  onOpenPrivacy,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const countryCodes = [
    { code: '+91', country: 'IN' },
    { code: '+1', country: 'US/CA' },
    { code: '+44', country: 'UK' },
    { code: '+61', country: 'AU' },
    { code: '+971', country: 'UAE' },
    { code: '+65', country: 'SG' },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName || !formData.fullName.trim()) newErrors.fullName = 'Please enter your full name';
    if (!formData.gender) newErrors.gender = 'Please select a gender';
    if (!formData.dob) newErrors.dob = 'Please select date of birth';
    if (!formData.mobileNumber || !formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
    if (!formData.email || !formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid email address is required';
    if (!formData.password || formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="registration-shell">
      {/* Central White Card */}
      <div className="registration-card">
        {/* Header Title */}
        <div className="registration-header">
          <h1 className="registration-title">
            Create Your Account
          </h1>
          <p className="registration-subtitle">
            Join our community of professionals seeking intentional connections.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="registration-form">
          {/* Full Name */}
          <div>
            <label className="registration-label">
              Full Name
            </label>
            <input
              id="input-full-name"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              className={`registration-input ${errors.fullName ? 'is-error' : ''}`}
            />
            {errors.fullName && (
            <p className="registration-error">{errors.fullName}</p>
            )}
          </div>

          {/* Gender & Date of Birth Row */}
          <div className="registration-grid">
            {/* Gender Dropdown */}
            <div>
              <label className="registration-label">
                Gender
              </label>
              <div className="relative">
                <select
                  id="select-gender"
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className={`registration-input registration-select ${errors.gender ? 'is-error' : ''}`}
                >
                  <option value="" disabled>Select gender</option>
                  <option value="Male" className="text-stone-800">Male</option>
                  <option value="Female" className="text-stone-800">Female</option>
                  <option value="Non-binary" className="text-stone-800">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              {errors.gender && (
                <p className="registration-error">{errors.gender}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="registration-label">
                Date of Birth
              </label>
              <div className="relative">
                <input
                  id="input-dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleChange('dob', e.target.value)}
                  placeholder="mm/dd/yyyy"
                  className={`registration-input ${errors.dob ? 'is-error' : ''}`}
                />
              </div>
              {errors.dob && (
                <p className="registration-error">{errors.dob}</p>
              )}
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="registration-label">
              Mobile Number
            </label>
            <div className={`registration-phone ${errors.mobileNumber ? 'is-error' : ''}`}>
              <select
                id="select-country-code"
                value={formData.countryCode}
                onChange={(e) => handleChange('countryCode', e.target.value)}
                className="registration-country"
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
              <input
                id="input-mobile-number"
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => handleChange('mobileNumber', e.target.value)}
                placeholder="98765 43210"
                className="registration-phone-input"
              />
            </div>
            {errors.mobileNumber && (
              <p className="registration-error">{errors.mobileNumber}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="registration-label">
              Email Address
            </label>
            <input
              id="input-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="name@company.com"
              className={`registration-input ${errors.email ? 'is-error' : ''}`}
            />
            {errors.email && (
              <p className="registration-error">{errors.email}</p>
            )}
          </div>

          {/* Create Password */}
          <div>
            <label className="registration-label">
              Create Password
            </label>
            <div className="relative">
              <input
                id="input-password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Min. 8 characters"
                className={`registration-input registration-password ${errors.password ? 'is-error' : ''}`}
              />
              <button
                type="button"
                id="toggle-password-visibility"
                onClick={() => setShowPassword(!showPassword)}
                className="registration-toggle"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && (
              <p className="registration-error">{errors.password}</p>
            )}
          </div>

          {/* Create Account Action Button */}
          <div className="registration-submit-wrap">
            <button
              type="submit"
              id="submit-create-account"
              className="registration-submit"
            >
              Create Account
            </button>
          </div>

          {/* Terms & Privacy Disclaimer */}
          <p className="registration-legal">
            By signing up, you agree to our{' '}
            <button
              type="button"
              onClick={onOpenTerms}
              className="registration-link"
            >
              Terms
            </button>{' '}
            and{' '}
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="registration-link"
            >
              Privacy Policy
            </button>
            .
          </p>
        </form>
      </div>

      {/* Bottom Link outside the card */}
      <div className="registration-bottom">
        <p className="registration-bottom-text">
          Already have an account?{' '}
          <button
            type="button"
            id="link-signin-bottom"
            onClick={onOpenSignIn}
            className="registration-link"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
