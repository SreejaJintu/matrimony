import { useState, useEffect } from 'react';
import { User, Users, Home, Briefcase } from 'lucide-react';

export const FamilyDetailsStep = ({ initialData, onSubmit, onBack, masterData = {}, mode = 'create' }) => {
  const [formData, setFormData] = useState(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  useEffect(() => {
    setIsLoaded(Boolean(masterData.familyTypes?.length || masterData.familyStatuses?.length || masterData.familyValues?.length));
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
        {field("Father's Name",
          iconInput(<User size={18} className="reg-input-icon" />,
            <input type="text" value={formData.fatherName} onChange={(e) => handleChange('fatherName', e.target.value)}
              placeholder="Enter father's name" className="reg-input" />
          ))}

        {field("Father's Occupation",
          <div className="reg-input-wrap">
            <Briefcase size={18} className="reg-input-icon" />
            <select value={formData.fatherOccupationId || ''} onChange={(e) => handleChange('fatherOccupationId', Number(e.target.value) || '')} className="reg-input reg-select" disabled={!isLoaded}>
              <option value="">Select occupation</option>
              {masterData.occupations?.map((item, i) => <option key={`father-occ-${item.id}-${i}`} value={item.id}>{item.name}</option>)}
            </select>
          </div>)}
      </div>

      <div className="reg-grid">
        {field("Mother's Name",
          iconInput(<User size={18} className="reg-input-icon" />,
            <input type="text" value={formData.motherName} onChange={(e) => handleChange('motherName', e.target.value)}
              placeholder="Enter mother's name" className="reg-input" />
          ))}

        {field("Mother's Occupation",
          <div className="reg-input-wrap">
            <Briefcase size={18} className="reg-input-icon" />
            <select value={formData.motherOccupationId || ''} onChange={(e) => handleChange('motherOccupationId', Number(e.target.value) || '')} className="reg-input reg-select" disabled={!isLoaded}>
              <option value="">Select occupation</option>
              {masterData.occupations?.map((item, i) => <option key={`mother-occ-${item.id}-${i}`} value={item.id}>{item.name}</option>)}
            </select>
          </div>)}
      </div>

      <div className="reg-grid">
        {field('Family Type',
          <div className="reg-input-wrap">
            <Home size={18} className="reg-input-icon" />
            <select value={formData.familyTypeId || ''} onChange={(e) => handleChange('familyTypeId', Number(e.target.value) || '')} className="reg-input reg-select" disabled={!isLoaded}>
              <option value="">Select family type</option>
              {masterData.familyTypes?.map((t, i) => <option key={`family-type-${t.id}-${i}`} value={t.id}>{t.name}</option>)}
            </select>
          </div>)}

        {field('Family Status',
          <div className="reg-input-wrap">
            <select value={formData.familyStatusId || ''} onChange={(e) => handleChange('familyStatusId', Number(e.target.value) || '')} className="reg-input reg-select" disabled={!isLoaded}>
              <option value="">Select family status</option>
              {masterData.familyStatuses?.map((s, i) => <option key={`family-status-${s.id}-${i}`} value={s.id}>{s.name}</option>)}
            </select>
          </div>)}
      </div>



      <div className="reg-grid">
        {field('No. of Brothers',
          <div className="reg-input-wrap">
            <Users size={18} className="reg-input-icon" />
            <input type="number" min="0" max="10" value={formData.brothers} onChange={(e) => handleChange('brothers', e.target.value)}
              placeholder="0" className="reg-input" />
          </div>)}

        {field('No. of Sisters',
          <div className="reg-input-wrap">
            <Users size={18} className="reg-input-icon" />
            <input type="number" min="0" max="10" value={formData.sisters} onChange={(e) => handleChange('sisters', e.target.value)}
              placeholder="0" className="reg-input" />
          </div>)}
      </div>

      {field('About Family',
        <textarea value={formData.aboutFamily} onChange={(e) => handleChange('aboutFamily', e.target.value)}
          placeholder="Tell us a little about your family background..."
          className="reg-input reg-textarea" rows={3} />
      )}

      <div className="reg-actions">
        <button type="button" className="reg-btn reg-btn-ghost" onClick={onBack}>{mode === 'edit' ? 'Cancel' : 'Previous'}</button>
        <button type="submit" className="reg-btn reg-btn-primary">{mode === 'edit' ? 'Save Changes' : 'Save & Continue'} <span aria-hidden="true">→</span></button>
      </div>
    </form>
  );
};