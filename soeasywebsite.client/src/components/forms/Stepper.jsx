import React from 'react';

export const Stepper = ({ currentStep, onStepChange }) => {
  const steps = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'career', label: 'Career' },
    { id: 'preferences', label: 'Preferences' },
  ];

  return (
    <div className="stepper-shell">
      <div className="stepper-track">
        {steps.map((step) => {
          const isActive = currentStep === step.id;

          return (
            <button
              key={step.id}
              id={`stepper-tab-${step.id}`}
              onClick={() => onStepChange(step.id)}
              className="stepper-tab"
            >
              {/* Top indicator bar */}
              <div
                className={`stepper-bar ${isActive ? 'is-active' : ''}`}
              />
              
              {/* Step label */}
              <span
                className={`stepper-label ${isActive ? 'is-active' : ''}`}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
