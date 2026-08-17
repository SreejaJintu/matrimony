import { Check, UserRound, Heart, Users, Target, Camera } from 'lucide-react'

const DEFAULT_STEPS = [
  { id: 'basic', label: 'Basic Details', icon: UserRound },
  { id: 'about', label: 'About You', icon: Heart },
  { id: 'family', label: 'Family Details', icon: Users },
  { id: 'preferences', label: 'Partner Preferences', icon: Target },
  { id: 'photos', label: 'Upload Photos', icon: Camera },
]

const STEP_INDEX_TO_ID = {
  1: 'basic',
  2: 'about',
  3: 'family',
  4: 'preferences',
  5: 'photos',
}

export const RegistrationStepper = ({ currentStep, onStepChange, completedSteps = [], steps = DEFAULT_STEPS, mode = 'create' }) => {
  const stepList = steps.length > 0 ? steps : DEFAULT_STEPS
  const resolvedCurrentStep =
    typeof currentStep === 'number' ? STEP_INDEX_TO_ID[currentStep] ?? stepList[0]?.id : currentStep
  const currentIndex = stepList.findIndex((s) => s.id === resolvedCurrentStep)
  const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0

  return (
    <div className="reg-stepper">
      <div className="reg-stepper-track">
        {stepList.map((step, index) => {
          const isActive = step.id === resolvedCurrentStep
          const isCompleted = completedSteps.includes(step.id) || index < safeCurrentIndex
          const isReachable = mode === 'edit' || index <= safeCurrentIndex || isCompleted // All steps reachable in edit mode
          const Icon = step.icon

          return (
            <button
              key={step.id}
              type="button"
              id={`reg-step-${step.id}`}
              onClick={() => isReachable && onStepChange(step.id)}
              className={`reg-step ${isActive ? 'is-active' : ''} ${isCompleted ? 'is-completed' : ''} ${!isReachable ? 'is-locked' : ''}`}
              disabled={!isReachable}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="reg-step-circle">
                {isCompleted ? <Check size={16} strokeWidth={3} /> : <Icon size={16} />}
              </span>
              <span className="reg-step-label">{step.label}</span>
              {index < stepList.length - 1 && <span className="reg-step-line" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
