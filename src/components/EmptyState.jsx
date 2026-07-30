import { ChefHat, PlusCircle } from 'lucide-react'
import { Link } from 'react-router'

function EmptyState({
  title = 'No recipes yet',
  message = 'Start the community with a recipe worth bookmarking.',
  actionLabel = 'Create Recipe',
  actionTo = '/create',
}) {
  return (
    <section className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        <ChefHat size={34} />
      </div>
      <h2>{title}</h2>
      <p>{message}</p>
      {actionLabel && actionTo ? (
        <Link to={actionTo} className="button button--primary">
          <PlusCircle size={18} aria-hidden="true" />
          {actionLabel}
        </Link>
      ) : null}
    </section>
  )
}

export default EmptyState
