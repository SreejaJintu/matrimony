import { useEffect, useState } from 'react';
import { User, Calendar, Phone, Mail, Lock, ShieldCheck } from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+91', country: 'IN' },
  { code: '+1', country: 'US/CA' },
  { code: '+44', country: 'UK' },
  { code: '+61', country: 'AU' },
  { code: '+971', country: 'UAE' },
  { code: '+65', country: 'SG' },
];

export const BasicDetailsStep = ({ initialData, onSubmit, onSaveLater, showPasswordField = true, mode = 'create' }) => {
  const [formData, setFormData] = useState(initialData);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!formData.fullName?.trim()) e.fullName = 'Please enter your full name';
    if (!formData.gender) e.gender = 'Please select a gender';
    if (!formData.mobileNumber?.trim()) e.mobileNumber = 'Mobile number is required';
    if (!formData.email?.trim() || !formData.email.includes('@')) e.email = 'Valid email address is required';
    if (showPasswordField && (!formData.password || formData.password.length < 8)) {
      e.password = 'Password must be at least 8 characters';
    }
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onSubmit(formData);
  };

  const field = (label, required, children, error) => (
    <div className="reg-field">
      <label className="reg-label">{label}{required && <span className="reg-required"> *</span>}</label>
      {children}
      {error && <p className="reg-error">{error}</p>}
    </div>
  );

  const iconInput = (icon, children) => (
    <div className="reg-input-wrap">{icon}{children}</div>
  );

  return (
    <form onSubmit={handleSubmit} className="reg-form" noValidate>
      {field('Full Name', true,
        iconInput(<User size={18} className="reg-input-icon" />,
          <input id="input-full-name" type="text" value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Enter your full name"
            className={`reg-input ${errors.fullName ? 'is-error' : ''}`} />
        ), errors.fullName)}

      <div className="reg-grid">
        {field('Groom / Bride', true,
          <div className="reg-input-wrap">
            <select id="select-gender" value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className={`reg-input reg-select ${errors.gender ? 'is-error' : ''}`}>
              <option value="" disabled>Select</option>
              <option value="Male">Groom</option>
              <option value="Female">Bride</option>
              <option value="Other">Other</option>
            </select>
          </div>, errors.gender)}

        {field('Date of Birth', false,
          iconInput(<Calendar size={18} className="reg-input-icon" />,
            <input id="input-dob" type="date" value={formData.dob}
              onChange={(e) => handleChange('dob', e.target.value)}
              className="reg-input" />
          ))}
      </div>

      {field('Mobile Number', true,
        <div className={`reg-phone ${errors.mobileNumber ? 'is-error' : ''}`}>
          <Phone size={18} className="reg-input-icon reg-phone-icon" />
          <select id="select-country-code" value={formData.countryCode}
            onChange={(e) => handleChange('countryCode', e.target.value)} className="reg-country">
            {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
          </select>
          <input id="input-mobile-number" type="tel" value={formData.mobileNumber}
            onChange={(e) => handleChange('mobileNumber', e.target.value)}
            placeholder="98765 43210" className="reg-phone-input" />
        </div>, errors.mobileNumber)}

      {field('Email Address', true,
        iconInput(<Mail size={18} className="reg-input-icon" />,
          <input id="input-email" type="email" value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="name@example.com"
            className={`reg-input ${errors.email ? 'is-error' : ''}`} />
        ), errors.email)}

      {showPasswordField && field('Create Password', true,
        <div className="reg-input-wrap">
          <Lock size={18} className="reg-input-icon" />
          <input id="input-password" type={showPassword ? 'text' : 'password'} value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="Min. 8 characters"
            className={`reg-input reg-password ${errors.password ? 'is-error' : ''}`} />
          <button type="button" id="toggle-password-visibility" onClick={() => setShowPassword(!showPassword)} className="reg-toggle">
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>, errors.password)}

      <div className="reg-privacy">
        <ShieldCheck size={22} className="reg-privacy-icon" />
        <div>
          <strong>Your Privacy is Our Priority</strong>
          <p>Your information is safe with us and will not be shared with anyone.</p>
        </div>
      </div>

      <div className="reg-actions">
        <button type="button" className="reg-btn reg-btn-ghost" onClick={() => onSaveLater(formData)}>{mode === 'edit' ? 'Cancel' : 'Save & Continue Later'}</button>
        <button type="submit" className="reg-btn reg-btn-primary">{mode === 'edit' ? 'Save' : 'Create Account'} <span aria-hidden="true">→</span></button>
      </div>
    </form>
  );
};
