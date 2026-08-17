import { Header } from '../Layout/Header'
import { RegistrationStepper } from './RegistrationStepper'
import { RegistrationBenefits } from './RegistrationBenefits'
import { TrustStrip } from '../../pages/TrustStrip'

export function RegistrationShell({ currentStep, title, subtitle, steps, children, error, onStepChange, mode = 'create' }) {
  return (
    <div className="page reg-page">
      <Header />

      <section className="reg-hero">
        <div className="container">
          <p className="reg-eyebrow">START YOUR JOURNEY</p>
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

      <TrustStrip />
    </div>
  )
}
