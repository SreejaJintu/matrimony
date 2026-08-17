import React from 'react';
import { ShieldCheck, Users, Headphones, Award } from 'lucide-react';

export function TrustStrip() {
  return (
    <div className="trust-strip">
      <div className="trust-strip-grid">
        <div className="trust-strip-item">
          <div className="trust-strip-icon">
            <ShieldCheck size={24} />
          </div>
          <h4>Secure & Safe</h4>
          <p>Your data is encrypted and protected</p>
        </div>
        <div className="trust-strip-item">
          <div className="trust-strip-icon">
            <Users size={24} />
          </div>
          <h4>20,000+ Members</h4>
          <p>Find your perfect match from genuine profiles</p>
        </div>
        <div className="trust-strip-item">
          <div className="trust-strip-icon">
            <Headphones size={24} />
          </div>
          <h4>24/7 Support</h4>
          <p>Our support team is always here for you</p>
        </div>
        <div className="trust-strip-item">
          <div className="trust-strip-icon">
            <Award size={24} />
          </div>
          <h4>100% Trusted</h4>
          <p>Trusted by thousands of happy couples</p>
        </div>
      </div>
    </div>
  );
}