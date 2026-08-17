const DRAFT_KEY = 'soeasy_registration_draft'
const STEP_KEY = 'soeasy_registration_step'

export const REGISTRATION_FLOW = ['basic', 'about', 'family', 'preferences', 'photos']

export function getRegistrationDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveRegistrationDraft(draft, step) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    if (step) sessionStorage.setItem(STEP_KEY, step)
  } catch {
    // Ignore storage failures and keep the form usable.
  }
}

export function clearRegistrationDraft() {
  sessionStorage.removeItem(DRAFT_KEY)
  sessionStorage.removeItem(STEP_KEY)
}

export function getRegistrationStep() {
  return sessionStorage.getItem(STEP_KEY) || REGISTRATION_FLOW[0]
}

export function getNextRegistrationStep(step) {
  const index = REGISTRATION_FLOW.indexOf(step)
  return index >= 0 && index < REGISTRATION_FLOW.length - 1 ? REGISTRATION_FLOW[index + 1] : null
}

export function getPreviousRegistrationStep(step) {
  const index = REGISTRATION_FLOW.indexOf(step)
  return index > 0 ? REGISTRATION_FLOW[index - 1] : null
}
