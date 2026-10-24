const TECHNICAL_MESSAGE_PATTERN =
  /sql|sqlclient|exception|stack trace|innerexception| at [\w.]+\(|procedure or function|stored procedure|invalid object name|cannot insert|deadlock|line number|error number|(?:error|status code)\s*[:#]?\s*\d+|0x[0-9a-f]+|http\s*\d{3}|database|constraint|duplicate key|violation|nvarchar|varchar|column .* does not exist|timeout expired|connection string/i

const FIELD_LABELS = {
  fullname: 'Full name',
  mobilenumber: 'Mobile number',
  email: 'Email address',
  password: 'Password',
  genderid: 'Gender',
  dateofbirth: 'Date of birth',
  birthstarid: 'Birth star',
}

const FIELD_KEYS = {
  genderid: 'gender',
}

const asMessage = (value) => (typeof value === 'string' ? value.trim() : '')
const isTechnicalMessage = (message) =>
  TECHNICAL_MESSAGE_PATTERN.test(message) ||
  message.trimStart().startsWith('{') ||
  message.trimStart().startsWith('[')

function mapKnownMessage(message) {
  const normalized = message.toLowerCase()

  if ((normalized.includes('mobile') && normalized.includes('email')) &&
      (normalized.includes('registered') || normalized.includes('exist'))) {
    return 'This mobile number or email address is already registered. Please use different contact details or log in.'
  }
  if (normalized.includes('mobile') && (normalized.includes('registered') || normalized.includes('exist'))) {
    return 'This mobile number is already registered. Please log in or use another number.'
  }
  if (normalized.includes('email') && (normalized.includes('registered') || normalized.includes('exist'))) {
    return 'This email address is already registered. Please use another email address.'
  }
  if (normalized.includes('otp') &&
      ['invalid', 'expired', 'not found', 'already been used', 'replaced'].some((part) => normalized.includes(part))) {
    return 'The verification code is invalid or has expired. Please request a new code.'
  }
  if (normalized.includes('too many') && normalized.includes('otp')) {
    return 'Too many incorrect verification attempts. Please request a new code.'
  }
  if (normalized.includes('session') && (normalized.includes('expired') || normalized.includes('not found'))) {
    return 'Your session has expired. Please log in again and retry.'
  }
  if (normalized.includes('sms bits') || normalized.includes('otp could not be sent')) {
    return 'Unable to send a verification code right now. Please try again later.'
  }
  if (normalized.includes('required') && normalized.includes('field')) {
    return 'Please complete all required fields before continuing.'
  }
  if (normalized.includes('invalid') && normalized.includes('email')) {
    return 'Please enter a valid email address.'
  }
  if (normalized.includes('password') && (normalized.includes('8 character') || normalized.includes('minimum length'))) {
    return 'Please use a password with at least 8 characters.'
  }
  if (normalized.includes('required') && normalized.includes('email')) {
    return 'Please enter your email address.'
  }
  if (normalized.includes('required') && normalized.includes('mobile')) {
    return 'Please enter your mobile number.'
  }

  return ''
}

function getFieldErrors(validationErrors) {
  if (!validationErrors || typeof validationErrors !== 'object') return {}

  return Object.fromEntries(
    Object.entries(validationErrors)
      .map(([field, messages]) => {
        const fieldName = field.split('.').at(-1)
        const label = FIELD_LABELS[fieldName.toLowerCase()]
        if (!label) return null

        const messageList = Array.isArray(messages) ? messages : [messages]
        const required = messageList.some((item) => /required/i.test(asMessage(item)))
        const invalidEmail = fieldName.toLowerCase() === 'email' &&
          messageList.some((item) => /valid|format/i.test(asMessage(item)))
        const shortPassword = fieldName.toLowerCase() === 'password' &&
          messageList.some((item) => /minimum length|8 character/i.test(asMessage(item)))
        const friendly = required
          ? `${label} is required.`
          : invalidEmail
            ? 'Please enter a valid email address.'
            : shortPassword
              ? 'Please use a password with at least 8 characters.'
            : `Please check your ${label.toLowerCase()} and try again.`

        return [FIELD_KEYS[fieldName.toLowerCase()] ?? fieldName.charAt(0).toLowerCase() + fieldName.slice(1), friendly]
      })
      .filter(Boolean)
  )
}

function getValidationMessage(validationErrors) {
  if (!validationErrors || typeof validationErrors !== 'object') return ''

  const messages = Object.values(validationErrors)
    .flatMap((items) => Array.isArray(items) ? items : [items])
    .map(asMessage)
    .filter(Boolean)
  if (!messages.length) return ''

  return 'Please correct the highlighted fields and try again.'
}

export function getFriendlyErrorDetails(error, fallback = 'We couldn’t complete your request right now. Please try again later.') {
  const response = error?.response
  const status = Number(response?.status)
  let data = response?.data
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch {
      data = { message: data }
    }
  }
  const validationErrors = data?.errors ?? data?.Errors
  const fieldErrors = getFieldErrors(validationErrors)
  const validationMessage = getValidationMessage(validationErrors)

  if (!response) {
    const message = asMessage(error?.message ?? error)
    const knownMessage = message && mapKnownMessage(message)
    const networkMessage = /timeout|network error|failed to fetch|unable to connect|econn|err_network/i.test(message)
      ? 'Unable to connect to the server. Please check your internet connection and try again.'
      : ''
    const safeMessage = message && message.length <= 200 && !isTechnicalMessage(message)
      ? message
      : ''
    return {
      message: knownMessage || networkMessage || safeMessage || fallback,
      fieldErrors,
    }
  }

  if ((status === 400 || status === 422) && validationMessage) {
    return { message: validationMessage, fieldErrors }
  }
  if (status === 401) {
    return { message: 'Your session has expired. Please log in again and retry.', fieldErrors }
  }
  if (status === 403) {
    return { message: 'You don’t have permission to complete this request.', fieldErrors }
  }
  if (status === 404) {
    return { message: 'The requested information could not be found. Please refresh and try again.', fieldErrors }
  }
  if (status >= 500) {
    return { message: 'We couldn’t complete your registration right now. Please try again later.', fieldErrors }
  }

  const apiMessage = asMessage(data?.message ?? data?.Message ?? data?.detail ?? data?.Detail)
  const knownMessage = apiMessage && mapKnownMessage(apiMessage)
  if (knownMessage) return { message: knownMessage, fieldErrors }
  if (status === 400 || status === 422) {
    return { message: 'Please check the information entered and try again.', fieldErrors }
  }

  if (apiMessage && !isTechnicalMessage(apiMessage) && apiMessage.length <= 200) {
    return { message: apiMessage, fieldErrors }
  }

  return { message: fallback, fieldErrors }
}

export function getFriendlyErrorMessage(error, fallback) {
  return getFriendlyErrorDetails(error, fallback).message
}

export function assertApiSuccess(response, fallback) {
  const success = response?.success ?? response?.Success
  if (success === false || response?.data === false || response?.Data === false) {
    const message = response?.message ?? response?.Message
    throw new Error(getFriendlyErrorMessage(message, fallback))
  }
  if (success !== true) {
    throw new Error(fallback || 'We couldn’t complete your request right now. Please try again later.')
  }
  return response
}
