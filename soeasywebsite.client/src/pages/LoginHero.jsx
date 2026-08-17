import { BrandLogo } from './BrandLogo';
import { ShieldCheck, Lock, Users } from 'lucide-react';

export function LoginHero() {
  return (
    <div className="login-left-panel">
      <BrandLogo />

      <div className="login-hero-content">
        <h1 className="login-hero-welcome">
          Welcome Back
        </h1>
        <h2 className="login-hero-title">
          Find Your Perfect
          <span> Life Partner</span>
        </h2>
       
      </div>

      <div className="login-couple-image-placeholder">
        <div className="login-trust-card-overlay">
          <div className="login-trust-item">
            <div className="login-trust-icon-wrap">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4>100% Verified Profiles</h4>
              <p>All profiles are manually verified for genuine connections.</p>
            </div>
          </div>
          <div className="login-trust-item">
            <div className="login-trust-icon-wrap">
              <Lock size={20} />
            </div>
            <div>
              <h4>Privacy Protected</h4>
              <p>Your privacy is our priority. Your data is safe with us.</p>
            </div>
          </div>
          <div className="login-trust-item">
            <div className="login-trust-icon-wrap">
              <Users size={20} />
            </div>
            <div>
              <h4>Trusted by Thousands</h4>
              <p>Join thousands of successful couples who found their perfect match.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
