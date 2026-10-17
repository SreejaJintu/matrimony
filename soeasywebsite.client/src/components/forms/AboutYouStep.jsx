import { useState, useEffect } from 'react';
import { Briefcase, GraduationCap, Landmark, MapPin, Users, Ruler, Weight, Calendar, Star } from 'lucide-react';
import { api } from '../../services/api';

export const AboutYouStep = ({ initialData, onSubmit, onBack, masterData = {}, mode = 'create' }) => {
  const [formData, setFormData] = useState(initialData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [communityOptions, setCommunityOptions] = useState(masterData.communities || []);
  const [districts, setDistricts] = useState(masterData.districts || []);

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  useEffect(() => {
    setIsLoaded(Boolean(masterData.heights?.length || masterData.educations?.length || masterData.maritalStatuses?.length));
  }, [masterData]);

  useEffect(() => {
    if (masterData.districts?.length) {
      setDistricts(masterData.districts);
      return;
    }

    let active = true;
    api.getMasterDistricts()
      .then((response) => {
        const data = response?.data ?? response?.Data ?? response ?? [];
        if (active) setDistricts(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error('Failed to load districts:', error);
        if (active) setDistricts([]);
      });

    return () => {
      active = false;
    };
  }, [masterData.districts]);

  useEffect(() => {
    let active = true;
    const fetchCommunities = async () => {
      if (!formData.religionId) {
        setCommunityOptions([]);
        return;
      }

      try {
        const response = await api.getMasterCommunity(formData.religionId);
        const communities = response?.data ?? response?.Data ?? [];
        if (active) setCommunityOptions(communities);
      } catch (error) {
        console.error('Failed to load communities:', error);
        if (active) setCommunityOptions([]);
      }
    };

    fetchCommunities();
    return () => {
      active = false;
    };
  }, [formData.religionId]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      if (field === 'religionId') {
        return { ...prev, religionId: value, communityId: '' };
      }
      return { ...prev, [field]: value };
    });
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

        {field('Marital Status',
          <div className="reg-input-wrap">
            <select value={formData.maritalStatusId || ''} onChange={(e) => handleChange('maritalStatusId', Number(e.target.value) || '')} className="reg-input reg-select" disabled={!isLoaded}>
              <option value="">Select status</option>
              {masterData.maritalStatuses?.map((m, i) => <option key={`marital-${m.id}-${i}`} value={m.id}>{m.name}</option>)}
            </select>
          </div>)}
      </div>

      <div className="reg-grid">
        {field('Birth Star',
          <div className="reg-input-wrap">
            <Star size={18} className="reg-input-icon" />
            <select
              value={formData.birthStarId || ''}
              onChange={(e) => handleChange('birthStarId', Number(e.target.value) || '')}
              className="reg-input reg-select"
            >
              <option value="">Select birth star</option>
              {masterData.birthStars?.map((star, index) => {
                const id = star.id ?? star.Id;
                const name = star.name ?? star.Name;
                return <option key={`birth-star-${id ?? index}`} value={id}>{name}</option>;
              })}
            </select>
          </div>)}

        {field('Religion',
          <div className="reg-input-wrap">
            <Landmark size={18} className="reg-input-icon" />
            <select
              value={formData.religionId || ''}
              onChange={(e) => handleChange('religionId', Number(e.target.value) || '')}
              className="reg-input reg-select"
            >
              <option value="">Select religion</option>
              {masterData.religions?.map((religion, index) => {
                const id = religion.id ?? religion.Id;
                const name = religion.name ?? religion.Name;
                return <option key={`religion-${id ?? index}`} value={id}>{name}</option>;
              })}
            </select>
          </div>)}

        {field('Community',
          <div className="reg-input-wrap">
            <Users size={18} className="reg-input-icon" />
            <select
              value={formData.communityId || ''}
              onChange={(e) => handleChange('communityId', Number(e.target.value) || '')}
              className="reg-input reg-select"
              disabled={!formData.religionId}
            >
              <option value="">{formData.religionId ? 'Select community' : 'Select religion first'}</option>
              {communityOptions.map((community, index) => {
                const id = community.id ?? community.Id;
                const name = community.name ?? community.Name;
                return <option key={`community-${id ?? index}`} value={id}>{name}</option>;
              })}
            </select>
          </div>)}

        {field('District',
          <div className="reg-input-wrap">
            <MapPin size={18} className="reg-input-icon" />
            <select
              value={formData.districtId || ''}
              onChange={(e) => handleChange('districtId', Number(e.target.value) || '')}
              className="reg-input reg-select"
            >
              <option value="">Select district</option>
              {districts.map((district, index) => {
                const id = district.id ?? district.Id;
                const name = district.name ?? district.Name;
                return <option key={`district-${id ?? index}`} value={id}>{name}</option>;
              })}
            </select>
          </div>)}
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
