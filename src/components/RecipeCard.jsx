import { Clock, Heart } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import Badge from './Badge'
import { formatNumber, formatRelativeTime } from '../utils/formatters'

function RecipeCard({ recipe, index }) {
  const cardShape = ['standard', 'tall', 'compact'][index % 3]
  const [imageFailed, setImageFailed] = useState(false)
  const showCoverImage = recipe.image_url && !imageFailed

  return (
    <article className={`recipe-card recipe-card--${cardShape}`}>
      <Link to={`/post/${recipe.id}`} className="recipe-card__link">
        <div
          className={`recipe-card__cover ${
            showCoverImage ? 'recipe-card__cover--image' : 'recipe-card__cover--fallback'
          }`}
          aria-hidden="true"
        >
          {showCoverImage ? (
            <img
              src={recipe.image_url}
              alt=""
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          ) : null}
        </div>

        <div className="recipe-card__badges">
          {recipe.cuisine ? <Badge variant="cuisine">{recipe.cuisine}</Badge> : null}
          {recipe.meal_type ? (
            <Badge variant="meal">{recipe.meal_type}</Badge>
          ) : null}
        </div>

        <h2>{recipe.title}</h2>

        <div className="recipe-card__meta">
          <span>
            <Clock size={16} aria-hidden="true" />
            {formatRelativeTime(recipe.created_at)}
          </span>
          <span>
            <Heart size={16} aria-hidden="true" />
            {formatNumber(recipe.upvotes)}
          </span>
        </div>
      </Link>
    </article>
  )
}

export default RecipeCard
