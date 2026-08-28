import { useState, useEffect } from 'react';
import { Briefcase, GraduationCap, MapPin, Ruler, Weight, Calendar } from 'lucide-react';

export const AboutYouStep = ({ initialData, onSubmit, onBack, masterData = {}, mode = 'create' }) => {
  const [formData, setFormData] = useState(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  useEffect(() => {
    console.log('masterData in AboutYouStep:', masterData)
    console.log('heights:', masterData.heights)
    console.log('educations:', masterData.educations)
    console.log('maritalStatuses:', masterData.maritalStatuses)
    setIsLoaded(Boolean(masterData.heights?.length || masterData.educations?.length || masterData.maritalStatuses?.length));
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

  const iconInput = (icon, children) => (
    <div className="reg-input-wrap">{icon}{children}</div>
  );

  return (
    <form onSubmit={handleSubmit} className="reg-form" noValidate>
      <div className="reg-grid">
        {field('Date of Birth',
          iconInput(<Calendar size={18} className="reg-input-icon" />,
            <input
              type="date"
              value={formData.dob || ''}
              onChange={(e) => handleChange('dob', e.target.value)}
              className="reg-input"
              max={new Date().toISOString().split('T')[0]}
            />
          ))}

        {field('Height',
          <div className="reg-input-wrap">
            <Ruler size={18} className="reg-input-icon" />
            <select value={formData.heightId || ''} onChange={(e) => handleChange('heightId', Number(e.target.value) || '')} className="reg-input reg-select" disabled={!isLoaded}>
              <option value="">Select height</option>
              {masterData.heights?.map((h, i) => <option key={`height-${h.id}-${i}`} value={h.id}>{h.name}</option>)}
            </select>
          </div>)}

        {field('Weight (kg)',
          iconInput(<Weight size={18} className="reg-input-icon" />,
            <input type="number" value={formData.weight || ''} onChange={(e) => handleChange('weight', e.target.value)}
              placeholder="e.g. 65" className="reg-input" />
          ))}
      </div>

      <div className="reg-grid">
        {field('Marital Status',
          <div className="reg-input-wrap">
            <select value={formData.maritalStatusId || ''} onChange={(e) => handleChange('maritalStatusId', Number(e.target.value) || '')} className="reg-input reg-select" disabled={!isLoaded}>
              <option value="">Select status</option>
              {masterData.maritalStatuses?.map((m, i) => <option key={`marital-${m.id}-${i}`} value={m.id}>{m.name}</option>)}
            </select>
          </div>)}

        {field('Current City',
          iconInput(<MapPin size={18} className="reg-input-icon" />,
            <input type="text" value={formData.city || ''} onChange={(e) => handleChange('city', e.target.value)}
              placeholder="e.g. Mumbai, New York" className="reg-input" />
          ))}
      </div>

      <div className="reg-grid">
        {field('Occupation Area',
          <div className="reg-input-wrap">
            <Briefcase size={18} className="reg-input-icon" />
            <select value={formData.occupationId || ''} onChange={(e) => handleChange('occupationId', Number(e.target.value) || '')} className="reg-input reg-select" disabled={!isLoaded}>
              <option value="">Select occupation</option>
              {masterData.occupations?.map((o, i) => <option key={`occupation-${o.id}-${i}`} value={o.id}>{o.name}</option>)}
            </select>
          </div>)}

        {field('Job Title / Designation',
          <div className="reg-input-wrap">
            <input type="text" value={formData.occupation || ''} onChange={(e) => handleChange('occupation', e.target.value)}
              placeholder="e.g. Senior Software Engineer" className="reg-input" />
          </div>)}
      </div>


      {field('Highest Qualification',
        <div className="reg-input-wrap">
          <GraduationCap size={18} className="reg-input-icon" />
          <select value={formData.educationId || ''} onChange={(e) => handleChange('educationId', Number(e.target.value) || '')} className="reg-input reg-select" disabled={!isLoaded}>
            <option value="">Select qualification</option>
            {masterData.educations?.map((ed, i) => <option key={`education-${ed.id}-${i}`} value={ed.id}>{ed.name}</option>)}
          </select>
        </div>)}

      <div className="reg-actions">
        <button type="button" className="reg-btn reg-btn-ghost" onClick={onBack}>{mode === 'edit' ? 'Cancel' : 'Previous'}</button>
        <button type="submit" className="reg-btn reg-btn-primary">{mode === 'edit' ? 'Save Changes' : 'Save & Continue'} <span aria-hidden="true">→</span></button>
      </div>
    </form>
  );
};
