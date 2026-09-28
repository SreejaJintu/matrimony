import { useEffect, useState } from "react";
import { api } from "../../services/api";
import "../styles/adminLocations.css";

const getId = (item, ...keys) => {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null) {
      return item[key];
    }
  }
  return "";
};

const getText = (item, ...keys) => {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null) {
      return item[key];
    }
  }
  return "";
};

const AdminLocations = () => {
  const [districts, setDistricts] = useState([]);
  const [locations, setLocations] = useState([]);

  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [locationName, setLocationName] = useState("");

  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [saving, setSaving] = useState(false);

  // Kerala is fixed for this page
  const COUNTRY_ID = 1;
  const STATE_ID = 4;

  // ---------------------------------------------------------
  // Load Kerala districts
  // ---------------------------------------------------------
  const loadDistricts = async () => {
    try {
      setLoadingDistricts(true);

      const response = await api.getAdminDistricts(STATE_ID);

      const data = Array.isArray(response)
        ? response
        : response?.data ?? [];

      setDistricts(data);

      // Select first district automatically
      // Backend already puts Thrissur first.
      if (data.length > 0) {
        setSelectedDistrictId(
          String(getId(data[0], "districtId", "DistrictId"))
        );
      }
    } catch (error) {
      console.error("Failed to load districts:", error);
      setDistricts([]);
    } finally {
      setLoadingDistricts(false);
    }
  };

  // ---------------------------------------------------------
  // Load locations for selected district
  // ---------------------------------------------------------
  const loadLocations = async (districtId) => {
    if (!districtId) {
      setLocations([]);
      return;
    }

    try {
      setLoadingLocations(true);

      const response = await api.getAdminLocations(
        Number(districtId)
      );

      const data = Array.isArray(response)
        ? response
        : response?.data ?? [];

      setLocations(data);
    } catch (error) {
      console.error("Failed to load locations:", error);
      setLocations([]);
    } finally {
      setLoadingLocations(false);
    }
  };

  // ---------------------------------------------------------
  // Initial load
  // ---------------------------------------------------------
  useEffect(() => {
    loadDistricts();
  }, []);

  // ---------------------------------------------------------
  // Reload locations whenever district changes
  // ---------------------------------------------------------
  useEffect(() => {
    if (selectedDistrictId) {
      loadLocations(selectedDistrictId);
    } else {
      setLocations([]);
    }
  }, [selectedDistrictId]);

  // ---------------------------------------------------------
  // Add location
  // ---------------------------------------------------------
  const handleAddLocation = async (event) => {
    event.preventDefault();

    const trimmedName = locationName.trim();

    if (!selectedDistrictId) {
      alert("Please select a district.");
      return;
    }

    if (!trimmedName) {
      alert("Please enter a location name.");
      return;
    }

    try {
      setSaving(true);

      const result = await api.addAdminLocation(
        selectedDistrictId,
        trimmedName
      );

      if (result?.success === false) {
        alert(
          result?.message ||
            "Failed to add location."
        );
        return;
      }

      alert(
        result?.message ||
          "Location added successfully."
      );

      setLocationName("");

      // Refresh locations without changing district
      await loadLocations(selectedDistrictId);
    } catch (error) {
      console.error(
        "Failed to add location:",
        error
      );

      alert(
        error?.message ||
          "Failed to add location."
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------------
  // Get selected district name
  // ---------------------------------------------------------
  const selectedDistrictName =
    getText(
      districts.find(
        (district) =>
          String(getId(district, "districtId", "DistrictId")) ===
          String(selectedDistrictId)
      ),
      "districtName",
      "DistrictName"
    ) ||
    "";

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------
  return (
    <div className="admin-locations-page">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}
      <div className="admin-locations-header">
        <h1>Location Management</h1>

        <p>
          Add and manage locations for Kerala districts.
        </p>
      </div>

      {/* =====================================================
          ADD LOCATION CARD
          ===================================================== */}
      <div className="locations-card">

        <div className="locations-card-header">
          <div>
            <h2>Add Location</h2>

            <p>
              Select a district and add a location.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleAddLocation}
          className="locations-form"
        >

          <div className="locations-form-grid">

            {/* Country */}
            <div className="locations-form-group">

              <label htmlFor="location-country">
                Country
              </label>

              <select
                id="location-country"
                value={COUNTRY_ID}
                disabled
              >
                <option value={COUNTRY_ID}>
                  India
                </option>
              </select>

            </div>

            {/* State */}
            <div className="locations-form-group">

              <label htmlFor="location-state">
                State
              </label>

              <select
                id="location-state"
                value={STATE_ID}
                disabled
              >
                <option value={STATE_ID}>
                  Kerala
                </option>
              </select>

            </div>

            {/* District */}
            <div className="locations-form-group">

              <label htmlFor="location-district">
                District
              </label>

              <select
                id="location-district"
                value={selectedDistrictId}
                onChange={(event) =>
                  setSelectedDistrictId(
                    event.target.value
                  )
                }
                disabled={
                  loadingDistricts || saving
                }
              >

                {loadingDistricts ? (
                  <option value="">
                    Loading districts...
                  </option>
                ) : (
                  <option value="">
                    Select district
                  </option>
                )}

                {districts.map((district) => (
                  <option
                    key={getId(district, "districtId", "DistrictId")}
                    value={getId(district, "districtId", "DistrictId")}
                  >
                    {getText(district, "districtName", "DistrictName")}
                  </option>
                ))}

              </select>

            </div>

            {/* Location Name */}
            <div className="locations-form-group">

              <label htmlFor="location-name">
                Location Name <span>*</span>
              </label>

              <input
                id="location-name"
                type="text"
                value={locationName}
                onChange={(event) =>
                  setLocationName(
                    event.target.value
                  )
                }
                placeholder="Enter location name"
                maxLength={150}
                disabled={saving}
              />

            </div>

          </div>

          <div className="locations-form-actions">

            <button
              type="submit"
              className="locations-primary-button"
              disabled={
                saving ||
                loadingDistricts ||
                !selectedDistrictId
              }
            >
              {saving
                ? "Adding..."
                : "Add Location"}
            </button>

          </div>

        </form>
      </div>

      {/* =====================================================
          EXISTING LOCATIONS CARD
          ===================================================== */}
      <div className="locations-card">

        <div className="locations-card-header">

          <div>
            <h2>Existing Locations</h2>

            <p>
              {selectedDistrictId
                ? "Locations for the selected district."
                : "Select a district to view locations."}
            </p>
          </div>

          {selectedDistrictId && (
            <div className="selected-district">
              <strong>
                {selectedDistrictName}
              </strong>
            </div>
          )}

        </div>

        {/* ===================================================
            LOADING
            =================================================== */}
        {loadingLocations ? (

          <div className="locations-empty-state">
            <p>Loading locations...</p>
          </div>

        ) : locations.length === 0 ? (

          /* =================================================
             EMPTY
             ================================================= */
          <div className="locations-empty-state">
            <p>
              No locations added for this district yet.
            </p>
          </div>

        ) : (

          /* =================================================
             TABLE
             ================================================= */
          <div className="locations-table-wrapper">

            <table className="locations-table">

              <thead>
                <tr>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>

              <tbody>

                {locations.map((location) => (

                  <tr
                    key={getId(location, "locationId", "LocationId")}
                  >

                    <td>
                      <strong>
                        {getText(location, "locationName", "LocationName")}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={
                          Boolean(
                            location.isActive ?? location.IsActive
                          )
                            ? "locations-status active"
                            : "locations-status inactive"
                        }
                      >
                        {Boolean(
                          location.isActive ?? location.IsActive
                        )
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td>
                      {(location.createdAt ?? location.CreatedAt)
                        ? new Date(
                            location.createdAt ?? location.CreatedAt
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default AdminLocations;
