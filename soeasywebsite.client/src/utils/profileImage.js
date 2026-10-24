// Reuse the profile placeholder already shown by the featured-profile UI.
export const DEFAULT_PROFILE_IMAGE =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80'

const LEGACY_DEFAULT_PATH = `/${['images', 'default-profile.png'].join('/')}`
const ASSETS_BASE_URL = 'https://assetsmatrimony.kaliweb.in'

export function getProfileImageUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return DEFAULT_PROFILE_IMAGE

  try {
    const resolvedValue = value.trim().replace(
      /^https?:\/\/localhost:5040(?=\/|$)/i,
      ASSETS_BASE_URL,
    )
    const parsed = new URL(resolvedValue, 'https://viswaas.in')
    return parsed.pathname.toLowerCase() === LEGACY_DEFAULT_PATH
      ? DEFAULT_PROFILE_IMAGE
      : resolvedValue
  } catch {
    return DEFAULT_PROFILE_IMAGE
  }
}

export function handleProfileImageError(event) {
  const image = event.currentTarget
  const source = image.getAttribute('src')

  image.onerror = null
  if (image.dataset.profileFallbackApplied || getProfileImageUrl(source) === DEFAULT_PROFILE_IMAGE) {
    image.removeAttribute('src')
    return
  }

  image.dataset.profileFallbackApplied = 'true'
  image.src = DEFAULT_PROFILE_IMAGE
}
