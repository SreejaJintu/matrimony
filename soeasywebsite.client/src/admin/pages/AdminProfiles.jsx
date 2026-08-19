import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import adminProfileService from "../services/adminProfileService";

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
        setProfiles(result.data || []);
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

      {!loading && !error && (
        <AdminProfileTable
          profiles={profiles}
          onView={handleView}
        />
      )}

    </div>
  );
};

export default AdminProfiles;