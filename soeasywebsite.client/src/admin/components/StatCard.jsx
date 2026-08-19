const StatCard = ({
  title,
  value,
  subtitle,
  icon
}) => {
  return (
    <div className="admin-stat-card">

      <div className="admin-stat-icon">
        {icon}
      </div>

      <div className="admin-stat-info">
        <span>{title}</span>

        <strong>{value}</strong>

        {subtitle && (
          <small>{subtitle}</small>
        )}
      </div>

    </div>
  );
};

export default StatCard;