import { KeyRound, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import LoadingSpinner from './LoadingSpinner'

function SecretKeyModal({
  isOpen,
  title,
  description,
  errorMessage,
  isSubmitting = false,
  onClose,
  onConfirm,
}) {
  const [secretKey, setSecretKey] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  function handleSubmit(event) {
    event.preventDefault()
    const submittedKey = secretKey
    setSecretKey('')
    onConfirm(submittedKey)
  }

  function handleClose() {
    setSecretKey('')
    onClose()
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="secret-key-title"
      >
        <button
          type="button"
          className="icon-button modal__close"
          onClick={handleClose}
          aria-label="Close secret key modal"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="modal__icon" aria-hidden="true">
          <KeyRound size={24} />
        </div>
        <h2 id="secret-key-title">{title}</h2>
        <p>{description}</p>

        <form className="modal__form" onSubmit={handleSubmit}>
          <label htmlFor="secret-key">Secret Key</label>
          <input
            id="secret-key"
            ref={inputRef}
            type="password"
            value={secretKey}
            onChange={(event) => setSecretKey(event.target.value)}
            placeholder="Enter the recipe secret key"
            required
          />
          {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
          <div className="modal__actions">
            <button type="button" className="button button--ghost" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="button button--primary">
              {isSubmitting ? <LoadingSpinner label="Checking secret key" /> : null}
              Continue
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default SecretKeyModal
