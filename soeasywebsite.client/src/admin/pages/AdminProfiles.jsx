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

const getAgeFromDateOfBirth = (dateOfBirth) => {
  if (!dateOfBirth) return "";

  const [year, month, day] = String(dateOfBirth).slice(0, 10).split("-").map(Number);
  const birthDate = new Date(year, month - 1, day);
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return "";
  }

  const today = new Date();
  let age = today.getFullYear() - year;
  if (
    today.getMonth() < month - 1 ||
    (today.getMonth() === month - 1 && today.getDate() < day)
  ) {
    age -= 1;
  }

  return age >= 0 ? age : "";
};

const getDateOfBirthFromAge = (ageValue, currentDateOfBirth) => {
  if (ageValue === "") return "";

  const age = Number(ageValue);
  if (!Number.isInteger(age) || age < 0 || age > 120) return currentDateOfBirth;

  const existingDate = currentDateOfBirth
    ? String(currentDateOfBirth).slice(0, 10).split("-").map(Number)
    : [];
  const validExistingDate = existingDate.length === 3 && existingDate.every(Number.isInteger);
  const today = new Date();
  const month = validExistingDate ? existingDate[1] : today.getMonth() + 1;
  const day = validExistingDate ? existingDate[2] : today.getDate();
  const year = today.getFullYear() - age;
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const clampedDay = Math.min(day, lastDayOfMonth);

  return `${year}-${String(month).padStart(2, "0")}-${String(clampedDay).padStart(2, "0")}`;
};

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

  const handleEdit = (profile) => {
    navigate(`/admin/profiles/${profile.userId}/edit`);
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
