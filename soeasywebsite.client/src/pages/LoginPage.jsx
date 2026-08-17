import React from 'react';
import { LoginHero } from './LoginHero';
import { LoginCard } from './LoginCard';
import { TrustStrip } from './TrustStrip';
import './LoginPage.css';

export function LoginPage() {
  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <LoginHero />
        <LoginCard />
      </div>
      <TrustStrip />
    </div>
  );
}