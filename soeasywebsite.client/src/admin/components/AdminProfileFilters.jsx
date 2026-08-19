const AdminProfileFilters = ({
  search,
  setSearch,
  genderId,
  setGenderId,
  profileStatusId,
  setProfileStatusId,
  onSearch,
  onClear,
}) => {
  return (
    <div className="admin-profile-filters">

      <div className="profile-search">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, profile code or mobile..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
        />

        <button type="button" onClick={onSearch}>
          Search
        </button>
      </div>

      <div className="profile-filter-group">

        <select
          value={genderId}
          onChange={(e) => setGenderId(e.target.value)}
        >
          <option value="">All Genders</option>
          <option value="1">Male</option>
          <option value="2">Female</option>
          <option value="3">Other</option>
        </select>

        <select
          value={profileStatusId}
          onChange={(e) => setProfileStatusId(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="1">Pending</option>
          <option value="2">Approved</option>
          <option value="3">Rejected</option>
        </select>

        <button
          type="button"
          className="clear-filter-btn"
          onClick={onClear}
        >
          Clear
        </button>

      </div>

    </div>
  );
};

export default AdminProfileFilters;