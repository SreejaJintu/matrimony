const isVal = (val) =>
  val !== undefined &&
  val !== null &&
  String(val).trim() !== '' &&
  val !== 0;

const getValue = (data, ...keys) => {
  for (const key of keys) {
    if (isVal(data?.[key])) {
      return data[key];
    }
  }

  return null;
};

export const COMPLETION_CHECKS = {
  basic: (data) => {
    const fields = [
      ['fullName', 'FullName'],
      ['genderId', 'GenderId'],
      ['mobileNumber', 'MobileNumber'],
      ['email', 'Email'],
      ['dateOfBirth', 'DateOfBirth'],
    ];

    return fields.every(([...keys]) => isVal(getValue(data, ...keys)));
  },

  about: (data) => {
    const fields = [
      ['heightId', 'HeightId'],
      ['maritalStatusId', 'MaritalStatusId'],
      ['educationId', 'EducationId'],
      ['occupationId', 'OccupationId'],
      ['aboutMe', 'AboutMe'],
    ];

    // AboutMe is treated as optional.
    const requiredFields = fields.slice(0, 4);

    return requiredFields.every(([...keys]) =>
      isVal(getValue(data, ...keys))
    );
  },

  family: (data) => {
    const fields = [
      ['fatherName', 'FatherName'],
      ['motherName', 'MotherName'],
      ['familyTypeId', 'FamilyTypeId'],
    ];

    return fields.every(([...keys]) =>
      isVal(getValue(data, ...keys))
    );
  },

  photos: (data) => {
    const photos =
      data?.photos ??
      data?.Photos ??
      data?.userPhotos ??
      data?.UserPhotos;

    return Array.isArray(photos) && photos.length > 0;
  },

  preferences: (data) => {
    const fields = [
      ['ageFrom', 'AgeFrom', 'ageRangeMin'],
      ['ageTo', 'AgeTo', 'ageRangeMax'],
      ['religionId', 'ReligionId', 'preferredReligionId'],
      ['educationId', 'EducationId', 'educationPreferenceId'],
    ];

    return fields.every(([...keys]) =>
      isVal(getValue(data, ...keys))
    );
  },
};

export function calculateProfileCompletion(profileData) {
  if (!profileData) {
    return {
      steps: [],
      percentage: 0,
      isComplete: false,
      firstIncompleteStep: null,
    };
  }

  const steps = [
    {
      id: 'basic',
      label: 'Basic Info',
      done: COMPLETION_CHECKS.basic(profileData),
    },
    {
      id: 'about',
      label: 'About You',
      done: COMPLETION_CHECKS.about(profileData),
    },
    {
      id: 'family',
      label: 'Family Details',
      done: COMPLETION_CHECKS.family(profileData),
    },
    {
      id: 'photos',
      label: 'Photos',
      done: COMPLETION_CHECKS.photos(profileData),
    },
    {
      id: 'preferences',
      label: 'Preferences',
      done: COMPLETION_CHECKS.preferences(profileData),
    },
  ];

  const completedCount = steps.filter((step) => step.done).length;
  const totalSteps = steps.length;

  const percentage =
    totalSteps > 0
      ? Math.round((completedCount / totalSteps) * 100)
      : 0;

  return {
    steps,
    percentage,
    isComplete: completedCount === totalSteps,
    firstIncompleteStep:
      steps.find((step) => !step.done)?.id || null,
  };
}