import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import adminProfileService from "../services/adminProfileService";
import "../styles/adminProfileDetail.css";

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return "-";

  const dob = new Date(dateOfBirth);
  const today = new Date();
  

  let age = today.getFullYear() - dob.getFullYear();

  const month = today.getMonth() - dob.getMonth();

  if (
    month < 0 ||
    (month === 0 && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
};

const InfoItem = ({ label, value }) => (
  <div className="admin-detail-info-item">
    <span>{label}</span>
    <strong>{value || "-"}</strong>
  </div>
);

const Section = ({ title, children }) => (
  <section className="admin-detail-section">
    <div className="admin-detail-section-title">
      <h3>{title}</h3>
    </div>

    <div className="admin-detail-section-content">
      {children}
    </div>
  </section>
);

const AdminProfileDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [marriedLoading, setMarriedLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await adminProfileService.getProfileById(userId);

        if (result.success) {
          setProfile(result.data);
        } else {
          setError(
            result.message || "Unable to load profile."
          );
        }
      } catch (err) {
        console.error(
          "ADMIN PROFILE DETAIL ERROR:",
          err
        );

        setError(
          err.response?.data?.message ||
          "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);



  const handleMarkAsMarried = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to mark this profile as Married? This will remove the profile from matching."
  );

  if (!confirmed) return;

  try {
    setMarriedLoading(true);
    setError("");
    setActionMessage("");

    const result =
      await adminProfileService.markAsMarried(userId);

    if (!result.success) {
      setError(
        result.message ||
        "Unable to mark profile as married."
      );
      return;
    }

    // Update UI immediately
    setProfile((current) => ({
      ...current,
      profileStatusId: 4,
      statusName: "Married",
    }));

    setActionMessage(
      result.message ||
      "Profile marked as Married successfully."
    );

  } catch (err) {
    console.error(
      "MARK MARRIED ERROR:",
      err
    );

    setError(
      err.response?.data?.message ||
      "Unable to mark profile as married."
    );
  } finally {
    setMarriedLoading(false);
  }
};
  const handleStatusUpdate = async (newStatusId) => {
    try {
      setActionLoading(true);
      setActionMessage("");
      setError("");

      const result = await adminProfileService.updateProfileStatus(
        userId,
        newStatusId
      );

      if (result.success) {
        setActionMessage(result.message || "Profile status updated.");
        setProfile((prev) => ({
          ...prev,
          profileStatusId: newStatusId,
          statusName: result.data?.statusName || prev.statusName,
        }));
      } else {
        setError(result.message || "Failed to update status.");
      }
    } catch (err) {
      console.error("STATUS UPDATE ERROR:", err);
      setError(
        err.response?.data?.message || "Failed to update status."
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-detail-state">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-detail-state admin-detail-error">
        <h3>Unable to load profile</h3>
        <p>{error}</p>

        <button
          type="button"
          onClick={() => navigate("/admin/profiles")}
        >
          Back to Profiles
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="admin-detail-state">
        Profile not found.
      </div>
    );
  }

  return (
    <div className="admin-profile-detail-page">

      {/* Header */}
      <div className="admin-detail-header">

        <button
          type="button"
          className="admin-back-btn"
          onClick={() => navigate("/admin/profiles")}
        >
          ← Back to Profiles
        </button>

        <div className="admin-detail-heading">
          <div>
            <h2>Profile Details</h2>
            <p>
              Review and manage member information.
            </p>
          </div>

          <span
            className={`admin-detail-status status-${profile.profileStatusId}`}
          >
            {profile.statusName || "Unknown"}
          </span>
        </div>

      </div>


      {/* Profile Summary */}
      <section className="admin-profile-summary">

        <div className="admin-profile-main">

          <div className="admin-detail-photo-wrapper">
            <img
              src={
                profile.imageUrl ||
                "/images/default-profile.png"
              }
              alt={profile.fullName}
              className="admin-detail-photo"
              onError={(e) => {
                e.currentTarget.src =
                  "/images/default-profile.png";
              }}
            />
          </div>

          <div className="admin-profile-summary-info">

            <div className="admin-profile-name-row">
              <h1>{profile.fullName}</h1>

              {profile.isPremium && (
                <span className="admin-premium-badge">
                  Premium
                </span>
              )}
            </div>

            <span className="admin-profile-code">
              {profile.profileCode}
            </span>

            <div className="admin-profile-short-info">

              <span>
                {profile.genderName ||
                  (profile.genderId === 1
                    ? "Male"
                    : profile.genderId === 2
                      ? "Female"
                      : "Other")}
              </span>

              <span>•</span>

              <span>
                {calculateAge(profile.dateOfBirth)} years
              </span>

              {profile.city && (
                <>
                  <span>•</span>
                  <span>{profile.city}</span>
                </>
              )}

              {profile.state && (
                <>
                  <span>•</span>
                  <span>{profile.state}</span>
                </>
              )}

            </div>

          </div>

        </div>

        <div className="admin-profile-verification">

          <div>
            <span>Mobile</span>
            <strong>
              {profile.isMobileVerified
                ? "Verified"
                : "Not Verified"}
            </strong>
          </div>

          <div>
            <span>Email</span>
            <strong>
              {profile.isEmailVerified
                ? "Verified"
                : "Not Verified"}
            </strong>
          </div>

          <div>
            <span>Membership</span>
            <strong>
              {profile.planName || "Free"}
            </strong>
          </div>

        </div>

      </section>


      {/* Account Information */}
      <Section title="Account Information">

        <div className="admin-detail-grid">

          <InfoItem
            label="Profile Code"
            value={profile.profileCode}
          />

          <InfoItem
            label="Mobile Number"
            value={profile.mobileNumber}
          />

          <InfoItem
            label="Email"
            value={profile.email}
          />

          <InfoItem
            label="Membership"
            value={profile.planName}
          />

          <InfoItem
            label="Profile Status"
            value={profile.statusName}
          />

          <InfoItem
            label="Profile Completed"
            value={
              profile.isProfileCompleted
                ? "Yes"
                : "No"
            }
          />

          <InfoItem
            label="Registered On"
            value={
              profile.createdAt
                ? new Date(
                    profile.createdAt
                  ).toLocaleDateString()
                : "-"
            }
          />

          <InfoItem
            label="Last Login"
            value={
              profile.lastLogin
                ? new Date(
                    profile.lastLogin
                  ).toLocaleString()
                : "Never"
            }
          />

        </div>

      </Section>


      {/* Personal Information */}
      <Section title="Personal Information">

        <div className="admin-detail-grid">

          <InfoItem
            label="Date of Birth"
            value={
              profile.dateOfBirth
                ? new Date(
                    profile.dateOfBirth
                  ).toLocaleDateString()
                : "-"
            }
          />

          <InfoItem
            label="Age"
            value={
              profile.dateOfBirth
                ? `${calculateAge(
                    profile.dateOfBirth
                  )} years`
                : "-"
            }
          />

          <InfoItem
            label="Height"
            value={profile.height}
          />

          <InfoItem
            label="Weight"
            value={
              profile.weight
                ? `${profile.weight} kg`
                : "-"
            }
          />

          <InfoItem
            label="Marital Status"
            value={profile.maritalStatus}
          />

          <InfoItem
            label="Mother Tongue"
            value={profile.motherTongue}
          />

          <InfoItem
            label="Religion"
            value={profile.religion}
          />

          <InfoItem
            label="Community"
            value={profile.community}
          />

        </div>

      </Section>


      {/* Education & Career */}
      <Section title="Education & Career">

        <div className="admin-detail-grid">

          <InfoItem
            label="Education"
            value={profile.education}
          />

          <InfoItem
            label="Occupation"
            value={profile.occupation}
          />

          <InfoItem
            label="Company"
            value={profile.companyName}
          />

          <InfoItem
            label="Designation"
            value={profile.designation}
          />

          <InfoItem
            label="Income"
            value={profile.income}
          />

        </div>

      </Section>


      {/* Location */}
      <Section title="Location">

        <div className="admin-detail-grid">

          <InfoItem
            label="Country"
            value={profile.country}
          />

          <InfoItem
            label="State"
            value={profile.state}
          />

          <InfoItem
            label="District"
            value={profile.district}
          />

          <InfoItem
            label="City"
            value={profile.city}
          />

          <InfoItem
            label="Pincode"
            value={profile.pincode}
          />

          <InfoItem
            label="Address"
            value={profile.address}
          />

        </div>

      </Section>


      {/* About */}
      {profile.aboutMe && (
        <Section title="About Me">

          <div className="admin-detail-text">
            {profile.aboutMe}
          </div>

        </Section>
      )}


      {/* Family */}
      <Section title="Family Information">

        <div className="admin-detail-grid">

          <InfoItem
            label="Father"
            value={profile.fatherName}
          />

          <InfoItem
            label="Mother"
            value={profile.motherName}
          />

          <InfoItem
            label="Family Type"
            value={profile.familyType}
          />

          <InfoItem
            label="Family Status"
            value={profile.familyStatus}
          />

          <InfoItem
            label="Family Value"
            value={profile.familyValue}
          />

          <InfoItem
            label="Native Place"
            value={profile.nativePlace}
          />

          <InfoItem
            label="Brothers"
            value={profile.brothers}
          />

          <InfoItem
            label="Married Brothers"
            value={profile.marriedBrothers}
          />

          <InfoItem
            label="Sisters"
            value={profile.sisters}
          />

          <InfoItem
            label="Married Sisters"
            value={profile.marriedSisters}
          />

        </div>

        {profile.familyAbout && (
          <div className="admin-detail-subtext">
            <span>About Family</span>
            <p>{profile.familyAbout}</p>
          </div>
        )}

      </Section>


      {/* Partner Preferences */}
      <Section title="Partner Preferences">

        <div className="admin-detail-grid">

          <InfoItem
            label="Age"
            value={
              profile.ageFrom || profile.ageTo
                ? `${profile.ageFrom || "-"} - ${
                    profile.ageTo || "-"
                  } years`
                : "-"
            }
          />

          <InfoItem
            label="Height"
            value={
              profile.heightFrom ||
              profile.heightTo
                ? `${profile.heightFrom || "-"} - ${
                    profile.heightTo || "-"
                  }`
                : "-"
            }
          />

          <InfoItem
            label="Religion"
            value={profile.preferredReligion}
          />

          <InfoItem
            label="Community"
            value={profile.preferredCommunity}
          />

          <InfoItem
            label="Education"
            value={profile.preferredEducation}
          />

          <InfoItem
            label="Occupation"
            value={profile.preferredOccupation}
          />

          <InfoItem
            label="Income"
            value={profile.preferredIncome}
          />

        </div>

        {profile.preferredDescription && (
          <div className="admin-detail-subtext">
            <span>Preference Description</span>
            <p>
              {profile.preferredDescription}
            </p>
          </div>
        )}

      </Section>

{actionMessage && (
  <div className="admin-action-success">
    {actionMessage}
  </div>
)}

{error && (
  <div className="admin-action-error">
    {error}
  </div>
)}
      {/* Admin Actions */}
      <section className="admin-detail-actions">

        <h3>Profile Actions</h3>

        <div className="admin-action-buttons">

          {profile.profileStatusId !== 4 && (
            <>
              <button
                type="button"
                className="admin-action approve"
                disabled={
                  actionLoading ||
                  profile.profileStatusId === 2
                }
                onClick={() => handleStatusUpdate(2)}
              >
                {actionLoading && profile.profileStatusId !== 2
                  ? "Updating..."
                  : "Approve"}
              </button>

              <button
                type="button"
                className="admin-action reject"
                disabled={
                  actionLoading ||
                  profile.profileStatusId === 3
                }
                onClick={() => handleStatusUpdate(3)}
              >
                {actionLoading && profile.profileStatusId !== 3
                  ? "Updating..."
                  : "Reject"}
              </button>
            </>
          )}

          <button
            type="button"
            className="admin-action suspend"
          >
            Suspend
          </button>

          <button
            type="button"
            className="admin-action married"
            onClick={handleMarkAsMarried}
            disabled={
              marriedLoading ||
              profile.profileStatusId === 4
            }
          >
            {marriedLoading
              ? "Updating..."
              : profile.profileStatusId === 4
                ? "Marked as Married"
                : "Mark as Married"}
          </button>

        </div>

      </section>

    </div>
  );
};

export default AdminProfileDetail;