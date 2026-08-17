import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * StoryCTA Banner Component (Standalone JSX)
 */
export const StoryCTA = ({
  onRegisterClick,
  headline = 'Your Happy Marriage Story Can Be Next!',
  buttonText = 'Register For Free Now',
}) => {
  return (
    <div className="story-cta-shell">
      <div className="story-cta-card">
        <div className="story-cta-pattern" />
        <div className="story-cta-glow story-cta-glow-left" />
        <div className="story-cta-glow story-cta-glow-right" />

        <div className="story-cta-content">
          <div className="story-cta-tagline">
            <Sparkles className="story-cta-icon" />
            <span>Begin Your Journey</span>
          </div>

          <h2 className="story-cta-heading">{headline}</h2>

          <p className="story-cta-copy">
            Connect with verified matches who share your family values and life goals.
          </p>
        </div>

        <div className="story-cta-actions">
          <button
            type="button"
            onClick={() => onRegisterClick?.()}
            className="story-cta-button"
          >
            <span>{buttonText}</span>
            <ArrowRight className="story-cta-button-icon" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default StoryCTA;
