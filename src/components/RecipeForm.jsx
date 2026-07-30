import { Image, KeyRound, Save, Utensils } from 'lucide-react'
import { useState } from 'react'
import {
  cuisineOptions,
  difficultyOptions,
  mealTypeOptions,
} from '../utils/options'
import LoadingSpinner from './LoadingSpinner'

const emptyRecipe = {
  title: '',
  description: '',
  ingredients: '',
  instructions: '',
  image_url: '',
  prep_time: '',
  cook_time: '',
  servings: '',
  cuisine: '',
  meal_type: '',
  difficulty: 'Easy',
  secret_key: '',
}

function fieldValue(value) {
  return value === null || value === undefined ? '' : String(value)
}

function buildFormValues(recipe) {
  if (!recipe) {
    return emptyRecipe
  }

  return {
    title: fieldValue(recipe.title),
    description: fieldValue(recipe.description),
    ingredients: fieldValue(recipe.ingredients),
    instructions: fieldValue(recipe.instructions),
    image_url: fieldValue(recipe.image_url),
    prep_time: fieldValue(recipe.prep_time),
    cook_time: fieldValue(recipe.cook_time),
    servings: fieldValue(recipe.servings),
    cuisine: fieldValue(recipe.cuisine),
    meal_type: fieldValue(recipe.meal_type),
    difficulty: fieldValue(recipe.difficulty) || 'Easy',
    secret_key: fieldValue(recipe.secret_key),
  }
}

function RecipeForm({
  initialRecipe,
  mode = 'create',
  isSubmitting = false,
  submitError = '',
  onSubmit,
}) {
  const [values, setValues] = useState(buildFormValues(initialRecipe))
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target
    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }))
  }

  function validate() {
    const nextErrors = {}

    if (!values.title.trim()) {
      nextErrors.title = 'Recipe title is required.'
    }

    if (!values.secret_key.trim()) {
      nextErrors.secret_key = 'A secret key is required for edits and deletion.'
    }

    if (values.image_url && !/^https?:\/\//i.test(values.image_url)) {
      nextErrors.image_url = 'Use a full image URL that starts with http or https.'
    }

    for (const field of ['prep_time', 'cook_time', 'servings']) {
      if (values[field] && Number(values[field]) < 0) {
        nextErrors[field] = 'Use zero or a positive number.'
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!validate()) {
      return
    }

    onSubmit(values)
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <section className="form-section">
        <div className="form-section__heading">
          <Utensils size={20} aria-hidden="true" />
          <div>
            <p className="eyebrow">Recipe</p>
            <h2>{mode === 'edit' ? 'Update the recipe' : 'Create a new recipe'}</h2>
          </div>
        </div>

        <div className="field-grid">
          <label className="field field--full">
            <span>Recipe Title *</span>
            <input
              name="title"
              value={values.title}
              onChange={handleChange}
              placeholder="Brown butter miso cookies"
            />
            {errors.title ? <span className="field-error">{errors.title}</span> : null}
          </label>

          <label className="field field--full">
            <span>Description</span>
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder="What makes this recipe worth sharing?"
              rows="4"
            />
          </label>

          <label className="field field--full">
            <span>Ingredients</span>
            <textarea
              name="ingredients"
              value={values.ingredients}
              onChange={handleChange}
              placeholder="List ingredients on separate lines"
              rows="6"
            />
          </label>

          <label className="field field--full">
            <span>Instructions</span>
            <textarea
              name="instructions"
              value={values.instructions}
              onChange={handleChange}
              placeholder="Write the cooking steps"
              rows="7"
            />
          </label>
        </div>
      </section>

      <section className="form-section">
        <div className="form-section__heading">
          <Image size={20} aria-hidden="true" />
          <div>
            <p className="eyebrow">Details</p>
            <h2>Timing and tags</h2>
          </div>
        </div>

        <div className="field-grid">
          <label className="field field--full">
            <span>External Image URL</span>
            <input
              name="image_url"
              value={values.image_url}
              onChange={handleChange}
              placeholder="https://example.com/recipe-photo.jpg"
            />
            {errors.image_url ? (
              <span className="field-error">{errors.image_url}</span>
            ) : null}
          </label>

          <label className="field">
            <span>Prep Time</span>
            <input
              name="prep_time"
              type="number"
              min="0"
              value={values.prep_time}
              onChange={handleChange}
              placeholder="15"
            />
            {errors.prep_time ? (
              <span className="field-error">{errors.prep_time}</span>
            ) : null}
          </label>

          <label className="field">
            <span>Cook Time</span>
            <input
              name="cook_time"
              type="number"
              min="0"
              value={values.cook_time}
              onChange={handleChange}
              placeholder="30"
            />
            {errors.cook_time ? (
              <span className="field-error">{errors.cook_time}</span>
            ) : null}
          </label>

          <label className="field">
            <span>Servings</span>
            <input
              name="servings"
              type="number"
              min="0"
              value={values.servings}
              onChange={handleChange}
              placeholder="4"
            />
            {errors.servings ? (
              <span className="field-error">{errors.servings}</span>
            ) : null}
          </label>

          <label className="field">
            <span>Cuisine</span>
            <select name="cuisine" value={values.cuisine} onChange={handleChange}>
              <option value="">Select cuisine</option>
              {cuisineOptions.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Meal Type</span>
            <select name="meal_type" value={values.meal_type} onChange={handleChange}>
              <option value="">Select meal type</option>
              {mealTypeOptions.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Difficulty</span>
            <select
              name="difficulty"
              value={values.difficulty}
              onChange={handleChange}
            >
              {difficultyOptions.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="form-section">
        <div className="form-section__heading">
          <KeyRound size={20} aria-hidden="true" />
          <div>
            <p className="eyebrow">Access</p>
            <h2>Secret key</h2>
          </div>
        </div>

        <label className="field field--full">
          <span>Secret Key *</span>
          <input
            name="secret_key"
            type="password"
            value={values.secret_key}
            onChange={handleChange}
            placeholder="Choose a key you can remember"
          />
          {errors.secret_key ? (
            <span className="field-error">{errors.secret_key}</span>
          ) : null}
        </label>
      </section>

      {submitError ? <p className="form-error">{submitError}</p> : null}

      <div className="form-actions">
        <button
          type="submit"
          className="button button--primary button--large"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <LoadingSpinner label="Saving recipe" />
          ) : (
            <Save size={18} aria-hidden="true" />
          )}
          {mode === 'edit' ? 'Save Changes' : 'Publish Recipe'}
        </button>
      </div>
    </form>
  )
}

export default RecipeForm
