import { Link } from 'react-router-dom';
import { BrandLogoImage } from '../components/BrandLogoImage';

export function BrandLogo() {
  return (
    <Link className="login-brand" to="/" aria-label="Soesy Matrimony home">
      <BrandLogoImage className="login-brand-image" />
    </Link>
  );
}