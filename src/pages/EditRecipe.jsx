import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import EmptyState from '../components/EmptyState'
import LoadingSpinner from '../components/LoadingSpinner'
import RecipeForm from '../components/RecipeForm'
import SecretKeyModal from '../components/SecretKeyModal'
import { fetchRecipeById, updateRecipe } from '../services/recipeService'

function EditRecipe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [unlockSecret, setUnlockSecret] = useState('')
  const [secretError, setSecretError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const incomingSecret = location.state?.secretKey || ''

  useEffect(() => {
    let isMounted = true

    async function loadRecipe() {
      setLoading(true)
      setPageError('')

      try {
        const recipeData = await fetchRecipeById(id)
        if (isMounted) {
          setRecipe(recipeData)
          if (recipeData && incomingSecret === recipeData.secret_key) {
            setUnlocked(true)
            setUnlockSecret(incomingSecret)
          }
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
  }, [id, incomingSecret])

  function handleSecretConfirm(secretKey) {
    if (secretKey.trim() !== recipe?.secret_key) {
      setSecretError('That secret key does not match this recipe.')
      return
    }

    setSecretError('')
    setUnlocked(true)
    setUnlockSecret(secretKey.trim())
  }

  async function handleUpdate(recipeValues) {
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const updatedRecipe = await updateRecipe(id, recipeValues, unlockSecret)
      navigate(`/post/${updatedRecipe.id}`)
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="center-panel">
        <LoadingSpinner label="Loading recipe editor" />
        <p>Loading editor</p>
      </div>
    )
  }

  if (pageError) {
    return <EmptyState title="Editor unavailable" message={pageError} />
  }

  if (!recipe) {
    return (
      <EmptyState
        title="Recipe not found"
        message="The recipe you want to edit is not available."
        actionLabel="Back to Feed"
        actionTo="/"
      />
    )
  }

  return (
    <div className="form-page">
      <Link to={`/post/${id}`} className="back-link">
        <ArrowLeft size={17} aria-hidden="true" />
        Back to recipe
      </Link>

      <header className="page-header">
        <p className="eyebrow">Edit</p>
        <h1>{recipe.title}</h1>
        <p>Make changes to the recipe, tags, image, or secret key.</p>
      </header>

      {unlocked ? (
        <RecipeForm
          mode="edit"
          initialRecipe={recipe}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onSubmit={handleUpdate}
        />
      ) : (
        <section className="locked-panel">
          <h2>Secret key required</h2>
          <p>Only the original creator can edit this recipe.</p>
        </section>
      )}

      <SecretKeyModal
        isOpen={!unlocked}
        title="Unlock editing"
        description="Enter the secret key that was set when this recipe was created."
        errorMessage={secretError}
        onClose={() => navigate(`/post/${id}`)}
        onConfirm={handleSecretConfirm}
      />
    </div>
  )
}

export default EditRecipe
