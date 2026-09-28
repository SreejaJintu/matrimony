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
      // Show all returned profiles (do not filter out profiles without images)
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