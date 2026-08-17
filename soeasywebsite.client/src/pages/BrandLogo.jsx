import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function BrandLogo() {
  return (
    <Link className="login-brand" to="/" aria-label="GSeven Matrimony home">
      <div className="login-brand-icon">
        <Heart size={20} fill="currentColor" />
      </div>
      <div className="login-brand-text">
        <strong>Soesy Matrimony</strong>
        <small>Trusted Matrimony</small>
      </div>
    </Link>
  );
}