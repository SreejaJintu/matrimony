const AdminProfileStatusBadge = ({ statusId, statusName }) => {
  let className = "profile-status-badge";

  if (statusId === 1) {
    className += " status-pending";
  } else if (statusId === 2) {
    className += " status-approved";
  } else if (statusId === 3) {
    className += " status-rejected";
  }

  return (
    <span className={className}>
      {statusName || "Unknown"}
    </span>
  );
};

export default AdminProfileStatusBadge;