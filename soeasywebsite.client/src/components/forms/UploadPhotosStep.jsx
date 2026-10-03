import { useState, useRef } from 'react';
import { Camera, Upload, X, Star, ImagePlus, Loader } from 'lucide-react';
import { api } from '../../services/api';
import { ImageCropModal } from './ImageCropModal';

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
  const [cropFile, setCropFile] = useState(null);
  const [cropQueue, setCropQueue] = useState([]);
  const [cropSaving, setCropSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    setError('');
    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith('image/')) { setError('Only image files (JPG, PNG, WebP) are allowed.'); return false; }
      if (file.size > 10 * 1024 * 1024) { setError('Each photo must be under 10MB.'); return false; }
      return true;
    });
    const remaining = Math.max(0, 6 - photos.length);
    const filesToCrop = validFiles.slice(0, remaining);
    if (validFiles.length > filesToCrop.length) setError('A profile can have up to 6 photos.');
    if (!filesToCrop.length) return;
    setCropFile(filesToCrop[0]);
    setCropQueue(filesToCrop.slice(1));
    setUploading(true);
  };

  const handleCropSave = async (croppedFile) => {
    setCropSaving(true);
    try {
      const result = await api.uploadPhoto(croppedFile);
      if (result?.success === false || result?.Success === false) {
        throw new Error(result?.message || result?.Message || 'Unable to upload photo.');
      }
      const uploadedUrl = result?.data ?? result?.Data;
      if (!uploadedUrl) throw new Error('Photo upload did not return a URL.');
      setPhotos((current) => [...current, {
        id: `photo-${Date.now()}-${croppedFile.name}`,
        name: cropFile?.name || croppedFile.name,
        url: uploadedUrl,
        uploading: false,
        isNew: true,
      }].slice(0, 6));

      const [nextFile, ...remainingFiles] = cropQueue;
      setCropQueue(remainingFiles);
      setCropFile(nextFile || null);
      if (!nextFile) setUploading(false);
      setError('');
    } catch (err) {
      console.error('Upload failed:', err);
      const serverMessage = err.response?.data?.message || err.response?.data?.Message || err.message;
      setError(serverMessage || 'Failed to upload photo. Please try again.');
    } finally {
      setCropSaving(false);
    }
  };

  const handleCropCancel = () => {
    setCropFile(null);
    setCropQueue([]);
    setUploading(false);
    setCropSaving(false);
  };

  const handleRemove = (id) => {
    setPhotos((prev) => {
      const next = prev.filter((p) => p.id !== id);
      if (profilePhotoIndex >= next.length && next.length > 0) setProfilePhotoIndex(0);
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (uploading || photos.some((photo) => photo.uploading)) {
      setError('Please wait for all photos to finish uploading.');
      return;
    }
    onSubmit({ ...initialData, photos, profilePhotoIndex });
  };

  return (
    <form onSubmit={handleSubmit} className="reg-form" noValidate>
      <div className="reg-upload-intro">
        <Camera size={28} className="reg-upload-icon" />
        <div>
          <strong>Add Your Photos</strong>
          <p>Upload up to 6 photos. Crop each image to the standard 4:5 portrait frame (600×750 px) before uploading.</p>
        </div>
      </div>

      <div className="reg-upload-grid">
        {photos.map((photo, index) => (
          <div key={photo.id || photo.photoId || index} className={`reg-upload-item ${index === profilePhotoIndex ? 'is-profile' : ''} ${photo.uploading ? 'is-uploading' : ''}`}>
            <img src={photo.url || photo.photoUrl} alt={photo.name || 'Profile photo'} />
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

      <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={(event) => { const files = event.target.files; event.target.value = ''; if (files?.length) handleFiles(files); }} />
      {uploading && <p className="reg-uploading-message"><Loader size={15} className="reg-upload-spinner" /> Crop and upload each selected photo to continue.</p>}
      {error && <p className="reg-error" role="alert">{error}</p>}

      <div className="reg-upload-note"><Upload size={16} /><p><strong>Photo format:</strong> Crop to a 4:5 portrait frame. You can reposition and zoom each photo before upload.</p></div>

      <div className="reg-actions">
        <button type="button" className="reg-btn reg-btn-ghost" onClick={onBack}>{mode === 'edit' ? 'Cancel' : 'Previous'}</button>
        <button type="submit" className="reg-btn reg-btn-primary" disabled={isSubmitting || uploading}>{uploading ? 'Uploading...' : isSubmitting ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Complete Registration')}</button>
      </div>

      {cropFile && <ImageCropModal key={`${cropFile.name}-${cropQueue.length}`} file={cropFile} onCancel={handleCropCancel} onSave={handleCropSave} saving={cropSaving} />}
    </form>
  );
};
