import { useEffect, useState } from 'react'
import { fetchRecipes } from '../services/recipeService'

export function useRecipes({
  searchTerm,
  sortBy,
  cuisineFilter,
  mealTypeFilter,
}) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadRecipes() {
      setLoading(true)
      setError('')

      try {
        const recipesData = await fetchRecipes({
          searchTerm,
          sortBy,
          cuisineFilter,
          mealTypeFilter,
        })

        if (isMounted) {
          setRecipes(recipesData)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message)
          setRecipes([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadRecipes()

    return () => {
      isMounted = false
    }
  }, [searchTerm, sortBy, cuisineFilter, mealTypeFilter])

  return { recipes, loading, error }
}

