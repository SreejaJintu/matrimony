import { Header } from '../Layout/Header'
import { RegistrationStepper } from './RegistrationStepper'
import { RegistrationBenefits } from './RegistrationBenefits'
import { TrustStrip } from '../../pages/TrustStrip'

export function RegistrationShell({ 
  currentStep, 
  title, 
  subtitle, 
  steps, 
  children, 
  error, 
  onStepChange, 
  mode = 'create',
  hideHeader = false,
  hideTrustStrip = false,
  eyebrow = 'START YOUR JOURNEY'
}) {
  return (
    <div className={`page reg-page ${mode === 'admin-edit' ? 'admin-edit-mode' : ''}`}>
      {!hideHeader && <Header />}

      <section className="reg-hero">
        <div className="container">
          {eyebrow && <p className="reg-eyebrow">{eyebrow}</p>}
          <h1 className="reg-title">{title}</h1>
          {subtitle ? <p className="reg-subtitle">{subtitle}</p> : null}
        </div>
      </section>

      <section className="reg-main">
        <div className="container reg-main-grid">
          <div className="reg-card">
            <RegistrationStepper currentStep={currentStep} onStepChange={onStepChange ?? (() => {})} steps={steps} mode={mode} />
            {error ? <div className="reg-error-banner">{error}</div> : null}
            <div className="reg-card-body">{children}</div>
          </div>

          <RegistrationBenefits />
        </div>
      </section>

      {!hideTrustStrip && <TrustStrip />}
    </div>
  )
}
