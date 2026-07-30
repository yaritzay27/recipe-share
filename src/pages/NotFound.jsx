import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

function NotFound() {
  return (
    <section className="not-found">
      <p className="eyebrow">404</p>
      <h1>That recipe is off the menu.</h1>
      <p>The page you are looking for does not exist in RecipeShare.</p>
      <Link to="/" className="button button--primary">
        <ArrowLeft size={18} aria-hidden="true" />
        Back to Feed
      </Link>
    </section>
  )
}

export default NotFound
