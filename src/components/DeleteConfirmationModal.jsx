import { Trash2, X } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'

function DeleteConfirmationModal({
  isOpen,
  isDeleting = false,
  onCancel,
  onConfirm,
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <button
          type="button"
          className="icon-button modal__close"
          onClick={onCancel}
          aria-label="Close delete confirmation"
        >
          <X size={18} aria-hidden="true" />
        </button>
        <div className="modal__icon modal__icon--danger" aria-hidden="true">
          <Trash2 size={24} />
        </div>
        <h2 id="delete-modal-title">Delete this recipe?</h2>
        <p>This removes the recipe and its comments from RecipeShare.</p>
        <div className="modal__actions">
          <button type="button" className="button button--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="button button--danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? <LoadingSpinner label="Deleting recipe" /> : null}
            Delete
          </button>
        </div>
      </section>
    </div>
  )
}

export default DeleteConfirmationModal
