import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

import adminProfileService from "../services/adminProfileService";
import { processPhotoToStandardSize } from "../../utils/imageProcess";

import AdminProfileFilters from "../components/AdminProfileFilters";
import AdminProfileTable from "../components/AdminProfileTable";

import "../styles/adminProfiles.css";

const AdminProfiles = () => {
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState([]);

  const [search, setSearch] = useState("");
  const [genderId, setGenderId] = useState("");
  const [profileStatusId, setProfileStatusId] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [marriedUpdatingId, setMarriedUpdatingId] = useState(null);
  const [editingProfile, setEditingProfile] = useState(null);
  const [editError, setEditError] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoUploading, setPhotoUploading] = useState(false);
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

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError("");

      const result =
        await adminProfileService.getProfiles({
          search,
          genderId,
          profileStatusId,
        });

      if (result.success) {
        setProfiles((result.data || []).filter(
          (profile) => profile.isActive !== false && profile.IsActive !== false
        ));
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

    setTimeout(() => {
      loadProfiles();
    }, 0);
  };

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

    const uploadedPhotos = [];
    try {
      setPhotoUploading(true);
      for (const file of filesToUpload) {
        const standardizedFile = await processPhotoToStandardSize(file, 600, 750);
        const result = await api.uploadPhoto(standardizedFile);
        if (result?.success === false) {
          throw new Error(result.message || "Unable to upload photo.");
        }
        const uploadedUrl = result?.data ?? result?.Data ?? "";
        if (!uploadedUrl) throw new Error("Photo upload did not return a URL.");
        uploadedPhotos.push({
          id: `new-photo-${Date.now()}-${uploadedPhotos.length}`,
          url: uploadedUrl,
          isProfilePhoto: false,
          isNew: true,
        });
      }
    } catch (error) {
      setEditError(error.message || "Unable to upload photo.");
    } finally {
      if (uploadedPhotos.length) {
        setPhotos((current) => [...current, ...uploadedPhotos]);
      }
      setPhotoUploading(false);
    }
  };

  const handleSetProfilePhoto = (photoId) => {
    setPhotos((current) => current.map((photo) => ({
      ...photo,
      isProfilePhoto: photo.id === photoId,
    })));
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

        <div className="profile-count">
          {profiles.length} Profiles
        </div>

      </div>

      <AdminProfileFilters
        search={search}
        setSearch={setSearch}
        genderId={genderId}
        setGenderId={setGenderId}
        profileStatusId={profileStatusId}
        setProfileStatusId={setProfileStatusId}
        onSearch={loadProfiles}
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
        <AdminProfileTable
          profiles={profiles}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onMarriedChange={handleMarriedChange}
          statusUpdatingId={statusUpdatingId}
          marriedUpdatingId={marriedUpdatingId}
        />
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
                          {photo.isNew && !photo.isProfilePhoto && (
                            <button
                              type="button"
                              className="admin-photo-set-primary"
                              onClick={() => handleSetProfilePhoto(photo.id)}
                            >
                              Set as profile
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

    </div>
  );
};

export default AdminProfiles;
