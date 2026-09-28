import { useState, useRef } from 'react';
import { Camera, Upload, X, Star, ImagePlus, Loader } from 'lucide-react';
import { api } from '../../services/api';
import { processPhotoToStandardSize } from '../../utils/imageProcess';

export const UploadPhotosStep = ({ initialData, onSubmit, onBack, isSubmitting, mode = 'create' }) => {
  const [photos, setPhotos] = useState(initialData.photos || []);
  const [profilePhotoIndex, setProfilePhotoIndex] = useState(initialData.profilePhotoIndex || 0);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    setError('');
    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith('image/')) { setError('Only image files (JPG, PNG, WebP) are allowed.'); return false; }
      if (file.size > 10 * 1024 * 1024) { setError('Each photo must be under 10MB.'); return false; }
      return true;
    });
    if (validFiles.length === 0) return;

    const remaining = 6 - photos.length;
    const filesToProcess = validFiles.slice(0, remaining);

    setUploading(true);

    // Process each image to standard 4:5 portrait size (600x750)
    const standardizedFiles = await Promise.all(
      filesToProcess.map((file) => processPhotoToStandardSize(file, 600, 750))
    );

    // Add placeholder items with uploading state
    const placeholders = standardizedFiles.map((file) => ({
      id: `uploading-${Date.now()}-${file.name}`,
      name: file.name,
      url: URL.createObjectURL(file), // preview only while uploading
      uploading: true,
    }));
    setPhotos((prev) => [...prev, ...placeholders].slice(0, 6));

    try {
      // Upload each standardized file to the server
      const uploaded = await Promise.all(
        standardizedFiles.map(async (file, i) => {
          const result = await api.uploadPhoto(file);
          return {
            id: `photo-${Date.now()}-${i}-${file.name}`,
            name: file.name,
            url: result.data, // real public URL
            uploading: false,
          };
        })
      );

      // Replace placeholders with real uploaded photos
      setPhotos((prev) => {
        const withoutPlaceholders = prev.filter((p) => !p.uploading);
        return [...withoutPlaceholders, ...uploaded].slice(0, 6);
      });
    } catch (err) {
      console.error('Upload failed:', err);
      const serverMessage =
        err.response?.data?.message ||
        err.response?.data?.Message ||
        err.message;
      setError(serverMessage || 'Failed to upload one or more photos. Please try again.');
      setPhotos((prev) => prev.filter((p) => !p.uploading));
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (id) => {
    setPhotos((prev) => {
      const next = prev.filter((p) => p.id !== id);
      if (profilePhotoIndex >= next.length && next.length > 0) setProfilePhotoIndex(0);
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (photos.some((p) => p.uploading)) {
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
          <p>Upload up to 6 photos. Standard 4:5 portrait size (600×750 px) is applied automatically so your photos fit featured cards and profile views perfectly.</p>
        </div>
      </div>

      <div className="reg-upload-grid">
        {photos.map((photo, index) => (
          <div key={photo.id} className={`reg-upload-item ${index === profilePhotoIndex ? 'is-profile' : ''} ${photo.uploading ? 'is-uploading' : ''}`}>
            <img src={photo.url} alt={photo.name} />
            {photo.uploading && (
              <div className="reg-upload-progress">
                <Loader size={20} className="reg-upload-spinner" />
                <span>Fitting & Uploading...</span>
              </div>
            )}
            {!photo.uploading && index === profilePhotoIndex && (
              <span className="reg-upload-profile-badge"><Star size={12} fill="currentColor" /> Profile</span>
            )}
            {!photo.uploading && (
              <button type="button" className="reg-upload-remove" onClick={() => handleRemove(photo.id)} aria-label="Remove photo">
                <X size={14} />
              </button>
            )}
            {!photo.uploading && index !== profilePhotoIndex && (
              <button type="button" className="reg-upload-set-profile" onClick={() => setProfilePhotoIndex(index)}>
                Set as Profile
              </button>
            )}
          </div>
        ))}

        {photos.length < 6 && !uploading && (
          <button type="button" className="reg-upload-add" onClick={() => fileInputRef.current?.click()}>
            <ImagePlus size={24} />
            <span>Add Photo</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
      />

      {error && <p className="reg-error">{error}</p>}

      <div className="reg-upload-note">
        <Upload size={16} />
        <p>
          <strong>Required Size:</strong> Portrait orientation (4:5 ratio, min 600×750 px). All photos will be automatically auto-cropped to the required frame without distortion.
        </p>
      </div>

      <div className="reg-actions">
        <button type="button" className="reg-btn reg-btn-ghost" onClick={onBack}>{mode === 'edit' ? 'Cancel' : 'Previous'}</button>
        <button type="submit" className="reg-btn reg-btn-primary" disabled={isSubmitting || uploading}>
          {uploading ? 'Uploading...' : isSubmitting ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Complete Registration')}
        </button>
      </div>
    </form>
  );
};