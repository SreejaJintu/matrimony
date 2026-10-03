import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { api } from "../../services/api";

import adminProfileService from "../services/adminProfileService";
import { ImageCropModal } from "../../components/forms/ImageCropModal";

import AdminProfileFilters from "../components/AdminProfileFilters";
import AdminProfileTable from "../components/AdminProfileTable";
import AdminProfileShareModal from "../components/AdminProfileShareModal";

import "../styles/adminProfiles.css";

const AdminProfiles = () => {
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState("");
  const [genderId, setGenderId] = useState("");
  const [profileStatusId, setProfileStatusId] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);
  const [sharingProfiles, setSharingProfiles] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [marriedUpdatingId, setMarriedUpdatingId] = useState(null);
  const [resettingProfile, setResettingProfile] = useState(null);
  const [resetPassword, setResetPassword] = useState("");
  const [confirmResetPassword, setConfirmResetPassword] = useState("");
  const [resetPasswordError, setResetPasswordError] = useState("");
  const [resetPasswordMessage, setResetPasswordMessage] = useState("");
  const [resettingPassword, setResettingPassword] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [editError, setEditError] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [deletingPhotoId, setDeletingPhotoId] = useState(null);
  const [settingProfilePhotoId, setSettingProfilePhotoId] = useState(null);
  const [photoCropFile, setPhotoCropFile] = useState(null);
  const [photoCropQueue, setPhotoCropQueue] = useState([]);
  const [masterData, setMasterData] = useState({
    heights: [],
    maritalStatuses: [],
    motherTongues: [],
    religions: [],
    communities: [],
    educations: [],
    occupations: [],
    incomes: [],
    countries: [],
    states: [],
    districts: [],
  });

  useEffect(() => {
    const loadMasterData = async () => {
      const requests = await Promise.allSettled([
        api.getMasterHeight(),
        api.getMasterMaritalStatus(),
        api.getMasterMotherTongue(),
        api.getMasterReligion(),
        api.getMasterEducation(),
        api.getMasterOccupation(),
        api.getMasterIncome(),
        api.getMasterCountry(),
      ]);

      const extract = (result) => {
        if (result.status !== "fulfilled") return [];
        const value = result.value;
        return Array.isArray(value) ? value : value?.data ?? value?.Data ?? [];
      };

      setMasterData((current) => ({
        ...current,
        heights: extract(requests[0]),
        maritalStatuses: extract(requests[1]),
        motherTongues: extract(requests[2]),
        religions: extract(requests[3]),
        educations: extract(requests[4]),
        occupations: extract(requests[5]),
        incomes: extract(requests[6]),
        countries: extract(requests[7]),
      }));
    };

    loadMasterData();
  }, []);

  const loadProfiles = async (requestedPage = page, filters = { search, genderId, profileStatusId }) => {
    try {
      setLoading(true);
      setError("");

      const result =
        await adminProfileService.getProfiles({
          ...filters,
          page: requestedPage,
          pageSize,
        });

      if (result.success) {
        setProfiles((result.data || []).filter(
          (profile) => profile.isActive !== false && profile.IsActive !== false
        ));
        setPage(result.pagination?.page ?? requestedPage);
        setTotalCount(result.pagination?.totalCount ?? 0);
      } else {
        setProfiles([]);
        setError(
          result.message || "Unable to load profiles."
        );
      }
    } catch (error) {
      console.error(
        "ADMIN PROFILE ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to load profiles."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleClear = () => {
    setSearch("");
    setGenderId("");
    setProfileStatusId("");

    loadProfiles(1, { search: "", genderId: "", profileStatusId: "" });
  };

  const handleSearch = () => loadProfiles(1);

  const handleView = (profile) => {
    console.log(
      "Selected admin profile:",
      profile
    );

    // We'll build the admin profile detail page next.
    navigate(
      `/admin/profiles/${profile.userId}`
    );
  };

  const handleDelete = async (profile) => {
    const confirmed = window.confirm(
      `Delete ${profile.fullName}'s profile? This will deactivate the profile.`
    );
    if (!confirmed) return;

    try {
      const result = await adminProfileService.deleteProfile(profile.userId);
      if (result?.success === false) {
        throw new Error(result.message || "Unable to delete profile.");
      }
      setProfiles((current) => current.filter((item) => item.userId !== profile.userId));
    } catch (deleteError) {
      window.alert(
        deleteError.response?.data?.message || deleteError.message || "Unable to delete profile."
      );
    }
  };

  const openPasswordReset = (profile) => {
    setResettingProfile(profile);
    setResetPassword("");
    setConfirmResetPassword("");
    setResetPasswordError("");
    setResetPasswordMessage("");
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    setResetPasswordError("");
    if (resetPassword.length < 8) {
      setResetPasswordError("Password must be at least 8 characters.");
      return;
    }
    if (resetPassword !== confirmResetPassword) {
      setResetPasswordError("Passwords do not match.");
      return;
    }
    setResettingPassword(true);
    try {
      const result = await adminProfileService.resetPassword(resettingProfile.userId, resetPassword);
      if (result?.success === false) throw new Error(result.message || "Unable to reset password.");
      setResetPasswordMessage("Password reset successfully.");
      setResetPassword("");
      setConfirmResetPassword("");
      window.setTimeout(() => setResettingProfile(null), 900);
    } catch (resetError) {
      setResetPasswordError(resetError.response?.data?.message || resetError.message || "Unable to reset password.");
    } finally {
      setResettingPassword(false);
    }
  };

  const handleStatusChange = async (profile, profileStatusId) => {
    setStatusUpdatingId(profile.userId);
    setActionError("");
    try {
      const result = await adminProfileService.updateProfileStatus(profile.userId, profileStatusId);
      if (result?.success === false || result?.Success === false) {
        throw new Error(result.message || result.Message || "Unable to update profile status.");
      }
      const statusName = profileStatusId === 2 ? "Approved" : "Rejected";
      setProfiles((current) => current.map((item) =>
        item.userId === profile.userId
          ? { ...item, profileStatusId, statusName }
          : item
      ));
    } catch (statusError) {
      setActionError(statusError.response?.data?.message || statusError.message || "Unable to update profile status.");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleMarriedChange = async (profile) => {
    const nextIsMarried = !(profile.isMarried ?? profile.IsMarried ?? false);
    setMarriedUpdatingId(profile.userId);
    setActionError("");
    try {
      const result = await adminProfileService.updateMaritalStatus(profile.userId, nextIsMarried);
      if (result?.success === false || result?.Success === false) {
        throw new Error(result.message || result.Message || "Unable to update marital status.");
      }
      setProfiles((current) => current.map((item) =>
        item.userId === profile.userId
          ? { ...item, isMarried: nextIsMarried }
          : item
      ));
    } catch (maritalError) {
      setActionError(maritalError.response?.data?.message || maritalError.message || "Unable to update marital status.");
    } finally {
      setMarriedUpdatingId(null);
    }
  };

  const handleEdit = async (profile) => {
    setEditError("");
    setEditMessage("");
    try {
      const result = await adminProfileService.getProfileById(profile.userId);
      const profileData = result?.data ?? result;
      const photoResult = await adminProfileService.getPhotos(profile.userId).catch(() => []);
      const photoRows = Array.isArray(photoResult)
        ? photoResult
        : photoResult?.data ?? photoResult?.Data ?? [];
      const countryId = profileData.countryId ?? profileData.CountryId;
      const stateId = profileData.stateId ?? profileData.StateId;

      const [communities, states] = await Promise.all([
        profileData.religionId
          ? api.getMasterCommunity(profileData.religionId).catch(() => [])
          : Promise.resolve([]),
        countryId
          ? api.getMasterState(countryId).catch(() => [])
          : Promise.resolve([]),
      ]);

      const districts = stateId
        ? await api.getMasterDistrict(stateId).catch(() => [])
        : [];
      const extract = (value) => Array.isArray(value) ? value : value?.data ?? value?.Data ?? [];

      setMasterData((current) => ({
        ...current,
        communities: extract(communities),
        states: extract(states),
        districts: extract(districts),
      }));

      setEditingProfile({
        userId: profileData.userId ?? profile.userId,
        fullName: profileData.fullName ?? "",
        mobileNumber: profileData.mobileNumber ?? profileData.MobileNumber ?? profile.mobileNumber ?? profile.MobileNumber ?? "",
        dateOfBirth: profileData.dateOfBirth ? String(profileData.dateOfBirth).slice(0, 10) : "",
        heightId: profileData.heightId ?? "",
        heightName: profileData.height ?? "",
        weight: profileData.weight ?? "",
        maritalStatusId: profileData.maritalStatusId ?? "",
        maritalStatusName: profileData.maritalStatus ?? "",
        motherTongueId: profileData.motherTongueId ?? "",
        motherTongueName: profileData.motherTongue ?? "",
        religionId: profileData.religionId ?? "",
        religionName: profileData.religion ?? "",
        communityId: profileData.communityId ?? "",
        communityName: profileData.community ?? "",
        educationId: profileData.educationId ?? "",
        educationName: profileData.education ?? "",
        occupationId: profileData.occupationId ?? "",
        occupationName: profileData.occupation ?? "",
        companyName: profileData.companyName ?? "",
        designation: profileData.designation ?? "",
        incomeId: profileData.incomeId ?? "",
        incomeName: profileData.income ?? "",
        countryId: countryId ?? "",
        countryName: profileData.country ?? profileData.Country ?? "",
        stateId: stateId ?? "",
        stateName: profileData.state ?? profileData.State ?? "",
        districtId: profileData.districtId ?? profileData.DistrictId ?? "",
        districtName: profileData.district ?? profileData.District ?? "",
        address: profileData.address ?? "",
        pincode: profileData.pincode ?? "",
        aboutMe: profileData.aboutMe ?? "",
      });
      const initialPhotoUrl =
        profileData.imageUrl ||
        profileData.ImageUrl ||
        profileData.profileImageUrl ||
        profileData.ProfileImageUrl ||
        "";
      const existingPhotos = photoRows.map((photo) => ({
        id: `photo-${photo.photoId ?? photo.PhotoId}`,
        photoId: photo.photoId ?? photo.PhotoId,
        url: photo.photoUrl ?? photo.PhotoUrl,
        isProfilePhoto: photo.isProfilePhoto ?? photo.IsProfilePhoto ?? false,
        isNew: false,
      }));
      if (!existingPhotos.length && initialPhotoUrl) {
        existingPhotos.push({
          id: "current-profile-photo",
          url: initialPhotoUrl,
          isProfilePhoto: true,
          isNew: false,
        });
      }
      setPhotos(existingPhotos);
    } catch (error) {
      console.error("ADMIN PROFILE LOAD ERROR:", error);
      setEditError(error.response?.data?.message || "Unable to load profile for editing.");
    }
  };

  const closeEditor = () => {
    setEditingProfile(null);
    setEditError("");
    setEditMessage("");
    setPhotos([]);
  };

  const handlePhotoChange = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";
    if (!selectedFiles.length) return;

    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
    );
    const remainingSlots = Math.max(0, 6 - photos.length);
    const filesToUpload = validFiles.slice(0, remainingSlots);
    if (validFiles.length !== selectedFiles.length) {
      setEditError("Choose image files under 5MB each.");
    } else if (filesToUpload.length < validFiles.length) {
      setEditError("A profile can have up to 6 photos.");
    } else {
      setEditError("");
    }
    if (!filesToUpload.length) return;
    setPhotoCropFile(filesToUpload[0]);
    setPhotoCropQueue(filesToUpload.slice(1));
  };

  const handleAdminPhotoCropSave = async (croppedFile) => {
    try {
      setPhotoUploading(true);
      const result = await api.uploadPhoto(croppedFile);
      if (result?.success === false || result?.Success === false) {
        throw new Error(result.message || result.Message || "Unable to upload photo.");
      }
      const uploadedUrl = result?.data ?? result?.Data ?? "";
      if (!uploadedUrl) throw new Error("Photo upload did not return a URL.");
      setPhotos((current) => {
        const hasProfilePhoto = current.some((photo) => photo.isProfilePhoto);
        return [...current, {
          id: `new-photo-${Date.now()}-${croppedFile.name}`,
          url: uploadedUrl,
          isProfilePhoto: !hasProfilePhoto,
          isNew: true,
        }];
      });
      const [nextFile, ...remainingFiles] = photoCropQueue;
      setPhotoCropQueue(remainingFiles);
      setPhotoCropFile(nextFile || null);
    } catch (error) {
      setEditError(error.message || "Unable to upload photo.");
    } finally {
      setPhotoUploading(false);
    }
  };

  const cancelAdminPhotoCrop = () => {
    setPhotoCropFile(null);
    setPhotoCropQueue([]);
    setPhotoUploading(false);
  };

  const handleSetProfilePhoto = async (photo) => {
    if (photo.isProfilePhoto) return;
    if (photo.isNew) {
      setPhotos((current) => current.map((item) => ({
        ...item,
        isProfilePhoto: item.id === photo.id,
      })));
      return;
    }
    if (!editingProfile || !photo.photoId) return;

    setSettingProfilePhotoId(photo.id);
    setEditError("");
    try {
      const result = await adminProfileService.setProfilePhoto(editingProfile.userId, photo.photoId);
      if (result?.success === false) {
        throw new Error(result?.message || "Unable to update profile photo.");
      }
      setPhotos((current) => current.map((item) => ({
        ...item,
        isProfilePhoto: item.id === photo.id,
      })));
    } catch (error) {
      setEditError(error.response?.data?.message || error.message || "Unable to update profile photo.");
    } finally {
      setSettingProfilePhotoId(null);
    }
  };

  const handleRemovePhoto = async (photo) => {
    if (photo.isNew) {
      setPhotos((current) => current.filter((item) => item.id !== photo.id));
      return;
    }
    if (!photo.photoId || !editingProfile) {
      setEditError("This photo cannot be removed. Reload the profile and try again.");
      return;
    }

    setDeletingPhotoId(photo.id);
    setEditError("");
    try {
      const result = await adminProfileService.deletePhoto(editingProfile.userId, photo.photoId);
      if (result?.success === false) {
        throw new Error(result?.message || "Unable to remove photo.");
      }

      const response = await adminProfileService.getPhotos(editingProfile.userId);
      const refreshedRows = response?.data ?? response?.Data ?? response ?? [];
      const savedPhotos = (Array.isArray(refreshedRows) ? refreshedRows : []).map((item) => ({
        id: `photo-${item.photoId ?? item.PhotoId}`,
        photoId: item.photoId ?? item.PhotoId,
        url: item.photoUrl ?? item.PhotoUrl,
        isProfilePhoto: item.isProfilePhoto ?? item.IsProfilePhoto ?? false,
        isNew: false,
      }));
      setPhotos((current) => [...savedPhotos, ...current.filter((item) => item.isNew)]);
    } catch (error) {
      setEditError(error.response?.data?.message || error.message || "Unable to remove photo.");
    } finally {
      setDeletingPhotoId(null);
    }
  };

  const handleEditChange = async (field, value) => {
    setEditingProfile((prev) => {
      if (!prev) return prev;
      if (field === "religionId") {
        return { ...prev, religionId: value, communityId: "", communityName: "" };
      }
      if (field === "countryId") {
        return { ...prev, countryId: value, stateId: "", stateName: "", districtId: "", districtName: "" };
      }
      if (field === "stateId") {
        return { ...prev, stateId: value, districtId: "", districtName: "" };
      }
      return { ...prev, [field]: value };
    });

    if (field === "religionId") {
      const result = value
        ? await api.getMasterCommunity(value).catch(() => [])
        : [];
      const communities = Array.isArray(result)
        ? result
        : result?.data ?? result?.Data ?? [];
      setMasterData((current) => ({ ...current, communities }));
    }

    if (field === "countryId") {
      const result = value
        ? await api.getMasterState(value).catch(() => [])
        : [];
      const states = Array.isArray(result)
        ? result
        : result?.data ?? result?.Data ?? [];
      setMasterData((current) => ({ ...current, states, districts: [] }));
    }

    if (field === "stateId") {
      setEditError("");
      setMasterData((current) => ({ ...current, districts: [] }));
      if (!value) return;

      try {
        const result = await api.getMasterDistrict(value);
        const districts = Array.isArray(result)
          ? result
          : result?.data ?? result?.Data ?? [];
        setMasterData((current) => ({ ...current, districts }));
      } catch (error) {
        setEditError(error.message || "Unable to load districts for the selected state.");
      }
    }
  };

  const renderMasterSelect = (label, field, items, fallbackId, fallbackName) => {
    const options = [...items];
    if (fallbackId && !options.some((item) => String(item.id ?? item.Id) === String(fallbackId))) {
      options.unshift({ id: fallbackId, name: fallbackName || `Selected (${fallbackId})` });
    }

    return (
      <label>
        <span>{label}</span>
        <select value={editingProfile[field]} onChange={(event) => handleEditChange(field, event.target.value)}>
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((item) => (
            <option key={item.id ?? item.Id} value={item.id ?? item.Id}>
              {item.name ?? item.Name}
            </option>
          ))}
        </select>
      </label>
    );
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!editingProfile) return;

    setSaving(true);
    setEditError("");
    setEditMessage("");

    try {
      const nullableNumber = (value) => {
        if (value === "" || value == null) return null;
        const number = Number(value);
        return Number.isFinite(number) ? number : null;
      };

      const payload = {
        userId: Number(editingProfile.userId),
        dateOfBirth: editingProfile.dateOfBirth || null,
        heightId: nullableNumber(editingProfile.heightId),
        weight: nullableNumber(editingProfile.weight),
        maritalStatusId: nullableNumber(editingProfile.maritalStatusId),
        motherTongueId: nullableNumber(editingProfile.motherTongueId),
        religionId: nullableNumber(editingProfile.religionId),
        communityId: nullableNumber(editingProfile.communityId),
        educationId: nullableNumber(editingProfile.educationId),
        occupationId: nullableNumber(editingProfile.occupationId),
        companyName: editingProfile.companyName || null,
        designation: editingProfile.designation || null,
        incomeId: nullableNumber(editingProfile.incomeId),
        countryId: nullableNumber(editingProfile.countryId),
        stateId: nullableNumber(editingProfile.stateId),
        districtId: nullableNumber(editingProfile.districtId),
        address: editingProfile.address || null,
        pincode: editingProfile.pincode || null,
        aboutMe: editingProfile.aboutMe || null,
      };

      const result = await adminProfileService.updateProfile(payload);
      if (result?.success === false) {
        throw new Error(result?.message || "Unable to update profile.");
      }

      const mobileResult = await adminProfileService.updateMobileNumber(
        editingProfile.userId,
        editingProfile.mobileNumber || null
      );
      if (mobileResult?.success === false) {
        throw new Error(mobileResult?.message || "Unable to update phone number.");
      }

      const newPhotos = photos.filter((photo) => photo.isNew);
      for (const [index, photo] of newPhotos.entries()) {
        const photoResult = await api.savePhoto({
          userId: Number(editingProfile.userId),
          photoUrl: photo.url,
          isProfilePhoto: photo.isProfilePhoto,
          displayOrder: photos.indexOf(photo) + 1,
          isApproved: true,
          isActive: true,
        });
        if (photoResult?.success === false || photoResult?.Success === false) {
          throw new Error(photoResult?.message || photoResult?.Message || `Unable to save photo ${index + 1}.`);
        }
      }

      setEditMessage(result?.message || "Profile updated successfully.");
      await loadProfiles();
      setTimeout(() => closeEditor(), 800);
    } catch (error) {
      console.error("ADMIN PROFILE UPDATE ERROR:", error);
      setEditError(error.response?.data?.message || error.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-profiles-page">

      <div className="admin-page-heading">

        <div>
          <h2>Profiles</h2>

          <p>
            Manage registered Soesy matrimony profiles.
          </p>
        </div>

        <div className="admin-profile-heading-actions">
          <button type="button" className="admin-send-profiles-button" onClick={() => setSharingProfiles(true)}>
            Send Matching Profiles
          </button>
          <div className="profile-count">
            {totalCount} Profiles
          </div>
        </div>

      </div>

      <AdminProfileFilters
        search={search}
        setSearch={setSearch}
        genderId={genderId}
        setGenderId={setGenderId}
        profileStatusId={profileStatusId}
        setProfileStatusId={setProfileStatusId}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      {loading && (
        <div className="profile-loading">
          Loading profiles...
        </div>
      )}

      {!loading && error && (
        <div className="profile-error">
          {error}
        </div>
      )}

      {actionError && <div className="profile-error" role="alert">{actionError}</div>}

      {!loading && !error && (
        <>
          <AdminProfileTable
            profiles={profiles}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onResetPassword={openPasswordReset}
            onStatusChange={handleStatusChange}
            onMarriedChange={handleMarriedChange}
            statusUpdatingId={statusUpdatingId}
            marriedUpdatingId={marriedUpdatingId}
          />
          <div className="profile-pagination" aria-label="Profile pages">
            <span>Showing {totalCount === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalCount)} of {totalCount}</span>
            <div>
              <button type="button" onClick={() => loadProfiles(page - 1)} disabled={page <= 1 || loading}>Previous</button>
              <span>Page {page} of {Math.max(1, Math.ceil(totalCount / pageSize))}</span>
              <button type="button" onClick={() => loadProfiles(page + 1)} disabled={page >= Math.ceil(totalCount / pageSize) || loading}>Next</button>
            </div>
          </div>
        </>
      )}

      {editingProfile && (
        <div className="admin-modal-backdrop" onClick={closeEditor}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3>Edit Profile</h3>
                <p>User ID: {editingProfile.userId}</p>
              </div>
              <button type="button" className="admin-modal-close" onClick={closeEditor}>
                ×
              </button>
            </div>

            <form className="admin-edit-form" onSubmit={handleEditSubmit}>
              <div className="admin-form-grid">
                <div className="admin-form-full admin-photo-field">
                  <span>Profile Photos ({photos.length}/6)</span>
                  <div className="admin-photo-editor">
                    <div className="admin-photo-gallery">
                      {photos.map((photo) => (
                        <div className="admin-photo-item" key={photo.id}>
                          <img src={photo.url} alt="Profile preview" className="admin-photo-preview" />
                          {photo.isProfilePhoto && <span className="admin-photo-primary">Profile</span>}
                          <button
                            type="button"
                            className="admin-photo-remove"
                            onClick={() => handleRemovePhoto(photo)}
                            disabled={saving || photoUploading || deletingPhotoId !== null || settingProfilePhotoId !== null}
                            aria-label="Remove this profile photo"
                            title="Remove photo"
                          >
                            <Trash2 size={14} aria-hidden="true" />
                            <span>{deletingPhotoId === photo.id ? "Removing..." : "Remove"}</span>
                          </button>
                          {!photo.isProfilePhoto && (
                            <button
                              type="button"
                              className="admin-photo-set-primary"
                              onClick={() => handleSetProfilePhoto(photo)}
                              disabled={saving || photoUploading || deletingPhotoId !== null || settingProfilePhotoId !== null}
                            >
                              {settingProfilePhotoId === photo.id ? "Saving..." : "Set as profile"}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {photos.length < 6 && (
                      <label className="admin-photo-upload">
                        <span>Add photos</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoChange}
                          disabled={photoUploading || saving}
                        />
                      </label>
                    )}
                    {photoUploading && <small>Uploading photo...</small>}
                  </div>
                </div>
                <label>
                  <span>Full Name</span>
                  <input value={editingProfile.fullName} onChange={(e) => handleEditChange("fullName", e.target.value)} />
                </label>
                <label>
                  <span>Phone Number</span>
                  <input
                    type="tel"
                    maxLength={15}
                    value={editingProfile.mobileNumber}
                    onChange={(e) => handleEditChange("mobileNumber", e.target.value)}
                  />
                </label>
                <label>
                  <span>Date of Birth</span>
                  <input type="date" value={editingProfile.dateOfBirth} onChange={(e) => handleEditChange("dateOfBirth", e.target.value)} />
                </label>
                {renderMasterSelect("Height", "heightId", masterData.heights, editingProfile.heightId, editingProfile.heightName)}
                <label>
                  <span>Weight</span>
                  <input type="number" value={editingProfile.weight} onChange={(e) => handleEditChange("weight", e.target.value)} />
                </label>
                {renderMasterSelect("Marital Status", "maritalStatusId", masterData.maritalStatuses, editingProfile.maritalStatusId, editingProfile.maritalStatusName)}
                {renderMasterSelect("Religion", "religionId", masterData.religions, editingProfile.religionId, editingProfile.religionName)}
                {renderMasterSelect("Community", "communityId", masterData.communities, editingProfile.communityId, editingProfile.communityName)}
                {renderMasterSelect("Education", "educationId", masterData.educations, editingProfile.educationId, editingProfile.educationName)}
                {renderMasterSelect("Occupation", "occupationId", masterData.occupations, editingProfile.occupationId, editingProfile.occupationName)}
                <label>
                  <span>Company Name</span>
                  <input value={editingProfile.companyName} onChange={(e) => handleEditChange("companyName", e.target.value)} />
                </label>
                <label>
                  <span>Designation</span>
                  <input value={editingProfile.designation} onChange={(e) => handleEditChange("designation", e.target.value)} />
                </label>
                {renderMasterSelect("Income", "incomeId", masterData.incomes, editingProfile.incomeId, editingProfile.incomeName)}
                {renderMasterSelect("Country", "countryId", masterData.countries, editingProfile.countryId, editingProfile.countryName)}
                {renderMasterSelect("State", "stateId", masterData.states, editingProfile.stateId, editingProfile.stateName)}
                {renderMasterSelect("District", "districtId", masterData.districts, editingProfile.districtId, editingProfile.districtName)}
                <label className="admin-form-full">
                  <span>Address</span>
                  <textarea value={editingProfile.address} onChange={(e) => handleEditChange("address", e.target.value)} />
                </label>
                <label className="admin-form-full">
                  <span>Pincode</span>
                  <input value={editingProfile.pincode} onChange={(e) => handleEditChange("pincode", e.target.value)} />
                </label>
                <label className="admin-form-full">
                  <span>About Me</span>
                  <textarea value={editingProfile.aboutMe} onChange={(e) => handleEditChange("aboutMe", e.target.value)} />
                </label>
              </div>

              {editError && <div className="admin-form-error">{editError}</div>}
              {editMessage && <div className="admin-form-success">{editMessage}</div>}

              <div className="admin-form-actions">
                <button type="button" onClick={closeEditor} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {photoCropFile && (
        <ImageCropModal
          key={`${photoCropFile.name}-${photoCropQueue.length}`}
          file={photoCropFile}
          onCancel={cancelAdminPhotoCrop}
          onSave={handleAdminPhotoCropSave}
          saving={photoUploading}
        />
      )}

      {resettingProfile && (
        <div className="admin-modal-backdrop" onClick={() => !resettingPassword && setResettingProfile(null)}>
          <div className="admin-modal password-reset-modal" onClick={(event) => event.stopPropagation()}>
            <div className="admin-modal-header">
              <div><h3>Reset User Password</h3><p>{resettingProfile.fullName} · User ID: {resettingProfile.userId}</p></div>
              <button type="button" className="admin-modal-close" onClick={() => setResettingProfile(null)} disabled={resettingPassword}>×</button>
            </div>
            <form onSubmit={handlePasswordReset}>
              <label><span>New password</span><input type="password" autoComplete="new-password" minLength={8} maxLength={100} value={resetPassword} onChange={(event) => setResetPassword(event.target.value)} required /></label>
              <label><span>Confirm new password</span><input type="password" autoComplete="new-password" minLength={8} maxLength={100} value={confirmResetPassword} onChange={(event) => setConfirmResetPassword(event.target.value)} required /></label>
              {resetPasswordError && <div className="admin-form-error" role="alert">{resetPasswordError}</div>}
              {resetPasswordMessage && <div className="admin-form-success" role="status">{resetPasswordMessage}</div>}
              <div className="admin-form-actions"><button type="button" onClick={() => setResettingProfile(null)} disabled={resettingPassword}>Cancel</button><button type="submit" disabled={resettingPassword}>{resettingPassword ? "Resetting..." : "Reset Password"}</button></div>
            </form>
          </div>
        </div>
      )}

      {sharingProfiles && (
        <AdminProfileShareModal onClose={() => setSharingProfiles(false)} />
      )}

    </div>
  );
};

export default AdminProfiles;
