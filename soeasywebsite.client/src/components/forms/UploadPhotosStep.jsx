import { useState, useRef } from 'react';
import { Camera, Upload, X, Star, ImagePlus, Loader } from 'lucide-react';
import { api } from '../../services/api';

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

export const UploadPhotosStep = ({ initialData, onSubmit, onBack, isSubmitting, mode = 'create' }) => {
  const [photos, setPhotos] = useState(() => (initialData.photos || []).map((photo, index) => ({
    ...photo,
    id: photo.id ?? photo.photoId ?? photo.PhotoId ?? `existing-photo-${index}`,
    url: photo.url ?? photo.photoUrl ?? photo.PhotoUrl ?? '',
    isProfilePhoto: photo.isProfilePhoto ?? photo.IsProfilePhoto ?? photo.isPrimary ?? false,
    isNew: photo.isNew ?? false,
  })));
  const [profilePhotoIndex, setProfilePhotoIndex] = useState(() => {
    if (Number.isInteger(initialData.profilePhotoIndex)) return initialData.profilePhotoIndex;
    const primaryIndex = (initialData.photos || []).findIndex((photo) => photo.isProfilePhoto || photo.IsProfilePhoto || photo.isPrimary);
    return Math.max(primaryIndex, 0);
  });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    setError('');
    const validationErrors = [];
    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith('image/')) {
        validationErrors.push('Only image files are allowed.');
        return false;
      }
      if (file.size > MAX_PHOTO_SIZE) {
        validationErrors.push('Each photo must be under 5MB.');
        return false;
      }
      return true;
    });
    const remaining = Math.max(0, 6 - photos.length);
    const filesToUpload = validFiles.slice(0, remaining);
    if (validFiles.length > filesToUpload.length) validationErrors.push('A profile can have up to 6 photos.');
    if (validationErrors.length) setError(validationErrors[0]);
    if (!filesToUpload.length) return;

    const pendingPhotos = filesToUpload.map((file) => ({
      id: `photo-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      url: URL.createObjectURL(file),
      uploading: true,
      isNew: true,
    }));
    setPhotos((current) => [...current, ...pendingPhotos].slice(0, 6));
    setUploading(true);
    const uploadErrors = [];
    await Promise.all(filesToUpload.map(async (file, index) => {
      const pendingPhoto = pendingPhotos[index];
      try {
        const result = await api.uploadPhoto(file);
        if (result?.success === false || result?.Success === false) {
          throw new Error(result?.message || result?.Message || 'Unable to upload photo.');
        }
        const uploadedUrl = result?.data ?? result?.Data;
        if (typeof uploadedUrl !== 'string' || !uploadedUrl.trim()) {
          throw new Error('Photo upload did not return a URL.');
        }
        URL.revokeObjectURL(pendingPhoto.url);
        setPhotos((current) => current.map((photo) => (
          photo.id === pendingPhoto.id
            ? { ...photo, url: uploadedUrl, uploading: false }
            : photo
        )));
      } catch (err) {
        console.error('Upload failed:', err);
        URL.revokeObjectURL(pendingPhoto.url);
        setPhotos((current) => current.filter((photo) => photo.id !== pendingPhoto.id));
        uploadErrors.push(
          err.response?.data?.message ||
          err.response?.data?.Message ||
          err.message ||
          'Failed to upload photo. Please try again.',
        );
      }
    }));
    setUploading(false);
    if (uploadErrors.length) setError(uploadErrors[0]);
  };

  const handleRemove = (id) => {
    const removedIndex = photos.findIndex((photo) => photo.id === id);
    if (removedIndex >= 0 && removedIndex < profilePhotoIndex) {
      setProfilePhotoIndex((index) => index - 1);
    } else if (removedIndex === profilePhotoIndex) {
      setProfilePhotoIndex(Math.max(0, Math.min(profilePhotoIndex, photos.length - 2)));
    }
    setPhotos((prev) => {
      return prev.filter((photo) => photo.id !== id);
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (uploading || photos.some((photo) => photo.uploading)) {
      setError('Please wait for all photos to finish uploading.');
      return;
    }
    const uploadedPhotos = photos.filter((photo) => typeof photo.url === 'string' && photo.url.trim());
    if (!uploadedPhotos.length) {
      setError('Please upload at least one photo.');
      return;
    }
    onSubmit({ ...initialData, photos: uploadedPhotos, profilePhotoIndex });
  };

  return (
    <form onSubmit={handleSubmit} className="reg-form" noValidate>
      <div className="reg-upload-intro">
        <Camera size={28} className="reg-upload-icon" />
        <div>
          <strong>Add Your Photos</strong>
          <p>Select up to 6 photos under 5MB each. Photos upload directly without cropping.</p>
        </div>
      </div>

      <div className="reg-upload-grid">
        {photos.map((photo, index) => (
          <div key={photo.id || photo.photoId || index} className={`reg-upload-item ${index === profilePhotoIndex ? 'is-profile' : ''} ${photo.uploading ? 'is-uploading' : ''}`}>
            <img src={photo.previewUrl || photo.url || photo.photoUrl} alt={photo.name || 'Profile photo'} />
            {photo.uploading && <div className="reg-upload-progress"><Loader size={20} className="reg-upload-spinner" /><span>Uploading...</span></div>}
            {!photo.uploading && index === profilePhotoIndex && <span className="reg-upload-profile-badge"><Star size={12} fill="currentColor" /> Profile</span>}
            {!photo.uploading && <button type="button" className="reg-upload-remove" onClick={() => handleRemove(photo.id || photo.photoId)} aria-label="Remove photo"><X size={14} /></button>}
            {!photo.uploading && index !== profilePhotoIndex && <button type="button" className="reg-upload-set-profile" onClick={() => setProfilePhotoIndex(index)}>Set as Profile</button>}
          </div>
        ))}

        {photos.length < 6 && !uploading && (
          <button type="button" className="reg-upload-add" onClick={() => fileInputRef.current?.click()}>
            <ImagePlus size={24} /><span>Add Photo</span>
          </button>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={(event) => { const files = Array.from(event.target.files || []); event.target.value = ''; if (files.length) handleFiles(files); }} />
      {uploading && <p className="reg-uploading-message"><Loader size={15} className="reg-upload-spinner" /> Uploading selected photos...</p>}
      {error && <p className="reg-error" role="alert">{error}</p>}

      <div className="reg-upload-note"><Upload size={16} /><p><strong>Photo format:</strong> JPG, PNG, GIF, or WebP, under 5MB per photo.</p></div>

      <div className="reg-actions">
        <button type="button" className="reg-btn reg-btn-ghost" onClick={onBack}>{mode === 'edit' ? 'Cancel' : 'Previous'}</button>
        <button type="submit" className="reg-btn reg-btn-primary" disabled={isSubmitting || uploading}>{uploading ? 'Uploading...' : isSubmitting ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Complete Registration')}</button>
      </div>
    </form>
  );
};
