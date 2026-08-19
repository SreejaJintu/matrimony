import AdminProfileStatusBadge from "./AdminProfileStatusBadge";

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

const AdminProfileTable = ({ profiles, onView }) => {
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
            <th>Age</th>
            <th>Gender</th>
            <th>Location</th>
            <th>Profession</th>
            <th>Status</th>
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
                    src={
                      profile.profileImageUrl ||
                      "/images/default-profile.png"
                    }
                    alt={profile.fullName}
                    onError={(e) => {
                      e.currentTarget.src =
                        "/images/default-profile.png";
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
                <AdminProfileStatusBadge
                  statusId={profile.profileStatusId}
                  statusName={profile.statusName}
                />
              </td>

              <td>
                {profile.isPremium ? (
                  <span className="premium-badge">
                    Premium
                  </span>
                ) : (
                  <span className="free-badge">
                    Free
                  </span>
                )}
              </td>

              <td>
                <button
                  type="button"
                  className="view-profile-btn"
                  onClick={() => onView(profile)}
                >
                  View
                </button>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default AdminProfileTable;