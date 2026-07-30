import { useState } from 'react'
import { useNavigate } from 'react-router'
import RecipeForm from '../components/RecipeForm'
import { createRecipe } from '../services/recipeService'

function CreateRecipe() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  async function handleCreate(recipeValues) {
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const newRecipe = await createRecipe(recipeValues)
      navigate(`/post/${newRecipe.id}`)
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="form-page">
      <header className="page-header">
        <p className="eyebrow">Publish</p>
        <h1>Create Recipe</h1>
        <p>Add the recipe details once, then let the community discuss and upvote it.</p>
      </header>

      <RecipeForm
        mode="create"
        isSubmitting={isSubmitting}
        submitError={submitError}
        onSubmit={handleCreate}
      />
    </div>
  )
}

export default CreateRecipe
