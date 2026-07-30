import { Filter } from 'lucide-react'
import { useMemo, useState } from 'react'
import RecipeFeed from '../components/RecipeFeed'
import SearchBar from '../components/SearchBar'
import SortDropdown from '../components/SortDropdown'
import { useRecipes } from '../hooks/useRecipes'
import { cuisineOptions, mealTypeOptions } from '../utils/options'

function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [cuisineFilter, setCuisineFilter] = useState('all')
  const [mealTypeFilter, setMealTypeFilter] = useState('all')
  const { recipes, loading, error } = useRecipes({
    searchTerm,
    sortBy,
    cuisineFilter,
    mealTypeFilter,
  })

  const activeFilterCount = useMemo(
    () =>
      [cuisineFilter !== 'all', mealTypeFilter !== 'all'].filter(Boolean).length,
    [cuisineFilter, mealTypeFilter],
  )

  return (
    <div className="home-page">
      <section className="home-hero">
        <div>
          <p className="eyebrow">Recipe forum</p>
          <h1>RecipeShare</h1>
          <p>
            A visual community board for recipes people test, tweak, discuss,
            and upvote.
          </p>
        </div>
        <div className="home-hero__stats" aria-label="Feed summary">
          <span>{loading ? '...' : recipes.length}</span>
          <p>{recipes.length === 1 ? 'recipe' : 'recipes'}</p>
        </div>
      </section>

      <section className="toolbar" aria-label="Feed controls">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <SortDropdown value={sortBy} onChange={setSortBy} />

        <label className="select-control">
          <Filter size={17} aria-hidden="true" />
          <span className="sr-only">Filter by cuisine</span>
          <select
            value={cuisineFilter}
            onChange={(event) => setCuisineFilter(event.target.value)}
          >
            <option value="all">All cuisines</option>
            {cuisineOptions.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="select-control">
          <Filter size={17} aria-hidden="true" />
          <span className="sr-only">Filter by meal type</span>
          <select
            value={mealTypeFilter}
            onChange={(event) => setMealTypeFilter(event.target.value)}
          >
            <option value="all">All meals</option>
            {mealTypeOptions.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        {activeFilterCount ? (
          <button
            type="button"
            className="button button--ghost"
            onClick={() => {
              setCuisineFilter('all')
              setMealTypeFilter('all')
            }}
          >
            Clear filters
          </button>
        ) : null}
      </section>

      <RecipeFeed recipes={recipes} loading={loading} error={error} />
    </div>
  )
}

export default Home

