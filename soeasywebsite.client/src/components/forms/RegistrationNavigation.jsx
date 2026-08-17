export function RegistrationNavigation({
  onPrevious,
  onContinue,
  previousLabel = 'Previous',
  continueLabel = 'Save & Continue',
  isContinueDisabled = false,
  continueType = 'submit',
}) {
  return (
    <div className="reg-actions">
      <button type="button" className="reg-btn reg-btn-ghost" onClick={onPrevious}>
        {previousLabel}
      </button>
      <button
        type={continueType}
        className="reg-btn reg-btn-primary"
        onClick={continueType === 'button' ? onContinue : undefined}
        disabled={isContinueDisabled}
      >
        {continueLabel} <span aria-hidden="true">→</span>
      </button>
    </div>
  )
}
