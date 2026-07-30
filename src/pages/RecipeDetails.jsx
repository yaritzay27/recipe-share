import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Edit3,
  Flame,
  Heart,
  ImageOff,
  Trash2,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Badge from '../components/Badge'
import CommentSection from '../components/CommentSection'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import EmptyState from '../components/EmptyState'
import LoadingSpinner from '../components/LoadingSpinner'
import SecretKeyModal from '../components/SecretKeyModal'
import {
  deleteRecipe,
  fetchRecipeById,
  upvoteRecipe,
} from '../services/recipeService'
import {
  formatDate,
  formatNumber,
  splitLines,
  totalCookTime,
} from '../utils/formatters'

function DetailList({ title, items, emptyText }) {
  return (
    <section className="content-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{title}</p>
          <h2>{title}</h2>
        </div>
      </div>
      {items.length ? (
        <ol className="recipe-list">
          {items.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ol>
      ) : (
        <p className="muted">{emptyText}</p>
      )}
    </section>
  )
}

function RecipeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [upvoteError, setUpvoteError] = useState('')
  const [isUpvoting, setIsUpvoting] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const [secretAction, setSecretAction] = useState(null)
  const [secretError, setSecretError] = useState('')
  const [deleteSecretKey, setDeleteSecretKey] = useState('')
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadRecipe() {
      setLoading(true)
      setPageError('')

      try {
        const recipeData = await fetchRecipeById(id)
        if (isMounted) {
          setRecipe(recipeData)
        }
      } catch (error) {
        if (isMounted) {
          setPageError(error.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadRecipe()

    return () => {
      isMounted = false
    }
  }, [id])

  async function handleUpvote() {
    setIsUpvoting(true)
    setUpvoteError('')

    try {
      const updatedRecipe = await upvoteRecipe(recipe.id, recipe.upvotes || 0)
      setRecipe(updatedRecipe)
    } catch (error) {
      setUpvoteError(error.message)
    } finally {
      setIsUpvoting(false)
    }
  }

  function openSecretModal(action) {
    setSecretAction(action)
    setSecretError('')
  }

  function closeSecretModal() {
    setSecretAction(null)
    setSecretError('')
  }

  function handleSecretConfirm(secretKey) {
    if (secretKey.trim() !== recipe?.secret_key) {
      setSecretError('That secret key does not match this recipe.')
      return
    }

    if (secretAction === 'edit') {
      navigate(`/edit/${recipe.id}`, { state: { secretKey: secretKey.trim() } })
      return
    }

    if (secretAction === 'delete') {
      setDeleteSecretKey(secretKey.trim())
      closeSecretModal()
      setShowDeleteConfirmation(true)
    }
  }

  async function handleDelete() {
    setIsDeleting(true)

    try {
      await deleteRecipe(recipe.id, deleteSecretKey)
      navigate('/')
    } catch (error) {
      setSecretError(error.message)
      setShowDeleteConfirmation(false)
      setSecretAction('delete')
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="skeleton detail-loading__image" />
        <div className="detail-loading__copy">
          <div className="skeleton skeleton--title" />
          <div className="skeleton skeleton--title skeleton--title-short" />
          <div className="skeleton skeleton--meta" />
        </div>
      </div>
    )
  }

  if (pageError) {
    return <EmptyState title="Recipe unavailable" message={pageError} />
  }

  if (!recipe) {
    return (
      <EmptyState
        title="Recipe not found"
        message="This recipe may have been deleted."
        actionLabel="Back to Feed"
        actionTo="/"
      />
    )
  }

  const ingredientLines = splitLines(recipe.ingredients)
  const instructionLines = splitLines(recipe.instructions)
  const showImage = recipe.image_url && !imageFailed

  return (
    <article className="detail-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={17} aria-hidden="true" />
        Back to feed
      </Link>

      <section className="detail-hero">
        <div className="recipe-media">
          {showImage ? (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="recipe-media__fallback">
              <ImageOff size={38} aria-hidden="true" />
              <p>Image unavailable</p>
            </div>
          )}
        </div>

        <div className="detail-summary">
          <div className="detail-summary__badges">
            {recipe.cuisine ? <Badge variant="cuisine">{recipe.cuisine}</Badge> : null}
            {recipe.meal_type ? (
              <Badge variant="meal">{recipe.meal_type}</Badge>
            ) : null}
            {recipe.difficulty ? (
              <Badge variant="difficulty">{recipe.difficulty}</Badge>
            ) : null}
          </div>

          <h1>{recipe.title}</h1>
          <p className="detail-description">
            {recipe.description || 'No description was added for this recipe.'}
          </p>

          <div className="detail-stats">
            <span>
              <Clock size={17} aria-hidden="true" />
              {totalCookTime(recipe) ? `${totalCookTime(recipe)} min total` : 'Time open'}
            </span>
            <span>
              <Users size={17} aria-hidden="true" />
              {recipe.servings ? `${recipe.servings} servings` : 'Servings open'}
            </span>
            <span>
              <CalendarDays size={17} aria-hidden="true" />
              {formatDate(recipe.created_at)}
            </span>
          </div>

          <div className="detail-actions">
            <button
              type="button"
              className="button button--primary"
              onClick={handleUpvote}
              disabled={isUpvoting}
            >
              {isUpvoting ? (
                <LoadingSpinner label="Adding upvote" />
              ) : (
                <Heart size={18} aria-hidden="true" />
              )}
              {formatNumber(recipe.upvotes)} Upvotes
            </button>
            <button
              type="button"
              className="button button--ghost"
              onClick={() => openSecretModal('edit')}
            >
              <Edit3 size={17} aria-hidden="true" />
              Edit
            </button>
            <button
              type="button"
              className="button button--danger-ghost"
              onClick={() => openSecretModal('delete')}
            >
              <Trash2 size={17} aria-hidden="true" />
              Delete
            </button>
          </div>

          {upvoteError ? <p className="form-error">{upvoteError}</p> : null}
        </div>
      </section>

      <section className="quick-facts" aria-label="Recipe timing">
        <div>
          <Clock size={18} aria-hidden="true" />
          <span>Prep</span>
          <strong>{recipe.prep_time ? `${recipe.prep_time} min` : 'Open'}</strong>
        </div>
        <div>
          <Flame size={18} aria-hidden="true" />
          <span>Cook</span>
          <strong>{recipe.cook_time ? `${recipe.cook_time} min` : 'Open'}</strong>
        </div>
        <div>
          <Users size={18} aria-hidden="true" />
          <span>Serves</span>
          <strong>{recipe.servings || 'Open'}</strong>
        </div>
      </section>

      <div className="detail-grid">
        <DetailList
          title="Ingredients"
          items={ingredientLines}
          emptyText="No ingredients were added."
        />
        <DetailList
          title="Instructions"
          items={instructionLines}
          emptyText="No instructions were added."
        />
      </div>

      <CommentSection recipeId={recipe.id} />

      <SecretKeyModal
        isOpen={Boolean(secretAction)}
        title={secretAction === 'edit' ? 'Edit recipe' : 'Delete recipe'}
        description="Enter the secret key that was set when this recipe was created."
        errorMessage={secretError}
        onClose={closeSecretModal}
        onConfirm={handleSecretConfirm}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteConfirmation}
        isDeleting={isDeleting}
        onCancel={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDelete}
      />
    </article>
  )
}

export default RecipeDetails
