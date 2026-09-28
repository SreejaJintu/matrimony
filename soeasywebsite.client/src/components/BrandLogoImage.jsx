const logoSrc = '/WHITE_viswass.png?v=3'

export function BrandLogoImage({ className = '', alt = 'Viswaas Matrimony' }) {
  return (
    <img
      className={className}
      src={logoSrc}
      alt={alt}
      decoding="async"
    />
  )
}
