import { Eye, Pencil, Trash2 } from "lucide-react";

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) {
    return "-";
  }

  const dob = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();

  const monthDifference =
    today.getMonth() - dob.getMonth();

  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() < dob.getDate()
    )
  ) {
    age--;
  }

  return age;
};

const getImageCandidates = (url) => {
  if (!url) return ["/images/default-profile.png"];

  const candidates = [url];
  const legacyMarker = "/uploads/old/uploads/";

  if (url.includes(legacyMarker)) {
    const fileName = url.split(legacyMarker).pop();
    candidates.push(`https://assetsmatrimony.kaliweb.in/uploads/${fileName}`);
    candidates.push(`https://assetsmatrimony.kaliweb.in/uploads/old/${fileName}`);
  }

  candidates.push("/images/default-profile.png");
  return candidates;
};

const AdminProfileTable = ({ profiles, onView, onEdit, onDelete, onStatusChange, onMarriedChange, statusUpdatingId, marriedUpdatingId }) => {
  if (!profiles.length) {
    return (
      <div className="profile-empty">
        <h3>No profiles found</h3>
        <p>
          Try changing your search or filter.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-profile-table-wrapper">

      <table className="admin-profile-table">

        <thead>
          <tr>
            <th>Profile</th>
            <th>Registration Source</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Location</th>
            <th>Profession</th>
            <th>Approved</th>
            <th>Marital Status</th>
            <th>Membership</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {profiles.map((profile) => (
            <tr key={profile.userId}>

              <td>
                <div className="admin-profile-user">
                  <img
                    src={getImageCandidates(
                      profile.profileImageUrl ||
                      profile.ProfileImageUrl ||
                      profile.imageUrl ||
                      profile.ImageUrl
                    )[0]}
                    alt={profile.fullName}
                    data-image-candidates={JSON.stringify(getImageCandidates(
                      profile.profileImageUrl ||
                      profile.ProfileImageUrl ||
                      profile.imageUrl ||
                      profile.ImageUrl
                    ))}
                    onError={(event) => {
                      const candidates = JSON.parse(event.currentTarget.dataset.imageCandidates || "[]");
                      const nextIndex = Number(event.currentTarget.dataset.imageIndex || 0) + 1;
                      event.currentTarget.dataset.imageIndex = String(nextIndex);
                      event.currentTarget.src = candidates[nextIndex] || "/images/default-profile.png";
                    }}
                  />

                  <div>
                    <strong>
                      {profile.fullName}
                    </strong>

                    <span>
                      {profile.profileCode}
                    </span>
                  </div>

                </div>
              </td>

              <td>
                <strong>{profile.registrationType || "Self Registered"}</strong>
                {profile.registrationType === "Broker Registered" && (
                  <small className="admin-registration-broker">
                    {profile.brokerName || "Broker"}
                    {profile.brokerCompanyName ? ` · ${profile.brokerCompanyName}` : ""}
                  </small>
                )}
              </td>

              <td>
                {calculateAge(profile.dateOfBirth)}
              </td>

              <td>
                {profile.genderName || "-"}
              </td>

              <td>
                {profile.city || profile.districtName || "-"}
                {profile.stateName
                  ? `, ${profile.stateName}`
                  : ""}
              </td>

              <td>
                {profile.occupationName ||
                  profile.designation ||
                  "-"}
              </td>

              <td>
                <button
                  type="button"
                  className="profile-approval-toggle"
                  role="switch"
                  aria-checked={Number(profile.profileStatusId) === 2}
                  aria-label={`${Number(profile.profileStatusId) === 2 ? "Revoke approval for" : "Approve"} ${profile.fullName}`}
                  title={Number(profile.profileStatusId) === 2 ? "Approved: click to reject" : Number(profile.profileStatusId) === 1 ? "Pending: click to approve" : "Rejected: click to approve"}
                  data-state={Number(profile.profileStatusId) === 2 ? "approved" : Number(profile.profileStatusId) === 3 ? "rejected" : "pending"}
                  onClick={() => onStatusChange(profile, Number(profile.profileStatusId) === 2 ? 3 : 2)}
                  disabled={statusUpdatingId === profile.userId}
                >
                  <span className="profile-approval-switch-track" aria-hidden="true" />
                </button>
              </td>

              <td>
                <button
                  type="button"
                  className="profile-married-toggle"
                  role="switch"
                  aria-checked={profile.isMarried ?? profile.IsMarried ?? false}
                  aria-label={`${profile.isMarried ?? profile.IsMarried ?? false ? "Mark as not married" : "Mark as married"}: ${profile.fullName}`}
                  title={profile.isMarried ?? profile.IsMarried ?? false ? "Mark as not married" : "Mark as married"}
                  onClick={() => onMarriedChange(profile)}
                  disabled={marriedUpdatingId === profile.userId}
                >
                  <span className="profile-married-switch-track" aria-hidden="true" />
                  <span>{profile.isMarried ?? profile.IsMarried ?? false ? "Married" : "Not married"}</span>
                </button>
              </td>

              <td>
                {(profile.membershipPlanName ?? profile.MembershipPlanName ?? "Free").toLowerCase() === "free" ? (
                  <span className="free-badge">
                    {profile.membershipPlanName ?? profile.MembershipPlanName ?? "Free"}
                  </span>
                ) : (
                  <span className="premium-badge">
                    {profile.membershipPlanName ?? profile.MembershipPlanName ?? "Free"}
                  </span>
                )}
              </td>

              <td>
                <div className="admin-profile-actions">
                  <button
                    type="button"
                    className="view-profile-btn"
                    onClick={() => onView(profile)}
                    aria-label={`View ${profile.fullName}'s profile`}
                    title="View profile"
                  >
                    <Eye size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="edit-profile-btn"
                    onClick={() => onEdit(profile)}
                    aria-label={`Edit ${profile.fullName}'s profile`}
                    title="Edit profile"
                  >
                    <Pencil size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="delete-profile-btn"
                    onClick={() => onDelete(profile)}
                    aria-label={`Delete ${profile.fullName}'s profile`}
                    title="Delete profile"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default AdminProfileTable;
